import urllib.request
import urllib.error

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.query import router as query_router
from app.api.companies import router as companies_router
from app.core.config import settings

app = FastAPI(
    title="Consulting Intelligence Platform",
    description="RAG-based company intelligence API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(query_router, prefix="/api/v1", tags=["query"])
app.include_router(companies_router, prefix="/api/v1/companies", tags=["companies"])


@app.get("/api/v1/health")
def health_check():
    llm_ok = False
    try:
        req = urllib.request.urlopen(f"{settings.ollama_base_url}/api/tags", timeout=3)
        llm_ok = req.status == 200
    except Exception:
        llm_ok = False

    return {
        "backend": "ok",
        "llm": "ok" if llm_ok else "unreachable",
    }
