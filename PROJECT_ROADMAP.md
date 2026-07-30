# Swift AI OS - Project Roadmap & Architecture

## Vision: The Free AI OS Browser
The ultimate goal is to make Swift AI OS completely free with unlimited access, functioning as a complete "AI OS Browser". This means transforming the interface into a unified workstation where users can not only chat but browse the web, run terminal commands, execute code, and manage their system using free, open-source AI models running locally or via free tier endpoints.

### What to do later (Future Enhancements)
1. **Local Model Integration**: Tightly integrate local inference engines (like Ollama or llama.cpp) directly into the desktop app so models like `Llama 3` or `Qwen` run completely offline, ensuring unlimited free usage without API costs.
2. **Web Browser Sandbox**: Build a Chromium-based browser view inside Swift where the AI can visually "see" the DOM and interact with websites on the user's behalf.
3. **Plugin Ecosystem**: Open up a plugin store where community developers can write tools (GitHub, Notion, Spotify, etc.) that the agents can dynamically load and execute.
4. **Persistent Multi-Agent Workspaces**: Allow the "Company Mode" agents to run in the background 24/7, continuously researching or monitoring logs while the user sleeps.

---

## How the Core Problems are Resolved

### 1. Memory Architecture
Swift implements a sophisticated **Multi-Tiered Memory System** rather than relying on a single context window:
- **Short-term Memory**: Manages the immediate conversation context and current state.
- **Semantic Memory**: Uses vector embeddings (via `pgvector` in PostgreSQL) to store facts, concepts, and relationships, allowing the agent to recall concepts using cosine similarity.
- **Long-term / Project Memory**: Stores decisions, file metadata, and architecture choices.
- **Learning & Preference Memory**: Tracks user habits (e.g., "Rishabh prefers React and Tailwind") so the system implicitly adapts its code generation.

### 2. Tool Calling (Function Calling)
Tool calling allows the agents to break out of their text-generation constraints.
- **Registry System**: Tools are registered in a central `tool_registry`. When an agent (like the Coding Agent or Web Agent) is invoked, it is provided with a schema of available tools.
- **Execution Loop**: When the LLM decides to use a tool, it outputs a structured JSON response (e.g., `{"tool": "read_file", "args": {...}}`). The orchestrator intercepts this, executes the Python function mapped to the tool, and feeds the result back into the LLM's context.

### 3. RAG (Retrieval-Augmented Generation)
The project uses a custom RAG pipeline to ingest and query large documents without exhausting the LLM context window:
- **Chunking Algorithm**: Documents (PDFs, Code, Web pages) are parsed and split into overlapping chunks (e.g., 800 tokens with 100 token overlap) using the `chunk_text` algorithm.
- **Embedding & Storage**: Each chunk is passed through an embedding model to generate a high-dimensional vector. These are stored in PostgreSQL using the `pgvector` extension.
- **Retrieval Mechanism**: When the user asks a question, the query is embedded into a vector. The database performs a **Cosine Similarity Search** (`1 - (dc.embedding <=> :qe)`) to find the top K most relevant chunks, which are then injected into the Research Agent's prompt.

### 4. Orchestration (LangGraph-style Routing)
Rather than a traditional linear LangChain sequence, Swift uses a **Stateful Graph Orchestrator** inspired by LangGraph.
- **State Machine**: The `GraphState` object holds the current conversation, active tasks, memory trace, and iterations.
- **Conditional Routing Algorithm**: The `Orchestrator` acts as a while-loop evaluating a Directed Cyclic Graph (DCG). 
  - The **CEO Agent** acts as the router node. It evaluates the user's prompt and decides whether to answer directly or delegate.
  - If delegation is needed, it transitions the state to the **Planner Agent**.
  - The Planner breaks the task down and spawns parallel sub-states for specialist agents (Coding, Vision, Docs).
  - Once specialists finish, the state transitions back to the CEO for synthesis.
  - This recursive routing allows the system to autonomously "think" and loop until a task is complete, rather than just generating a single completion.
