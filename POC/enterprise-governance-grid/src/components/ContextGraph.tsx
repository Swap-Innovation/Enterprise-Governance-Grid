import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  Handle,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import graphData from '../data/customer-context-graph.json'
import contractsData from '../data/customer-contracts.json'
import techCatalog from '../data/technical-catalog-assets.json'
import { Section } from './Section'

type GraphNodeData = {
  label: string
  subtitle: string
  nodeType: string
  layer: string
  natco: string
  contractRef: string
  hub?: boolean
  dimmed?: boolean
  selected?: boolean
}

const layerColors: Record<string, { border: string; bg: string; text: string }> = {
  technical: { border: '#2dd4bf', bg: '#0d1a24', text: '#e8f4f1' },
  business: { border: '#c4a574', bg: '#0d1a24', text: '#e8f4f1' },
  semantics: { border: '#7dd3c4', bg: '#132433', text: '#e8f4f1' },
  product: { border: '#e0c49a', bg: '#132433', text: '#e8f4f1' },
  governance: { border: '#9bb5b0', bg: '#0d1a24', text: '#e8f4f1' },
  consumption: { border: '#2dd4bf', bg: '#071018', text: '#e8f4f1' },
  org: { border: '#c4a574', bg: '#071018', text: '#e8f4f1' },
  ai: { border: '#7dd3c4', bg: '#071018', text: '#e8f4f1' },
}

function ContextNode({ data }: NodeProps) {
  const d = data as GraphNodeData
  const colors = layerColors[d.layer] ?? layerColors.technical
  const opacity = d.dimmed ? 0.22 : 1

  return (
    <div
      style={{
        opacity,
        border: `1px solid ${d.selected ? colors.border : `${colors.border}99`}`,
        background: colors.bg,
        boxShadow: d.selected || d.hub ? `0 0 0 1px ${colors.border}` : undefined,
        minWidth: 150,
        maxWidth: 190,
        padding: '10px 12px',
        fontFamily: 'Figtree, sans-serif',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: colors.border, width: 6, height: 6 }} />
      <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.border }}>
        {d.nodeType}
      </div>
      <div style={{ marginTop: 4, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: colors.text, lineHeight: 1.2 }}>
        {d.label}
      </div>
      <div style={{ marginTop: 4, fontSize: 10, color: '#9bb5b0', lineHeight: 1.3 }}>{d.subtitle}</div>
      <Handle type="source" position={Position.Right} style={{ background: colors.border, width: 6, height: 6 }} />
    </div>
  )
}

const nodeTypes = { context: ContextNode }

function buildFlow() {
  const nodes: Node[] = graphData.nodes.map((n) => ({
    id: n.id,
    type: 'context',
    position: n.position,
    data: {
      label: n.label,
      subtitle: n.subtitle,
      nodeType: n.type,
      layer: n.layer,
      natco: n.natco,
      contractRef: n.contract_ref,
      hub: 'hub' in n ? n.hub : false,
      dimmed: false,
      selected: false,
    } satisfies GraphNodeData,
  }))

  const edges: Edge[] = graphData.edges.map((e) => ({
    id: e.id,
    source: e.from,
    target: e.to,
    label: e.predicate,
    type: 'smoothstep',
    animated: false,
    style: { stroke: 'rgba(125,211,196,0.35)', strokeWidth: 1.25 },
    labelStyle: { fill: '#9bb5b0', fontSize: 9, fontWeight: 600 },
    labelBgStyle: { fill: '#071018', fillOpacity: 0.9 },
    labelBgPadding: [4, 2] as [number, number],
    markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(125,211,196,0.55)', width: 14, height: 14 },
  }))

  return { nodes, edges }
}

