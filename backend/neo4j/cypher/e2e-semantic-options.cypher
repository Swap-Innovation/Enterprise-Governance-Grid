// e2e-semantic-options.cypher
// Client showcase: Option A vs C — Germany · B2B/B2C/Network BUs · Power BI · Palantir.
// Option B removed from showcase (duplicate graph shape of C) — see docs migration note.
// Each MERGE is self-contained to avoid Neo4j memory / variable carry-over issues.

// ==========================
// Option A — single de namespace · BUs co-steward
// ==========================
MERGE (nsAglob:Namespace {id: 'ns-opt-a-global'})
SET nsAglob.slug = 'opt-a-global', nsAglob.name = 'Global (shared)', nsAglob.optionId = 'A',
    nsAglob.pack = 'semantic-control-plane', nsAglob.role = 'canonical';
MERGE (nsA:Namespace {id: 'ns-opt-a-de'})
SET nsA.slug = 'opt-a-de', nsA.name = 'Germany (shared natco layer)', nsA.optionId = 'A',
    nsA.pack = 'semantic-control-plane', nsA.role = 'natco';

MERGE (buAb2b:Namespace {id: 'ns-opt-a-de-b2b'})
SET buAb2b.slug = 'opt-a-de-b2b', buAb2b.name = 'Germany · B2B (steward)', buAb2b.optionId = 'A',
    buAb2b.pack = 'semantic-control-plane', buAb2b.role = 'business_unit', buAb2b.businessUnit = 'B2B';
MERGE (buAb2c:Namespace {id: 'ns-opt-a-de-b2c'})
SET buAb2c.slug = 'opt-a-de-b2c', buAb2c.name = 'Germany · B2C (steward)', buAb2c.optionId = 'A',
    buAb2c.pack = 'semantic-control-plane', buAb2c.role = 'business_unit', buAb2c.businessUnit = 'B2C';
MERGE (buAnet:Namespace {id: 'ns-opt-a-de-network'})
SET buAnet.slug = 'opt-a-de-network', buAnet.name = 'Germany · Network (steward)', buAnet.optionId = 'A',
    buAnet.pack = 'semantic-control-plane', buAnet.role = 'business_unit', buAnet.businessUnit = 'Network';

MERGE (cAglob1:Concept {id: 'concept-opt-a-global-customer'})
SET cAglob1.conceptId = 'Customer', cAglob1.name = 'Customer', cAglob1.kind = 'entity',
    cAglob1.optionId = 'A', cAglob1.preferredLabel = 'Customer', cAglob1.businessUnit = 'Enterprise',
    cAglob1.uri = 'https://semantics.example/ns/opt-a-global/Customer';
MERGE (cAglob2:Concept {id: 'concept-opt-a-global-revenue'})
SET cAglob2.conceptId = 'CustomerRevenue', cAglob2.name = 'Customer Revenue', cAglob2.kind = 'metric',
    cAglob2.optionId = 'A', cAglob2.preferredLabel = 'Customer Revenue', cAglob2.businessUnit = 'Enterprise',
    cAglob2.uri = 'https://semantics.example/ns/opt-a-global/CustomerRevenue';
MERGE (cA1:Concept {id: 'concept-opt-a-customer'})
SET cA1.conceptId = 'Customer', cA1.name = 'Customer', cA1.kind = 'entity',
    cA1.optionId = 'A', cA1.preferredLabel = 'Customer', cA1.businessUnit = 'B2B · B2C',
    cA1.stewardBu = 'B2B,B2C', cA1.uri = 'https://semantics.example/ns/opt-a-de/Customer';
MERGE (cA2:Concept {id: 'concept-opt-a-revenue'})
SET cA2.conceptId = 'CustomerRevenue', cA2.name = 'Customer Revenue', cA2.kind = 'metric',
    cA2.optionId = 'A', cA2.preferredLabel = 'Customer Revenue', cA2.businessUnit = 'B2B · B2C',
    cA2.stewardBu = 'B2B,B2C', cA2.uri = 'https://semantics.example/ns/opt-a-de/CustomerRevenue';
MERGE (cA3:Concept {id: 'concept-opt-a-network-site'})
SET cA3.conceptId = 'NetworkSite', cA3.name = 'Network Site', cA3.kind = 'entity',
    cA3.optionId = 'A', cA3.preferredLabel = 'Network Site', cA3.businessUnit = 'Network',
    cA3.stewardBu = 'Network', cA3.uri = 'https://semantics.example/ns/opt-a-de/NetworkSite';

