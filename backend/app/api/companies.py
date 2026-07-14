import re
from pathlib import Path
from functools import lru_cache

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

DATA_DIR = Path(__file__).parent.parent.parent.parent / "data" / "companies"


class ServiceFitRow(BaseModel):
    service: str
    fit: str
    rationale: str


class CompanyProfile(BaseModel):
    slug: str
    name: str
    industry: str
    headquarters: str
    city: str
    state: str
    employees: str
    status: str
    revenue: str
    it_budget: str
    tech_stack: list[str]
    current_initiatives: list[str]
    pain_points: list[str]
    service_fit: list[ServiceFitRow]
    current_engagement: str


def _parse_company_file(path: Path) -> CompanyProfile:
    content = path.read_text(encoding="utf-8")
    lines = content.splitlines()

    # Title from first # heading
    name = next((l[2:].strip() for l in lines if l.startswith("# ")), path.stem)

    # **Key:** Value metadata block (first 25 lines)
    meta: dict[str, str] = {}
    for line in lines[:25]:
        m = re.match(r"\*\*(.+?):\*\*\s*(.+)", line)
        if m:
            meta[m.group(1).strip()] = m.group(2).strip()

    # Split into ## sections
    sections: dict[str, str] = {}
    current: str | None = None
    buf: list[str] = []
    for line in lines:
        if line.startswith("## "):
            if current is not None:
                sections[current] = "\n".join(buf).strip()
            current = line[3:].strip()
            buf = []
        elif current is not None:
            buf.append(line)
    if current is not None:
        sections[current] = "\n".join(buf).strip()

    # Pain points — bullet list items
    pain_points: list[str] = []
    for line in sections.get("Pain Points", "").splitlines():
        stripped = line.strip()
        if stripped.startswith("- "):
            pain_points.append(stripped[2:])

    # Service fit — markdown table rows
    service_fit: list[ServiceFitRow] = []
    for line in sections.get("Service Fit Analysis", "").splitlines():
        if line.startswith("|") and "---" not in line and "Our Service" not in line:
            parts = [p.strip() for p in line.split("|") if p.strip()]
            if len(parts) >= 2:
                service_fit.append(ServiceFitRow(
                    service=parts[0],
                    fit=parts[1] if len(parts) > 1 else "",
                    rationale=parts[2] if len(parts) > 2 else "",
                ))

    # City / state — split from Headquarters "City, State"
    hq = meta.get("Headquarters", "")
    hq_parts = [p.strip() for p in hq.split(",", 1)]
    city = hq_parts[0] if hq_parts else ""
    state = hq_parts[1] if len(hq_parts) > 1 else ""

    # Revenue — first $ amount from Financial Overview
    fin_text = sections.get("Financial Overview", "")
    revenue = ""
    m = re.search(r"annual revenue[^$]*?(\$[\d.,]+ million)", fin_text, re.IGNORECASE)
    if not m:
        m = re.search(r"revenue[^$]*?(\$[\d.,]+ million)", fin_text, re.IGNORECASE)
    if m:
        revenue = m.group(1)

    # IT budget — grab first $ amount from Financial Overview
    it_budget = ""
    m = re.search(r"IT s\w+ (?:is )?estimated at[^.]*?(\$[\d.,]+ million)", fin_text, re.IGNORECASE)
    if not m:
        m = re.search(r"total IT budget[^$]*?(\$[\d.,]+ million)", fin_text, re.IGNORECASE)
    if m:
        it_budget = m.group(1)

    # Tech stack — bold key from Technology Stack bullets (**Key:** value)
    tech_stack: list[str] = []
    for line in sections.get("Technology Stack", "").splitlines():
        stripped = line.strip()
        if stripped.startswith("- "):
            label_match = re.match(r"-\s+\*\*(.+?):\*\*\s*(.*)", stripped)
            if label_match:
                tech_stack.append(f"{label_match.group(1)}: {label_match.group(2).split('—')[0].strip()}")
            else:
                tech_stack.append(stripped[2:])

    # Current initiatives — numbered list items
    current_initiatives: list[str] = []
    for line in sections.get("Current Tech Initiatives", "").splitlines():
        stripped = line.strip()
        m2 = re.match(r"\d+\.\s+\*\*(.+?)\*\*", stripped)
        if m2:
            current_initiatives.append(m2.group(1))

    # Current engagement section (only current clients have it)
    current_engagement = sections.get("Current Engagement", "").strip()

    return CompanyProfile(
        slug=path.stem,
        name=name,
        industry=meta.get("Industry", ""),
        headquarters=hq,
        city=city,
        state=state,
        employees=meta.get("Employees", ""),
        status=meta.get("Status", ""),
        revenue=revenue,
        it_budget=it_budget,
        tech_stack=tech_stack,
        current_initiatives=current_initiatives,
        pain_points=pain_points[:5],
        service_fit=service_fit,
        current_engagement=current_engagement,
    )


@lru_cache(maxsize=32)
def _get_profile(slug: str) -> CompanyProfile:
    path = DATA_DIR / f"{slug}.md"
    if not path.exists():
        raise FileNotFoundError(slug)
    return _parse_company_file(path)


@router.get("", response_model=list[CompanyProfile])
def list_companies():
    profiles = []
    for path in sorted(DATA_DIR.glob("*.md")):
        try:
            profiles.append(_get_profile(path.stem))
        except Exception:
            pass
    return profiles


@router.get("/{slug}", response_model=CompanyProfile)
def get_company(slug: str):
    try:
        return _get_profile(slug)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Company '{slug}' not found")
