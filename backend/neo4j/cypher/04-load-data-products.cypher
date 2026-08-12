// 04-load-data-products.cypher — Data Products pack
MERGE (prod:DataProduct {id: 'dp-customer-360'})
SET prod.name = 'Customer 360',
    prod.description = 'Enterprise customer master product for analytics and ops',
    prod.status = 'Published',
    prod.owner = 'Customer 360 Product Team',
    prod.domain = 'Customer',
    prod.pack = 'data-products';

MERGE (out:OutputPort {id: 'port-out-customer-360'})
SET out.name = 'customer_360_table',
    out.portType = 'table',
    out.status = 'Active',
    out.owner = 'Customer 360 Product Team',
    out.pack = 'data-products';

MERGE (inp:InputPort {id: 'port-in-crm-customer'})
SET inp.name = 'crm_customer',
    inp.portType = 'table',
    inp.status = 'Active',
    inp.owner = 'Customer 360 Product Team',
    inp.pack = 'data-products';

MERGE (contract:DataContract {id: 'contract-customer-360-v1'})
SET contract.name = 'Customer 360 Contract',
    contract.version = '1.0.0',
    contract.status = 'Active',
    contract.owner = 'Customer 360 Product Team',
    contract.pack = 'data-products';

MERGE (field:ContractField {id: 'field-customer-id'})
SET field.name = 'customer_id',
    field.dataType = 'string',
    field.nullable = false,
    field.required = true,
    field.status = 'Active',
    field.owner = 'Customer 360 Product Team',
    field.pack = 'data-products';

MERGE (prod)-[:EXPOSES]->(out)
MERGE (prod)-[:CONSUMES]->(inp)
MERGE (out)-[:GOVERNED_BY]->(contract)
MERGE (contract)-[:CONTAINS_FIELD]->(field)
