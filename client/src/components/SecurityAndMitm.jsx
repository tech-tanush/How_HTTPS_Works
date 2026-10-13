import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Unlock,
  UserX,
  FileWarning,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function SecurityAndMitm() {
  const [mitmScenario, setMitmScenario] = useState('legit'); // 'cleartext' | 'legit' | 'bypassed'

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-navy-900 border border-navy-800 text-xs font-semibold text-cyan-400">
          <span>Threat Modeling & Practical Defense</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Security Benefits, Limitations & MITM Defense
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl">
          Understand how HTTPS defeats Man-in-the-Middle (MITM) attacks when certificate validation succeeds,
          and discover the crucial real-world security limitations that HTTPS cannot solve.
        </p>
      </div>

      {/* Interactive MITM Simulator */}
      <div className="rounded-xl bg-navy-900 border border-navy-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-navy-800">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <UserX className="w-5 h-5 text-rose-400" />
              <span>Interactive Man-in-the-Middle (MITM) Attack Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select an architectural scenario to simulate attacker capabilities on the network wire:
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex space-x-2 text-xs">
            <button
              onClick={() => setMitmScenario('cleartext')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                mitmScenario === 'cleartext'
                  ? 'bg-amber-500 text-navy-950'
                  : 'bg-navy-950 text-slate-400 hover:text-slate-200 border border-navy-800'
              }`}
            >
              1. HTTP (No TLS)
            </button>
            <button
              onClick={() => setMitmScenario('legit')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                mitmScenario === 'legit'
                  ? 'bg-cyan-500 text-navy-950'
                  : 'bg-navy-950 text-slate-400 hover:text-slate-200 border border-navy-800'
              }`}
            >
              2. Valid HTTPS
            </button>
            <button
              onClick={() => setMitmScenario('bypassed')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                mitmScenario === 'bypassed'
                  ? 'bg-rose-500 text-white'
                  : 'bg-navy-950 text-slate-400 hover:text-slate-200 border border-navy-800'
              }`}
            >
              3. Ignored Warning
            </button>
          </div>
        </div>

        {/* Visual Scenario Stage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          {/* Client Node */}
          <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 text-center space-y-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center font-bold text-xs">
              Client
            </div>
            <h4 className="text-sm font-bold text-white">Browser / User</h4>
            <p className="text-xs text-slate-400">Initiates request</p>
          </div>

          {/* Attacker In The Middle Node */}
          <div
            className={`p-5 rounded-xl border text-center space-y-2 transition-all ${
              mitmScenario === 'legit'
                ? 'bg-navy-950/40 border-emerald-500/40 opacity-70'
                : 'bg-rose-950/30 border-rose-500/60 ring-1 ring-rose-500/30'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center">
              <UserX className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-rose-200">Adversary / MITM</h4>
            <p className="text-xs text-slate-400">Positioned on Rogue Wi-Fi or Router</p>
            <span
              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                mitmScenario === 'legit'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {mitmScenario === 'legit' ? 'ATTACK DEFEATED' : 'ATTACK SUCCESSFUL'}
            </span>
          </div>

          {/* Legitimate Server Node */}
          <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 text-center space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center font-bold text-xs">
              Server
            </div>
            <h4 className="text-sm font-bold text-white">Legitimate Server</h4>
            <p className="text-xs text-slate-400">Holds private key</p>
          </div>
        </div>

        {/* Scenario Explanation Box */}
        <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 text-xs space-y-2">
          {mitmScenario === 'cleartext' && (
            <div className="space-y-1 text-amber-200">
              <div className="font-bold flex items-center space-x-1.5 text-amber-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Scenario 1: Plain HTTP (No Cryptographic Protection)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Because HTTP has zero encryption and zero authentication, the attacker can silently intercept packets,
                read passwords and session tokens in cleartext, and inject malicious scripts or modify banking account numbers
                in flight without the browser ever knowing!
              </p>
            </div>
          )}

          {mitmScenario === 'legit' && (
            <div className="space-y-1 text-emerald-200">
              <div className="font-bold flex items-center space-x-1.5 text-emerald-400 text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Scenario 2: HTTPS with Valid CA Certificate Validation</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                The attacker attempts to intercept the connection. However, the attacker cannot forge the legitimate server's
                digital signature because they do not possess the private key of a trusted Certificate Authority. If the attacker
                presents their own certificate, the browser verifies the trust chain, detects the forgery, and immediately terminates
                the connection. Confidentiality and integrity are completely preserved.
              </p>
            </div>
          )}

          {mitmScenario === 'bypassed' && (
            <div className="space-y-1 text-rose-200">
              <div className="font-bold flex items-center space-x-1.5 text-rose-400 text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Scenario 3: Untrusted Certificate Warning Blindly Ignored by User</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                The attacker presents a fake rogue certificate. The browser raises an alert (NET::ERR_CERT_COMMON_NAME_INVALID).
                If the user clicks "Ignore Warning / Proceed Anyway", the browser accepts the attacker's fake key. The attacker now
                decrypts the client's traffic, re-encrypts it to the real server, and successfully executes a full MITM attack!
                <strong> This is why certificate warnings should never be bypassed on untrusted public networks.</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Crucial Real-World Limitations */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Crucial Security Limitations: What HTTPS Does NOT Do</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* Limitation 1 */}
          <div className="p-5 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
            <h4 className="font-bold text-white text-sm">1. HTTPS ≠ Trustworthy Website</h4>
            <p className="text-slate-400 leading-relaxed">
              Having a green padlock or HTTPS only proves you have an encrypted connection to the domain owner.
              Phishing websites, scammers, and malicious actors can easily obtain free, valid HTTPS certificates
              via automated CAs like Let's Encrypt.
            </p>
          </div>

          {/* Limitation 2 */}
          <div className="p-5 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
            <h4 className="font-bold text-white text-sm">2. Endpoint Compromise</h4>
            <p className="text-slate-400 leading-relaxed">
              HTTPS protects data <em>in transit</em> across the wire. If the client computer has keyloggers,
              browser extension spyware, or the server's database is hacked, HTTPS cannot protect that data.
            </p>
          </div>

          {/* Limitation 3 */}
          <div className="p-5 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
            <h4 className="font-bold text-white text-sm">3. Metadata & Traffic Analysis</h4>
            <p className="text-slate-400 leading-relaxed">
              While packet payloads are encrypted, network observers can still see IP addresses, port numbers,
              timing, packet sizes, and the target hostname in the Server Name Indication (SNI) header unless
              Encrypted Client Hello (ECH) is deployed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
