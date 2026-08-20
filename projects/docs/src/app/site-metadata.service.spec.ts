import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DocsMetadataService } from './site-metadata.service';
import { DOCS_CANONICAL_ORIGIN } from './site-origin';

describe('DocsMetadataService', () => {
  afterEach(() => {
    document.head.querySelector("link[rel='canonical']")?.remove();
    document.head.querySelector("meta[property='og:url']")?.remove();
    TestBed.resetTestingModule();
  });

  it('keeps an indexable page out of search results when no canonical origin is configured', () => {
    const meta = configureMetadataService(undefined);

    expect(meta.getTag("name='robots'")?.content).toBe('noindex,nofollow');
    expect(document.head.querySelector("link[rel='canonical']")).toBeNull();
    expect(meta.getTag("property='og:url'")).toBeNull();
  });

  it('publishes indexable metadata with an absolute canonical URL for a valid origin', () => {
    const meta = configureMetadataService('https://docs.example.test');

    expect(meta.getTag("name='robots'")?.content).toBe('index,follow');
    expect(document.head.querySelector("link[rel='canonical']")?.getAttribute('href')).toBe(
      'https://docs.example.test/',
    );
    expect(meta.getTag("property='og:url'")?.content).toBe('https://docs.example.test/');
  });
});

function configureMetadataService(origin: string | undefined): Meta {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: DOCS_CANONICAL_ORIGIN, useValue: origin },
      DocsMetadataService,
    ],
  });

  TestBed.inject(DocsMetadataService).initialize();
  return TestBed.inject(Meta);
}
