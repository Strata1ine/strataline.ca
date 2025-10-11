import eslintPluginAstro from 'eslint-plugin-astro';

export default [
	...eslintPluginAstro.configs.recommended,
	{
		rules: {
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'prefer-const': 'error',
			'comma-dangle': ['error', 'always-multiline'],
		},
	},
];
