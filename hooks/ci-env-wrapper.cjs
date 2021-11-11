#!/usr/bin/env node
const env = { ...process.env }
if (process.env.GITHUB_REF_TYPE === 'tag') {
  env.CI_BUILD_TAG = process.env.GITHUB_REF_NAME
}

require('child_process').execFileSync(
  process.argv[2],
  process.argv.slice(3),
  { env, stdio: 'inherit' },
)
