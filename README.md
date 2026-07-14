# Consulting Intelligence Platform

A RAG-based internal tool for a software consulting firm. Enables consultants to query company intelligence, prospect for clients, and prepare for engagements using a conversational AI interface.

Built with: Python · FastAPI · LangChain · Chroma · React · shadcn/ui · Tailwind CSS

> **Prototype docs:** See [`docs/prototype-setup.md`](docs/prototype-setup.md) for the specific Ollama + Mac Mini configuration used in v1.

---

## How It Works

The platform uses a **Retrieval-Augmented Generation (RAG)** pipeline:

1. Company profiles, industry content, and engagement history are stored as markdown files in `/data`
2. On ingestion, documents are chunked, embedded, and stored in a local Chroma vector database
3. When a user asks a question, the backend retrieves the most relevant chunks and passes them to an LLM
4. The LLM generates a grounded answer — no hallucinated facts outside the provided context

The LLM backend is **configurable** via environment variables. The prototype uses Ollama running locally, but the architecture supports any OpenAI-compatible API (Azure OpenAI, OpenAI, etc.).

---

## Prerequisites

### Python — managed with UV

This project uses **[UV](https://docs.astral.sh/uv/)** for all Python version and package management. Do not use `pip`, `virtualenv`, or `python -m venv` directly.

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Verify: `uv --version`

### Node.js

Required for the React frontend. Install the LTS version from [nodejs.org](https://nodejs.org).

### LLM Inference Server

The backend requires access to an LLM server that exposes an API compatible with the configured provider. Set the connection details in `backend/.env` (see below). For the current prototype setup using Ollama, see [`docs/prototype-setup.md`](docs/prototype-setup.md).

---

## Setup

### 1. Backend

```bash
# From /backend
uv sync
cp .env.example .env   # then edit .env with your LLM settings
```

**Required environment variables** (the backend will not start without them):

| Variable | Description |
|---|---|
| `LLM_BASE_URL` | Base URL of the LLM server |
| `LLM_MODEL` | Model name for answering queries |
| `EMBED_MODEL` | Model name for generating embeddings |

Optional:

| Variable | Default | Description |
|---|---|---|
| `CHROMA_PERSIST_DIR` | `./chroma_db` | Path to the Chroma vector database |

### 2. Build the Vector Index

Required on first clone and after any changes to files in `/data`:

```bash
# From /backend
uv run python scripts/ingest.py
```

> `chroma_db/` is excluded from Git — this step is required on every fresh clone.

### 3. Frontend

```bash
# From /frontend
npm install
```

---

## Running the Application

**Backend** (from `/backend`):
```bash
uv run uvicorn app.main:app --reload
```
Runs at `http://localhost:8000`. Stop with `Ctrl+C`.

**Frontend** (from `/frontend`):
```bash
npm run dev
```
Runs at `http://localhost:5173`.

### Verify the backend is healthy

```powershell
curl.exe -s http://localhost:8000/api/v1/health
```

Expected: `{"backend":"ok","llm":"ok"}`

---

## Project Structure

```
/backend                  — FastAPI + LangChain + Chroma (UV-managed)
  /app
    main.py               — FastAPI entry point, health check endpoint
    /core
      config.py           — Settings loaded from .env
      rag.py              — RAG chain: retriever + LLM + prompt
    /api
      query.py            — POST /api/v1/query
      companies.py        — GET /api/v1/companies[/{slug}]
  /scripts
    ingest.py             — Chunk, embed, and store data in Chroma
  .env.example            — Environment variable template
  pyproject.toml          — Python dependencies (UV)

/frontend                 — React + TypeScript + Vite
  /src
    App.tsx               — Main UI (query input, history, company panel)
    /components           — CompanyPanel, etc.
    /hooks                — useHealthStatus, useQueryHistory
    /types/api.ts         — Typed API fetch wrappers

/data                     — Source knowledge base (markdown files)
  /companies              — Company profiles
  /industry               — Industry content
  /proposals              — Past engagement summaries

/docs                     — Additional documentation
  prototype-setup.md      — Ollama + Mac Mini prototype configuration
```

---

## What Gets Committed to Git

The following are **excluded** from version control:

- `backend/.env` — your local environment variables
- `backend/chroma_db/` — generated vector database (rebuild with `ingest.py`)
- `backend/.venv/` and `.venv/` — UV-managed virtual environments
- `frontend/node_modules/`
