import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], // 검사할 파일 지정
    languageOptions: {
      globals: globals.browser, // 브라우저 환경의 전역 변수 설정
    },
  },
  pluginJs.configs.recommended, // 기본 ESLint 권장 설정
  ...tseslint.configs.recommended, // TypeScript 권장 설정
  pluginReact.configs.flat.recommended, // React 권장 설정

  // 추가 규칙 적용
  {
    settings: {
      react: {
        version: 'detect', // 설치된 React 버전 자동 감지
      },
    },
    rules: {
      'semi': ['error', 'always'], // 세미콜론 강제 사용
      'quotes': ['error', 'single'], // 싱글 쿼트 사용 강제
      'no-console': ['warn'], // 콘솔 로그 경고
      'indent': ['error', 2], // 2칸 들여쓰기
    },
  },
];