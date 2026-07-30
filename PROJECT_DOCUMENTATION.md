# Swift AI OS: Project Documentation

## 1. Abstract
Swift AI OS is a unified, multi-agent desktop application designed to seamlessly orchestrate various specialist AI models (e.g., Gemini, Llama, DeepSeek, Qwen) into a single cohesive operating system. Rather than exposing the user to disparate chatbots or standalone coding tools, Swift acts as a virtual company. It autonomously delegates tasks to specialized agents (CEO, Planner, Coding, Research, Vision, etc.) to handle complex software engineering, research, and daily workflows.

## 2. Problem Statement
Modern AI tools exist in silos. Users are forced to switch between tools for coding (Cursor/GitHub Copilot), search (Perplexity), chat (ChatGPT/Claude), and image generation (Midjourney/Flux). Furthermore, standard LLMs lack persistent memory, struggle with complex multi-step reasoning without strict hand-holding, and are restricted by finite context windows.

Specifically, the project aims to solve:
1. **Memory**: Traditional AI forgets user preferences, past chats, and project architectures.
2. **Tool Calling & Execution**: AI needs to break out of text generation to execute code, browse the web, and manage files.
3. **Retrieval-Augmented Generation (RAG)**: AI must process massive datasets (e.g., 100 research papers) without overflowing context limits.
4. **Agent Orchestration**: Coordinating multiple AI agents to collaboratively solve a problem requires dynamic routing rather than linear scripting.

## 3. Solution Architecture & Implementation

### 3.1 Orchestration (LangGraph-style Routing)
To resolve the orchestration problem, Swift does not use linear LangChain sequences. Instead, it implements a **Stateful Graph Orchestrator** inspired by LangGraph.
- **State Machine (`GraphState`)**: A persistent state object tracks the conversation history, active subtasks, memory traces, and iteration counts.
- **Conditional Routing Algorithm**: The system acts as a Directed Cyclic Graph (DCG). The **CEO Agent** serves as the router. It analyzes the user's intent. If the task is simple, it answers directly. If complex, it transitions the state to the **Planner Agent**, which breaks the task into parallel subtasks for specialist agents (e.g., Coding, Vision). Once completed, the state routes back to the CEO for synthesis.

### 3.2 Memory Architecture
Swift implements a sophisticated **Multi-Tiered Memory System** to resolve context limitations:
- **Short-term Memory**: Manages the immediate conversation context.
- **Semantic Memory**: Uses vector embeddings to store facts and concepts.
- **Long-term / Project Memory**: Persists project metadata, architecture decisions, and codebase knowledge.
- **Learning & Preference Memory**: Tracks user habits (e.g., preferred frameworks, coding styles) so the system implicitly adapts its output over time.

### 3.3 RAG (Retrieval-Augmented Generation)
To handle large documents (PDFs, Webpages, Code), Swift utilizes a custom RAG pipeline:
- **Chunking Algorithm**: Documents are parsed and split into overlapping chunks (e.g., 800 tokens with a 100-token overlap) to preserve contextual boundaries.
- **Vector Embedding**: Each chunk is passed through an embedding model to generate high-dimensional vectors, which are stored in PostgreSQL using the `pgvector` extension.
- **Retrieval Mechanism (Cosine Similarity)**: When a query is made, it is embedded into a vector. The database performs a **Cosine Similarity Search** (`1 - (dc.embedding <=> :qe)`) to fetch the top-K most relevant chunks, injecting them into the agent's prompt.

### 3.4 Tool Calling (Function Calling)
Tool calling allows the agents to execute real-world actions:
- **Registry System**: Tools are registered in a central `tool_registry`. When an agent is invoked, the orchestrator provides a strict JSON schema of available tools.
- **Execution Loop**: The LLM outputs a structured JSON response requesting a tool execution. The orchestrator pauses the LLM, executes the mapped Python function, and feeds the programmatic result back into the LLM's context window.

## 4. Future Roadmap: The Free AI OS Browser
The ultimate vision is to evolve Swift into a completely free, unlimited-access "AI OS Browser". 
- **Local Model Integration**: By tightly coupling local inference engines (like Ollama or llama.cpp) into the desktop app, models like Llama 3 or Qwen can run entirely offline, bypassing cloud API costs and ensuring privacy.
- **Web Browser Sandbox**: Implementing a Chromium-based browser view within Swift will allow the Vision and Web agents to visually parse DOMs and autonomously interact with websites.
- **Plugin Ecosystem**: A marketplace where developers can publish tools (GitHub, Notion, Docker integrations) that agents can dynamically discover and execute.
- **Background Autonomy**: Agents will run persistent, asynchronous background tasks (e.g., continuous log monitoring, nightly research scraping) while the user is away.
