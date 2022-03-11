module.exports = {
  './**/*.+(js|jsx)': ['npm run lint-fix:js -- --cache'],
  './src/**/*.scss': ['npm run lint-fix:style -- --cache'],
  './**/*.+(js|jsx|md|scss|json)': ['npm run format'],
  './src/**/*.+(js|jsx)': ['npm run test:staged'],
};