function GraphCanvas({
  selectedId,
  onSelect,
  focusMode,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
  focusMode: boolean
}) {
  const initial = useMemo(() => buildFlow(), [])
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges)
  const { fitView } = useReactFlow()

  const neighborIds = useMemo(() => {
    if (!selectedId) return new Set<string>()
    const set = new Set<string>([selectedId])
    for (const e of graphData.edges) {
      if (e.from === selectedId) set.add(e.to)
      if (e.to === selectedId) set.add(e.from)
    }
    return set
  }, [selectedId])

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          selected: n.id === selectedId,
          dimmed: focusMode && selectedId ? !neighborIds.has(n.id) : false,
        },
      })),
    )
    setEdges((eds) =>
      eds.map((e) => {
        const active =
          !!selectedId && (e.source === selectedId || e.target === selectedId)
        const dimmed = focusMode && selectedId && !active
        return {
          ...e,
          animated: active,
          style: {
            stroke: active ? '#2dd4bf' : 'rgba(125,211,196,0.35)',
            strokeWidth: active ? 2 : 1.25,
            opacity: dimmed ? 0.12 : 1,
          },
          labelStyle: {
            fill: active ? '#2dd4bf' : '#9bb5b0',
            fontSize: 9,
            fontWeight: 600,
            opacity: dimmed ? 0.15 : 1,
          },
        }
      }),
    )
  }, [selectedId, focusMode, neighborIds, setNodes, setEdges])

  useEffect(() => {
    const t = window.setTimeout(() => fitView({ padding: 0.18, duration: 400 }), 80)
    return () => window.clearTimeout(t)
  }, [fitView])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onSelect(node.id)
    },
    [onSelect],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.25}
      maxZoom={1.6}
      proOptions={{ hideAttribution: true }}
      colorMode="dark"
    >
      <Background gap={24} color="rgba(125,211,196,0.08)" />
      <Controls
        showInteractive={false}
        style={{ background: '#0d1a24', border: '1px solid rgba(125,211,196,0.25)' }}
      />
      <MiniMap
        nodeColor={(n) => layerColors[(n.data as GraphNodeData).layer]?.border ?? '#2dd4bf'}
        maskColor="rgba(7,16,24,0.75)"
        style={{ background: '#0d1a24', border: '1px solid rgba(125,211,196,0.2)' }}
      />
    </ReactFlow>
  )
}

