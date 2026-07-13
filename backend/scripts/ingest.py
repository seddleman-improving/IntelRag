"""
Ingestion script: load mock data files, chunk, embed, and store in Chroma.
Run from the /backend directory: uv run python scripts/ingest.py
"""

import sys
from pathlib import Path

from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter

sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.config import settings

DATA_DIR = Path(__file__).parent.parent.parent / "data"
CHUNK_SIZE = 800
CHUNK_OVERLAP = 100


def load_documents():
    loader = DirectoryLoader(
        str(DATA_DIR),
        glob="**/*.md",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
        show_progress=True,
    )
    docs = loader.load()
    print(f"Loaded {len(docs)} documents from {DATA_DIR}")
    return docs


def add_metadata(docs):
    for doc in docs:
        path = Path(doc.metadata.get("source", ""))
        parent = path.parent.name
        domain_map = {
            "companies": "company-profile",
            "industry": "industry-content",
            "proposals": "firm-proposal",
        }
        doc.metadata["domain"] = domain_map.get(parent, "unknown")
        doc.metadata["filename"] = path.name
    return docs


def chunk_documents(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n## ", "\n### ", "\n\n", "\n", " "],
    )
    chunks = splitter.split_documents(docs)
    print(f"Split into {len(chunks)} chunks")
    return chunks


def build_vector_store(chunks):
    print(f"Embedding with {settings.ollama_embed_model} via {settings.ollama_base_url}")
    embeddings = OllamaEmbeddings(
        model=settings.ollama_embed_model,
        base_url=settings.ollama_base_url,
    )
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=settings.chroma_persist_dir,
        collection_name="intelrag",
    )
    print(f"Stored {len(chunks)} chunks in Chroma at {settings.chroma_persist_dir}")
    return vector_store


if __name__ == "__main__":
    print("=== IntelRag Ingestion ===")
    docs = load_documents()
    docs = add_metadata(docs)
    chunks = chunk_documents(docs)
    build_vector_store(chunks)
    print("=== Ingestion complete ===")
