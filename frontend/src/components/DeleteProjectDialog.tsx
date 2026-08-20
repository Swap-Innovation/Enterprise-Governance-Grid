import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectRegistry } from '../context/ProjectRegistryContext'
import type { ProjectDef } from '../data/projects'
import { ModalPortal } from './ModalPortal'

type DeleteProjectDialogProps = {
  open: boolean
  project: ProjectDef | null
  currentDemoId?: string
  onClose: () => void
  onDeleted?: () => void
}

export function DeleteProjectDialog({
  open,
  project,
  currentDemoId,
  onClose,
  onDeleted,
}: DeleteProjectDialogProps) {
  const { deleteProject, apiAvailable } = useProjectRegistry()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setError(null)
      setBusy(false)
    }
  }, [open, project?.id])

  if (!open || !project) return null

  const deletingActive =
    project.id === currentDemoId || project.slug === currentDemoId

  async function handleDelete() {
    if (!apiAvailable) {
      setError('Project API is offline. Restart with: cd frontend && npm run dev')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await deleteProject(project!.id)
      onDeleted?.()
      onClose()
      if (deletingActive) navigate('/demo/udp-dt/marketplace')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete project'
      setError(
        msg === 'Not found'
          ? 'Delete API not available — restart dev server (npm run dev) so the API picks up DELETE /api/projects/:id'
          : msg,
      )
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
              <h2 className="font-display text-lg font-bold text-[var(--color-ink)]">Delete project</h2>
              <p className="mt-1 text-[12px] text-[var(--color-slate)]">
                Permanently remove <strong>{project.name}</strong> and the folder{' '}
                <code className="font-mono text-[11px]">mock-data/projects/{project.id}/</code>? This cannot be
                undone.
              </p>
            </div>
            <button type="button" onClick={onClose} className="tool-btn px-2 py-1 text-xs">
              ✕
            </button>
          </div>

          {error ? <p className="mt-3 text-[12px] text-red-600">{error}</p> : null}

          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={busy} className="btn-ghost px-4 py-2 text-xs">
              Cancel
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleDelete()}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-opacity disabled:opacity-40"
            >
              {busy ? 'Deleting…' : 'Delete project'}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}
