import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { ensureCertificates } from './scripts/generate-cert.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const CERT_DIR = path.resolve(__dirname, 'cert');
const KEY_PATH = path.join(CERT_DIR, 'server.key');
const CERT_PATH = path.join(CERT_DIR, 'server.cert');

const app = express();

// Configure CORS narrowly for local frontend development origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://localhost:5173',
  'https://127.0.0.1:5173',
  'http://localhost:3000',
  'https://localhost:3443',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl, Postman, mobile apps, same-origin)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost:[0-9]+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:[0-9]+$/.test(origin) ||
        /^https:\/\/localhost:[0-9]+$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Enforce reasonable JSON body limit (10KB) to prevent resource exhaustion
app.use(express.json({ limit: '10kb' }));

// Custom JSON syntax error handler middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON payload format.',
      details: err.message,
      isTls: Boolean(req.socket?.encrypted),
    });
  }
  next();
});

// Helper function to extract transport security metadata strictly from the TLS socket state
function getTransportMetadata(req) {
  const isEncrypted = Boolean(req.socket && req.socket.encrypted);
  const cipher = isEncrypted && typeof req.socket.getCipher === 'function' ? req.socket.getCipher() : null;
  const protocol = isEncrypted && typeof req.socket.getProtocol === 'function' ? req.socket.getProtocol() : null;

  return {
    isTls: isEncrypted,
    transport: isEncrypted ? 'TLS (Transport Layer Security)' : 'Unencrypted Plaintext (Cleartext TCP)',
    protocol: isEncrypted ? protocol || 'TLS (Negotiated)' : 'HTTP/1.1 (No TLS)',
    cipher: cipher ? {
      name: cipher.name,
      standardName: cipher.standardName || cipher.name,
      version: cipher.version || protocol,
    } : null,
    remoteAddress: req.socket.remoteAddress || req.ip,
    localPort: req.socket.localPort,
  };
}

// 1. Health check endpoint: GET /api/health
app.get('/api/health', (req, res) => {
  const meta = getTransportMetadata(req);
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    ...meta,
    message: meta.isTls
      ? 'Connection is secured via TLS on the active socket.'
      : 'Connection is unencrypted HTTP at the transport layer.',
  });
});

// 2. Demo GET endpoint: GET /api/demo
app.get('/api/demo', (req, res) => {
  const meta = getTransportMetadata(req);
  res.json({
    status: 'success',
    endpoint: '/api/demo',
    method: 'GET',
    ...meta,
    sampleData: {
      accountStatus: 'Active',
      demoSessionId: 'demo_' + Math.random().toString(36).substring(2, 9),
      serviceName: 'HTTPS Technical Demonstration API',
    },
    educationalNote: meta.isTls
      ? 'CONFIDENTIALITY & INTEGRITY ACTIVE: All HTTP headers, path queries, and this response payload were encrypted in transit using symmetric session keys derived during the TLS handshake.'
      : 'INSECURE TRANSMISSION: This response traveled as cleartext across the network. A network observer using Wireshark can read every byte of these headers and body.',
  });
});

// 3. Demo POST endpoint: POST /api/demo
app.post('/api/demo', (req, res) => {
  const meta = getTransportMetadata(req);
  const { message } = req.body || {};

  // Validate message
  if (typeof message !== 'string') {
    return res.status(400).json({
      error: 'Bad Request: "message" field must be a valid string.',
      receivedBody: req.body,
      ...meta,
    });
  }

  // Enforce reasonable message length
  if (message.length > 500) {
    return res.status(400).json({
      error: 'Message exceeds maximum allowed length of 500 characters.',
      ...meta,
    });
  }

  // Educational sanity warning for sensitive credentials
  const looksLikePassword = /password|secret|creditcard|pin|token/i.test(message);

  res.json({
    status: 'success',
    endpoint: '/api/demo',
    method: 'POST',
    ...meta,
    echo: {
      receivedMessage: message,
      characterCount: message.length,
      bytes: Buffer.byteLength(message, 'utf8'),
    },
    securityAnalysis: {
      confidentiality: meta.isTls
        ? 'Protected: Eavesdroppers only see encrypted TLS records.'
        : 'EXPOSED: Cleartext message visible to anyone sniffing network packets.',
      integrity: meta.isTls
        ? 'Protected: Authenticated Encryption with Associated Data (AEAD) prevents in-transit tampering.'
        : 'VULNERABLE: A man-in-the-middle attacker could modify this message in flight without detection.',
      serverAuthentication: meta.isTls
        ? 'Verified: You verified the server identity against its presented certificate.'
        : 'NONE: No certificate presented. Cannot verify who answered this request.',
    },
    educationalNotice: looksLikePassword
      ? 'Educational Tip: Always use placeholder text for demos. Never input actual personal credentials!'
      : 'Safe demo message processed successfully.',
  });
});

