const fs = require('fs')
const path = require('path')

const targetPath = path.resolve(process.cwd(), 'lib/esm/package.json')

fs.mkdirSync(path.dirname(targetPath), { recursive: true })
fs.writeFileSync(targetPath, JSON.stringify({ type: 'module' }, null, 2) + '\n')
