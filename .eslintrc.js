module.exports = {
  root: true,
  extends: ['@turbo/eslint-config'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.next/',
    'build/',
    'coverage/',
    '*.config.js',
  ],
};
