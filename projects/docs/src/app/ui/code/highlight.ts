/**
 * Deterministic, dependency-free syntax tokenizer for documentation code samples.
 *
 * Runs identically on the server and in the browser, so highlighted markup is part of the SSR
 * response and hydration never rewrites it. Output is data (never HTML), which templates render
 * as text nodes inside spans.
 */

export type CodeLanguage = 'bash' | 'css' | 'html' | 'json' | 'text' | 'ts';
export type CodeTokenKind = 'attr' | 'com' | 'fn' | 'kw' | 'num' | 'str' | 'tag';

export interface CodeToken {
  readonly kind?: CodeTokenKind;
  readonly text: string;
}

type Rule = readonly [CodeTokenKind, RegExp];

const RULES: Readonly<Record<Exclude<CodeLanguage, 'html' | 'text'>, readonly Rule[]>> = {
  ts: [
    ['com', /\/\/.*|\/\*[\s\S]*?\*\//],
    ['str', /'[^'\n]*'|"[^"\n]*"|`[^`]*`/],
    ['fn', /@\w+/],
    [
      'kw',
      /\b(?:import|from|export|const|class|readonly|protected|private|public|return|new|true|false|type|interface|extends|async|await|this|let|void)\b/,
    ],
    ['fn', /\b[a-zA-Z_]\w*(?=\()/],
    ['attr', /\b[A-Z]\w*\b/],
    ['num', /\b\d+(?:\.\d+)?\b/],
  ],
  css: [
    ['com', /\/\*[\s\S]*?\*\//],
    ['kw', /@[\w-]+/],
    ['str', /'[^']*'|"[^"]*"/],
    ['attr', /--?[a-zA-Z][\w-]*(?=\s*:)/],
    ['fn', /\b[\w-]+(?=\()/],
    ['num', /-?\d*\.?\d+(?:rem|px|%|em)?\b/],
  ],
  bash: [
    ['com', /#.*/],
    ['str', /'[^']*'|"[^"]*"/],
    ['kw', /^\s*[\w@./-]+/m],
    ['attr', /\s--?[\w-]+/],
  ],
  json: [
    ['attr', /"[^"]*"(?=\s*:)/],
    ['str', /"[^"]*"/],
    ['num', /\b\d+\b/],
  ],
};

const compiled = new Map<string, RegExp>();

function lex(source: string, rules: readonly Rule[], key: string): CodeToken[] {
  let pattern = compiled.get(key);
  if (!pattern) {
    pattern = new RegExp(rules.map(([, rule]) => `(${rule.source})`).join('|'), 'gm');
    compiled.set(key, pattern);
  }
  pattern.lastIndex = 0;

  const tokens: CodeToken[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source))) {
    if (match[0] === '') {
      pattern.lastIndex++;
      continue;
    }
    const group = match.slice(1).findIndex(value => value !== undefined);
    if (match.index > last) tokens.push({ text: source.slice(last, match.index) });
    tokens.push({ kind: rules[group]?.[0], text: match[0] });
    last = pattern.lastIndex;
  }

  if (last < source.length) tokens.push({ text: source.slice(last) });
  return tokens;
}

function lexHtml(source: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let index = 0;
  let inTag = false;

  const push = (text: string, kind?: CodeTokenKind): void => {
    const previous = tokens.at(-1);
    if (kind === undefined && previous && previous.kind === undefined) {
      tokens[tokens.length - 1] = { text: previous.text + text };
    } else {
      tokens.push(kind === undefined ? { text } : { kind, text });
    }
  };

  while (index < source.length) {
    const rest = source.slice(index);
    let match: RegExpMatchArray | null;
    let text: string;

    if (!inTag) {
      if ((match = rest.match(/^<!--[\s\S]*?-->/))) push((text = match[0]), 'com');
      else if ((match = rest.match(/^<\/?[\w-]+/))) {
        push((text = match[0]), 'tag');
        inTag = true;
      } else if ((match = rest.match(/^@(?:if|else|for|switch|case|defer)\b/))) {
        push((text = match[0]), 'kw');
      } else push((text = rest[0] ?? ''));
    } else if ((match = rest.match(/^\/?>/))) {
      push((text = match[0]), 'tag');
      inTag = false;
    } else if ((match = rest.match(/^"[^"]*"/))) push((text = match[0]), 'str');
    else if ((match = rest.match(/^[^\s=>"/]+/))) push((text = match[0]), 'attr');
    else push((text = rest[0] ?? ''));

    index += text.length || 1;
  }

  return tokens;
}

/** Splits `source` into highlighted tokens. Concatenating every token's text returns `source`. */
export function highlight(source: string, language: CodeLanguage): readonly CodeToken[] {
  if (language === 'text' || source === '') return [{ text: source }];
  if (language === 'html') return lexHtml(source);
  return lex(source, RULES[language], language);
}
