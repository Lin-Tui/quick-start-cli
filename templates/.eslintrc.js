export default {
    env: {
        browser: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
        ecmaFeatures: {
            modules: true
        }
    },
    plugins: ['@typescript-eslint'],
    extends: ['plugin:@typescript-eslint/recommended'],
    rules: {}
};
