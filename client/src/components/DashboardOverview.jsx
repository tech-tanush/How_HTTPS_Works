import React from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  ArrowRight,
  Server,
  FileCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  Cpu
} from 'lucide-react';

export default function DashboardOverview({
  httpStatus,
  httpsStatus,
  certData,
  onStartDemo,
  onNavigate,
}) {
  return (
    <section className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border border-navy-800 p-6 sm:p-10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Interactive Cyber Defense Lab & College Presentation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            How <span className="text-cyan-400">HTTPS</span> Works
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-medium">
            Explore the journey of a secure web request
          </p>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            From the moment you hit Enter in your browser to the final decrypted payload,
            explore the cryptographic handshake, X.509 digital certificates, TCP sequence mechanics,
            and transport-layer security protecting modern internet communications.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onStartDemo}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Interactive Demonstration</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('playground')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 transition-colors font-medium"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Test Live Encryption Playground</span>
            </button>

            <button
              onClick={() => onNavigate('wireshark')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 transition-colors font-medium"
            >
              <FileCheck className="w-4 h-4 text-blue-400" />
              <span>Wireshark Guide</span>
            </button>
          </div>
        </div>

        {/* Subtle background graphic */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Real-time Server & Certificate Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* HTTP Server Card */}
        <div className="rounded-xl bg-navy-900 border border-navy-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">HTTP Server</h2>
                <span className="text-xs text-slate-400">Port 3000 (Plaintext)</span>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                httpStatus?.online
                  ? 'bg-amber-950 text-amber-300 border border-amber-700'
                  : 'bg-rose-950 text-rose-300 border border-rose-700'
              }`}
            >
              {httpStatus?.online ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-normal">
            Transmits requests in unencrypted cleartext. Suitable for comparing packet inspection
            against secured TLS traffic.
          </p>

          <div className="pt-2 border-t border-navy-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Transport:</span>
            <span className="font-mono text-amber-400 font-medium">Unencrypted TCP</span>
          </div>
        </div>

        {/* HTTPS Server Card */}
        <div className="rounded-xl bg-navy-900 border border-navy-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">HTTPS Server</h2>
                <span className="text-xs text-slate-400">Port 3443 (TLS Secured)</span>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                httpsStatus?.online
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                  : 'bg-rose-950 text-rose-300 border border-rose-700'
              }`}
            >
              {httpsStatus?.online ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-normal">
            Active TLS tunnel. Socket verifies encryption at transport layer and negotiates
            modern AES-GCM / TLS 1.3 ciphers.
          </p>

          <div className="pt-2 border-t border-navy-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Protocol:</span>
            <span className="font-mono text-cyan-400 font-medium">
              {httpsStatus?.protocol || 'TLSv1.3'}
            </span>
          </div>
        </div>

        {/* Certificate Status Card */}
        <div className="rounded-xl bg-navy-900 border border-navy-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Certificate Status</h2>
                <span className="text-xs text-slate-400">X.509 RSA 2048-bit</span>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-700">
              SELF-SIGNED
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-normal">
            Local certificate with Subject Alternative Names for localhost and 127.0.0.1.
            Triggers expected browser development warning.
          </p>

          <div className="pt-2 border-t border-navy-800 flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigate('certificate')}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1"
            >
              <span>Inspect Certificate Fields</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Educational Notice Banner regarding Self-Signed Certificates */}
      <div className="rounded-xl bg-navy-900/80 border border-amber-600/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-amber-200">
              Understanding Local Self-Signed Certificates & Browser Warnings
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Because our local HTTPS server uses a self-signed certificate rather than one issued by a globally
              trusted Certificate Authority (like Let's Encrypt), your browser will display{' '}
              <code className="bg-navy-950 px-1 py-0.5 rounded text-amber-300 font-mono">
                NET::ERR_CERT_AUTHORITY_INVALID
              </code>
              . This is the browser doing its job! To test real HTTPS fetches in this demo, simply click the link below
              to open the server once and click <strong>"Advanced → Proceed to localhost"</strong>.
            </p>
          </div>
        </div>

        <a
          href="https://localhost:3443/api/health"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors"
        >
          <span>Open https://localhost:3443 to Authorize</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* What the User Will Learn: 3 Pillars Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <span>The Three Pillars of HTTPS Security</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl bg-navy-900/60 border border-navy-800 p-5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="text-base font-semibold text-white">Confidentiality</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Data transmitted over the network is encrypted using high-speed symmetric ciphers
              (AES-GCM / ChaCha20). Network observers and eavesdroppers see only meaningless ciphertext bytes.
            </p>
          </div>

          <div className="rounded-xl bg-navy-900/60 border border-navy-800 p-5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="text-base font-semibold text-white">Integrity</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every packet includes an Authenticated Encryption Message Authentication Code (AEAD MAC).
              If an attacker attempts to modify, inject, or tamper with even a single bit in transit,
              decryption immediately fails.
            </p>
          </div>

          <div className="rounded-xl bg-navy-900/60 border border-navy-800 p-5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="text-base font-semibold text-white">Authentication</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              X.509 digital certificates issued by trusted Certificate Authorities prove the server’s true identity.
              This prevents Man-in-the-Middle (MITM) attackers from spoofing legitimate domains.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
