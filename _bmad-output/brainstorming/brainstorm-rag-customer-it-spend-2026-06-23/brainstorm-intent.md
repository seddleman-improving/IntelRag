# Brainstorm Intent: Consulting Intelligence Platform

> Produced from brainstorming session — 2026-06-23 / 2026-06-25
> Source: `.memlog.md` in this folder
> Feed into: `bmad-product-brief`, `bmad-prd`, or `bmad-spec`

---

## Strategic Driver (Root Cause)

The firm must build demonstrable AI capability to stay competitive. This project is the opening move — the consulting intelligence platform is the vehicle; becoming an AI-capable firm is the destination. Success is measured both by the app working and by the capability story it tells.

---

## Problem Statement

Consultants at a software consulting firm lack fast, organized access to intelligence about target companies — specifically their IT and software development spend, tech posture, and fit for the firm's service lines. This information is scattered, inconsistently collected, and not prioritized — leaving consultants underprepared for prospecting and pre-meeting engagements.

---

## Primary Users

- **Consultant (priority 1)** — needs to prospect smarter, prep faster, and walk into meetings feeling credible and prepared
- **Firm leadership (priority 2)** — needs to prove AI capability internally and to potential clients

---

## Core Jobs to Be Done

| Job | Context | Progress being made |
|---|---|---|
| **Prospect smarter** | At desk, looking for next conversation | Empty pipeline → qualified targets |
| **Prep for a meeting** | Planning before a known engagement | Uncertainty → confidence and credibility |

These two jobs share the same data and connect: when a prospect is targeted, the app prompts prep for the first call.

---

## Firm Service Lines (maps to budget signals)

| Service | What to look for in a target company |
|---|---|
| Fixed-price project work | Capex IT spend, major tech initiatives, build-vs-buy signals |
| Staff augmentation (6+ months) | Open dev reqs, contractor headcount, tech attrition signals |
| Coaching / team leading | Rapid growth, tech debt signals, failed delivery patterns |

---

## Scope — v1

**Three knowledge domains (all mock/synthetic data in v1):**
1. Company financials — revenue, IT spend estimates, spend signals
2. Industry content — blogs, press releases, case studies
3. Firm's own knowledge — past proposals, delivered projects, service catalog

**Two interface views (same data, different lenses):**
- Discovery / Prospecting — breadth, filtering, find targets
- Company Deep-dive — depth, intel on a specific company

**Signature feature:**
- "We've done this before" — confidence badges linking prospect pain points to the firm's past engagements and proposals

**Workflow:**
- Prospect → Target → Prep handoff (app connects the two jobs)

---

## Descoped — v1

- Person / stakeholder profiles (LinkedIn intel, individual contact research) — deferred to v2
- Real data ingestion pipeline — deferred until demo proves value
- Integration with existing company systems — future phase

---

## Tech Stack (confirmed)

| Layer | Choice | Notes |
|---|---|---|
| LLM | Ollama (local) | Run on Apple Mac Mini via local network; swap to OpenAI/Azure when company decides |
| Embeddings | Ollama (nomic-embed-text) | Local, free, swappable |
| Vector DB | Chroma | In-process, local disk, zero infra |
| RAG Framework | LangChain | Provider-agnostic abstraction — 1 config change to swap LLM |
| Backend | Python + FastAPI | REST API; React calls same endpoints forever |
| Frontend | React + shadcn/ui | Talks only to FastAPI |

**Infrastructure note:** Ollama runs on Apple Mac Mini on local network (`OLLAMA_HOST=0.0.0.0`). LangChain points to `http://<mac-mini-ip>:11434`.

---

## Build Order & Milestones

| Phase | Focus |
|---|---|
| **Week 1–2** | RAG backend — mock data loaded, all 3 knowledge domains, 10 test questions returning good answers |
| **Week 3** | React UI — Discovery view + Deep-dive view built around proven RAG |
| **Week 4** | Polish, demo script, "We've done this before" feature; stretch: real public company data (Microsoft, Salesforce, etc.) |
| **Demo ask** | Approve real data pipeline + ingestion investment to productionize |

---

## Week 2 Acceptance Criteria (10 Test Questions)

The RAG must answer all 10 with good, mostly-repeatable responses before UI work begins:

1. How much does [Company X] make annually and what do they spend on IT?
2. Break down [Company X]'s estimated software development spend.
3. How has [Company X]'s IT investment changed over the last 3 years?
4. Which companies in [industry] have the largest IT budgets?
5. Find me companies similar to [Company X] that we don't currently work with.
6. What solutions have companies like [X] used to solve [Y problem]?
7. What tech initiatives is [Company X] currently investing in?
8. Company Y is struggling with [pain point] — what can we offer to get a foot in the door?
9. What service of ours best fits a company that is rapidly growing its dev team?
10. Have we worked on anything similar to what [Company X] needs?

---

## Guiding Principles

- **Form follows function** — intelligence first, UI second
- **API-first, standalone** — clean REST boundaries; future integration is a config change, not a rewrite
- **Mock data as strength** — controlled narrative during demo; real data is a feature flag, not a prerequisite
- **LLM-agnostic** — provider swap is one line; never hardwire to a single model

---

## IT Budget Inference Sources (for real data phase)

Public financials / 10-K filings, tech hiring patterns, job postings, LinkedIn IT headcount, tech stack signals (BuiltWith etc.), industry benchmarks (Gartner IT spend as % of revenue by sector)

---

## Future / Phase 2

- Real data ingestion pipeline (strategy and sources TBD)
- Person / stakeholder profiles
- Integration with existing company system
- Swap Ollama → OpenAI / Azure OpenAI
- Real public company data for demo (Microsoft, Salesforce, etc.)
