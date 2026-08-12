// e2e-semantic-options.cypher
// Client showcase: Option A/B/C — Germany + Power BI + Palantir.
//
// Optimization goal:
// - Keep each MERGE statement self-contained (no variable carry-over across statements)
// - Avoid large in-transaction blocks that hit Neo4j memory pool limits

// ==========================
// Option A — natco + global
// ==========================
MERGE (nsAglob:Namespace {id: 'ns-opt-a-global'})
SET nsAglob.slug = 'opt-a-global', nsAglob.name = 'Global (shared)', nsAglob.optionId = 'A',
    nsAglob.pack = 'semantic-control-plane', nsAglob.role = 'canonical';
MERGE (nsA:Namespace {id: 'ns-opt-a-de'})
SET nsA.slug = 'opt-a-de', nsA.name = 'Germany (natco base)', nsA.optionId = 'A',
    nsA.pack = 'semantic-control-plane', nsA.role = 'natco';

MERGE (cAglob1:Concept {id: 'concept-opt-a-global-customer'})
SET cAglob1.conceptId = 'Customer', cAglob1.name = 'Customer', cAglob1.kind = 'entity',
    cAglob1.optionId = 'A', cAglob1.preferredLabel = 'Customer',
    cAglob1.uri = 'https://semantics.example/ns/opt-a-global/Customer';
MERGE (cAglob2:Concept {id: 'concept-opt-a-global-revenue'})
SET cAglob2.conceptId = 'CustomerRevenue', cAglob2.name = 'Customer Revenue', cAglob2.kind = 'metric',
    cAglob2.optionId = 'A', cAglob2.preferredLabel = 'Customer Revenue',
    cAglob2.uri = 'https://semantics.example/ns/opt-a-global/CustomerRevenue';
MERGE (cA1:Concept {id: 'concept-opt-a-customer'})
SET cA1.conceptId = 'Customer', cA1.name = 'Customer', cA1.kind = 'entity',
    cA1.optionId = 'A', cA1.preferredLabel = 'Customer',
    cA1.uri = 'https://semantics.example/ns/opt-a-de/Customer';
MERGE (cA2:Concept {id: 'concept-opt-a-revenue'})
SET cA2.conceptId = 'CustomerRevenue', cA2.name = 'Customer Revenue', cA2.kind = 'metric',
    cA2.optionId = 'A', cA2.preferredLabel = 'Customer Revenue',
    cA2.uri = 'https://semantics.example/ns/opt-a-de/CustomerRevenue';

MERGE (nsAglob:Namespace {id: 'ns-opt-a-global'}) WITH nsAglob
MERGE (cAglobCustomer:Concept {id: 'concept-opt-a-global-customer'})
MERGE (nsAglob)-[:CONTAINS_CONCEPT]->(cAglobCustomer);
MERGE (nsAglob:Namespace {id: 'ns-opt-a-global'}) WITH nsAglob
MERGE (cAglobRevenue:Concept {id: 'concept-opt-a-global-revenue'})
MERGE (nsAglob)-[:CONTAINS_CONCEPT]->(cAglobRevenue);
MERGE (nsA:Namespace {id: 'ns-opt-a-de'}) WITH nsA
MERGE (cAnatCustomer:Concept {id: 'concept-opt-a-customer'})
MERGE (nsA)-[:CONTAINS_CONCEPT]->(cAnatCustomer);
MERGE (nsA:Namespace {id: 'ns-opt-a-de'}) WITH nsA
MERGE (cAnatRevenue:Concept {id: 'concept-opt-a-revenue'})
MERGE (nsA)-[:CONTAINS_CONCEPT]->(cAnatRevenue);
MERGE (cAnatCustomer:Concept {id: 'concept-opt-a-customer'}) WITH cAnatCustomer
MERGE (cAglobCustomer:Concept {id: 'concept-opt-a-global-customer'})
MERGE (cAnatCustomer)-[:FEDERATES]->(cAglobCustomer);
MERGE (cAnatRevenue:Concept {id: 'concept-opt-a-revenue'}) WITH cAnatRevenue
MERGE (cAglobRevenue:Concept {id: 'concept-opt-a-global-revenue'})
MERGE (cAnatRevenue)-[:FEDERATES]->(cAglobRevenue);

