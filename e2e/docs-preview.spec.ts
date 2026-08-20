import { spawn, type ChildProcess } from 'node:child_process';
import { expect, test } from '@playwright/test';

const previewBaseUrl = 'http://127.0.0.1:4311';
let previewServer: ChildProcess | undefined;

async function waitUntilReady(): Promise<void> {
  await expect
    .poll(
      async () => {
        try {
          return (await fetch(previewBaseUrl)).status;
        } catch {
          return 0;
        }
      },
      { timeout: 10_000 },
    )
    .toBe(200);
}

test.beforeAll(async () => {
  previewServer = spawn(process.execPath, ['dist/docs/server/server.mjs'], {
    cwd: process.cwd(),
    env: { ...process.env, DOCS_CANONICAL_ORIGIN: '', PORT: '4311' },
    stdio: 'ignore',
  });
  await waitUntilReady();
});

test.afterAll(() => {
  previewServer?.kill();
});

test('preview responses remain noindex and omit canonical structured data without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    for (const path of ['/', '/components/button']) {
      await page.goto(`${previewBaseUrl}${path}`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex,nofollow',
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
      await expect(page.locator('script#docs-structured-data')).toHaveCount(0);
    }
  } finally {
    await context.close();
  }
});
