import type { Project, ArchitectureNodeData, SkillCategory, ExperienceItem, EducationItem } from '../types';

export const PERSONAL_INFO = {
  name: 'Aditya Kumar',
  shortName: 'ADITYA.K',
  title: 'SOFTWARE ENGINEER',
  tagline: 'Building scalable web applications, backend systems, realtime platforms and AI-powered solutions.',
  secondaryStatement: 'Java · Spring Boot · React · Microservices · Data · AI · Cloud',
  email: 'adityakumarbju121@gmail.com',
  location: 'Delhi, India',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com/in',
  resumePath: '/resume.pdf',
  about: "I'm a Software Engineer focused on building reliable backend systems, modern web applications, realtime platforms and practical AI-powered solutions. I bridge robust enterprise architectures in Java and Spring Boot with reactive user experiences, distributed data persistence, and modern automation workflows.",
};

export const PROJECTS: Project[] = [
  {
    id: 'infosoft-crm',
    slug: 'infosoft-crm',
    title: 'INFOSOFT CRM',
    subtitle: 'Enterprise CRM & Realtime Agent Management Platform',
    category: 'Enterprise Full-Stack & Realtime',
    description: 'A mission-critical enterprise customer relationship management and workforce orchestration system engineered to manage agent operations, telecommunication events, real-time lead queues, and automated reporting with zero-latency updates.',
    technologies: [
      'Java',
      'Spring Boot',
      'React',
      'MySQL',
      'REST APIs',
      'WebSocket',
      'JPA / Hibernate',
      'Docker'
    ],
    problem: 'Enterprise sales and support teams required a unified, high-reliability platform capable of handling concurrent agent sessions, telephony state transitions, high-volume lead ingestion, and role-based permissions without sync lags or inconsistent agent states.',
    solution: 'Designed and implemented a decoupled architecture featuring a Spring Boot backend with multi-tiered service abstractions, WebSocket bi-directional channels for realtime agent dispatch and notification feeds, and an ergonomic React dashboard with responsive operational panels.',
    architectureDescription: 'Layered architecture utilizing Spring Boot REST Controllers, WebSocket STOMP handlers, transaction-managed Service business logic, JPA Repository abstraction, and optimized MySQL indexing for sub-second query performance.',
    features: [
      'Agent Management & Live Presence Tracking',
      'Service & Role Management with Granular Access Control',
      'Dynamic Lead Processing & Priority Assignment Queues',
      'Asynchronous Batch Processing for Bulk Lead Updates',
      'System Health & Ingestion Monitoring Dashboards',
      'Automated Performance & Audit Reports Generation',
      'Realtime Push Notifications via WebSocket Channels',
      'Separate Dedicated Agent Panel and Administrative Panel',
      'Telephony-related event integration and session tracking'
    ],
    engineeringHighlights: [
      'Decoupled business logic into clean Controller-Service-Repository tiers adhering to SOLID principles',
      'Engineered bi-directional WebSocket pipelines for instantaneous agent state sync without polling overhead',
      'Implemented batch processing pipelines preventing thread starvation during heavy daytime lead intake',
      'Containerized development and staging environments using Docker for uniform reproducible deployments'
    ],
    githubUrl: 'https://github.com',
    liveUrl: undefined,
    featured: true
  },
  {
    id: 'ai-automation-pipeline',
    slug: 'ai-automation-pipeline',
    title: 'AI WORKFLOW AUTOMATION ENGINE',
    subtitle: 'Event-Driven LLM & Multi-Agent Orchestration Gateway',
    category: 'AI Automation & System Integration',
    description: 'An intelligent automation gateway connecting enterprise event webhooks with n8n workflow pipelines and LLM inference models for automated triage, data extraction, and decision routing.',
    technologies: ['Java', 'Spring Boot', 'n8n', 'OpenAI APIs', 'Prompt Engineering', 'REST APIs', 'Docker'],
    problem: 'Manual processing of inbound customer requests, documents, and system alerts introduced latency and human classification errors into operational workflows.',
    solution: 'Created automated webhook endpoints in Spring Boot that preprocess incoming payloads, invoke structured LLM prompts for classification and summarization, and trigger downstream n8n execution workflows.',
    architectureDescription: 'Spring Boot REST ingress -> Prompt normalization & security filtering -> LLM inference API -> n8n distributed workflow coordinator -> Downstream notification services.',
    features: [
      'Multi-model LLM inference integration with structured output validation',
      'n8n visual workflow orchestration triggers via secured webhooks',
      'Automated ticket sentiment analysis and intelligent routing',
      'Rate-limiting and fallback model degradation strategies'
    ],
    engineeringHighlights: [
      'Implemented resilient retry and backoff mechanisms for external AI API calls',
      'Designed structured JSON schema enforcement for zero-parsing-failure LLM responses'
    ],
    githubUrl: 'https://github.com',
    featured: true
  },
  {
    id: 'realtime-stream-telemetry',
    slug: 'realtime-stream-telemetry',
    title: 'REALTIME TELEMETRY MONITOR',
    subtitle: 'High-Throughput WebSocket Event Broadcast Platform',
    category: 'Realtime Systems & Data Streams',
    description: 'A low-latency telemetry monitoring dashboard handling continuous metrics streaming, worker node heartbeats, and threshold breach alerting.',
    technologies: ['Java', 'Spring Boot', 'WebSocket', 'React', 'Redis', 'Docker'],
    problem: 'Distributed microservices required a lightweight, centralized telemetry aggregation feed without the resource footprint of heavy external monitoring stacks.',
    solution: 'Engineered an in-memory event broadcaster using Redis Pub/Sub combined with Spring Boot WebSocket sessions, rendering real-time SVG sparklines in React.',
    architectureDescription: 'Worker agents -> Ingest endpoint -> Redis Pub/Sub channel -> Spring WebSocket session pool -> React Canvas/SVG client.',
    features: [
      'Sub-50ms latency metric propagation from server to client',
      'Dynamic threshold configuration with browser audio/visual triggers',
      'Adaptive reconnection management with message replay buffer'
    ],
    engineeringHighlights: [
      'Optimized memory footprint by utilizing Redis channels for horizontal fan-out',
      'Built custom React canvas rendering hooks for 60fps graph updates'
    ],
    githubUrl: 'https://github.com',
    featured: false
  }
];