function ContractInspector({
  selectedId,
  onSelectNeighbor,
}: {
  selectedId: string | null
  onSelectNeighbor: (id: string) => void
}) {
  const node = graphData.nodes.find((n) => n.id === selectedId)
  const contract =
    node && node.contract_ref in contractsData.contracts
      ? contractsData.contracts[node.contract_ref as keyof typeof contractsData.contracts]
      : null

  const techAsset = useMemo(() => {
    if (!node) return null
    return (
      techCatalog.assets.find(
        (a) => a.graph_node === node.id || a.contract_id === node.contract_ref,
      ) ?? null
    )
  }, [node])

  const techLinks = useMemo(() => {
    if (!techAsset?.links) return [] as { rel: string; id: string; label: string; graphNode?: string }[]
    const out: { rel: string; id: string; label: string; graphNode?: string }[] = []
    for (const [rel, val] of Object.entries(techAsset.links)) {
      const items = Array.isArray(val) ? val : [val]
      for (const id of items) {
        const linked = techCatalog.assets.find((a) => a.id === id)
        out.push({
          rel,
          id,
          label: linked?.name ?? id,
          graphNode: linked?.graph_node ?? undefined,
        })
      }
    }
    return out
  }, [techAsset])

  const neighbors = useMemo(() => {
    if (!selectedId) return []
    return graphData.edges
      .filter((e) => e.from === selectedId || e.to === selectedId)
      .map((e) => {
        const outbound = e.from === selectedId
        const otherId = outbound ? e.to : e.from
        const other = graphData.nodes.find((n) => n.id === otherId)
        return {
          predicate: e.predicate,
          direction: outbound ? 'out' : 'in',
          otherId,
          otherLabel: other?.label ?? otherId,
        }
      })
  }, [selectedId])

  if (!node) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-[var(--color-mist)]">
        Select a node to traverse — start at Customer 360 table or SID Customer.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-[var(--color-line)] px-5 py-4">
        <p className="eyebrow">{node.type} · {node.natco}</p>
        <h3 className="mt-2 font-display text-xl font-bold text-[var(--color-foam)]">{node.label}</h3>
        <p className="mt-1 text-sm text-[var(--color-mist)]">{node.subtitle}</p>
        {techAsset ? (
          <p className="mt-3 font-mono text-[10px] text-[var(--color-brass-bright)]">
            {techAsset.contract_id} · {techAsset.id}
            {techAsset.doc ? ` · docs/contracts/technical/${techAsset.doc}` : ''}
          </p>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="eyebrow mb-3">Neighbors · traverse</p>
        <ul className="space-y-2">
          {neighbors.map((n) => (
            <li key={`${n.predicate}-${n.otherId}-${n.direction}`}>
              <button
                type="button"
                onClick={() => onSelectNeighbor(n.otherId)}
                className="w-full border border-[var(--color-line)] bg-[var(--color-ink)] px-3 py-2 text-left transition-colors hover:border-[var(--color-teal)]/50"
              >
                <span className="font-mono text-[10px] text-[var(--color-teal)]">
                  {n.direction === 'out' ? `──${n.predicate}──>` : `<──${n.predicate}──`}
                </span>
                <span className="mt-1 block text-sm text-[var(--color-foam)]">{n.otherLabel}</span>
              </button>
            </li>
          ))}
        </ul>

        {techLinks.length > 0 ? (
          <div className="mt-6">
            <p className="eyebrow mb-3">Technical catalog links</p>
            <ul className="space-y-2">
              {techLinks.map((l) => (
                <li key={`${l.rel}-${l.id}`}>
                  {l.graphNode ? (
                    <button
                      type="button"
                      onClick={() => onSelectNeighbor(l.graphNode!)}
                      className="w-full border border-[var(--color-brass)]/30 bg-[var(--color-ink)] px-3 py-2 text-left hover:border-[var(--color-brass)]/60"
                    >
                      <span className="font-mono text-[10px] text-[var(--color-brass)]">{l.rel}</span>
                      <span className="mt-1 block text-sm text-[var(--color-foam)]">{l.label}</span>
                    </button>
                  ) : (
                    <div className="border border-[var(--color-line)] px-3 py-2">
                      <span className="font-mono text-[10px] text-[var(--color-brass)]">{l.rel}</span>
                      <span className="mt-1 block text-sm text-[var(--color-mist)]">{l.label}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {contract ? (
          <div className="mt-6">
            <p className="eyebrow mb-3">Contract · {contract.id}</p>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words border border-[var(--color-line)] bg-[var(--color-ink)] p-3 font-mono text-[11px] leading-relaxed text-[var(--color-signal)]">
              {JSON.stringify(contract, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function ContextGraph() {
  const [selectedId, setSelectedId] = useState<string | null>('tbl-c360')
  const [focusMode, setFocusMode] = useState(true)

  return (
    <Section
      id="context-graph"
      eyebrow="06 · Live proof · Customer domain"
      title="From raw metadata to AI-ready meaning"
      lead="Traverse technical catalog, multi-NATCO business terms, TM Forum semantics, data products, contracts, and memory — one customer-domain knowledge graph."
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setFocusMode((v) => !v)}
          className={`border px-3 py-1.5 text-xs font-semibold tracking-wide ${
            focusMode
              ? 'border-[var(--color-teal)] bg-[var(--color-teal)]/15 text-[var(--color-teal)]'
              : 'border-[var(--color-line-strong)] text-[var(--color-mist)]'
          }`}
        >
          {focusMode ? 'Focus neighborhood · on' : 'Focus neighborhood · off'}
        </button>
        <button
          type="button"
          onClick={() => setSelectedId('tbl-c360')}
          className="border border-[var(--color-line-strong)] px-3 py-1.5 text-xs text-[var(--color-foam)] hover:border-[var(--color-brass)]"
        >
          Hub · Customer 360 table
        </button>
        <button
          type="button"
          onClick={() => setSelectedId('concept-customer')}
          className="border border-[var(--color-line-strong)] px-3 py-1.5 text-xs text-[var(--color-foam)] hover:border-[var(--color-brass)]"
        >
          Hub · SID Customer
        </button>
        <button
          type="button"
          onClick={() => setSelectedId('product-c360')}
          className="border border-[var(--color-line-strong)] px-3 py-1.5 text-xs text-[var(--color-foam)] hover:border-[var(--color-brass)]"
        >
          Hub · Data product
        </button>
      </div>

      <div className="grid overflow-hidden border border-[var(--color-line-strong)] lg:grid-cols-[1fr_340px]">
        <div className="h-[min(70vh,720px)] bg-[var(--color-ink)]">
          <ReactFlowProvider>
            <GraphCanvas
              selectedId={selectedId}
              onSelect={setSelectedId}
              focusMode={focusMode}
            />
          </ReactFlowProvider>
        </div>
        <div className="h-[min(70vh,720px)] border-t border-[var(--color-line)] bg-[var(--color-ink-elevated)] lg:border-t-0 lg:border-l">
          <ContractInspector selectedId={selectedId} onSelectNeighbor={setSelectedId} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {Object.entries(layerColors).map(([layer, c]) => (
          <span key={layer} className="flex items-center gap-2 text-xs text-[var(--color-mist)]">
            <span className="h-2 w-2" style={{ background: c.border }} />
            {layer}
          </span>
        ))}
      </div>
    </Section>
  )
}
