export function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl font-bold text-[var(--color-foam)]">
            Enterprise Governance Grid
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-mist)]">
            Architecture showcase for client pitches — Pitch mode for the room,
            Explore mode for architects. TM Forum Customer-domain proof included.
          </p>
        </div>
        <div className="text-xs text-[var(--color-mist)]">
          <p>POC · Vite · React · Tailwind · Framer Motion</p>
          <p className="mt-1">Source: docs/10_Data_Governance_And_Metadata/05</p>
        </div>
      </div>
    </footer>
  )
}