export const CRM_ARCHITECTURE_NODES: ArchitectureNodeData[] = [
  {
    id: 'react-client',
    name: 'React Frontend',
    layer: 'frontend',
    tech: 'React 19 / TypeScript / Tailwind',
    description: 'Component-based client application delivering high-efficiency agent workspaces, administrative consoles, and reactive state management.',
    responsibilities: [
      'Agent interaction state & audio telephony controls',
      'Realtime WebSocket message consumption & notification rendering',
      'Form validation, JWT bearer authentication, and routing'
    ],
    position: [-4.2, 2.2, 0]
  },
  {
    id: 'gateway-transport',
    name: 'REST / WebSocket Ingress',
    layer: 'transport',
    tech: 'HTTP/2 REST & STOMP over WebSocket',
    description: 'Dual-protocol communication layer routing synchronous operational requests and asynchronous bidirectional messaging.',
    responsibilities: [
      'Secured TLS termination & CORS validation',
      'WebSocket session management and heartbeat negotiation',
      'Uniform error response transformation'
    ],
    position: [-1.4, 2.2, 0]
  },
  {
    id: 'controller-layer',
    name: 'Controller Layer',
    layer: 'controller',
    tech: 'Spring MVC @RestController & @MessageMapping',
    description: 'Entry point for application requests. Validates incoming DTOs and delegates commands to appropriate domain services.',
    responsibilities: [
      'Request deserialization & Bean Validation (@Valid)',
      'Role-based endpoint authorization checks',
      'Clean HTTP status and response entity formatting'
    ],
    position: [1.4, 2.2, 0]
  },
  {
    id: 'service-layer',
    name: 'Service Layer',
    layer: 'service',
    tech: 'Spring Service & Transactional Boundaries',
    description: 'Core domain engine containing business logic, asynchronous task execution, batch lead processing, and orchestration.',
    responsibilities: [
      'Lead distribution algorithms & priority queuing',
      'Transactional boundary management (@Transactional)',
      'Telephony status sync and event dispatching'
    ],
    position: [1.4, -0.6, 0]
  },
  {
    id: 'repository-layer',
    name: 'Repository / JPA Layer',
    layer: 'data',
    tech: 'Spring Data JPA & Hibernate 6',
    description: 'Object-Relational Mapping tier providing query optimization, connection pooling, and abstracted data persistence.',
    responsibilities: [
      'Optimized JPQL and native queries for high-volume lead lookups',
      'Entity relationship lifecycle and cache synchronization',
      'HikariCP connection pool management'
    ],
    position: [-1.4, -0.6, 0]
  },
  {
    id: 'mysql-db',
    name: 'MySQL Database',
    layer: 'data',
    tech: 'MySQL 8.0 / InnoDB Engine',
    description: 'ACID-compliant relational database serving as the source of truth for agents, leads, roles, and audit trails.',
    responsibilities: [
      'Normalized schema with foreign key integrity',
      'Composite indexes for timestamp and agent status searches',
      'Transaction isolation and persistent storage'
    ],
    position: [-4.2, -0.6, 0]
  },
  {
    id: 'websocket-broker',
    name: 'Realtime WebSocket Broker',
    layer: 'realtime',
    tech: 'Spring WebSocket / SimpMessagingTemplate',
    description: 'Dedicated bi-directional event bus pushing real-time alerts, telecommunication ring triggers, and agent presence.',
    responsibilities: [
      'Topic broadcasting (/topic/leads, /topic/notifications)',
      'Point-to-point user targeting (/queue/agent-events)',
      'Instantaneous zero-lag agent status sync'
    ],
    position: [-1.4, 0.8, 1.2]
  }
];

