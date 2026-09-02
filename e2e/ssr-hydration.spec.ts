import { expect, test } from './fixtures/accessibility';

function generatedRelationshipIds(html: string): Record<string, string> {
  return Object.fromEntries(
    [
      'interaction-heading',
      'counter-description',
      'render-state',
      'validation-control',
      'validation-hint',
      'validation-error',
      'async-action-status',
    ].map(testId => {
      const element = html.match(new RegExp(`<[^>]*data-testid="${testId}"[^>]*>`))?.[0];
      const id = element?.match(/\sid="([^"]+)"/)?.[1];

      if (!id) {
        throw new Error(`Missing generated ID for ${testId} in the server response.`);
      }

      return [testId, id];
    }),
  );
}

test('serves meaningful rendered HTML without client JavaScript', async ({ browser, request }) => {
  const response = await request.get('/');
  const html = await response.text();
  const repeatedResponse = await request.get('/');
  const repeatedHtml = await repeatedResponse.text();

  expect(response.ok()).toBe(true);
  expect(html).toContain('Zordon UI SSR and hydration example');
  expect(html).toContain('Hydration status: server-rendered');
  expect(html).toContain('data-testid="server-theme-scope"');
  expect(html).toContain('data-theme="dark"');
  expect(html).toContain('data-testid="server-nested-theme"');
  expect(html).toContain('data-theme="light"');
  expect(html).not.toContain('cdk-live-announcer-element');
  expect(html).not.toContain('cdk-describedby-message-container');
  expect(html).toContain('Action idle');
  expect(html).toContain('Accepted actions: 0');
  expect(html).toContain('data-testid="button-pressed"');
  expect(html).toContain('data-testid="button-loading"');
  expect(html).toContain('data-testid="button-disabled-link"');
  expect(html).toContain('data-testid="link-native"');
  expect(html).toContain('data-testid="link-disabled"');
  expect(html).toContain('data-testid="divider-labeled"');
  expect(html).toContain('data-testid="divider-hr"');
  expect(html).toContain('data-testid="divider-decorative"');
  expect(html).toContain('data-testid="label-explicit"');
  expect(html).toContain('data-testid="label-floating"');
  expect(html).toContain('data-testid="fieldset-native"');
  expect(html).toContain('data-testid="avatar-online"');
  expect(html).toContain('data-testid="avatar-placeholder"');
  expect(html).toContain('data-testid="badge-status"');
  expect(html).toContain('data-testid="badge-action"');
  expect(html).toContain('data-testid="card-article"');
  expect(html).toContain('data-testid="card-selectable"');
  expect(html).toContain('data-testid="card-image-full"');
  expect(html).toContain('data-testid="carousel-horizontal"');
  expect(html).toContain('data-testid="carousel-vertical"');
  expect(html).toContain('data-testid="collapse-details"');
  expect(html).toContain('data-testid="collapse-checkbox"');
  expect(html).toContain('data-testid="kbd-inline"');
  expect(html).toContain('data-testid="kbd-xl"');
  expect(html).toContain('data-testid="status-online"');
  expect(html).toContain('data-testid="countdown-remaining"');
  expect(html).toContain('data-testid="chat-start"');
  expect(html).toContain('data-testid="chat-end"');
  expect(html).toContain('data-testid="aura-rainbow"');
  expect(html).toContain('data-testid="aura-glow"');
  expect(html).toContain('class="btn btn-primary"');
  expect(html).toContain('aria-pressed="false"');
  expect(html).toContain('href="#hydrated-button-target"');
  const asyncActionRegion = html.match(/<div[^>]*data-testid="async-action-region"[^>]*>/)?.[0];
  expect(asyncActionRegion).toContain('aria-busy="false"');
  expect(html).toMatch(/ngh="\d+"/);
  expect(repeatedResponse.ok()).toBe(true);
  expect(generatedRelationshipIds(repeatedHtml)).toEqual(generatedRelationshipIds(html));

  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Zordon UI SSR and hydration example' }),
  ).toBeVisible();
  await expect(page.getByTestId('hydration-state')).toHaveText('Hydration status: server-rendered');
  await context.close();
});