MERGE (nsAglob:Namespace {id: 'ns-opt-a-global'}) WITH nsAglob
MERGE (c:Concept {id: 'concept-opt-a-global-customer'}) MERGE (nsAglob)-[:CONTAINS_CONCEPT]->(c);
MERGE (nsAglob:Namespace {id: 'ns-opt-a-global'}) WITH nsAglob
MERGE (c:Concept {id: 'concept-opt-a-global-revenue'}) MERGE (nsAglob)-[:CONTAINS_CONCEPT]->(c);
MERGE (nsA:Namespace {id: 'ns-opt-a-de'}) WITH nsA
MERGE (c:Concept {id: 'concept-opt-a-customer'}) MERGE (nsA)-[:CONTAINS_CONCEPT]->(c);
MERGE (nsA:Namespace {id: 'ns-opt-a-de'}) WITH nsA
MERGE (c:Concept {id: 'concept-opt-a-revenue'}) MERGE (nsA)-[:CONTAINS_CONCEPT]->(c);
MERGE (nsA:Namespace {id: 'ns-opt-a-de'}) WITH nsA
MERGE (c:Concept {id: 'concept-opt-a-network-site'}) MERGE (nsA)-[:CONTAINS_CONCEPT]->(c);

MERGE (buAb2b:Namespace {id: 'ns-opt-a-de-b2b'}) WITH buAb2b MERGE (nsA2:Namespace {id: 'ns-opt-a-de'})
MERGE (buAb2b)-[:SCOPED_TO]->(nsA2);
MERGE (buAb2c:Namespace {id: 'ns-opt-a-de-b2c'}) WITH buAb2c MERGE (nsA3:Namespace {id: 'ns-opt-a-de'})
MERGE (buAb2c)-[:SCOPED_TO]->(nsA3);
MERGE (buAnet:Namespace {id: 'ns-opt-a-de-network'}) WITH buAnet MERGE (nsA4:Namespace {id: 'ns-opt-a-de'})
MERGE (buAnet)-[:SCOPED_TO]->(nsA4);

MERGE (buAb2b:Namespace {id: 'ns-opt-a-de-b2b'}) WITH buAb2b MERGE (c:Concept {id: 'concept-opt-a-customer'})
MERGE (buAb2b)-[:STEWARDS]->(c);
MERGE (buAb2c:Namespace {id: 'ns-opt-a-de-b2c'}) WITH buAb2c MERGE (c:Concept {id: 'concept-opt-a-customer'})
MERGE (buAb2c)-[:STEWARDS]->(c);
MERGE (buAb2c:Namespace {id: 'ns-opt-a-de-b2c'}) WITH buAb2c MERGE (c:Concept {id: 'concept-opt-a-revenue'})
MERGE (buAb2c)-[:STEWARDS]->(c);
MERGE (buAnet:Namespace {id: 'ns-opt-a-de-network'}) WITH buAnet MERGE (c:Concept {id: 'concept-opt-a-network-site'})
MERGE (buAnet)-[:STEWARDS]->(c);

MERGE (c:Concept {id: 'concept-opt-a-customer'}) WITH c MERGE (g:Concept {id: 'concept-opt-a-global-customer'})
MERGE (c)-[:FEDERATES]->(g);
MERGE (c:Concept {id: 'concept-opt-a-revenue'}) WITH c MERGE (g:Concept {id: 'concept-opt-a-global-revenue'})
MERGE (c)-[:FEDERATES]->(g);
MERGE (c:Concept {id: 'concept-opt-a-network-site'}) WITH c MERGE (g:Concept {id: 'concept-opt-a-global-customer'})
MERGE (c)-[:FEDERATES]->(g);

MERGE (tPbiA:ToolSemantic {id: 'tool-opt-a-powerbi'})
SET tPbiA.name = 'Power BI · DE (B2C)', tPbiA.tool = 'Power BI', tPbiA.optionId = 'A', tPbiA.businessUnit = 'B2C';
MERGE (tPbiA:ToolSemantic {id: 'tool-opt-a-powerbi'}) WITH tPbiA MERGE (c:Concept {id: 'concept-opt-a-customer'})
MERGE (tPbiA)-[:BINDS_TO]->(c);
MERGE (tPbiA:ToolSemantic {id: 'tool-opt-a-powerbi'}) WITH tPbiA MERGE (c:Concept {id: 'concept-opt-a-revenue'})
MERGE (tPbiA)-[:BINDS_TO]->(c);

