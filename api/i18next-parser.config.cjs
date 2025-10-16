module.exports = {
  locales: ["en", "fr"],
  output: "src/app/common/i18n/$LOCALE.json",
  input: ["src/**/*.{js,ts,tsx}"],
  defaultNamespace: "translation",
  createOldCatalogs: false,
};
