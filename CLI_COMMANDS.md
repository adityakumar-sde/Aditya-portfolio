# 🖥️ Complete CLI & Terminal Commands Manual
**Project:** Aditya Kumar — Ultra-Luxury Dual-Engine 3D Engineering Portfolio  
**Author / Engineer:** Aditya Kumar (Full Stack & Distributed Systems Engineer)  
**Document:** CLI & Terminal Reference Guide (In-Browser Virtual Shell + Project Development CLI)

---

## 📑 Table of Contents
1. [In-Browser Developer Terminal Overview](#1-in-browser-developer-terminal-overview)
2. [How to Launch the Interactive Terminal](#2-how-to-launch-the-interactive-terminal)
3. [Virtual Terminal Command Reference](#3-virtual-terminal-command-reference)
   - [Diagnostics, Telemetry & CI/CD](#a-diagnostics-telemetry--cicd-commands)
   - [Live Portfolio Modification & Control](#b-live-portfolio-modification--control-commands)
   - [Inquiries & Message Inbox Management](#c-inquiries--message-inbox-management)
   - [Navigation, Catalog & Shortcuts](#d-navigation-catalog--shortcuts)
4. [Local Development CLI Commands](#4-local-development-cli-commands)
   - [Frontend CLI (React + Vite)](#frontend-cli-react-19--vite-8)
   - [Backend CLI (Spring Boot + Maven)](#backend-cli-spring-boot-3--maven)
   - [Docker & Container Orchestration CLI](#docker--compose-orchestration-cli)
   - [Database CLI (MySQL)](#database-cli-mysql-80)
5. [CI/CD Automation Pipelines](#5-cicd-automation-pipelines)
6. [Quick Command Cheat Sheet](#6-quick-command-cheat-sheet)

---

## 1. In-Browser Developer Terminal Overview

The portfolio features a built-in, low-latency **UNIX Developer Terminal** (`DeveloperTerminalModal.tsx`). It simulates an authentic POSIX shell environment allowing recruiters, engineers, and Aditya himself to run real-time diagnostic audits, test backend APIs, query live visitor inquiries, navigate 3D spatial dimensions, and mutate live UI configurations.

```
   ____  _____ _   _ ___ _   _ ____   ___ _____ 
  |  _ \| ____| \ | |_ _| \ | / ___| / _ \_   _|
  | | | |  _| |  \| || ||  \| \___ \| | | || |  
  | |_| | |___| |\  || || |\  |___) | |_| || |  
  |____/|_____|_| \_|___|_| \_|____/ \___/ |_|  

  ADITYA KUMAR — PORTFOLIO RUNTIME ENGINE (v2.4.0-RELEASE)
  Session: DEV-TERMINAL-01 | CI/CD: ACTIVE | Docker: READY
```

---

## 2. How to Launch the Interactive Terminal

You can launch the terminal anywhere across the application using any of the following methods:

| Method | Trigger | Description |
| :--- | :--- | :--- |
| **Keyboard Shortcut 1** | `` ` `` (Tilde Key) | Press the backtick/tilde key (outside of input fields) |
| **Keyboard Shortcut 2** | `Ctrl + Shift + T` | Universal developer shortcut |
| **Navbar Button** | Terminal Icon `>_` | Click the terminal icon in the top navigation bar |
| **Cover Page Action** | "TERMINAL" pill | Click the terminal button on the Editorial Front Page Cover |

To close the terminal: type `exit`, press `Esc`, or click the `X` button in the top right.

---

## 3. Virtual Terminal Command Reference

### A. Diagnostics, Telemetry & CI/CD Commands

| Command | Arguments | Description & Example |
| :--- | :--- | :--- |
| `status` / `health` | None | Displays live system telemetry: React/Vite kernel version, 3D WebGL engine status, viewport resolution, DPR, and JS heap memory consumption. |
| `cicd` / `pipeline` | None | Audits GitHub Actions (`ci-cd.yml`) and Jenkins Enterprise pipelines (`Jenkinsfile`), checking test runs and container image assemblies. |
| `docker` | None | Displays multi-container Compose service status for frontend (Nginx), backend (Spring Boot), and MySQL. |
| `test-api` | None | Pings all Spring Boot backend endpoints (`/api/health`, `/api/contact`, `/api/music`) and reports latency in milliseconds. |
| `logs` | None | Dumps real-time diagnostic log stream (INFO, WARN, ERROR) captured during current user session. |
| `errors` | None | Filters and displays only runtime exceptions and failed network requests. |
| `clear-logs` | None | Flushes the in-memory diagnostic log buffer. |

#### Example Terminal Run:
```bash
aditya@engineering-core:$ status
● OPERATIONAL
  Kernel: React 19 + Vite 8.3
  3D Engine: Three.js WebGL (ACESFilmic ToneMapping)
  Viewport: 1920x1080 (@1.25x DPR)
  JS Heap Usage: 42 MB
```

---

### B. Live Portfolio Modification & Control Commands

> **Root Privileges Required:** Modification commands require authentication. Authenticate first using `auth <password>`.

| Command | Arguments | Description |
| :--- | :--- | :--- |
| `auth` / `sudo` | `<password>` | Authenticates as Root Developer. (Default developer passcodes: `admin` or `aditya2026`). |
| `set title` | `<new title>` | Live-updates the headline title in the Hero section in real-time. |
| `set tagline` | `<new tagline>` | Live-updates the subtitle statement across the portfolio. |
| `set status` | `<badge text>` | Mutates the availability status badge (e.g. `set status OPEN FOR CONTRACTS`). |
| `set theme` | `<0 - 4>` | Instantly switches the 3D atmospheric theme (0: Stars, 1: Matrix, 2: Zen, 3: Aurora, 4: Network). |
| `reset` | None | Reverts all live customized text and configurations back to factory defaults. |
| `export-config` | None | Dumps the active configuration state as a formatted JSON object for export. |

#### Example Root Workflow:
```bash
aditya@engineering-core:$ auth aditya2026
✓ Access Granted. You are now logged in as ROOT DEVELOPER.

root@core:# set title Distributed Systems Architect
✓ Updated title to: Distributed Systems Architect

root@core:# set status AVAILABLE Q4 2026
✓ Updated status badge to: AVAILABLE Q4 2026
```

---

### C. Inquiries & Message Inbox Management

| Command | Arguments | Description |
| :--- | :--- | :--- |
| `messages` / `inbox` | None | Queries and lists all submitted contact inquiries from the operational backend queue. |
| `read` | `<message_id>` | Fetches and displays the full text, sender name, email, and timestamp of a specific inquiry. |

#### Example Inbox Inspection:
```bash
aditya@engineering-core:$ messages
INBOX: 2 TRANSMISSION(S) STORED
------------------------------------------------------------
[MSG-101] Alex Morgan <alex@techcorp.io> (Full-Time Role)
[MSG-102] Priya Sharma <priya@startup.co> (Backend Architecture)

root@core:# read 101
SENDER: Alex Morgan <alex@techcorp.io>
SUBJECT: Inquiry: Full-Time Role
DATE: 2026-09-30 00:24 IST
MESSAGE: We loved your 3D spatial portfolio. Would like to discuss a Senior Backend position.
```

---

### D. Navigation, Catalog & Shortcuts

| Command | Arguments | Description |
| :--- | :--- | :--- |
| `goto` | `<section>` | Smoothly scrolls to target section. Available: `hero`, `systems`, `work`, `stack`, `career`, `about`, `contact`. |
| `skills` | None | Displays the curated technical skills catalog across Backend, Frontend, Cloud, Realtime, AI, and Databases. |
| `projects` | None | Dumps active flagship production systems (CRM Architecture, Realtime Streamer, AI pipelines) with GitHub links. |
| `whoami` | None | Prints the current session context, IP routing, and role privilege level. |
| `git status` | None | Displays the active Git branch (`main`), commit hash, and working tree clean status. |
| `version` | None | Prints runtime kernel version, dependencies, and build timestamp. |
| `open admin` | None | Launches the graphical Admin Telemetry Console. |
| `resume` | None | Opens the interactive PDF resume preview and download modal. |
| `clear` | None | Clears the terminal output buffer. |
| `exit` | None | Closes the terminal modal and returns to the active portfolio view. |

---

## 4. Local Development CLI Commands

### Frontend CLI (React 19 + Vite 8)

All frontend commands must be executed inside `d:\portfolio\frontend`:

```bash
# Navigate to frontend directory
cd d:\portfolio\frontend

# Install all npm dependencies
npm install

# Start local development server with Hot Module Replacement (HMR)
npm run dev
# -> Local server starts on http://localhost:5173

# Execute TypeScript type checking and production bundling
npm run build
# -> Compiles via `tsc -b && vite build` with output in /dist

# Preview production build locally
npm run preview
# -> Serves the compiled production bundle on http://localhost:4173

# Run ESLint validation
npm run lint
```

---

### Backend CLI (Spring Boot 3 + Maven)

All backend commands must be executed inside `d:\portfolio\backend`:

```bash
# Navigate to backend directory
cd d:\portfolio\backend

# Compile and package Spring Boot JAR
mvn clean package -DskipTests

# Run tests
mvn test

# Launch Spring Boot server locally
mvn spring-boot:run
# -> Backend REST API starts on http://localhost:8080

# Run with custom Spring active profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

---

### Docker & Compose Orchestration CLI

All Docker commands must be executed at the project root `d:\portfolio`:

```bash
# Build and start all 3 services (Frontend + Backend + MySQL) in background
docker compose up --build -d

# Inspect status of all running containers
docker compose ps

# Stream unified logs across all containers
docker compose logs -f

# Stream logs of specific service
docker compose logs -f portfolio-backend
docker compose logs -f portfolio-frontend

# Stop all services without deleting data volumes
docker compose down

# Stop all services and wipe persistent database volumes
docker compose down -v
```

---

### Database CLI (MySQL 8.0)

When running locally or via Docker:

```bash
# Connect to MySQL container via CLI
docker compose exec portfolio-mysql mysql -u root -p portfolio_db
# Password: root (or configured password)

# Basic SQL Queries to check contact transmissions:
SELECT id, name, email, subject, created_at FROM contact_messages ORDER BY created_at DESC;

# Check database tables
SHOW TABLES;
DESCRIBE contact_messages;
```

---

## 5. CI/CD Automation Pipelines

### GitHub Actions Pipeline (`.github/workflows/ci-cd.yml`)
Triggers automatically on every `git push` to `main`:
1. **`frontend-ci`**: Node 20 environment, runs `npm ci`, checks TypeScript types (`tsc -b`), bundles production assets, and uploads artifact `frontend-dist`.
2. **`backend-ci`**: Eclipse Temurin JDK 17 environment, runs Maven build and unit tests, and packages executable JAR artifact.
3. **`docker-verify`**: Validates `docker-compose.yml` config syntax and multi-stage container build reliability.

### Jenkins Pipeline (`Jenkinsfile`)
Enterprise multi-stage pipeline:
```groovy
pipeline {
    agent any
    stages {
        stage('Checkout SCM') { steps { checkout scm } }
        stage('Parallel Build & Test') {
            parallel {
                stage('Frontend CI') { steps { sh 'cd frontend && npm install && npm run build' } }
                stage('Backend CI') { steps { sh 'cd backend && mvn clean package' } }
            }
        }
        stage('Docker Assemble') { steps { sh 'docker compose build' } }
        stage('Blue-Green Deploy') { steps { echo 'Deploying to high-availability cluster...' } }
    }
}
```

---

## 6. Quick Command Cheat Sheet

| Task | Command |
| :--- | :--- |
| **Open Virtual Terminal** | Press `` ` `` or `Ctrl + Shift + T` |
| **List Virtual Commands** | Type `help` inside terminal |
| **Root Access in Terminal** | Type `auth aditya2026` |
| **Inspect System Health** | Type `status` inside terminal |
| **Inspect CI/CD Status** | Type `cicd` inside terminal |
| **View Inbox Messages** | Type `messages` inside terminal |
| **Jump to Contact Section** | Type `goto contact` inside terminal |
| **Start Frontend Dev Server** | `cd frontend && npm run dev` |
| **Build Frontend** | `cd frontend && npm run build` |
| **Run All Services via Docker** | `docker compose up --build -d` |
| **Stop All Docker Services** | `docker compose down` |

---
*Created for Aditya Kumar — Enterprise Portfolio System 2026.*
