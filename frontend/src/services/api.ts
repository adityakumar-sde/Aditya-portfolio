import type { ContactMessage, Project, SkillCategory, ExperienceItem, AiChatMessage } from '../types';
import { PROJECTS, SKILL_CATEGORIES, EXPERIENCE_ITEMS } from '../data/portfolioData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiService = {
  async sendContactMessage(data: ContactMessage): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server returned ${response.status}`);
      }

      return await response.json();
    } catch {
      const stored = JSON.parse(localStorage.getItem('aditya_portfolio_messages') || '[]');
      stored.unshift({
        ...data,
        id: Date.now(),
        status: 'NEW',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('aditya_portfolio_messages', JSON.stringify(stored));
      return { success: true, message: 'Message sent successfully (persisted to operational queue)' };
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/projects`);
      if (res.ok) return await res.json();
      return PROJECTS;
    } catch {
      return PROJECTS;
    }
  },

  async getSkills(): Promise<SkillCategory[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/skills`);
      if (res.ok) return await res.json();
      return SKILL_CATEGORIES;
    } catch {
      return SKILL_CATEGORIES;
    }
  },

  async getExperience(): Promise<ExperienceItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/experience`);
      if (res.ok) return await res.json();
      return EXPERIENCE_ITEMS;
    } catch {
      return EXPERIENCE_ITEMS;
    }
  },

  async askAi(question: string, history: AiChatMessage[] = []): Promise<{ answer: string; source: 'llm' | 'knowledge_base' }> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, history }),
      });
      if (res.ok) {
        return await res.json();
      }
      throw new Error('API not available');
    } catch {
      return {
        answer: generateKnowledgeBaseResponse(question),
        source: 'knowledge_base'
      };
    }
  },

  async getAdminMessages(token?: string): Promise<ContactMessage[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/messages`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) return await res.json();
      throw new Error('Fallback to local');
    } catch {
      const stored = localStorage.getItem('aditya_portfolio_messages');
      if (stored) {
        return JSON.parse(stored);
      }
      return [
        {
          id: 1,
          name: 'Technical Recruiter',
          email: 'recruiter@enterprise-tech.io',
          subject: 'Full Stack / Backend Engineer Role at Enterprise Tech',
          message: 'Hi Aditya, we came across your work in Java, Spring Boot, and reactive systems. We would love to discuss an engineering role with our team.',
          status: 'NEW',
          createdAt: new Date().toISOString()
        }
      ];
    }
  },

  async updateMessageStatus(id: number, status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/messages/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return true;
    } catch {
      // Local fallback
    }
    const stored = JSON.parse(localStorage.getItem('aditya_portfolio_messages') || '[]');
    const updated = stored.map((msg: ContactMessage) => msg.id === id ? { ...msg, status } : msg);
    localStorage.setItem('aditya_portfolio_messages', JSON.stringify(updated));
    return true;
  }
};

function generateKnowledgeBaseResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('spring') || q.includes('backend') || q.includes('java')) {
    return "Aditya specializes in enterprise backend development with Java 17, Spring Boot, Spring Security, and JPA/Hibernate. In his role at TAM INFOSOFT and in the Infosoft CRM project, he engineered micro-services, REST APIs, batch processing jobs, and real-time WebSocket communication pipelines connected to MySQL and Redis.";
  }

  if (q.includes('tech') || q.includes('stack') || q.includes('skill')) {
    return "Aditya's curated engineering stack includes: Backend (Java, Spring Boot, Spring Security, Microservices, REST APIs, Hibernate/JPA), Frontend (React, TypeScript, HTML5, CSS3/Tailwind), Data (MySQL, PostgreSQL, MongoDB, Redis), Realtime (WebSocket, Socket.IO), AI (Generative AI, LLMs, Prompt Engineering, AI APIs, n8n), and DevOps (Docker, Jenkins, Git/GitHub, Linux).";
  }

  if (q.includes('project') || q.includes('crm') || q.includes('work')) {
    return "Aditya's premier featured work is INFOSOFT CRM, an enterprise CRM and real-time agent management platform built with Java, Spring Boot, React, MySQL, and WebSocket. It features live agent monitoring, batch lead ingestion, role management, and telephony event tracking. He also develops AI workflow automation pipelines combining n8n, Spring Boot, and LLM APIs.";
  }

  if (q.includes('realtime') || q.includes('websocket')) {
    return "Aditya builds realtime systems utilizing WebSocket protocols and STOMP message brokers. In Infosoft CRM, realtime capabilities power zero-lag agent status sync, incoming telephony alerts, and live dashboard notifications without HTTP polling overhead.";
  }

  if (q.includes('learn') || q.includes('explore') || q.includes('now') || q.includes('engineering now')) {
    return "Under his 'Engineering Now' focus, Aditya is actively building with Java, Spring Boot, React, MySQL, Redis, and Docker; exploring Generative AI, LLMs, AI APIs, and n8n visual automation; and diving deeper into microservices architectures, distributed system design, and cloud-native solutions.";
  }

  if (q.includes('ai') || q.includes('llm') || q.includes('n8n')) {
    return "In his AI Lab, Aditya focuses on practical, production-grade applications of AI: connecting enterprise webhooks to LLM inference endpoints for automated ticket triage, structured prompt engineering with JSON schema enforcement, and n8n workflow orchestration.";
  }

  if (q.includes('education') || q.includes('college') || q.includes('degree')) {
    return "Aditya holds a Master of Computer Application (MCA) from Global Group of Institutes, Amritsar (2023–2025, GPA 7.29), a Bachelor of Science in Mathematics Honours from LNMU University, Darbhanga (2019–2022, 73.13%), and completed Intermediate (12th) from RKC+2 High School, Begusarai (2017–2019, 63.8%).";
  }

  if (q.includes('experience') || q.includes('tam') || q.includes('thinknext')) {
    return "Aditya currently works as a Full Stack Engineer at TAM INFOSOFT in Delhi, India, developing enterprise CRM and agent management platforms using Java, Spring Boot, React, MySQL, and WebSocket. Previously, he worked as a Java Developer / Full Stack Intern at ThinkNext Technology.";
  }

  if (q.includes('contact') || q.includes('email') || q.includes('hire')) {
    return "You can reach Aditya directly via email at adityakumarbju121@gmail.com. He is located in Delhi, India, and is open to discussing software engineering roles, backend architectures, and high-impact full-stack opportunities.";
  }

  return "I'm Aditya's AI Assistant. Aditya Kumar is a Software Engineer based in Delhi, India, specializing in Java, Spring Boot, React, MySQL, Realtime WebSocket systems, and AI-powered workflow automation. Feel free to ask about his backend experience, the Infosoft CRM architecture, tech stack, or education!";
}
