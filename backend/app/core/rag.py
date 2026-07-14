from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_chroma import Chroma
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

from app.core.config import settings

PROMPT_TEMPLATE = """You are an intelligent consulting assistant for a software consulting firm.
Use the context below to answer the question accurately and concisely.

Guidelines:
- When asked to find "similar" companies, consider similarity by IT maturity, pain points, company size, and spending patterns — not just industry.
- When asked about prospects, only suggest companies marked as prospects (not current clients).
- If the context does not contain enough information to fully answer, say so clearly and share what you do know — do not invent facts.
- Always ground your answer in the provided context.
- When asked to list or enumerate all items (e.g. all companies, all services), note that the context provided may not be exhaustive — only items explicitly present in the context should be listed.

Context:
{context}

Question: {question}

Answer:"""


def get_embeddings():
    return OllamaEmbeddings(
        model=settings.embed_model,
        base_url=settings.llm_base_url,
    )


def get_vector_store():
    return Chroma(
        persist_directory=settings.chroma_persist_dir,
        embedding_function=get_embeddings(),
        collection_name="intelrag",
    )


def build_rag_chain():
    vector_store = get_vector_store()
    retriever = vector_store.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 12, "fetch_k": 40},
    )

    llm = OllamaLLM(
        model=settings.llm_model,
        base_url=settings.llm_base_url,
        temperature=0.1,
    )

    prompt = PromptTemplate.from_template(PROMPT_TEMPLATE)

    def format_docs(docs):
        parts = []
        for doc in docs:
            source = doc.metadata.get("filename", "unknown")
            domain = doc.metadata.get("domain", "")
            parts.append(f"[Source: {source} | {domain}]\n{doc.page_content}")
        return "\n\n---\n\n".join(parts)

    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain, retriever
