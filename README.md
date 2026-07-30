# Swift AI OS 🚀

**Swift AI OS** is a production-ready, personal AI Operating System and multi-agent orchestration platform designed for autonomous software engineering, reasoning, memory, RAG, and tool execution.

---

## 🌟 Key Architecture & Features

- **14 Specialized AI Agents**:
  - `CEO Agent` (Supervisor / Orchestrator)
  - `Planner Agent` (Task decomposition)
  - `Coding Agent`, `Research Agent`, `Vision Agent`, `Memory Agent`, `Learning Agent`, `Deployment Agent`, `Testing Agent`, `Documentation Agent`, `Database Agent`, `Frontend Agent`, `Backend Agent`, `DevOps Agent`
- **7-Layer Memory System**:
  1. Short-Term Memory (Redis TTL)
  2. Long-Term Memory (PostgreSQL)
  3. Semantic Memory (pgvector embeddings)
  4. Conversation Memory
  5. Project Memory
  6. User Preference Memory
  7. Learning Memory
- **Pluggable Model Router**:
  - Hot-swappable providers: **Groq** (Llama 3.1 70B/8B), **Google Gemini 1.5 Flash**, **Ollama**, **DeepSeek**, **Qwen**, **OpenAI**, **Anthropic**.
- **RAG Knowledge Pipeline**:
  - Supports PDF, Word, PowerPoint, Excel, CSV, Markdown, Web URLs, and GitHub ZIP repositories with citation mapping.
- **Sandboxed Tool Ecosystem**:
  - Filesystem, Terminal Shell, Sandboxed Python Executor, Web Scraper/Browser, Calculator, Docker, and GitHub integrations.
- **Software Engineering Mode**:
  - Give high-level goals like *"Build Spotify clone"* and watch 14 agents plan, generate database schemas, write backend APIs, build React UIs, execute tests, and package Docker deployment automatically.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, TailwindCSS, Framer Motion, React Router, TanStack Query, Lucide Icons.
- **Backend**: Python 3.12, FastAPI (Async), SQLAlchemy 2.0 (Async ORM), Alembic, Pydantic v2.
- **AI & DB**: LangGraph, LangChain, PostgreSQL 16 (with `pgvector`), Redis, ChromaDB.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Docker & Docker Compose
- Python 3.12+
- Node.js 18+ & npm

### 2. Single-Command Startup 🚀

Inside the `SWIFT` folder, simply run:

**On Windows (CMD / PowerShell):**
```cmd
.\start-swift.bat
```
*(Or in PowerShell: `.\start-swift.ps1`)*

**On Linux / macOS:**
```bash
chmod +x start-swift.sh
./start-swift.sh
```

This single command automatically:
1. Runs database schema setup and migrations.
2. Launches the FastAPI backend server on `http://localhost:8000`.
3. Launches the Vite frontend development server on `http://localhost:5173`.

### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment
cp .env.example .env
# Set your API keys in .env (e.g. GROQ_API_KEY, GOOGLE_API_KEY)

# Run Database Migrations
alembic init alembic
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Frontend Setup
```bash
# In a new terminal window:
cd frontend

# Install dependencies
npm install

# Build & launch Vite development server
npm run dev
```

- **Frontend Interface**: [http://localhost:5173](http://localhost:5173)
- **Backend Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔒 Security & Standards

- **JWT Authentication** with password hashing (`bcrypt`).
- **Path Restrictions & Sandboxing** on file operations and terminal executions.
- **Clean Architecture & SOLID Principles**: Service-Repository pattern with strict async execution.
