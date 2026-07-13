from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.query import router as query_router
from app.api.companies import router as companies_router

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


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "intelrag-backend"}
