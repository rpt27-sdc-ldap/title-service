module.exports = {
  extends: './node_modules/eslint-config-hackreactor/index.js',
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 8
  },
  overrides: [
    {
      files: ['db/db.js', 'db/setup/seed.js'],
      rules: { camelcase: 0 }
    }
  ]
}