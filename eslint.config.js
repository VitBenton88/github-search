import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-multi-spaces': ['error'],
      'no-trailing-spaces': 'error',
      'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        'jsx-quotes': ['error', 'prefer-double'],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'semi': ['error', 'never'],
      "sort-imports": [
        "error", 
        { 
          "ignoreCase": true, 
          "ignoreDeclarationSort": true 
        }
      ], 
    },
  },
)
