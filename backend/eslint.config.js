import js from "@eslint/js";
import globals from "globals";
import babelParser from "@babel/eslint-parser";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      globals: globals.node,
      parser: babelParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        requireConfigFile: false
      }
    },
    plugins: {}, 
    rules: {
      "semi": ["error", "always"],  // Requiere punto y coma
      "quotes": ["error", "double"], // Usa comillas dobles
      "no-console": "warn", // Evita console.log en producción
      "eqeqeq": ["error", "always"], // Obliga a usar === en vez de ==
      "curly": ["error", "all"], // Requiere llaves en estructuras de control
      "no-unused-vars": ["warn"], // Advierte sobre variables sin usar
      "strict": ["error", "global"] // Usa modo estricto en todo el código
    }
  },
  js.configs.recommended // Aplica reglas recomendadas de ESLint
];
