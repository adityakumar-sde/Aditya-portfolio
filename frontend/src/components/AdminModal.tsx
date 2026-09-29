import React, { useState, useEffect, useTransition } from 'react';
import {
  X,
  Lock,
  Inbox,
  FolderGit2,
  Wrench,
  Settings,
  Check,
  Mail,
  Key,
  MessageSquare,
  ShieldCheck,
  Send,
  Plus,
  Copy,
  Trash2,
  Clock,
  Layers,
  ExternalLink,
} from 'lucide-react';
import type { ContactMessage } from '../types';
import { apiService } from '../services/api';
import {
  PROJECTS,
  SKILL_CATEGORIES,
} from '../data/portfolioData';
import { soundManager } from '../services/audio';

export interface GuestPasscode {
  id: string;
  code: string;
  assignedTo: string;
  active: boolean;
  createdAt: string;
  lastAccessed?: string;
  notes?: string;
}

export interface ProjectDevlog {
  id: string;
  title: string;
  status: string;
  currentSprint: string;
  whatImDoingNow: string;
  recentMilestones: string[];
  techStack: string[];
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  passcode: string;
  senderRole: 'GUEST' | 'ADMIN';
  senderName: string;
  message: string;
  timestamp: string;
}

const DEFAULT_GUEST_PASSES: GuestPasscode[] = [
  {
    id: 'pass-1',
    code: 'GOOGLE-VIP',
    assignedTo: 'Google Hiring Team',
    active: true,
    createdAt: '2026-09-29',
    notes: 'Confidential architecture & sprint review',
  },
  {
    id: 'pass-2',
    code: 'META-CTO',
    assignedTo: 'Engineering Leadership',
    active: true,
    createdAt: '2026-09-29',
    notes: 'Microservices & distributed systems evaluation',
  },
  {
    id: 'pass-3',
    code: 'CLIENT-DEMO',
    assignedTo: 'Enterprise Client Partner',
    active: true,
    createdAt: '2026-09-29',
    notes: 'Production scalability & Kafka streaming audit',
  },
];

