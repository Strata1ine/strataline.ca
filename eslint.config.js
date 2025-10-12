import eslintPluginAstro from 'eslint-plugin-astro';
import solid from 'eslint-plugin-solid/configs/recommended';
import tsParser from '@typescript-eslint/parser';

export default [
	...eslintPluginAstro.configs.recommended,
	{
		files: ['**/*.tsx', '**/*.ts'],
		languageOptions: {
			parser: tsParser,
		},
	},
	{
		...solid,
		files: ['**/*.jsx', '**/*.tsx'],
	},
	{
		rules: {
			semi: ['error', 'always'],
			'solid/reactivity': 'off',
			'prefer-const': 'error',
			'comma-dangle': ['error', 'always-multiline'],
		},
	},
];
