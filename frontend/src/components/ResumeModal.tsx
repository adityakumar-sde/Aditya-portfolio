import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Mail, Phone, Plus, Printer, RotateCcw, Trash2, X } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { EDUCATION_ITEMS, EXPERIENCE_ITEMS, PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES } from '../data/portfolioData';
import type { EducationItem, ExperienceItem } from '../types';
import { soundManager } from '../services/audio';
import { openGmailCompose } from '../utils/email';
import './ResumeModal.css';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ResumeTemplate = 'classic' | 'professional' | 'compact';

interface ResumeProject {
  id: string;
  title: string;
  period?: string;
  kind?: 'Professional' | 'Academic' | 'Independent';
  technologies: string[];
  highlights: string[];
}

interface ResumeDraft {
  name: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  summary: string;
  skills: string;
  additionalProjects: string;
  certifications: string;
  publicationTitle: string;
  publicationDetails: string;
  projects: ResumeProject[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

const createDefaultDraft = (): ResumeDraft => ({
  name: PERSONAL_INFO.name,
  title: 'Software Engineer | Java & Spring Boot | Full Stack Development | Enterprise CRM & Telephony',
  phone: '+91 7808601346',
  email: PERSONAL_INFO.email,
  location: PERSONAL_INFO.location,
  githubUrl: PERSONAL_INFO.githubUrl,
  linkedinUrl: PERSONAL_INFO.linkedinUrl,
  summary: 'Software Developer at TAM Infosoft building enterprise CRM and dialing software across Java/Spring Boot services, web interfaces, relational databases, and Asterisk telephony. Skilled in React, REST APIs, Hibernate/JPA, MySQL, and AMI/CTI; experienced in business workflows, SQL troubleshooting, legacy integrations, and application debugging. Interested in scalable backend architecture and AI-powered automation.',
  skills: `Programming: Java, JavaScript, SQL
Backend Development: Spring Boot, Spring MVC, Hibernate, JPA, REST APIs, Microservices
Frontend Development: React.js, HTML5, CSS3, Bootstrap, JSP
Databases: MySQL, Relational Database Design, SQL Query Troubleshooting
Telephony & Contact Center: Asterisk, AMI, CTI, Dialer Workflows
Tools & Platforms: Git, GitHub, Maven, Docker, Jenkins, Postman, Linux, AWS, Jira
Currently Learning: Java Concurrency, Spring Security, System Design, TypeScript, AI Agents, LLM Integration`,
  additionalProjects: 'Hospital Management System | E-Commerce Application | Snake Game (Java, Swing)',
  certifications: 'Java Full Stack Development — ThinkNext Technology Pvt. Ltd.\nJava SE and EE Training — Oracle\nCode with Success — Novi Tech / Code Alpha',
  publicationTitle: 'The Road to Artificial General Intelligence: Key Challenges and Opportunities',
  publicationDetails: 'International Research Journal of Modernization in Engineering Technology and Science (IRJMETS), May 2025 | Paper ID: IRJMETS70500206748',
  projects: [
    {
      id: 'tam-dialer-platform',
      title: 'Enterprise Dialing Software Platform',
      period: '2026 - Present',
      kind: 'Professional',
      technologies: ['Java', 'Spring Boot', 'Hibernate/JPA', 'JSP', 'Microservices', 'Asterisk', 'AMI', 'CTI', 'Bootstrap'],
      highlights: ['Agent Master, service management/mapping, lead upload, batch maintenance, admin workflows, and Asterisk/AMI/CTI integrations.'],
    },
    {
      id: 'ticket-booking',
      title: 'Ticket Booking System',
      period: 'Mar 2025 - Dec 2025',
      kind: 'Academic',
      technologies: [],
      highlights: ['Academic project covering event discovery, seat selection, booking, and transaction workflows.'],
    },
    {
      id: 'ai-3d-portfolio',
      title: 'AI-Enhanced 3D Developer Portfolio',
      period: 'Personal Project',
      kind: 'Independent',
      technologies: ['React', 'TypeScript', 'Three.js', 'Spring Boot APIs', 'WebSocket', 'LLM APIs'],
      highlights: ['Built a React/Three.js portfolio with Spring Boot AI assistant APIs, contact/admin workflows, music player, and responsive content.'],
    },
  ],
  experience: EXPERIENCE_ITEMS.slice(0, 2).map((item, index) => ({
    ...item,
    role: index === 0 ? 'Software Developer' : 'Java Full Stack Development Intern',
    period: index === 0 ? '2026 - Present' : '',
    location: index === 0 ? 'Delhi, India' : item.location,
    technologies: [...item.technologies],
    responsibilities: index === 0
      ? [
        'Develop enterprise CRM and dialing software with Java, Spring Boot, React, JavaScript, and MySQL.',
        'Implement agent/service management, mapping, lead upload, batch maintenance, and admin workflows with REST APIs.',
        'Troubleshoot SQL and legacy integrations; debug frontend, backend, and deployment issues.',
        'Integrate Asterisk using AMI/CTI concepts; contribute to monitoring and real-time agent-status features.',
      ]
      : [
        'Built Spring Boot and JPA backend services integrated with REST APIs.',
        'Developed React interfaces and connected frontend workflows to backend endpoints.',
        'Contributed to debugging, unit testing, and full-stack refactoring.',
      ],
    highlights: [...item.highlights],
  })),
  education: EDUCATION_ITEMS.map((item) => ({ ...item })),
});

const createPreviousDefaultProjects = (): ResumeProject[] => PROJECTS.filter((project) => project.featured).slice(0, 2).map((project) => ({
  id: project.id,
  title: project.title,
  technologies: [...project.technologies],
  highlights: project.id === 'infosoft-crm'
    ? [
      'Built layered CRM services with REST APIs, WebSocket notifications, JPA/Hibernate, and MySQL.',
      'Implemented agent state sync, role-based access control, batch lead processing, and query optimization.',
    ]
    : [
      'Integrated Spring Boot webhooks with LLM APIs and n8n for automated request triage.',
      'Added structured JSON validation, retries, and fallback handling for reliable API workflows.',
    ],
}));

const createPreviousDefaultExperience = (): ExperienceItem[] => EXPERIENCE_ITEMS.slice(0, 2).map((item, index) => ({
  ...item,
  technologies: [...item.technologies],
  responsibilities: index === 0
    ? [
      'Developed Java/Spring Boot CRM and agent-management features backed by MySQL.',
      'Built REST APIs and WebSocket notifications; optimized batch jobs, schemas, and queries.',
    ]
    : [
      'Built Spring Boot/JPA backend services and React interfaces integrated with REST APIs.',
      'Contributed to unit testing, debugging, and full-stack code refactoring.',
    ],
  highlights: [...item.highlights],
}));

const createPreviousDialerProjects = (): ResumeProject[] => [{
  id: 'tam-dialer-platform',
  title: 'Enterprise Dialing Software Platform',
  period: 'Ongoing',
  technologies: ['Java', 'Spring Boot', 'Hibernate/JPA', 'JSP', 'Microservices', 'Asterisk', 'AMI', 'CTI', 'Bootstrap'],
  highlights: [
    'Contribute to an integrated dialing platform connecting web-based agent workflows, backend services, and telephony systems.',
    'Work across frontend, Java services, and Asterisk integrations using AMI and CTI.',
  ],
}];

const createPreviousFullProjects = (): ResumeProject[] => [
  { id: 'tam-dialer-platform', title: 'Enterprise Dialing Software Platform', period: 'Ongoing', technologies: ['Java', 'Spring Boot', 'Hibernate/JPA', 'JSP', 'Microservices', 'Asterisk', 'AMI', 'CTI', 'Bootstrap'], highlights: ['Contribute across web interfaces, Java services, and Asterisk telephony integrations for an enterprise dialing platform.'] },
  { id: 'ecommerce-application', title: 'E-Commerce Application', period: 'Feb 2024 - Dec 2025', technologies: ['JavaScript', 'REST APIs', 'SQL'], highlights: ['Designed catalog, cart, checkout, authentication, product management, and order workflows.'] },
  { id: 'hospital-management', title: 'Hospital Management System', period: 'Aug 2024 - Dec 2024', technologies: [], highlights: ['Modeled patient, doctor, appointment, prescription, and staff workflows across UI, backend, and database layers.'] },
  { id: 'ticket-booking', title: 'Ticket Booking System', period: 'Mar 2025 - Dec 2025', technologies: [], highlights: ['Designed event discovery, seat selection, booking, payment, and transaction workflows.'] },
  { id: 'snake-game', title: 'Snake Game', period: 'Mar 2024 - Apr 2024', technologies: ['Java', 'Swing'], highlights: ['Built grid-based gameplay with movement controls and score tracking.'] },
];

const createPreviousDialerExperience = (): ExperienceItem[] => EXPERIENCE_ITEMS.slice(0, 2).map((item, index) => ({
  ...item,
  role: index === 0 ? 'Software Engineer' : item.role,
  technologies: [...item.technologies],
  responsibilities: index === 0
    ? [
      'Contribute to dialing software spanning web frontend, Java backend services, and telephony integrations.',
      'Work with HTML, CSS, JavaScript, Bootstrap, JSP, Spring Boot, Hibernate/JPA, microservices, Asterisk, AMI, and CTI.',
    ]
    : [
      'Built Spring Boot/JPA backend services and React interfaces integrated with REST APIs.',
      'Contributed to unit testing, debugging, and full-stack code refactoring.',
    ],
  highlights: [...item.highlights],
}));

const loadDraft = (): ResumeDraft => {
  try {
    const savedDraft = window.localStorage.getItem('portfolio-resume-draft');
    if (!savedDraft) return createDefaultDraft();

    const optimizedDefaults = createDefaultDraft();
    const saved = JSON.parse(savedDraft) as Partial<ResumeDraft>;
    const legacySkills = SKILL_CATEGORIES.flatMap((category) => category.skills.map((skill) => skill.name)).join(', ');
    const previousSummary = 'Software Engineer building enterprise CRM and AI automation systems with Java and Spring Boot. Skilled in REST APIs, React, WebSocket, MySQL, JPA/Hibernate, Docker, and CI/CD.';
    const previousDialerSummary = 'Software Engineer at TAM Infosoft contributing to dialing software across web interfaces, Java/Spring Boot services, and Asterisk telephony integrations. Experienced with AMI, CTI, Hibernate/JPA, JSP, and microservices; exploring AI/ML and AI-agent capabilities for future dialer workflows.';
    const previousCurrentSummary = 'Software Developer at TAM Infosoft working on dialing software across web interfaces, Java/Spring Boot services, and Asterisk telephony integrations. Skilled in AMI, CTI, Hibernate/JPA, JSP, microservices, and full-stack development; exploring AI/ML and AI agents for future dialer workflows.';
    const previousSkills = 'Java, Spring Boot, Spring MVC, REST API Development, Microservices, React, TypeScript, MySQL, Redis, JPA, Hibernate, WebSocket, STOMP, Docker, Jenkins, CI/CD, Batch Processing, API Design, Role-Based Access Control (RBAC), JUnit, Mockito';
    const previousDialerSkills = 'Languages & Web: Java, JavaScript, HTML5, CSS3\nFrontend: Bootstrap, JSP, React\nBackend & Architecture: Spring Boot, Spring MVC, Hibernate/JPA, Microservices, REST APIs\nTelephony & Contact Center: Asterisk, AMI (Asterisk Manager Interface), CTI (Computer Telephony Integration)\nData & Tools: MySQL, Docker, Jenkins, Git\nExploring: AI/ML, AI agents, LLM integration for future dialer workflows';

    if (saved.summary === PERSONAL_INFO.about || saved.summary === previousSummary || saved.summary === previousDialerSummary || saved.summary === previousCurrentSummary) saved.summary = optimizedDefaults.summary;
    if (saved.skills === legacySkills || saved.skills === previousSkills || saved.skills === previousDialerSkills) saved.skills = optimizedDefaults.skills;
    if (saved.title === 'Software Engineer' || saved.title === PERSONAL_INFO.title || saved.title === 'Software Engineer | Java, Spring Boot & Dialer Systems' || saved.title === 'Software Developer | Java, Spring Boot & Dialer Software') saved.title = optimizedDefaults.title;
    if (saved.phone === '+917808601346') saved.phone = optimizedDefaults.phone;
    if (saved.linkedinUrl === 'https://linkedin.com/in') saved.linkedinUrl = optimizedDefaults.linkedinUrl;
    if (saved.githubUrl === 'https://github.com') saved.githubUrl = optimizedDefaults.githubUrl;
    if (JSON.stringify(saved.experience) === JSON.stringify(EXPERIENCE_ITEMS)) saved.experience = optimizedDefaults.experience;
    if (JSON.stringify(saved.experience) === JSON.stringify(createPreviousDefaultExperience())) saved.experience = optimizedDefaults.experience;
    if (JSON.stringify(saved.experience) === JSON.stringify(createPreviousDialerExperience())) saved.experience = optimizedDefaults.experience;
    if (JSON.stringify(saved.education) === JSON.stringify(EDUCATION_ITEMS)) saved.education = optimizedDefaults.education;
    if (JSON.stringify(saved.education) === JSON.stringify(EDUCATION_ITEMS.slice(0, 2))) saved.education = optimizedDefaults.education;
    if (JSON.stringify(saved.projects) === JSON.stringify(createPreviousDefaultProjects())) saved.projects = optimizedDefaults.projects;
    if (JSON.stringify(saved.projects) === JSON.stringify(createPreviousDialerProjects())) saved.projects = optimizedDefaults.projects;
    if (JSON.stringify(saved.projects) === JSON.stringify(createPreviousFullProjects())) saved.projects = optimizedDefaults.projects;
    if (saved.skills === previousDialerSkills) saved.skills = optimizedDefaults.skills;

    return { ...optimizedDefaults, ...saved };
  } catch {
    return createDefaultDraft();
  }
};

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}> = ({ label, value, onChange, multiline = false, rows = 3 }) => (
  <label className="resume-field">
    <span>{label}</span>
    {multiline ? (
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    ) : (
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    )}
  </label>
);

const templates: { id: ResumeTemplate; label: string; description: string }[] = [
  { id: 'classic', label: 'Classic', description: 'Traditional, balanced spacing' },
  { id: 'professional', label: 'Professional', description: 'Clean sans-serif hierarchy' },
  { id: 'compact', label: 'One page', description: 'Concise, keyword-focused layout' },
];

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [draft, setDraft] = useState<ResumeDraft>(loadDraft);
  const [template, setTemplate] = useState<ResumeTemplate>('compact');
  const resumePaperRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('portfolio-resume-draft', JSON.stringify(draft));
    } catch {}
  }, [draft]);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundManager.playClick();

    const resumePaper = resumePaperRef.current;
    const lastSection = resumePaper?.lastElementChild;
    if (resumePaper && lastSection) {
      const contentHeight = lastSection.getBoundingClientRect().bottom - resumePaper.getBoundingClientRect().top;
      const paperStyle = window.getComputedStyle(resumePaper);
      const horizontalPadding = parseFloat(paperStyle.paddingLeft) + parseFloat(paperStyle.paddingRight);
      const previewTextWidth = resumePaper.clientWidth - horizontalPadding;
      const printableWidth = ((210 / 25.4) - 0.84) * 96;
      const estimatedPrintHeight = contentHeight * Math.min(1, previewTextWidth / printableWidth);
      const printableHeight = ((297 / 25.4) - 0.84) * 96;
      const printScale = Math.max(0.84, Math.min(1, printableHeight / estimatedPrintHeight * 0.98));
      resumePaper.style.setProperty('--resume-print-scale', String(printScale));
      window.addEventListener('afterprint', () => resumePaper.style.removeProperty('--resume-print-scale'), { once: true });
    }

    window.print();
  };

  const updateExperience = (index: number, updates: Partial<ExperienceItem>) => {
    setDraft((current) => ({
      ...current,
      experience: current.experience.map((item, itemIndex) => itemIndex === index ? { ...item, ...updates } : item),
    }));
  };

  const updateEducation = (index: number, updates: Partial<EducationItem>) => {
    setDraft((current) => ({
      ...current,
      education: current.education.map((item, itemIndex) => itemIndex === index ? { ...item, ...updates } : item),
    }));
  };

  const updateProject = (index: number, updates: Partial<ResumeProject>) => {
    setDraft((current) => ({
      ...current,
      projects: current.projects.map((item, itemIndex) => itemIndex === index ? { ...item, ...updates } : item),
    }));
  };

  const updateDraftField = (field: 'name' | 'title' | 'phone' | 'email' | 'location' | 'githubUrl' | 'linkedinUrl' | 'summary' | 'skills' | 'additionalProjects' | 'certifications' | 'publicationTitle' | 'publicationDetails', value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const linkedinHref = /^https?:\/\//i.test(draft.linkedinUrl) ? draft.linkedinUrl : undefined;
  const githubHref = /^https?:\/\//i.test(draft.githubUrl) ? draft.githubUrl : undefined;

  return createPortal((
    <div className="resume-modal-shell fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
      <div className="resume-modal-panel relative flex h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-lg border border-white/10 bg-[#101411] text-slate-100 shadow-2xl">
        <header className="resume-modal-header flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 md:px-6">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">Resume builder</h2>
            <p className="mt-0.5 text-xs text-slate-400">ATS-friendly, single-column layouts</p>
          </div>
          <div className="resume-actions flex items-center gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 rounded border border-white/15 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10" title="Print resume">
              <Printer size={15} /> <span className="hidden sm:inline">Print</span>
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 rounded bg-cyan-400 px-3 py-2 text-xs font-semibold text-black transition hover:bg-cyan-300" title="Save resume as PDF">
              <Download size={15} /> <span>Save as PDF</span>
            </button>
            <button onClick={() => { soundManager.playClick(); onClose(); }} className="rounded p-2 text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label="Close resume builder">
              <X size={18} />
            </button>
          </div>
        </header>

        <main className="resume-builder grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(290px,0.8fr)_minmax(0,1.2fr)]">
          <aside className="resume-editor min-h-0 overflow-y-auto border-b border-white/10 p-4 md:p-5 lg:border-b-0 lg:border-r">
            <section className="resume-template-chooser mb-6">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">Choose a format</h3>
              <div className="grid grid-cols-3 gap-2">
                {templates.map((item) => (
                  <button key={item.id} onClick={() => setTemplate(item.id)} className={`rounded border px-2 py-2 text-left transition ${template === item.id ? 'border-cyan-300 bg-cyan-300/10 text-white' : 'border-white/10 text-slate-300 hover:border-white/30'}`} aria-pressed={template === item.id}>
                    <span className="block text-xs font-semibold">{item.label}</span>
                    <span className="mt-1 hidden text-[10px] leading-tight text-slate-400 sm:block">{item.description}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-300">Contact and profile</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Full name" value={draft.name} onChange={(value) => updateDraftField('name', value)} />
                <Field label="Target role" value={draft.title} onChange={(value) => updateDraftField('title', value)} />
                <Field label="Phone" value={draft.phone} onChange={(value) => updateDraftField('phone', value)} />
                <Field label="Email" value={draft.email} onChange={(value) => updateDraftField('email', value)} />
                <Field label="Location" value={draft.location} onChange={(value) => updateDraftField('location', value)} />
                <Field label="LinkedIn URL" value={draft.linkedinUrl} onChange={(value) => updateDraftField('linkedinUrl', value)} />
                <Field label="GitHub / portfolio URL" value={draft.githubUrl} onChange={(value) => updateDraftField('githubUrl', value)} />
              </div>
              <div className="mt-3 space-y-3">
                <Field label="Professional summary" value={draft.summary} onChange={(value) => updateDraftField('summary', value)} multiline rows={4} />
                <Field label="Technical skills by category" value={draft.skills} onChange={(value) => updateDraftField('skills', value)} multiline rows={6} />
                <Field label="Additional academic projects (compact)" value={draft.additionalProjects} onChange={(value) => updateDraftField('additionalProjects', value)} multiline rows={2} />
                <Field label="Certifications (one per line)" value={draft.certifications} onChange={(value) => updateDraftField('certifications', value)} multiline rows={3} />
                <Field label="Publication title" value={draft.publicationTitle} onChange={(value) => updateDraftField('publicationTitle', value)} />
                <Field label="Publication details" value={draft.publicationDetails} onChange={(value) => updateDraftField('publicationDetails', value)} multiline rows={2} />
              </div>
            </section>

            <section className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Projects</h3>
                <button onClick={() => setDraft((current) => ({ ...current, projects: [...current.projects, { id: `project-${Date.now()}`, title: '', kind: 'Academic', technologies: [], highlights: [''] }] }))} className="flex items-center gap-1 text-xs text-cyan-300 hover:text-white"><Plus size={14} /> Add project</button>
              </div>
              <div className="space-y-4">
                {draft.projects.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="resume-entry-editor">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">Project {index + 1}<button onClick={() => setDraft((current) => ({ ...current, projects: current.projects.filter((_, itemIndex) => itemIndex !== index) }))} aria-label={`Remove project ${index + 1}`} className="p-1 hover:text-red-300"><Trash2 size={14} /></button></div>
                    <Field label="Project name" value={item.title} onChange={(value) => updateProject(index, { title: value })} />
                    <label className="resume-field mt-3">
                      <span>Project category</span>
                      <select value={item.kind ?? 'Academic'} onChange={(event) => updateProject(index, { kind: event.target.value as ResumeProject['kind'] })}>
                        <option value="Professional">Professional work</option>
                        <option value="Academic">Academic project</option>
                        <option value="Independent">Independent project</option>
                      </select>
                    </label>
                    <div className="mt-3">
                      <Field label="Date or status" value={item.period ?? ''} onChange={(value) => updateProject(index, { period: value })} />
                    </div>
                    <div className="mt-3 space-y-3">
                      <Field label="Technologies (comma-separated)" value={item.technologies.join(', ')} onChange={(value) => updateProject(index, { technologies: value.split(',').map((technology) => technology.trim()).filter(Boolean) })} />
                      <Field label="Highlights (one per line)" value={item.highlights.join('\n')} onChange={(value) => updateProject(index, { highlights: value.split('\n') })} multiline rows={3} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Experience</h3>
                <button onClick={() => setDraft((current) => ({ ...current, experience: [...current.experience, { id: `experience-${Date.now()}`, company: '', role: '', period: '', location: '', current: false, technologies: [], responsibilities: [''], highlights: [] }] }))} className="flex items-center gap-1 text-xs text-cyan-300 hover:text-white"><Plus size={14} /> Add role</button>
              </div>
              <div className="space-y-4">
                {draft.experience.map((item, index) => (
                  <div key={item.id} className="resume-entry-editor">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">Role {index + 1}<button onClick={() => setDraft((current) => ({ ...current, experience: current.experience.filter((_, itemIndex) => itemIndex !== index) }))} aria-label={`Remove role ${index + 1}`} className="p-1 hover:text-red-300"><Trash2 size={14} /></button></div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Job title" value={item.role} onChange={(value) => updateExperience(index, { role: value })} />
                      <Field label="Company" value={item.company} onChange={(value) => updateExperience(index, { company: value })} />
                      <Field label="Dates" value={item.period} onChange={(value) => updateExperience(index, { period: value })} />
                      <Field label="Location" value={item.location} onChange={(value) => updateExperience(index, { location: value })} />
                    </div>
                    <div className="mt-3">
                      <Field label="Achievements (one per line)" value={item.responsibilities.join('\n')} onChange={(value) => updateExperience(index, { responsibilities: value.split('\n') })} multiline rows={4} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Education</h3>
                <button onClick={() => setDraft((current) => ({ ...current, education: [...current.education, { degree: '', institution: '', period: '', grade: '', location: '' }] }))} className="flex items-center gap-1 text-xs text-cyan-300 hover:text-white"><Plus size={14} /> Add education</button>
              </div>
              <div className="space-y-4">
                {draft.education.map((item, index) => (
                  <div key={`${item.institution}-${index}`} className="resume-entry-editor">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">Education {index + 1}<button onClick={() => setDraft((current) => ({ ...current, education: current.education.filter((_, itemIndex) => itemIndex !== index) }))} aria-label={`Remove education ${index + 1}`} className="p-1 hover:text-red-300"><Trash2 size={14} /></button></div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Degree" value={item.degree} onChange={(value) => updateEducation(index, { degree: value })} />
                      <Field label="Institution" value={item.institution} onChange={(value) => updateEducation(index, { institution: value })} />
                      <Field label="Dates" value={item.period} onChange={(value) => updateEducation(index, { period: value })} />
                      <Field label="Location" value={item.location} onChange={(value) => updateEducation(index, { location: value })} />
                      <Field label="Grade (optional)" value={item.grade} onChange={(value) => updateEducation(index, { grade: value })} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <button onClick={() => { setDraft(createDefaultDraft()); window.localStorage.removeItem('portfolio-resume-draft'); }} className="mt-6 flex items-center gap-2 text-xs text-slate-400 hover:text-white"><RotateCcw size={14} /> Reset to portfolio details</button>
          </aside>

          <section className="min-h-0 overflow-auto bg-[#e8e9e7] p-4 md:p-8">
            <article ref={resumePaperRef} className={`resume-paper resume-template-${template}`}>
              <header className="resume-heading">
                <h1>{draft.name || 'Your Name'}</h1>
                {draft.title && <p className="resume-role">{draft.title}</p>}
                <p className="resume-contact">
                  {draft.phone && <a href={`tel:${draft.phone}`} aria-label={`Phone: ${draft.phone}`}><Phone size={12} aria-hidden="true" />{draft.phone}</a>}
                  {draft.email && (
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        openGmailCompose({
                          to: draft.email,
                          subject: 'Portfolio Inquiry',
                          body: 'Hello Aditya,\n\nI came across your portfolio and would like to connect regarding a potential opportunity.\n\nPlease let me know a suitable time to connect.\n\nBest regards,\n[Your Name]',
                        });
                      }}
                      className="inline-flex items-center gap-1 text-left text-[11px] text-slate-700 underline decoration-dotted underline-offset-2"
                      aria-label={`Email: ${draft.email}`}
                    >
                      <Mail size={12} aria-hidden="true" />{draft.email}
                    </button>
                  )}
                  {draft.location && <span>{draft.location}</span>}
                  {draft.linkedinUrl && (linkedinHref
                    ? <a href={linkedinHref} target="_blank" rel="noreferrer" aria-label={`LinkedIn: ${draft.linkedinUrl}`}><FaLinkedin size={12} aria-hidden="true" />{draft.linkedinUrl.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')}</a>
                    : <span>{draft.linkedinUrl}</span>)}
                  {draft.githubUrl && (githubHref
                    ? <a href={githubHref} target="_blank" rel="noreferrer" aria-label={`GitHub: ${draft.githubUrl}`}><FaGithub size={12} aria-hidden="true" />{draft.githubUrl.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')}</a>
                    : <span>{draft.githubUrl}</span>)}
                </p>
              </header>

              {draft.summary.trim() && <section className="resume-section"><h2>Professional Summary</h2><p>{draft.summary}</p></section>}

              {draft.experience.length > 0 && <section className="resume-section">
                <h2>Experience</h2>
                {draft.experience.map((item, index) => <div className="resume-experience" key={`${item.id}-${index}`}>
                  <div className="resume-entry-heading"><h3>{item.company}</h3><span>{item.period}</span></div>
                  <p className="resume-entry-subtitle"><em>{item.role}</em><span>{item.location}</span></p>
                  <ul>{item.responsibilities.filter((line) => line.trim()).map((line, bulletIndex) => <li key={bulletIndex}>{line}</li>)}</ul>
                </div>)}
              </section>}

              {draft.projects.length > 0 && <section className="resume-section">
                <h2>Projects</h2>
                {draft.projects.map((item, index) => <div className="resume-project" key={`${item.id}-${index}`}>
                  <div className="resume-entry-heading">
                    <h3>{item.title}{item.technologies.length > 0 && <span className="resume-project-tech"> | {item.technologies.join(', ')}</span>}</h3>
                    {item.period && <span>{item.period}</span>}
                  </div>
                  <p className="resume-project-kind">{item.kind ?? 'Academic'} project</p>
                  <ul>{item.highlights.filter((highlight) => highlight.trim()).map((highlight, highlightIndex) => <li key={highlightIndex}>{highlight}</li>)}</ul>
                </div>)}
              </section>}

              {draft.additionalProjects.trim() && <section className="resume-section resume-additional-projects">
                <h2>Additional Academic Projects</h2>
                <p>{draft.additionalProjects.split('|').map((project) => project.trim()).filter(Boolean).join(' | ')}</p>
              </section>}

              {draft.skills.trim() && <section className="resume-section">
                <h2>Skills</h2>
                <div className="resume-skills">
                  {draft.skills.split('\n').filter((line) => line.trim()).map((line, index) => {
                    const separator = line.indexOf(':');
                    return <p key={index}>{separator > -1 ? <><strong>{line.slice(0, separator + 1)}</strong>{line.slice(separator + 1)}</> : line}</p>;
                  })}
                </div>
              </section>}

              {draft.education.length > 0 && <section className="resume-section">
                <h2>Education</h2>
                {draft.education.map((item, index) => <div className="resume-experience" key={`${item.institution}-${index}`}>
                  <div className="resume-entry-heading"><h3>{item.institution}</h3><span>{item.period}</span></div>
                  <p className="resume-entry-subtitle"><em>{item.degree}</em></p>
                  <p className="resume-entry-detail">{[item.location, item.grade].filter(Boolean).join(' | ')}</p>
                </div>)}
              </section>}

              {draft.certifications.trim() && <section className="resume-section">
                <h2>Certifications & Training</h2>
                <ul>{draft.certifications.split('\n').filter((line) => line.trim()).map((line, index) => <li key={index}>{line}</li>)}</ul>
              </section>}

              {draft.publicationTitle.trim() && <section className="resume-section">
                <h2>Publication</h2>
                <p><strong>{draft.publicationTitle}</strong>{draft.publicationDetails.trim() && ` | ${draft.publicationDetails}`}</p>
              </section>}
            </article>
          </section>
        </main>
      </div>
    </div>
  ), document.body);
};