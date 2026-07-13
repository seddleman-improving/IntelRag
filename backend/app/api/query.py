from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.rag import build_rag_chain

router = APIRouter()


class QueryRequest(BaseModel):
    question: str


class SourceDoc(BaseModel):
    content: str
    domain: str
    filename: str


class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceDoc]


@router.post("/query", response_model=QueryResponse)
def query(request: QueryRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    chain, retriever = build_rag_chain()

    source_docs = retriever.invoke(request.question)
    answer = chain.invoke(request.question)

    sources = [
        SourceDoc(
            content=doc.page_content[:300],
            domain=doc.metadata.get("domain", "unknown"),
            filename=doc.metadata.get("filename", ""),
        )
        for doc in source_docs
    ]

    return QueryResponse(answer=answer, sources=sources)
