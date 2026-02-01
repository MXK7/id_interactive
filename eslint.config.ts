import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tailwindcss from 'eslint-plugin-tailwindcss';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: ['dist/**', 'node_modules/**'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,

	{
		files: ['**/*.{ts,tsx}'],
		settings: {
			react: {
				version: 'detect',
			},
			'import/resolver': {
				typescript: {},
				alias: {
					map: [['@', './src']],
					extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
				},
			},
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: './tsconfig.json',
			},
			globals: globals.browser,
		},
		plugins: {
			react,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			tailwindcss,
			import: importPlugin,
			prettier: prettierPlugin,
		},
		rules: {
			semi: ['warn', 'always'],
			quotes: ['warn', 'single', { avoidEscape: true }],
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			eqeqeq: ['error', 'always'],
			curly: ['warn', 'all'],
			'consistent-return': 'warn', // A voir
			'no-shadow': 'off',
			'@typescript-eslint/no-shadow': ['error'],
			'no-multi-spaces': 'warn',
			'no-trailing-spaces': 'warn',
			camelcase: ['error', { properties: 'always' }],
			'max-len': ['error', { code: 2500 }],

			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			...reactRefresh.configs.recommended.rules,
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',

			...tailwindcss.configs.recommended.rules,
			'tailwindcss/classnames-order': 'warn',

			...importPlugin.configs.recommended.rules,
			...importPlugin.configs.typescript.rules,
			'import/order': [
				'warn',
				{
					groups: [
						['builtin', 'external'], // Node modules first
						['internal', 'parent', 'sibling', 'index'], // Local imports
					],
					'newlines-between': 'always', // Blank line between groups
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],

			'prettier/prettier': 'warn',
		},
	},
	prettierConfig,
];
