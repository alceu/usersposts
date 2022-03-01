module.exports = {
  env: {
    es2021: true,
    node: true,
    commonjs: true,
    browser: true,
  },
  plugins: [
    'prettier',
    'react',
    // 'testing-library', 'jest', 'jest-dom'
  ],
  extends: [
    'react-app',
    'react-app/jest',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    // 'plugin:testing-library/react',
    // 'plugin:jest/recommended',
    // 'plugin:jest-dom/recommended',
    // "airbnb",
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
