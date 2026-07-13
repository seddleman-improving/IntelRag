# IntelRag — Backend

FastAPI + LangChain + Chroma RAG backend for the Consulting Intelligence Platform.
Provides REST API endpoints for querying company intelligence using a local Ollama LLM.

---

## Prerequisites

- **UV** — Python package manager ([install](https://docs.astral.sh/uv/))
- **Ollama** running on Mac Mini at `192.168.100.224:11434` with `qwen2.5:32b` and `nomic-embed-text` pulled

---

## Setup

```bash
# From the /backend directory
uv sync
cp .env.example .env
```

---

## Start the Dev Server

```bash
uv run uvicorn app.main:app --reload
```

Server runs at `http://localhost:8000`

---

## Verify It's Running

```powershell
curl.exe -s http://localhost:8000/health
```

Expected: `{"status":"ok","service":"intelrag-backend"}`

---

## API Docs

FastAPI provides interactive docs automatically at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Project Structure

```
app/
  main.py          — FastAPI app entry point (CORS, routes)
  core/
    config.py      — Settings loaded from .env (Ollama URL, models, Chroma path)
  api/             — Route handlers go here
scripts/           — Data loading and embedding scripts
.env.example       — Environment variable template
pyproject.toml     — Python dependencies (UV-managed)
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_BASE_URL` | `http://192.168.100.224:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `qwen2.5:32b` | LLM model name |
| `OLLAMA_EMBED_MODEL` | `nomic-embed-text` | Embedding model name |
| `CHROMA_PERSIST_DIR` | `./chroma_db` | Chroma vector DB storage path |
