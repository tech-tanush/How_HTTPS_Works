import React, { useState } from 'react';
import {
  FileCheck,
  Terminal,
  Copy,
  Check,
  AlertTriangle,
  HelpCircle,
  Eye,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { WIRESHARK_GUIDE_STEPS } from '../data/presentationData';

export default function WiresharkGuide() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const filters = [
    { label: 'Inspect Demo Backend Traffic', filter: 'tcp.port == 3000 || tcp.port == 3443' },
    { label: 'HTTPS Traffic Only', filter: 'tcp.port == 3443' },
    { label: 'All Recognized TLS Records', filter: 'tls' },
    { label: 'TLS ClientHello Packets', filter: 'tls.handshake.type == 1' },
    { label: 'TLS ServerHello Packets', filter: 'tls.handshake.type == 2' },
    { label: 'Unencrypted HTTP Traffic', filter: 'http' },
  ];

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-navy-900 border border-navy-800 text-xs font-semibold text-cyan-400">
          <span>Packet Inspection Laboratory</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          How to Inspect HTTPS Traffic in Wireshark
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl">
          Follow this practical, step-by-step lab walkthrough to capture and analyze local network packets,
          confirm TCP sequence synchronization, and verify cryptographic obfuscation.
        </p>
      </div>

      {/* Integration Disclaimer */}
      <div className="p-4 rounded-xl bg-navy-900 border border-cyan-800/40 text-xs text-slate-300 flex items-start space-x-3">
        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Notice:</strong> This web guide provides instructions for using Wireshark on your computer.
          The web application does not capture packets directly from your network card, as web browsers are strictly
          sandboxed from raw socket access for security reasons.
        </p>
      </div>

      {/* Quick Filters Cheatsheet */}
      <div className="rounded-xl bg-navy-900 border border-navy-800 p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Search className="w-4 h-4 text-cyan-400" />
          <span>Wireshark Display Filter Cheatsheet</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filters.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-navy-950 border border-navy-800 flex items-center justify-between gap-2"
            >
              <div className="space-y-0.5 overflow-hidden">
                <span className="text-[11px] text-slate-400 block truncate">{item.label}</span>
                <code className="text-xs font-mono text-cyan-300 font-semibold">{item.filter}</code>
              </div>
              <button
                onClick={() => handleCopy(item.filter, idx)}
                className="p-1.5 rounded hover:bg-navy-800 text-slate-400 hover:text-cyan-300 transition-colors"
                title="Copy Filter"
              >
                {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Lab Walkthrough */}
      <div className="space-y-4">
        {WIRESHARK_GUIDE_STEPS.map((item) => (
          <div key={item.step} className="rounded-xl bg-navy-900 border border-navy-800 p-5 space-y-3">
            <div className="flex items-center space-x-3">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                {item.step}
              </span>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{item.description}</p>

            {item.tip && (
              <div className="p-2.5 rounded-lg bg-navy-950 border border-navy-800 text-[11px] text-slate-400">
                <strong className="text-cyan-400">Tip:</strong> {item.tip}
              </div>
            )}

            {item.expectedResult && (
              <div className="p-3 rounded-lg bg-navy-950 border border-cyan-900/40 text-xs text-cyan-200">
                <strong>Expected Observation:</strong>
                <pre className="mt-1 font-mono text-[11px] whitespace-pre-wrap text-cyan-300 leading-relaxed">
                  {item.expectedResult}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Loopback & TLS 1.3 Caveats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        <div className="rounded-xl bg-navy-900 border border-navy-800 p-5 space-y-2">
          <h4 className="font-bold text-white flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Windows Loopback Interface Caveat</span>
          </h4>
          <p className="text-slate-300 leading-relaxed">
            Standard Windows network stacks bypass physical network cards when routing localhost traffic (<code className="text-cyan-300">127.0.0.1</code>).
            Wireshark relies on <strong>Npcap</strong> to capture loopback traffic. If Wireshark does not show localhost packets, ensure Npcap
            was installed with loopback support enabled.
          </p>
        </div>

        <div className="rounded-xl bg-navy-900 border border-navy-800 p-5 space-y-2">
          <h4 className="font-bold text-white flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Why TLS 1.3 Handshake Looks Different</span>
          </h4>
          <p className="text-slate-300 leading-relaxed">
            In older TLS 1.2 captures, you could see the Certificate packet and CertificateVerify in cleartext.
            In <strong>TLS 1.3</strong>, everything following the ServerHello is encrypted. In Wireshark, you will only see
            ClientHello and ServerHello, followed immediately by encrypted TLS application records.
          </p>
        </div>
      </div>
    </section>
  );
}
