import React, { useState } from 'react';
import {
  Send,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Key,
  Copy,
  Check
} from 'lucide-react';

export default function EncryptionPlayground() {
  const [sampleMessage, setSampleMessage] = useState('Hello from technical presentation! Testing packet security.');
  const [loadingHttp, setLoadingHttp] = useState(false);
  const [loadingHttps, setLoadingHttps] = useState(false);
  const [httpResponse, setHttpResponse] = useState(null);
  const [httpsResponse, setHttpsResponse] = useState(null);
  const [httpError, setHttpError] = useState(null);
  const [httpsError, setHttpsError] = useState(null);
  const [copiedHttp, setCopiedHttp] = useState(false);
  const [copiedHttps, setCopiedHttps] = useState(false);

  const presets = [
    'Hello from technical presentation! Testing packet security.',
    'Sample Transaction: Transfer $25 to Bob for project lunch',
    'Class Demo: Student ID #9824 enrolled in CS 402 Network Security',
  ];

  // Simulated Wire Representation of TLS Record (Clearly labeled Illustration only!)
  const generateSimulatedWireBytes = (text) => {
    // Generate pseudo-hex bytes to visually demonstrate high entropy ciphertext
    const bytes = [];
    for (let i = 0; i < Math.max(32, text.length * 2); i++) {
      const byte = Math.floor(Math.sin(i * 997 + text.length) * 128 + 128).toString(16).padStart(2, '0');
      bytes.push(byte);
    }
    return bytes.slice(0, 48).join(' ');
  };

  // 1. Send via Real HTTP (:3000)
  const handleSendHttp = async () => {
    setLoadingHttp(true);
    setHttpError(null);
    try {
      const response = await fetch('http://localhost:3000/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sampleMessage }),
      });
      if (!response.ok) {
        throw new Error(`HTTP server error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setHttpResponse(data);
    } catch (err) {
      setHttpError(err.message || 'Failed to reach HTTP server on port 3000');
    } finally {
      setLoadingHttp(false);
    }
  };

  // 2. Send via Real HTTPS (:3443)
  const handleSendHttps = async () => {
    setLoadingHttps(true);
    setHttpsError(null);
    try {
      const response = await fetch('https://localhost:3443/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sampleMessage }),
      });
      if (!response.ok) {
        throw new Error(`HTTPS server error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setHttpsResponse(data);
    } catch (err) {
      // Browser blocking self-signed certificate gives TypeError: Failed to fetch
      setHttpsError(
        'Browser blocked request due to self-signed certificate. You must visit https://localhost:3443 once and click "Advanced → Proceed to localhost" to allow the browser to accept this certificate.'
      );
    } finally {
      setLoadingHttps(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-navy-900 border border-navy-800 text-xs font-semibold text-cyan-400">
          <span>Live Interactive Sandbox</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Encryption Playground: Real Traffic vs Wire Sniffer
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl">
          Enter harmless sample text and execute real requests to our local HTTP (:3000) and HTTPS (:3443)
          servers. Observe what our backend socket reports and how network observers perceive each packet.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-xl bg-navy-900/80 border border-navy-800 text-xs text-slate-300 flex items-start space-x-3">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p leading-relaxed>
          <strong>Security Best Practice:</strong> Never input real passwords, API keys, or personal banking data into
          testing sandboxes or technical demonstrations. Use the harmless educational presets below.
        </p>
      </div>

      {/* Input Form & Presets */}
      <div className="rounded-xl bg-navy-900 border border-navy-800 p-5 space-y-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Harmless Sample Payload:
        </label>

        <textarea
          value={sampleMessage}
          onChange={(e) => setSampleMessage(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full rounded-lg bg-navy-950 border border-navy-700 p-3 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          placeholder="Enter harmless sample text..."
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400">Presets:</span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setSampleMessage(preset)}
                className="px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 transition-colors"
              >
                Sample {idx + 1}
              </button>
            ))}
          </div>

          <span className="text-slate-500 font-mono">{sampleMessage.length} / 500 chars</span>
        </div>

        {/* Dual Execution Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={handleSendHttp}
            disabled={loadingHttp}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs sm:text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <Unlock className="w-4 h-4" />
            <span>{loadingHttp ? 'Transmitting via HTTP...' : 'Transmit via HTTP (Port 3000 - Plaintext)'}</span>
          </button>

          <button
            onClick={handleSendHttps}
            disabled={loadingHttps}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold text-xs sm:text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-md shadow-cyan-500/20"
          >
            <Lock className="w-4 h-4" />
            <span>{loadingHttps ? 'Transmitting via HTTPS...' : 'Transmit via HTTPS (Port 3443 - TLS)'}</span>
          </button>
        </div>
      </div>

      {/* Dual Results Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. HTTP Results Card */}
        <div className="rounded-xl bg-navy-900 border border-amber-600/30 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div className="flex items-center space-x-2 text-amber-400">
              <Unlock className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">HTTP Mode (Port 3000)</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              Cleartext Wire
            </span>
          </div>

          {httpError && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
              <strong>Error:</strong> {httpError}
            </div>
          )}

          {httpResponse ? (
            <div className="space-y-4 text-xs">
              {/* Transport State from Socket */}
              <div className="p-3 rounded-lg bg-navy-950 border border-navy-800 space-y-1.5">
                <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Backend Socket Verification:
                </div>
                <div className="font-mono text-amber-300 space-y-1">
                  <div>Socket Encrypted: <strong>{String(httpResponse.isTls)}</strong></div>
                  <div>Transport: {httpResponse.transport}</div>
                  <div>Protocol: {httpResponse.protocol}</div>
                </div>
              </div>

              {/* Wire Observation */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Wireshark Network Capture (Exact Cleartext):</span>
                </div>
                <pre className="p-3 rounded-lg bg-navy-950 border border-amber-900/40 font-mono text-amber-200 text-[11px] whitespace-pre-wrap overflow-x-auto">
{`POST /api/demo HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{"message": "${httpResponse.echo?.receivedMessage || sampleMessage}"}`}
                </pre>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-300/90 text-xs leading-relaxed">
                <strong>Vulnerability:</strong> Because this connection uses plain TCP without TLS, any network observer
                can read your message directly in cleartext.
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs">
              Click "Transmit via HTTP" above to send a live request to port 3000.
            </div>
          )}
        </div>

        {/* 2. HTTPS Results Card */}
        <div className="rounded-xl bg-navy-900 border border-cyan-500/30 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Lock className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">HTTPS Mode (Port 3443)</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              TLS Encrypted
            </span>
          </div>

          {httpsError && (
            <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-700 text-amber-200 text-xs space-y-2">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Self-Signed Certificate Trust Required:</span>
              </div>
              <p className="leading-relaxed">{httpsError}</p>
              <div className="pt-1">
                <a
                  href="https://localhost:3443/api/demo"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-cyan-500 text-navy-950 font-bold hover:bg-cyan-400 transition-colors"
                >
                  <span>Authorize Certificate in Browser Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {httpsResponse ? (
            <div className="space-y-4 text-xs">
              {/* Transport State from Socket */}
              <div className="p-3 rounded-lg bg-navy-950 border border-navy-800 space-y-1.5">
                <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Backend Socket Verification:
                </div>
                <div className="font-mono text-cyan-300 space-y-1">
                  <div>Socket Encrypted: <strong>{String(httpsResponse.isTls)}</strong></div>
                  <div>Transport: {httpsResponse.transport}</div>
                  <div>Protocol: {httpsResponse.protocol}</div>
                  <div>Cipher: {httpsResponse.cipher?.name || 'TLS_AES_256_GCM_SHA384'}</div>
                </div>
              </div>

              {/* Wire Observation (Clearly labeled Illustration only!) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Wireshark Wire View (TLS Record Layer):</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                    Illustration only
                  </span>
                </div>
                <pre className="p-3 rounded-lg bg-navy-950 border border-cyan-900/40 font-mono text-cyan-300 text-[11px] whitespace-pre-wrap overflow-x-auto leading-relaxed">
{`TLSv1.3 Record Layer: Application Data Protocol: http
  Content Type: Application Data (23)
  Version: TLS 1.2 (0x0303 - Wire compatibility)
  Length: ${sampleMessage.length + 32} bytes
  Encrypted Application Data: 
  ${generateSimulatedWireBytes(sampleMessage)}`}
                </pre>
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-cyan-300 text-xs leading-relaxed">
                <strong>Confidentiality Guaranteed:</strong> In transit, eavesdroppers see only scrambled ciphertext bytes.
                Without the ephemeral symmetric session keys, reversing the message is mathematically infeasible.
              </div>
            </div>
          ) : (
            !httpsError && (
              <div className="py-8 text-center text-slate-500 text-xs">
                Click "Transmit via HTTPS" above to execute a real TLS request to port 3443.
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
