module.exports = {
  env: {
    es2021: true,
  },
  plugins: [],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest-dom/recommended',
    'react-app',
    'react-app/jest',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'prettier/prettier': 'WARN',
    'no-unused-vars': 'WARN',
    'react/prop-types': 'OFF',
  },
};
