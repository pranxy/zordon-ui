import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env['PLAYWRIGHT_DOCS_BASE_URL'] ?? 'http://127.0.0.1:4310';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/docs-ssr-foundation.spec.ts',
  outputDir: 'test-results/playwright-docs',
  fullyParallel: false,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: process.env['CI']
    ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-docs-report' }]]
    : [['list']],
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'docs-ssr-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'node dist/docs/server/server.mjs',
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    timeout: 30_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