MERGE (tPbiA:ToolSemantic {id: 'tool-opt-a-powerbi'})
SET tPbiA.name = 'Power BI · DE', tPbiA.tool = 'Power BI', tPbiA.optionId = 'A';
MERGE (tPbiA:ToolSemantic {id: 'tool-opt-a-powerbi'}) WITH tPbiA
MERGE (cBindCustomer:Concept {id: 'concept-opt-a-customer'})
MERGE (tPbiA)-[:BINDS_TO]->(cBindCustomer);
MERGE (tPbiA:ToolSemantic {id: 'tool-opt-a-powerbi'}) WITH tPbiA
MERGE (cBindRevenue:Concept {id: 'concept-opt-a-revenue'})
MERGE (tPbiA)-[:BINDS_TO]->(cBindRevenue);

MERGE (tPalA:ToolSemantic {id: 'tool-opt-a-palantir'})
SET tPalA.name = 'Palantir · DE', tPalA.tool = 'Palantir', tPalA.optionId = 'A';
MERGE (tPalA:ToolSemantic {id: 'tool-opt-a-palantir'}) WITH tPalA
MERGE (cBindCustomer2:Concept {id: 'concept-opt-a-customer'})
MERGE (tPalA)-[:BINDS_TO]->(cBindCustomer2);
MERGE (tPalA:ToolSemantic {id: 'tool-opt-a-palantir'}) WITH tPalA
MERGE (cBindRevenue2:Concept {id: 'concept-opt-a-revenue'})
MERGE (tPalA)-[:BINDS_TO]->(cBindRevenue2);

// ==========================
// Option B — tool islands + natco base + global
// ==========================
MERGE (nsBglob:Namespace {id: 'ns-opt-b-global'})
SET nsBglob.slug = 'opt-b-global', nsBglob.name = 'Global (shared)', nsBglob.optionId = 'B',
    nsBglob.pack = 'semantic-control-plane', nsBglob.role = 'canonical';
MERGE (nsBde:Namespace {id: 'ns-opt-b-de'})
SET nsBde.slug = 'opt-b-de', nsBde.name = 'Germany (natco base)', nsBde.optionId = 'B',
    nsBde.pack = 'semantic-control-plane', nsBde.role = 'natco';
MERGE (nsBpbi:Namespace {id: 'ns-opt-b-de-powerbi'})
SET nsBpbi.slug = 'opt-b-de-powerbi', nsBpbi.name = 'Germany · Power BI', nsBpbi.optionId = 'B',
    nsBpbi.pack = 'semantic-control-plane', nsBpbi.role = 'tool';
MERGE (nsBpal:Namespace {id: 'ns-opt-b-de-palantir'})
SET nsBpal.slug = 'opt-b-de-palantir', nsBpal.name = 'Germany · Palantir', nsBpal.optionId = 'B',
    nsBpal.pack = 'semantic-control-plane', nsBpal.role = 'tool';

MERGE (cBglob1:Concept {id: 'concept-opt-b-global-customer'})
SET cBglob1.conceptId = 'Customer', cBglob1.name = 'Customer', cBglob1.kind = 'entity',
    cBglob1.optionId = 'B', cBglob1.preferredLabel = 'Customer',
    cBglob1.uri = 'https://semantics.example/ns/opt-b-global/Customer';
MERGE (cBglob2:Concept {id: 'concept-opt-b-global-revenue'})
SET cBglob2.conceptId = 'CustomerRevenue', cBglob2.name = 'Customer Revenue', cBglob2.kind = 'metric',
    cBglob2.optionId = 'B', cBglob2.preferredLabel = 'Customer Revenue',
    cBglob2.uri = 'https://semantics.example/ns/opt-b-global/CustomerRevenue';
