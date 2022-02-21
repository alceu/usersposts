module.exports = {
  // linters: {
  './**/*.js': [
    // '**/*.+(js|jsx|ts|graphql|vue)': [
    'npm run lint-fix -- --cache',
    'git add',
  ],
  './src/**/*.js': [
    // '**/*.+(js|jsx|ts|graphql|vue)': [
    'npm run test:staged',
    // 'jest --findRelatedTests',
  ],
  './**/*.+(js|md|css|json)': [
    // '**/*.+(js|md|ts|css|sass|less|graphql|yml|yaml|scss|json|vue)': [
    'npm run format', //"./node_modules/.bin/prettier --write './**/*.{js,jsx,ts,tsx,css,md,json}' --config ./.prettierrc.js",
    'git add',
    //"*.css": "stylelint",
    //"*.scss": "stylelint --syntax=scss"
  ],
  // },
};
