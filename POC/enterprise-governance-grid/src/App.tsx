import { PitchProvider, usePitchMode } from './pitch/PitchContext'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Problem } from './components/Problem'
import { BigIdea } from './components/BigIdea'
import { Ownership } from './components/Ownership'
import { ConceptLibrary } from './components/ConceptLibrary'
import { AnimatedArchitecture } from './components/AnimatedArchitecture'
import { ContextGraph } from './components/ContextGraph'
import { Outcomes } from './components/Outcomes'
import { SystemsOfRecord } from './components/SystemsOfRecord'
import { Engines } from './components/Engines'
import { Federation } from './components/Federation'
import { Mapping } from './components/Mapping'
import { KnowledgeGraph } from './components/KnowledgeGraph'
import { Apis } from './components/Apis'
import { Governance } from './components/Governance'
import { Roadmap } from './components/Roadmap'
import { Footer } from './components/Footer'
import { Thesis } from './components/Thesis'

function AppShell() {
  const { mode } = usePitchMode()
  const explore = mode === 'explore'

  return (
    <div className="grid-bg min-h-screen">
      <Nav />
      <main>
        <Hero />
        <div className="section-rule" />
        <Problem />
        <div className="section-rule" />
        <BigIdea />
        <div className="section-rule" />
        <Ownership />
        <div className="section-rule" />
        <ConceptLibrary />
        <div className="section-rule" />
        <AnimatedArchitecture />
        <div className="section-rule" />
        <ContextGraph />
        <div className="section-rule" />
        <Outcomes />

        {explore ? (
          <>
            <div className="section-rule" />
            <Thesis />
            <div className="section-rule" />
            <SystemsOfRecord />
            <div className="section-rule" />
            <Engines />
            <div className="section-rule" />
            <Federation />
            <div className="section-rule" />
            <Mapping />
            <div className="section-rule" />
            <KnowledgeGraph />
            <div className="section-rule" />
            <Apis />
            <div className="section-rule" />
            <Governance />
            <div className="section-rule" />
            <Roadmap />
          </>
        ) : null}

        <div className="section-rule" />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <PitchProvider>
      <AppShell />
    </PitchProvider>
  )
}
