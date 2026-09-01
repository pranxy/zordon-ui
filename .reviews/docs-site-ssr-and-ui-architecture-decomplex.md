# Decomplex review: documentation site SSR and UI architecture

## Overall status

One complexity risk is admitted: adding a separate content platform or generic documentation CMS before there is a proven authoring need. The plan retains Angular routes and a small build-time content catalogue instead.

## Review contract

| Axis                          | Selection                                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Mode                          | Prevention                                                                                                                    |
| Target                        | Proposed SSR documentation site and information architecture                                                                  |
| Authority / required behavior | User requires an SSR, Google-indexable development/documentation site and an organized whole-site UI                          |
| Scope                         | Rendering model, information architecture, navigation, documentation authoring, and validation; no component-library API work |
| Report                        | `.reviews/docs-site-ssr-and-ui-architecture-decomplex.md`                                                                     |

## Coverage

### Inspected

- Current `projects/dev` application and its client-only build configuration.
- Existing Angular SSR example and repository deployment scripts.
- Accepted platform, SSR, accessibility, and styling ADRs.
- Angular's current hybrid-rendering and hydration guidance.

### Skipped or partial

- A hosting provider was not selected by the user; provider-specific configuration is intentionally deferred.
- No content volume or contributor workflow was supplied, so no CMS evaluation was performed.

## Potential findings

### DEX-001 — Avoid a documentation CMS or runtime Markdown system in v1

- **Evidence:** Supported
- **Recommendation:** Act
- **Surface and location / authority:** Proposed documentation authoring architecture; the repository already holds reviewed Markdown and Angular applications, while the user asked for a development site rather than multi-user publishing.
- **Current-need evidence:** No external authors, remote content, editorial workflow, or dynamic content requirement is known.
- **Added burden:** A CMS or runtime Markdown renderer introduces deployment, parsing/sanitization, caching, and authoring state that does not improve the first public component catalogue.
- **Reachable practical impact:** It would complicate SSR determinism, content review, and the initial hosting choice.
- **Smallest simpler alternative:** Use typed route metadata plus build-time imported/static content and dedicated Angular templates for pages that need live examples.
- **Exception / boundary check:** Revisit only if documentation needs remote editorial publishing, versioned multi-release content, or a volume that makes build-time authoring materially impractical.
- **Required behavior and simplification risk:** The alternative still produces complete server HTML, stable URLs, navigation, and interactive examples after hydration.
- **Bounded next step or user question:** Keep the authoring boundary in the implementation plan and reassess after the first 10 component pages.
- **Acceptance signal:** No runtime Markdown parser, CMS SDK, or new documentation platform dependency is added in the initial site implementation.

## Confirmed proportionate areas

- A shared application shell is justified because it owns global navigation, skip links, search trigger, theme control, and responsive navigation behavior.
- A route metadata catalogue is justified because it is the one source for navigation, breadcrumbs, previous/next links, sitemap routes, and page metadata.
- Server rendering plus hydration is justified because public documentation must have crawlable initial HTML while examples remain interactive.

## Limitations

- This is a complexity review, not an accessibility, SEO, or implementation correctness review.
