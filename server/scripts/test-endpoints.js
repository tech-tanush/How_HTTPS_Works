import http from 'http';
import https from 'https';

console.log('====================================================');
console.log('  HTTPS Demonstration Server Endpoint Test Suite    ');
console.log('====================================================\n');

// Custom agent for HTTPS testing of local self-signed certificate.
// NOTE: rejectUnauthorized: false is used here ONLY for automated testing of our local
// self-signed certificate. In production applications, certificate validation must never be disabled.
const insecureAgent = new https.Agent({
  rejectUnauthorized: false,
});

function request(url, options = {}, bodyData = null) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https:');
    const client = isHttps ? https : http;

    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      agent: isHttps ? insecureAgent : undefined,
    };

    if (bodyData) {
      reqOptions.headers['Content-Type'] = 'application/json';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(bodyData);
    }

    const req = client.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, text: data });
        }
      });
    });

    req.on('error', reject);

    if (bodyData) {
      req.write(bodyData);
    }
    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(description, condition) {
    if (condition) {
      console.log(`  [PASS] ${description}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${description}`);
      failed++;
    }
  }

  try {
    console.log('Test 1: HTTP Server Health Check (Port 3000)');
    const httpHealth = await request('http://localhost:3000/api/health');
    assert('HTTP Health status is 200', httpHealth.status === 200);
    assert('HTTP isTls is FALSE (Cleartext)', httpHealth.data.isTls === false);
    assert('HTTP protocol mentions cleartext', httpHealth.data.transport.includes('Unencrypted'));

    console.log('\nTest 2: HTTPS Server Health Check (Port 3443)');
    const httpsHealth = await request('https://localhost:3443/api/health');
    assert('HTTPS Health status is 200', httpsHealth.status === 200);
    assert('HTTPS isTls is TRUE (TLS Encrypted)', httpsHealth.data.isTls === true);
    assert('HTTPS cipher is negotiated', httpsHealth.data.cipher && Boolean(httpsHealth.data.cipher.name));
    assert('HTTPS protocol is TLSv1.2 or TLSv1.3', httpsHealth.data.protocol.startsWith('TLS'));

    console.log('\nTest 3: POST /api/demo over HTTP vs HTTPS');
    const samplePayload = JSON.stringify({ message: 'College Project Demonstration Message' });

    const httpPost = await request('http://localhost:3000/api/demo', { method: 'POST' }, samplePayload);
    assert('HTTP POST status is 200', httpPost.status === 200);
    assert('HTTP POST reports isTls: false', httpPost.data.isTls === false);
    assert('HTTP POST reflects cleartext echo', httpPost.data.echo.receivedMessage === 'College Project Demonstration Message');

    const httpsPost = await request('https://localhost:3443/api/demo', { method: 'POST' }, samplePayload);
    assert('HTTPS POST status is 200', httpsPost.status === 200);
    assert('HTTPS POST reports isTls: true', httpsPost.data.isTls === true);
    assert('HTTPS POST returns security analysis', Boolean(httpsPost.data.securityAnalysis.confidentiality));

    console.log('\nTest 4: Certificate Inspection Endpoint (GET /api/certificate)');
    const certInfo = await request('http://localhost:3000/api/certificate');
    assert('Certificate endpoint status is 200', certInfo.status === 200);
    assert('Certificate has subjectAltName', Array.isArray(certInfo.data.certificate.subjectAltName));
    assert('Certificate includes localhost in SAN', certInfo.data.certificate.subjectAltName.some(s => s.includes('localhost')));
    assert('Certificate identified as self-signed', certInfo.data.certificate.isSelfSigned === true);

    console.log('\n----------------------------------------------------');
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('----------------------------------------------------');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('\n[Error Running Tests]:', error.message);
    console.error('Make sure the server is running on both port 3000 and port 3443 prior to testing.');
    process.exit(1);
  }
}

runTests();
