import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { updateContractApi } from '../services/projectsApi'

export type EditableContract = {
  id: string
  kind: string
  natco?: string
  contract_id?: string
  type_contract_id?: string
  asset_type?: string
  display_name?: string
  name?: string
  qualified_name?: string
  description?: string
  source_system?: string
  layer?: string
  status?: string
  product_class?: string
  familyId?: string
  ossie_version?: string
  spec_url?: string
  package_file?: string
  characteristics?: Record<string, unknown>
  links?: Record<string, unknown>
  metadata?: Record<string, unknown>
  [key: string]: unknown
}

const CORE_KEYS = new Set([
  'id',
  'kind',
  'natco',
  'contract_id',
  'type_contract_id',
  'asset_type',
  'display_name',
  'name',
  'qualified_name',
  'description',
  'source_system',
  'layer',
  'status',
  'product_class',
  'familyId',
  'ossie_version',
  'spec_url',
  'package_file',
  'characteristics',
  'links',
  'metadata',
])

const CHARACTERISTIC_HINTS: Record<string, string[]> = {
  namespace: ['Slug', 'DisplayName', 'Description', 'NamespaceKind', 'UriBase', 'Owner', 'Status'],
  semantic_concept: [
    'ConceptId',
    'Uri',
    'ConceptKind',
    'PreferredLabel',
    'Description',
    'Status',
    'Owner',
    'Version',
    'Scope',
  ],
  ossie_semantic_model: ['Description', 'Status', 'PreferredLabel'],
  data_domain: ['Description', 'Status', 'PreferredLabel', 'Owner'],
  data_model: ['Description', 'Status', 'PreferredLabel', 'Owner'],
  data_entity: ['Description', 'Status', 'PreferredLabel', 'Owner'],
  data_attribute: ['Description', 'Status', 'PreferredLabel', 'DataType'],
  data_concept: ['Description', 'Status', 'PreferredLabel'],
  business_term: ['Description', 'Status', 'PreferredLabel', 'Owner'],
  system: ['Description', 'Status', 'Owner'],
  database: ['Description', 'Status'],
  schema: ['Description', 'Status'],
  table: ['Description', 'Status'],
  column: ['Description', 'Status', 'DataType'],
  pipeline: ['Description', 'Status'],
  topic: ['Description', 'Status'],
  technical_asset: ['Description', 'Status'],
  data_product: ['Description', 'Status', 'ProductClass', 'Owner'],
  data_contract: ['Description', 'Status', 'Owner'],
  kpi: ['Description', 'Status', 'PreferredLabel'],
}

const LINK_HINTS: Record<string, string[]> = {
  namespace: ['concepts'],
  semantic_concept: ['namespace', 'maps_to', 'related'],
  data_entity: ['attributes', 'model', 'domain'],
  data_attribute: ['entity', 'maps_to'],
  system: ['databases'],
  database: ['system', 'schemas'],
  schema: ['database', 'tables'],
  table: ['schema', 'columns'],
  column: ['table'],
  data_product: ['contracts', 'implements'],
  data_contract: ['product', 'fields'],
}

const STATIC_META = new Set(['file', 'project', 'pack', 'created_via', 'updated_via', 'updated_at'])

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function stringifyCharValue(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return JSON.stringify(value)
}

function parseCharValue(raw: string, previous: unknown): unknown {
  const trimmed = raw.trim()
  if (Array.isArray(previous) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      return JSON.parse(trimmed || '[]')
    } catch {
      return trimmed
    }
  }
  if (
    previous &&
    typeof previous === 'object' &&
    !Array.isArray(previous) &&
    trimmed.startsWith('{')
  ) {
    try {
      return JSON.parse(trimmed)
    } catch {
      return trimmed
    }
  }
  if (typeof previous === 'number') {
    const n = Number(trimmed)
    return Number.isFinite(n) ? n : trimmed
  }
  if (typeof previous === 'boolean') return trimmed === 'true'
  return raw
}

function linksToText(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string').join(', ')
  return ''
}

