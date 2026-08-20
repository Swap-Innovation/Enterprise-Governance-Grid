import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectRegistry } from '../context/ProjectRegistryContext'
import { ModalPortal } from './ModalPortal'

type CreateProjectDialogProps = {
  open: boolean
  onClose: () => void
}

export function CreateProjectDialog({ open, onClose }: CreateProjectDialogProps) {
  const { createProject } = useProjectRegistry()
  const navigate = useNavigate()
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [workspace, setWorkspace] = useState('')
  const [scopes, setScopes] = useState('global')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const slug = id.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-')
      const project = await createProject({
        id: slug,
        title: title.trim() || slug,
        code: code.trim() || slug.toUpperCase(),
        workspace: workspace.trim() || title.trim() || slug,
        scopes: scopes.split(',').map((s) => s.trim()).filter(Boolean),
      })
      onClose()
      navigate(`/demo/${project.slug}/contracts`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="panel-card w-full max-w-md p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--color-ink)]">New project</h2>
            <p className="mt-1 text-[12px] text-[var(--color-slate)]">
              Creates a workspace under mock-data/projects with a global namespace and empty contract packs.
            </p>
          </div>
          <button type="button" onClick={onClose} className="tool-btn px-2 py-1 text-xs">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block text-[12px]">
            <span className="font-semibold text-[var(--color-ink)]">Project ID</span>
            <input
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="my-domain"
              className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
            />
          </label>
          <label className="block text-[12px]">
            <span className="font-semibold text-[var(--color-ink)]">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Domain 360"
              className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-[12px]">
              <span className="font-semibold text-[var(--color-ink)]">Code</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="MY-DOM"
                className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
              />
            </label>
            <label className="block text-[12px]">
              <span className="font-semibold text-[var(--color-ink)]">Workspace</span>
              <input
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                placeholder="My domain federation"
                className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
              />
            </label>
          </div>
          <label className="block text-[12px]">
            <span className="font-semibold text-[var(--color-ink)]">Scopes (comma-separated)</span>
            <input
              value={scopes}
              onChange={(e) => setScopes(e.target.value)}
              placeholder="global, natco-de"
              className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
            />
          </label>
          {error ? <p className="text-[12px] text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost px-4 py-2 text-xs">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="btn-accent px-4 py-2 text-xs disabled:opacity-50">
              {busy ? 'Creating…' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  )
}
