module.exports = {
  // linters: {
  '**/*.js': [ // '**/*.+(js|jsx|ts|graphql|vue)': [ 
    'npm run lint-fix -- --cache',
    // 'jest --findRelatedTests',
    // 'git add',
  ],
  '**/*.+(js|md|css|json)': [ // '**/*.+(js|md|ts|css|sass|less|graphql|yml|yaml|scss|json|vue)': [ 
    'npm run format', //"./node_modules/.bin/prettier --write './**/*.{js,jsx,ts,tsx,css,md,json}' --config ./.prettierrc.js",
  ],
  // },
};
