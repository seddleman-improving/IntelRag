# Prototype Setup — Ollama on Mac Mini

This document describes the specific infrastructure used for the v1 prototype of the Consulting Intelligence Platform. The prototype uses a local Apple Mac Mini as a dedicated LLM inference server running Ollama.

For the generic setup guide, see the root [README.md](../README.md).

---

## Prototype Infrastructure

| Component | Details |
|---|---|
| LLM Server | Apple Mac Mini (local network) |
| LLM Framework | [Ollama](https://ollama.com) |
| LLM Model | `qwen2.5:32b` |
| Embedding Model | `nomic-embed-text` |
| Mac Mini IP | `192.168.100.224` (assign static IP in router) |
| Ollama Port | `11434` |

---

## Mac Mini — One-Time Setup

These steps are run **once** on the Apple Mac Mini, not on the development machine.

### 1. Install Ollama

Download and install from [ollama.com](https://ollama.com).

### 2. Pull the required models

```bash
ollama pull qwen2.5:32b
ollama pull nomic-embed-text
```

> `qwen2.5:32b` is a large model (~20 GB). Ensure the Mac Mini has sufficient RAM (64 GB recommended).

### 3. Expose Ollama on the local network

By default Ollama only listens on localhost. To allow other machines to reach it:

```bash
# Add to ~/.zshrc for persistence
export OLLAMA_HOST=0.0.0.0
```

Then restart Ollama or reboot.

### 4. Prevent the Mac Mini from sleeping

Ollama stops responding when the Mac Mini sleeps. Disable sleep permanently:

```bash
sudo pmset -a sleep 0
sudo pmset -a disksleep 0
sudo pmset -a displaysleep 0
```

### 5. Verify connectivity from the dev machine

```bash
curl http://192.168.100.224:11434/api/tags
```

You should see a JSON list of pulled models.

### 6. Assign a static local IP (recommended)

Configure your router to assign a permanent IP to the Mac Mini so the address never changes. Update `LLM_BASE_URL` in `backend/.env` to match.

---

## Backend `.env` for Prototype

```env
LLM_BASE_URL=http://192.168.100.224:11434
LLM_MODEL=qwen2.5:32b
EMBED_MODEL=nomic-embed-text
CHROMA_PERSIST_DIR=./chroma_db
```

---

## Health Check

Once the backend is running, verify both the backend and LLM are reachable:

```powershell
curl.exe -s http://localhost:8000/api/v1/health
```

Expected: `{"backend":"ok","llm":"ok"}`

If `llm` is `"unreachable"`, check that:
- The Mac Mini is awake
- Ollama is running (`ollama list` on the Mac Mini)
- `OLLAMA_HOST=0.0.0.0` is set and Ollama was restarted after setting it
- The IP in `LLM_BASE_URL` matches the Mac Mini's current IP
