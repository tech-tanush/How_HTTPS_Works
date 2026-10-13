import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Layers,
  ShieldAlert,
  Play,
  RotateCcw
} from 'lucide-react';

export default function TcpHandshakeVisualizer() {
  const [activeStep, setActiveStep] = useState(3); // 1: SYN, 2: SYN-ACK, 3: ACK (all active by default)

  const steps = [
    {
      step: 1,
      sender: "Client → Server",
      flag: "SYN",
      seq: "Seq = X (e.g. 1000)",
      ack: "Ack = -",
      meaning: "Synchronize Sequence Numbers",
      explanation:
        "The client picks a random Initial Sequence Number (ISN = X) and sends a SYN segment. It asks: 'I want to initiate a connection. Let us synchronize on sequence number X.'",
      stateChange: "Client enters SYN_SENT state; Server moves from LISTEN to SYN_RCVD.",
    },
    {
      step: 2,
      sender: "Server → Client",
      flag: "SYN-ACK",
      seq: "Seq = Y (e.g. 5000)",
      ack: "Ack = X + 1 (1001)",
      meaning: "Synchronize & Acknowledge",
      explanation:
        "The server acknowledges the client's SYN by sending Ack = X + 1. Simultaneously, the server generates its own random Initial Sequence Number (ISN = Y) and sets its SYN flag.",
      stateChange: "Server proves it received client's packet. Client enters ESTABLISHED state upon receipt.",
    },
    {
      step: 3,
      sender: "Client → Server",
      flag: "ACK",
      seq: "Seq = X + 1 (1001)",
      ack: "Ack = Y + 1 (5001)",
      meaning: "Final Acknowledgment",
      explanation:
        "The client confirms receiving the server's sequence number by acknowledging Y + 1. The 3-way handshake is complete. Both sides now know the other can transmit and receive.",
      stateChange: "Server receives ACK and moves to ESTABLISHED state. Both sockets are now ready for byte streams.",
    },
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-navy-900 border border-navy-800 text-xs font-semibold text-cyan-400">
          <span>Layer 4 Transport Layer</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          TCP Three-Way Handshake
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl">
          Before any TLS encryption or HTTP request can occur, the client and server must establish
          a reliable, ordered byte stream via the Transmission Control Protocol (TCP).
        </p>
      </div>

      {/* Stepper Buttons */}
      <div className="flex items-center space-x-3">
        <span className="text-xs text-slate-400">View Stage:</span>
        <div className="flex space-x-2">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setActiveStep(num)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                activeStep === num
                  ? 'bg-cyan-500 text-navy-950 font-bold'
                  : 'bg-navy-900 text-slate-300 hover:bg-navy-800 border border-navy-800'
              }`}
            >
              Step {num}: {num === 1 ? 'SYN' : num === 2 ? 'SYN-ACK' : 'ACK'}
            </button>
          ))}
          <button
            onClick={() => setActiveStep(3)}
            className="px-3 py-1.5 rounded-lg text-xs text-cyan-400 hover:text-cyan-300 bg-navy-900 border border-navy-800"
          >
            Show All 3
          </button>
        </div>
      </div>

      {/* Sequence Diagram Visualizer */}
      <div className="rounded-xl bg-navy-900 border border-navy-800 p-6 sm:p-8 space-y-8">
        {/* Timeline Columns Header */}
        <div className="grid grid-cols-2 gap-8 text-center border-b border-navy-800 pb-4">
          <div className="space-y-1">
            <span className="font-bold text-base text-cyan-400">Client (Browser)</span>
            <p className="text-xs text-slate-400 font-mono">127.0.0.1:54321</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-base text-blue-400">Server (Backend)</span>
            <p className="text-xs text-slate-400 font-mono">127.0.0.1:3443 (Listening)</p>
          </div>
        </div>

        {/* Animated Sequence Diagram Flows */}
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Step 1: SYN */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeStep >= 1
                ? 'bg-navy-950/80 border-cyan-500/40'
                : 'opacity-30 bg-navy-950 border-navy-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-cyan-400 font-semibold">1. [SYN] Client → Server</span>
              <span className="text-slate-400">Flags: [SYN] | Seq=X | Ack=None</span>
            </div>
            <div className="relative py-2 flex items-center">
              <div className="w-full h-0.5 bg-cyan-500/60 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-cyan-400 flex items-center">
                  <span className="text-xs font-bold mr-1">SYN</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-2">{steps[0].explanation}</p>
          </div>

          {/* Step 2: SYN-ACK */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeStep >= 2
                ? 'bg-navy-950/80 border-blue-500/40'
                : 'opacity-30 bg-navy-950 border-navy-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-blue-400 font-semibold">2. [SYN-ACK] Server → Client</span>
              <span className="text-slate-400">Flags: [SYN, ACK] | Seq=Y | Ack=X+1</span>
            </div>
            <div className="relative py-2 flex items-center">
              <div className="w-full h-0.5 bg-blue-500/60 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-400 flex items-center">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-xs font-bold ml-1">SYN-ACK</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-2">{steps[1].explanation}</p>
          </div>

          {/* Step 3: ACK */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeStep >= 3
                ? 'bg-navy-950/80 border-emerald-500/40'
                : 'opacity-30 bg-navy-950 border-navy-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-emerald-400 font-semibold">3. [ACK] Client → Server</span>
              <span className="text-slate-400">Flags: [ACK] | Seq=X+1 | Ack=Y+1</span>
            </div>
            <div className="relative py-2 flex items-center">
              <div className="w-full h-0.5 bg-emerald-500/60 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-400 flex items-center">
                  <span className="text-xs font-bold mr-1">ACK</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-2">{steps[2].explanation}</p>
          </div>
        </div>

        {/* Connection Established Status */}
        <div className="rounded-lg bg-emerald-950/30 border border-emerald-500/40 p-4 flex items-center justify-center space-x-2 text-emerald-300 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>TCP Connection State: ESTABLISHED (Ready for TLS Handshake)</span>
        </div>
      </div>

      {/* Crucial Distinctions Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="rounded-xl bg-navy-900 border border-navy-800 p-5 space-y-2">
          <h4 className="font-bold text-white flex items-center space-x-1.5">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Why Are 3 Steps Required? (The Two Generals Problem)</span>
          </h4>
          <p className="text-slate-300 leading-relaxed">
            In an unreliable network where packets can be lost, delayed, or duplicated, both parties must
            verify that they can both <strong>transmit</strong> and <strong>receive</strong> data reliably.
            If only 2 steps were used (SYN and ACK), the server would never know if the client received its acknowledgment.
          </p>
        </div>

        <div className="rounded-xl bg-navy-900 border border-navy-800 p-5 space-y-2">
          <h4 className="font-bold text-white flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>TCP vs TLS Handshake Distinction</span>
          </h4>
          <p className="text-slate-300 leading-relaxed">
            A critical exam point: <strong>TCP establishes transport reliability</strong> (packet ordering, retransmissions, flow control),
            while <strong>TLS provides confidentiality and integrity</strong>. TCP headers and handshake packets are completely unencrypted.
          </p>
        </div>
      </div>
    </section>
  );
}
