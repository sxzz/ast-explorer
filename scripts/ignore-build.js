// @ts-check

import process from 'node:process'

const gitLog = process.env.VERCEL_GIT_COMMIT_MESSAGE || ''
const gitBranch = process.env.VERCEL_GIT_COMMIT_REF

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
