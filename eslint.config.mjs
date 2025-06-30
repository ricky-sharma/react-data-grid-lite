import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },
    {
        files: ["**/*.test.{js,jsx}", "**/__tests__/**/*.{js,jsx}"],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
        rules: {
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },
    {
        files: ["**/*.{jsx,tsx}"],
        plugins: { react: pluginReact },
        ...pluginReact.configs.flat.recommended,
        settings: {
            react: {
                version: "detect",
            },
        },
    },
]);
