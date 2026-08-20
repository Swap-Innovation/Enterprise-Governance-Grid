import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

/** Render modals on document.body — avoids `backdrop-filter` on ancestors breaking `position: fixed`. */
export function ModalPortal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body)
}
