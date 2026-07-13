# Mac Mini — Ollama Setup Guide

Reference doc for setting up Ollama on an Apple Mac Mini as a local network inference server.
Covers the full setup including issues encountered and how to resolve them.

---

## Hardware / Network

- **Machine:** Apple Mac Mini
- **IP Address:** `192.168.100.224` (assign a static IP in your router to prevent this changing)
- **Port:** `11434` (Ollama default)
- **Dev machine:** Windows laptop — accesses Ollama over local network

---

## Step 1 — Install Ollama

Download and install from [https://ollama.com](https://ollama.com).

Ollama installs as a **menu bar app** on macOS. It runs automatically on login and manages its own server process. You will see the Ollama icon in the top-right menu bar.

---

## Step 2 — Pull Required Models

Open a terminal on the Mac Mini and pull both models:

```bash
ollama pull qwen2.5:32b
ollama pull nomic-embed-text
```

- `qwen2.5:32b` — main LLM (~20GB, takes time to download)
- `nomic-embed-text` — embedding model (~274MB, fast)

Verify models are present:
```bash
ollama list
```

---

## Step 3 — Expose Ollama on the Local Network

By default Ollama only listens on `127.0.0.1` (localhost). Other machines on the network cannot reach it. You must set `OLLAMA_HOST=0.0.0.0` to expose it on all network interfaces.

### The Problem

Ollama on Mac runs as a **menu bar app** that manages its own server process. If you kill the server process with `pkill ollama`, the menu bar app immediately restarts it. This means:
- You cannot simply set `export OLLAMA_HOST=0.0.0.0` in a terminal and run `ollama serve` — the menu bar app overrides it
- `~/Library/LaunchAgents/com.ollama.ollama.plist` does not exist (Ollama uses the app itself, not a launchd plist)

### The Fix (Current Session — does not survive reboot)

1. **Quit the Ollama menu bar app** — right-click the Ollama icon in the menu bar → *Quit Ollama*
2. Set the environment variable for the current launchd session:
   ```bash
   launchctl setenv OLLAMA_HOST 0.0.0.0
   ```
3. Reopen the Ollama app:
   ```bash
   open -a Ollama
   ```

Ollama now binds to `0.0.0.0:11434` and is reachable from the network.

### The Fix (Permanent — survives reboots)

Create a launchd agent that runs `launchctl setenv` automatically at login, before Ollama starts:

```bash
cat > ~/Library/LaunchAgents/set-ollama-env.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key><string>set-ollama-env</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/launchctl</string>
        <string>setenv</string>
        <string>OLLAMA_HOST</string>
        <string>0.0.0.0</string>
    </array>
    <key>RunAtLoad</key><true/>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/set-ollama-env.plist
```

Also add to `~/.zshrc` for terminal sessions:
```bash
echo 'export OLLAMA_HOST=0.0.0.0' >> ~/.zshrc
source ~/.zshrc
```

---

## Step 4 — Verify from the Dev Laptop (Windows)

In PowerShell on the Windows laptop (use `curl.exe` — PowerShell's `curl` is an alias for `Invoke-WebRequest` and will not work the same way):

```powershell
curl.exe -s http://192.168.100.224:11434/api/tags
```

Expected response: JSON listing all pulled models. Example:
```json
{"models":[{"name":"nomic-embed-text:latest",...},{"name":"qwen2.5:32b",...}]}
```

---

## Useful Commands (Mac Mini Terminal)

### Check if Ollama process is running
```bash
pgrep -l ollama
```

### Check what port Ollama is listening on
```bash
lsof -i :11434
```
Look for `LISTEN` on `*:11434` or `0.0.0.0:11434` — this confirms network exposure.
If you see only `127.0.0.1:11434`, the `OLLAMA_HOST` env var did not take effect.

### Test Ollama locally on the Mac Mini
```bash
curl http://localhost:11434/api/tags
```

### Watch Ollama logs in real time
```bash
tail -f ~/.ollama/logs/server.log
```

### Kill all Ollama processes (force)
```bash
pkill -9 ollama
```
Note: the menu bar app will restart the server unless you first quit the app from the menu bar.

### List all pulled models
```bash
ollama list
```

### Run a quick test prompt from terminal
```bash
ollama run qwen2.5:32b "Say hello in one sentence."
```

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| `curl.exe` from laptop gets no response | Ollama not exposed on network | Set `OLLAMA_HOST=0.0.0.0` and restart Ollama app |
| `ollama serve` returns "address already in use" | Ollama is already running | Don't run `ollama serve` — app manages the server |
| Kill process but it immediately restarts | Menu bar app auto-restarts the server | Quit the app from the menu bar first |
| No plist file at `~/Library/LaunchAgents/com.ollama.ollama.plist` | Ollama uses app-managed process, not launchd | Use `launchctl setenv` approach above |
| PowerShell `curl` prompts for `Uri:` parameter | PowerShell `curl` is an alias for `Invoke-WebRequest` | Use `curl.exe` instead |
| Models not loading / slow | `qwen2.5:32b` is 20GB — needs time on first load | Wait for first inference request to complete loading |

---

## After a Reboot Checklist

If the permanent plist fix has not been applied:

1. Open terminal on Mac Mini
2. Quit Ollama from menu bar if it's running
3. Run:
   ```bash
   launchctl setenv OLLAMA_HOST 0.0.0.0
   open -a Ollama
   ```
4. Verify from laptop: `curl.exe -s http://192.168.100.224:11434/api/tags`
