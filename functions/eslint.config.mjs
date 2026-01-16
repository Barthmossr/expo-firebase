import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const require = createRequire(import.meta.url)
const load = require('jiti')(__filename)
const baseConfig = load(
  path.resolve(__dirname, '..', 'eslint.config.ts'),
).default

export default baseConfig
