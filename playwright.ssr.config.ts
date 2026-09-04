import { defineConfig, devices } from '@playwright/test';
import { resolve } from 'node:path';

const baseURL = process.env['PLAYWRIGHT_SSR_BASE_URL'] ?? 'http://127.0.0.1:4400';
const serverEntryPoint = resolve('dist/ssr-example/server/server.mjs');

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/ssr-hydration.spec.ts',
  outputDir: 'test-results/playwright-ssr',
  fullyParallel: false,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: process.env['CI']
    ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-ssr-report' }]]
    : [['list']],
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ssr-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `node ${serverEntryPoint}`,
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    timeout: 30_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
