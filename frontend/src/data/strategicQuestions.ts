import data from '../../../mock-data/projects/udp-dt/strategic-questions.json'

export type StrategicQuestion = {
  id: string
  code: string
  title: string
  status: string
  decisionGate: string
  owner: string
  whyItMatters: string
  question: string
  recommendation: string
  isIn: string[]
  isOut: string[]
  evidence: string[]
  deliverable: string
  pocProof: { label: string; href: string }[]
  detailSections: { heading: string; paragraphs: string[]; bullets?: string[] }[]
  residual: string
}

export const strategicQuestions = data as StrategicQuestion[]

export function getStrategicQuestion(idOrCode: string): StrategicQuestion | undefined {
  const key = idOrCode.trim().toLowerCase()
  return strategicQuestions.find((q) => q.id === key || q.code.toLowerCase() === key)
}
