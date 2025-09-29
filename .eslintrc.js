// .eslintrc.js
module.exports = {
  env: { es2021: true, node: true },
  extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'script' }, // usamos require(), cjs
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-console': ['warn', { allow: ['warn', 'error', 'log'] }], // permitimos logs útiles
  },
  overrides: [
    {
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: { sourceType: 'script' },
    },
  ],
};
