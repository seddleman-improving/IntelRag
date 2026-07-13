"""
Acceptance test: run all 10 RAG test questions and print results.
Run from /backend: uv run python scripts/test_queries.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.rag import build_rag_chain

TEST_QUESTIONS = [
    ("Q1", "How much does Apex Manufacturing make annually and what do they spend on IT?"),
    ("Q2", "Break down Apex Manufacturing's estimated software development spend."),
    ("Q3", "How has Apex Manufacturing's IT investment changed over the last 3 years?"),
    ("Q4", "Which companies in manufacturing have the largest IT budgets?"),
    ("Q5", "Find me companies similar to Apex Manufacturing that we don't currently work with."),
    ("Q6", "What solutions have companies like Apex Manufacturing used to solve ERP integration problems?"),
    ("Q7", "What tech initiatives is Cascade Health Systems currently investing in?"),
    ("Q8", "Cascade Health Systems is struggling with FHIR compliance — what can we offer to get a foot in the door?"),
    ("Q9", "What service of ours best fits a company that is rapidly growing its dev team?"),
    ("Q10", "Have we worked on anything similar to what Apex Manufacturing needs?"),
]

SEPARATOR = "=" * 70


def run_tests():
    print(SEPARATOR)
    print("IntelRag — Acceptance Test Run")
    print(SEPARATOR)

    chain, retriever = build_rag_chain()
    passed = 0

    for label, question in TEST_QUESTIONS:
        print(f"\n{label}: {question}")
        print("-" * 50)
        try:
            answer = chain.invoke(question)
            domains = [doc.metadata.get("domain", "?") for doc in retriever.invoke(question)]
            print(f"ANSWER: {answer}")
            print(f"SOURCES: {domains}")
            passed += 1
        except Exception as e:
            print(f"ERROR: {e}")

    print(f"\n{SEPARATOR}")
    print(f"Completed {passed}/{len(TEST_QUESTIONS)} questions without errors")
    print(SEPARATOR)


if __name__ == "__main__":
    run_tests()
