import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Decorative thumbnail for a catalogue card. These are sketches, not live components: they
 * are hidden from assistive technology, cost no JavaScript, and keep the catalogue light.
 * Components without a sketch get a neutral placeholder with their name.
 */
@Component({
  selector: 'docs-component-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    @switch (id()) {
      @case ('button') {
        <span class="btn primary">Save changes</span><span class="btn outline">Cancel</span>
      }
      @case ('dropdown') {
        <div class="menu-sketch">
          <span class="btn outline sm">Theme ▾</span>
          <div class="list"><b>Light</b><span>Dark</span><span>System</span></div>
        </div>
      }
      @case ('modal') {
        <div class="scrim">
          <div class="dialog">
            <b>Delete branch?</b><small>This cannot be undone.</small
            ><span class="btn error xs">Delete</span>
          </div>
        </div>
      }
      @case ('avatar') {
        <div class="avatars">
          <span>AC</span><span>RM</span><span>JP</span><span class="more">+9</span>
        </div>
      }
      @case ('badge') {
        <div class="stack">
          <div>
            <span class="pill primary">primary</span><span class="pill outline">outline</span>
          </div>
          <div><span class="pill soft">success</span><span class="pill dash">error</span></div>
        </div>
      }
      @case ('card') {
        <div class="mini-card">
          <span class="media"></span><b>Launch report</b><small>Ready for the next window.</small
          ><span class="btn primary xs">View report</span>
        </div>
      }
      @case ('table') {
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Runs</th>
            </tr>
            <tr>
              <td>build</td>
              <td>412</td>
            </tr>
            <tr>
              <td>a11y</td>
              <td>97</td>
            </tr>
            <tr>
              <td>visual</td>
              <td>8</td>
            </tr>
          </tbody>
        </table>
      }
      @case ('timeline') {
        <div class="timeline">
          <span class="done"></span><i></i><span class="done"></span><i class="off"></i
          ><span></span>
        </div>
      }
      @case ('chat-bubble') {
        <div class="chat">
          <span class="them">Is the SSR fixture green?</span
          ><span class="me">Three scenarios pass.</span>
        </div>
      }
      @case ('stat') {
        <div class="stat">
          <small>Bundle, gzip</small><b>2.14 <em>KiB</em></b
          ><small class="ok">under budget</small>
        </div>
      }
      @case ('navbar') {
        <div class="navbar">
          <b><span class="logo">Z</span>App</b><small>Docs · API</small
          ><span class="dot error"></span>
        </div>
      }
      @case ('tabs') {
        <div class="tabs"><b>API</b><span>Examples</span><span>A11y</span></div>
      }
      @case ('breadcrumbs') {
        <small class="crumbs">Home / Components / <b>Button</b></small>
      }
      @case ('steps') {
        <div class="timeline">
          <span class="done">✓</span><i></i><span class="done">✓</span><i class="off"></i
          ><span>3</span><i class="off"></i><span>4</span>
        </div>
      }
      @case ('alert') {
        <span class="alert">ℹ Hydration replayed 2 events.</span>
      }
      @case ('progress') {
        <div class="stack wide">
          <span class="bar"><i class="w72"></i></span
          ><span class="bar muted"><i class="w35"></i></span><small>72% · coverage gate</small>
        </div>
      }
      @case ('toast') {
        <div class="toast">
          <span>Draft saved</span><span class="success">Release published</span>
        </div>
      }
      @case ('tooltip') {
        <div class="tooltip">
          <small>Copies the install command</small><span class="btn outline xs">Copy</span>
        </div>
      }
      @case ('checkbox') {
        <div class="checks">
          <span class="row"><i></i>Event replay</span
          ><span class="row"><i class="on"></i>Prefetch routes</span
          ><span class="row off"><i></i>Locked by policy</span>
        </div>
      }
      @case ('radio') {
        <div class="checks round">
          <span class="row"><i class="on"></i>Standard plan</span
          ><span class="row"><i></i>Team plan</span><span class="row"><i></i>Enterprise</span>
        </div>
      }
      @case ('range') {
        <div class="stack wide">
          <span class="range"><i class="w60"></i><b></b></span
          ><small class="ticks"><span>0</span><span>50</span><span>100</span></small>
        </div>
      }
      @case ('select') {
        <div class="stack">
          <small class="label">Theme scope</small><span class="select">Global ▾</span>
        </div>
      }
      @case ('rating') {
        <span class="rating">★★★★<span>★</span></span>
      }
      @case ('otp') {
        <div class="otp"><span>4</span><span>8</span><span class="focus">|</span><span></span></div>
      }
      @case ('divider') {
        <div class="divider"><i></i><small>OR</small><i></i></div>
      }
      @case ('hero') {
        <div class="hero">
          <b>Ship faster</b><small>Centered hero content</small
          ><span class="btn primary xs">Get started</span>
        </div>
      }
      @case ('drawer') {
        <div class="drawer">
          <div class="side"><i class="accent"></i><i></i><i></i></div>
          <div class="main"><i></i><i></i><i></i></div>
        </div>
      }
      @case ('stack') {
        <div class="stacked"><span></span><span></span><b>3 releases queued</b></div>
      }
      @case ('browser-mockup') {
        <div class="browser">
          <div class="chrome"><i></i><i></i><i></i><small>zordon.dev</small></div>
          <div class="page"></div>
        </div>
      }
      @case ('code-mockup') {
        <div class="terminal">
          <span>$ npm i &#64;pranxy/zordon-ui</span><span>$ ng build</span
          ><span class="ok">✓ built</span>
        </div>
      }
      @case ('phone-mockup') {
        <div class="phone"><div class="page"></div></div>
      }
      @default {
        <span class="placeholder">{{ name() }}</span>
      }
    }
  `,
  styles: `
    :host {
      --stripes: repeating-linear-gradient(
        -45deg,
        var(--docs-subtle) 0 4px,
        var(--docs-surface) 4px 8px
      );
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      min-block-size: 8.5rem;
      padding: 1rem;
      border-block-end: 1px solid var(--docs-border);
      background: var(--docs-surface-raised);
      color: var(--docs-text);
      font-size: 0.6875rem;
      pointer-events: none;
    }

    b {
      font-weight: var(--docs-weight-bold);
    }

    small {
      color: var(--docs-muted-text);
      font-size: 0.625rem;
    }

    .stack {
      display: grid;
      gap: 0.3rem;
      justify-items: center;
    }

    .stack.wide {
      inline-size: 8rem;
      justify-items: stretch;
    }

    .stack > div {
      display: flex;
      gap: 0.3rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      min-block-size: 1.9rem;
      padding-inline: 0.75rem;
      border: 1px solid transparent;
      border-radius: var(--docs-radius-sm);
      font-weight: var(--docs-weight-bold);
      white-space: nowrap;
    }

    .btn.sm {
      min-block-size: 1.6rem;
    }

    .btn.xs {
      min-block-size: 1.25rem;
      padding-inline: 0.45rem;
      font-size: 0.5625rem;
    }

    .primary {
      background: var(--color-primary);
      color: var(--color-primary-content);
    }

    .error {
      background: var(--color-error);
      color: var(--color-error-content);
    }

    .outline {
      border-color: var(--docs-border-strong);
      background: var(--docs-surface);
    }

    .menu-sketch {
      display: grid;
      gap: 0.25rem;
      justify-items: center;
    }

    .list,
    .dialog,
    .mini-card,
    .tooltip small,
    .toast span {
      display: grid;
      gap: 0.15rem;
      padding: 0.3rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-sm);
      background: var(--docs-surface);
      box-shadow: 0 6px 18px rgb(0 0 0 / 10%);
    }

    .list b {
      padding: 0.15rem 0.4rem;
      border-radius: var(--docs-radius-xs);
      background: var(--docs-subtle);
    }

    .list span {
      padding: 0.15rem 0.4rem;
    }

    .scrim {
      padding: 0.4rem 0.75rem;
      border-radius: var(--docs-radius-xs);
      background: color-mix(in srgb, var(--docs-text) 55%, transparent);
    }

    .dialog {
      inline-size: 7rem;
      padding: 0.5rem;
    }

    .dialog .btn {
      justify-self: end;
    }

    .avatars {
      display: flex;
    }

    .avatars span {
      display: grid;
      place-items: center;
      inline-size: 1.75rem;
      block-size: 1.75rem;
      margin-inline-start: -0.4rem;
      border: 2px solid var(--docs-surface-raised);
      border-radius: 50%;
      background: var(--color-primary);
      color: var(--color-primary-content);
      font-weight: var(--docs-weight-bold);
    }

    .avatars span:nth-child(2) {
      background: var(--color-secondary);
      color: var(--color-secondary-content);
    }

    .avatars span:nth-child(3) {
      background: var(--color-accent);
      color: var(--color-accent-content);
    }

    .avatars .more {
      background: var(--color-base-300);
      color: var(--docs-text);
    }

    .pill {
      padding: 0.1rem 0.4rem;
      border: 1px solid transparent;
      border-radius: var(--docs-radius-pill);
      font-weight: var(--docs-weight-bold);
    }

    .pill.outline {
      border-color: var(--docs-text);
    }

    .pill.soft {
      background: color-mix(in srgb, var(--color-success) 25%, var(--docs-surface));
    }

    .pill.dash {
      border: 1px dashed var(--color-error);
      color: var(--color-error);
    }

    .mini-card {
      inline-size: 7rem;
      padding: 0 0 0.4rem;
      overflow: hidden;
    }

    .mini-card > * {
      margin-inline: 0.4rem;
    }

    .mini-card .media {
      block-size: 1.5rem;
      margin: 0;
      background: var(--stripes);
    }

    .mini-card .btn {
      justify-self: start;
    }

    table {
      border-collapse: collapse;
      font-size: 0.5625rem;
    }

    th,
    td {
      padding: 0.15rem 0.6rem;
      border-block-end: 1px solid var(--docs-border);
      text-align: start;
    }

    th:last-child,
    td:last-child {
      text-align: end;
    }

    .timeline {
      display: flex;
      align-items: center;
    }

    .timeline span {
      display: grid;
      place-items: center;
      inline-size: 1rem;
      block-size: 1rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: 50%;
      background: var(--docs-surface);
      font-size: 0.5rem;
    }

    .timeline span.done {
      border-color: var(--color-primary);
      background: var(--color-primary);
      color: var(--color-primary-content);
    }

    .timeline i {
      inline-size: 1.75rem;
      block-size: 2px;
      background: var(--color-primary);
    }

    .timeline i.off {
      background: var(--docs-border);
    }

    .chat {
      display: grid;
      gap: 0.3rem;
      inline-size: 9rem;
    }

    .chat span {
      padding: 0.3rem 0.5rem;
      border-radius: 0.6rem 0.6rem 0.6rem 0.15rem;
      background: var(--color-base-300);
    }

    .chat .me {
      justify-self: end;
      border-radius: 0.6rem 0.6rem 0.15rem 0.6rem;
      background: var(--color-primary);
      color: var(--color-primary-content);
    }

    .stat {
      display: grid;
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-sm);
      background: var(--docs-surface);
    }

    .stat small:first-child {
      font-weight: var(--docs-weight-black);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .stat b {
      font-size: 1rem;
    }

    .stat em {
      font-size: 0.625rem;
      font-style: normal;
    }

    .ok {
      color: color-mix(in srgb, var(--color-success) 60%, var(--docs-text));
      font-weight: var(--docs-weight-bold);
    }

    .dot {
      inline-size: 0.6rem;
      block-size: 0.6rem;
      border-radius: 50%;
    }

    .dot.error {
      background: var(--color-error);
    }

    .navbar {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.3rem 0.5rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-sm);
      background: var(--docs-surface);
    }

    .navbar b {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .logo {
      display: grid;
      place-items: center;
      inline-size: 0.9rem;
      block-size: 0.9rem;
      border-radius: 0.2rem;
      background: var(--color-primary);
      color: var(--color-primary-content);
      font-size: 0.5rem;
    }

    .tabs {
      display: flex;
      gap: 0.75rem;
    }

    .tabs > * {
      padding-block: 0.3rem;
      border-block-end: 2px solid transparent;
      color: var(--docs-muted-text);
      font-weight: var(--docs-weight-semibold);
    }

    .tabs b {
      border-color: var(--color-primary);
      color: var(--docs-text);
    }

    .crumbs b {
      color: var(--docs-text);
    }

    .alert {
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--color-info);
      border-radius: var(--docs-radius-sm);
      background: color-mix(in srgb, var(--color-info) 18%, var(--docs-surface));
    }

    .bar,
    .range {
      position: relative;
      display: block;
      block-size: 0.4rem;
      border-radius: var(--docs-radius-pill);
      background: var(--docs-border);
    }

    .bar i,
    .range i {
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      border-radius: inherit;
      background: var(--color-primary);
    }

    .w35 {
      inline-size: 35%;
    }

    .w60 {
      inline-size: 60%;
    }

    .w72 {
      inline-size: 72%;
    }

    .bar.muted i {
      background: var(--docs-muted-text);
    }

    .range b {
      position: absolute;
      inset-block-start: -0.3rem;
      inset-inline-start: calc(60% - 0.5rem);
      inline-size: 1rem;
      block-size: 1rem;
      border-radius: 50%;
      background: var(--color-primary);
    }

    .ticks {
      display: flex;
      justify-content: space-between;
      font-family: var(--docs-font-mono);
    }

    .toast {
      display: grid;
      gap: 0.25rem;
      justify-items: end;
      align-self: end;
      margin-inline-start: auto;
    }

    .toast .success {
      background: color-mix(in srgb, var(--color-success) 35%, var(--docs-surface));
      font-weight: var(--docs-weight-bold);
    }

    .tooltip {
      display: grid;
      gap: 0.3rem;
      justify-items: center;
    }

    .tooltip small {
      background: var(--color-neutral);
      color: var(--color-neutral-content);
    }

    .checks {
      display: grid;
      gap: 0.3rem;
    }

    .checks .row {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .checks i {
      inline-size: 0.75rem;
      block-size: 0.75rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: 0.15rem;
      background: var(--docs-surface);
    }

    .checks.round i {
      border-radius: 50%;
    }

    .checks i.on {
      border-color: var(--color-primary);
      background: var(--color-primary);
    }

    .checks .off {
      color: var(--docs-muted-text);
    }

    .select {
      display: block;
      min-inline-size: 7rem;
      padding: 0.35rem 0.5rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-sm);
      background: var(--docs-surface);
    }

    .label {
      font-weight: var(--docs-weight-black);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .rating {
      color: var(--color-warning);
      font-size: 1rem;
      letter-spacing: 0.1em;
    }

    .rating span {
      color: var(--docs-border-strong);
    }

    .otp {
      display: flex;
      gap: 0.3rem;
    }

    .otp span {
      display: grid;
      place-items: center;
      inline-size: 1.4rem;
      block-size: 1.7rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-xs);
      background: var(--docs-surface);
    }

    .otp .focus {
      border: 2px solid var(--color-primary);
      color: var(--color-primary);
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      inline-size: 9rem;
    }

    .divider i {
      flex: 1;
      block-size: 1px;
      background: var(--docs-border-strong);
    }

    .hero {
      display: grid;
      gap: 0.2rem;
      justify-items: center;
      padding: 0.6rem 1.5rem;
      background: var(--stripes);
    }

    .drawer {
      display: flex;
      inline-size: 8rem;
      block-size: 3.5rem;
      overflow: hidden;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-xs);
      background: var(--docs-surface);
    }

    .drawer .side,
    .drawer .main {
      display: grid;
      align-content: start;
      gap: 0.2rem;
      padding: 0.3rem;
    }

    .drawer .side {
      inline-size: 2.5rem;
      background: var(--docs-surface-raised);
    }

    .drawer .main {
      flex: 1;
    }

    .drawer i {
      display: block;
      block-size: 0.2rem;
      border-radius: 1px;
      background: var(--docs-border);
    }

    .drawer i.accent {
      background: var(--color-primary);
    }

    .stacked {
      display: grid;
      justify-items: center;
    }

    .stacked > * {
      grid-area: 1 / 1;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-sm);
      background: var(--docs-surface);
    }

    .stacked span:nth-child(1) {
      inline-size: 5.5rem;
      block-size: 2.5rem;
      translate: 0 -0.5rem;
      opacity: 0.6;
    }

    .stacked span:nth-child(2) {
      inline-size: 6rem;
      block-size: 2.5rem;
      translate: 0 -0.25rem;
      opacity: 0.8;
    }

    .stacked b {
      padding: 0.6rem 0.5rem;
      border-color: var(--docs-text);
    }

    .browser {
      inline-size: 8rem;
      overflow: hidden;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-xs);
      background: var(--docs-surface);
    }

    .chrome {
      display: flex;
      align-items: center;
      gap: 0.15rem;
      padding: 0.2rem;
    }

    .chrome i {
      inline-size: 0.3rem;
      block-size: 0.3rem;
      border-radius: 50%;
      background: var(--color-error);
    }

    .chrome i:nth-child(2) {
      background: var(--color-warning);
    }

    .chrome i:nth-child(3) {
      background: var(--color-success);
    }

    .chrome small {
      flex: 1;
      margin-inline-start: 0.3rem;
      padding-inline: 0.3rem;
      border-radius: var(--docs-radius-pill);
      background: var(--docs-surface-raised);
      font-size: 0.5rem;
    }

    .page {
      block-size: 2rem;
      background: var(--stripes);
    }

    .terminal {
      display: grid;
      gap: 0.1rem;
      padding: 0.5rem 0.6rem;
      border-radius: var(--docs-radius-sm);
      background: var(--docs-code-bg);
      color: var(--docs-code-fg);
      font-family: var(--docs-font-mono);
      font-size: 0.5625rem;
    }

    .terminal .ok {
      color: var(--docs-token-str);
    }

    .phone {
      inline-size: 2.4rem;
      block-size: 4.2rem;
      padding: 0.35rem 0.2rem;
      border: 2px solid var(--docs-border-strong);
      border-radius: 0.5rem;
      background: var(--docs-surface);
    }

    .phone .page {
      block-size: 100%;
      border-radius: 0.2rem;
    }

    .placeholder {
      padding: 0.35rem 0.6rem;
      border: 1px dashed var(--docs-border-strong);
      border-radius: var(--docs-radius-sm);
      color: var(--docs-muted-text);
      font-family: var(--docs-font-mono);
    }
  `,
})
export class DocsComponentPreviewComponent {
  readonly id = input.required<string>();
  readonly name = input.required<string>();
}
