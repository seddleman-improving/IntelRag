"""Quick test for Q5 and Q10 only."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.rag import build_rag_chain

chain, retriever = build_rag_chain()

for label, q in [
    ("Q5", "Find me companies similar to Apex Manufacturing that we don't currently work with."),
    ("Q10", "Have we worked on anything similar to what Apex Manufacturing needs?"),
]:
    print(f"\n{'='*60}\n{label}: {q}\n{'-'*60}")
    docs = retriever.invoke(q)
    answer = chain.invoke(q)
    print(f"ANSWER:\n{answer}")
    print(f"\nSOURCES: {[d.metadata.get('filename') for d in docs]}")
