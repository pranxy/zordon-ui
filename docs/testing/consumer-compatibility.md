# Packaged Angular consumer compatibility

The consumer gate installs the built npm tarball in a fresh operating-system temporary
directory outside the repository. It cannot resolve the library through workspace source paths
or reuse the workspace's Angular installation. No package is published.

## Run the gate

Use Node 24.15.0 or later within major 24, install the repository dependencies, and run:

```sh
npm run build:lib
npx playwright install chromium
npm run test:consumer -- minimum
npm run test:consumer -- baseline
npm run test:consumer -- latest
npm run test:consumer -- minimum --ssr
npm run test:consumer -- baseline --ssr
npm run test:consumer -- latest --ssr
```

On Linux, use `npx playwright install --with-deps chromium` to install browser system dependencies.
The root npm script supplies the npm executable used by the isolated install. The consumer
runner needs registry access and never uses `--force` or `--legacy-peer-deps`.

| Lane     | Angular framework/compiler | CLI/build | TypeScript |
| -------- | -------------------------- | --------- | ---------- |
| minimum  | 21.0.0                     | 21.0.0    | 5.9.3      |
| baseline | 21.2.19                    | 21.2.20   | 5.9.3      |
| latest   | 22.1.7                     | 22.1.8    | 6.0.3      |

These are exact, reviewed versions in `tools/consumer-compatibility.mjs`, not moving npm tags.
Review the lanes when the supported framework range or Aria pin changes. Aria **21.2.14**
requires CDK **21.2.14** and permits Angular core 21 or 22; both remain pinned as a pair in
every consumer. This does not test Aria/CDK 22. The repository continues to build with Angular 21.

Angular's [version compatibility table](https://angular.dev/reference/versions) defines the
Node/TypeScript requirements. Its [library compatibility guidance](https://angular.dev/tools/libraries/creating-libraries)
recommends a consuming framework at least as new as the library build version. The exact
21.0.0 consumer lane explicitly checks the declared floor against today's 21.2.19-built tarball;
that result must be re-established after library changes and does not prove every intervening patch.

## Assertions and evidence

Each lane:

- Packs `dist/components` and installs that tarball with `--strict-peer-deps`.
- Runs `npm ls --all` and records the resolved tree, lockfile and tarball integrity.
- Imports every typed export, including the internal overlay bridge, with `skipLibCheck: false`
  and strict Angular template checking. The generated namespace probe keeps their runtime exports
  reachable. CSS assets and package metadata are excluded from this typed-export count.
- Builds development and production applications in both explicit zone and zoneless modes.
- Serves each build on an ephemeral loopback port and runs Chromium checks for bootstrap,
  expected Zone presence/absence, Button signal updates, native Forms model updates, and controlled
  Aria-backed Tabs keyboard selection and panel rendering. Browser errors fail the run.

With `--ssr`, each lane instead builds production server applications in both zone modes,
using matching framework/server and CLI/SSR versions. A separate Node process serves each build
on an ephemeral loopback port. The checks require meaningful server HTML and no-JavaScript
content, identical IDs and resolved accessible relationships across requests, and reuse of the
original button, input, tab and panel nodes during hydration. Browser scripts are held until
the original nodes are captured, then released before checking live interactions. Browser and
server errors fail the run. Servers and browser contexts close on success or failure.

The fixture intentionally has no consumer theme pipeline. These are package/compiler/runtime
smoke checks, not a replacement for styling, all-component interactions, incremental hydration, accessibility,
or tree-shaking budgets. The **68 typed exports** include the root and internal entry; they are
not the **68 catalog components**.

Reports and command output are retained under `tmp/consumer-compatibility/<lane>/`. Runs
with `--ssr` use `tmp/consumer-ssr/<lane>/`, including server HTML and relationship evidence.
Every run creates a fresh isolated workspace; its path is printed and retained for diagnosis. Dependency
resolution uses exact direct pins but current compatible transitives, captured in the report
lockfile. A later run can expose a transitive regression.

The `Angular consumer compatibility` workflow runs the three lanes independently on Ubuntu for
pull requests, pushes to master, and manual dispatch. It builds the package on Angular 21 first,
uses Node 24.15.0, and uploads evidence even when a lane fails. Adding the workflow is not proof
of a successful hosted run. The [run for commit c1d050f](https://github.com/pranxy/zordon-ui/actions/runs/35539741448)
passed all three lanes, including both CSR and SSR steps and artifact uploads. See the
[hosted evidence and limits](../plans/phase-8-consumer-compatibility-progress.md#hosted-verification).
The [Linux follow-up](../plans/phase-8-browser-audit-progress.md#linux-verification-follow-up)
also verifies the three lanes locally on Ubuntu 26.04 and records its isolated dependency setup.
The [Linux SSR follow-up](../plans/phase-8-consumer-compatibility-progress.md#linux-ssr-verification)
verifies all six production SSR/hydration combinations on Ubuntu 26.04 x64 under WSL2 with
Node 24.15.0 and native Chromium. It uses an archived committed source tree, fresh native
dependencies and locally extracted browser libraries; it does not certify the hosted runner's
system-dependency installation or physical browser products.
