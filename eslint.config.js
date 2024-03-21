import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
}, {
  rules: {
    'no-console': 'off',
    'no-tabs': ['warn', { allowIndentationTabs: true }],
  },
  env: { Node: true, Browser: true, es6: true },
})
