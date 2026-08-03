# 🏛️ Swift AI OS Architecture Specification

## 1. System Architecture Overview

**Swift AI OS** is designed as a modular, asynchronous, multi-agent AI operating system. The system decouples the presentation layer from the execution orchestrator, memory engines, and pluggable LLM routers.

```mermaid
graph TB
    subgraph UI ["💻 Presentation Layer"]
        ReactUI["React 18 + TypeScript + Tailwind CSS\n(Vite Dev Server :5173)"]
    end

    subgraph API ["⚡ API Gateway & Backend Layer"]
        FastAPI["FastAPI Async Server\n(Uvicorn :8000)"]
    end

    subgraph Core ["🧠 Brain & Orchestration Layer"]
        LangGraph["LangGraph Multi-Agent Orchestrator\n(StateGraph + ReAct Loop)"]
        ModelRouter["Pluggable Model Router\n(Routing & Priority Optimizer)"]
    end

    subgraph Storage ["💾 Storage & Vector Layer"]
        PostgreSQL[("PostgreSQL 16\n(User Data, Tasks, Sessions)")]
        ChromaDB[("ChromaDB Vector Store\n(Document Embeddings & RAG)")]
        MemoryEngine[("7-Layer Memory Engine\n(In-Process, SQLite & ChromaDB)")]
    end

    subgraph Providers ["🤖 Multi-Provider Model Matrix"]
        Qwen["DashScope (Qwen 3.7 Plus / VL)"]
        Groq["Groq (Llama 3.3 70B / 3.1 8B)"]
        Gemini["Google Gemini (2.0 Flash / 1.5 Pro)"]
        DeepSeek["DeepSeek Chat (V3)"]
        Ollama["Ollama (Local Llama 3.2)"]
    end

    subgraph Tools ["🧰 Execution Sandbox"]
        TerminalTool["Subprocess Terminal Executor"]
        FileTool["Workspace File Manager"]
        BrowserTool["Playwright Browser Controller"]
        SearchTool["Tavily & DuckDuckGo Search"]
        GitTool["Git Version Control"]
    end

    ReactUI <-->|REST / SSE WebSockets| FastAPI
    FastAPI <--> LangGraph
    LangGraph <--> ModelRouter
    ModelRouter <--> Qwen & Groq & Gemini & DeepSeek & Ollama
    LangGraph <--> MemoryEngine
    MemoryEngine <--> PostgreSQL & ChromaDB
    LangGraph <--> Tools
```

---

## 2. Multi-Agent Orchestration Flow

The core brain relies on **LangGraph StateGraph** to direct messages across 14 specialist agents concurrently:

```mermaid
flowchart TD
    User([👤 USER PROMPT]) --> CEO[👑 CEO Agent / Intent Classifier]
    CEO --> Planner[🗺️ Planner Agent / Sprint Breakdown]
    
    subgraph ExecutionLayer ["⚡ Concurrent Specialist Execution Layer"]
        Planner --> Backend[⚙️ Backend Agent]
        Planner --> Frontend[🎨 Frontend Agent]
        Planner --> Database[🗄️ Database Agent]
        Planner --> Research[🔍 Research Agent]
        Planner --> Vision[👁️ Vision Agent]
    end
    
    Backend & Frontend & Database & Research & Vision --> QualityLayer["🧪 Testing & DevOps Validation Layer"]
    QualityLayer --> Synthesis[✨ CEO Final Answer & Code Synthesis]
    Synthesis --> Output([🚀 Workspace & User Response])
```

---

## 3. Core Component Definitions

| Component | Technology | Role & Function |
|---|---|---|
| **Frontend UI** | React 18, TypeScript, TailwindCSS | User interface, real-time agent telemetry, settings manager |
| **Backend REST API** | Python 3.12, FastAPI, Pydantic v2 | API gateway, WebSocket streaming, task scheduling |
| **Agent Orchestrator** | LangGraph, LangChain | Multi-agent execution loop, state management |
| **Model Router** | Custom Python Middleware | Dynamic model selection (Qwen, Groq, Gemini, DeepSeek, Ollama) |
| **Vector DB / RAG** | ChromaDB, Sentence-Transformers | Knowledge base chunking, semantic similarity retrieval |
| **Relational Storage** | PostgreSQL 16, SQLAlchemy 2.0 Async | Persistent user accounts, project tasks, conversation histories |
