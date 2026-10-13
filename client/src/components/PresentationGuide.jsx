import React, { useState } from 'react';
import {
  HelpCircle,
  Clock,
  Mic,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  Award,
  Sparkles
} from 'lucide-react';
import { VIVA_QUESTIONS, PRESENTATION_SCRIPT } from '../data/presentationData';

export default function PresentationGuide() {
  const [activeTab, setActiveTab] = useState('script'); // 'script' | 'viva'
  const [expandedQuestions, setExpandedQuestions] = useState({ 1: true, 2: true });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleQuestion = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredQuestions = VIVA_QUESTIONS.filter(
    (q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-navy-900 border border-navy-800 text-xs font-semibold text-cyan-400">
          <span>College Evaluation & Defense Companion</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Technical Presentation Script & Viva Q&A
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl">
          Everything you need to deliver an outstanding 3–5 minute college presentation
          and confidently answer rigorous viva questions from professors.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex space-x-3 border-b border-navy-800 pb-3">
        <button
          onClick={() => setActiveTab('script')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors ${
            activeTab === 'script'
              ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20'
              : 'bg-navy-900 text-slate-300 hover:bg-navy-800 border border-navy-800'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>3–5 Minute Presentation Script</span>
        </button>

        <button
          onClick={() => setActiveTab('viva')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors ${
            activeTab === 'viva'
              ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20'
              : 'bg-navy-900 text-slate-300 hover:bg-navy-800 border border-navy-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>10 College Viva Questions & Answers</span>
        </button>
      </div>

      {/* TAB 1: PRESENTATION SCRIPT */}
      {activeTab === 'script' && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-navy-900/80 border border-navy-800 text-xs text-slate-300 flex items-start space-x-3">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Timing Strategy:</strong> Practice this structured 5-part script. Keep a steady pace,
              reference the live dashboard during points 3 and 4, and conclude with the security limitations.
            </p>
          </div>

          <div className="space-y-4">
            {PRESENTATION_SCRIPT.map((slide, idx) => (
              <div key={idx} className="rounded-xl bg-navy-900 border border-navy-800 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-navy-800 gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-navy-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-white text-base">{slide.slide}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-700 font-mono text-xs text-cyan-400 self-start sm:self-center">
                    {slide.time}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block">
                    Speaker Notes (Verbatim Talk Track):
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans bg-navy-950 p-4 rounded-lg border border-navy-800 italic">
                    "{slide.speakerNotes}"
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block mb-1">
                    Key Visuals & Technical Takeaways to Emphasize:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc font-sans">
                    {slide.keyPoints.map((point, pIdx) => (
                      <li key={pIdx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VIVA QUESTIONS */}
      {activeTab === 'viva' && (
        <div className="space-y-5">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter viva questions by topic (e.g., certificates, Diffie-Hellman, Wireshark, TCP)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedQuestions[q.id];
              return (
                <div
                  key={q.id}
                  className="rounded-xl bg-navy-900 border border-navy-800 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggleQuestion(q.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-navy-850 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                        Q{q.id}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-white">{q.question}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">{q.category}</span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-navy-800 space-y-3 text-xs">
                      {/* Short Answer */}
                      <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-cyan-200">
                        <strong className="text-cyan-400 block mb-1">Quick Answer (Elevator Pitch):</strong>
                        {q.shortAnswer}
                      </div>

                      {/* Full Detailed Answer */}
                      <div className="p-4 rounded-lg bg-navy-950 border border-navy-800 text-slate-300 space-y-1">
                        <strong className="text-slate-200 block mb-1">In-Depth Technical Explanation:</strong>
                        <p className="whitespace-pre-line leading-relaxed">{q.fullAnswer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
