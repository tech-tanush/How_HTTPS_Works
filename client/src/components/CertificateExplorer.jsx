import React, { useState } from 'react';
import {
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Calendar,
  Key,
  Globe,
  Hash,
  CheckCircle2,
  XCircle,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export default function CertificateExplorer({ certData, onRefreshCert, isLoadingCert }) {
  const [selectedChainNode, setSelectedChainNode] = useState('leaf');

  const cert = certData?.certificate;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-navy-900 border border-navy-800 text-xs font-semibold text-cyan-400">
          <span>Public Key Infrastructure (PKI)</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Digital Certificate Explorer
          </h2>
          <button
            onClick={onRefreshCert}
            disabled={isLoadingCert}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 border border-navy-700 text-xs text-slate-300 font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingCert ? 'animate-spin' : ''}`} />
            <span>Reload Certificate from Backend</span>
          </button>
        </div>
        <p className="text-sm text-slate-400 max-w-3xl">
          An X.509 digital certificate acts as a cryptographic passport for a website.
          Explore the exact cryptographic fields extracted from our live local server certificate.
        </p>
      </div>

      {/* Visual Trust Chain Architecture */}
      <div className="rounded-xl bg-navy-900 border border-navy-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Certificate Hierarchy & Trust Chain</span>
        </h3>

        {/* Chain Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Root CA Node */}
          <div
            onClick={() => setSelectedChainNode('root')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedChainNode === 'root'
                ? 'bg-cyan-950/40 border-cyan-500/60 ring-1 ring-cyan-500/40'
                : 'bg-navy-950 border-navy-800 hover:border-navy-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-navy-900 text-slate-400">Level 1</span>
              <span className="text-xs font-semibold text-cyan-400">Root CA</span>
            </div>
            <h4 className="font-bold text-sm text-white">Trust Anchor</h4>
            <p className="text-xs text-slate-400 mt-1">Pre-installed in OS / Browser Trust Store (e.g., DigiCert Global Root, ISRG Root X1).</p>
          </div>

          {/* Intermediate CA Node */}
          <div
            onClick={() => setSelectedChainNode('intermediate')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedChainNode === 'intermediate'
                ? 'bg-cyan-950/40 border-cyan-500/60 ring-1 ring-cyan-500/40'
                : 'bg-navy-950 border-navy-800 hover:border-navy-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-navy-900 text-slate-400">Level 2</span>
              <span className="text-xs font-semibold text-blue-400">Intermediate CA</span>
            </div>
            <h4 className="font-bold text-sm text-white">Signing Authority</h4>
            <p className="text-xs text-slate-400 mt-1">Signs daily web certificates while the sensitive Root CA private key remains offline in secure cold storage.</p>
          </div>

          {/* Website Leaf Certificate Node */}
          <div
            onClick={() => setSelectedChainNode('leaf')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedChainNode === 'leaf'
                ? 'bg-cyan-950/40 border-cyan-500/60 ring-1 ring-cyan-500/40'
                : 'bg-navy-950 border-navy-800 hover:border-navy-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-navy-900 text-slate-400">Level 3 (Leaf)</span>
              <span className="text-xs font-semibold text-emerald-400">Our Local Cert</span>
            </div>
            <h4 className="font-bold text-sm text-white">localhost (Port 3443)</h4>
            <p className="text-xs text-slate-400 mt-1">Self-signed certificate presenting RSA 2048-bit public key for localhost and 127.0.0.1.</p>
          </div>
        </div>

        {/* Chain Description */}
        <div className="p-3 rounded-lg bg-navy-950 border border-navy-800 text-xs text-slate-300">
          <strong>Trust Rule:</strong> A certificate is valid if and only if every link in the chain contains a mathematically
          valid cryptographic signature back to a trusted Root CA in the client’s trust store.
        </div>
      </div>

      {/* Live Decoded Certificate Details Card */}
      <div className="rounded-xl bg-navy-900 border border-navy-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-800 gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Live Server Certificate Fields</h3>
              <p className="text-xs text-slate-400">Parsed directly from <code className="font-mono text-cyan-300">server/cert/server.cert</code></p>
            </div>
          </div>

          <span className="px-3 py-1 rounded text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-700 self-start sm:self-center">
            {cert?.isSelfSigned ? 'Self-Signed (Issuer == Subject)' : 'CA Signed'}
          </span>
        </div>

        {/* Certificate Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Subject Field */}
          <div className="p-4 rounded-lg bg-navy-950 border border-navy-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Subject (Owner Identity)</span>
            </div>
            <pre className="font-mono text-cyan-300 whitespace-pre-wrap leading-relaxed">
              {cert?.subject || 'CN=localhost, O=HTTPS Educational Demo'}
            </pre>
          </div>

          {/* Issuer Field */}
          <div className="p-4 rounded-lg bg-navy-950 border border-navy-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Issuer (Signing Authority)</span>
            </div>
            <pre className="font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
              {cert?.issuer || 'CN=localhost, O=HTTPS Educational Demo'}
            </pre>
          </div>

          {/* Subject Alternative Names (SAN) */}
          <div className="p-4 rounded-lg bg-navy-950 border border-navy-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Subject Alternative Names (SAN)</span>
            </div>
            <div className="space-y-1">
              {cert?.subjectAltName?.length ? (
                cert.subjectAltName.map((san, i) => (
                  <span key={i} className="inline-block mr-2 px-2 py-0.5 rounded bg-navy-900 border border-navy-700 font-mono text-emerald-300 text-xs">
                    {san}
                  </span>
                ))
              ) : (
                <span className="font-mono text-emerald-300">DNS:localhost, IP:127.0.0.1, IP:::1</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Modern browsers require SAN entries. The old Common Name (CN) is deprecated for hostname validation.
            </p>
          </div>

          {/* Validity Period */}
          <div className="p-4 rounded-lg bg-navy-950 border border-navy-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Validity Period</span>
            </div>
            <div className="space-y-1 font-mono text-slate-200">
              <div><strong>Not Before:</strong> {cert?.validFrom || 'Active'}</div>
              <div><strong>Not After:</strong> {cert?.validTo || 'Valid for 365 Days'}</div>
            </div>
          </div>

          {/* Public Key Details */}
          <div className="p-4 rounded-lg bg-navy-950 border border-navy-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold uppercase tracking-wider">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Public Key Algorithm & Modulus</span>
            </div>
            <div className="font-mono text-cyan-300 space-y-1">
              <div>Algorithm: {cert?.keyAlgorithm ? cert.keyAlgorithm.toUpperCase() : 'RSA'}</div>
              <div>Key Size: 2048 bits (Standard secure asymmetric key length)</div>
            </div>
          </div>

          {/* SHA-256 Fingerprint */}
          <div className="p-4 rounded-lg bg-navy-950 border border-navy-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold uppercase tracking-wider">
              <Hash className="w-3.5 h-3.5 text-blue-400" />
              <span>SHA-256 Fingerprint</span>
            </div>
            <p className="font-mono text-slate-300 text-[11px] break-all leading-relaxed">
              {cert?.fingerprint256 || '6A:39:7C:F0:09:4E:DD:80:62:E3:17:88:07:0F:BD:6C:AF:9E:89:FE'}
            </p>
          </div>
        </div>
      </div>

      {/* 4-Step Browser Validation Checklist */}
      <div className="rounded-xl bg-navy-900 border border-navy-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span>The 4 Checks Every Browser Performs When Validating a Certificate</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-navy-950 border border-navy-800 space-y-2">
            <span className="font-bold text-white text-sm">1. Hostname Match</span>
            <p className="text-slate-400 leading-relaxed">
              Does the URL in the address bar (e.g. <code className="text-cyan-300">localhost</code>) match a SAN entry in the certificate?
            </p>
          </div>

          <div className="p-4 rounded-lg bg-navy-950 border border-navy-800 space-y-2">
            <span className="font-bold text-white text-sm">2. Date Validity</span>
            <p className="text-slate-400 leading-relaxed">
              Is the client machine's current time within the certificate's 'Not Before' and 'Not After' timestamps?
            </p>
          </div>

          <div className="p-4 rounded-lg bg-navy-950 border border-navy-800 space-y-2">
            <span className="font-bold text-white text-sm">3. Root CA Chain</span>
            <p className="text-slate-400 leading-relaxed">
              Does the certificate chain back to an approved Certificate Authority in the computer's trust store?
            </p>
          </div>

          <div className="p-4 rounded-lg bg-navy-950 border border-navy-800 space-y-2">
            <span className="font-bold text-white text-sm">4. Digital Signature</span>
            <p className="text-slate-400 leading-relaxed">
              Is the CA’s cryptographic signature intact? Has the certificate been revoked via CRL or OCSP?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
