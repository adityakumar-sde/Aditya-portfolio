export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  source: string;
  message: string;
  details?: string;
}

class SystemLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 50;

  constructor() {
    this.addLog('INFO', 'SYSTEM', 'Portfolio runtime initialized');
    this.setupGlobalHandlers();
  }

  private setupGlobalHandlers() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.addLog('ERROR', 'RUNTIME', event.message, `${event.filename}:${event.lineno}`);
    });

    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason ? String(event.reason.message || event.reason) : 'Unknown promise rejection';
      this.addLog('ERROR', 'PROMISE', reason);
    });
  }

  addLog(type: LogEntry['type'], source: string, message: string, details?: string) {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      source,
      message,
      details,
    };
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getErrors(): LogEntry[] {
    return this.logs.filter((l) => l.type === 'ERROR' || l.type === 'WARN');
  }

  clearLogs() {
    this.logs = [];
    this.addLog('INFO', 'SYSTEM', 'Diagnostic logs cleared');
  }
}

export const systemLogger = new SystemLogger();
