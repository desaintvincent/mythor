const fs = require('fs')

const packages = fs.readdirSync(__dirname + '/packages/', {
  withFileTypes: true,
})

const packageNames = packages
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['root', ...packageNames]],
  },
}
