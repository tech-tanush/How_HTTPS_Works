import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Server,
  ArrowRight,
  ArrowLeft,
  Eye,
  Sparkles,
  Layers,
  HelpCircle,
  Radio,
  Clock,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { FLOW_STEPS } from '../data/flowSteps';

export default function CommunicationFlow() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed] = useState(4000); // 4 seconds per step in auto-play

  const currentStep = FLOW_STEPS[currentStepIndex];

  // Auto-play timer effect
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIndex < FLOW_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, playSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, playSpeed]);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(FLOW_STEPS.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const togglePlay = () => {
    if (currentStepIndex === FLOW_STEPS.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying((prev) => !prev);
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-navy-900 border border-navy-800 text-xs font-semibold text-cyan-400">
          <span>Complete Request Lifecycle</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Interactive Communication Flow (11 Steps)
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl">
          Trace the exact journey of a secure HTTPS request from URL entry through DNS lookup,
          TCP connection, TLS 1.3 handshake, encrypted request/response, and final client rendering.
        </p>
      </div>

      {/* Control Bar & Step Selector */}
      <div className="bg-navy-900/90 border border-navy-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 border border-navy-700 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span className="text-xs">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="text-xs">Auto Play</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === FLOW_STEPS.length - 1}
            className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 border border-navy-700 transition-colors"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 transition-colors"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Current Step Counter Badge */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Step</span>
          <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 font-mono text-cyan-300 text-xs font-bold">
            {currentStep.id} of {FLOW_STEPS.length}
          </span>
          <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
            {currentStep.title}
          </span>
        </div>
      </div>

      {/* Step Numbers Scrubber Bar */}
      <div className="grid grid-cols-11 gap-1.5 sm:gap-2">
        {FLOW_STEPS.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isPast = idx < currentStepIndex;
          return (
            <button
              key={step.id}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`py-2 px-1 rounded-lg text-center font-mono text-xs font-bold transition-all ${
                isCurrent
                  ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/25 scale-105'
                  : isPast
                  ? 'bg-navy-800 text-cyan-400 hover:bg-navy-700'
                  : 'bg-navy-900/60 text-slate-500 hover:bg-navy-800'
              }`}
            >
              {step.id}
            </button>
          );
        })}
      </div>

      {/* Animated Client-Server Stage */}
      <div className="rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border border-navy-800 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Client Node (Left) */}
          <div
            className={`rounded-xl p-5 border text-center transition-all ${
              currentStep.actor === 'client' || currentStep.actor === 'both'
                ? 'bg-cyan-950/30 border-cyan-500/60 ring-1 ring-cyan-500/30'
                : 'bg-navy-900 border-navy-800 opacity-70'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3">
              <Monitor className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Client / Browser</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">localhost</p>
            <div className="mt-3 inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-navy-950 text-[11px] text-cyan-300 border border-navy-800">
              <span>Originator / Verifier</span>
            </div>
          </div>

          {/* Network Channel / Packet Visualizer (Center) */}
          <div className="space-y-3 text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center space-x-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Network Wire (Loopback)</span>
            </div>

            {/* Visual packet animation arrow */}
            <div className="relative py-4">
              <div className="h-0.5 w-full bg-navy-700 relative">
                {currentStep.actor === 'client' && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center text-cyan-400 animate-pulse">
                    <span className="text-[10px] font-mono mr-1">Data →</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
                {currentStep.actor === 'server' && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-cyan-400 animate-pulse">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[10px] font-mono ml-1">← Data</span>
                  </div>
                )}
                {currentStep.actor === 'both' && (
                  <div className="absolute inset-0 flex items-center justify-between text-cyan-400">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[10px] font-mono">⟷ Bidirectional</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            <span className="inline-block px-2.5 py-1 rounded-full bg-navy-800 border border-navy-700 text-xs font-mono text-slate-300">
              {currentStep.category}
            </span>
          </div>

          {/* Server Node (Right) */}
          <div
            className={`rounded-xl p-5 border text-center transition-all ${
              currentStep.actor === 'server' || currentStep.actor === 'both'
                ? 'bg-cyan-950/30 border-cyan-500/60 ring-1 ring-cyan-500/30'
                : 'bg-navy-900 border-navy-800 opacity-70'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Express Backend</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">127.0.0.1:3443</p>
            <div className="mt-3 inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-navy-950 text-[11px] text-cyan-300 border border-navy-800">
              <span>HTTPS Socket (Node.js)</span>
            </div>
          </div>
        </div>

        {/* Active Step Detailed Inspection Card */}
        <div className="rounded-xl bg-navy-900 border border-navy-800 p-6 space-y-5">
          {/* Step Title & Explanation */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500 text-navy-950 text-xs font-bold font-mono">
                STEP {currentStep.id}
              </span>
              <h3 className="text-xl font-bold text-white">{currentStep.title}</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{currentStep.explanation}</p>
          </div>

          {/* Grid of Client Sends vs Server Sends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Sends */}
            <div className="rounded-lg bg-navy-950 border border-navy-800 p-4 space-y-2">
              <div className="text-xs font-semibold text-cyan-400 flex items-center space-x-1.5">
                <Monitor className="w-3.5 h-3.5" />
                <span>What Client / Browser Sends</span>
              </div>
              <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                {currentStep.clientSends}
              </pre>
            </div>

            {/* Server Sends */}
            <div className="rounded-lg bg-navy-950 border border-navy-800 p-4 space-y-2">
              <div className="text-xs font-semibold text-blue-400 flex items-center space-x-1.5">
                <Server className="w-3.5 h-3.5" />
                <span>What Server Sends</span>
              </div>
              <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                {currentStep.serverSends}
              </pre>
            </div>
          </div>

          {/* Observer & Analogy Callouts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What Network Observer Sees */}
            <div className="rounded-lg bg-navy-950/70 border border-amber-900/30 p-4 space-y-1.5">
              <div className="text-xs font-semibold text-amber-400 flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Visible to Network Observer (Wireshark)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{currentStep.networkObserverSees}</p>
            </div>

            {/* Real World Analogy */}
            <div className="rounded-lg bg-navy-950/70 border border-emerald-900/30 p-4 space-y-1.5">
              <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real-World Analogy</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{currentStep.analogy}</p>
            </div>
          </div>

          {/* Important Technical Note */}
          <div className="rounded-lg bg-navy-950 border border-cyan-900/40 p-4 flex items-start space-x-3">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-cyan-200 leading-relaxed">
              <strong>Technical Nuance:</strong> {currentStep.keyNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
