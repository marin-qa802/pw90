// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './global-setup.js',

  fullyParallel: false,
  workers: 1,

  use: {
    baseURL: 'https://apichallenges.com',

    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },

  reporter: [['html'], ['list']],
});
