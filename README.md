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

---

## 🖼️ System Interface & Feature Review Walkthrough

Explore the complete visual tour and detailed capability review of each core module in **Swift AI OS**:

### 📊 1. Command Dashboard & Real-Time Telemetry
<div align="center">
  <img src="docs/Screenshots/dashboard.png" alt="Command Dashboard" width="100%" />
</div>

> **🔍 Feature Review & Capabilities:**
> - **Unified Workspace**: Quick prompt triggers for Code, Research, Memory, and Task Automation.
> - **Live Agent Activity**: Real-time log feeds tracking CEO, Planner, Coding, and Research agent execution completions.
> - **System Metrics**: Live CPU, Memory, Storage hardware telemetry alongside active agent and tool counts.

---

### 🎛️ 2. Multi-Agent Orchestration Engine (`/agents`)
<div align="center">
  <img src="docs/Screenshots/agents.png" alt="Multi-Agent System" width="100%" />
</div>

> **🔍 Feature Review & Capabilities:**
> - **14 Specialist Agents**: Live status dashboard displaying model assignments (Qwen 3.7 Plus, Llama 3.3 70B, DeepSeek Chat, Gemini 2.0 Flash, etc.).
> - **Task Counters**: Individual completed task counters for every specialist agent in the LangGraph network.

---

### 💬 3. Autonomous Conversational Interface (`/chat`)
<div align="center">
  <img src="docs/Screenshots/chat.png" alt="Interactive Chat Interface" width="100%" />
</div>

> **🔍 Feature Review & Capabilities:**
> - **Multi-Turn Orchestration**: Interactive chat powered by the autonomous multi-agent graph with tool attachment options.
> - **Streaming Output**: Real-time thoughts, code snippet rendering, and multi-agent delegation feedback.

---

### 🧠 4. 7-Layer Memory System (`/memory`)
<div align="center">
  <img src="docs/Screenshots/memory.png" alt="Memory System" width="100%" />
</div>

> **🔍 Feature Review & Capabilities:**
> - **Multi-Tier Persistence**: Real-time capacity indicators for Short-Term (In-Process), Episodic (SQLite 30-day), Semantic (ChromaDB Vector), and Conversation histories.
> - **Indexed Knowledge**: Aggregated stats for total memory chunks, conversation threads, indexed files, and extracted user facts.

---

### 📚 5. Vector RAG Knowledge Base (`/knowledge`)
<div align="center">
  <img src="docs/Screenshots/knowledge.png" alt="Knowledge Base RAG" width="100%" />
</div>

> **🔍 Feature Review & Capabilities:**
> - **Document Indexing**: ChromaDB vector store indexing for FastAPI documentation, LangGraph guides, and Markdown project requirements.
> - **One-Click Ingestion**: Upload custom PDFs, Word docs, text files, or remote GitHub repositories directly into vector memory.

---

### 🧰 6. Sandboxed Tool Execution Hub (`/tools`)
<div align="center">
  <img src="docs/Screenshots/tools.png" alt="Tools Catalog" width="100%" />
</div>

> **🔍 Feature Review & Capabilities:**
> - **7 Core System Tools**: Autonomous web search (DuckDuckGo & Tavily), Python/JS Code Runner, Workspace File System, Git tools, Playwright Browser automation, Terminal shell execution, and REST API caller.

---

### 📁 7. Project & Workspace Manager (`/projects`)
<div align="center">
  <img src="docs/Screenshots/projects.png" alt="Project Manager" width="100%" />
</div>

> **🔍 Feature Review & Capabilities:**
> - **Multi-Project Workspace**: Management dashboard for concurrent software engineering projects with progress tracking bars and dedicated agent allocations.

---

### 🔌 8. Pluggable Model Router & Manager (`/models`)
<div align="center">
  <img src="docs/Screenshots/model-manager.png" alt="Model Manager" width="100%" />
</div>

> **🔍 Feature Review & Capabilities:**
> - **LLM Router Matrix**: Live status, health monitoring, context window sizes, priority scores, capability tags (reasoning, coding, vision, planning), and pricing telemetries across Qwen, Gemini, DeepSeek, Groq, and Ollama.

---

### 🧩 9. Agent & Plugin Marketplace (`/marketplace`)
<div align="center">
  <img src="docs/Screenshots/marketplace.png" alt="Agent Marketplace" width="100%" />
</div>

> **🔍 Feature Review & Capabilities:**
> - **Extensible Architecture**: One-click install for community extensions such as *AutoCoder Pro*, *ResearchBot*, *DataAnalyzer*, and *DocWriter*.

---

### 📊 10. Performance & Analytics Dashboard (`/analytics`)
<div align="center">
  <img src="docs/Screenshots/analytics.png" alt="Analytics Dashboard" width="100%" />
</div>

> **🔍 Feature Review & Capabilities:**
> - **System Metrics**: Completed task counts, average response latencies (e.g. 2.4s), overall success rate (97.3%), and daily volume trends.

---

### 💻 11. Real-Time Developer Console (`/console`)
<div align="center">
  <img src="docs/Screenshots/console.png" alt="Developer Console" width="100%" />
</div>

> **🔍 Feature Review & Capabilities:**
> - **Live Agent Traces**: Integrated terminal view showing active agent status, model routing events, pluggable provider initialization, and diagnostics shell.

---

### ⚙️ 12. Provider Configuration & Settings (`/settings`)
<div align="center">
  <img src="docs/Screenshots/settings.png" alt="Settings Page" width="100%" />
</div>

> **🔍 Feature Review & Capabilities:**
> - **API Key Management**: Secure configuration inputs for Groq, Google AI, OpenAI, and Anthropic API keys, backend/frontend URLs, and default model selection.

---


## 👤 Developer & Maintainer

- **Developer**: **Rishabh** ([@rishabhtcodes](https://github.com/rishabhtcodes))
- **Project**: **Swift AI OS**
- **License**: **Personal / Non-Commercial Use Only**

---

<div align="center">

*Built with passion, caffeine, and modern AI engineering by Rishabh.* ⚡

</div>