MERGE (tPalA:ToolSemantic {id: 'tool-opt-a-palantir'})
SET tPalA.name = 'Palantir · DE (B2B)', tPalA.tool = 'Palantir', tPalA.optionId = 'A', tPalA.businessUnit = 'B2B';
MERGE (tPalA:ToolSemantic {id: 'tool-opt-a-palantir'}) WITH tPalA MERGE (c:Concept {id: 'concept-opt-a-customer'})
MERGE (tPalA)-[:BINDS_TO]->(c);
MERGE (tPalA:ToolSemantic {id: 'tool-opt-a-palantir'}) WITH tPalA MERGE (c:Concept {id: 'concept-opt-a-revenue'})
MERGE (tPalA)-[:BINDS_TO]->(c);

// ==========================
// Option C — BU canonical · tools map to BU SoR · federate global
// ==========================
MERGE (nsCg:Namespace {id: 'ns-opt-c-global'})
SET nsCg.slug = 'opt-c-global', nsCg.name = 'Global canonical', nsCg.optionId = 'C',
    nsCg.pack = 'semantic-control-plane', nsCg.role = 'canonical';
MERGE (nsCde:Namespace {id: 'ns-opt-c-de'})
SET nsCde.slug = 'opt-c-de', nsCde.name = 'Germany (country anchor)', nsCde.optionId = 'C',
    nsCde.pack = 'semantic-control-plane', nsCde.role = 'natco';
MERGE (nsCb2b:Namespace {id: 'ns-opt-c-de-b2b'})
SET nsCb2b.slug = 'opt-c-de-b2b', nsCb2b.name = 'Germany · B2B canonical', nsCb2b.optionId = 'C',
    nsCb2b.pack = 'semantic-control-plane', nsCb2b.role = 'business_unit', nsCb2b.businessUnit = 'B2B';
MERGE (nsCb2c:Namespace {id: 'ns-opt-c-de-b2c'})
SET nsCb2c.slug = 'opt-c-de-b2c', nsCb2c.name = 'Germany · B2C canonical', nsCb2c.optionId = 'C',
    nsCb2c.pack = 'semantic-control-plane', nsCb2c.role = 'business_unit', nsCb2c.businessUnit = 'B2C';
MERGE (nsCnet:Namespace {id: 'ns-opt-c-de-network'})
SET nsCnet.slug = 'opt-c-de-network', nsCnet.name = 'Germany · Network canonical', nsCnet.optionId = 'C',
    nsCnet.pack = 'semantic-control-plane', nsCnet.role = 'business_unit', nsCnet.businessUnit = 'Network';
MERGE (nsCpbi:Namespace {id: 'ns-opt-c-de-powerbi'})
SET nsCpbi.slug = 'opt-c-de-powerbi', nsCpbi.name = 'Germany · Power BI', nsCpbi.optionId = 'C',
    nsCpbi.pack = 'semantic-control-plane', nsCpbi.role = 'tool';
MERGE (nsCpal:Namespace {id: 'ns-opt-c-de-palantir'})
SET nsCpal.slug = 'opt-c-de-palantir', nsCpal.name = 'Germany · Palantir', nsCpal.optionId = 'C',
    nsCpal.pack = 'semantic-control-plane', nsCpal.role = 'tool';

MERGE (cCg1:Concept {id: 'concept-opt-c-global-customer'})
SET cCg1.conceptId = 'Customer', cCg1.name = 'Customer', cCg1.kind = 'entity', cCg1.optionId = 'C',
    cCg1.businessUnit = 'Enterprise', cCg1.uri = 'https://semantics.example/ns/opt-c-global/Customer';
MERGE (cCg2:Concept {id: 'concept-opt-c-global-revenue'})
SET cCg2.conceptId = 'CustomerRevenue', cCg2.name = 'Customer Revenue', cCg2.kind = 'metric', cCg2.optionId = 'C',
    cCg2.businessUnit = 'Enterprise', cCg2.uri = 'https://semantics.example/ns/opt-c-global/CustomerRevenue';
