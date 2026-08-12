# SQ8 — How does meaning bind to data, and what does it cost?

| Field | Value |
| --- | --- |
| Status | Playbook + cost template |
| Decision | Evidence W5 · report W6 |
| Owner | Mihai (retrofit) · Chris (greenfield) |
| Demo | [/demo/customer360/questions?q=SQ8](../../enterprise-governance-grid/) (Strategic Qs page) |

## The question

Field→concept convention is ratified (ODCS authoritativeDefinitions). Open: who maps, with what assist, cost per contract, and schema-break behaviour.

## Why it matters

Binding is more load-bearing than the ontology. Leadership will ask cost per product — need a number, not an adjective.

## POC recommendation

Playbook: inventory → AI first pass → steward confirm → MappingRecord + ODCS refs → drift on change. Measure greenfield vs retrofit hours.

## In scope

- DA-08/09/10 MappingRecords
- ODCS semantic-concept definitions
- AI-assisted first pass
- Cost template (hours TBD)

## Out of scope

- Unmeasured “AI will make it cheap” claims

## Binding chain

- Business → mapsTo (DA-08) → Concept
- Technical → represents (DA-09) → Concept
- Product/Field → implements (DA-10) → Concept
- ODCS authoritativeDefinitions → Concept IRI

## Cost template

Fill median hours: greenfield + AI (Chris), retrofit + AI (Mihai), manual baseline. Report automated vs manual share from WS1.

## Evidence

- WS1 AI-enrichment lift
- WS3 greenfield design-time mapping

## Deliverable

Mapping playbook + measured effort per contract (greenfield vs retrofit).

## Try in the demo

- **Contracts · products pack** → `/demo/customer360/contracts`
- **Semantics · product lineage** → `/demo/customer360/semantics?query=Q3`

## Residual (workstreams)

Measured hours from Mihai and Chris by W5.

## Related

- Hub: [../16. Strategic Questions.md](../16.%20Strategic%20Questions.md)
- Interactive board: demo route `questions`