export const ENGINEERING_SYSTEMS = [
  {
    id: 'backend',
    title: 'BACKEND',
    subtitle: 'Core Engine & Logic',
    tech: 'Java · Spring Boot · Microservices',
    description: 'Engineered for high concurrency, deterministic business logic, structured domain boundaries, and strict resilience.',
    color: '#38bdf8',
    stats: ['Sub-100ms API Latency', 'Clean Tiered Architecture', 'SOLID Principles']
  },
  {
    id: 'frontend',
    title: 'FRONTEND',
    subtitle: 'Interactive Modern Interfaces',
    tech: 'React · TypeScript · WebGL',
    description: 'Fluid, performant, and accessible interfaces bridging complex operational backend workflows with intuitive user experiences.',
    color: '#818cf8',
    stats: ['Reactive State', '60 FPS Transitions', 'Accessible Semantics']
  },
  {
    id: 'data',
    title: 'DATA',
    subtitle: 'Relational & Key-Value Storage',
    tech: 'MySQL · PostgreSQL · Redis',
    description: 'ACID transactional data integrity paired with high-speed caching layers, indexing strategies, and optimized JPA mappings.',
    color: '#34d399',
    stats: ['JPA / Hibernate', 'Indexed Schemas', 'Redis Caching']
  },
  {
    id: 'realtime',
    title: 'REALTIME',
    subtitle: 'Bidirectional Streaming',
    tech: 'WebSocket · STOMP · Event Queues',
    description: 'Instant event propagation, zero-polling live dashboards, telephony presence signals, and push notifications.',
    color: '#f59e0b',
    stats: ['Bidirectional Sockets', 'Event Ingestion', 'Zero Polling']
  },
  {
    id: 'ai',
    title: 'AI',
    subtitle: 'LLMs & Automation Pipelines',
    tech: 'Generative AI · n8n · Prompt Eng',
    description: 'Integration of LLMs into production workflows, automated webhook classifiers, and deterministic prompt architectures.',
    color: '#ec4899',
    stats: ['Structured JSON Output', 'n8n Workflows', 'API Orchestration']
  },
  {
    id: 'devops',
    title: 'DEVOPS',
    subtitle: 'Packaging & Pipeline CI/CD',
    tech: 'Docker · Jenkins · Git · Linux',
    description: 'Reproducible containerized environments, structured build pipelines, and automated artifact validation.',
    color: '#06b6d4',
    stats: ['Multi-Stage Docker', 'Jenkins Pipelines', 'Linux Environments']
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'BACKEND',
    skills: [
      { name: 'Java', level: 'Core Enterprise', detail: 'OOP, Collections, Concurrency, Stream API, Memory model' },
      { name: 'Spring Boot', level: 'Advanced', detail: 'IoC/DI, Spring MVC, REST APIs, Starters, Configuration' },
      { name: 'Spring Security', level: 'Proficient', detail: 'JWT Authentication, RBAC, Filter Chains, CORS/CSRF' },
      { name: 'Microservices', level: 'Intermediate', detail: 'Service boundaries, API gateways, Decoupled components' },
      { name: 'REST APIs', level: 'Advanced', detail: 'Resource design, HTTP status standards, Versioning, DTOs' },
      { name: 'Hibernate / JPA', level: 'Advanced', detail: 'Entity lifecycles, JPQL, Criteria API, Lazy loading, Caching' }
    ]
  },
  {
    category: 'FRONTEND',
    skills: [
      { name: 'React', level: 'Advanced', detail: 'Hooks, Context, Custom Hooks, Component Lifecycle, Performance' },
      { name: 'JavaScript / TypeScript', level: 'Proficient', detail: 'ES6+, Async/Await, Strict Typing, Modular Patterns' },
      { name: 'HTML5', level: 'Advanced', detail: 'Semantic elements, Web APIs, Accessibility (a11y)' },
      { name: 'CSS3', level: 'Advanced', detail: 'Flexbox, Grid, Animations, Tailwind CSS, Responsive Design' }
    ]
  },
  {
    category: 'DATA',
    skills: [
      { name: 'MySQL', level: 'Advanced', detail: 'Schema design, Constraints, Indexing, Joins, Transactions' },
      { name: 'PostgreSQL', level: 'Working Knowledge', detail: 'Relational storage, JSON types, Complex queries' },
      { name: 'MongoDB', level: 'Working Knowledge', detail: 'Document model, Aggregations, BSON schemas' },
      { name: 'Redis', level: 'Intermediate', detail: 'Key-value caching, Pub/Sub messaging, Session persistence' }
    ]
  },
  {
    category: 'REALTIME',
    skills: [
      { name: 'WebSocket', level: 'Proficient', detail: 'Full-duplex protocols, STOMP messaging, Session management' },
      { name: 'Socket.IO', level: 'Intermediate', detail: 'Room broadcasting, Event emissions, Connection recovery' }
    ]
  },
  {
    category: 'AI',
    skills: [
      { name: 'Generative AI', level: 'Applied', detail: 'LLM capabilities, Embeddings, Context window optimization' },
      { name: 'LLMs', level: 'Applied', detail: 'Model selection, Temperature tuning, Reasoning workflows' },
      { name: 'Prompt Engineering', level: 'Proficient', detail: 'Few-shot prompting, Schema enforcement, Chain-of-thought' },
      { name: 'AI APIs', level: 'Proficient', detail: 'OpenAI/Anthropic REST endpoints, Structured JSON response parsing' },
      { name: 'n8n', level: 'Proficient', detail: 'Visual automation flows, Webhook triggers, Node transforms' }
    ]
  },
  {
    category: 'DEVOPS',
    skills: [
      { name: 'Docker', level: 'Proficient', detail: 'Multi-stage Dockerfiles, Containerization, Docker Compose' },
      { name: 'Jenkins', level: 'Intermediate', detail: 'Declarative pipelines, Automated testing & build triggers' },
      { name: 'CI/CD', level: 'Intermediate', detail: 'Continuous integration, Build artifacts, Deployment sanity' },
      { name: 'Git & GitHub', level: 'Advanced', detail: 'Branching strategies, Pull requests, Merge conflict resolution' },
      { name: 'AWS', level: 'Foundational', detail: 'EC2, S3, Core cloud fundamentals' },
      { name: 'Linux', level: 'Proficient', detail: 'Bash scripting, Permissions, Process management, Systemd' }
    ]
  },
  {
    category: 'ARCHITECTURE',
    skills: [
      { name: 'System Design', level: 'Practiced', detail: 'High-level architecture, Decoupling, Scalability patterns' },
      { name: 'API Design', level: 'Advanced', detail: 'RESTful guidelines, Contract definition, Consistent error models' },
      { name: 'SOLID Principles', level: 'Advanced', detail: 'Single Responsibility, Open/Closed, Dependency Inversion' },
      { name: 'Design Patterns', level: 'Proficient', detail: 'Factory, Singleton, Repository, Strategy, Observer' },
      { name: 'Clean Architecture', level: 'Proficient', detail: 'Separation of concerns, Domain isolation, DTO isolation' }
    ]
  },
  {
    category: 'QUALITY',
    skills: [
      { name: 'JUnit', level: 'Proficient', detail: 'Unit testing, Assertions, Mock testing lifecycle' },
      { name: 'Mockito', level: 'Proficient', detail: 'Service mocking, Dependency stubbing, Verification' },
      { name: 'API Testing', level: 'Advanced', detail: 'Postman collections, Endpoint contract testing, Edge cases' },
      { name: 'Debugging', level: 'Advanced', detail: 'IDE breakpoints, Profiling, Thread analysis, Log tracing' },
      { name: 'Code Review', level: 'Proficient', detail: 'Readability, Performance checks, Maintainability auditing' }
    ]
  }
];

