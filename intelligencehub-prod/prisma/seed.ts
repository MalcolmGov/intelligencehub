import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  console.log('Seeding...')

  await db.project.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Real-Time Fraud Neural Net',    description: 'ML model detecting fraudulent transactions in under 50ms across all OpCos.', stage: 'PRODUCTION', type: 'Risk',       health: 92 },
      { name: 'AI Decisioning Engine',          description: 'Credit and lending decisioning powered by alternative data and ML scoring.', stage: 'PILOT',      type: 'Lending',    health: 74 },
      { name: 'Customer Support Copilot',       description: 'LLM-powered agent assist tool reducing average handle time by 35%.',         stage: 'PILOT',      type: 'CX',         health: 68 },
      { name: 'AIOps Command Centre',           description: 'Predictive monitoring and automated incident response across infrastructure.',stage: 'VALIDATION', type: 'Ops',        health: 55 },
      { name: 'Document Intelligence Pipeline', description: 'Automated extraction and classification of KYC and compliance documents.',   stage: 'PRODUCTION', type: 'Compliance', health: 88 },
      { name: 'Voice-First USSD Platform',      description: 'Natural language voice interface for feature-phone customers in local languages.', stage: 'VALIDATION', type: 'CX', health: 61 },
    ],
  })

  await db.document.createMany({
    skipDuplicates: true,
    data: [
      { title: 'SDLC 2.0 Strategy',           category: 'Strategy',   tldr: 'Embeds AI across all seven SDLC phases to achieve 2-3x delivery speed and 20-40% cost reduction.',        tags: 'AI,Engineering,Strategy'     },
      { title: 'AI Governance Framework',      category: 'Governance', tldr: 'Defines risk tiers, approval workflows, and monitoring requirements for all AI systems.',                tags: 'Governance,Risk,Compliance'  },
      { title: 'AI Acceptable Use Policy',     category: 'Policy',     tldr: 'Sets out permitted and prohibited uses of AI tools by staff across the group.',                           tags: 'Policy,HR,Compliance'        },
      { title: 'AI Council Charter',           category: 'Governance', tldr: 'Establishes the cross-divisional AI Council with decision authority over AI investments.',               tags: 'Governance,Leadership'       },
      { title: 'Data Privacy & AI Guidelines', category: 'Policy',     tldr: 'Ensures AI systems comply with GDPR, NDPR, and regional data protection laws across 14 markets.',        tags: 'Privacy,Legal,Compliance'    },
    ],
  })

  console.log('✓ Seed complete')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => db.$disconnect())
