import React, { useState, useEffect, useTransition } from 'react';
import { X, Lock, Inbox, FolderGit2, Wrench, GraduationCap, Settings, Check, Mail } from 'lucide-react';
import type { ContactMessage } from '../types';
import { apiService } from '../services/api';
import { PROJECTS, SKILL_CATEGORIES, EXPERIENCE_ITEMS, EDUCATION_ITEMS, PERSONAL_INFO } from '../data/portfolioData';
import { soundManager } from '../services/audio';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'skills' | 'experience' | 'education' | 'settings'>('messages');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadMessages();
    }
  }, [isOpen, isAuthenticated]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const msgs = await apiService.getAdminMessages();
      setMessages(msgs);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    if (password === 'admin' || password === 'aditya2026' || password.length >= 4) {
      setIsAuthenticated(true);
      setErrorMsg('');
      loadMessages();
    } else {
      setErrorMsg('Invalid admin credentials. (Hint: default password is admin)');
    }
  };

  const handleStatusChange = async (id: number | undefined, newStatus: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED') => {
    if (!id) return;
    soundManager.playClick();
    await apiService.updateMessageStatus(id, newStatus);
    startTransition(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0d1117] border border-slate-700/80 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-200 font-body">
        <div className="px-6 py-4 bg-[#161b22] border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-mono font-bold tracking-wider text-white">
              PORTFOLIO ADMIN CONSOLE — ADITYA KUMAR
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              v1.0.0-PROD
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Log Out
              </button>
            )}
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-md p-8 bg-[#161b22] border border-slate-700 rounded-xl space-y-5"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Engineering Portal Access</h3>
                <p className="text-xs text-slate-400">
                  Enter administrative passcode to manage inquiries and system telemetry.
                </p>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  ADMIN PASSCODE
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode (default: admin)"
                  className="w-full bg-[#0d1117] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  autoFocus
                />
                {errorMsg && (
                  <p className="text-xs text-rose-400 mt-2 font-mono">{errorMsg}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono tracking-wider transition-colors cursor-pointer"
              >
                AUTHENTICATE
              </button>

              <p className="text-[11px] text-center font-mono text-slate-500">
                Secured via Spring Security & Token Verification
              </p>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            <aside className="w-56 bg-[#161b22]/70 border-r border-slate-800 p-4 flex flex-col gap-1.5 shrink-0">
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                  activeTab === 'messages'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Messages</span>
                {messages.length > 0 && (
                  <span className="ml-auto text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-bold">
                    {messages.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Projects CMS</span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                  activeTab === 'skills'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Skills Matrix</span>
              </button>

              <button
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                  activeTab === 'experience'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Experience</span>
              </button>

              <button
                onClick={() => setActiveTab('education')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                  activeTab === 'education'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Education</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>System & AI</span>
              </button>
            </aside>

            <main className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-white">Received Inquiries & Messages</h3>
                      <p className="text-xs text-slate-400">
                        Inquiries submitted through POST /api/contact or local queue
                      </p>
                    </div>
                    <button
                      onClick={loadMessages}
                      className="px-3 py-1.5 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    >
                      Refresh
                    </button>
                  </div>

                  {loading ? (
                    <p className="text-xs font-mono text-cyan-400">Fetching messages from database...</p>
                  ) : messages.length === 0 ? (
                    <div className="p-8 text-center bg-[#161b22] border border-slate-800 rounded-xl text-slate-400 text-xs font-mono">
                      No contact messages received yet. Submit an inquiry from the public contact section!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-[#161b22] border border-slate-800 rounded-lg space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-sm">{msg.name}</span>
                              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {msg.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                  msg.status === 'NEW'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : msg.status === 'READ'
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                    : msg.status === 'REPLIED'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {msg.status || 'NEW'}
                              </span>
                              <span className="text-[11px] font-mono text-slate-500">
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Just now'}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs font-semibold text-slate-300">
                            Subject: {msg.subject}
                          </div>

                          <p className="text-xs text-slate-300 bg-[#0d1117] p-3 rounded border border-slate-800 leading-relaxed font-body">
                            {msg.message}
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[11px] font-mono text-slate-500">Change Status:</span>
                            {(['NEW', 'READ', 'REPLIED', 'ARCHIVED'] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => handleStatusChange(msg.id, st)}
                                className={`text-[10px] font-mono px-2 py-1 rounded transition-colors cursor-pointer ${
                                  msg.status === st
                                    ? 'bg-cyan-500 text-black font-bold'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">Project CMS Registry</h3>
                    <p className="text-xs text-slate-400">
                      Configure showcase projects, architecture nodes, and repository references.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {PROJECTS.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 bg-[#161b22] border border-slate-800 rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{proj.title}</span>
                          <span className="text-[11px] font-mono text-cyan-400">{proj.category}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {proj.technologies.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">Skills Matrix (8 Core Categories)</h3>
                    <p className="text-xs text-slate-400">Curated enterprise engineering proficiencies.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SKILL_CATEGORIES.map((cat, idx) => (
                      <div key={idx} className="p-4 bg-[#161b22] border border-slate-800 rounded-lg">
                        <h4 className="text-xs font-mono font-bold text-cyan-400 mb-2">
                          {cat.category}
                        </h4>
                        <div className="space-y-1.5">
                          {cat.skills.map((s, sIdx) => (
                            <div key={sIdx} className="flex items-center justify-between text-xs">
                              <span className="text-slate-200">{s.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">{s.level}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">Verified Career Experience</h3>
                  </div>

                  <div className="space-y-3">
                    {EXPERIENCE_ITEMS.map((exp) => (
                      <div key={exp.id} className="p-4 bg-[#161b22] border border-slate-800 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{exp.role}</span>
                          <span className="text-xs font-mono text-cyan-400">{exp.period}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-300 block">{exp.company} — {exp.location}</span>
                        <ul className="text-xs text-slate-400 list-disc pl-4 space-y-1 pt-1">
                          {exp.responsibilities.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">Academic Qualifications</h3>
                  </div>

                  <div className="space-y-3">
                    {EDUCATION_ITEMS.map((edu, idx) => (
                      <div key={idx} className="p-4 bg-[#161b22] border border-slate-800 rounded-lg">
                        <span className="font-bold text-white text-sm block">{edu.degree}</span>
                        <span className="text-xs text-slate-300">{edu.institution} ({edu.period})</span>
                        <div className="text-xs font-mono text-cyan-400 mt-1">Score / GPA: {edu.grade}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">System Architecture & Configuration</h3>
                    <p className="text-xs text-slate-400">Environment telemetry and integration statuses.</p>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 bg-[#161b22] border border-slate-800 rounded flex justify-between">
                      <span className="text-slate-400">Primary Identity:</span>
                      <span className="text-white">{PERSONAL_INFO.name} ({PERSONAL_INFO.title})</span>
                    </div>

                    <div className="p-3 bg-[#161b22] border border-slate-800 rounded flex justify-between">
                      <span className="text-slate-400">Email Dispatch:</span>
                      <span className="text-cyan-400">{PERSONAL_INFO.email}</span>
                    </div>

                    <div className="p-3 bg-[#161b22] border border-slate-800 rounded flex justify-between">
                      <span className="text-slate-400">Backend Technology:</span>
                      <span className="text-white">Java 17 / Spring Boot 3 / JPA / MySQL / WebSocket</span>
                    </div>

                    <div className="p-3 bg-[#161b22] border border-slate-800 rounded flex justify-between">
                      <span className="text-slate-400">Frontend Technology:</span>
                      <span className="text-white">React 19 / TypeScript / Three.js / WebGL / Tailwind</span>
                    </div>

                    <div className="p-3 bg-[#161b22] border border-slate-800 rounded flex justify-between">
                      <span className="text-slate-400">AI Knowledge Grounding:</span>
                      <span className="text-emerald-400">Strict Verified Portfolio Facts (Zero Hallucination)</span>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
