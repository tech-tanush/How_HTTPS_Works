import React, { useState } from 'react';
import {
  Unlock,
  Lock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Code2
} from 'lucide-react';

export default function HttpVsHttpsComparison() {
  const [activeTab, setActiveTab] = useState('sideBySide');

  const sampleHeaders = `POST /api/demo HTTP/1.1
Host: localhost
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Content-Type: application/json
Cookie: session_token=secret_9832819024

{"message": "Transfer $500 to Alice"}`;

  const encryptedBytesSample = `17 03 03 00 8a 4f 9a e1 c8 22 93 1b 84 df 01 bb 
3d fa 9c 10 52 87 e2 aa bc 74 fe 8d 33 a1 66 94 
8b 11 02 c7 eb ad 20 81 74 19 65 3d 0b ca 99 e2 
[Encrypted TLS 1.3 Record - AES-256-GCM Ciphertext]`;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-navy-900 border border-navy-800 text-xs font-semibold text-cyan-400">
          <span>Architectural Comparison</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          HTTP vs HTTPS: Under the Hood
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl">
          At their core, both HTTP and HTTPS use the exact same request methods (GET, POST),
          status codes (200, 404), and header structures. The fundamental difference is the
          underlying cryptographic layer that envelopes the data.
        </p>
      </div>

      {/* Side-by-side comparison cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: HTTP Card */}
        <div className="rounded-xl bg-navy-900/90 border border-amber-600/40 p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Unlock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">HTTP (Cleartext)</h3>
                  <span className="text-xs text-amber-400 font-mono">http://localhost:3000</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-700">
                UNENCRYPTED
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              HTTP data travels directly over a plain Layer 4 TCP connection. No cryptographic wrapper
              is applied. Anyone on the network path—including public Wi-Fi sniffers, malicious routers,
              and intermediate ISPs—can inspect and alter every byte.
            </p>

            {/* Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center space-x-2 text-rose-300">
                <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span><strong>No Confidentiality:</strong> URLs, headers, cookies, and body visible in plaintext.</span>
              </div>
              <div className="flex items-center space-x-2 text-rose-300">
                <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span><strong>No Integrity:</strong> Man-in-the-middle attackers can alter payloads undetected.</span>
              </div>
              <div className="flex items-center space-x-2 text-rose-300">
                <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span><strong>No Authentication:</strong> Cannot prove you are communicating with the intended server.</span>
              </div>
            </div>

            {/* What the Wire Sees (HTTP) */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Network Sniffer View (Wireshark Plain ASCII)</span>
              </span>
              <pre className="p-3 rounded-lg bg-navy-950 border border-amber-900/40 text-[11px] font-mono text-amber-200/90 overflow-x-auto whitespace-pre leading-relaxed">
                {sampleHeaders}
              </pre>
            </div>
          </div>

          <div className="pt-3 border-t border-navy-800">
            <a
              href="http://localhost:3000/api/demo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-amber-400 hover:text-amber-300"
            >
              <span>Test Live HTTP Endpoint (Port 3000)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right: HTTPS Card */}
        <div className="rounded-xl bg-navy-900/90 border border-cyan-500/40 p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">HTTPS (HTTP over TLS)</h3>
                  <span className="text-xs text-cyan-400 font-mono">https://localhost:3443</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-700">
                TLS ENCRYPTED
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              HTTPS embeds standard HTTP within a TLS (Transport Layer Security) session. Before any
              application bytes leave the device, they are encrypted with high-speed symmetric session keys
              established during the handshake.
            </p>

            {/* Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center space-x-2 text-cyan-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
                <span><strong>Strong Confidentiality:</strong> AES-256-GCM / ChaCha20 scrambles all application data.</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
                <span><strong>Cryptographic Integrity:</strong> AEAD authentication tags immediately detect packet tampering.</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
                <span><strong>Server Authentication:</strong> X.509 digital certificates verify the true domain identity.</span>
              </div>
            </div>

            {/* What the Wire Sees (HTTPS) */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Network Sniffer View (Wireshark Encrypted TLS Record)</span>
              </span>
              <pre className="p-3 rounded-lg bg-navy-950 border border-cyan-900/40 text-[11px] font-mono text-cyan-300/90 overflow-x-auto whitespace-pre leading-relaxed">
                {encryptedBytesSample}
              </pre>
            </div>
          </div>

          <div className="pt-3 border-t border-navy-800">
            <a
              href="https://localhost:3443/api/demo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300"
            >
              <span>Test Live HTTPS Endpoint (Port 3443)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Deep-Dive Box on Self-Signed Certificates */}
      <div className="rounded-xl bg-navy-900 border border-navy-800 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Why Local Self-Signed Certificates Are Not Automatically Trusted</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          When you purchase or issue a production certificate (e.g. from Let's Encrypt or DigiCert), it is signed by a
          globally trusted <strong>Root Certificate Authority</strong> whose cryptographic certificate is pre-installed in
          Windows, macOS, Android, and web browsers.
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          In our local demonstration, we used <strong>OpenSSL</strong> to create a self-signed certificate for <code className="bg-navy-950 px-1 py-0.5 rounded text-cyan-300">localhost</code>.
          Because this certificate was signed by itself (Issuer == Subject) and is not in your computer's trusted root store,
          browsers purposefully display a security barrier. For development, you can use tools like <code className="bg-navy-950 px-1 py-0.5 rounded text-cyan-300">mkcert</code> to
          install a local root CA into your system trust store to eliminate the warning completely.
        </p>
      </div>
    </section>
  );
}
