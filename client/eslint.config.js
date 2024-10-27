import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'prettier'

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
      'prettier':prettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'semi': ['error', 'always'], // 세미콜론 강제 사용
            'quotes': ['error', 'single'], // 싱글 쿼트 사용 강제
            //'no-console': ['warn'], // 콘솔 로그 경고
            'indent': ['error', 4], // 2칸 들여쓰기
            'no-var': 'error', //var 대신 let/const 사용 강제
            'arrow-parens': ['error', 'always'], //일관성을 위해 파라미터가 하나일때라도 괄호 사용
            'object-curly-spacing': ['error', 'always'], //중괄호 내 공백 강제,
            'no-trailing-spaces': 'error', //불필요한 공백 제거
            'comma-dangle': ['error', 'always-multiline'], //후행 콤마 사용
            'curly': ['error', 'all'], //모든 조건문에 중괄호 사용 강제
    },
  },
)
