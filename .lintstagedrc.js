module.exports = {
  './**/*.js': ['npm run lint-fix:js -- --cache'],
  './src/**/*.scss': ['npm run lint-fix:style -- --cache'],
  './**/*.+(js|md|scss|json)': ['npm run format'],
  './src/**/*.js': ['npm run test:staged'],
};
