// @ts-check

import { execSync } from 'node:child_process'
import process from 'node:process'

const gitLog = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim()
const gitBranch = execSync('git branch --show-current', {
  encoding: 'utf8',
}).trim()

if (gitLog.startsWith('chore: release') && gitBranch !== 'release') {
  console.log('Release commit, skipped.')
  process.exit(0)
}

if (gitLog.includes('skip build')) {
  console.log('Skip build commit, skipped.')
  process.exit(0)
}

console.log('Proceeding with build.')
process.exit(1)