MERGE (cCb2b:Concept {id: 'concept-opt-c-b2b-kunde'})
SET cCb2b.conceptId = 'Geschäftskunde', cCb2b.name = 'Geschäftskunde', cCb2b.kind = 'entity', cCb2b.optionId = 'C',
    cCb2b.businessUnit = 'B2B', cCb2b.uri = 'https://semantics.example/ns/opt-c-de-b2b/Geschäftskunde';
MERGE (cCb2c:Concept {id: 'concept-opt-c-b2c-kunde'})
SET cCb2c.conceptId = 'Kunde', cCb2c.name = 'Kunde', cCb2c.kind = 'entity', cCb2c.optionId = 'C',
    cCb2c.businessUnit = 'B2C', cCb2c.uri = 'https://semantics.example/ns/opt-c-de-b2c/Kunde';
MERGE (cCnet:Concept {id: 'concept-opt-c-network-site'})
SET cCnet.conceptId = 'Netzstandort', cCnet.name = 'Netzstandort', cCnet.kind = 'entity', cCnet.optionId = 'C',
    cCnet.businessUnit = 'Network', cCnet.uri = 'https://semantics.example/ns/opt-c-de-network/Netzstandort';
MERGE (cCp1:Concept {id: 'concept-opt-c-pbi-dimcustomer'})
SET cCp1.conceptId = 'DimCustomer', cCp1.name = 'DimCustomer', cCp1.kind = 'entity', cCp1.optionId = 'C',
    cCp1.businessUnit = 'B2C', cCp1.structureNote = 'Star-schema dimension',
    cCp1.uri = 'https://semantics.example/ns/opt-c-de-powerbi/DimCustomer';
MERGE (cCp2:Concept {id: 'concept-opt-c-pbi-umsatz'})
SET cCp2.conceptId = 'MeasureUmsatz', cCp2.name = 'Measure Umsatz', cCp2.kind = 'metric', cCp2.optionId = 'C',
    cCp2.businessUnit = 'B2C', cCp2.structureNote = 'DAX measure — formula in PBI',
    cCp2.uri = 'https://semantics.example/ns/opt-c-de-powerbi/MeasureUmsatz';
MERGE (cCa1:Concept {id: 'concept-opt-c-pal-account'})
SET cCa1.conceptId = 'Account', cCa1.name = 'Account', cCa1.kind = 'entity', cCa1.optionId = 'C',
    cCa1.businessUnit = 'B2B', cCa1.structureNote = 'Ontology object',
    cCa1.uri = 'https://semantics.example/ns/opt-c-de-palantir/Account';
MERGE (cCa2:Concept {id: 'concept-opt-c-pal-revenue'})
SET cCa2.conceptId = 'RevenueProp', cCa2.name = 'Revenue property', cCa2.kind = 'metric', cCa2.optionId = 'C',
    cCa2.businessUnit = 'B2B', cCa2.uri = 'https://semantics.example/ns/opt-c-de-palantir/RevenueProp';

MERGE (nsCg:Namespace {id: 'ns-opt-c-global'}) WITH nsCg MERGE (c:Concept {id: 'concept-opt-c-global-customer'}) MERGE (nsCg)-[:CONTAINS_CONCEPT]->(c);
MERGE (nsCg:Namespace {id: 'ns-opt-c-global'}) WITH nsCg MERGE (c:Concept {id: 'concept-opt-c-global-revenue'}) MERGE (nsCg)-[:CONTAINS_CONCEPT]->(c);
MERGE (nsCb2b:Namespace {id: 'ns-opt-c-de-b2b'}) WITH nsCb2b MERGE (c:Concept {id: 'concept-opt-c-b2b-kunde'}) MERGE (nsCb2b)-[:CONTAINS_CONCEPT]->(c);
MERGE (nsCb2c:Namespace {id: 'ns-opt-c-de-b2c'}) WITH nsCb2c MERGE (c:Concept {id: 'concept-opt-c-b2c-kunde'}) MERGE (nsCb2c)-[:CONTAINS_CONCEPT]->(c);
MERGE (nsCnet:Namespace {id: 'ns-opt-c-de-network'}) WITH nsCnet MERGE (c:Concept {id: 'concept-opt-c-network-site'}) MERGE (nsCnet)-[:CONTAINS_CONCEPT]->(c);
MERGE (nsCpbi:Namespace {id: 'ns-opt-c-de-powerbi'}) WITH nsCpbi MERGE (c:Concept {id: 'concept-opt-c-pbi-dimcustomer'}) MERGE (nsCpbi)-[:CONTAINS_CONCEPT]->(c);
MERGE (nsCpbi:Namespace {id: 'ns-opt-c-de-powerbi'}) WITH nsCpbi MERGE (c:Concept {id: 'concept-opt-c-pbi-umsatz'}) MERGE (nsCpbi)-[:CONTAINS_CONCEPT]->(c);
MERGE (nsCpal:Namespace {id: 'ns-opt-c-de-palantir'}) WITH nsCpal MERGE (c:Concept {id: 'concept-opt-c-pal-account'}) MERGE (nsCpal)-[:CONTAINS_CONCEPT]->(c);
MERGE (nsCpal:Namespace {id: 'ns-opt-c-de-palantir'}) WITH nsCpal MERGE (c:Concept {id: 'concept-opt-c-pal-revenue'}) MERGE (nsCpal)-[:CONTAINS_CONCEPT]->(c);

