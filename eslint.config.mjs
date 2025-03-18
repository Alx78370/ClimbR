import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default withNuxt().prepend(
  {
    name: "custom-eslint-config",
    files: ["**/*.js", "**/*.mjs", "**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/attribute-hyphenation": "off",
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "any", // ✅ Accepte <img> et <br> avec ou sans />
            normal: "never", // ✅ Pas de self-closing sur les balises normales
            component: "always", // ✅ Les composants Vue doivent être self-closing
          },
          svg: "always",
          math: "always",
        },
      ],
    },
  },
  eslintConfigPrettier,
);
