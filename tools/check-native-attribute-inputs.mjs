import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

/**
 * Library inputs must not reuse the name of a global HTML attribute, or of an attribute that is
 * native to the element their selector targets. A reused name silently takes the attribute over:
 * `style="color: red"` stops compiling under strict templates, and `size="4"` on a select no
 * longer sets its visible rows. Rename descriptively, or prefix with `zd` (as `zdDisabled` and
 * `zdSize` do) when no better name exists.
 *
 * See docs/contributing/api-review.md.
 */

export const globalAttributes = new Set([
  'accesskey',
  'autocapitalize',
  'autofocus',
  'class',
  'contenteditable',
  'dir',
  'draggable',
  'enterkeyhint',
  'exportparts',
  'hidden',
  'id',
  'inert',
  'inputmode',
  'is',
  'lang',
  'nonce',
  'part',
  'popover',
  'role',
  'slot',
  'spellcheck',
  'style',
  'tabindex',
  'title',
  'translate',
]);

/** Attributes with an effect on each element. Input attributes are refined by type below. */
export const elementAttributes = {
  a: ['download', 'href', 'hreflang', 'ping', 'referrerpolicy', 'rel', 'target', 'type'],
  button: ['disabled', 'form', 'formaction', 'name', 'popovertarget', 'type', 'value'],
  details: ['name', 'open'],
  dialog: ['open'],
  fieldset: ['disabled', 'form', 'name'],
  img: ['alt', 'height', 'loading', 'sizes', 'src', 'srcset', 'width'],
  input: [
    'accept',
    'alt',
    'autocomplete',
    'checked',
    'disabled',
    'form',
    'height',
    'list',
    'max',
    'maxlength',
    'min',
    'minlength',
    'multiple',
    'name',
    'pattern',
    'placeholder',
    'readonly',
    'required',
    'size',
    'src',
    'step',
    'type',
    'value',
    'width',
  ],
  label: ['for', 'form'],
  li: ['value'],
  meter: ['high', 'low', 'max', 'min', 'optimum', 'value'],
  ol: ['reversed', 'start', 'type'],
  option: ['disabled', 'label', 'selected', 'value'],
  output: ['for', 'form', 'name'],
  progress: ['max', 'value'],
  select: ['autocomplete', 'disabled', 'form', 'multiple', 'name', 'required', 'size'],
  textarea: [
    'autocomplete',
    'cols',
    'disabled',
    'form',
    'maxlength',
    'minlength',
    'name',
    'placeholder',
    'readonly',
    'required',
    'rows',
    'wrap',
  ],
};

/** `size` only affects text-like inputs; on other types the attribute is inert. */
const sizedInputTypes = new Set(['email', 'password', 'search', 'tel', 'text', 'url']);

/**
 * Inputs that deliberately mirror the native attribute of the same name, so reusing it keeps the
 * platform meaning. Key: `Class.input`.
 */
export const mirroredInputs = new Map([
  ['ZdAccordionTrigger.id', 'Angular Aria applies it as the host id'],
  ['ZdAccordionTrigger.disabled', 'Angular Aria disables the trigger'],
  ['ZdAccordionPanel.id', 'Angular Aria applies it as the host id'],
  ['ZdDropdownMenu.id', 'Angular Aria applies it as the host id'],
  ['ZdDropdownItem.value', 'the item value, as for a native button'],
  ['ZdDropdownItem.disabled', 'Angular Aria disables the item'],
  ['ZdNavbarToggle.disabled', 'bound back to the native disabled property'],
]);

