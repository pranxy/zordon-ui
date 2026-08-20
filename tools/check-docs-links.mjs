import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

export function sitemapPaths(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
}

export function internalLinks(html, pageUrl) {
  const origin = new URL(pageUrl).origin;
  const links = new Set();

  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    const href = decodeHtml(match[1]);
    if (/^(?:mailto:|tel:|javascript:)/i.test(href)) continue;
    const target = new URL(href, pageUrl);
    if (target.origin === origin) links.add(`${target.pathname}${target.search}${target.hash}`);
  }

  return [...links];
}

function documentIds(html) {
  return new Set(
    [...html.matchAll(/\b(?:id|name)=["']([^"']+)["']/gi)].map(match => decodeHtml(match[1])),
  );
}

async function waitUntilReady(baseUrl, timeoutMilliseconds = 10_000) {
  const deadline = Date.now() + timeoutMilliseconds;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.status < 500) return;
    } catch {}
    await new Promise(resolvePromise => setTimeout(resolvePromise, 100));
  }
  throw new Error(`Documentation server did not become ready at ${baseUrl}.`);
}

async function startServer(baseUrl) {
  try {
    await waitUntilReady(baseUrl, 250);
    return undefined;
  } catch {}

  const url = new URL(baseUrl);
  const server = spawn(process.execPath, ['dist/docs/server/server.mjs'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      DOCS_CANONICAL_ORIGIN: 'https://docs.example.test',
      PORT: url.port || '80',
    },
    stdio: 'inherit',
  });
  await waitUntilReady(baseUrl);
  return server;
}

export async function checkDocsLinks({ baseUrl = 'http://127.0.0.1:4310' } = {}) {
  const sitemapResponse = await fetch(new URL('/sitemap.xml', baseUrl));
  if (!sitemapResponse.ok) throw new Error(`Sitemap returned HTTP ${sitemapResponse.status}.`);
  const routes = sitemapPaths(await sitemapResponse.text());
  const documents = new Map();
  const failures = [];

  async function getDocument(path) {
    const url = new URL(path, baseUrl);
    const key = `${url.pathname}${url.search}`;
    if (!documents.has(key)) {
      const response = await fetch(url);
      documents.set(key, { html: await response.text(), status: response.status });
    }
    return documents.get(key);
  }

  for (const route of routes) {
    const source = await getDocument(route);
    if (source.status >= 400) {
      failures.push(`${route} returned HTTP ${source.status}.`);
      continue;
    }

    for (const link of internalLinks(source.html, new URL(route, baseUrl))) {
      const targetUrl = new URL(link, baseUrl);
      const target = await getDocument(`${targetUrl.pathname}${targetUrl.search}`);
      if (target.status >= 400) {
        failures.push(`${route} links to ${link}, which returned HTTP ${target.status}.`);
      } else if (targetUrl.hash) {
        const id = decodeURIComponent(targetUrl.hash.slice(1));
        if (!documentIds(target.html).has(id)) {
          failures.push(`${route} links to missing fragment ${link}.`);
        }
      }
    }
  }

  return { checkedDocuments: documents.size, failures, routes };
}

async function main() {
  const baseUrl = process.env['DOCS_CHECK_BASE_URL'] ?? 'http://127.0.0.1:4310';
  const server = await startServer(baseUrl);
  try {
    const result = await checkDocsLinks({ baseUrl });
    if (result.failures.length > 0) {
      throw new Error(`Documentation link check failed:\n- ${result.failures.join('\n- ')}`);
    }
    console.log(
      `Documentation link check passed for ${result.routes.length} sitemap routes and ${result.checkedDocuments} documents.`,
    );
  } finally {
    server?.kill();
  }
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && currentFile === resolve(process.argv[1])) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
