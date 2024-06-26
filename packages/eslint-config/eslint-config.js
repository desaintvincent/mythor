const DISABLED = 0
const WARN = 1
const ERROR = 2

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  root: true,
  plugins: [
    '@typescript-eslint',
    'filenames',
    'import'
  ],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  ignorePatterns: ['**/lib/**/*'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        tabWidth: 2,
        semi: false,
        singleQuote: true,
        printWidth: 80,
        endOfLine: 'auto',
      },
    ],
    'no-extra-semi': ['error'],
    'newline-before-return': ['error'],
    '@typescript-eslint/explicit-member-accessibility': ['error'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
      },
      {
        selector: 'enum',
        format: ['PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      {
        selector: 'class',
        format: ['PascalCase'],
      },
      {
        selector: 'function',
        format: ['camelCase'],
      },
      {
        selector: 'variableLike',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
    ],
    'filenames/match-exported': ERROR,
    'filenames/no-index': ERROR,
    'no-console': WARN,
    'no-else-return': ['error'],
    '@typescript-eslint/no-explicit-any': ERROR,
    '@typescript-eslint/no-unused-vars': ERROR,
    '@typescript-eslint/strict-boolean-expressions': DISABLED,
    '@typescript-eslint/no-var-requires': DISABLED
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        "import/no-unused-modules": ["error", {"unusedExports": true}],
        "import/no-unresolved": 0,
        "import/no-named-as-default-member": "error"
      }
    }
  ]
}
