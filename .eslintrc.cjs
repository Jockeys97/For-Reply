module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: { react: { version: '18.0' } },
  rules: {
    'react/prop-types': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }]
  },
  ignorePatterns: ['dist', 'node_modules']
};