MERGE (nsCb2b:Namespace {id: 'ns-opt-c-de-b2b'}) WITH nsCb2b MERGE (nsCde:Namespace {id: 'ns-opt-c-de'}) MERGE (nsCb2b)-[:SCOPED_TO]->(nsCde);
MERGE (nsCb2c:Namespace {id: 'ns-opt-c-de-b2c'}) WITH nsCb2c MERGE (nsCde:Namespace {id: 'ns-opt-c-de'}) MERGE (nsCb2c)-[:SCOPED_TO]->(nsCde);
MERGE (nsCnet:Namespace {id: 'ns-opt-c-de-network'}) WITH nsCnet MERGE (nsCde:Namespace {id: 'ns-opt-c-de'}) MERGE (nsCnet)-[:SCOPED_TO]->(nsCde);

MERGE (c:Concept {id: 'concept-opt-c-b2b-kunde'}) WITH c MERGE (g:Concept {id: 'concept-opt-c-global-customer'}) MERGE (c)-[:FEDERATES]->(g);
MERGE (c:Concept {id: 'concept-opt-c-b2c-kunde'}) WITH c MERGE (g:Concept {id: 'concept-opt-c-global-customer'}) MERGE (c)-[:FEDERATES]->(g);
MERGE (c:Concept {id: 'concept-opt-c-network-site'}) WITH c MERGE (g:Concept {id: 'concept-opt-c-global-customer'}) MERGE (c)-[:FEDERATES]->(g);

MERGE (c:Concept {id: 'concept-opt-c-pbi-dimcustomer'}) WITH c MERGE (t:Concept {id: 'concept-opt-c-b2c-kunde'}) MERGE (c)-[:MAPS_TO]->(t);
MERGE (c:Concept {id: 'concept-opt-c-pbi-umsatz'}) WITH c MERGE (g:Concept {id: 'concept-opt-c-global-revenue'}) MERGE (c)-[:MAPS_TO]->(g);
MERGE (c:Concept {id: 'concept-opt-c-pal-account'}) WITH c MERGE (t:Concept {id: 'concept-opt-c-b2b-kunde'}) MERGE (c)-[:MAPS_TO]->(t);
MERGE (c:Concept {id: 'concept-opt-c-pal-revenue'}) WITH c MERGE (g:Concept {id: 'concept-opt-c-global-revenue'}) MERGE (c)-[:MAPS_TO]->(g);

MERGE (tPbiC:ToolSemantic {id: 'tool-opt-c-powerbi'})
SET tPbiC.name = 'Power BI · DE (B2C)', tPbiC.tool = 'Power BI', tPbiC.optionId = 'C', tPbiC.businessUnit = 'B2C';
MERGE (tPbiC:ToolSemantic {id: 'tool-opt-c-powerbi'}) WITH tPbiC MERGE (ns:Namespace {id: 'ns-opt-c-de-powerbi'}) MERGE (tPbiC)-[:USES_NAMESPACE]->(ns);
MERGE (tPalC:ToolSemantic {id: 'tool-opt-c-palantir'})
SET tPalC.name = 'Palantir · DE (B2B)', tPalC.tool = 'Palantir', tPalC.optionId = 'C', tPalC.businessUnit = 'B2B';
MERGE (tPalC:ToolSemantic {id: 'tool-opt-c-palantir'}) WITH tPalC MERGE (ns:Namespace {id: 'ns-opt-c-de-palantir'}) MERGE (tPalC)-[:USES_NAMESPACE]->(ns);

RETURN 'Semantic options A vs C (NATCO BUs) loaded' AS status;