MERGE (cBnat1:Concept {id: 'concept-opt-b-natco-customer'})
SET cBnat1.conceptId = 'Customer', cBnat1.name = 'Customer', cBnat1.kind = 'entity',
    cBnat1.optionId = 'B', cBnat1.preferredLabel = 'Customer',
    cBnat1.uri = 'https://semantics.example/ns/opt-b-de/Customer';
MERGE (cBnat2:Concept {id: 'concept-opt-b-natco-revenue'})
SET cBnat2.conceptId = 'CustomerRevenue', cBnat2.name = 'Customer Revenue', cBnat2.kind = 'metric',
    cBnat2.optionId = 'B', cBnat2.preferredLabel = 'Customer Revenue',
    cBnat2.uri = 'https://semantics.example/ns/opt-b-de/CustomerRevenue';
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

MERGE (nsBglob:Namespace {id: 'ns-opt-b-global'}) WITH nsBglob
MERGE (cBglobCustomer:Concept {id: 'concept-opt-b-global-customer'})
MERGE (nsBglob)-[:CONTAINS_CONCEPT]->(cBglobCustomer);
MERGE (nsBglob:Namespace {id: 'ns-opt-b-global'}) WITH nsBglob
MERGE (cBglobRevenue:Concept {id: 'concept-opt-b-global-revenue'})
MERGE (nsBglob)-[:CONTAINS_CONCEPT]->(cBglobRevenue);
MERGE (nsBde:Namespace {id: 'ns-opt-b-de'}) WITH nsBde
MERGE (cBnatCustomer:Concept {id: 'concept-opt-b-natco-customer'})
MERGE (nsBde)-[:CONTAINS_CONCEPT]->(cBnatCustomer);
MERGE (nsBde:Namespace {id: 'ns-opt-b-de'}) WITH nsBde
MERGE (cBnatRevenue:Concept {id: 'concept-opt-b-natco-revenue'})
MERGE (nsBde)-[:CONTAINS_CONCEPT]->(cBnatRevenue);
MERGE (nsBpbi:Namespace {id: 'ns-opt-b-de-powerbi'}) WITH nsBpbi
MERGE (cBpbiCustomer:Concept {id: 'concept-opt-b-pbi-customer'})
MERGE (nsBpbi)-[:CONTAINS_CONCEPT]->(cBpbiCustomer);
MERGE (nsBpbi:Namespace {id: 'ns-opt-b-de-powerbi'}) WITH nsBpbi
MERGE (cBpbiRevenue:Concept {id: 'concept-opt-b-pbi-umsatz'})
MERGE (nsBpbi)-[:CONTAINS_CONCEPT]->(cBpbiRevenue);
MERGE (nsBpal:Namespace {id: 'ns-opt-b-de-palantir'}) WITH nsBpal
MERGE (cBpalAccount:Concept {id: 'concept-opt-b-pal-account'})
MERGE (nsBpal)-[:CONTAINS_CONCEPT]->(cBpalAccount);
MERGE (nsBpal:Namespace {id: 'ns-opt-b-de-palantir'}) WITH nsBpal
MERGE (cBpalRevenue:Concept {id: 'concept-opt-b-pal-revenue'})
MERGE (nsBpal)-[:CONTAINS_CONCEPT]->(cBpalRevenue);

MERGE (cBnatCustomer:Concept {id:'concept-opt-b-natco-customer'}) WITH cBnatCustomer
MERGE (cBglobCustomer:Concept {id:'concept-opt-b-global-customer'})
MERGE (cBnatCustomer)-[:FEDERATES]->(cBglobCustomer);
MERGE (cBnatRevenue:Concept {id:'concept-opt-b-natco-revenue'}) WITH cBnatRevenue
MERGE (cBglobRevenue:Concept {id:'concept-opt-b-global-revenue'})
MERGE (cBnatRevenue)-[:FEDERATES]->(cBglobRevenue);

