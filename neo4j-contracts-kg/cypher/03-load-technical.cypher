// 03-load-technical.cypher — Technical Catalog hierarchy (relational)
MERGE (sys:System {id: 'sys-crm'})
SET sys.name = 'CRM Platform',
    sys.status = 'Active',
    sys.owner = 'CRM Platform Team',
    sys.pack = 'technical-catalog';

MERGE (db:Database {id: 'db-crm'})
SET db.name = 'crm',
    db.technology = 'PostgreSQL',
    db.status = 'Active',
    db.owner = 'CRM Platform Team',
    db.pack = 'technical-catalog';

MERGE (sch:Schema {id: 'schema-crm-public'})
SET sch.name = 'public',
    sch.status = 'Active',
    sch.owner = 'CRM Platform Team',
    sch.pack = 'technical-catalog';

MERGE (tbl:Table {id: 'table-crm-customer'})
SET tbl.name = 'customer',
    tbl.fullyQualifiedName = 'crm.public.customer',
    tbl.status = 'Active',
    tbl.owner = 'CRM Platform Team',
    tbl.pack = 'technical-catalog';

MERGE (col:Column {id: 'col-crm-customer-id'})
SET col.name = 'customer_id',
    col.dataType = 'varchar',
    col.isNullable = false,
    col.isPrimaryKey = true,
    col.status = 'Active',
    col.owner = 'CRM Platform Team',
    col.pack = 'technical-catalog';

MERGE (sys)-[:HAS_DATABASE]->(db)
MERGE (db)-[:HAS_SCHEMA]->(sch)
MERGE (sch)-[:CONTAINS_TABLE]->(tbl)
MERGE (tbl)-[:CONTAINS_COLUMN]->(col)

// Curated product table (physical backing for output port)
MERGE (dbDp:Database {id: 'db-dp'})
SET dbDp.name = 'dp',
    dbDp.technology = 'PostgreSQL',
    dbDp.status = 'Active',
    dbDp.owner = 'Customer 360 Product Team',
    dbDp.pack = 'technical-catalog';

MERGE (schDp:Schema {id: 'schema-dp-curated'})
SET schDp.name = 'curated',
    schDp.status = 'Active',
    schDp.owner = 'Customer 360 Product Team',
    schDp.pack = 'technical-catalog';

MERGE (tblDp:Table {id: 'table-dp-customer-360'})
SET tblDp.name = 'customer_360',
    tblDp.fullyQualifiedName = 'dp.curated.customer_360',
    tblDp.status = 'Active',
    tblDp.owner = 'Customer 360 Product Team',
    tblDp.pack = 'technical-catalog';

MERGE (colDp:Column {id: 'col-dp-customer-id'})
SET colDp.name = 'customer_id',
    colDp.dataType = 'varchar',
    colDp.isNullable = false,
    colDp.isPrimaryKey = true,
    colDp.status = 'Active',
    colDp.owner = 'Customer 360 Product Team',
    colDp.pack = 'technical-catalog';

MERGE (dbDp)-[:HAS_SCHEMA]->(schDp)
MERGE (schDp)-[:CONTAINS_TABLE]->(tblDp)
MERGE (tblDp)-[:CONTAINS_COLUMN]->(colDp)
