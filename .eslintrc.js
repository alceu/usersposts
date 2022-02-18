module.exports = {
  env: {
    es2021: true,
    node: true,
    commonjs: true,
    browser: true,
  },
  plugins: ['prettier', 'react', 'react-hooks', 'testing-library', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:testing-library/react',
    'plugin:jest/recommended',
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
  rules: {},
};
