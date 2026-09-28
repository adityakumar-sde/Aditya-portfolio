import React, { useState } from 'react';
import { Mail, Send, ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { apiService } from '../services/api';
import { soundManager } from '../services/audio';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const validate = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMsg('Please provide your name.');
      return false;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrorMsg('Please provide a valid email address.');
      return false;
    }
    if (!formData.subject.trim()) {
      setErrorMsg('Please specify the subject of your inquiry.');
      return false;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setErrorMsg('Message must be at least 10 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validate()) return;

    soundManager.playClick();
    setLoading(true);

    try {
      const res = await apiService.sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (res.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg(res.message || 'Failed to dispatch message.');
      }
    } catch {
      setErrorMsg('Network error. Your message could not be sent to the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 px-6 bg-[#06070a] border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
            10 / INITIATE CONTACT
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            LET'S BUILD SOMETHING.
          </h2>
          <p className="text-base sm:text-lg font-mono text-cyan-300">
            Have an idea, product, or engineering challenge?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6 bg-[#0a0d14]/90">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
                DIRECT COMMUNICATION
              </span>

              <div className="space-y-2">
                <span className="text-xs text-slate-400 block font-mono">PRIMARY INBOX:</span>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  onClick={() => soundManager.playClick()}
                  className="text-base sm:text-lg font-mono text-white hover:text-cyan-400 transition-colors flex items-center gap-2 group break-all"
                >
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{PERSONAL_INFO.email}</span>
                </a>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-slate-400 block font-mono">LOCATION:</span>
                <p className="text-sm font-body text-slate-300">
                  {PERSONAL_INFO.location}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
                  NETWORK CHANNELS:
                </span>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={PERSONAL_INFO.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundManager.playClick()}
                    className="btn-secondary text-xs py-2 px-3.5"
                    title="GitHub (Placeholder)"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GITHUB</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500" />
                  </a>

                  <a
                    href={PERSONAL_INFO.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundManager.playClick()}
                    className="btn-secondary text-xs py-2 px-3.5"
                    title="LinkedIn (Placeholder)"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LINKEDIN</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10 bg-[#0a0d14]/90 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-display font-bold text-white tracking-wide">
                  TRANSMIT MESSAGE
                </h3>
                <span className="text-xs font-mono text-cyan-400">POST /api/contact</span>
              </div>

              {success ? (
                <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-fadeIn">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Message Transmitted Successfully</h4>
                  <p className="text-xs text-slate-300 font-body max-w-md mx-auto">
                    Thank you for reaching out. Your message has been routed to Aditya's inbox and persisted to the queue. You will receive a response shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn-secondary text-xs py-2 px-4 mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs font-mono text-rose-300 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-slate-400 block mb-1">
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-400 block mb-1">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. s.jenkins@enterprise.com"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">
                      SUBJECT / TOPIC *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Full Stack Engineering Role / Project Discussion"
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">
                      MESSAGE CONTENT *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your project requirements, engineering challenge, or position..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 resize-none font-body"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 text-xs font-mono justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>DISPATCHING MESSAGE...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND MESSAGE</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