test('hydrates without errors and preserves generated relationships', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', error => errors.push(error.message));

  const serverResponse = await request.get('/');
  const serverIds = generatedRelationshipIds(await serverResponse.text());

  await page.goto('/');
  await expect(page.getByTestId('hydration-state')).toHaveText('Hydration status: ready');
  await expect(page.getByTestId('server-theme-scope')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByTestId('server-nested-theme')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByTestId('counter')).toHaveText('Hydrated count: 0');

  const headingId = await page.getByTestId('interaction-heading').getAttribute('id');
  const descriptionId = await page.getByTestId('counter-description').getAttribute('id');
  const renderStateId = await page.getByTestId('render-state').getAttribute('id');
  const validationControlId = await page.getByTestId('validation-control').getAttribute('id');
  const validationHintId = await page.getByTestId('validation-hint').getAttribute('id');
  const validationErrorId = await page.getByTestId('validation-error').getAttribute('id');
  const asyncActionStatusId = await page.getByTestId('async-action-status').getAttribute('id');
  expect(headingId).toBe(serverIds['interaction-heading']);
  expect(descriptionId).toBe(serverIds['counter-description']);
  expect(renderStateId).toBe(serverIds['render-state']);
  expect(validationControlId).toBe(serverIds['validation-control']);
  expect(validationHintId).toBe(serverIds['validation-hint']);
  expect(validationErrorId).toBe(serverIds['validation-error']);
  expect(asyncActionStatusId).toBe(serverIds['async-action-status']);
  await expect(page.getByRole('region', { name: 'Hydrated interaction' })).toHaveAttribute(
    'aria-labelledby',
    headingId!,
  );
  await expect(page.getByTestId('increment')).toHaveAttribute('aria-describedby', descriptionId!);
  await expect(page.getByText('Initial render state')).toHaveAttribute('for', renderStateId!);
  await expect(page.getByText('Account code', { exact: true })).toHaveAttribute(
    'for',
    validationControlId!,
  );

  const validationControl = page.getByTestId('validation-control');
  const validationSubmit = page.getByTestId('submit-validation');
  const validationReset = page.getByTestId('reset-validation');
  const validationDisabled = page.getByTestId('toggle-validation-disabled');
  const validationError = page.getByTestId('validation-error');
  const expectedDescriptionIds = `ssr-consumer-description ${validationHintId}`;
  await expect(validationControl).toHaveAttribute('aria-describedby', expectedDescriptionIds);
  await expect(validationControl).not.toHaveAttribute('aria-invalid');
  await expect(validationControl).not.toHaveAttribute('aria-errormessage');
  await expect(validationControl).toHaveClass(/ng-pristine/);
  await expect(validationControl).toHaveClass(/ng-untouched/);
  await expect(validationError).toBeHidden();

  await validationSubmit.click();
  await expect(validationSubmit).toBeFocused();
  await expect(validationControl).toHaveAttribute('aria-describedby', expectedDescriptionIds);
  await expect(validationControl).toHaveAttribute('aria-invalid', 'true');
  await expect(validationControl).toHaveAttribute('aria-errormessage', validationErrorId!);
  await expect(validationError).toBeVisible();
  await expect(validationError).toHaveText('Enter an account code.');

  await validationControl.fill('AC-42');
  await expect(validationControl).toHaveValue('AC-42');
  await expect(validationControl).toHaveClass(/ng-dirty/);
  await expect(validationControl).toHaveAttribute('aria-describedby', expectedDescriptionIds);
  await expect(validationControl).not.toHaveAttribute('aria-invalid');
  await expect(validationControl).not.toHaveAttribute('aria-errormessage');
  await expect(validationError).toBeHidden();

  await validationControl.fill('');
  await validationControl.blur();
  await expect(validationControl).toHaveClass(/ng-touched/);
  await expect(validationControl).toHaveAttribute('aria-invalid', 'true');
  await expect(validationControl).toHaveAttribute('aria-errormessage', validationErrorId!);
  await expect(validationError).toBeVisible();

  await validationDisabled.click();
  await expect(validationControl).toBeDisabled();
  await expect(validationControl).not.toHaveAttribute('aria-invalid');
  await expect(validationControl).not.toHaveAttribute('aria-errormessage');
  await expect(validationError).toBeHidden();

  await validationDisabled.click();
  await expect(validationControl).toBeEnabled();
  await expect(validationControl).toHaveAttribute('aria-invalid', 'true');
  await expect(validationError).toBeVisible();
  await validationReset.click();
  await expect(validationControl).toHaveValue('');
  await expect(validationControl).toHaveClass(/ng-pristine/);
  await expect(validationControl).toHaveClass(/ng-untouched/);
  await expect(validationControl).not.toHaveAttribute('aria-invalid');
  await expect(validationControl).not.toHaveAttribute('aria-errormessage');
  await expect(validationError).toBeHidden();

  const counter = page.getByTestId('counter');
  const increment = page.getByTestId('increment');
  await expect(counter).toHaveAttribute('role', 'status');
  await expect(counter).toHaveAttribute('aria-atomic', 'true');
  await counter.evaluate(element => {
    const updates: string[] = [];
    const targetWindow = window as Window & { __zordonStatusUpdates?: string[] };
    targetWindow.__zordonStatusUpdates = updates;
    new MutationObserver(() => {
      const text = element.textContent?.trim() ?? '';
      if (updates.at(-1) !== text) updates.push(text);
    }).observe(element, { characterData: true, childList: true, subtree: true });
  });
  await increment.click();
  await expect(increment).toBeFocused();
  await expect(counter).toHaveText('Hydrated count: 1');
  expect(
    await page.evaluate(
      () => (window as Window & { __zordonStatusUpdates?: string[] }).__zordonStatusUpdates,
    ),
  ).toEqual(['Hydrated count: 1']);
  await expect(page.locator('.cdk-live-announcer-element')).toHaveCount(0);
  await expect(page.locator('.cdk-describedby-message-container')).toHaveCount(0);

  const buttonPressed = page.getByTestId('button-pressed');
  const buttonLoading = page.getByTestId('button-loading');
  const buttonDisabledLink = page.getByTestId('button-disabled-link');
  const buttonSubmit = page.getByTestId('button-submit');
  const buttonForm = page.getByTestId('button-form');
  await expect(buttonPressed).toHaveAttribute('aria-pressed', 'false');
  await buttonPressed.click();
  await expect(buttonPressed).toHaveAttribute('aria-pressed', 'true');
  await expect(buttonPressed).toBeFocused();

  await page.getByTestId('button-toggle-loading').click();
  await expect(buttonLoading).toHaveAttribute('aria-disabled', 'true');
  await buttonLoading.evaluate(element => {
    element.addEventListener(
      'click',
      event => {
        (
          window as Window & { __zordonHydratedButtonDefaultPrevented?: boolean }
        ).__zordonHydratedButtonDefaultPrevented = event.defaultPrevented;
      },
      { once: true },
    );
  });
  await buttonLoading.evaluate((element: HTMLButtonElement) => element.click());
  await expect(page.getByTestId('button-loading-clicks')).toHaveText('Loading clicks: 1');
  expect(
    await page.evaluate(
      () =>
        (window as Window & { __zordonHydratedButtonDefaultPrevented?: boolean })
          .__zordonHydratedButtonDefaultPrevented,
    ),
  ).toBe(true);

  await expect(buttonDisabledLink).toHaveAttribute('aria-disabled', 'true');
  await buttonDisabledLink.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('button-link-clicks')).toHaveText('Link clicks: 1');
  await expect(page).not.toHaveURL(/#hydrated-button-target$/);

  await buttonSubmit.click();
  await expect(page.getByTestId('button-submit-count')).toHaveText('Button submits: 1');
  await buttonForm.evaluate((element: HTMLFormElement) => element.requestSubmit());
  await expect(page.getByTestId('button-submit-count')).toHaveText('Button submits: 2');

  const nativeLink = page.getByTestId('link-native');
  const disabledLink = page.getByTestId('link-disabled');
  await expect(nativeLink).toHaveClass(/link/);
  await expect(nativeLink).toHaveClass(/link-hover/);
  await expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
  await disabledLink.focus();
  await page.keyboard.press('Enter');
  await expect(disabledLink).toBeFocused();
  await expect(page.getByTestId('link-clicks')).toHaveText('Link clicks: 1');
  await expect(page).not.toHaveURL(/#hydrated-link-target$/);
  await page.getByTestId('link-toggle').click();
  await expect(disabledLink).not.toHaveAttribute('aria-disabled');
  await disabledLink.click();
  await expect(page).toHaveURL(/#hydrated-link-target$/);

  const labeledDivider = page.getByTestId('divider-labeled');
  const thematicBreak = page.getByTestId('divider-hr');
  await expect(labeledDivider).toHaveClass(/divider/);
  await expect(labeledDivider).toHaveClass(/divider-primary/);
  await expect(labeledDivider).toHaveClass(/divider-horizontal/);
  await expect(labeledDivider).toHaveClass(/divider-end/);
  await expect(labeledDivider).not.toHaveAttribute('role');
  await expect(thematicBreak).toHaveJSProperty('tagName', 'HR');
  await expect(thematicBreak).toHaveClass(/divider-neutral/);
  await expect(page.getByTestId('divider-decorative')).toHaveAttribute('aria-hidden', 'true');

  const explicitLabel = page.getByTestId('label-explicit');
  await expect(explicitLabel).toHaveClass(/label/);
  await expect(explicitLabel).toHaveAttribute('for', 'hydrated-label-email');
  await expect(page.getByTestId('label-implicit').locator('input')).toHaveCount(1);
  await expect(page.getByTestId('label-floating')).toHaveClass(/floating-label/);
  const fieldset = page.getByTestId('fieldset-native');
  await expect(fieldset).toHaveClass(/fieldset/);
  await expect(fieldset).toHaveAttribute('disabled', '');
  await expect(fieldset.getByText('Delivery method')).toHaveClass(/fieldset-legend/);

  const avatarGroup = page.getByTestId('avatar-group');
  const onlineAvatar = page.getByTestId('avatar-online');
  const placeholderAvatar = page.getByTestId('avatar-placeholder');
  await expect(avatarGroup).toHaveClass(/avatar-group/);
  await expect(avatarGroup).not.toHaveAttribute('role');
  await expect(onlineAvatar).toHaveClass(/avatar-online/);
  await expect(onlineAvatar.locator('img')).toHaveAttribute('alt', 'Avery Chen');
  await expect(placeholderAvatar).toHaveClass(/avatar-placeholder/);
  await expect(placeholderAvatar).toHaveClass(/avatar-offline/);

  const badgeStatus = page.getByTestId('badge-status');
  const badgeAction = page.getByTestId('badge-action');
  await expect(badgeStatus).toHaveClass(/badge-success/);
  await expect(badgeStatus).toHaveClass(/badge-xl/);
  await expect(badgeStatus).toHaveClass(/badge-soft/);
  await expect(badgeStatus).toHaveAttribute('role', 'status');
  await expect(badgeAction).toHaveClass(/badge-primary/);
  await expect(badgeAction).toHaveClass(/badge-outline/);
  await expect(badgeAction).toBeDisabled();
  await expect(page.getByTestId('badge-dot')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByTestId('badge-ghost')).toHaveClass(/badge-ghost/);

  const cardArticle = page.getByTestId('card-article');
  const cardSelectable = page.getByTestId('card-selectable');
  const imageFullCard = page.getByTestId('card-image-full');
  await expect(cardArticle).toHaveClass(/card/);
  await expect(cardArticle).toHaveClass(/card-xl/);
  await expect(cardArticle).toHaveClass(/card-border/);
  await expect(cardArticle).not.toHaveAttribute('role');
  await expect(cardArticle.getByRole('heading', { name: 'Launch report' })).toHaveClass(
    /card-title/,
  );
  await expect(cardArticle.locator('[zdCardActions]')).toHaveClass(/card-actions/);
  await expect(cardSelectable).toHaveClass(/card-xs/);
  await expect(cardSelectable).toHaveClass(/card-dash/);
  await expect(cardSelectable).toHaveClass(/card-side/);
  await cardSelectable.getByRole('radio').check();
  await expect(cardSelectable.getByRole('radio')).toBeChecked();
  await expect(imageFullCard).toHaveClass(/image-full/);
  await expect(imageFullCard).not.toHaveAttribute('tabindex');

  const carouselHorizontal = page.getByTestId('carousel-horizontal');
  const carouselVertical = page.getByTestId('carousel-vertical');
  await expect(carouselHorizontal).toHaveClass(/carousel/);
  await expect(carouselHorizontal).toHaveClass(/carousel-center/);
  await expect(carouselHorizontal).toHaveAttribute('aria-label', 'Hydrated featured articles');
  await expect(carouselHorizontal).not.toHaveAttribute('role');
  await expect(carouselHorizontal).not.toHaveAttribute('tabindex');
  await expect(carouselHorizontal.locator('[zdCarouselItem]')).toHaveCount(2);
  await expect(carouselVertical).toHaveClass(/carousel-vertical/);
  await expect(carouselVertical).toHaveClass(/carousel-end/);
  await expect(carouselVertical).toHaveAttribute('aria-label', 'Hydrated deployment checklist');

  const collapseDetails = page.getByTestId('collapse-details');
  const collapseCheckbox = page.getByTestId('collapse-checkbox');
  await expect(collapseDetails).toHaveClass(/collapse-arrow/);
  await expect(collapseDetails).not.toHaveAttribute('role');
  await expect(collapseDetails.locator('summary')).toHaveClass(/collapse-title/);
  await collapseDetails.locator('summary').click();
  await expect(collapseDetails).toHaveAttribute('open', '');
  await expect(collapseCheckbox).toHaveClass(/collapse-plus/);
  await expect(collapseCheckbox).toHaveClass(/collapse-close/);
  await expect(collapseCheckbox.locator('input[type="checkbox"]')).not.toBeChecked();

  const kbdInline = page.getByTestId('kbd-inline');
  const kbdCombination = page.getByTestId('kbd-combination');
  const kbdExtraLarge = page.getByTestId('kbd-xl');
  await expect(kbdInline).toHaveJSProperty('tagName', 'KBD');
  await expect(kbdInline).toHaveClass(/kbd-xs/);
  await expect(kbdInline).not.toHaveAttribute('role');
  await expect(kbdInline).not.toHaveAttribute('tabindex');
  await expect(kbdCombination).toHaveAttribute('aria-label', 'Control plus Shift plus Delete');
  await expect(kbdExtraLarge).toHaveClass(/kbd-xl/);
  await expect(kbdExtraLarge).toHaveAttribute('aria-hidden', 'true');

  const statusOnline = page.getByTestId('status-online');
  await expect(statusOnline).toHaveClass(/status-success/);
  await expect(statusOnline).toHaveClass(/status-xl/);
  await expect(statusOnline).toHaveAttribute('aria-label', 'Service online');
  await expect(statusOnline).toHaveAttribute('role', 'img');

  const countdown = page.getByTestId('countdown-remaining');
  const countdownValue = countdown.locator('span');
  await expect(countdown).toHaveClass(/countdown/);
  await expect(countdown).toHaveAttribute('role', 'img');
  await expect(countdown).toHaveAttribute('aria-label', '59 seconds remaining');
  await expect(countdownValue).toHaveAttribute('aria-hidden', 'true');
  await expect(countdownValue).toHaveCSS('--value', '59');
  await expect(countdownValue).toHaveText('59');

  const chatStart = page.getByTestId('chat-start');
  const chatEnd = page.getByTestId('chat-end');
  await expect(chatStart).toHaveClass(/chat-start/);
  await expect(chatStart.locator('[zdChatBubble]')).toHaveClass(/chat-bubble-primary/);
  await expect(chatStart.locator('time')).toHaveAttribute('datetime', '2026-09-01T10:45');
  await expect(chatStart).not.toHaveAttribute('role');
  await expect(chatEnd).toHaveClass(/chat-end/);
  await expect(chatEnd.locator('[zdChatBubble]')).toHaveClass(/chat-bubble-success/);

  const rainbowAura = page.getByTestId('aura-rainbow');
  const glowAura = page.getByTestId('aura-glow');
  await expect(rainbowAura).toHaveClass(/aura/);
  await expect(rainbowAura).toHaveClass(/aura-rainbow/);
  await expect(rainbowAura).toHaveClass(/aura-lg/);
  await expect(rainbowAura).toHaveAttribute('data-zd-aura', 'true');
  await expect(rainbowAura).not.toHaveAttribute('role');
  await expect(rainbowAura.getByRole('button', { name: 'Start free trial' })).toBeVisible();
  await expect(glowAura).toHaveClass(/aura-glow/);
  await expect(glowAura).toHaveClass(/aura-xs/);

  const asyncActionStart = page.getByTestId('async-action-start');
  const asyncActionStatus = page.getByTestId('async-action-status');
  const asyncActionStarts = page.getByTestId('async-action-starts');
  await expect(asyncActionStart).toHaveAttribute('aria-describedby', asyncActionStatusId!);
  await expect(asyncActionStart).not.toHaveAttribute('aria-disabled');
  await expect(asyncActionStatus).toHaveText('Action idle');
  await expect(asyncActionStarts).toHaveText('Accepted actions: 0');
  await expect(page.getByTestId('async-action-region')).toHaveAttribute('aria-busy', 'false');

  await asyncActionStart.focus();
  await asyncActionStart.evaluate((element: HTMLButtonElement) => {
    element.click();
    element.click();
  });
  await expect(asyncActionStart).toBeFocused();
  await expect(asyncActionStart).toHaveAttribute('aria-disabled', 'true');
  await expect(page.getByTestId('async-action-region')).toHaveAttribute('aria-busy', 'true');
  await expect(asyncActionStatus).toHaveText('Saving hydrated settings');
  await expect(asyncActionStarts).toHaveText('Accepted actions: 1');
  await page.getByTestId('async-action-complete').click();
  await expect(asyncActionStatus).toHaveText('Hydrated settings saved');
  await expect(asyncActionStart).not.toHaveAttribute('aria-disabled');
  await expect(page.getByTestId('async-action-region')).toHaveAttribute('aria-busy', 'false');

  await page
    .getByTestId('clear-server-theme')
    .evaluate((element: HTMLButtonElement) => element.click());
  await expect(page.getByTestId('server-theme-scope')).not.toHaveAttribute('data-theme');
  await expect(page.getByTestId('server-nested-theme')).toHaveAttribute('data-theme', 'light');
  expect(errors).toEqual([]);
});

test('has no detectable WCAG A or AA violations after hydration', async ({ page, runAxeScan }) => {
  await page.goto('/');
  await expect(page.getByTestId('hydration-state')).toHaveText('Hydration status: ready');
  await page.getByTestId('submit-validation').click();
  await expect(page.getByTestId('validation-error')).toBeVisible();

  const results = await runAxeScan('[data-testid="ssr-example"]');
  expect(results.violations).toEqual([]);
});
