import vue from 'eslint-plugin-vue'
import tsParser from '@typescript-eslint/parser'
export default [...vue.configs['flat/recommended'], { files: ['**/*.ts'], languageOptions: { parser: tsParser } }, { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tsParser } }, rules: { 'vue/multi-word-component-names': 'off', 'vue/singleline-html-element-content-newline': 'off', 'vue/max-attributes-per-line': 'off', 'vue/mustache-interpolation-spacing': 'off' } }]
