import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';
import type { AiChatMessage } from '../types';
import { apiService } from '../services/api';
import { soundManager } from '../services/audio';
import { useMusic } from '../context/MusicContext';

export const AiAssistantModal: React.FC = () => {
  const { executeCommand } = useMusic();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm Aditya's AI Assistant. You can ask me anything about Aditya's engineering stack, Spring Boot microservices, Infosoft CRM architecture, realtime WebSocket systems, or say 'Play an old Bhojpuri song' / 'Play something energetic' to control personal music playback!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'ðŸŽµ Play an old Bhojpuri song',
    'ðŸŽµ Play an old Hindi romantic song',
    'ðŸŽµ Play something energetic',
    'What technologies does Aditya use?',
    "Tell me about Aditya's backend experience.",
    'Which projects use Spring Boot?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    soundManager.playClick();
    setInput('');

    const newMessages: AiChatMessage[] = [...messages, { role: 'user', content: q }];
    setMessages(newMessages);
    setLoading(true);

    const isMusicCmd = /play|music|song|songs|gaana|geet|pause|resume|next song|prev song/i.test(q);
    if (isMusicCmd) {
      executeCommand(q);
    }

    try {
      const response = await apiService.askAi(q, newMessages);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I could not connect to the backend AI gateway. Aditya Kumar is a Software Engineer specializing in Java, Spring Boot, React, and MySQL. Feel free to contact him directly at adityakumarbju121@gmail.com!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => {
          soundManager.playClick();
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black rounded-full shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer group"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12 text-black fill-current" />
        <span className="sr-only">Open AI Chat</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full sm:w-[480px] h-[85vh] sm:h-[620px] bg-[#0c0e12] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assistant-title"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 id="assistant-title" className="text-sm font-semibold text-white tracking-wide">
                    Aditya&apos;s Engineering AI
                  </h3>
                  <p className="text-[10px] text-cyan-400/80 font-mono">Architecture &amp; Skills Assistant</p>
                </div>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-500 text-black font-medium'
                        : 'bg-[#151921] border border-white/10 text-slate-200'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 justify-start items-center text-slate-400 text-xs py-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  </div>
                  <span className="font-mono text-[11px] text-cyan-400/70">Analyzing query...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Sample Question Chips */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {sampleQuestions.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sq)}
                  disabled={loading}
                  className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
                >
                  {sq}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-black/40 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Spring Boot, Infosoft CRM, or play music..."
                  disabled={loading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold transition-all cursor-pointer shadow-md"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistantModal;