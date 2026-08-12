// e2e-semantic-options.cypher
// Parallel client showcase: Option A / B / C — Germany + Power BI + Palantir
// Each statement ends with ';' so cypher-shell -f can apply them safely.

MERGE (nsA:Namespace {id: 'ns-opt-a-de'})
SET nsA.slug = 'opt-a-de', nsA.name = 'Germany (shared)', nsA.optionId = 'A',
    nsA.pack = 'semantic-control-plane', nsA.role = 'canonical+tools';

MERGE (cA1:Concept {id: 'concept-opt-a-customer'})
SET cA1.conceptId = 'Customer', cA1.name = 'Customer', cA1.kind = 'entity',
    cA1.optionId = 'A', cA1.preferredLabel = 'Customer',
    cA1.uri = 'https://semantics.example/ns/opt-a-de/Customer';

MERGE (cA2:Concept {id: 'concept-opt-a-revenue'})
SET cA2.conceptId = 'CustomerRevenue', cA2.name = 'Customer Revenue', cA2.kind = 'metric',
    cA2.optionId = 'A', cA2.preferredLabel = 'Customer Revenue',
    cA2.uri = 'https://semantics.example/ns/opt-a-de/CustomerRevenue';

MATCH (nsA:Namespace {id: 'ns-opt-a-de'})
MATCH (cA1:Concept {id: 'concept-opt-a-customer'})
MATCH (cA2:Concept {id: 'concept-opt-a-revenue'})
MERGE (nsA)-[:CONTAINS_CONCEPT]->(cA1)
MERGE (nsA)-[:CONTAINS_CONCEPT]->(cA2);

MATCH (cA1:Concept {id: 'concept-opt-a-customer'})
MATCH (cA2:Concept {id: 'concept-opt-a-revenue'})
MERGE (tPbiA:ToolSemantic {id: 'tool-opt-a-powerbi'})
SET tPbiA.name = 'Power BI · DE', tPbiA.tool = 'Power BI', tPbiA.optionId = 'A'
MERGE (tPalA:ToolSemantic {id: 'tool-opt-a-palantir'})
SET tPalA.name = 'Palantir · DE', tPalA.tool = 'Palantir', tPalA.optionId = 'A'
MERGE (tPbiA)-[:BINDS_TO]->(cA1)
MERGE (tPbiA)-[:BINDS_TO]->(cA2)
MERGE (tPalA)-[:BINDS_TO]->(cA1)
MERGE (tPalA)-[:BINDS_TO]->(cA2);

MERGE (nsBde:Namespace {id: 'ns-opt-b-de'})
SET nsBde.slug = 'opt-b-de', nsBde.name = 'Germany (thin)', nsBde.optionId = 'B',
    nsBde.pack = 'semantic-control-plane', nsBde.role = 'country-label';

MERGE (nsBpbi:Namespace {id: 'ns-opt-b-de-powerbi'})
SET nsBpbi.slug = 'opt-b-de-powerbi', nsBpbi.name = 'Germany · Power BI', nsBpbi.optionId = 'B',
    nsBpbi.pack = 'semantic-control-plane', nsBpbi.role = 'tool';

MERGE (nsBpal:Namespace {id: 'ns-opt-b-de-palantir'})
SET nsBpal.slug = 'opt-b-de-palantir', nsBpal.name = 'Germany · Palantir', nsBpal.optionId = 'B',
    nsBpal.pack = 'semantic-control-plane', nsBpal.role = 'tool';

MERGE (cBp1:Concept {id: 'concept-opt-b-pbi-customer'})
SET cBp1.conceptId = 'Customer', cBp1.name = 'Customer (PBI)', cBp1.kind = 'entity',
    cBp1.optionId = 'B', cBp1.structureNote = 'Star-schema DimCustomer grain',
    cBp1.uri = 'https://semantics.example/ns/opt-b-de-powerbi/Customer';

MERGE (cBp2:Concept {id: 'concept-opt-b-pbi-umsatz'})
SET cBp2.conceptId = 'Umsatz', cBp2.name = 'Umsatz', cBp2.kind = 'metric',
    cBp2.optionId = 'B', cBp2.structureNote = 'DAX measure naming',
    cBp2.uri = 'https://semantics.example/ns/opt-b-de-powerbi/Umsatz';

MERGE (cBa1:Concept {id: 'concept-opt-b-pal-account'})
SET cBa1.conceptId = 'Account', cBa1.name = 'Account', cBa1.kind = 'entity',
    cBa1.optionId = 'B', cBa1.structureNote = 'Ontology object type',
    cBa1.uri = 'https://semantics.example/ns/opt-b-de-palantir/Account';

MERGE (cBa2:Concept {id: 'concept-opt-b-pal-revenue'})
SET cBa2.conceptId = 'RevenueMetric', cBa2.name = 'Revenue Metric', cBa2.kind = 'metric',
    cBa2.optionId = 'B', cBa2.structureNote = 'Ontology property',
    cBa2.uri = 'https://semantics.example/ns/opt-b-de-palantir/RevenueMetric';

MATCH (nsBde:Namespace {id: 'ns-opt-b-de'})
MATCH (nsBpbi:Namespace {id: 'ns-opt-b-de-powerbi'})
MATCH (nsBpal:Namespace {id: 'ns-opt-b-de-palantir'})
MATCH (cBp1:Concept {id: 'concept-opt-b-pbi-customer'})
MATCH (cBp2:Concept {id: 'concept-opt-b-pbi-umsatz'})
MATCH (cBa1:Concept {id: 'concept-opt-b-pal-account'})
MATCH (cBa2:Concept {id: 'concept-opt-b-pal-revenue'})
MERGE (nsBpbi)-[:CONTAINS_CONCEPT]->(cBp1)
MERGE (nsBpbi)-[:CONTAINS_CONCEPT]->(cBp2)
MERGE (nsBpal)-[:CONTAINS_CONCEPT]->(cBa1)
MERGE (nsBpal)-[:CONTAINS_CONCEPT]->(cBa2)
MERGE (nsBpbi)-[:SCOPED_TO]->(nsBde)
MERGE (nsBpal)-[:SCOPED_TO]->(nsBde);

MATCH (nsBpbi:Namespace {id: 'ns-opt-b-de-powerbi'})
MATCH (nsBpal:Namespace {id: 'ns-opt-b-de-palantir'})
MERGE (tPbiB:ToolSemantic {id: 'tool-opt-b-powerbi'})
SET tPbiB.name = 'Power BI · DE', tPbiB.tool = 'Power BI', tPbiB.optionId = 'B'
MERGE (tPalB:ToolSemantic {id: 'tool-opt-b-palantir'})
SET tPalB.name = 'Palantir · DE', tPalB.tool = 'Palantir', tPalB.optionId = 'B'
MERGE (tPbiB)-[:USES_NAMESPACE]->(nsBpbi)
MERGE (tPalB)-[:USES_NAMESPACE]->(nsBpal);

MERGE (nsCg:Namespace {id: 'ns-opt-c-global'})
SET nsCg.slug = 'opt-c-global', nsCg.name = 'Global canonical', nsCg.optionId = 'C',
    nsCg.pack = 'semantic-control-plane', nsCg.role = 'canonical';

MERGE (nsCde:Namespace {id: 'ns-opt-c-de'})
SET nsCde.slug = 'opt-c-de', nsCde.name = 'Germany canonical', nsCde.optionId = 'C',
    nsCde.pack = 'semantic-control-plane', nsCde.role = 'canonical';

MERGE (nsCpbi:Namespace {id: 'ns-opt-c-de-powerbi'})
SET nsCpbi.slug = 'opt-c-de-powerbi', nsCpbi.name = 'Germany · Power BI', nsCpbi.optionId = 'C',
    nsCpbi.pack = 'semantic-control-plane', nsCpbi.role = 'tool';

MERGE (nsCpal:Namespace {id: 'ns-opt-c-de-palantir'})
SET nsCpal.slug = 'opt-c-de-palantir', nsCpal.name = 'Germany · Palantir', nsCpal.optionId = 'C',
    nsCpal.pack = 'semantic-control-plane', nsCpal.role = 'tool';

MERGE (cCg1:Concept {id: 'concept-opt-c-global-customer'})
SET cCg1.conceptId = 'Customer', cCg1.name = 'Customer', cCg1.kind = 'entity',
    cCg1.optionId = 'C', cCg1.uri = 'https://semantics.example/ns/opt-c-global/Customer';

MERGE (cCg2:Concept {id: 'concept-opt-c-global-revenue'})
SET cCg2.conceptId = 'CustomerRevenue', cCg2.name = 'Customer Revenue', cCg2.kind = 'metric',
    cCg2.optionId = 'C', cCg2.uri = 'https://semantics.example/ns/opt-c-global/CustomerRevenue';

MERGE (cCde1:Concept {id: 'concept-opt-c-de-kunde'})
SET cCde1.conceptId = 'Kunde', cCde1.name = 'Kunde', cCde1.kind = 'entity',
    cCde1.optionId = 'C', cCde1.uri = 'https://semantics.example/ns/opt-c-de/Kunde';

