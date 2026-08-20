import {
  listProjectIds,
  getProjectMeta,
  createProject,
  deleteProject,
  isProjectDeletable,
  compileProject,
  readDerivedCatalog,
  readDerivedGraph,
  readDerivedCoverage,
  upsertContract,
  createAssetContract,
  deleteContract,
  listNamespaces,
  createNamespace,
  deleteNamespace,
  normalizeProjectScopeStructure,
  mirrorCompiled,
} from '../../../scripts/lib/project-mock-layout.mjs'

function projectSummary(projectId) {
  const meta = getProjectMeta(projectId)
  if (!meta) return null
  const catalog = readDerivedCatalog(projectId)
  const coverage = readDerivedCoverage(projectId)
  return {
    ...meta,
    deletable: isProjectDeletable(projectId),
    stats: {
      contracts: catalog?.contracts ? Object.keys(catalog.contracts).length : 0,
      scopes: meta.scopes?.length ?? 0,
      gaps: coverage?.summary?.gaps ?? 0,
    },
  }
}

/** @returns {boolean} true if handled */
export async function handleProjectsApi(req, res, url, sendJson, readBody) {
  const reqPath = url.pathname.replace(/\/+$/, '') || '/'

  const reply = (status, body) => {
    sendJson(res, status, body)
    return true
  }

  if (req.method === 'GET' && reqPath === '/api/projects/health') {
    return reply(200, { ok: true, projects: listProjectIds().length })
  }

  if (req.method === 'GET' && reqPath === '/api/projects') {
    const projects = listProjectIds().map((id) => projectSummary(id)).filter(Boolean)
    return reply(200, { projects })
  }

  if (req.method === 'POST' && reqPath === '/api/projects') {
    const body = await readBody(req)
    if (!body.id && !body.title) {
      return reply(400, { error: 'id or title required' })
    }
    const result = createProject(body.id ?? body.title, body)
    return reply(201, { project: projectSummary(result.meta.id), catalog: result.catalog })
  }

  // DELETE /api/projects/:id — removes mock-data/projects/:id/ entirely
  if (req.method === 'DELETE') {
    const deleteMatch = reqPath.match(/^\/api\/projects\/([^/]+)$/)
    if (deleteMatch) {
      const id = decodeURIComponent(deleteMatch[1])
      const result = deleteProject(id)
      return reply(200, result)
    }
  }

  const projectMatch = reqPath.match(/^\/api\/projects\/([^/]+)$/)
  if (req.method === 'GET' && projectMatch) {
    const id = decodeURIComponent(projectMatch[1])
    const project = projectSummary(id)
    if (!project) return reply(404, { error: 'Project not found' })
    return reply(200, {
      project,
      catalog: readDerivedCatalog(id),
      graph: readDerivedGraph(id),
      coverage: readDerivedCoverage(id),
    })
  }

  const catalogMatch = reqPath.match(/^\/api\/projects\/([^/]+)\/catalog$/)
  if (req.method === 'GET' && catalogMatch) {
    const id = decodeURIComponent(catalogMatch[1])
    const catalog = readDerivedCatalog(id)
    if (!catalog) return reply(404, { error: 'Project or catalog not found' })
    return reply(200, catalog)
  }

  const graphMatch = reqPath.match(/^\/api\/projects\/([^/]+)\/graph$/)
  if (req.method === 'GET' && graphMatch) {
    const id = decodeURIComponent(graphMatch[1])
    const graph = readDerivedGraph(id)
    if (!graph) return reply(404, { error: 'Project or graph not found' })
    return reply(200, graph)
  }

  const coverageMatch = reqPath.match(/^\/api\/projects\/([^/]+)\/coverage$/)
  if (req.method === 'GET' && coverageMatch) {
    const id = decodeURIComponent(coverageMatch[1])
    const coverage = readDerivedCoverage(id)
    if (!coverage) return reply(404, { error: 'Project or coverage not found' })
    return reply(200, coverage)
  }

  const compileMatch = reqPath.match(/^\/api\/projects\/([^/]+)\/compile$/)
  if (req.method === 'POST' && compileMatch) {
    const id = decodeURIComponent(compileMatch[1])
    if (!getProjectMeta(id)) return reply(404, { error: 'Project not found' })
    const result = compileProject(id)
    mirrorCompiled(id, result)
    return reply(200, {
      ok: true,
      contracts: Object.keys(result.catalog.contracts).length,
      gaps: result.coverage.summary.gaps,
    })
  }

  const normalizeScopesMatch = reqPath.match(/^\/api\/projects\/([^/]+)\/namespaces\/normalize$/)
  if (req.method === 'POST' && normalizeScopesMatch) {
    const id = decodeURIComponent(normalizeScopesMatch[1])
    const result = normalizeProjectScopeStructure(id)
    return reply(200, {
      ok: true,
      namespaces: result.scopes,
      contracts: Object.keys(result.catalog.contracts).length,
      gaps: result.coverage.summary.gaps,
    })
  }

  const namespacesMatch = reqPath.match(/^\/api\/projects\/([^/]+)\/namespaces$/)
  if (namespacesMatch) {
    const id = decodeURIComponent(namespacesMatch[1])
    if (req.method === 'GET') {
      return reply(200, { namespaces: listNamespaces(id) })
    }
    if (req.method === 'POST') {
      const body = await readBody(req)
      if (!body.id && !body.scope) return reply(400, { error: 'namespace id required' })
      const result = createNamespace(id, body.id ?? body.scope, body)
      return reply(201, {
        namespace: { id: result.scopeId, scope: result.scopeId },
        catalog: result.catalog,
        coverage: result.coverage,
      })
    }
  }

  const namespaceMatch = reqPath.match(/^\/api\/projects\/([^/]+)\/namespaces\/([^/]+)$/)
  if (req.method === 'DELETE' && namespaceMatch) {
    const id = decodeURIComponent(namespaceMatch[1])
    const namespaceId = decodeURIComponent(namespaceMatch[2])
    const result = deleteNamespace(id, namespaceId)
    return reply(200, { deleted: namespaceId, catalog: result.catalog, coverage: result.coverage })
  }

  const contractsMatch = reqPath.match(/^\/api\/projects\/([^/]+)\/contracts$/)
  if (req.method === 'POST' && contractsMatch) {
    const id = decodeURIComponent(contractsMatch[1])
    const body = await readBody(req)
    // Create typed asset shell: { kind, scope, name?, displayName?, product_class? }
    if (body.kind && !body.contract && !body.id) {
      const result = createAssetContract(id, body)
      return reply(201, {
        contract: result.contract,
        catalog: result.catalog,
        coverage: result.coverage,
      })
    }
    const contract = body.contract ?? body
    const result = upsertContract(id, contract)
    return reply(200, {
      contract: result.contract,
      path: result.path,
      catalog: result.catalog,
      coverage: result.coverage,
    })
  }

  const contractMatch = reqPath.match(/^\/api\/projects\/([^/]+)\/contracts\/([^/]+)$/)
  if (contractMatch) {
    const id = decodeURIComponent(contractMatch[1])
    const contractId = decodeURIComponent(contractMatch[2])
    const catalog = readDerivedCatalog(id)
    if (!catalog) return reply(404, { error: 'Project not found' })

    if (req.method === 'GET') {
      const contract = catalog.contracts?.[contractId]
      if (!contract) return reply(404, { error: 'Contract not found' })
      return reply(200, { contract })
    }

    if (req.method === 'PUT') {
      const body = await readBody(req)
      const contract = { ...(body.contract ?? body), id: contractId }
      const result = upsertContract(id, contract)
      return reply(200, {
        contract: result.contract,
        path: result.path,
        catalog: result.catalog,
        coverage: result.coverage,
      })
    }

    if (req.method === 'DELETE') {
      const result = deleteContract(id, contractId)
      return reply(200, { deleted: contractId, catalog: result.catalog })
    }
  }

  return false
}