/** Host elements, and the input type where the selector names one, for each selector part. */
export function selectorHosts(selector) {
  return selector.split(',').map(part => {
    const trimmed = part.trim();
    const element = /^([a-z][a-z0-9-]*)/.exec(trimmed)?.[1];
    const type = /\[type=["']?([a-z-]+)["']?\]/.exec(trimmed)?.[1];
    return { element, type };
  });
}

function nativeTo(name, { element, type }) {
  if (!element) return false;
  const attributes = elementAttributes[element];
  if (!attributes?.includes(name)) return false;
  if (element === 'input' && name === 'size' && type && !sizedInputTypes.has(type)) return false;
  return true;
}

function literalText(node) {
  return ts.isStringLiteralLike(node) ? node.text : undefined;
}

/** Each decorated class in a source file with its selector and public input names. */
export function declarations(fileName, source) {
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true);
  const found = [];
  file.forEachChild(node => {
    if (!ts.isClassDeclaration(node) || !node.name) return;
    const decorator = ts
      .getDecorators(node)
      ?.find(
        item =>
          ts.isCallExpression(item.expression) &&
          ['Component', 'Directive'].includes(item.expression.expression.getText(file)),
      );
    const metadata = decorator?.expression.arguments[0];
    if (!metadata || !ts.isObjectLiteralExpression(metadata)) return;

    let selector = '';
    const inputs = [];
    const outputs = [];
    const component = decorator.expression.expression.getText(file) === 'Component';
    for (const property of metadata.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const key = property.name.getText(file);
      if (key === 'selector') selector = literalText(property.initializer) ?? '';
      if (key === 'hostDirectives' && ts.isArrayLiteralExpression(property.initializer)) {
        for (const hostDirective of property.initializer.elements) {
          if (!ts.isObjectLiteralExpression(hostDirective)) continue;
          for (const option of hostDirective.properties) {
            if (
              ts.isPropertyAssignment(option) &&
              option.name.getText(file) === 'inputs' &&
              ts.isArrayLiteralExpression(option.initializer)
            ) {
              for (const entry of option.initializer.elements) {
                const text = literalText(entry);
                if (text) inputs.push(text.split(':').pop().trim());
              }
            }
          }
        }
      }
    }

    for (const member of node.members) {
      if (!ts.isPropertyDeclaration(member) || !member.initializer) continue;
      const initializer = member.initializer.getText(file);
      const alias = /alias:\s*['"]([^'"]+)['"]/.exec(initializer)?.[1];
      const name = alias ?? member.name.getText(file);
      if (/^output\s*[<(]/.test(initializer)) outputs.push(name);
      if (!/^(input|model)(\.required)?\s*[<(]/.test(initializer)) continue;
      inputs.push(name);
      if (initializer.startsWith('model')) outputs.push(`${name}Change`);
    }

    if (selector) found.push({ className: node.name.text, selector, inputs, outputs, component });
  });
  return found;
}

/** Human-readable collisions for one source file. */
export function nativeAttributeCollisions(fileName, source, mirrored = mirroredInputs) {
  const problems = [];
  for (const { className, selector, inputs } of declarations(fileName, source)) {
    const hosts = selectorHosts(selector);
    for (const input of inputs) {
      if (mirrored.has(`${className}.${input}`)) continue;
      const owners = [];
      if (globalAttributes.has(input)) owners.push('every element');
      for (const host of hosts) {
        if (nativeTo(input, host))
          owners.push(`<${host.element}${host.type ? ` type="${host.type}"` : ''}>`);
      }
      if (owners.length > 0) {
        problems.push(
          `${fileName}: ${className} input "${input}" is a native attribute of ${[...new Set(owners)].join(', ')}`,
        );
      }
    }
  }
  return problems;
}

export async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'type-tests')
        files.push(...(await sourceFiles(path)));
    } else if (
      entry.name.endsWith('.ts') &&
      !entry.name.endsWith('.spec.ts') &&
      !entry.name.endsWith('.d.ts')
    ) {
      files.push(path);
    }
  }
  return files;
}

export async function checkLibrary(root) {
  const library = resolve(root, 'projects/components');
  const problems = [];
  const files = await sourceFiles(library);
  for (const path of files) {
    problems.push(...nativeAttributeCollisions(relative(root, path), await readFile(path, 'utf8')));
  }
  return { files: files.length, problems };
}

async function main() {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const { files, problems } = await checkLibrary(root);
  if (problems.length > 0) {
    throw new Error(`Inputs reuse native attribute names:\n- ${problems.join('\n- ')}`);
  }
  console.log(`No library input reuses a native attribute name (${files} files).`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
