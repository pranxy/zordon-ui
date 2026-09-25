import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { declarations, mirroredInputs, sourceFiles } from './check-native-attribute-inputs.mjs';

/**
 * Some directives are layered onto an element that another library directive already owns:
 * `<button zdButton zdTooltip>`, `<button zdButton zdSwap>`, `<input zdTextInput zdValidator>`.
 * Angular binds an attribute to every directive on the element that declares it, so a shared name
 * binds twice: `color="primary"` would colour the button and the tooltip. A layered directive's
 * inputs and outputs therefore must not reuse a name that another library directive able to share
 * its element declares. Prefix them with the directive's own name (`tooltipColor`, `swapActive`).
 *
 * See docs/contributing/api-review.md.
 */

/** Directives meant to be added to an element another directive owns. Key: class name. */
export const layeredDirectives = new Map([
  ['ZdTooltip', 'describes any control: buttons, links, badges, triggers'],
  ['ZdSwap', 'turns a styled button into an on/off toggle'],
  ['ZdIndicatorItem', 'places a badge or button in an indicator corner'],
  ['ZdJoinItem', 'joins buttons, inputs and selects'],
  ['ZdValidator', 'adds validity styling to styled text inputs, textareas and selects'],
  ['ZdTheme', 'scopes a theme on any element'],
  ['ZdThemeController', 'switches themes from any control'],
  ['ZdThemeButton', 'switches themes from a styled button'],
  ['ZdThemeRadio', 'switches themes from a styled radio'],
  ['ZdThemeToggle', 'switches themes from a styled toggle or checkbox'],
  ['ZdThemeSelect', 'switches themes from a styled select'],
  ['ZdSkeletonRegion', 'marks any region busy'],
  ['ZdDropdownTrigger', 'opens a dropdown from a styled button'],
  ['ZdDropdownItem', 'makes a styled button a menu item'],
  ['ZdFabAction', 'makes a styled button a speed-dial action'],
  ['ZdNavbarToggle', 'opens navbar content from a styled button'],
  ['ZdAccordionTrigger', 'opens an accordion panel from a styled button'],
  ['ZdSwapInput', 'drives a swap from a styled checkbox'],
]);

/**
 * Pairs that could share an element by selector but never do, or whose shared name means the same
 * thing on both. Key: `ClassA.name|ClassB.name`, in either order.
 */
export const sharedNames = new Map([
  [
    'ZdAccordionTrigger.expanded|ZdNavbarToggle.expanded',
    'an accordion trigger and a navbar toggle are never the same button',
  ],
]);

function parts(selector) {
  return selector.split(',').map(part => {
    const trimmed = part.trim();
    return {
      element: /^([a-z][a-z0-9-]*)/.exec(trimmed)?.[1],
      type: /\[type=["']?([a-z-]+)["']?\]/.exec(trimmed)?.[1],
    };
  });
}

function compatible(a, b) {
  if ((a.element === 'ng-template') !== (b.element === 'ng-template')) return false;
  if (a.element && b.element && a.element !== b.element) return false;
  if (a.type && b.type && a.type !== b.type) return false;
  return true;
}

/** True when some element can match both selectors. */
export function canShareHost(first, second) {
  if (first.component && second.component) return false;
  return parts(first.selector).some(a => parts(second.selector).some(b => compatible(a, b)));
}

function names(declaration) {
  return [
    ...declaration.inputs.map(name => ({ name, kind: 'input' })),
    ...declaration.outputs.map(name => ({ name, kind: 'output' })),
  ];
}

function exempt(first, second, name, allowed) {
  // A deliberate mirror of the native attribute means the same thing to every directive on it.
  if (mirroredInputs.has(`${first}.${name}`)) return true;
  return (
    allowed.has(`${first}.${name}|${second}.${name}`) ||
    allowed.has(`${second}.${name}|${first}.${name}`)
  );
}

/**
 * Human-readable collisions between each layered directive and every other declaration that can
 * share its element. Each entry of `all` is `{ fileName, className, selector, inputs, outputs,
 * component }`.
 */
export function sharedHostCollisions(all, layered = layeredDirectives, allowed = sharedNames) {
  const problems = [];
  for (const own of all.filter(declaration => layered.has(declaration.className))) {
    for (const other of all) {
      if (other === own || !canShareHost(own, other)) continue;
      const theirs = new Set(names(other).map(entry => entry.name));
      for (const { name, kind } of names(own)) {
        if (!theirs.has(name) || exempt(own.className, other.className, name, allowed)) continue;
        problems.push(
          `${own.fileName}: ${own.className} ${kind} "${name}" also binds to ${other.className} (${other.selector})`,
        );
      }
    }
  }
  return problems;
}

export async function checkLibrary(root) {
  const library = resolve(root, 'projects/components');
  const files = await sourceFiles(library);
  const all = [];
  for (const path of files) {
    const fileName = relative(root, path);
    // Published entry points only: `<entry>/src/`. Internal (non-`Zd`) directives are not public.
    if (!/[\\/]src[\\/]/.test(fileName)) continue;
    for (const declaration of declarations(fileName, await readFile(path, 'utf8')))
      if (declaration.className.startsWith('Zd')) all.push({ fileName, ...declaration });
  }
  return { declarations: all.length, problems: sharedHostCollisions(all) };
}

async function main() {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const { declarations: count, problems } = await checkLibrary(root);
  if (problems.length > 0) {
    throw new Error(`Layered directives share input or output names:\n- ${problems.join('\n- ')}`);
  }
  console.log(`No layered directive shares a binding name with its host (${count} declarations).`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
