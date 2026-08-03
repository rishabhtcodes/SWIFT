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

---

## 🏛️ System Architecture

### 1. Multi-Agent Orchestration Flow (LangGraph Execution Pipeline)

```mermaid
flowchart TD
    User([👤 USER PROMPT]) --> CEO[👑 CEO Agent / Intent Classifier]
    CEO --> Planner[🗺️ Planner Agent / Architecture & Breakdown]
    
    subgraph ParallelExecution ["⚡ Concurrent Specialist Execution Layer"]
        Planner --> Backend[⚙️ Backend Agent]
        Planner --> Frontend[🎨 Frontend Agent]
        Planner --> Database[🗄️ Database Agent]
        Planner --> Research[🔍 Research & RAG Agent]
        Planner --> Vision[👁️ Multimodal Vision Agent]
    end
    
    Backend & Frontend & Database & Research & Vision --> QualityControl["🧪 Testing & DevOps Validation Layer"]
    QualityControl --> Synthesis[✨ CEO Final Answer & Code Synthesis]
    Synthesis --> Output([🚀 User Workspace & Interactive Response])
```

### 2. High-Level System Architecture & Component Interactions

```mermaid
graph TB
    subgraph UI ["💻 Presentation Layer"]
        ReactUI["React 18 + TypeScript + Tailwind CSS\n(Vite Dev Server :5173)"]
    end

    subgraph API ["⚡ API & Gateway Layer"]
        FastAPI["FastAPI Async Server\n(Uvicorn :8000)"]
    end

    subgraph Core ["🧠 Brain & Orchestration Layer"]
        LangGraph["LangGraph Multi-Agent Orchestrator\n(StateGraph + ReAct Execution Loop)"]
        Router["Pluggable Model Router\n(Dynamic Model Selector & Cost Optimizer)"]
    end

    subgraph Storage ["💾 Data & Memory Layer"]
        PostgreSQL[("PostgreSQL 16\n(Users, Chat History & Tasks)")]
        ChromaDB[("ChromaDB Vector Store\n(RAG Embeddings & Docs)")]
        SevenLayerMemory[("7-Layer Memory Engine\n(Short-term, Episodic & Semantic)")]
    end

    subgraph LLM ["🤖 Multi-Provider LLM Router Matrix"]
        Qwen["DashScope (Qwen 3.7 Plus / VL)"]
        Groq["Groq (Llama 3.3 70B / 3.1 8B)"]
        Gemini["Google Gemini (2.0 Flash / 1.5 Pro)"]
        DeepSeek["DeepSeek Chat (V3)"]
        Ollama["Ollama (Local Llama 3.2)"]
    end

    subgraph Tools ["🧰 Sandboxed Tool Execution Engine"]
        TerminalTool["Terminal / Shell Executor"]
        FileTool["Workspace File Manager"]
        BrowserTool["Playwright Browser Automation"]
        SearchTool["Tavily & DuckDuckGo Web Search"]
        GitTool["Git Version Control Tool"]
    end

    ReactUI <-->|REST API / WebSockets| FastAPI
    FastAPI <--> LangGraph
    LangGraph <--> Router
    Router <--> Qwen & Groq & Gemini & DeepSeek & Ollama
    LangGraph <--> SevenLayerMemory
    SevenLayerMemory <--> PostgreSQL & ChromaDB
    LangGraph <--> Tools
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

## 🖼️ System Screenshots Gallery Grid

<div align="center">

<table>
  <tr>
    <td width="50%" align="center">
      <b>📊 Command Dashboard</b><br/><br/>
      <a href="docs/Screenshots/dashboard.png">
        <img src="docs/Screenshots/dashboard.png" width="100%" alt="Dashboard" />
      </a>
      <p><i>System Overview, Telemetry & Quick Prompts</i></p>
    </td>
    <td width="50%" align="center">
      <b>🎛️ Multi-Agent Orchestration</b><br/><br/>
      <a href="docs/Screenshots/agents.png">
        <img src="docs/Screenshots/agents.png" width="100%" alt="Agents" />
      </a>
      <p><i>14 Specialist Agents & Model Routing Status</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <b>💬 Conversational Agent Interface</b><br/><br/>
      <a href="docs/Screenshots/chat.png">
        <img src="docs/Screenshots/chat.png" width="100%" alt="Chat" />
      </a>
      <p><i>Multi-Turn Interactive Chat & Execution Stream</i></p>
    </td>
    <td width="50%" align="center">
      <b>🧠 7-Layer Memory System</b><br/><br/>
      <a href="docs/Screenshots/memory.png">
        <img src="docs/Screenshots/memory.png" width="100%" alt="Memory" />
      </a>
      <p><i>Episodic, Semantic & Session Memories</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <b>📚 Vector RAG Knowledge Base</b><br/><br/>
      <a href="docs/Screenshots/knowledge.png">
        <img src="docs/Screenshots/knowledge.png" width="100%" alt="Knowledge Base" />
      </a>
      <p><i>ChromaDB Vector Store & Document Ingestion</i></p>
    </td>
    <td width="50%" align="center">
      <b>🧰 Sandboxed Tool Execution Hub</b><br/><br/>
      <a href="docs/Screenshots/tools.png">
        <img src="docs/Screenshots/tools.png" width="100%" alt="Tools" />
      </a>
      <p><i>Browser, Terminal, Git & Python Executors</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <b>📁 Project & Workspace Manager</b><br/><br/>
      <a href="docs/Screenshots/projects.png">
        <img src="docs/Screenshots/projects.png" width="100%" alt="Projects" />
      </a>
      <p><i>Kanban Board & Sprint Workspaces</i></p>
    </td>
    <td width="50%" align="center">
      <b>🔌 Pluggable Model Manager</b><br/><br/>
      <a href="docs/Screenshots/model-manager.png">
        <img src="docs/Screenshots/model-manager.png" width="100%" alt="Model Manager" />
      </a>
      <p><i>Multi-Provider Router & Latency Telemetry</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <b>🧩 Agent & Plugin Marketplace</b><br/><br/>
      <a href="docs/Screenshots/marketplace.png">
        <img src="docs/Screenshots/marketplace.png" width="100%" alt="Marketplace" />
      </a>
      <p><i>Community Extension & Agent Downloads</i></p>
    </td>
    <td width="50%" align="center">
      <b>📊 Performance & Analytics</b><br/><br/>
      <a href="docs/Screenshots/analytics.png">
        <img src="docs/Screenshots/analytics.png" width="100%" alt="Analytics" />
      </a>
      <p><i>Success Rates & Task Completion Charts</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <b>💻 Developer Terminal Console</b><br/><br/>
      <a href="docs/Screenshots/console.png">
        <img src="docs/Screenshots/console.png" width="100%" alt="Console" />
      </a>
      <p><i>Real-Time Execution Traces & Diagnostic Logs</i></p>
    </td>
    <td width="50%" align="center">
      <b>⚙️ Provider Settings & API Keys</b><br/><br/>
      <a href="docs/Screenshots/settings.png">
        <img src="docs/Screenshots/settings.png" width="100%" alt="Settings" />
      </a>
      <p><i>Provider API Keys & System Preferences</i></p>
    </td>
  </tr>
</table>

</div>

---



## 👤 Developer & Maintainer

- **Developer**: **Rishabh** ([@rishabhtcodes](https://github.com/rishabhtcodes))
- **Project**: **Swift AI OS**
- **License**: **Personal / Non-Commercial Use Only**

---

<div align="center">

*Built with passion, caffeine, and modern AI engineering by Rishabh.* ⚡

</div>

