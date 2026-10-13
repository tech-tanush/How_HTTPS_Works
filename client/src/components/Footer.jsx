import React from 'react';
import { ShieldCheck, ExternalLink, ArrowUp } from 'lucide-react';

export default function Footer({ onScrollTop }) {
  return (
    <footer className="bg-navy-950 border-t border-navy-800 py-10 mt-16 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">How HTTPS Works Demo</span>
              <p className="text-slate-500 text-[11px]">Comprehensive College Networking Demonstration Project</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onScrollTop}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 border border-navy-700 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            Tech Stack: React · Vite · Tailwind CSS · Node.js Express · OpenSSL · Wireshark
          </div>
          <div>
            Built for technical presentation & viva examination defense
          </div>
        </div>
      </div>
    </footer>
  );
}
