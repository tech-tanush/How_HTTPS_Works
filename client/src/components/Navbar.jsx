import React from 'react';
import { ShieldCheck, Lock, Unlock, AlertTriangle, ExternalLink, Activity } from 'lucide-react';

export default function Navbar({ httpStatus, httpsStatus, certData, onNavigate, activeSection }) {
  const navItems = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'comparison', label: 'HTTP vs HTTPS' },
    { id: 'flow', label: '11-Step Flow' },
    { id: 'tcp', label: 'TCP Handshake' },
    { id: 'tls', label: 'TLS Handshake' },
    { id: 'certificate', label: 'Certificate' },
    { id: 'playground', label: 'Playground' },
    { id: 'security', label: 'Security & MITM' },
    { id: 'wireshark', label: 'Wireshark' },
    { id: 'presentation', label: 'Presentation & Viva' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('overview')}>
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">How HTTPS Works</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Demo
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Interactive Network Security Demonstration</p>
            </div>
          </div>

          {/* Real-time Server Badges */}
          <div className="hidden md:flex items-center space-x-3 text-xs">
            {/* HTTP Badge */}
            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border ${
              httpStatus?.online 
                ? 'bg-amber-950/40 border-amber-600/40 text-amber-300' 
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}>
              <Unlock className="w-3.5 h-3.5 text-amber-400" />
              <span>HTTP :3000</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            </div>

            {/* HTTPS Badge */}
            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border ${
              httpsStatus?.online 
                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' 
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}>
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>HTTPS :3443</span>
              <span className={`w-2 h-2 rounded-full ${httpsStatus?.online ? 'bg-cyan-400 animate-pulse' : 'bg-rose-500'}`}></span>
            </div>

            {/* Certificate Status */}
            <a
              href="https://localhost:3443"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
              title="Open HTTPS server directly to accept self-signed certificate"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Self-Signed</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Navigation Bar Pills */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-navy-900 text-xs sm:text-sm">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