MERGE (cBpbiCustomer:Concept {id:'concept-opt-b-pbi-customer'}) WITH cBpbiCustomer
MERGE (cBnatCustomer2:Concept {id:'concept-opt-b-natco-customer'})
MERGE (cBpbiCustomer)-[:MAPS_TO]->(cBnatCustomer2);
MERGE (cBpbiRevenue:Concept {id:'concept-opt-b-pbi-umsatz'}) WITH cBpbiRevenue
MERGE (cBnatRevenue2:Concept {id:'concept-opt-b-natco-revenue'})
MERGE (cBpbiRevenue)-[:MAPS_TO]->(cBnatRevenue2);
MERGE (cBpalAccount:Concept {id:'concept-opt-b-pal-account'}) WITH cBpalAccount
MERGE (cBnatCustomer3:Concept {id:'concept-opt-b-natco-customer'})
MERGE (cBpalAccount)-[:MAPS_TO]->(cBnatCustomer3);
MERGE (cBpalRevenue:Concept {id:'concept-opt-b-pal-revenue'}) WITH cBpalRevenue
MERGE (cBnatRevenue3:Concept {id:'concept-opt-b-natco-revenue'})
MERGE (cBpalRevenue)-[:MAPS_TO]->(cBnatRevenue3);

MERGE (nsBpbi:Namespace {id: 'ns-opt-b-de-powerbi'}) WITH nsBpbi
MERGE (nsBde2:Namespace {id: 'ns-opt-b-de'})
MERGE (nsBpbi)-[:SCOPED_TO]->(nsBde2);
MERGE (nsBpal:Namespace {id: 'ns-opt-b-de-palantir'}) WITH nsBpal
MERGE (nsBde3:Namespace {id: 'ns-opt-b-de'})
MERGE (nsBpal)-[:SCOPED_TO]->(nsBde3);

MERGE (tPbiB:ToolSemantic {id: 'tool-opt-b-powerbi'})
SET tPbiB.name = 'Power BI · DE', tPbiB.tool = 'Power BI', tPbiB.optionId = 'B';
MERGE (tPbiB:ToolSemantic {id: 'tool-opt-b-powerbi'}) WITH tPbiB
MERGE (nsBpbi2:Namespace {id:'ns-opt-b-de-powerbi'})
MERGE (tPbiB)-[:USES_NAMESPACE]->(nsBpbi2);

MERGE (tPalB:ToolSemantic {id: 'tool-opt-b-palantir'})
SET tPalB.name = 'Palantir · DE', tPalB.tool = 'Palantir', tPalB.optionId = 'B';
MERGE (tPalB:ToolSemantic {id: 'tool-opt-b-palantir'}) WITH tPalB
MERGE (nsBpal2:Namespace {id:'ns-opt-b-de-palantir'})
MERGE (tPalB)-[:USES_NAMESPACE]->(nsBpal2);

// ==========================
// Option C — federated canonical (already self-contained, keep small)
// ==========================
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