function textToLinks(raw: string): string[] {
  return raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function buildDraftState(next: EditableContract) {
  const chars = asRecord(next.characteristics)
  const nextChars: Record<string, string> = {}
  for (const [k, v] of Object.entries(chars)) nextChars[k] = stringifyCharValue(v)
  for (const key of CHARACTERISTIC_HINTS[next.kind] ?? []) {
    if (!(key in nextChars)) nextChars[key] = ''
  }

  const links = asRecord(next.links)
  const nextLinks: Record<string, string> = {}
  for (const [k, v] of Object.entries(links)) nextLinks[k] = linksToText(v)
  for (const key of LINK_HINTS[next.kind] ?? []) {
    if (!(key in nextLinks)) nextLinks[key] = ''
  }

  const meta = asRecord(next.metadata)
  const nextMeta: Record<string, string> = {}
  for (const [k, v] of Object.entries(meta)) nextMeta[k] = stringifyCharValue(v)

  return { draft: next, chars: nextChars, links: nextLinks, meta: nextMeta }
}

function Field({
  label,
  value,
  onChange,
  readOnly = false,
  mono = false,
  full = false,
  multiline = false,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
  mono?: boolean
  full?: boolean
  multiline?: boolean
}) {
  const inputClass = `mt-1 w-full rounded-md border border-[var(--color-line)] bg-white px-2 py-1.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)] ${
    mono ? 'font-mono text-xs' : ''
  }`
  return (
    <label className={`block rounded-xl border border-[var(--color-line)] p-3 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-slate)]">
        {label}
        {readOnly ? <span className="ml-1 font-normal normal-case tracking-normal">(static)</span> : null}
      </span>
      {readOnly ? (
        <span className={`mt-1 block break-all text-sm text-[var(--color-ink)] ${mono ? 'font-mono text-xs' : ''}`}>
          {value || '—'}
        </span>
      ) : multiline ? (
        <textarea
          value={value}
          rows={3}
          onChange={(e) => onChange?.(e.target.value)}
          className={inputClass}
        />
      ) : (
        <input value={value} onChange={(e) => onChange?.(e.target.value)} className={inputClass} />
      )}
    </label>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-slate)]">{title}</h4>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  )
}

type ContractDetailEditorProps = {
  projectId: string
  contract: EditableContract
  backendPath: string
  apiAvailable: boolean
  onSaved: () => Promise<void> | void
}

export function ContractDetailEditor({
  projectId,
  contract,
  backendPath,
  apiAvailable,
  onSaved,
}: ContractDetailEditorProps) {
  const initial = useMemo(() => buildDraftState(contract), [contract.id])
  const [draft, setDraft] = useState<EditableContract>(initial.draft)
  const [charDraft, setCharDraft] = useState<Record<string, string>>(initial.chars)
  const [linkDraft, setLinkDraft] = useState<Record<string, string>>(initial.links)
  const [metaDraft, setMetaDraft] = useState<Record<string, string>>(initial.meta)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [savedPath, setSavedPath] = useState<string | null>(null)
  const [sourceContract, setSourceContract] = useState(contract)

  // Reset form only when selecting a different contract (not on every parent re-render).
  useEffect(() => {
    const next = buildDraftState(contract)
    setDraft(next.draft)
    setCharDraft(next.chars)
    setLinkDraft(next.links)
    setMetaDraft(next.meta)
    setSourceContract(contract)
    setError(null)
    setSavedAt(null)
    setSavedPath(null)
  }, [contract.id])

  const extraTopFields = useMemo(() => {
    return Object.keys(draft).filter((k) => !CORE_KEYS.has(k) && draft[k] != null)
  }, [draft])

  const charKeys = useMemo(() => Object.keys(charDraft).sort((a, b) => a.localeCompare(b)), [charDraft])
  const linkKeys = useMemo(() => Object.keys(linkDraft).sort((a, b) => a.localeCompare(b)), [linkDraft])
  const metaKeys = useMemo(() => Object.keys(metaDraft).sort((a, b) => a.localeCompare(b)), [metaDraft])

  function updateField(key: string, value: string) {
    setDraft((d) => ({ ...d, [key]: value }))
    // Keep characteristic labels in sync with identity edits for every asset type.
    if (key === 'display_name') {
      setCharDraft((d) => ({
        ...d,
        PreferredLabel: value,
        ...(Object.prototype.hasOwnProperty.call(d, 'DisplayName') ? { DisplayName: value } : {}),
      }))
    }
    if (key === 'name') {
      setCharDraft((d) => ({
        ...d,
        ...(Object.prototype.hasOwnProperty.call(d, 'Slug') ? { Slug: value } : {}),
        ...(Object.prototype.hasOwnProperty.call(d, 'ConceptId') ? { ConceptId: value } : {}),
      }))
    }
  }

  function resetFromSource() {
    const next = buildDraftState(sourceContract)
    setDraft(next.draft)
    setCharDraft(next.chars)
    setLinkDraft(next.links)
    setMetaDraft(next.meta)
    setError(null)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!apiAvailable) {
      setError('API unavailable. Run npm run dev')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const prevChars = asRecord(sourceContract.characteristics)
      const characteristics: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(charDraft)) {
        if (!v.trim() && !(k in prevChars)) continue
        characteristics[k] = parseCharValue(v, prevChars[k])
      }
      if (draft.display_name) {
        characteristics.PreferredLabel = draft.display_name
        if ('DisplayName' in characteristics || contract.kind === 'namespace') {
          characteristics.DisplayName = draft.display_name
        }
      }
      if (draft.name && ('Slug' in characteristics || contract.kind === 'namespace')) {
        characteristics.Slug = draft.name
      }
      if (draft.name && ('ConceptId' in characteristics || contract.kind === 'semantic_concept')) {
        if (contract.kind === 'semantic_concept') characteristics.ConceptId = draft.name
      }

      const links: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(linkDraft)) {
        const ids = textToLinks(v)
        if (ids.length) links[k] = ids.length === 1 ? ids[0] : ids
      }

      const prevMeta = asRecord(sourceContract.metadata)
      const metadata: Record<string, unknown> = { ...prevMeta }
      for (const [k, v] of Object.entries(metaDraft)) {
        if (STATIC_META.has(k)) {
          metadata[k] = prevMeta[k] ?? v
          continue
        }
        metadata[k] = parseCharValue(v, prevMeta[k])
      }
      metadata.file = prevMeta.file ?? `${contract.id}.json`
      metadata.pack = prevMeta.pack ?? metadata.pack
      metadata.project = prevMeta.project ?? projectId
      metadata.updated_via = 'contracts-ui'
      metadata.updated_at = new Date().toISOString()

      const payload: Record<string, unknown> = {
        ...sourceContract,
        ...draft,
        id: contract.id,
        kind: contract.kind,
        natco: contract.natco ?? 'global',
        asset_type: contract.asset_type,
        contract_id: contract.contract_id,
        type_contract_id: contract.type_contract_id,
        qualified_name: contract.qualified_name,
        display_name: draft.display_name,
        name: draft.name,
        description: draft.description || undefined,
        source_system: draft.source_system,
        layer: draft.layer,
        status: draft.status,
        characteristics,
        links,
        metadata,
      }
      if (draft.product_class) payload.product_class = draft.product_class
      else delete payload.product_class
      if (draft.familyId) payload.familyId = draft.familyId
      if (draft.ossie_version) payload.ossie_version = draft.ossie_version
      if (draft.spec_url) payload.spec_url = draft.spec_url
      if (draft.package_file) payload.package_file = draft.package_file

      const result = await updateContractApi(projectId, contract.id, payload)
      const saved = (result.contract ?? payload) as EditableContract
      setSourceContract(saved)
      const next = buildDraftState(saved)
      setDraft(next.draft)
      setCharDraft(next.chars)
      setLinkDraft(next.links)
      setMetaDraft(next.meta)
      setSavedAt(new Date().toLocaleTimeString())
      setSavedPath(result.path ?? backendPath)
      await onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save contract')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={(e) => void handleSave(e)}>
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-[var(--color-line)] bg-white px-5 py-3">
        <button
          type="submit"
          disabled={!apiAvailable || busy}
          className="rounded-md bg-[var(--color-ink)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Save to backend'}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={resetFromSource}
          className="rounded-md border border-[var(--color-line)] px-3 py-1.5 text-xs text-[var(--color-slate)]"
        >
          Cancel
        </button>
        {!apiAvailable ? <span className="text-[11px] text-[var(--color-slate)]">API offline</span> : null}
        {savedAt ? <span className="text-[11px] text-[var(--color-slate)]">Saved {savedAt}</span> : null}
        {savedPath ? (
          <span className="break-all font-mono text-[10px] text-[var(--color-slate)]">{savedPath}</span>
        ) : null}
        {error ? <span className="text-[11px] text-red-600">{error}</span> : null}
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-auto p-5">
        <Section title="Identity">
          <Field label="Id" value={draft.id} readOnly mono full />
          <Field label="Contract id" value={String(draft.contract_id ?? '')} readOnly mono />
          <Field label="Type contract id" value={String(draft.type_contract_id ?? '')} readOnly mono />
          <Field label="Kind" value={draft.kind} readOnly mono />
          <Field label="Asset type" value={String(draft.asset_type ?? '')} readOnly />
          <Field
            label="Display name"
            value={String(draft.display_name ?? '')}
            onChange={(v) => updateField('display_name', v)}
          />
          <Field label="Name" value={String(draft.name ?? '')} onChange={(v) => updateField('name', v)} mono />
          <Field label="Qualified name" value={String(draft.qualified_name ?? '')} readOnly mono />
          <Field label="Namespace (natco)" value={String(draft.natco ?? 'global')} readOnly mono />
          <Field label="Backend file" value={backendPath} readOnly mono full />
        </Section>

        <Section title="Classification">
          <Field
            label="Source system"
            value={String(draft.source_system ?? '')}
            onChange={(v) => updateField('source_system', v)}
          />
          <Field label="Layer" value={String(draft.layer ?? '')} onChange={(v) => updateField('layer', v)} />
          <Field label="Status" value={String(draft.status ?? '')} onChange={(v) => updateField('status', v)} />
          <Field
            label="Product class"
            value={String(draft.product_class ?? '')}
            onChange={(v) => updateField('product_class', v)}
          />
          <Field
            label="Family id"
            value={String(draft.familyId ?? '')}
            onChange={(v) => updateField('familyId', v)}
            mono
          />
          <Field
            label="Description"
            value={String(draft.description ?? '')}
            onChange={(v) => updateField('description', v)}
            full
            multiline
          />
        </Section>

        {draft.kind === 'ossie_semantic_model' ? (
          <Section title="Ossie package">
            <Field
              label="Ossie version"
              value={String(draft.ossie_version ?? '')}
              onChange={(v) => updateField('ossie_version', v)}
            />
            <Field
              label="Spec URL"
              value={String(draft.spec_url ?? '')}
              onChange={(v) => updateField('spec_url', v)}
              mono
              full
            />
            <Field
              label="Package file"
              value={String(draft.package_file ?? '')}
              onChange={(v) => updateField('package_file', v)}
              mono
              full
            />
          </Section>
        ) : null}

        <Section title="Characteristics">
          {charKeys.length === 0 ? (
            <p className="sm:col-span-2 text-xs text-[var(--color-slate)]">No characteristics yet.</p>
          ) : (
            charKeys.map((key) => (
              <Field
                key={key}
                label={key}
                value={charDraft[key] ?? ''}
                onChange={(v) => setCharDraft((d) => ({ ...d, [key]: v }))}
                full={key === 'Description' || key === 'Uri' || key === 'Properties'}
                multiline={key === 'Description' || key === 'Properties'}
              />
            ))
          )}
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => {
                const key = window.prompt('Characteristic name')
                if (!key?.trim()) return
                setCharDraft((d) => ({ ...d, [key.trim()]: d[key.trim()] ?? '' }))
              }}
              className="rounded-md border border-[var(--color-line)] px-2 py-1 text-[11px] text-[var(--color-ink)]"
            >
              + Characteristic
            </button>
          </div>
        </Section>

        <Section title="Links">
          {linkKeys.length === 0 ? (
            <p className="sm:col-span-2 text-xs text-[var(--color-slate)]">No links yet.</p>
          ) : (
            linkKeys.map((key) => (
              <Field
                key={key}
                label={key}
                value={linkDraft[key] ?? ''}
                onChange={(v) => setLinkDraft((d) => ({ ...d, [key]: v }))}
                mono
                full
              />
            ))
          )}
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => {
                const key = window.prompt('Link relation name')
                if (!key?.trim()) return
                setLinkDraft((d) => ({ ...d, [key.trim()]: d[key.trim()] ?? '' }))
              }}
              className="rounded-md border border-[var(--color-line)] px-2 py-1 text-[11px] text-[var(--color-ink)]"
            >
              + Link relation
            </button>
            <p className="mt-1 text-[10px] text-[var(--color-slate)]">Enter contract ids separated by commas.</p>
          </div>
        </Section>

        <Section title="Metadata">
          {metaKeys.map((key) => (
            <Field
              key={key}
              label={key}
              value={metaDraft[key] ?? ''}
              onChange={(v) => setMetaDraft((d) => ({ ...d, [key]: v }))}
              readOnly={STATIC_META.has(key)}
              mono
              full
            />
          ))}
        </Section>

        {extraTopFields.length ? (
          <Section title="Other fields">
            {extraTopFields.map((key) => (
              <Field
                key={key}
                label={key}
                value={stringifyCharValue(draft[key])}
                onChange={(v) => updateField(key, v)}
                mono
                full
              />
            ))}
          </Section>
        ) : null}
      </div>
    </form>
  )
}
