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
            "no-unused-vars": "off",
            "react/prop-types": "off",
            "react/display-name": "off",
            "no-prototype-builtins": "off"
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
            "no-unused-vars": "off",
            "react/prop-types": "off",
            "react/display-name": "off",
            "no-prototype-builtins": "off"
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
        rules: {
            "no-unused-vars": "off",
            "react/prop-types": "off",
            "react/display-name": "off",
            "no-prototype-builtins": "off"
        },
    },
]);
