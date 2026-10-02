import React, { useState } from 'react';
import {
  Mail,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { apiService } from '../services/api';
import { soundManager } from '../services/audio';
import { useTheme } from '../context/ThemeContext';
import { openGmailCompose } from '../utils/email';

interface ContactSectionProps {
  onOpenResume?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenResume }) => {
  const { themeConfig } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [selectedInterest, setSelectedInterest] = useState<string>('💼 Full-Time Role');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const interests = [
    '💼 Full-Time Role',
    '🏛️ Backend Architecture',
    '🌐 Full-Stack Web App',
    '⚡ Realtime Streaming',
    '🤖 AI & Automation',
    '💡 System Consultation',
  ];

  const handleInterestSelect = (interest: string) => {
    soundManager.playClick();
    setSelectedInterest(interest);
    setFormData((prev) => ({
      ...prev,
      subject: `Inquiry: ${interest}`,
    }));
  };

  const handleCopyEmail = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const validate = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
      return false;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    if (!formData.subject.trim()) {
      setErrorMsg('Please enter a subject.');
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
        setErrorMsg(res.message || 'Failed to send message. Please try again.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      style={{ backgroundColor: themeConfig.bgHex }}
      className="relative py-16 sm:py-20 px-4 sm:px-8 lg:px-12 text-white border-t border-white/10 z-20 transition-colors duration-700 overflow-hidden"
    >
      {/* Ambient Depth Lighting Matching Zen Theme */}
      <div
        style={{ backgroundColor: themeConfig.primaryHex }}
        className="absolute -top-32 right-1/4 w-[380px] h-[380px] rounded-full blur-[140px] opacity-10 pointer-events-none transition-colors duration-700"
      />
      <div
        style={{ backgroundColor: themeConfig.accentHex }}
        className="absolute bottom-0 -left-20 w-[380px] h-[380px] rounded-full blur-[140px] opacity-10 pointer-events-none transition-colors duration-700"
      />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* ================================================================= */}
        {/* HEADER: Clean Luxury Editorial Header (Proportional & Unified)   */}
        {/* ================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>INITIATE CONTACT // GET IN TOUCH</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-white tracking-tight uppercase">
              LET’S BUILD <span className="font-serif italic font-normal text-emerald-400">Something</span> EXTRAORDINARY.
            </h2>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TWO-COLUMN MASTER GRID                                            */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* =============================================================== */}
          {/* LEFT: CREATOR PROFILE & DIRECT CHANNELS (5 COLS)                 */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 space-y-6">
            {/* Framed HD Photo Card */}
            <div className="rounded-2xl p-4 bg-[#0b100d]/90 border border-white/10 shadow-xl space-y-4 group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/10">
                <img
                  src="/aditya-photo-hd.jpg"
                  alt={PERSONAL_INFO.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Availability Pill */}
                <div className="absolute top-3 left-3 bg-[#060907]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/30 shadow-md flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>OPEN FOR WORK</span>
                </div>
              </div>

              {/* Creator Info */}
              <div className="px-1 pb-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight">
                    {PERSONAL_INFO.name}
                  </h3>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                    2026 ACTIVE
                  </span>
                </div>
                <p className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                  {PERSONAL_INFO.title} · REALTIME & DISTRIBUTED
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono pt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{PERSONAL_INFO.location} · UTC+5:30 (IST)</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              {/* Email Box */}
              <div className="p-4 rounded-xl bg-[#0b100d]/90 border border-white/10 space-y-2 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    DIRECT INBOX
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px]">P99 SLA: &lt;4h</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      openGmailCompose({
                        to: PERSONAL_INFO.email,
                        subject: 'Portfolio Inquiry',
                        body: 'Hello Aditya,\n\nI came across your portfolio and would like to connect regarding a potential opportunity.\n\nPlease let me know a suitable time to connect.\n\nBest regards,\n[Your Name]',
                      });
                    }}
                    className="text-left text-xs sm:text-sm font-mono font-semibold text-slate-200 hover:text-emerald-300 transition-colors truncate"
                  >
                    {PERSONAL_INFO.email}
                  </button>

                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-mono font-semibold text-slate-200 hover:bg-white/[0.12] hover:text-white transition-all cursor-pointer shadow-sm shrink-0"
                    title="Copy Email to Clipboard"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Network Channels & Resume Pills */}
              <div className="pt-1 flex flex-wrap gap-2.5">
                <a
                  href={PERSONAL_INFO.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono font-bold text-slate-200 hover:bg-white/[0.1] hover:text-white transition-all shadow-sm"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GITHUB ↗</span>
                </a>

                <a
                  href={PERSONAL_INFO.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono font-bold text-slate-200 hover:bg-white/[0.1] hover:text-white transition-all shadow-sm"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  <span>LINKEDIN ↗</span>
                </a>

                {onOpenResume && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenResume();
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    <span>VIEW RESUME ↗</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT: INTERACTIVE FORM (COMPACT, ELEGANT PROPORTIONS)           */}
          {/* =============================================================== */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0b100d]/90 border border-white/10 shadow-2xl space-y-5">
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-wider uppercase block mb-1">
                  DIRECT TRANSMISSION
                </span>
                <h3 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight">
                  Tell Me About Your Project
                </h3>
                <p className="text-xs text-slate-400 font-body mt-1">
                  Select your inquiry type and leave a message. Messages are delivered straight to my primary inbox and dashboard.
                </p>
              </div>

              {/* Interactive Interest Pills Selector */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  I AM INTERESTED IN:
                </span>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => {
                    const isSelected = selectedInterest === interest;
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestSelect(interest)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-bold shadow-sm shadow-emerald-500/15'
                            : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs sm:text-sm font-body placeholder:text-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 outline-none transition-all shadow-inner"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      YOUR EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. alex@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs sm:text-sm font-body placeholder:text-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    SUBJECT *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Engineering Collaboration / Full-time Role"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs sm:text-sm font-body placeholder:text-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 outline-none transition-all shadow-inner"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    MESSAGE / PROJECT DETAILS *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your timeline, scope, engineering challenges, or requirements..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs sm:text-sm font-body placeholder:text-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 outline-none transition-all resize-y shadow-inner"
                  />
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Success Banner */}
                {success && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-mono flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-300">Message Delivered!</div>
                      <p className="text-xs text-emerald-400/90 mt-0.5 font-body">
                        Thank you for reaching out. Your transmission has been queued in Aditya’s operational dashboard. You’ll hear back shortly!
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 hover:shadow-emerald-950/60 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                      <span>DISPATCHING TRANSMISSION...</span>
                    </>
                  ) : (
                    <>
                      <span>SEND INQUIRY NOW</span>
                      <ArrowUpRight className="w-4 h-4 text-emerald-200" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
