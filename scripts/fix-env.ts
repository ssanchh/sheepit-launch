import * as fs from 'fs'

const envPath = '.env.local'
const content = fs.readFileSync(envPath, 'utf8')

// Remove duplicate Beehiiv entries and fix typos
const lines = content.split('\n')
const filteredLines = []
let inBeehiivSection = false

for (const line of lines) {
  // Skip the old/duplicate Beehiiv entries
  if (line.includes('BEEHIIV_API_KEY=P9iN35OW') || 
      line.includes('BEEHIIV_PUBLICATION_ID=cb4a83f2')) {
    continue
  }
  
  // Fix the typo BEEHIIV -> BEEHIIV
  if (line.includes('BEEHIIV_PUBLICATION_ID=')) {
    filteredLines.push(line.replace('BEEHIIV_PUBLICATION_ID=', 'BEEHIIV_PUBLICATION_ID='))
  } else {
    filteredLines.push(line)
  }
}

// Write back
fs.writeFileSync(envPath, filteredLines.join('\n'))
console.log('Fixed .env.local file')