// Helper function to safely serialize asymmetric key details without BigInt serialization errors
function serializeKeyDetails(details) {
  if (!details || typeof details !== 'object') return null;
  const result = {};
  for (const [key, value] of Object.entries(details)) {
    if (typeof value === 'bigint') {
      result[key] = value.toString();
    } else if (value && typeof value === 'object') {
      result[key] = serializeKeyDetails(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// Helper to parse X509 DN string (e.g. "C=US\nST=Demo\nO=HTTPS Demo\nCN=localhost") into an object
function parseDistinguishedName(dnString) {
  if (!dnString) return {};
  const entries = dnString.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
  const map = {};
  for (const entry of entries) {
    const idx = entry.indexOf('=');
    if (idx !== -1) {
      const key = entry.slice(0, idx).trim();
      const val = entry.slice(idx + 1).trim();
      map[key] = val;
    }
  }
  return map;
}

// 4. Certificate inspection endpoint: GET /api/certificate
app.get('/api/certificate', (req, res) => {
  try {
    if (!fs.existsSync(CERT_PATH)) {
      return res.status(404).json({
        error: 'Certificate file not found.',
        path: CERT_PATH,
      });
    }

    const certRaw = fs.readFileSync(CERT_PATH, 'utf8');
    const x509 = new crypto.X509Certificate(certRaw);

    // Extract SAN list cleanly
    const sanList = x509.subjectAltName
      ? x509.subjectAltName.split(',').map((s) => s.trim())
      : [];

    const isSelfSigned = x509.issuer === x509.subject;
    const parsedSubject = parseDistinguishedName(x509.subject);
    const parsedIssuer = parseDistinguishedName(x509.issuer);

    res.json({
      status: 'success',
      certificate: {
        subject: x509.subject,
        issuer: x509.issuer,
        parsedSubject,
        parsedIssuer,
        validFrom: x509.validFrom,
        validTo: x509.validTo,
        fingerprint256: x509.fingerprint256,
        serialNumber: x509.serialNumber,
        subjectAltName: sanList,
        keyAlgorithm: x509.publicKey.asymmetricKeyType,
        keyDetails: serializeKeyDetails(x509.publicKey.asymmetricKeyDetails),
        isSelfSigned,
        keyUsage: x509.keyUsage || ['Digital Signature', 'Key Encipherment'],
        rawPemLength: certRaw.length,
      },
      trustChainExplanation: {
        type: isSelfSigned ? 'Self-Signed Development Certificate' : 'CA-Signed Certificate',
        whyBrowserWarns: isSelfSigned
          ? 'Because this certificate was issued by itself (Issuer == Subject) and is not pre-installed in your Operating System or Browser Trusted Root CA store, browsers flag it as untrusted (NET::ERR_CERT_AUTHORITY_INVALID).'
          : 'Certificate is signed by a recognized Certificate Authority chain.',
        productionVsLocal:
          'In production, public CAs like Let’s Encrypt, DigiCert, or Google Trust Services issue certificates trusted automatically by all major browsers. Locally, developers use self-signed certificates or tools like mkcert.',
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to inspect certificate.',
      details: error.message,
    });
  }
});

// Root informational endpoint
app.get('/', (req, res) => {
  const meta = getTransportMetadata(req);
  res.json({
    project: 'How HTTPS Works - Educational Demonstration Backend',
    transport: meta.transport,
    isTls: meta.isTls,
    endpoints: [
      'GET  /api/health      - Server health and TLS socket state',
      'GET  /api/demo        - Sample GET request demonstration',
      'POST /api/demo        - Echo POST with transport analysis',
      'GET  /api/certificate - Parsed server certificate details',
    ],
    ports: {
      http: HTTP_PORT,
      https: HTTPS_PORT,
    },
  });
});

// Ensure certificates exist before launching servers
try {
  ensureCertificates();
} catch (err) {
  console.warn('[Warning] Could not auto-generate certificates. Checking existing files...');
}

// Start HTTP Server
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, () => {
  console.log(`[HTTP Server]  Listening on http://localhost:${HTTP_PORT}`);
  console.log(`               Transport: Unencrypted Plaintext`);
});

// Start HTTPS Server
if (fs.existsSync(KEY_PATH) && fs.existsSync(CERT_PATH)) {
  const sslOptions = {
    key: fs.readFileSync(KEY_PATH),
    cert: fs.readFileSync(CERT_PATH),
    // Support modern secure ciphers and TLS 1.2 / TLS 1.3
    minVersion: 'TLSv1.2',
  };

  const httpsServer = https.createServer(sslOptions, app);
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`[HTTPS Server] Listening on https://localhost:${HTTPS_PORT}`);
    console.log(`               Transport: TLS Encrypted (TLS 1.2 / TLS 1.3)`);
  });

  httpsServer.on('error', (err) => {
    console.error('[HTTPS Server Error]', err.message);
  });
} else {
  console.error('[HTTPS Server] Cannot start: Certificate or private key missing at:');
  console.error(`  Key:  ${KEY_PATH}`);
  console.error(`  Cert: ${CERT_PATH}`);
  console.error('Please run "npm run cert" to generate certificates.');
}

httpServer.on('error', (err) => {
  console.error('[HTTP Server Error]', err.message);
});
