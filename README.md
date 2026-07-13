# Consulting Intelligence Platform

A RAG-based internal tool for a software consulting firm. Enables consultants to prospect for companies with large IT/software development budgets and prepare intelligently for client engagements.

Built with: Python · FastAPI · LangChain · Chroma · Ollama · React · shadcn/ui

---

## Prerequisites

### Python — managed with UV

This project uses **[UV](https://docs.astral.sh/uv/)** for all Python version and package management. Do not use `pip`, `virtualenv`, or `python -m venv` directly.

Install UV (if not already installed):

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Verify:

```bash
uv --version
```

### Node.js

Required for the React frontend. Install via [nodejs.org](https://nodejs.org) (LTS version).

### Ollama (inference server)

The RAG backend uses **[Ollama](https://ollama.com)** to run LLMs locally. Ollama runs on a dedicated Apple Mac Mini on the local network — it does not need to be installed on the development machine.

See **Mac Mini Setup** below.

---

## Mac Mini Setup (Ollama Inference Server)

These steps are run **once** on the Apple Mac Mini — not on the development laptop.

1. Install Ollama from [ollama.com](https://ollama.com)

2. Pull the required models:
   ```bash
   ollama pull llama3.1
   ollama pull nomic-embed-text
   ```

3. Expose Ollama on the local network (add to `~/.zshrc` for persistence):
   ```bash
   export OLLAMA_HOST=0.0.0.0
   ```

4. Restart Ollama (or reboot). Verify it is reachable from the dev laptop:
   ```bash
   curl http://<mac-mini-ip>:11434/api/tags
   ```
   You should see a JSON list of pulled models.

5. **Recommended:** Assign a static local IP to the Mac Mini in your router settings so the address never changes.

---

## Environment Setup

Copy `.env.example` to `.env` in the `/backend` folder and fill in your values:

```bash
cp backend/.env.example backend/.env
```

Required variables:

```
OLLAMA_BASE_URL=http://192.168.x.x:11434
OLLAMA_MODEL=llama3.1
OLLAMA_EMBED_MODEL=nomic-embed-text
```

---

## Running the Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

---

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
/backend              — FastAPI + LangChain + Chroma (UV-managed Python project)
  /app              — FastAPI application code
  /scripts          — data loading and embedding scripts (shares backend .venv)
  pyproject.toml    — backend Python dependencies (UV)
  .env.example      — environment variable template
/frontend             — React + shadcn/ui + Tailwind (Vite + TypeScript)
/data                 — raw mock data files (JSON / markdown)
README.md
project-context.md    — BMad agent persistent context
```

**Python environments:**
- Root `.venv` — BMad planning tooling only (`_bmad/scripts/`)
- `backend/.venv` — all application Python code (FastAPI, LangChain, Chroma, data scripts)

---

## What Gets Committed to Git

The following are **excluded** from version control (see `.gitignore`):

- `backend/.env` — environment variables (API keys, IP addresses)
- `backend/chroma_db/` — vector database (generated from data, not source code)
- `backend/.venv/` — UV-managed backend virtual environment
- `.venv/` — root UV environment (BMad tooling only)
- `frontend/node_modules/`

---

## Development Status

This project is in early development. See `_bmad-output/brainstorming/` for the full session notes, intent doc, and task list from the initial planning brainstorm.
