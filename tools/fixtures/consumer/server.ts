import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { readFile } from 'node:fs/promises';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const browserDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../browser');
const engine = new AngularNodeAppEngine();
const contentTypes: Record<string, string> = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

async function handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
  try {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
    if (pathname === '/favicon.ico') {
      response.writeHead(204).end();
      return;
    }
    if (extname(pathname)) {
      const path = resolve(browserDirectory, `.${decodeURIComponent(pathname)}`);
      if (!path.startsWith(browserDirectory + sep)) {
        response.writeHead(403).end();
        return;
      }
      response.setHeader('Content-Type', contentTypes[extname(path)] ?? 'application/octet-stream');
      response.end(await readFile(path));
      return;
    }
    const rendered = await engine.handle(request);
    if (rendered) await writeResponseToNodeResponse(rendered, response);
    else response.writeHead(404).end();
  } catch (error) {
    console.error(error);
    response.writeHead(500).end('SSR failed');
  }
}

export const reqHandler = createNodeRequestHandler(handle);

if (isMainModule(import.meta.url)) {
  const server = createServer(reqHandler);
  server.listen(0, '127.0.0.1', () => {
    const address = server.address();
    if (address && typeof address !== 'string')
      console.log(`CONSUMER_SSR_READY:http://127.0.0.1:${address.port}`);
  });
}
