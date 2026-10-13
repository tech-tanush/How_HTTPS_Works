import React, { useState } from 'react';
import {
  Lock,
  Key,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  HelpCircle,
  FileKey,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function TlsHandshakeVisualizer() {
  const [selectedPhase, setSelectedPhase] = useState('all');

  const handshakeSteps = [
    {
      id: 'client_hello',
      phase: 1,
      sender: 'Client → Server',
      title: 'ClientHello',
      encryptionStatus: 'Plaintext on the wire',
      content: [
        'TLS Version: TLS 1.3 (with backward compatibility fallback to 1.2)',
        'Cipher Suites: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256',
        'Random bytes (32 bytes client entropy)',
        'Server Name Indication (SNI): "localhost"',
        'Client Key Share: Ephemeral Public Key (ECDHE public point A)',
      ],
      description:
        'The client initiates the cryptographic handshake. In TLS 1.3, the client preemptively generates an ephemeral key pair and sends its public share in the first packet!',
    },
    {
      id: 'server_hello',
      phase: 2,
      sender: 'Server → Client',
      title: 'ServerHello & Key Agreement',
      encryptionStatus: 'Plaintext on the wire (Last unencrypted packet!)',
      content: [
        'Selected Cipher Suite: TLS_AES_256_GCM_SHA384',
        'Server Random bytes (32 bytes server entropy)',
        'Server Key Share: Ephemeral Public Key (ECDHE public point B)',
      ],
      description:
        'The server agrees on the strongest mutual cipher suite and returns its own ephemeral ECDHE public key. Both parties now possess the inputs needed to calculate the shared secret.',
    },
    {
      id: 'encrypted_extensions',
      phase: 3,
      sender: 'Server → Client',
      title: 'Encrypted Handshake: Certificate & Signature',
      encryptionStatus: 'ENCRYPTED with Handshake Secret in TLS 1.3',
      content: [
        'EncryptedExtensions: Server application configuration parameters',
        'Certificate: Server X.509 Certificate (Subject, Issuer, RSA Public Key)',
        'CertificateVerify: Digital signature signed with Server Private Key',
        'Server Finished: Cryptographic MAC ensuring handshake integrity',
      ],
      description:
        'Key TLS 1.3 breakthrough: The server certificate and digital signature are encrypted! An eavesdropper monitoring Wireshark cannot see the server certificate on the wire.',
    },
    {
      id: 'client_finished',
      phase: 4,
      sender: 'Client → Server',
      title: 'Client Finished & Verification',
      encryptionStatus: 'ENCRYPTED with Handshake Secret',
      content: [
        'Client verifies Certificate chain and CertificateVerify signature',
        'Client Finished: Cryptographic MAC confirming whole handshake untampered',
        'Both sides derive Application Traffic Secret (Symmetric Session Keys)',
      ],
      description:
        'The client verifies the server signature, confirms nobody tampered with any handshake packet, and activates bulk symmetric encryption.',
    },
    {
      id: 'app_data',
      phase: 5,
      sender: 'Client ⟷ Server',
      title: 'Encrypted Application Data (HTTP Payload)',
      encryptionStatus: 'ENCRYPTED with Symmetric Session Key (AES-256-GCM)',
      content: [
        'GET /api/demo or POST /api/demo',
        'Encrypted HTTP Headers (Cookies, Authorization, User-Agent)',
        'Encrypted JSON Payload and Response',
        'AEAD Integrity Authentication Tag (MAC)',
      ],
      description:
        'Fast, hardware-accelerated symmetric encryption protects all HTTP traffic. Complete confidentiality and integrity achieved!',
    },
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-navy-900 border border-navy-800 text-xs font-semibold text-cyan-400">
          <span>Modern Cryptography</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          TLS 1.3 Handshake Visualization
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl">
          Learn how TLS 1.3 establishes authenticated symmetric encryption in just one round trip (1-RTT)
          using Ephemeral Diffie-Hellman key exchange.
        </p>
      </div>

      {/* Handshake Flow Cards */}
      <div className="space-y-4">
        {handshakeSteps.map((step) => {
          const isServer = step.sender.startsWith('Server');
          const isBoth = step.sender.includes('⟷');
          const isEncrypted = step.encryptionStatus.includes('ENCRYPTED');

          return (
            <div
              key={step.id}
              className={`rounded-xl border p-5 transition-all ${
                isEncrypted
                  ? 'bg-navy-900/90 border-cyan-500/40 shadow-sm'
                  : 'bg-navy-900/70 border-navy-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-navy-800 gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-navy-950 border border-cyan-500/30 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
                    {step.phase}
                  </span>
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <span className="text-xs font-mono text-cyan-400">({step.sender})</span>
                </div>

                <span
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold ${
                    isEncrypted
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {isEncrypted ? <Lock className="w-3 h-3 text-cyan-400" /> : <AlertTriangle className="w-3 h-3 text-amber-400" />}
                  <span>{step.encryptionStatus}</span>
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                <div className="p-3 rounded-lg bg-navy-950 border border-navy-800 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Handshake Record Details:
                  </div>
                  <ul className="text-xs font-mono text-slate-300 space-y-1 pl-4 list-disc">
                    {step.content.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Crucial Concept Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Misconception Debunked */}
        <div className="rounded-xl bg-navy-900 border border-rose-500/40 p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h4 className="font-bold text-sm text-white">
              Common Technical Misconception: Public Key Encryption
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Many beginners mistakenly assume that the browser encrypts web traffic using the server certificate's
            RSA public key, and the server decrypts it with its private key. <strong>This is incorrect!</strong>
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Asymmetric public-key encryption is mathematically slow and computationally heavy. Modern TLS uses the server's
            certificate <em>only to verify digital signatures (authentication)</em>. All application traffic is encrypted with
            lightning-fast <strong>symmetric session keys</strong> derived via ECDHE.
          </p>
        </div>

        {/* Ephemeral Key Exchange Explained */}
        <div className="rounded-xl bg-navy-900 border border-cyan-500/40 p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Key className="w-5 h-5 shrink-0" />
            <h4 className="font-bold text-sm text-white">
              Why Ephemeral Keys (ECDHE) & Forward Secrecy Matter
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>ECDHE</strong> (Elliptic Curve Diffie-Hellman Ephemeral) creates temporary, one-time key pairs
            for each individual session. Once the connection closes, the temporary private keys are discarded.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            This provides <strong>Forward Secrecy</strong>: Even if an adversary records all encrypted traffic today and
            steals the server's private key 10 years in the future, they <em>still cannot decrypt</em> past recorded sessions!
          </p>
        </div>
      </div>
    </section>
  );
}
