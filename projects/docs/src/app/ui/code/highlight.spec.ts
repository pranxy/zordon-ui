import { highlight, type CodeLanguage } from './highlight';

const samples: Readonly<Record<CodeLanguage, string>> = {
  ts: `import { ZdButton } from '@pranxy/zordon-ui/button';\n// comment\nconst size = 2;`,
  html: `<!-- note -->\n<button zdButton color="primary">@if (saved()) { Saved }</button>`,
  css: `/* c */\n@plugin "daisyui" {\n  --size: 2rem;\n}`,
  bash: `npm install @pranxy/zordon-ui --save # comment`,
  json: `{ "plugins": { "@tailwindcss/postcss": {} }, "n": 1 }`,
  text: `<plain> text`,
};

describe('highlight', () => {
  for (const [language, source] of Object.entries(samples) as [CodeLanguage, string][]) {
    it(`preserves every character for ${language}`, () => {
      expect(
        highlight(source, language)
          .map(token => token.text)
          .join(''),
      ).toBe(source);
    });
  }

  it('classifies TypeScript keywords, strings, comments and numbers', () => {
    const tokens = highlight(samples.ts, 'ts');
    expect(tokens).toContainEqual({ kind: 'kw', text: 'import' });
    expect(tokens).toContainEqual({ kind: 'str', text: "'@pranxy/zordon-ui/button'" });
    expect(tokens).toContainEqual({ kind: 'com', text: '// comment' });
    expect(tokens).toContainEqual({ kind: 'num', text: '2' });
  });

  it('classifies HTML tags, attributes, values and Angular control flow', () => {
    const tokens = highlight(samples.html, 'html');
    expect(tokens).toContainEqual({ kind: 'com', text: '<!-- note -->' });
    expect(tokens).toContainEqual({ kind: 'tag', text: '<button' });
    expect(tokens).toContainEqual({ kind: 'attr', text: 'zdButton' });
    expect(tokens).toContainEqual({ kind: 'str', text: '"primary"' });
    expect(tokens).toContainEqual({ kind: 'kw', text: '@if' });
  });

  it('returns data, never markup, so text is escaped by the template', () => {
    const tokens = highlight('<script>alert(1)</script>', 'text');
    expect(tokens).toEqual([{ text: '<script>alert(1)</script>' }]);
  });

  it('is deterministic across calls (server and client agree)', () => {
    expect(highlight(samples.css, 'css')).toEqual(highlight(samples.css, 'css'));
  });
});
