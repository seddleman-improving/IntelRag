# Cascade Health Systems

**Domain:** company-profile
**Industry:** Healthcare
**Headquarters:** Portland, Oregon
**Employees:** 5,100
**Status:** Prospect — not a current client

## Financial Overview

Cascade Health Systems is a regional healthcare network operating 4 hospitals and 22 outpatient clinics. Annual revenue was $620 million in fiscal year 2024, essentially flat from $618 million in 2023 and up from $589 million in 2022. Revenue growth is constrained by reimbursement rate pressures typical in the healthcare sector.

IT spending is estimated at 4.1% of revenue — $25.4 million in 2024, compared to $23.8 million in 2023 and $20.6 million in 2022. Healthcare systems typically spend 3–5% of revenue on IT. Cascade's 7–15% IT budget growth over two years reflects the pressures of EHR modernization and interoperability mandates from CMS (Centers for Medicare and Medicaid Services).

## Software Development Spend Breakdown

Of the $25.4 million IT budget, approximately 28% ($7.1 million) is allocated to software development and integration:
- EHR (Epic) customization and workflow development: $2.8 million
- Patient-facing portal and mobile app: $1.4 million
- Clinical data integration and HL7/FHIR API layer: $1.9 million
- Internal analytics and operational reporting: $1.0 million

## IT Headcount and Hiring Signals

Cascade employs 94 IT staff including 23 application developers and analysts. Recent job postings include 3 Epic analysts, 1 FHIR/HL7 integration developer, and 2 full-stack developers for the patient portal team. The integration developer role has been open for 4 months — a strong indicator of a specialized skill gap.

## Technology Stack

- **EHR:** Epic (primary), Cerner (legacy in 2 acquired clinics, being phased out)
- **Cloud:** AWS (production), Azure (Microsoft 365 and analytics)
- **Languages:** Java, Python, JavaScript/React
- **Integration:** Mirth Connect for HL7; FHIR R4 APIs (partially implemented)
- **Analytics:** Tableau, Epic Reporting Workbench

## Current Tech Initiatives

1. **Epic Cerner Migration** — migrating 2 acquired clinics from Cerner to Epic; 18-month project; data migration is the primary complexity
2. **FHIR API Layer** — building an interoperability layer to comply with CMS interoperability rules; requires exposing patient data via FHIR R4 APIs to third-party apps
3. **Patient Engagement Portal Rebuild** — replacing a dated patient portal with a modern React-based portal integrated with Epic MyChart APIs; targeting 40% reduction in call center volume
4. **Clinical Analytics Platform** — building a unified data warehouse to support quality reporting and population health management

## Pain Points

- FHIR interoperability compliance deadline is Q4 2026; at current pace Cascade will miss it
- Epic-to-Cerner migration is complex; internal team has Epic expertise but limited Cerner migration experience
- Patient portal has a 28% abandonment rate on appointment scheduling — a measurable patient satisfaction problem
- FHIR/HL7 integration developer role open for 4 months; no viable internal candidate
- IT department is managing 3 large concurrent initiatives with a team sized for 1.5

## Service Fit Analysis

| Our Service | Fit | Rationale |
|---|---|---|
| Fixed-price project work | HIGH | FHIR API layer and patient portal rebuild are well-scoped; compliance deadline creates urgency |
| Staff augmentation | HIGH | FHIR integration specialist gap is critical path; we can provide immediately |
| Coaching / team leading | MEDIUM | Three concurrent initiatives suggest a program management and delivery leadership gap |
