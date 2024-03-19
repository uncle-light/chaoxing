import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
}, {
  rules: {
    'no-console': 'off',
  },
})
