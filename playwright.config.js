// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './global-setup.js', // <-- Добавляем эту строку
  use: {
    baseURL: 'https://apichallenges.eviltester.com',
  
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
  reporter: [['html'], ['list']],
});