MERGE (nsCg:Namespace {id:'ns-opt-c-global'}) WITH nsCg
MERGE (cCgCustomer:Concept {id:'concept-opt-c-global-customer'})
MERGE (nsCg)-[:CONTAINS_CONCEPT]->(cCgCustomer);
MERGE (nsCg:Namespace {id:'ns-opt-c-global'}) WITH nsCg
MERGE (cCgRevenue:Concept {id:'concept-opt-c-global-revenue'})
MERGE (nsCg)-[:CONTAINS_CONCEPT]->(cCgRevenue);
MERGE (nsCde:Namespace {id:'ns-opt-c-de'}) WITH nsCde
MERGE (cCdeKunde:Concept {id:'concept-opt-c-de-kunde'})
MERGE (nsCde)-[:CONTAINS_CONCEPT]->(cCdeKunde);
MERGE (nsCpbi:Namespace {id:'ns-opt-c-de-powerbi'}) WITH nsCpbi
MERGE (cCpbiDimCustomer:Concept {id:'concept-opt-c-pbi-dimcustomer'})
MERGE (nsCpbi)-[:CONTAINS_CONCEPT]->(cCpbiDimCustomer);
MERGE (nsCpbi:Namespace {id:'ns-opt-c-de-powerbi'}) WITH nsCpbi
MERGE (cCpbiUmsatz:Concept {id:'concept-opt-c-pbi-umsatz'})
MERGE (nsCpbi)-[:CONTAINS_CONCEPT]->(cCpbiUmsatz);
MERGE (nsCpal:Namespace {id:'ns-opt-c-de-palantir'}) WITH nsCpal
MERGE (cCpalAccount:Concept {id:'concept-opt-c-pal-account'})
MERGE (nsCpal)-[:CONTAINS_CONCEPT]->(cCpalAccount);
MERGE (nsCpal:Namespace {id:'ns-opt-c-de-palantir'}) WITH nsCpal
MERGE (cCpalRevenue:Concept {id:'concept-opt-c-pal-revenue'})
MERGE (nsCpal)-[:CONTAINS_CONCEPT]->(cCpalRevenue);

MERGE (cCdeKunde:Concept {id:'concept-opt-c-de-kunde'}) WITH cCdeKunde
MERGE (cCgCustomer2:Concept {id:'concept-opt-c-global-customer'})
MERGE (cCdeKunde)-[:FEDERATES]->(cCgCustomer2);
MERGE (cCpbiDimCustomer:Concept {id:'concept-opt-c-pbi-dimcustomer'}) WITH cCpbiDimCustomer
MERGE (cCdeKunde2:Concept {id:'concept-opt-c-de-kunde'})
MERGE (cCpbiDimCustomer)-[:MAPS_TO]->(cCdeKunde2);
MERGE (cCpbiUmsatz:Concept {id:'concept-opt-c-pbi-umsatz'}) WITH cCpbiUmsatz
MERGE (cCgRevenue2:Concept {id:'concept-opt-c-global-revenue'})
MERGE (cCpbiUmsatz)-[:MAPS_TO]->(cCgRevenue2);
MERGE (cCpalAccount2:Concept {id:'concept-opt-c-pal-account'}) WITH cCpalAccount2
MERGE (cCdeKunde3:Concept {id:'concept-opt-c-de-kunde'})
MERGE (cCpalAccount2)-[:MAPS_TO]->(cCdeKunde3);
MERGE (cCpalRevenue2:Concept {id:'concept-opt-c-pal-revenue'}) WITH cCpalRevenue2
MERGE (cCgRevenue3:Concept {id:'concept-opt-c-global-revenue'})
MERGE (cCpalRevenue2)-[:MAPS_TO]->(cCgRevenue3);

MERGE (tPbiC:ToolSemantic {id: 'tool-opt-c-powerbi'})
SET tPbiC.name = 'Power BI · DE', tPbiC.tool = 'Power BI', tPbiC.optionId = 'C';
MERGE (tPbiC:ToolSemantic {id: 'tool-opt-c-powerbi'}) WITH tPbiC
MERGE (nsCpbi2:Namespace {id:'ns-opt-c-de-powerbi'})
MERGE (tPbiC)-[:USES_NAMESPACE]->(nsCpbi2);
MERGE (tPalC:ToolSemantic {id: 'tool-opt-c-palantir'})
SET tPalC.name = 'Palantir · DE', tPalC.tool = 'Palantir', tPalC.optionId = 'C';
MERGE (tPalC:ToolSemantic {id: 'tool-opt-c-palantir'}) WITH tPalC
MERGE (nsCpal2:Namespace {id:'ns-opt-c-de-palantir'})
MERGE (tPalC)-[:USES_NAMESPACE]->(nsCpal2);

RETURN 'Semantic options A/B/C loaded' AS status;
