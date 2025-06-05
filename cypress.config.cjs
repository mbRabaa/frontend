// cypress.config.cjs
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8081',
    defaultCommandTimeout: 40000,
    pageLoadTimeout: 60000,
    responseTimeout: 40000,
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalStudio: true
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
});