MERGE (cCp1:Concept {id: 'concept-opt-c-pbi-dimcustomer'})
SET cCp1.conceptId = 'DimCustomer', cCp1.name = 'DimCustomer', cCp1.kind = 'entity',
    cCp1.optionId = 'C', cCp1.structureNote = 'Star-schema dimension',
    cCp1.uri = 'https://semantics.example/ns/opt-c-de-powerbi/DimCustomer';

MERGE (cCp2:Concept {id: 'concept-opt-c-pbi-umsatz'})
SET cCp2.conceptId = 'MeasureUmsatz', cCp2.name = 'Measure Umsatz', cCp2.kind = 'metric',
    cCp2.optionId = 'C', cCp2.structureNote = 'DAX measure — formula in PBI',
    cCp2.uri = 'https://semantics.example/ns/opt-c-de-powerbi/MeasureUmsatz';

MERGE (cCa1:Concept {id: 'concept-opt-c-pal-account'})
SET cCa1.conceptId = 'Account', cCa1.name = 'Account', cCa1.kind = 'entity',
    cCa1.optionId = 'C', cCa1.structureNote = 'Ontology object',
    cCa1.uri = 'https://semantics.example/ns/opt-c-de-palantir/Account';

MERGE (cCa2:Concept {id: 'concept-opt-c-pal-revenue'})
SET cCa2.conceptId = 'RevenueProp', cCa2.name = 'Revenue property', cCa2.kind = 'metric',
    cCa2.optionId = 'C', cCa2.uri = 'https://semantics.example/ns/opt-c-de-palantir/RevenueProp';

MATCH (nsCg:Namespace {id: 'ns-opt-c-global'})
MATCH (nsCde:Namespace {id: 'ns-opt-c-de'})
MATCH (nsCpbi:Namespace {id: 'ns-opt-c-de-powerbi'})
MATCH (nsCpal:Namespace {id: 'ns-opt-c-de-palantir'})
MATCH (cCg1:Concept {id: 'concept-opt-c-global-customer'})
MATCH (cCg2:Concept {id: 'concept-opt-c-global-revenue'})
MATCH (cCde1:Concept {id: 'concept-opt-c-de-kunde'})
MATCH (cCp1:Concept {id: 'concept-opt-c-pbi-dimcustomer'})
MATCH (cCp2:Concept {id: 'concept-opt-c-pbi-umsatz'})
MATCH (cCa1:Concept {id: 'concept-opt-c-pal-account'})
MATCH (cCa2:Concept {id: 'concept-opt-c-pal-revenue'})
MERGE (nsCg)-[:CONTAINS_CONCEPT]->(cCg1)
MERGE (nsCg)-[:CONTAINS_CONCEPT]->(cCg2)
MERGE (nsCde)-[:CONTAINS_CONCEPT]->(cCde1)
MERGE (nsCpbi)-[:CONTAINS_CONCEPT]->(cCp1)
MERGE (nsCpbi)-[:CONTAINS_CONCEPT]->(cCp2)
MERGE (nsCpal)-[:CONTAINS_CONCEPT]->(cCa1)
MERGE (nsCpal)-[:CONTAINS_CONCEPT]->(cCa2)
MERGE (cCde1)-[:FEDERATES]->(cCg1)
MERGE (cCp1)-[:MAPS_TO]->(cCde1)
MERGE (cCp2)-[:MAPS_TO]->(cCg2)
MERGE (cCa1)-[:MAPS_TO]->(cCde1)
MERGE (cCa2)-[:MAPS_TO]->(cCg2);

MATCH (nsCpbi:Namespace {id: 'ns-opt-c-de-powerbi'})
MATCH (nsCpal:Namespace {id: 'ns-opt-c-de-palantir'})
MERGE (tPbiC:ToolSemantic {id: 'tool-opt-c-powerbi'})
SET tPbiC.name = 'Power BI · DE', tPbiC.tool = 'Power BI', tPbiC.optionId = 'C'
MERGE (tPalC:ToolSemantic {id: 'tool-opt-c-palantir'})
SET tPalC.name = 'Palantir · DE', tPalC.tool = 'Palantir', tPalC.optionId = 'C'
MERGE (tPbiC)-[:USES_NAMESPACE]->(nsCpbi)
MERGE (tPalC)-[:USES_NAMESPACE]->(nsCpal);

MATCH (n) WHERE size(labels(n)) = 0 DETACH DELETE n;

RETURN 'Semantic options A/B/C loaded' AS status;
