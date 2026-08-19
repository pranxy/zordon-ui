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
  expect(headingId).toBe(serverIds['interaction-heading']);
  expect(descriptionId).toBe(serverIds['counter-description']);
  expect(renderStateId).toBe(serverIds['render-state']);
  expect(validationControlId).toBe(serverIds['validation-control']);
  expect(validationHintId).toBe(serverIds['validation-hint']);
  expect(validationErrorId).toBe(serverIds['validation-error']);
  await expect(page.locator('section')).toHaveAttribute('aria-labelledby', headingId!);
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
