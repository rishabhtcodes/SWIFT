<div align="center">

```
  ██████╗  ██╗██╗  ██╗██╗███████╗████████╗     █████╗ ██╗     ██████╗ ███████╗
 ██╔════╝  ██║██║  ██║██║██╔════╝╚══██╔══╝    ██╔══██╗██║    ██╔═══██╗██╔════╝
 ╚█████╗   ██║██║  ██║██║█████╗     ██║       ███████║██║    ██║   ██║███████╗
  ╚═══██╗  ██║██║  ██║██║██╔══╝     ██║       ██╔══██║██║    ██║   ██║╚════██║
 ██████╔╝  ██║╚█████╔╝██║██║        ██║       ██║  ██║██║    ╚██████╔╝███████║
 ╚═════╝   ╚═╝ ╚════╝ ╚═╝╚═╝        ╚═╝       ╚═╝  ╚═╝╚═╝     ╚═════╝ ╚══════╝
```

### ⚡ Autonomous Multi-Agent AI Operating System

*An intelligent, self-orchestrating personal AI Operating System designed for complex reasoning, autonomous software engineering, tool execution, multi-model routing, and knowledge retrieval.*

---

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Language-Python_3.12-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)
[![LangGraph](https://img.shields.io/badge/Orchestrator-LangGraph-FF6F61?style=for-the-badge)](https://www.langchain.com/)
[![TailwindCSS](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

</div>

> [!NOTE]
> **PERSONAL & NON-COMMERCIAL USE NOTICE**
> 
> **Swift AI OS** is a **personalized, non-commercial research & engineering project** created and developed by **Rishabh** ([@rishabhtcodes](https://github.com/rishabhtcodes)). It is built strictly for personal productivity, experimentation, and educational demonstration. It is **NOT** intended for commercial resale, SaaS monetization, or corporate deployment by third parties.

---

## 🌌 Overview

**Swift AI OS** acts as an autonomous personal engineering AI operating system (JARVIS-class system). Unlike standard single-chat interfaces, Swift AI OS deploys a **graph of 14 specialized AI agents** that work together concurrently to analyze, decompose, design, code, test, document, and deploy full applications.

<br />

<div align="center">
  <img src="docs/Screenshots/dashboard.png" alt="Swift AI OS Dashboard" width="95%" />
  <p><i>Figure 1: Swift AI OS Central Command Dashboard & Agent Telemetry</i></p>
</div>

<br />

```
                  ┌─────────────────────────────────────┐
                  │              USER GOAL              │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                          ┌─────────────────────┐
                          │      CEO AGENT      │
                          └──────────┬──────────┘
                                     │
                                     ▼
                          ┌─────────────────────┐
                          │    PLANNER AGENT    │
                          └──────────┬──────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  BACKEND AGENT   │       │  FRONTEND AGENT  │       │  DATABASE AGENT  │
└────────┬─────────┘       └────────┬─────────┘       └────────┬─────────┘
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     │
                                     ▼
                          ┌─────────────────────┐
                          │  TESTING & DEVOPS   │
                          └──────────┬──────────┘
                                     │
                                     ▼
                          ┌─────────────────────┐
                          │   FINAL SYNTHESIS   │
                          └─────────────────────┘
```
```
                           USER
                             │
                             ▼
                 ┌──────────────────────┐
                 │   Swift AI OS (UI)   │
                 │ React + Tailwind CSS │
                 └──────────────────────┘
                             │
                             ▼
                 ┌──────────────────────┐
                 │ FastAPI Backend API  │
                 └──────────────────────┘
                             │
                             ▼
              ┌─────────────────────────────┐
              │ LangGraph Orchestrator       │
              │ (Brain of Swift AI OS)       │
              └─────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
 ┌────────────┐      ┌─────────────┐      ┌─────────────┐
 │Model Router│      │Memory Engine│      │ RAG Engine  │
 └────────────┘      └─────────────┘      └─────────────┘
        │                    │                    │
        │                    │                    │
        ▼                    ▼                    ▼
 Multiple LLMs        PostgreSQL          ChromaDB
 (Gemini, Qwen,       User Memory         Embeddings
 DeepSeek, etc.)      Chat History        Documents
                                            PDFs
                                            GitHub
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Multi-Agent System  │
                  └─────────────────────┘
                             │
      ┌──────────┬──────────┬──────────┬──────────┐
      ▼          ▼          ▼          ▼
 Planner     Coding     Research    Vision
 Agent        Agent       Agent      Agent
      ▼          ▼          ▼          ▼
 Memory     Testing     Docs      Deployment
 Agent       Agent      Agent       Agent
                             │
                             ▼
                    ┌───────────────────┐
                    │ Tool Calling Hub  │
                    └───────────────────┘
                             │
     ┌─────────┬────────┬────────┬────────┬────────┐
     ▼         ▼        ▼        ▼        ▼
  GitHub     Files    Browser  Terminal Database
```

---

## 🤖 The 14 Specialist Agents

Every agent operates with explicit status tracking, execution logs, memory retrieval, and sandboxed tool access:

1. 👑 **CEO Agent** — High-level intent analysis, delegation, and final answer synthesis.
2. 🗺️ **Planner Agent** — Architecture design, sprint breakdown, and dependency resolution.
3. 💻 **Coding Agent** — Core multi-language software engineering and file generation.
4. ⚙️ **Backend Agent** — FastAPI microservices, REST APIs, and dependency injection.
5. 🎨 **Frontend Agent** — React 18, TypeScript, Tailwind CSS, and Framer Motion components.
6. 🗄️ **Database Agent** — PostgreSQL schemas, indexes, and vector store configurations.
7. 🧪 **Testing Agent** — Automated unit test suites (PyTest / Jest / Vitest).
8. 🚀 **Deployment Agent** — Vercel, Render, and production build pipelines.
9. 🛡️ **DevOps Agent** — Dockerfiles, `docker-compose.yml`, and CI/CD security.
10. 🔍 **Research Agent** — Real-time web scraping, browser automation, and document synthesis.
11. 👁️ **Vision Agent** — Multimodal image analysis using Qwen VL & Gemini Vision.
12. 🧠 **Memory Agent** — Multi-tiered memory indexing (short-term, long-term, semantic).
13. 🎓 **Learning Agent** — Continuous self-improvement and lesson extraction.
14. 📝 **Docs Agent** — OpenAPI specs, architecture documentation, and README generation.

---

## 🔌 Pluggable Model Router & Manager

No single model is hardcoded. Swift AI OS dynamically routes tasks based on capabilities (**reasoning**, **coding**, **vision**, **planning**, **RAG**, **translation**):

- 🔴 **DashScope / Qwen**: `qwen3.7-plus`, `qwen-vl-plus`, `qwen-plus`
- ⚡ **Groq**: `llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`
- ♊ **Google Gemini**: `gemini-2.0-flash`, `gemini-1.5-pro`
- 🐋 **DeepSeek**: `deepseek-chat` (V3)
- 🦙 **Ollama**: Local models (`llama3.2`)
- 🤖 **OpenAI & Anthropic**: `gpt-4o`, `claude-3.5-sonnet` (Optional via keys)

---

## 💻 Tech Stack & Architecture

```
Swift AI OS Architecture
├── Frontend (React 18 + Vite + TypeScript + TailwindCSS + TanStack Query + Framer Motion)
├── Backend (Python 3.12 + FastAPI + SQLAlchemy 2.0 Async + Pydantic v2)
├── Multi-Agent Engine (LangGraph + Custom Tool Loop + Model Router)
├── Storage & Vector DB (PostgreSQL 16 + pgvector + Redis + ChromaDB)
└── Execution Sandbox (Workspace Filesystem + Python Executor + Subprocess Shell)
```

---

## 🚀 Quickstart & One-Click Launch

### Single-Command Startup (Windows / Linux / macOS)

Run the automated launcher script from the root directory:

**Windows (CMD / PowerShell):**
```cmd
.\start-swift.bat
```
*(Or in PowerShell: `.\start-swift.ps1`)*

**Linux / macOS:**
```bash
chmod +x start-swift.sh
./start-swift.sh
```

This automatically initializes database tables, seeds default model registries, starts the FastAPI backend on `http://localhost:8000`, and launches the Vite frontend on `http://localhost:5173`.

---

## 🌐 Application Navigation & Visual Showcase

| Page | URL Route | Description |
|---|---|---|
| **Dashboard** | `/dashboard` | System overview, active agent runs, CPU/Memory telemetry |
| **Chat / Assistant** | `/chat` | Interactive multi-agent conversational interface |
| **Agents** | `/agents` | Overview & live status of all 14 specialist agents |
| **Memory** | `/memory` | Semantic, conversation, and project memory inspector |
| **Knowledge Base** | `/knowledge` | RAG document upload (PDF, Word, TXT, GitHub, Web URLs) |
| **Tools** | `/tools` | Sandboxed tools catalog and execution runner |
| **Projects** | `/projects` | Kanban task board, workspace file tree, and sprint progress |
| **Model Manager** | `/models` | Pluggable LLM health checks, latency, priorities, and cost |
| **Marketplace** | `/marketplace` | Discover community plugins, agent extensions, and tools |
| **Analytics** | `/analytics` | Token usage breakdown, cost tracking, latency metrics |
| **Developer Console**| `/console` | Real-time trace logs, active tool logs, shell runner |
| **Settings** | `/settings` | Provider API keys configuration & system parameters |

---

### 🖼️ Interface Showcase

<details>
<summary><b>📸 Click to view all System Screenshots & Visual Modules</b></summary>

<br />

#### 🎛️ 1. Multi-Agent Orchestration & Status
<div align="center">
  <img src="docs/Screenshots/agents.png" alt="Multi-Agent System" width="90%" />
  <p><i>14 Specialist Agents actively registered in LangGraph Orchestrator</i></p>
</div>

---

#### 💬 2. Conversational Agent Interface
<div align="center">
  <img src="docs/Screenshots/chat.png" alt="Interactive Chat" width="90%" />
  <p><i>Interactive multi-agent chat interface with execution streaming</i></p>
</div>

---

#### 🧠 3. Multi-Layer Memory Engine
<div align="center">
  <img src="docs/Screenshots/memory.png" alt="Memory Architecture" width="90%" />
  <p><i>7-Layer Memory Architecture showing Episodic, Semantic, and Session memories</i></p>
</div>

---

#### 📚 4. Knowledge Base & Vector RAG Store
<div align="center">
  <img src="docs/Screenshots/knowledge.png" alt="Knowledge Base" width="90%" />
  <p><i>ChromaDB vector store document manager and chunk indexer</i></p>
</div>

---

#### 🧰 5. Sandboxed Tool Execution Hub
<div align="center">
  <img src="docs/Screenshots/tools.png" alt="Sandboxed Tools" width="90%" />
  <p><i>Available system tools: Browser automation, Terminal shell, Git, Python executor</i></p>
</div>

---

#### 📁 6. Project & Workspace Manager
<div align="center">
  <img src="docs/Screenshots/projects.png" alt="Project Manager" width="90%" />
  <p><i>Active project workspace, sprint breakdown, and multi-agent assignment</i></p>
</div>

---

#### 🔌 7. Pluggable Model Manager & Telemetry
<div align="center">
  <img src="docs/Screenshots/model-manager.png" alt="Model Manager" width="90%" />
  <p><i>Multi-provider model routing (Qwen, Gemini, DeepSeek, Groq, Ollama)</i></p>
</div>

---

#### 🧩 8. Agent & Plugin Marketplace
<div align="center">
  <img src="docs/Screenshots/marketplace.png" alt="Marketplace" width="90%" />
  <p><i>Community extensions, custom tools, and specialist agent downloads</i></p>
</div>

---

#### 📊 9. Telemetry & Analytics Dashboard
<div align="center">
  <img src="docs/Screenshots/analytics.png" alt="Analytics Dashboard" width="90%" />
  <p><i>Agent performance metrics, task success rate, and response latencies</i></p>
</div>

---

#### 💻 10. Developer Terminal & Execution Console
<div align="center">
  <img src="docs/Screenshots/console.png" alt="Developer Console" width="90%" />
  <p><i>Real-time system traces, raw model routing logs, and execution terminal</i></p>
</div>

---

#### ⚙️ 11. System Configuration & Provider API Keys
<div align="center">
  <img src="docs/Screenshots/settings.png" alt="System Settings" width="90%" />
  <p><i>Provider API keys management, default model selection, and endpoint configurations</i></p>
</div>

</details>

---

## 👤 Developer & Maintainer

- **Developer**: **Rishabh** ([@rishabhtcodes](https://github.com/rishabhtcodes))
- **Project**: **Swift AI OS**
- **License**: **Personal / Non-Commercial Use Only**

---

<div align="center">

*Built with passion, caffeine, and modern AI engineering by Rishabh.* ⚡

</div>

