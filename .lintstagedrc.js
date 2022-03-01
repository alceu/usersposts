module.exports = {
  './**/*.js': [
    // '**/*.+(js|jsx|ts|graphql|vue)': [
    //"*.css": "stylelint",
    //"*.scss": "stylelint --syntax=scss"
    'npm run lint-fix -- --cache',
    'git add',
  ],
  './src/**/*.js': [
    // '**/*.+(js|jsx|ts|graphql|vue)': [
    'npm run test:staged',
  ],
  './**/*.+(js|md|scss|json)': [
    // '**/*.+(js|md|ts|css|sass|less|graphql|yml|yaml|scss|json|vue)': [
    'npm run format',
    'git add',
  ],
};
