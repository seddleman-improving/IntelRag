# Project Context — Consulting Intelligence Platform

> This file is loaded automatically by BMad agents as persistent context.
> Keep it current as decisions are made. Do not bloat it — facts only.

---

## Project Identity

- **Project name:** Consulting Intelligence Platform
- **Repo name:** MyEcho
- **Purpose:** RAG-based internal tool for a software consulting firm — enables consultants to prospect for companies with large IT/software budgets and prepare for client engagements
- **Target users:** Internal consultants (primary), firm leadership (secondary)

---

## Toolchain — Non-Negotiable

- **Python package and version management: UV** — always use `uv` to install packages, run scripts, and manage the virtual environment. Never use `pip`, `pip install`, `python -m venv`, or `virtualenv` directly. All Python commands in this project run via `uv run` or within a `uv`-managed environment.
- **Node package management: npm** (or as decided when frontend scaffolding begins)

---

## Tech Stack (confirmed)

| Layer | Choice | Notes |
|---|---|---|
| LLM | Ollama (local) — `qwen2.5:32b` | Runs on Apple Mac Mini at `192.168.100.224`. Swap to OpenAI / Azure with 1 config change. |
| Embeddings | `nomic-embed-text` via Ollama | Local, free, swappable |
| Vector DB | Chroma | In-process, persists to local disk |
| RAG Framework | LangChain | Provider-agnostic — Ollama today, any LLM tomorrow |
| Backend | Python + FastAPI | REST API, UV-managed |
| Frontend | React + shadcn/ui + Tailwind CSS | Vite + TypeScript |

---

## Architecture Decisions

- **API-first, standalone** — no external system dependencies in v1; clean REST surface for future integration
- **LLM-agnostic** — LLM provider configured via environment variables, never hardcoded
- **Mock data first** — all three knowledge domains use synthetic data in v1; real data ingestion deferred post-demo
- **Form follows function** — RAG backend proven before UI is built

---

## Infrastructure

- **Dev machine:** Windows laptop (code lives here, Cascade runs here)
- **Inference server:** Apple Mac Mini — `192.168.100.224` — runs Ollama with `OLLAMA_HOST=0.0.0.0`
- **Ollama URL:** `http://192.168.100.224:11434` — configured via `OLLAMA_BASE_URL` environment variable (never hardcoded)
- **LLM model:** `qwen2.5:32b`
- **Embedding model:** `nomic-embed-text`

---

## Project Structure (planned)

```
/backend              — FastAPI + LangChain + Chroma (UV-managed Python project)
  /app              — FastAPI application code
  /scripts          — data loading and embedding scripts (shares backend .venv)
  pyproject.toml    — backend Python dependencies (UV)
  .env.example      — environment variable template
/frontend             — React + shadcn/ui + Tailwind (Vite + TypeScript)
/data                 — raw mock data files (JSON / markdown)
README.md             — human setup guide
project-context.md    — this file (BMad agent context)
```

**Python environments (two, intentionally separate):**
- Root `.venv` — BMad planning tooling only (`_bmad/scripts/`). Do not add app dependencies here.
- `backend/.venv` — all application Python code: FastAPI, LangChain, Chroma, and data loading scripts.

---

## Three Knowledge Domains (v1, all mock data)

1. **Company financials** — revenue, IT spend estimates, signals
2. **Industry content** — blogs, press releases, case studies
3. **Firm's own knowledge** — past proposals, delivered projects, service catalog

---

## Descoped from v1

- Person / stakeholder profiles
- Real data ingestion pipeline
- Integration with existing company systems

---

## Week 2 Acceptance Gate

RAG must answer 10 defined test questions covering financial intel, discovery/prospecting, solution research, offer matching, and "we've done this before" — with good, mostly-repeatable answers — before UI work begins. See `_bmad-output/brainstorming/.../brainstorm-intent.md` for the full question list.
