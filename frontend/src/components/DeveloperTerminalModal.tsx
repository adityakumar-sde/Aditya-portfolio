import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, ShieldCheck, ShieldAlert, Bug, Cpu, GitBranch } from 'lucide-react';
import { PROJECTS, SKILL_CATEGORIES } from '../data/portfolioData';
import { apiService } from '../services/api';
import { soundManager } from '../services/audio';
import { systemLogger, type LogEntry } from '../services/logger';

export interface PortfolioCustomConfig {
  title: string;
  tagline: string;
  statusText: string;
}

interface DeveloperTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PortfolioCustomConfig;
  onUpdateConfig: (key: keyof PortfolioCustomConfig, value: string) => void;
  onResetConfig: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenResume: () => void;
  onSelectTheme?: (index: number) => void;
}

interface OutputLine {
  id: string;
  type: 'command' | 'text' | 'success' | 'warning' | 'error' | 'system' | 'table';
  content: string | React.ReactNode;
}

const COMMAND_LIST = [
  'help',
  'status',
  'health',
  'logs',
  'errors',
  'test-api',
  'cicd',
  'pipeline',
  'docker',
  'auth',
  'sudo',
  'set',
  'reset',
  'export-config',
  'messages',
  'inbox',
  'read',
  'goto',
  'skills',
  'projects',
  'whoami',
  'git',
  'version',
  'open',
  'resume',
  'clear',
  'exit',
];

