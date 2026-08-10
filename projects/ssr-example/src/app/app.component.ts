import { ChangeDetectionStrategy, Component, afterNextRender, signal } from '@angular/core';

@Component({
  selector: 'ssr-example-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-testid': 'ssr-example',
  },
  template: `
    <main>
      <p class="eyebrow">Compatibility fixture</p>
      <h1>Zordon UI SSR and hydration example</h1>
      <p data-testid="server-content">
        This content is rendered on the server before the browser application starts.
      </p>

      <section aria-labelledby="hydrated-interaction-heading">
        <h2 id="hydrated-interaction-heading">Hydrated interaction</h2>
        <p id="counter-description">
          The initial value is identical on the server and client. The button becomes interactive
          after hydration.
        </p>
        <button
          aria-describedby="counter-description"
          data-testid="increment"
          type="button"
          (click)="increment()"
        >
          Increment hydrated counter
        </button>
        <output aria-live="polite" data-testid="counter">Hydrated count: {{ count() }}</output>
      </section>

      <p data-testid="hydration-state">
        Hydration status: {{ hydrationReady() ? 'ready' : 'server-rendered' }}
      </p>
    </main>
  `,
  styles: `
    :host {
      display: block;
      padding: 2rem;
    }

    main {
      max-width: 44rem;
      margin: 0 auto;
    }

    .eyebrow {
      margin-block-end: 0.25rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin-block: 0 1rem;
    }

    section {
      display: grid;
      gap: 1rem;
      margin-block: 2rem;
      padding: 1.5rem;
      border: 1px solid currentColor;
      border-radius: 0.75rem;
    }

    section > * {
      margin: 0;
    }

    button {
      width: fit-content;
      padding: 0.75rem 1rem;
      border: 2px solid currentColor;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    button:focus-visible {
      outline: 3px solid Highlight;
      outline-offset: 3px;
    }

    output {
      font-weight: 700;
    }
  `,
})
export class SsrExampleAppComponent {
  protected readonly count = signal(0);
  protected readonly hydrationReady = signal(false);

  constructor() {
    afterNextRender(() => this.hydrationReady.set(true));
  }

  protected increment(): void {
    this.count.update(value => value + 1);
  }
}
