import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  ignores: ['app/types/swagger.ts'],
})
  .prepend()
  .override('nuxt/typescript/rules', {
    rules: {
      '@stylistic/max-len': ['off', { code: 90 }],
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-dupe-keys': 'off',
    },
  });