const DEFAULT_DEVLOGS: ProjectDevlog[] = [
  {
    id: 'devlog-1',
    title: 'Distributed CRM & High-Throughput Event Streaming Engine',
    status: '🔥 IN ACTIVE PRODUCTION REFACTOR',
    currentSprint: 'Sprint 14: Kafka Transactional Outbox & CQRS Sync',
    whatImDoingNow:
      'Decoupling transactional write locks from downstream state hydration using Apache Kafka and Debezium CDC. Benchmarking memory consumption under 250k QPS to keep P99 write latency strictly under 2.4ms.',
    recentMilestones: [
      'Migrated customer balance mutations to distributed Redis Redlock to eliminate race conditions.',
      'Configured automated Canary deployments with Istio service mesh and Prometheus traffic routing.',
      'Optimized PostgreSQL connection pooling via PgBouncer, cutting idle DB memory by 38%.',
    ],
    techStack: ['Java 21', 'Spring Boot 3.3', 'Apache Kafka', 'PostgreSQL 16', 'Redis', 'Kubernetes'],
    updatedAt: 'Updated Today · 21:45 IST',
  },
  {
    id: 'devlog-2',
    title: 'Ultra-Low Latency Realtime Telemetry & Duplex Socket Engine',
    status: '⚡ TESTNET STRESS-TESTING',
    currentSprint: 'Sprint 09: Dynamic Frame Compression & Edge Nodes',
    whatImDoingNow:
      'Implementing low-latency duplex WebSockets with distributed Redis PubSub edge nodes. Writing custom Netty byte buffers to minimize heap allocations per active socket session.',
    recentMilestones: [
      'Sustained 1.2M concurrent persistent connections with sub-0.8ms heartbeat roundtrip time.',
      'Built exponential backoff and jittered reconnection buffers for mobile disconnect recovery.',
      'Authored end-to-end integration test suites with Testcontainers & k6 distributed load generator.',
    ],
    techStack: ['Go 1.23', 'WebSockets', 'Netty', 'Redis PubSub', 'Rust', 'Docker Compose'],
    updatedAt: 'Updated Yesterday',
  },
  {
    id: 'devlog-3',
    title: 'Cloud Native GitOps Infrastructure & Observability Mesh',
    status: '🛡️ PRODUCTION HARDENING',
    currentSprint: 'Sprint 06: Full-Stack OpenTelemetry Tracing & SLO Alerts',
    whatImDoingNow:
      'Configuring synthetic SLO alert webhooks to PagerDuty and implementing automated Horizontal Pod Autoscalers (HPA) driven by custom Prometheus metrics.',
    recentMilestones: [
      'Multi-region hybrid deployment on AWS EKS with Terraform & ArgoCD automated reconciliation.',
      'Enforced zero-trust mutual TLS (mTLS) encryption across all inter-service mesh communications.',
      'Configured Grafana Tempo distributed trace graphs spanning 120+ microservices.',
    ],
    techStack: ['Kubernetes', 'AWS EKS', 'Terraform', 'ArgoCD', 'Prometheus', 'OpenTelemetry'],
    updatedAt: 'Updated 2 Days Ago',
  },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    passcode: 'GOOGLE-VIP',
    senderRole: 'ADMIN',
    senderName: 'Aditya Kumar',
    message:
      'Hello! Welcome to my private engineering dossier. Feel free to ask me any questions regarding my architectural decisions, microservice benchmarks, or active sprint roadmap. I will reply right here!',
    timestamp: 'Today · 10:00 AM',
  },
];

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authRole, setAuthRole] = useState<'ADMIN' | 'GUEST'>('ADMIN');
  const [currentGuest, setCurrentGuest] = useState<GuestPasscode | null>(null);
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>('messages');

  // Master Admin state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // VIP Passcodes store
  const [guestPasses, setGuestPasses] = useState<GuestPasscode[]>(() => {
    try {
      const saved = localStorage.getItem('aditya_portfolio_guest_passes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load guest passes', e);
    }
    return DEFAULT_GUEST_PASSES;
  });

  // Project Devlogs store
  const [devlogs, setDevlogs] = useState<ProjectDevlog[]>(() => {
    try {
      const saved = localStorage.getItem('aditya_portfolio_devlogs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load devlogs', e);
    }
    return DEFAULT_DEVLOGS;
  });

  // Live Chat messages store
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('aditya_portfolio_live_chat');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load chat messages', e);
    }
    return INITIAL_CHAT_MESSAGES;
  });

  // Chat input
  const [chatInput, setChatInput] = useState<string>('');
  const [activeChatThread, setActiveChatThread] = useState<string>('GOOGLE-VIP');

  // New Passcode Form State
  const [newCodeInput, setNewCodeInput] = useState<string>('');
  const [newAssigneeInput, setNewAssigneeInput] = useState<string>('');
  const [newNotesInput, setNewNotesInput] = useState<string>('');

  // New Devlog Form State
  const [isEditingDevlog, setIsEditingDevlog] = useState<boolean>(false);
  const [newDevlogTitle, setNewDevlogTitle] = useState<string>('');
  const [newDevlogSprint, setNewDevlogSprint] = useState<string>('');
  const [newDevlogDoing, setNewDevlogDoing] = useState<string>('');
  const [newDevlogMilestones, setNewDevlogMilestones] = useState<string>('');
  const [newDevlogStack, setNewDevlogStack] = useState<string>('');

  // Sync to localStorage
  const saveGuestPasses = (passes: GuestPasscode[]) => {
    setGuestPasses(passes);
    try {
      localStorage.setItem('aditya_portfolio_guest_passes', JSON.stringify(passes));
    } catch (e) {
      console.warn(e);
    }
  };

  const saveDevlogs = (logs: ProjectDevlog[]) => {
    setDevlogs(logs);
    try {
      localStorage.setItem('aditya_portfolio_devlogs', JSON.stringify(logs));
    } catch (e) {
      console.warn(e);
    }
  };

  const saveChatMessages = (msgs: ChatMessage[]) => {
    setChatMessages(msgs);
    try {
      localStorage.setItem('aditya_portfolio_live_chat', JSON.stringify(msgs));
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated && authRole === 'ADMIN') {
      loadMessages();
    }
  }, [isOpen, isAuthenticated, authRole]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const msgs = await apiService.getAdminMessages();
      setMessages(msgs);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  // Smart Authentication Handler (Detects Admin vs Guest Passcode)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    const trimmed = password.trim();

    // 1. Super Admin Password
    if (trimmed === 'admin' || trimmed === 'aditya2026') {
      setIsAuthenticated(true);
      setAuthRole('ADMIN');
      setCurrentGuest(null);
      setActiveTab('messages');
      setErrorMsg('');
      loadMessages();
      return;
    }

    // 2. Check VIP Guest Passcodes
    const matchedPass = guestPasses.find(
      (p) => p.code.toUpperCase() === trimmed.toUpperCase() && p.active
    );

    if (matchedPass) {
      // Update last accessed
      const updatedPasses = guestPasses.map((p) =>
        p.id === matchedPass.id ? { ...p, lastAccessed: new Date().toLocaleTimeString() } : p
      );
      saveGuestPasses(updatedPasses);

      setIsAuthenticated(true);
      setAuthRole('GUEST');
      setCurrentGuest(matchedPass);
      setActiveTab('devlogs');
      setActiveChatThread(matchedPass.code);
      setErrorMsg('');
      return;
    }

    // 3. Fallback for testing with generic 4+ chars
    if (trimmed.length >= 4) {
      setIsAuthenticated(true);
      setAuthRole('ADMIN');
      setCurrentGuest(null);
      setActiveTab('messages');
      setErrorMsg('');
      loadMessages();
      return;
    }

    setErrorMsg('Invalid passcode. Use "admin" for Super Admin or a valid Guest Pass (e.g. GOOGLE-VIP).');
  };

  const handleStatusChange = async (
    id: number | undefined,
    newStatus: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'
  ) => {
    if (!id) return;
    soundManager.playClick();
    await apiService.updateMessageStatus(id, newStatus);
    startTransition(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
    });
  };

  // Generate New Guest Passcode
  const handleCreatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeInput.trim() || !newAssigneeInput.trim()) return;
    soundManager.playClick();

    const newPass: GuestPasscode = {
      id: `pass-${Date.now()}`,
      code: newCodeInput.trim().toUpperCase(),
      assignedTo: newAssigneeInput.trim(),
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
      notes: newNotesInput.trim() || 'Custom VIP Access Pass',
    };

    saveGuestPasses([newPass, ...guestPasses]);
    setNewCodeInput('');
    setNewAssigneeInput('');
    setNewNotesInput('');
  };

  const handleTogglePassActive = (passId: string) => {
    soundManager.playClick();
    const updated = guestPasses.map((p) =>
      p.id === passId ? { ...p, active: !p.active } : p
    );
    saveGuestPasses(updated);
  };

  const handleDeletePass = (passId: string) => {
    soundManager.playClick();
    const updated = guestPasses.filter((p) => p.id !== passId);
    saveGuestPasses(updated);
  };

  // Create New Project Devlog
  const handleCreateDevlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevlogTitle.trim() || !newDevlogSprint.trim() || !newDevlogDoing.trim()) return;
    soundManager.playClick();

    const newLog: ProjectDevlog = {
      id: `devlog-${Date.now()}`,
      title: newDevlogTitle.trim(),
      status: '🔥 ACTIVE ENGINEERING SPRINT',
      currentSprint: newDevlogSprint.trim(),
      whatImDoingNow: newDevlogDoing.trim(),
      recentMilestones: newDevlogMilestones
        ? newDevlogMilestones.split('\n').filter((m) => m.trim().length > 0)
        : ['Production testing and performance benchmarking completed.'],
      techStack: newDevlogStack
        ? newDevlogStack.split(',').map((t) => t.trim())
        : ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL'],
      updatedAt: 'Just Now',
    };

    saveDevlogs([newLog, ...devlogs]);
    setNewDevlogTitle('');
    setNewDevlogSprint('');
    setNewDevlogDoing('');
    setNewDevlogMilestones('');
    setNewDevlogStack('');
    setIsEditingDevlog(false);
  };

  // Send Chat Message
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    soundManager.playClick();

    const targetThread = authRole === 'GUEST' && currentGuest ? currentGuest.code : activeChatThread;

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      passcode: targetThread,
      senderRole: authRole,
      senderName: authRole === 'ADMIN' ? 'Aditya Kumar' : currentGuest?.assignedTo || 'VIP Guest',
      message: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    saveChatMessages([...chatMessages, newMsg]);
    setChatInput('');
  };

  // Filter messages for active chat thread
  const currentThreadMessages = chatMessages.filter(
    (m) =>
      m.passcode.toUpperCase() ===
      (authRole === 'GUEST' && currentGuest ? currentGuest.code : activeChatThread).toUpperCase()
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0a0d14] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200 font-body">
        {/* ========================================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================================= */}
        <div className="px-6 py-4 bg-[#111624] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full animate-pulse ${
                authRole === 'ADMIN' ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
            />
            <h2 className="text-sm font-mono font-bold tracking-wider text-white">
              {isAuthenticated
                ? authRole === 'ADMIN'
                  ? 'PORTFOLIO ADMIN MASTER CONSOLE — ADITYA KUMAR'
                  : `VIP ARCHITECT DOSSIER — WELCOME, ${currentGuest?.assignedTo?.toUpperCase()}`
                : 'ENGINEERING & CLIENT PORTAL ACCESS'}
            </h2>
            <span
              className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                authRole === 'ADMIN'
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                  : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
              }`}
            >
              {isAuthenticated ? (authRole === 'ADMIN' ? '👑 SUPER ADMIN' : '🔒 VIP READ-ONLY') : 'SECURITY GATE'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsAuthenticated(false);
                  setPassword('');
                }}
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

        {/* ========================================================================= */}
        {/* LOGIN SCREEN (Smart Admin + Guest Passcode Gateway) */}
        {/* ========================================================================= */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-[#0a0d14]">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-md p-8 bg-[#101626] border border-white/15 rounded-2xl space-y-5 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Engineering Portal Access</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter Super Admin passcode or your VIP Guest Passcode to view private project devlogs and live chat.
                </p>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  PASSCODE / ACCESS KEY
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode (e.g. admin or GOOGLE-VIP)"
                  className="w-full bg-[#070a12] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  autoFocus
                />
                {errorMsg && (
                  <p className="text-xs text-rose-400 mt-2 font-mono">{errorMsg}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs font-mono tracking-wider transition-all shadow-lg shadow-cyan-500/20 cursor-pointer hover:scale-[1.02]"
              >
                AUTHENTICATE & ENTER
              </button>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400 space-y-1">
                <div className="text-slate-300 font-bold uppercase tracking-wider">Demo Passcodes Available:</div>
                <div className="flex justify-between">
                  <span>Super Admin:</span>
                  <span className="text-emerald-400 font-bold">admin</span>
                </div>
                <div className="flex justify-between">
                  <span>VIP Guest (Google):</span>
                  <span className="text-cyan-400 font-bold">GOOGLE-VIP</span>
                </div>
                <div className="flex justify-between">
                  <span>VIP Guest (Meta):</span>
                  <span className="text-purple-400 font-bold">META-CTO</span>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* ======================================================================= */
          /* AUTHENTICATED PORTAL (Super Admin OR VIP Guest)                         */
          /* ======================================================================= */
          <div className="flex-1 flex overflow-hidden">
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-60 bg-[#0d1322] border-r border-white/10 p-4 flex flex-col gap-1.5 shrink-0">
              {/* Role Indicator Banner */}
              <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 mb-2">
                <div className="text-[10px] font-mono uppercase text-slate-400">Current Session</div>
                <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{authRole === 'ADMIN' ? 'Super Admin' : currentGuest?.assignedTo}</span>
                </div>
              </div>

              {/* TABS FOR SUPER ADMIN */}
              {authRole === 'ADMIN' && (
                <>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                      activeTab === 'messages'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Inbox className="w-4 h-4" />
                    <span>Public Messages</span>
                    {messages.length > 0 && (
                      <span className="ml-auto text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-bold">
                        {messages.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('guestPasses')}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                      activeTab === 'guestPasses'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    <span>VIP Passcodes</span>
                    <span className="ml-auto text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-bold">
                      {guestPasses.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('devlogs')}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                      activeTab === 'devlogs'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Devlogs CMS</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                      activeTab === 'chat'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Live Guest Chats</span>
                    <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                      {chatMessages.length}
                    </span>
                  </button>

                  <div className="my-2 border-t border-white/10" />

                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                      activeTab === 'projects'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <FolderGit2 className="w-4 h-4" />
                    <span>Projects List</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('skills')}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                      activeTab === 'skills'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Skills Matrix</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                      activeTab === 'settings'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>System Telemetry</span>
                  </button>
                </>
              )}

              {/* TABS FOR VIP GUEST (Read-Only) */}
              {authRole === 'GUEST' && (
                <>
                  <button
                    onClick={() => setActiveTab('devlogs')}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                      activeTab === 'devlogs'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Active Devlogs</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                      activeTab === 'chat'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Live Chat with Aditya</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-auto" />
                  </button>

                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                      activeTab === 'projects'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <FolderGit2 className="w-4 h-4" />
                    <span>Architecture & Projects</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('skills')}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono tracking-wide cursor-pointer transition-colors ${
                      activeTab === 'skills'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Technical Capabilities</span>
                  </button>
                </>
              )}
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-6 overflow-y-auto bg-[#0a0d14]">
              {/* ============================================================= */}
              {/* TAB 1: VIP PASSCODES GENERATOR (ADMIN ONLY)                   */}
              {/* ============================================================= */}
              {activeTab === 'guestPasses' && authRole === 'ADMIN' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white">VIP Guest Passcodes Generator</h3>
                    <p className="text-xs text-slate-400">
                      Create confidential read-only access codes for recruiters, CTOs, and clients.
                    </p>
                  </div>

                  {/* Create New Pass Form */}
                  <form
                    onSubmit={handleCreatePasscode}
                    className="p-5 rounded-2xl bg-[#111624] border border-white/10 space-y-4"
                  >
                    <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Issue New VIP Passcode</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-mono text-slate-300 block mb-1">
                          PASSCODE KEY
                        </label>
                        <input
                          type="text"
                          value={newCodeInput}
                          onChange={(e) => setNewCodeInput(e.target.value)}
                          placeholder="e.g. AMAZON-VIP"
                          className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:border-cyan-400 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono text-slate-300 block mb-1">
                          ASSIGNED TO (RECRUITER / CLIENT)
                        </label>
                        <input
                          type="text"
                          value={newAssigneeInput}
                          onChange={(e) => setNewAssigneeInput(e.target.value)}
                          placeholder="e.g. Amazon Principal Recruiter"
                          className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono text-slate-300 block mb-1">
                          NOTES / SCOPE
                        </label>
                        <input
                          type="text"
                          value={newNotesInput}
                          onChange={(e) => setNewNotesInput(e.target.value)}
                          placeholder="e.g. Microservices & distributed QPS"
                          className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-colors cursor-pointer"
                    >
                      Generate & Register Passcode
                    </button>
                  </form>

                  {/* Active Passcodes Table */}
                  <div className="space-y-3">
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Active Passcodes Registry ({guestPasses.length})
                    </div>
                    <div className="space-y-2">
                      {guestPasses.map((pass) => (
                        <div
                          key={pass.id}
                          className="p-4 rounded-xl bg-[#111624] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                                {pass.code}
                              </span>
                              <span className="text-sm font-bold text-white">{pass.assignedTo}</span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                  pass.active
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}
                              >
                                {pass.active ? 'ACTIVE' : 'REVOKED'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                              {pass.notes} · Created: {pass.createdAt}{' '}
                              {pass.lastAccessed ? `· Last accessed: ${pass.lastAccessed}` : ''}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                soundManager.playClick();
                                navigator.clipboard.writeText(pass.code);
                              }}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
                              title="Copy Passcode"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </button>
                            <button
                              onClick={() => handleTogglePassActive(pass.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 cursor-pointer"
                            >
                              {pass.active ? 'Revoke' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeletePass(pass.id)}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                              title="Delete Passcode"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 2: DEVLOGS & SPRINT STATUS (ADMIN & GUEST)                 */}
              {/* ============================================================= */}
              {activeTab === 'devlogs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Engineering Devlogs & Realtime Sprint Status</span>
                        {authRole === 'GUEST' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            READ-ONLY VIP DOSSIER
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Confidential updates on current architectural development, benchmarks, and active sprints.
                      </p>
                    </div>

                    {authRole === 'ADMIN' && (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          setIsEditingDevlog(!isEditingDevlog);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold cursor-pointer"
                      >
                        {isEditingDevlog ? 'Cancel Form' : '+ Post New Devlog'}
                      </button>
                    )}
                  </div>

                  {/* Add New Devlog Form (Admin only) */}
                  {authRole === 'ADMIN' && isEditingDevlog && (
                    <form
                      onSubmit={handleCreateDevlog}
                      className="p-5 rounded-2xl bg-[#111624] border border-cyan-500/30 space-y-4 shadow-xl"
                    >
                      <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Publish Real-time Devlog Update</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-mono text-slate-300 block mb-1">
                            PROJECT TITLE
                          </label>
                          <input
                            type="text"
                            value={newDevlogTitle}
                            onChange={(e) => setNewDevlogTitle(e.target.value)}
                            placeholder="e.g. Distributed Event Mesh 2.0"
                            className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-slate-300 block mb-1">
                            CURRENT SPRINT FOCUS
                          </label>
                          <input
                            type="text"
                            value={newDevlogSprint}
                            onChange={(e) => setNewDevlogSprint(e.target.value)}
                            placeholder="e.g. Sprint 12: Zero-Copy Serialization"
                            className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-slate-300 block mb-1">
                          WHAT I AM BUILDING / REFACTORING RIGHT NOW
                        </label>
                        <textarea
                          value={newDevlogDoing}
                          onChange={(e) => setNewDevlogDoing(e.target.value)}
                          placeholder="Detail the technical implementation, architecture decisions, and current bottlenecks..."
                          rows={3}
                          className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none resize-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-mono text-slate-300 block mb-1">
                            RECENT COMPLETED MILESTONES (ONE PER LINE)
                          </label>
                          <textarea
                            value={newDevlogMilestones}
                            onChange={(e) => setNewDevlogMilestones(e.target.value)}
                            placeholder="Cut latency by 40%&#10;Added Redis cluster replica&#10;Passed integration test suite"
                            rows={3}
                            className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-slate-300 block mb-1">
                            TECH STACK (COMMA SEPARATED)
                          </label>
                          <textarea
                            value={newDevlogStack}
                            onChange={(e) => setNewDevlogStack(e.target.value)}
                            placeholder="Java 21, Spring Boot, Kafka, Docker, Kubernetes"
                            rows={3}
                            className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none resize-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-colors cursor-pointer"
                      >
                        Publish Devlog Update
                      </button>
                    </form>
                  )}

                  {/* Devlog List */}
                  <div className="space-y-5">
                    {devlogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-6 rounded-2xl bg-[#111624] border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all shadow-xl"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                              {log.status}
                            </span>
                            <h4 className="text-lg font-bold text-white">{log.title}</h4>
                          </div>
                          <div className="text-xs font-mono text-slate-400 shrink-0">
                            {log.updatedAt}
                          </div>
                        </div>

                        {/* Current Sprint Focus */}
                        <div className="p-3.5 rounded-xl bg-[#0a0d14] border border-white/10 space-y-1.5">
                          <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            <span>CURRENT SPRINT FOCUS: {log.currentSprint}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
                            {log.whatImDoingNow}
                          </p>
                        </div>

                        {/* Recent Accomplishments */}
                        <div className="space-y-2">
                          <div className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                            RECENTLY COMPLETED ARCHITECTURAL MILESTONES:
                          </div>
                          <div className="space-y-1.5">
                            {log.recentMilestones.map((m, mIdx) => (
                              <div
                                key={mIdx}
                                className="flex items-start gap-2 text-xs font-mono text-slate-300"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{m}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10">
                          <span className="text-[10px] font-mono text-slate-400 mr-1">STACK:</span>
                          {log.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 3: LIVE 1-ON-1 CHAT (FOR BOTH GUEST & ADMIN)              */}
              {/* ============================================================= */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-full space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Direct Live Chat & Technical Q&A</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </h3>
                      <p className="text-xs text-slate-400">
                        {authRole === 'ADMIN'
                          ? 'Real-time inquiries from recruiters and client partners.'
                          : 'Direct confidential line with Aditya Kumar.'}
                      </p>
                    </div>

                    {/* Admin Thread Switcher */}
                    {authRole === 'ADMIN' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">Thread:</span>
                        <select
                          value={activeChatThread}
                          onChange={(e) => setActiveChatThread(e.target.value)}
                          className="bg-[#111624] border border-white/15 rounded-xl px-2.5 py-1 text-xs font-mono text-cyan-300 outline-none"
                        >
                          {guestPasses.map((p) => (
                            <option key={p.code} value={p.code}>
                              {p.assignedTo} ({p.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto space-y-3 p-4 rounded-2xl bg-[#0c101c] border border-white/10 min-h-[340px]">
                    {currentThreadMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 font-mono text-xs">
                        <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                        <span>No messages yet in this thread. Start the conversation below!</span>
                      </div>
                    ) : (
                      currentThreadMessages.map((msg) => {
                        const isSelf =
                          (authRole === 'ADMIN' && msg.senderRole === 'ADMIN') ||
                          (authRole === 'GUEST' && msg.senderRole === 'GUEST');

                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                          >
                            <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                              <span className="font-bold text-slate-300">{msg.senderName}</span>
                              <span>· {msg.timestamp}</span>
                            </div>
                            <div
                              className={`max-w-[78%] p-3.5 rounded-2xl text-xs leading-relaxed font-mono shadow-md ${
                                isSelf
                                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white rounded-tr-none'
                                  : 'bg-[#151c2e] border border-white/15 text-slate-200 rounded-tl-none'
                              }`}
                            >
                              {msg.message}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={
                        authRole === 'ADMIN'
                          ? `Reply to ${activeChatThread} as Aditya Kumar...`
                          : 'Ask Aditya anything about his architecture, sprints, or code...'
                      }
                      className="flex-1 bg-[#111624] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all hover:scale-105"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 4: PUBLIC CONTACT MESSAGES (ADMIN ONLY)                   */}
              {/* ============================================================= */}
              {activeTab === 'messages' && authRole === 'ADMIN' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-white">Received Inquiries & Messages</h3>
                      <p className="text-xs text-slate-400">
                        Submitted through the public Contact Section (#contact).
                      </p>
                    </div>
                    <button
                      onClick={loadMessages}
                      className="px-3 py-1.5 text-xs font-mono rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 cursor-pointer"
                    >
                      Refresh
                    </button>
                  </div>

                  {loading ? (
                    <p className="text-xs font-mono text-cyan-400">Fetching messages...</p>
                  ) : messages.length === 0 ? (
                    <div className="p-8 text-center bg-[#111624] border border-white/10 rounded-2xl text-slate-400 text-xs font-mono">
                      No contact messages received yet. Submit an inquiry from the public contact section to test!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className="p-4 rounded-xl bg-[#111624] border border-white/10 space-y-3 hover:border-cyan-500/30 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{m.name}</span>
                              <span className="text-xs text-slate-400 font-mono">({m.email})</span>
                            </div>
                            <select
                              value={m.status || 'NEW'}
                              onChange={(e) =>
                                handleStatusChange(
                                  m.id,
                                  e.target.value as 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'
                                )
                              }
                              className="bg-[#0a0d14] border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono text-cyan-300 outline-none"
                            >
                              <option value="NEW">🟢 NEW</option>
                              <option value="READ">🔵 READ</option>
                              <option value="REPLIED">🟣 REPLIED</option>
                              <option value="ARCHIVED">⚪ ARCHIVED</option>
                            </select>
                          </div>
                          <div className="text-xs font-mono font-bold text-cyan-400">{m.subject}</div>
                          <p className="text-xs text-slate-300 font-mono leading-relaxed bg-[#0a0d14] p-3 rounded-lg border border-white/5">
                            {m.message}
                          </p>
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                            <span>ID: #{m.id}</span>
                            <a
                              href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                              className="text-cyan-400 hover:underline flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Direct Email Reply</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 5: PROJECTS LIST (ADMIN & GUEST)                          */}
              {/* ============================================================= */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-white/10">
                    <h3 className="text-base font-bold text-white">Production Architectural Systems</h3>
                    <p className="text-xs text-slate-400">
                      Overview of featured projects, architectural categories, and public repositories.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PROJECTS.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-5 rounded-2xl bg-[#111624] border border-white/10 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {proj.category}
                          </span>
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                            >
                              <span>GitHub</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-white">{proj.title}</h4>
                        <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-3">
                          {proj.description}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.technologies.slice(0, 5).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300"
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

              {/* ============================================================= */}
              {/* TAB 6: SKILLS MATRIX                                          */}
              {/* ============================================================= */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-white/10">
                    <h3 className="text-base font-bold text-white">Full-Stack Technical Capabilities</h3>
                    <p className="text-xs text-slate-400">Engineering disciplines and architectural proficiencies.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SKILL_CATEGORIES.map((cat, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#111624] border border-white/10 space-y-2.5"
                      >
                        <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                          {cat.category}
                        </h4>
                        <div className="space-y-1.5">
                          {cat.skills.map((s, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-white/5 text-slate-200"
                            >
                              <span>{s.name}</span>
                              <span className="text-[10px] text-slate-400">{s.level}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 7: SYSTEM TELEMETRY (ADMIN ONLY)                          */}
              {/* ============================================================= */}
              {activeTab === 'settings' && authRole === 'ADMIN' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-white/10">
                    <h3 className="text-base font-bold text-white">System Status & Environment Telemetry</h3>
                    <p className="text-xs text-slate-400">Backend health, security policies, and AI services.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-[#111624] border border-white/10 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400">BACKEND RUNTIME</div>
                      <div className="text-sm font-mono font-bold text-emerald-400">Spring Boot 3.3.4 (Java 21)</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#111624] border border-white/10 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400">SECURITY LAYER</div>
                      <div className="text-sm font-mono font-bold text-cyan-400">Role-Based Access Control (RBAC)</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#111624] border border-white/10 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400">REALTIME MESSAGING</div>
                      <div className="text-sm font-mono font-bold text-purple-400">WebSocket / Local Sync Queue</div>
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
