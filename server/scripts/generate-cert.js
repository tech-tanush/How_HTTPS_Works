import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const certDir = path.resolve(__dirname, '../cert');
const keyPath = path.join(certDir, 'server.key');
const certPath = path.join(certDir, 'server.cert');

export function ensureCertificates(force = false) {
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  const certsExist = fs.existsSync(keyPath) && fs.existsSync(certPath);

  if (certsExist && !force) {
    console.log('[Certificates] Existing certificates found:');
    console.log(`  Key:  ${keyPath}`);
    console.log(`  Cert: ${certPath}`);
    return { keyPath, certPath, generated: false };
  }

  console.log('[Certificates] Generating self-signed TLS certificate with OpenSSL...');
  console.log('  Subject Alternative Names (SAN): DNS:localhost, IP:127.0.0.1, IP:::1');

  try {
    const cmd = `openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 365 -keyout "${keyPath}" -out "${certPath}" -subj "/C=US/ST=Local/L=Localhost/O=HTTPS Educational Demo/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log('[Certificates] Successfully generated TLS certificate & private key.');
    return { keyPath, certPath, generated: true };
  } catch (error) {
    console.error('[Certificates] OpenSSL generation failed. Error details:', error.message);
    throw new Error(
      'Failed to generate certificate with OpenSSL. Please ensure OpenSSL is installed and available in PATH, or run scripts/generate-cert.ps1 directly.'
    );
  }
}

// Allow direct CLI execution: node generate-cert.js [--force]
if (process.argv[1] && process.argv[1].endsWith('generate-cert.js')) {
  const force = process.argv.includes('--force');
  try {
    ensureCertificates(force);
  } catch (err) {
    process.exit(1);
  }
}
