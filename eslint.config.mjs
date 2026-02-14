import pluginVue from 'eslint-plugin-vue'
import babelParser from '@babel/eslint-parser'
import globals from 'globals'

export default [
  // Global ignores
  {
    ignores: ['dist/**', 'node_modules/**']
  },

  // Base ESLint recommended rules for JS files
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error'
    }
  },

  // Vue 3 essential rules
  ...pluginVue.configs['flat/essential'],

  // Vue file specific configuration
  {
    files: ['**/*.vue'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        __APP_VERSION__: 'readonly',
      },
      parserOptions: {
        parser: babelParser,
        requireConfigFile: false
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'error',
      'vue/no-reserved-component-names': 'off',
      'vue/no-deprecated-delete-set': 'off'
    }
  }
]
