# Build Task List: Consulting Intelligence Platform

> Derived from brainstorming session — 2026-06-23 / 2026-06-25
> Principle: Form follows function — RAG first, UI second

---

## Pre-Development (Before Writing App Code)

- [ ] **DEV STEP 1:** Install Ollama on Apple Mac Mini
- [ ] Set `OLLAMA_HOST=0.0.0.0` on Mac Mini to expose on local network
- [ ] Pull a model on Mac Mini (recommended: `llama3.1` 8B or `mistral`)
- [ ] Pull embedding model on Mac Mini (`nomic-embed-text`)
- [ ] Verify laptop can reach Mac Mini: `curl http://<mac-mini-ip>:11434/api/tags`
- [ ] Set up Python project with UV (`pyproject.toml`, virtual env)
- [ ] Install core dependencies: `fastapi`, `langchain`, `chromadb`, `uvicorn`

---

## Week 1–2: RAG Backend

### Mock Data Design & Creation
- [ ] Define company data schema (name, industry, revenue, IT spend estimate, tech signals, open reqs)
- [ ] Define industry content schema (title, source type, company, topic, body)
- [ ] Define firm proposals schema (client, service line, pain points, solution summary, outcome)
- [ ] Create mock data for 5–8 fictional companies (realistic but clearly illustrative)
- [ ] Write mock industry content (3–5 blog/press release snippets per domain)
- [ ] Write mock firm proposals (2–3 past engagement summaries per service line)

### RAG Pipeline
- [ ] Implement document loader (load mock data files into LangChain documents)
- [ ] Implement chunking strategy (tune chunk size + overlap for each domain type)
- [ ] Implement embedding pipeline (Ollama `nomic-embed-text` via LangChain)
- [ ] Implement Chroma vector store (persist to local disk)
- [ ] Implement retrieval chain (semantic search → context → LLM synthesis)
- [ ] Configure LangChain Ollama LLM (`base_url` pointing to Mac Mini IP)
- [ ] Implement prompt templates per query type (financial, solution research, offer matching, "done this before")

### FastAPI Backend
- [ ] `POST /query` — accepts natural language question, returns RAG answer
- [ ] `GET /companies` — returns list of companies in the knowledge base
- [ ] `GET /companies/{id}` — returns company summary card
- [ ] CORS configured for local React dev server

### Acceptance Testing
- [ ] Run all 10 test questions against the RAG
- [ ] Validate answers are relevant, grounded, and mostly repeatable
- [ ] Tune prompts / chunking / retrieval until all 10 pass
- [ ] **Gate: do not start UI until all 10 questions return good answers**

---

## Week 3: React Frontend

### Project Setup
- [ ] Bootstrap React app (Vite + TypeScript)
- [ ] Install shadcn/ui, Tailwind CSS
- [ ] Configure API client (React Query or fetch wrapper pointing to FastAPI)

### Discovery View (Breadth — Prospecting)
- [ ] Company list/filter page (filter by industry, estimated IT spend range)
- [ ] Search bar for natural language prospecting query
- [ ] Company card component (name, industry, IT spend estimate, service fit indicators)
- [ ] "Add to targets" action on each company card

### Deep-Dive View (Depth — Company Intel)
- [ ] Company detail page (full intel summary)
- [ ] Financial section (revenue, IT spend breakdown, trend)
- [ ] Tech initiatives section (current investments and signals)
- [ ] Service fit section (which of our 3 service lines fits and why)
- [ ] "We've done this before" panel (matched past engagements with confidence badge)

### Query Interface
- [ ] Natural language chat/query input
- [ ] Answer display with source attribution
- [ ] Query history within session

### Workflow Handoff
- [ ] "Prep for first call" prompt when company is added to targets
- [ ] Saved targets list (session state minimum; local storage optional)

---

## Week 4: Polish & Demo

### Polish
- [ ] Responsive layout (desktop-first, tablet-acceptable)
- [ ] Loading states and error handling
- [ ] Empty states for each view
- [ ] Demo script written and rehearsed against all 10 test questions

### "We've Done This Before" Feature (if not done in Week 3)
- [ ] Match prospect pain points against firm proposals knowledge base
- [ ] Render confidence badge ("3 similar engagements found") with expandable detail

### Stretch Goal: Real Public Company Data
- [ ] Identify 3–5 well-known public companies (Microsoft, Salesforce, major bank)
- [ ] Gather public financial data (annual reports, press releases)
- [ ] Load into RAG alongside or replacing mock data
- [ ] Verify 10 test questions still return good answers

### Demo Preparation
- [ ] Prepare demo environment (Mac Mini running, Chroma loaded, FastAPI + React running)
- [ ] Rehearse full walkthrough: prospecting → target → deep-dive → "we've done this before"
- [ ] Prepare the ask: *"This is finished. Now we need real data and a pipeline to keep it current."*

---

## Post-Demo (Phase 2 Backlog)

- [ ] Define real data sources and ingestion strategy
- [ ] Build data ingestion pipeline (scrapers, API integrations, file uploads)
- [ ] Swap Ollama → OpenAI / Azure OpenAI (1 LangChain config change)
- [ ] Add person / stakeholder profile domain
- [ ] Plan integration with existing company system
- [ ] Deploy to shared environment (not just local laptop)
