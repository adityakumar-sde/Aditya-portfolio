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
  Clock,
  Briefcase,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { apiService } from '../services/api';
import { soundManager } from '../services/audio';

interface ContactSectionProps {
  onOpenResume?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenResume }) => {
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
      className="relative py-28 px-4 sm:px-8 lg:px-16 bg-[#ffffff] text-slate-900 border-t border-slate-200 rounded-t-[40px] sm:rounded-t-[64px] shadow-[0_-25px_60px_rgba(0,0,0,0.15)] z-20 transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* ================================================================= */}
        {/* HEADER: Clean Luxury Editorial Header (Dribbble White Aesthetic)  */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-200">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>✨ INITIATE CONTACT // GET IN TOUCH</span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black text-slate-950 tracking-tight uppercase leading-[0.98]">
              LET’S BUILD <span className="font-serif italic font-normal text-slate-700">Something</span> EXTRAORDINARY.
            </h2>
          </div>

          <p className="text-base sm:text-lg text-slate-600 font-body max-w-md leading-relaxed font-normal">
            Have a breakthrough product idea, enterprise engineering challenge, or full-time opportunity? Let’s connect and engineer high-performance systems.
          </p>
        </div>

        {/* ================================================================= */}
        {/* TWO-COLUMN MASTER GRID                                            */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* =============================================================== */}
          {/* LEFT: CREATOR PROFILE & DIRECT CHANNELS (5 COLS)                 */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 space-y-8">
            {/* Framed HD Photo Card */}
            <div className="rounded-3xl p-4 bg-slate-50 border border-slate-200/90 shadow-xl space-y-4 group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 border border-slate-200">
                <img
                  src="/aditya-photo-hd.jpg"
                  alt={PERSONAL_INFO.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Availability Pill */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-md flex items-center gap-2 text-xs font-mono font-bold text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>OPEN FOR WORK</span>
                </div>
              </div>

              {/* Creator Info */}
              <div className="px-2 pb-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-sans font-black text-slate-950 tracking-tight">
                    {PERSONAL_INFO.name}
                  </h3>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-800">
                    2026 ACTIVE
                  </span>
                </div>
                <p className="text-xs font-mono text-cyan-800 font-bold uppercase tracking-wider">
                  {PERSONAL_INFO.title} · REALTIME & DISTRIBUTED
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{PERSONAL_INFO.location} · UTC+5:30 (IST)</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              {/* Email Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-700" />
                    DIRECT INBOX
                  </span>
                  <span className="text-emerald-700">P99 SLA: &lt;4h</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    onClick={() => soundManager.playClick()}
                    className="text-sm sm:text-base font-mono font-bold text-slate-900 hover:text-cyan-700 transition-colors truncate"
                  >
                    {PERSONAL_INFO.email}
                  </a>

                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer shadow-sm shrink-0"
                    title="Copy Email to Clipboard"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status / Working Hours */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-indigo-700" />
                  AVAILABILITY & TURNAROUND
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-body leading-relaxed">
                  Available for full-time software engineering roles, enterprise contracts, and architectural consulting. Quick turnarounds for mission-critical inquiries.
                </p>
              </div>

              {/* Network Channels & Resume Pills */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <a
                  href={PERSONAL_INFO.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 hover:bg-slate-100 hover:border-slate-400 transition-all shadow-sm"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GITHUB ↗</span>
                </a>

                <a
                  href={PERSONAL_INFO.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 hover:bg-slate-100 hover:border-slate-400 transition-all shadow-sm"
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
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-mono font-bold hover:bg-black transition-all shadow-md cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    <span>VIEW RESUME ↗</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT: INTERACTIVE LUXURY FORM (7 COLS)                          */}
          {/* =============================================================== */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/90 border border-slate-200/90 shadow-xl space-y-8">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-700 tracking-wider uppercase block mb-1">
                  DIRECT TRANSMISSION
                </span>
                <h3 className="text-2xl sm:text-3xl font-sans font-black text-slate-950 tracking-tight">
                  Tell Me About Your Project
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-body mt-1">
                  Select your inquiry type and leave a message. Messages are delivered straight to my primary inbox and operational dashboard.
                </p>
              </div>

              {/* Interactive Interest Pills Selector */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block">
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
                        className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-950 text-white font-bold shadow-md shadow-slate-950/20 scale-[1.02]'
                            : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-body placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 outline-none transition-all shadow-sm"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                      YOUR EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. alex@company.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-body placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                    SUBJECT *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Engineering Collaboration / Full-time Role"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-body placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 outline-none transition-all shadow-sm"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                    MESSAGE / PROJECT DETAILS *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your timeline, scope, engineering challenges, or requirements..."
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-body placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 outline-none transition-all resize-y shadow-sm"
                  />
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Success Banner */}
                {success && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-mono flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-900">Message Delivered!</div>
                      <p className="text-xs text-emerald-700 mt-0.5 font-body">
                        Thank you for reaching out. Your transmission has been queued in Aditya’s operational dashboard. You’ll hear back shortly!
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-8 rounded-xl bg-slate-950 hover:bg-black text-white font-mono font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>DISPATCHING TRANSMISSION...</span>
                    </>
                  ) : (
                    <>
                      <span>SEND INQUIRY NOW</span>
                      <ArrowUpRight className="w-4 h-4 text-cyan-400" />
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