export const ENGINEERING_NOW = {
  buildingWith: [
    { name: 'Java', desc: 'Enterprise backend language' },
    { name: 'Spring Boot', desc: 'Microservices & REST APIs' },
    { name: 'React', desc: 'Reactive modern frontend UI' },
    { name: 'MySQL', desc: 'Relational data persistence' },
    { name: 'Redis', desc: 'In-memory caching layer' },
    { name: 'Docker', desc: 'Containerized deployment' }
  ],
  exploring: [
    { name: 'Generative AI', desc: 'Autonomous system reasoning' },
    { name: 'LLMs', desc: 'Context processing & summarization' },
    { name: 'AI APIs', desc: 'Model integration in web backends' },
    { name: 'n8n', desc: 'Visual workflow automation' },
    { name: 'AI Automation', desc: 'Autonomous event pipelines' }
  ],
  goingDeeperInto: [
    { name: 'Microservices', desc: 'Service discovery & distributed patterns' },
    { name: 'System Design', desc: 'Scalable fault-tolerant topologies' },
    { name: 'Realtime Systems', desc: 'High-frequency message streaming' },
    { name: 'Cloud', desc: 'Cloud-native infrastructure & services' }
  ]
};

export const AI_LAB_NODES = [
  {
    id: 'llm',
    title: 'LLM',
    category: 'Reasoning Engine',
    description: 'Harnessing Large Language Models for automated unstructured data extraction, contextual synthesis, and intelligent query routing.',
    useCase: 'Used in portfolio AI assistant and automated customer inquiry categorization.'
  },
  {
    id: 'genai',
    title: 'GENAI',
    category: 'Generative Intelligence',
    description: 'Transformative generative systems producing deterministic structured outputs, dynamic summaries, and synthetic test datasets.',
    useCase: 'Generating domain-specific data models and testing edge-case payloads.'
  },
  {
    id: 'prompt-engineering',
    title: 'PROMPT ENGINEERING',
    category: 'Context Architecture',
    description: 'Designing structured prompts with rigorous schema constraints, few-shot demonstration exemplars, and strict output boundary validation.',
    useCase: 'Ensuring zero hallucinations and reliable JSON responses from LLM APIs.'
  },
  {
    id: 'ai-apis',
    title: 'AI APIs',
    category: 'System Integration',
    description: 'Direct RESTful integration of enterprise AI model endpoints into Spring Boot backend microservices with circuit breakers and fallback caching.',
    useCase: 'Secure API proxying with environment token management and rate limiting.'
  },
  {
    id: 'automation',
    title: 'AUTOMATION',
    category: 'Operational Efficiency',
    description: 'Connecting external events, webhooks, and asynchronous workers to eliminate manual data entry and repetitive administrative tasks.',
    useCase: 'Continuous alert classification and batch lead distribution.'
  },
  {
    id: 'n8n',
    title: 'n8n',
    category: 'Workflow Orchestration',
    description: 'Fair-code node-based visual workflow orchestration combining REST endpoints, AI nodes, database queries, and notification dispatches.',
    useCase: 'Building extensible multi-step automation without monolithic code bloat.'
  }
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'tam-infosoft',
    company: 'TAM INFOSOFT',
    role: 'Full Stack Engineer',
    period: 'Current / Present',
    location: 'Delhi, India',
    current: true,
    technologies: ['Java', 'Spring Boot', 'React', 'MySQL', 'REST APIs', 'WebSocket', 'JPA / Hibernate', 'Docker'],
    responsibilities: [
      'Architecting and developing core modules for enterprise CRM and Agent Management software',
      'Implementing high-throughput REST APIs and bi-directional WebSocket communication for real-time notifications',
      'Engineering batch processing jobs for large-scale lead updates and service catalog management',
      'Collaborating on database schema design, indexing, and query optimization for low latency',
      'Dockerizing micro-components and integrating with team CI/CD pipelines'
    ],
    highlights: [
      'Engineered real-time agent presence and event synchronization across active sessions',
      'Delivered robust role-based access control protecting critical administrative endpoints',
      'Maintained high code quality and test coverage across service layers'
    ]
  },
  {
    id: 'thinknext',
    company: 'ThinkNext Technology Private Limited',
    role: 'Java Developer / Java Full Stack Intern',
    period: 'Previous Experience',
    location: 'India',
    current: false,
    technologies: ['Java', 'Spring Boot', 'React', 'APIs', 'MySQL', 'Full-Stack Development'],
    responsibilities: [
      'Developed server-side components using Java and Spring Boot frameworks',
      'Built responsive frontend interfaces in React consuming RESTful web services',
      'Implemented database persistence layers using JPA/Hibernate connected to relational databases',
      'Participated in unit testing, debugging, and code refactoring exercises to ensure robust performance'
    ],
    highlights: [
      'Gained deep practical mastery in end-to-end full-stack application lifecycle',
      'Built reusable API endpoints and integrated third-party service payloads'
    ]
  }
];

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    degree: 'Master of Computer Application (MCA)',
    institution: 'Global Group of Institutes, Amritsar',
    period: '2023 – 2025',
    grade: 'GPA: 7.29',
    location: 'Amritsar, Punjab'
  },
  {
    degree: 'Bachelor of Science — Mathematics Honours',
    institution: 'LNMU University, Darbhanga',
    period: '2019 – 2022',
    grade: '73.13%',
    location: 'Darbhanga, Bihar'
  },
  {
    degree: 'Intermediate — 12th',
    institution: 'RKC+2 High School, Begusarai',
    period: '2017 – 2019',
    grade: '63.8%',
    location: 'Begusarai, Bihar'
  }
];