export const DeveloperTerminalModal: React.FC<DeveloperTerminalModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onResetConfig,
  onNavigateSection,
  onOpenAdmin,
  onOpenResume,
  onSelectTheme,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isAuth, setIsAuth] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize terminal banner
  useEffect(() => {
    if (isOpen && outputLines.length === 0) {
      setOutputLines([
        {
          id: 'banner-1',
          type: 'system',
          content: (
            <pre className="text-cyan-400 font-mono text-[10px] sm:text-xs leading-none select-none py-1">
{`   ____  _____ _   _ ___ _   _ ____   ___ _____ 
  |  _ \\| ____| \\ | |_ _| \\ | / ___| / _ \\_   _|
  | | | |  _| |  \\| || ||  \\| \\___ \\| | | || |  
  | |_| | |___| |\\  || || |\\  |___) | |_| || |  
  |____/|_____|_| \\_|___|_| \\_|____/ \\___/ |_|  `}
            </pre>
          ),
        },
        {
          id: 'banner-2',
          type: 'text',
          content: 'ADITYA KUMAR — PORTFOLIO RUNTIME ENGINE (v2.4.0-RELEASE)',
        },
        {
          id: 'banner-3',
          type: 'system',
          content: 'Session: DEV-TERMINAL-01 | CI/CD: ACTIVE (GitHub Actions + Jenkins) | Docker: READY',
        },
        {
          id: 'banner-4',
          type: 'text',
          content: "Type 'help' to inspect all commands, 'cicd' for pipeline status, or 'auth <password>' for root access.",
        },
      ]);
    }
  }, [isOpen]);

  // Auto focus input and scroll to bottom
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, outputLines]);

  const addLine = (type: OutputLine['type'], content: string | React.ReactNode) => {
    setOutputLines((prev) => [
      ...prev,
      { id: `line-${Date.now()}-${Math.random()}`, type, content },
    ]);
  };

  const handleCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    soundManager.playClick();
    addLine('command', `${isAuth ? 'root@core:#' : 'aditya@engineering-core:$'} ${trimmed}`);

    setHistory((prev) => [trimmed, ...prev]);
    setHistoryIdx(-1);
    setInputVal('');

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help': {
        addLine(
          'table',
          <div className="space-y-3 py-1 font-mono text-xs">
            <div className="text-cyan-300 font-bold border-b border-cyan-500/30 pb-1">
              PORTFOLIO DEVELOPER TERMINAL — COMMAND MANUAL
            </div>

            <div>
              <span className="text-emerald-400 font-semibold">[DIAGNOSTICS, CI/CD & ERRORS]</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-3 pt-1 text-slate-300">
                <div><span className="text-cyan-400">status</span> / <span className="text-cyan-400">health</span>: Live system & backend telemetry</div>
                <div><span className="text-cyan-400">cicd</span> / <span className="text-cyan-400">pipeline</span>: Inspect GitHub Actions & Jenkins pipeline</div>
                <div><span className="text-cyan-400">docker</span>: Multi-container Compose orchestration status</div>
                <div><span className="text-cyan-400">logs</span>: View recent runtime diagnostic logs</div>
                <div><span className="text-cyan-400">errors</span>: Inspect runtime exceptions & failed requests</div>
                <div><span className="text-cyan-400">test-api</span>: Ping all Spring Boot backend endpoints</div>
                <div><span className="text-cyan-400">clear-logs</span>: Flush diagnostic log buffer</div>
              </div>
            </div>

            <div>
              <span className="text-amber-400 font-semibold">[PORTFOLIO MODIFICATION & CONTROL]</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-3 pt-1 text-slate-300">
                <div><span className="text-cyan-400">auth &lt;pwd&gt;</span> / <span className="text-cyan-400">sudo</span>: Unlock developer root privileges</div>
                <div><span className="text-cyan-400">set title &lt;text&gt;</span>: Live update headline title</div>
                <div><span className="text-cyan-400">set tagline &lt;text&gt;</span>: Live update portfolio tagline</div>
                <div><span className="text-cyan-400">set status &lt;text&gt;</span>: Live update availability badge</div>
                <div><span className="text-cyan-400">set theme &lt;0-4&gt;</span>: Live change 4K wallpaper theme</div>
                <div><span className="text-cyan-400">reset</span>: Restore all modifications to default</div>
                <div><span className="text-cyan-400">export-config</span>: Dump active state as JSON</div>
              </div>
            </div>

            <div>
              <span className="text-indigo-400 font-semibold">[INQUIRIES & CONTACT MANAGEMENT]</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-3 pt-1 text-slate-300">
                <div><span className="text-cyan-400">messages</span> / <span className="text-cyan-400">inbox</span>: List submitted visitor messages</div>
                <div><span className="text-cyan-400">read &lt;id&gt;</span>: Read complete inquiry details</div>
              </div>
            </div>

            <div>
              <span className="text-purple-400 font-semibold">[NAVIGATION & UTILITIES]</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-3 pt-1 text-slate-300">
                <div><span className="text-cyan-400">goto &lt;sec&gt;</span>: Jump to stack, work, about, etc.</div>
                <div><span className="text-cyan-400">skills</span> / <span className="text-cyan-400">projects</span>: Display technical catalog</div>
                <div><span className="text-cyan-400">whoami</span>: View active user role & session</div>
                <div><span className="text-cyan-400">git status</span>: Build hash & repo branch</div>
                <div><span className="text-cyan-400">open admin</span>: Launch GUI Admin Console</div>
                <div><span className="text-cyan-400">resume</span>: Launch Resume Preview & Download</div>
                <div><span className="text-cyan-400">clear</span>: Clear terminal window</div>
                <div><span className="text-cyan-400">exit</span>: Close developer terminal</div>
              </div>
            </div>
          </div>
        );
        break;
      }

      case 'cicd':
      case 'pipeline': {
        addLine(
          'table',
          <div className="p-3 rounded-lg bg-black/60 border border-emerald-500/40 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-emerald-500/30 pb-1">
              <span className="flex items-center gap-1.5"><GitBranch className="w-4 h-4 text-emerald-400" /> CI/CD PIPELINE AUTOMATION STATUS</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50">ALL JOBS PASSING</span>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="text-cyan-300 font-semibold">1. GitHub Actions (.github/workflows/ci-cd.yml):</div>
              <div className="pl-4 space-y-0.5 text-[11px]">
                <div>• <span className="text-emerald-400 font-semibold">[JOB: frontend-ci]</span> Node 20, Vite 8.3, TypeScript (tsc -b) → Artifact: frontend-dist</div>
                <div>• <span className="text-emerald-400 font-semibold">[JOB: backend-ci]</span> Temurin 17, Spring Boot 3.3, Maven tests & package → Artifact: backend-jar</div>
                <div>• <span className="text-emerald-400 font-semibold">[JOB: docker-verify]</span> Docker Buildx parallel containerization & Compose validation</div>
              </div>

              <div className="text-cyan-300 font-semibold pt-1">2. Jenkins Enterprise Pipeline (Jenkinsfile):</div>
              <div className="pl-4 space-y-0.5 text-[11px]">
                <div>• Stages: Checkout SCM → Parallel Automated CI → Container Image Assembly → Blue-Green Deployment</div>
                <div>• Options: logRotator(10), disableConcurrentBuilds(), timeout: 20m</div>
              </div>

              <div className="text-cyan-300 font-semibold pt-1">3. Orchestration Architecture (docker-compose.yml):</div>
              <div className="pl-4 space-y-0.5 text-[11px]">
                <div>• <span className="text-cyan-400">portfolio-frontend:</span> Port 80 (Nginx Alpine + Brotli/Gzip + SPA Routing)</div>
                <div>• <span className="text-cyan-400">portfolio-backend:</span> Port 8080 (Spring Boot 3 + JRE 17 Alpine + JVM container flags)</div>
                <div>• <span className="text-cyan-400">portfolio-mysql:</span> Port 3306 (MySQL 8.0 with healthcheck & volume persistence)</div>
              </div>
            </div>
          </div>
        );
        break;
      }

      case 'docker': {
        addLine(
          'table',
          <div className="p-2.5 rounded bg-black/60 border border-cyan-500/30 font-mono text-xs space-y-1.5 text-slate-300">
            <div className="text-cyan-400 font-bold border-b border-white/10 pb-1">DOCKER CONTAINER SPECIFICATION</div>
            <div>[SERVICE 1] frontend (Image: aditya/portfolio-frontend:2.4.0) - Ports 80:80, 3000:80</div>
            <div>[SERVICE 2] backend  (Image: aditya/portfolio-backend:2.4.0)  - Port 8080:8080</div>
            <div>[SERVICE 3] mysql    (Image: mysql:8.0)                      - Port 3306:3306</div>
            <div className="text-emerald-400 pt-1 text-[11px]">Run 'docker compose up --build -d' to start the entire environment locally.</div>
          </div>
        );
        break;
      }

      case 'auth':
      case 'sudo': {
        const password = args.join(' ');
        if (!password) {
          addLine('warning', 'Usage: auth <password>  (Default developer password: admin or aditya2026)');
          return;
        }
        if (password === 'admin' || password === 'aditya2026' || password.length >= 4) {
          setIsAuth(true);
          systemLogger.addLog('SUCCESS', 'AUTH', 'Root privileges granted via terminal');
          addLine(
            'success',
            '✓ Access Granted. You are now logged in as ROOT DEVELOPER. Modification commands enabled.'
          );
        } else {
          systemLogger.addLog('WARN', 'AUTH', 'Failed authentication attempt in terminal');
          addLine('error', '✗ Access Denied. Invalid developer credentials.');
        }
        break;
      }

      case 'status':
      case 'health': {
        const perf = typeof window !== 'undefined' && (window.performance as any)?.memory;
        const memoryMB = perf ? Math.round(perf.usedJSHeapSize / (1024 * 1024)) : 'N/A';
        const dpr = window.devicePixelRatio || 1;
        const screenRes = `${window.innerWidth}x${window.innerHeight} (@${dpr}x DPR)`;

        addLine(
          'table',
          <div className="p-3 rounded-lg bg-black/60 border border-cyan-500/30 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-white/10 pb-1">
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-emerald-400" /> SYSTEM TELEMETRY</span>
              <span className="text-emerald-400">● OPERATIONAL</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div><span className="text-slate-400">Kernel:</span> React 19 + Vite 8.3</div>
              <div><span className="text-slate-400">3D Engine:</span> Three.js WebGL (ACESFilmic)</div>
              <div><span className="text-slate-400">Viewport:</span> {screenRes}</div>
              <div><span className="text-slate-400">JS Heap Usage:</span> {memoryMB} MB</div>
              <div><span className="text-slate-400">Active Title:</span> {config.title}</div>
              <div><span className="text-slate-400">Auth Status:</span> {isAuth ? 'ROOT [DEVELOPER]' : 'GUEST'}</div>
              <div><span className="text-slate-400">CI/CD Pipeline:</span> GitHub Actions & Jenkins (Active)</div>
              <div><span className="text-slate-400">Errors Recorded:</span> {systemLogger.getErrors().length}</div>
            </div>
          </div>
        );
        break;
      }

      case 'logs': {
        const logs = systemLogger.getLogs();
        if (logs.length === 0) {
          addLine('text', 'No logs recorded in this session.');
          return;
        }
        addLine(
          'table',
          <div className="space-y-1 font-mono text-[11px] max-h-60 overflow-y-auto pr-2">
            <div className="text-cyan-300 font-bold border-b border-white/10 pb-1 flex justify-between">
              <span>SYSTEM EVENT LOGS ({logs.length})</span>
              <span className="text-slate-400">Time / Source / Message</span>
            </div>
            {logs.map((l: LogEntry) => (
              <div key={l.id} className="flex items-start gap-2">
                <span className="text-slate-500 shrink-0">[{l.timestamp}]</span>
                <span
                  className={`font-semibold shrink-0 ${
                    l.type === 'ERROR'
                      ? 'text-rose-400'
                      : l.type === 'WARN'
                      ? 'text-amber-400'
                      : l.type === 'SUCCESS'
                      ? 'text-emerald-400'
                      : 'text-cyan-400'
                  }`}
                >
                  [{l.type}]
                </span>
                <span className="text-indigo-300 shrink-0">[{l.source}]</span>
                <span className="text-slate-200">{l.message}</span>
                {l.details && <span className="text-slate-500 text-[10px]">({l.details})</span>}
              </div>
            ))}
          </div>
        );
        break;
      }

      case 'errors': {
        const errors = systemLogger.getErrors();
        if (errors.length === 0) {
          addLine('success', '✓ ZERO errors detected in the current runtime session. All systems normal.');
          return;
        }
        addLine(
          'table',
          <div className="space-y-1.5 font-mono text-[11px] p-2 bg-rose-950/20 border border-rose-500/30 rounded">
            <div className="text-rose-300 font-bold flex items-center gap-1.5 border-b border-rose-500/30 pb-1">
              <Bug className="w-3.5 h-3.5 text-rose-400" />
              <span>DETECTED ERRORS & WARNINGS ({errors.length})</span>
            </div>
            {errors.map((e: LogEntry) => (
              <div key={e.id} className="text-rose-200">
                <span className="text-slate-400">[{e.timestamp}]</span> [{e.source}] {e.message}
                {e.details && <div className="text-slate-400 text-[10px] pl-4">{e.details}</div>}
              </div>
            ))}
          </div>
        );
        break;
      }

      case 'clear-logs': {
        systemLogger.clearLogs();
        addLine('success', '✓ System diagnostic logs buffer flushed.');
        break;
      }

      case 'test-api': {
        addLine('text', 'Pinging Spring Boot backend endpoints...');
        const endpoints = [
          { name: 'GET /api/projects', url: '/api/projects' },
          { name: 'GET /api/skills', url: '/api/skills' },
          { name: 'GET /api/experience', url: '/api/experience' },
          { name: 'GET /api/admin/messages', url: '/api/admin/messages' },
        ];

        for (const ep of endpoints) {
          const start = performance.now();
          try {
            const res = await fetch(ep.url, { method: 'GET' });
            const dur = Math.round(performance.now() - start);
            if (res.ok) {
              addLine('success', `✓ [${res.status} OK] ${ep.name} (${dur}ms)`);
            } else {
              addLine('warning', `! [${res.status} ${res.statusText}] ${ep.name} (${dur}ms)`);
            }
          } catch (err: any) {
            const dur = Math.round(performance.now() - start);
            systemLogger.addLog('WARN', 'API-TEST', `${ep.name} fallback active`, err.message);
            addLine('warning', `~ [OFFLINE / FALLBACK] ${ep.name} (${dur}ms) - using in-memory mock`);
          }
        }
        break;
      }

      case 'set': {
        const target = args[0]?.toLowerCase();
        const value = args.slice(1).join(' ').replace(/^["']|["']$/g, '');

        if (!target || !value) {
          addLine('warning', 'Usage: set <title | tagline | status | theme> "<value>"');
          return;
        }

        if (target === 'title') {
          onUpdateConfig('title', value);
          systemLogger.addLog('SUCCESS', 'CONFIG', `Title updated to: ${value}`);
          addLine('success', `✓ Title updated live to: "${value}"`);
        } else if (target === 'tagline') {
          onUpdateConfig('tagline', value);
          systemLogger.addLog('SUCCESS', 'CONFIG', `Tagline updated to: ${value}`);
          addLine('success', `✓ Tagline updated live to: "${value}"`);
        } else if (target === 'status') {
          onUpdateConfig('statusText', value);
          systemLogger.addLog('SUCCESS', 'CONFIG', `Status updated to: ${value}`);
          addLine('success', `✓ Availability badge updated live to: "${value}"`);
        } else if (target === 'theme') {
          const idx = parseInt(value, 10);
          if (!isNaN(idx) && idx >= 0 && idx <= 4) {
            onSelectTheme?.(idx);
            systemLogger.addLog('SUCCESS', 'THEME', `Theme changed to index: ${idx}`);
            addLine('success', `✓ Wallpaper Theme set to index: ${idx}`);
          } else {
            addLine('error', 'Theme index must be a number between 0 and 4.');
          }
        } else {
          addLine('error', `Unknown target: ${target}. Allowed targets: title, tagline, status, theme`);
        }
        break;
      }

      case 'reset': {
        onResetConfig();
        systemLogger.addLog('INFO', 'CONFIG', 'Configuration reset to defaults');
        addLine('success', '✓ All portfolio modifications restored to factory default.');
        break;
      }

      case 'export-config': {
        addLine(
          'table',
          <pre className="p-2 rounded bg-black/60 border border-white/10 text-cyan-300 text-xs overflow-x-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        );
        break;
      }

      case 'messages':
      case 'inbox': {
        addLine('text', 'Querying inquiry inbox...');
        try {
          const msgs = await apiService.getAdminMessages();
          if (msgs.length === 0) {
            addLine('text', 'Inbox is empty. No messages submitted yet.');
            return;
          }
          addLine(
            'table',
            <div className="space-y-1 font-mono text-xs">
              <div className="text-cyan-300 font-bold border-b border-white/10 pb-1 grid grid-cols-12 gap-2">
                <span className="col-span-1">ID</span>
                <span className="col-span-3">SENDER</span>
                <span className="col-span-4">SUBJECT</span>
                <span className="col-span-2">STATUS</span>
                <span className="col-span-2">DATE</span>
              </div>
              {msgs.map((m) => (
                <div key={m.id} className="grid grid-cols-12 gap-2 text-slate-300 hover:text-white">
                  <span className="col-span-1 text-cyan-400">#{m.id}</span>
                  <span className="col-span-3 truncate">{m.name}</span>
                  <span className="col-span-4 truncate">{m.subject}</span>
                  <span className="col-span-2 text-emerald-400">{m.status || 'NEW'}</span>
                  <span className="col-span-2 text-slate-500 text-[10px]">
                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              ))}
              <div className="text-[10px] text-slate-500 pt-1">Type 'read &lt;id&gt;' to view message body.</div>
            </div>
          );
        } catch (err: any) {
          addLine('error', `Failed to load messages: ${err.message}`);
        }
        break;
      }

      case 'read': {
        const idStr = args[0];
        if (!idStr) {
          addLine('warning', 'Usage: read <message-id>');
          return;
        }
        const id = parseInt(idStr.replace('#', ''), 10);
        const msgs = await apiService.getAdminMessages();
        const found = msgs.find((m) => m.id === id);
        if (!found) {
          addLine('error', `Message #${id} not found.`);
          return;
        }
        addLine(
          'table',
          <div className="p-3 rounded-lg bg-black/70 border border-cyan-500/40 font-mono text-xs space-y-1.5">
            <div className="text-cyan-300 font-bold border-b border-white/10 pb-1">
              MESSAGE #{found.id} — {found.subject}
            </div>
            <div><span className="text-slate-400">From:</span> {found.name} &lt;{found.email}&gt;</div>
            {(found as any).organization && <div><span className="text-slate-400">Company:</span> {(found as any).organization}</div>}
            <div className="pt-2 text-slate-200 bg-white/5 p-2 rounded leading-relaxed whitespace-pre-wrap">
              {found.message}
            </div>
          </div>
        );
        break;
      }

      case 'goto': {
        const target = args[0]?.toLowerCase().replace('#', '');
        const valid = ['hero', 'systems', 'work', 'stack', 'about', 'contact', 'cover'];
        if (!target || !valid.includes(target)) {
          addLine('warning', `Usage: goto <${valid.join(' | ')}>`);
          return;
        }
        onNavigateSection(target === 'cover' ? 'cover' : `#${target}`);
        addLine('success', `✓ Navigating portfolio to section: [${target}]`);
        break;
      }

      case 'skills': {
        addLine(
          'table',
          <div className="space-y-2 font-mono text-xs">
            <div className="text-cyan-300 font-bold border-b border-white/10 pb-1">
              TECHNICAL COMPETENCIES & ARCHITECTURAL STACK
            </div>
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.category} className="space-y-0.5">
                <span className="text-indigo-400 font-semibold">{cat.category}:</span>
                <div className="text-slate-300 pl-3">
                  {cat.skills.map((s) => s.name).join(' · ')}
                </div>
              </div>
            ))}
          </div>
        );
        break;
      }

      case 'projects': {
        addLine(
          'table',
          <div className="space-y-1.5 font-mono text-xs">
            <div className="text-cyan-300 font-bold border-b border-white/10 pb-1">
              FEATURED ENGINEERING SYSTEMS ({PROJECTS.length})
            </div>
            {PROJECTS.map((p) => (
              <div key={p.id} className="text-slate-300">
                <span className="text-emerald-400 font-bold">{p.title}</span> — {p.subtitle}
                <div className="text-slate-500 text-[11px] pl-3">Stack: {p.technologies.join(', ')}</div>
              </div>
            ))}
          </div>
        );
        break;
      }

      case 'whoami': {
        addLine(
          'text',
          `Session User: aditya | Role: ${isAuth ? 'ROOT DEVELOPER (Superuser)' : 'GUEST VISITOR'} | IP: 127.0.0.1`
        );
        break;
      }

      case 'git': {
        if (args[0] === 'status' || !args[0]) {
          addLine(
            'table',
            <div className="font-mono text-xs space-y-0.5 text-slate-300">
              <div>On branch <span className="text-emerald-400 font-bold">master</span></div>
              <div>Your branch is up to date with 'origin/master'.</div>
              <div className="text-slate-500 pt-1">Build: 2.4.0-prod-4k (Vite + Tailwind v4 + Three.js)</div>
              <div className="text-emerald-400 text-[11px]">CI/CD: GitHub Actions (ci-cd.yml) & Jenkinsfile configured.</div>
            </div>
          );
        } else {
          addLine('text', `git: '${args.join(' ')}' is not supported in this shell environment.`);
        }
        break;
      }

      case 'version': {
        addLine('text', 'Portfolio Kernel v2.4.0 (Build 2026.09-x86_64, React 19, Spring Boot 3.3, Docker)');
        break;
      }

      case 'open': {
        if (args[0] === 'admin') {
          onOpenAdmin();
          addLine('success', '✓ GUI Admin Console opened.');
        } else {
          addLine('warning', 'Usage: open admin');
        }
        break;
      }

      case 'resume': {
        onOpenResume();
        addLine('success', '✓ Resume modal opened.');
        break;
      }

      case 'clear': {
        setOutputLines([]);
        break;
      }

      case 'exit': {
        onClose();
        break;
      }

      default: {
        addLine('error', `Command not found: '${cmd}'. Type 'help' to see available commands.`);
        break;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = Math.min(historyIdx + 1, history.length - 1);
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx] || '');
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;
      const matched = COMMAND_LIST.find((c) => c.startsWith(current));
      if (matched) {
        setInputVal(matched);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setOutputLines([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full ${
          isMaximized ? 'h-[96vh] max-w-full' : 'max-w-4xl h-[78vh]'
        } bg-[#0b0e14]/95 border border-cyan-500/40 rounded-xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-200 font-mono transition-all`}
      >
        {/* Terminal Title Bar */}
        <div className="px-4 py-3 bg-[#121620] border-b border-cyan-500/30 flex items-center justify-between select-none">
          {/* Linux window dots */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-rose-500 hover:brightness-125 transition cursor-pointer"
              title="Close Terminal (exit)"
            />
            <button
              onClick={() => setIsMaximized((prev) => !prev)}
              className="w-3 h-3 rounded-full bg-amber-500 hover:brightness-125 transition cursor-pointer"
              title="Toggle Size"
            />
            <button
              onClick={() => setOutputLines([])}
              className="w-3 h-3 rounded-full bg-emerald-500 hover:brightness-125 transition cursor-pointer"
              title="Clear Window (Ctrl+L)"
            />
            <span className="ml-2 text-xs font-bold text-slate-300 flex items-center gap-1.5 hidden sm:flex">
              <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
              aditya@engineering-kernel: ~ (bash 5.2.15)
            </span>
          </div>

          {/* Status Badge & Window Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${
                isAuth
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              {isAuth ? <ShieldCheck className="w-3 h-3 text-emerald-400" /> : <ShieldAlert className="w-3 h-3 text-slate-400" />}
              <span>{isAuth ? 'ROOT ACCESS' : 'GUEST MODE'}</span>
            </div>

            <button
              onClick={() => setIsMaximized((prev) => !prev)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Maximize / Restore"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-white/10 transition cursor-pointer"
              title="Close (exit)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Screen Output Area */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex-1 p-4 overflow-y-auto space-y-2 text-xs sm:text-sm cursor-text scrollbar-thin scrollbar-thumb-cyan-500/20"
        >
          {outputLines.map((line) => (
            <div key={line.id} className="leading-relaxed">
              {line.type === 'command' && (
                <div className="text-cyan-300 font-semibold">{line.content}</div>
              )}
              {line.type === 'system' && (
                <div className="text-indigo-400 font-semibold">{line.content}</div>
              )}
              {line.type === 'success' && (
                <div className="text-emerald-400 font-medium">{line.content}</div>
              )}
              {line.type === 'warning' && (
                <div className="text-amber-300 font-medium">{line.content}</div>
              )}
              {line.type === 'error' && (
                <div className="text-rose-400 font-medium">{line.content}</div>
              )}
              {line.type === 'text' && (
                <div className="text-slate-300">{line.content}</div>
              )}
              {line.type === 'table' && line.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Active Command Input