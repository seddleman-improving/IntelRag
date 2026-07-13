# Past Engagement: ERP Integration for Regional Automotive Supplier

**Domain:** firm-proposal
**Client:** Midwest Precision Parts (confidential — referenced anonymously)
**Industry:** Manufacturing / Automotive
**Service Type:** Fixed-price project
**Duration:** 8 months
**Delivered:** Q3 2024
**Status:** Completed — client reference available

## Engagement Summary

Our firm delivered a fixed-price ERP integration project for a mid-size automotive parts manufacturer ($320M revenue) undergoing migration from SAP ECC to SAP S/4HANA. The client's internal team lacked SAP S/4HANA integration expertise, and their migration had stalled for 6 months.

## Problem Statement

The client had completed the core SAP S/4HANA migration but could not get their supplier portal, EDI feeds, and manufacturing execution system (MES) to communicate with the new ERP. Each integration was failing due to API contract changes between ECC and S/4HANA. The client had 3 SAP analysts internally but no one with S/4HANA API or BTP (Business Technology Platform) experience.

## What We Built

1. **SAP BTP Integration Suite implementation** — configured SAP BTP as the central integration hub between S/4HANA, the supplier portal, and 4 customer EDI feeds
2. **Supplier portal API layer** — rebuilt the supplier onboarding and order API contracts to match S/4HANA's updated data models
3. **MES integration** — built a bidirectional sync between the shop floor MES (Epicor) and S/4HANA production orders using REST APIs and an event queue
4. **Integration monitoring dashboard** — built a React-based operations dashboard showing integration health, failed messages, and retry status

## Outcomes

- Migration unblocked; client went live on schedule 8 months after engagement start
- 100% of EDI feeds operational at go-live (vs. 0% when we engaged)
- Supplier portal processing 340 orders/day with 99.7% success rate within 30 days of go-live
- Client avoided estimated $2.1M in ERP consulting overruns by using our fixed-price model

## Technologies Used

SAP S/4HANA, SAP BTP Integration Suite, SAP BTP API Management, .NET, React, REST APIs, EDI (X12), Epicor MES

## Pain Points We Solved

- Stalled ERP migration due to integration complexity
- No internal SAP BTP expertise
- Point-to-point EDI integrations breaking after ERP upgrade
- No visibility into integration failures in production

## Why This Engagement Worked

Fixed-price model was appropriate because the scope was well-defined post-migration. We brought 2 senior SAP BTP specialists and 1 .NET integration engineer. The client's internal team participated in knowledge transfer throughout to reduce ongoing dependency on external consultants.
