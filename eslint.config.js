const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            globals: globals.node,
            sourceType: 'commonjs',
        },
        rules: {
            'no-console': 'off',
            'no-sync': 'off',
            'prefer-const': 'error',
        },
    },
];
