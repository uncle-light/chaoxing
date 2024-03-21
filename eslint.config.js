import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  overrides:
      {
        env: {
          node: true,
        },
      },
}, {
  rules: {
    'no-console': 'off',
    'no-tabs': ['warn', { allowIndentationTabs: true }],
  },
})
