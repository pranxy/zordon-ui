import { ChangeDetectionStrategy, Component, OnDestroy, output, signal } from '@angular/core';

interface DeferredInvocation {
  readonly controller: AbortController;
  readonly id: number;
  readonly promise: Promise<void>;
  readonly reject: (reason?: unknown) => void;
  readonly resolve: () => void;
  settled: boolean;
}

function createInvocation(id: number): DeferredInvocation {
  let resolve!: () => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return {
    controller: new AbortController(),
    id,
    promise,
    reject,
    resolve,
    settled: false,
  };
}

@Component({
  selector: 'app-async-action-probe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="async-action-heading" class="grid gap-3">
      <h2 id="async-action-heading" class="text-xl font-semibold">Async action behavior</h2>
      <p>
        Test-only consumer ownership for duplicate activation, cancellation, and stale completion.
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          class="rounded border px-3 py-2"
          data-testid="async-action-start"
          type="button"
          [attr.aria-describedby]="'async-action-status'"
          [attr.aria-disabled]="actionPending() ? 'true' : null"
          [disabled]="actionDisabled()"
          (click)="startAction()"
        >
          Save settings
        </button>
        <button
          data-testid="async-action-start-twice"
          hidden
          type="button"
          (click)="startActionTwice()"
        >
          Start twice in one handler
        </button>
        <button
          class="rounded border px-3 py-2"
          data-testid="async-action-replace"
          type="button"
          (click)="replaceAction()"
        >
          Replace with latest request
        </button>
        <button
          class="rounded border px-3 py-2"
          data-testid="async-action-complete-oldest"
          type="button"
          (click)="completeOldest()"
        >
          Complete oldest request
        </button>
        <button
          class="rounded border px-3 py-2"
          data-testid="async-action-fail"
          type="button"
          (click)="failCurrent()"
        >
          Fail current request
        </button>
        <button
          class="rounded border px-3 py-2"
          data-testid="async-action-cancel"
          type="button"
          (click)="cancelCurrent()"
        >
          Cancel current request
        </button>
        <button
          class="rounded border px-3 py-2"
          data-testid="async-action-disable"
          type="button"
          (click)="actionDisabled.set(true)"
        >
          Disable save action
        </button>
      </div>
      <div [attr.aria-busy]="actionPending() ? 'true' : 'false'">
        <output
          aria-atomic="true"
          data-testid="async-action-status"
          id="async-action-status"
          role="status"
        >
          {{ actionStatus() }}
        </output>
      </div>
      <output data-testid="async-action-starts">Accepted actions: {{ actionStarts() }}</output>
      <output data-testid="async-action-aborts">Abort requests: {{ actionAborts() }}</output>

      <form #asyncForm class="grid gap-2" (submit)="submitFormAction($event)">
        <label for="async-form-value">Async form value</label>
        <input id="async-form-value" name="value" value="preserved" />
        <button
          #asyncFormSubmit
          class="rounded border px-3 py-2"
          data-testid="async-form-submit"
          name="intent"
          type="submit"
          value="save"
          [attr.aria-disabled]="formPending() ? 'true' : null"
        >
          Submit async form
        </button>
        <button
          data-testid="async-form-submit-twice"
          hidden
          type="button"
          (click)="submitFormTwice(asyncForm, asyncFormSubmit)"
        >
          Submit twice in one handler
        </button>
        <button
          class="rounded border px-3 py-2"
          data-testid="async-form-complete"
          type="button"
          (click)="completeFormAction()"
        >
          Complete form action
        </button>
      </form>
      <output data-testid="async-form-starts">Accepted form submits: {{ formStarts() }}</output>
      <output data-testid="async-form-data">Submitted value: {{ submittedValue() }}</output>
      <output data-testid="async-form-intent">Submitted intent: {{ submittedIntent() }}</output>
      <output data-testid="async-form-submitter">Submitter: {{ submittedSubmitter() }}</output>
    </section>
  `,
})
export class AsyncActionProbeComponent implements OnDestroy {
  readonly cleanup = output<number>();

  protected readonly actionAborts = signal(0);
  protected readonly actionDisabled = signal(false);
  protected readonly actionPending = signal(false);
  protected readonly actionStarts = signal(0);
  protected readonly actionStatus = signal('Action idle');
  protected readonly formPending = signal(false);
  protected readonly formStarts = signal(0);
  protected readonly submittedIntent = signal('');
  protected readonly submittedSubmitter = signal('');
  protected readonly submittedValue = signal('');

  private actionSequence = 0;
  private currentAction: DeferredInvocation | null = null;
  private readonly invocations: DeferredInvocation[] = [];
  private formCompletion: (() => void) | null = null;
  private destroyed = false;

  protected startAction(): void {
    if (this.actionDisabled() || this.actionPending()) return;
    this.beginAction();
  }

  protected startActionTwice(): void {
    this.startAction();
    this.startAction();
  }

  protected replaceAction(): void {
    if (this.actionDisabled()) return;
    if (
      this.currentAction &&
      !this.currentAction.settled &&
      !this.currentAction.controller.signal.aborted
    ) {
      this.currentAction.controller.abort('superseded');
      this.actionAborts.update(count => count + 1);
    }
    this.beginAction();
  }

  protected completeOldest(): void {
    const invocation = this.invocations.find(candidate => !candidate.settled);
    if (!invocation) return;
    invocation.settled = true;
    invocation.resolve();
  }

  protected failCurrent(): void {
    const invocation = this.currentAction;
    if (!invocation || invocation.settled) return;
    invocation.settled = true;
    invocation.reject(new Error(`Request ${invocation.id} failed`));
  }

  protected cancelCurrent(): void {
    const invocation = this.currentAction;
    if (!invocation || invocation.settled) return;
    invocation.controller.abort('cancelled');
    this.actionAborts.update(count => count + 1);
    invocation.settled = true;
    invocation.reject(invocation.controller.signal.reason);
  }

  protected submitFormAction(event: SubmitEvent): void {
    event.preventDefault();
    if (this.formPending()) return;

    this.formPending.set(true);
    this.formStarts.update(count => count + 1);
    const submitter = event.submitter;
    const data = new FormData(event.currentTarget as HTMLFormElement, submitter);
    this.submittedValue.set(String(data.get('value')));
    this.submittedIntent.set(String(data.get('intent')));
    this.submittedSubmitter.set(submitter?.getAttribute('data-testid') ?? 'none');
    const promise = new Promise<void>(resolve => {
      this.formCompletion = resolve;
    });
    void promise.finally(() => {
      if (this.destroyed) return;
      this.formPending.set(false);
      this.formCompletion = null;
    });
  }

  protected submitFormTwice(form: HTMLFormElement, submitter: HTMLButtonElement): void {
    form.requestSubmit(submitter);
    form.requestSubmit(submitter);
  }

  protected completeFormAction(): void {
    this.formCompletion?.();
  }

  private beginAction(): void {
    const invocation = createInvocation(++this.actionSequence);
    this.invocations.push(invocation);
    this.currentAction = invocation;
    this.actionPending.set(true);
    this.actionStarts.update(count => count + 1);
    this.actionStatus.set(`Saving request ${invocation.id}`);

    void invocation.promise
      .then(() => this.settleCurrent(invocation, `Completed request ${invocation.id}`))
      .catch(error => {
        const outcome = invocation.controller.signal.aborted
          ? `Cancelled request ${invocation.id}`
          : error instanceof Error
            ? error.message
            : `Request ${invocation.id} failed`;
        this.settleCurrent(invocation, outcome);
      })
      .finally(() => {
        const index = this.invocations.indexOf(invocation);
        if (index >= 0) this.invocations.splice(index, 1);
        if (this.currentAction !== invocation) return;
        this.currentAction = null;
        this.actionPending.set(false);
      });
  }

  private settleCurrent(invocation: DeferredInvocation, status: string): void {
    if (this.currentAction !== invocation) return;
    this.actionStatus.set(status);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    let aborted = 0;
    for (const invocation of this.invocations) {
      if (invocation.settled) continue;
      if (!invocation.controller.signal.aborted) {
        invocation.controller.abort('destroyed');
        aborted++;
      }
      invocation.settled = true;
      invocation.reject(invocation.controller.signal.reason);
    }
    this.currentAction = null;
    this.invocations.length = 0;
    this.formCompletion?.();
    this.formCompletion = null;
    this.cleanup.emit(aborted);
  }
}
