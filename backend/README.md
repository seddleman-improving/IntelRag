# IntelRag — Backend

FastAPI + LangChain + Chroma RAG backend for the Consulting Intelligence Platform.
Provides REST API endpoints for querying company intelligence using a local LLM.

---

## Prerequisites

- **UV** — Python package manager ([install](https://docs.astral.sh/uv/))
- **Ollama** running on Mac Mini at the configured URL with `qwen2.5:32b` and `nomic-embed-text` pulled

---

## Setup

All commands below should be run from the `/backend` directory.

### 1. Install dependencies

```bash
uv sync
```

### 2. Create your `.env` file

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Open `.env` and set each variable — **all three LLM variables are required** and the backend will not start without them:

```env
LLM_BASE_URL=http://<your-llm-host>:11434
LLM_MODEL=qwen2.5:32b
EMBED_MODEL=nomic-embed-text
CHROMA_PERSIST_DIR=./chroma_db
```

### 3. Build the Vector Index

Required on first clone and after any changes to files in `data/`:

```bash
uv run python scripts/ingest.py
```

This wipes the existing index and re-embeds all markdown files from `../data/`. Takes ~30 seconds.
`chroma_db/` is excluded from Git — this step is required on every fresh clone.

---

## Start the Dev Server

```bash
uv run uvicorn app.main:app --reload
```

Server runs at `http://localhost:8000`. The `--reload` flag watches for code changes and restarts automatically.

**To stop:** press `Ctrl+C` in the terminal running the server.

---

## Verify It's Running

```powershell
curl.exe -s http://localhost:8000/api/v1/health
```

Expected when LLM is reachable: `{"backend":"ok","llm":"ok"}`  
Expected when LLM is down: `{"backend":"ok","llm":"unreachable"}`

---

## API Docs

FastAPI provides interactive docs automatically at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Project Structure

```
app/
  main.py          — FastAPI app entry point (CORS, routes, health check)
  core/
    config.py      — Settings loaded from .env (LLM URL, models, Chroma path)
  api/             — Route handlers (query, companies)
scripts/           — Data loading and embedding scripts
.env.example       — Environment variable template (copy to .env)
pyproject.toml     — Python dependencies (UV-managed)
```

---

## Environment Variables

All variables are read from `.env` (see `.env.example` for the template).

| Variable | Required | Description |
|---|---|---|
| `LLM_BASE_URL` | ✅ Yes | Base URL of the LLM server (e.g. Ollama) |
| `LLM_MODEL` | ✅ Yes | LLM model name for answering queries |
| `EMBED_MODEL` | ✅ Yes | Embedding model name for vector indexing |
| `CHROMA_PERSIST_DIR` | No | Chroma vector DB path (default: `./chroma_db`) |
