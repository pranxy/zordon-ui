import { expect, test } from './fixtures/accessibility';

test('Skeleton renders server busy regions and hydrates consumer-owned content replacement', async ({
  browser,
  page,
  runAxeScan,
}) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const server = await noJs.newPage();
    await server.goto('/skeleton');
    await expect(server.getByRole('region', { name: 'Profile', exact: true })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await expect(server.getByTestId('skeleton-active')).toHaveAttribute('aria-hidden', 'true');
    await expect(server.getByRole('status')).toHaveText('Loading profile');
  } finally {
    await noJs.close();
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/skeleton');
  await page.getByRole('button', { name: 'Finish loading' }).click();
  await expect(page.getByRole('region', { name: 'Profile', exact: true })).toHaveAttribute(
    'aria-busy',
    'false',
  );
  await expect(page.getByRole('button', { name: 'Edit profile' })).toBeVisible();
  expect((await runAxeScan()).violations).toEqual([]);
  expect(errors).toEqual([]);
});
test('Radial Progress renders named server values and hydrates thresholds and unknown totals', async ({
  browser,
  page,
  runAxeScan,
}) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const server = await noJs.newPage();
    await server.goto('/radial-progress');
    await expect(
      server.getByRole('progressbar', { name: 'Download', exact: true }),
    ).toHaveAttribute('aria-valuenow', '50');
    await expect(server.getByRole('progressbar', { name: 'Preparing export' })).not.toHaveAttribute(
      'aria-valuenow',
    );
    await expect(server.getByTestId('radial-projected')).toHaveText('✓Done');
  } finally {
    await noJs.close();
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/radial-progress');
  await page.getByRole('button', { name: 'Complete', exact: true }).click();
  await expect(page.getByTestId('radial-completion')).toHaveText('Download complete');
  await page.getByRole('button', { name: 'Unknown duration' }).click();
  await expect(
    page.getByRole('progressbar', { name: 'Download', exact: true }),
  ).not.toHaveAttribute('aria-valuenow');
  expect((await runAxeScan()).violations).toEqual([]);
  expect(errors).toEqual([]);
});
test('Progress renders native server values and hydrates completion without duplicate semantics', async ({
  browser,
  page,
  runAxeScan,
}) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const server = await noJs.newPage();
    await server.goto('/progress');
    await expect(server.getByRole('progressbar', { name: 'Upload', exact: true })).toHaveAttribute(
      'value',
      '50',
    );
    await expect(server.getByRole('progressbar', { name: 'Preparing export' })).not.toHaveAttribute(
      'value',
    );
    await expect(
      server.getByTestId('progress-upload').locator('.zd-progress-buffer'),
    ).toBeVisible();
  } finally {
    await noJs.close();
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/progress');
  await page.getByRole('button', { name: 'Complete upload' }).click();
  await expect(page.getByTestId('progress-completion')).toHaveText('Upload complete');
  await page.getByRole('button', { name: 'Unknown duration' }).click();
  await expect(page.getByRole('progressbar', { name: 'Upload', exact: true })).not.toHaveAttribute(
    'value',
  );
  expect((await runAxeScan()).violations).toEqual([]);
  expect(errors).toEqual([]);
});
test('Loading renders stable server status content and hydrates delayed feedback', async ({
  browser,
  page,
  runAxeScan,
}) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const server = await noJs.newPage();
    await server.goto('/loading');
    await expect(server.getByTestId('loading-custom').locator('.zd-loading-status')).toHaveText(
      'Preparing export',
    );
    await expect(server.getByTestId('loading-delayed').locator('.zd-loading-status')).toHaveText(
      '',
    );
    await expect(server.getByTestId('loading-matrix').locator('zd-loading')).toHaveCount(38);
  } finally {
    await noJs.close();
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/loading');
  await page.getByRole('button', { name: 'Start work' }).click();
  await expect(page.getByTestId('loading-delayed').locator('.zd-loading-status')).toHaveText(
    'Loading results',
  );
  await page.getByRole('button', { name: 'Finish work' }).click();
  await expect(page.getByTestId('loading-delayed').locator('.zd-loading-status')).toHaveText('');
  expect((await runAxeScan()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('Alert renders meaningful native content on the server and hydrates controlled dismissal', async ({
  browser,
  page,
  runAxeScan,
}) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const server = await noJs.newPage();
    await server.goto('/alert');
    const alert = server.getByTestId('alert-interactive');
    await expect(alert).toBeVisible();
    await expect(alert).toHaveAttribute('role', 'status');
    await alert.locator('summary').click();
    await expect(alert.locator('details')).toHaveJSProperty('open', true);
    await expect(alert.getByRole('button', { name: 'Close update' })).toBeVisible();
  } finally {
    await noJs.close();
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/alert');
  const alert = page.getByTestId('alert-interactive');
  expect((await runAxeScan('[data-testid="alert-interactive"]')).violations).toEqual([]);
  await page.getByRole('button', { name: 'Accept close: false' }).click();
  await alert.getByRole('button', { name: 'Close update' }).click();
  await expect(alert).toBeHidden();
  await page.getByRole('button', { name: 'Show message' }).click();
  await expect(alert).toBeVisible();
  expect(errors).toEqual([]);
});

test('Theme Controller renders deterministic server choices and restores browser preference after hydration', async ({
  browser,
  page,
  runAxeScan,
}) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
  try {
    const server = await noJs.newPage();
    await server.goto('/theme-controller');
    await expect(server.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(server.getByTestId('theme-fixture')).toHaveAttribute(
      'data-zd-theme-ready',
      'false',
    );
    await expect(server.getByRole('combobox', { name: 'Page theme' })).toHaveValue('system');
    await expect(server.getByRole('radio', { name: 'System', exact: true })).toBeChecked();
  } finally {
    await noJs.close();
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => localStorage.setItem('zd-theme-fixture', 'light'));
  await page.goto('/theme-controller');
  await expect(page.getByTestId('theme-fixture')).toHaveAttribute('data-zd-theme-ready', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('combobox', { name: 'Page theme' })).toHaveValue('light');
  await page.getByRole('button', { name: 'Use system', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByTestId('theme-nested')).toHaveAttribute('data-theme', 'light');
  expect((await runAxeScan()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('Modal stays closed on the server and hydrates native focus and scroll ownership', async ({
  browser,
  page,
  runAxeScan,
}) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const server = await noJs.newPage();
    await server.goto('/modal');
    await expect(server.getByRole('button', { name: 'Open native', exact: true })).toBeVisible();
    await expect(server.locator('dialog,.cdk-overlay-pane')).toHaveCount(0);
    await expect(server.locator('html')).not.toHaveClass(/cdk-global-scrollblock/);
  } finally {
    await noJs.close();
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/modal');
  const trigger = page.getByRole('button', { name: 'Open native', exact: true });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Editor', exact: true })).toBeVisible();
  await expect(page.getByRole('textbox')).toBeFocused();
  await expect(page.locator('html')).toHaveClass(/cdk-global-scrollblock/);
  expect((await runAxeScan()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass(/cdk-global-scrollblock/);
  await page.getByRole('button', { name: 'Open overlay', exact: true }).click();
  await page.getByRole('button', { name: 'More actions' }).click();
  await expect(page.getByRole('menuitem')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.cdk-overlay-pane')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('FAB renders native closed disclosure and hydrates actions and Tooltip', async ({
  browser,
  page,
  runAxeScan,
}) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const server = await noJs.newPage();
    await server.goto('/fab');
    await expect(server.getByTestId('fab-local').locator('.zd-fab-trigger')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(server.getByTestId('fab-local').locator('.zd-fab-actions')).toBeHidden();
    await expect(server.getByRole('button', { name: 'New note' })).toBeVisible();
    await expect(server.locator('.cdk-overlay-pane')).toHaveCount(0);
  } finally {
    await noJs.close();
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/fab');
  const root = page.getByTestId('fab-local');
  const trigger = root.locator('.zd-fab-trigger');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const draft = root.getByRole('button', { name: 'Draft', exact: true });
  await expect(draft).toHaveAttribute('data-zd-tooltip-ready', 'true');
  await draft.focus();
  await expect(page.getByRole('tooltip')).toHaveText('Create a draft');
  expect((await runAxeScan()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(errors).toEqual([]);
});

test('Tooltip renders closed semantics and hydrates shared Dropdown focus and dismissal', async ({
  browser,
  page,
  runAxeScan,
}) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const server = await noJs.newPage();
    await server.goto('/tooltip');
    await expect(server.getByTestId('tooltip-plain')).toHaveAttribute(
      'data-zd-tooltip-ready',
      'false',
    );
    await expect(server.getByTestId('tooltip-plain')).toHaveAttribute(
      'aria-describedby',
      'tooltip-existing',
    );
    await expect(server.locator('.cdk-overlay-pane')).toHaveCount(0);
    await expect(server.getByRole('tooltip')).toHaveCount(0);
  } finally {
    await noJs.close();
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/tooltip');
  await expect(page.getByTestId('tooltip-plain')).toHaveAttribute('data-zd-tooltip-ready', 'true');
  await page.getByTestId('tooltip-plain').focus();
  await expect(page.getByRole('tooltip')).toHaveText('Saves your current draft.');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Menu with help' }).click();
  await expect(page.getByRole('dialog', { name: 'Menu help' })).toBeVisible();
  await page.keyboard.press('F2');
  await expect(page.getByRole('textbox', { name: 'Draft name' })).toBeFocused();
  await expect(page.getByRole('menu', { name: 'Draft actions' })).toBeVisible();
  expect((await runAxeScan()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('menuitem', { name: 'Edit settings' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.cdk-overlay-pane')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('Swap renders native controls without JavaScript and hydrates controlled activation', async ({
  browser,
  page,
  runAxeScan,
}) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const server = await noJs.newPage();
    await server.goto('/swap');
    await expect(server.getByRole('checkbox', { name: 'Notifications' })).not.toBeChecked();
    await expect(server.getByRole('button', { name: 'Mute', exact: true })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await expect(server.getByTestId('swap-checkbox').locator('[zdSwapOff]')).toBeVisible();
    await server.getByRole('checkbox', { name: 'Notifications' }).check();
    await expect(server.getByTestId('swap-checkbox').locator('[zdSwapOn]')).toBeVisible();
  } finally {
    await noJs.close();
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/swap');
  await page.getByRole('checkbox', { name: 'Notifications' }).check();
  await page.getByRole('button', { name: 'Mute', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('true / true / 0');
  expect((await runAxeScan()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('Public Dropdown stays closed on the server and hydrates nested Aria menus', async ({
  browser,
  page,
  request,
  runAxeScan,
}) => {
  const html = await (await request.get('/dropdown')).text();
  expect(html).not.toContain('class="cdk-overlay-pane"');
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const server = await noJs.newPage();
    await server.goto('/dropdown');
    await expect(server.getByRole('button', { name: 'Actions', exact: true })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(server.getByRole('menu')).toHaveCount(0);
  } finally {
    await noJs.close();
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/dropdown');
  await expect(page.getByTestId('dropdown-menu-root')).toHaveAttribute(
    'data-zd-dropdown-ready',
    'true',
  );
  const trigger = page.getByRole('button', { name: 'Actions', exact: true });
  await trigger.click();
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Archive', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('archive');
  await expect(trigger).toBeFocused();
  await expect(page.locator('.cdk-overlay-pane')).toHaveCount(0);
  expect((await runAxeScan()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('Dropdown probe renders a closed trigger and hydrates Angular 21 menu portals', async ({
  browser,
  page,
  request,
}) => {
  const html = await (await request.get('/dropdown-probe')).text();
  expect(html).toContain('id="dropdown-probe-trigger"');
  expect(html).not.toContain('id="dropdown-probe-menu"');
  expect(html).not.toContain('class="cdk-overlay-pane"');
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const serverPage = await noJs.newPage();
    await serverPage.goto('/dropdown-probe');
    await expect(serverPage.getByRole('button', { name: 'Open actions' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(serverPage.getByRole('menu')).toHaveCount(0);
  } finally {
    await noJs.close();
  }
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/dropdown-probe');
  const trigger = page.getByRole('button', { name: 'Open actions' });
  await trigger.click();
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('edit');
  await expect(trigger).toBeFocused();
  await expect(page.locator('.cdk-overlay-pane')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('Calendar renders civil-date selection and hydrates native controls and popup', async ({
  browser,
  page,
  request,
  runAxeScan,
}) => {
  const first = await (await request.get('/calendar')).text();
  const second = await (await request.get('/calendar')).text();
  const ids = (html: string) =>
    [...html.matchAll(/id="(zd-calendar-[^"]*-day-2026-09-14)"/g)].map(match => match[1]);
  expect(ids(first)).toHaveLength(4);
  expect(ids(second)).toEqual(ids(first));
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const serverPage = await noJs.newPage();
  await serverPage.goto('/calendar');
  await expect(
    serverPage.getByTestId('calendar-single').locator('[data-date="2026-09-14"]'),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(
    serverPage.getByTestId('calendar-single').locator('[data-date="2026-09-15"]'),
  ).toHaveAttribute('aria-disabled', 'true');
  await expect(serverPage.getByTestId('calendar-popup').locator('dialog')).not.toBeVisible();
  await noJs.close();
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/calendar');
  await page.getByTestId('calendar-single').locator('[data-date="2026-09-16"]').click();
  await expect(page.getByTestId('calendar-single').getByRole('status')).toHaveText('2026-09-16');
  const trigger = page.getByRole('button', { name: 'Departure: Choose date' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  expect((await runAxeScan('docs-calendar-test-fixture')).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('Calendar grid spike preserves date semantics before and after hydration', async ({
  browser,
  page,
  request,
}) => {
  const first = await (await request.get('/calendar-grid-probe')).text();
  const second = await (await request.get('/calendar-grid-probe')).text();
  for (const html of [first, second]) {
    expect(html).toContain('id="calendar-probe-cell-14"');
    expect(html).toContain('id="calendar-probe-day-14"');
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const serverPage = await noJs.newPage();
  await serverPage.goto('/calendar-grid-probe');
  const serverProbe = serverPage.getByTestId('calendar-grid-probe');
  await expect(serverProbe.locator('#calendar-probe-cell-14')).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(serverProbe.locator('#calendar-probe-cell-15')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(serverProbe.getByRole('button', { name: 'September 14, 2026' })).toBeVisible();
  await noJs.close();
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/calendar-grid-probe');
  const probe = page.getByTestId('calendar-grid-probe');
  await probe.getByRole('button', { name: 'September 14, 2026' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(probe.getByRole('button', { name: 'September 21, 2026' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(probe.getByRole('status')).toHaveText('21');
  await expect(probe.locator('#calendar-probe-cell-21')).toHaveAttribute('aria-selected', 'true');
  expect(errors).toEqual([]);
});

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
  expect(html).toContain('data-testid="diff-example"');
  expect(html).toContain('data-testid="chat-start"');
  expect(html).toContain('data-testid="chat-end"');
  expect(html).toContain('data-testid="aura-rainbow"');
  expect(html).toContain('data-testid="aura-glow"');
  expect(html).toContain('data-testid="hover-3d-example"');
  expect(html).toContain('data-testid="hover-gallery-example"');
  expect(html).toContain('data-testid="list-example"');
  expect(html).toContain('data-testid="table-example"');
  expect(html).toContain('data-testid="text-rotate-example"');
  expect(html).toContain('data-testid="timeline-example"');
  expect(html).toContain('data-testid="stack-example"');
  expect(html).toContain('data-testid="footer-example"');
  expect(html).toContain('data-testid="hero-example"');
  expect(html).toContain('data-testid="indicator-example"');
  expect(html).toContain('data-testid="join-example"');
  expect(html).toContain('data-testid="mask-example"');
  expect(html).toContain('data-testid="stat-example"');
  expect(html).toContain('data-testid="checkbox-example"');
  expect(html).toContain('data-testid="radio-starter"');
  expect(html).toContain('data-testid="filter-example"');
  expect(html).toContain('data-testid="range-example"');
  expect(html).toContain('data-testid="rating-example"');
  expect(html).toContain('data-testid="select-example"');
  expect(html).toContain('data-testid="text-input-example"');
  expect(html).toContain('data-testid="textarea-example"');
  expect(html).toContain('data-testid="toggle-example"');
  expect(html).toContain('data-testid="validator-example"');
  expect(html).toContain('data-testid="otp-example"');
  expect(html).toContain('data-testid="file-input-example"');
  expect(html).toContain('data-testid="browser-mockup-example"');
  expect(html).toContain('data-testid="code-mockup-example"');
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
  await expect(page.locator('form').getByText('Account code', { exact: true })).toHaveAttribute(
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
  await expect(fieldset.locator('#hydrated-fieldset-email')).toBeDisabled();
  await expect(fieldset.locator('#hydrated-fieldset-confirmation')).toBeDisabled();
  await expect(page.getByTestId('fieldset-legend-control')).toBeEnabled();
  await expect(page.getByTestId('fieldset-nested')).not.toHaveAttribute('disabled');
  await expect(fieldset.locator('#hydrated-fieldset-email')).toHaveAttribute(
    'aria-describedby',
    'hydrated-fieldset-help hydrated-fieldset-error',
  );

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

  const select = page.getByTestId('select-example');
  await expect(select).toHaveClass(/select-primary/);
  await expect(select).toHaveClass(/select-lg/);
  await expect(select).toHaveValue('staging');
  await select.selectOption('production');
  await expect(select).toHaveValue('production');
  const multipleSelect = page.getByTestId('select-multiple');
  await expect(multipleSelect).toHaveAttribute('multiple', '');
  await expect(multipleSelect).toHaveValues(['eu']);

  const textInput = page.getByTestId('text-input-example');
  await expect(textInput).toHaveClass(/input-primary/);
  await expect(textInput).toHaveClass(/input-lg/);
  await expect(textInput).toHaveAttribute('type', 'email');
  await textInput.fill('hydrated@example.com');
  await expect(textInput).toHaveValue('hydrated@example.com');
  await expect(page.getByTestId('text-input-password')).toHaveAttribute('type', 'password');

  const textarea = page.getByTestId('textarea-example');
  await expect(textarea).toHaveClass(/textarea-primary/);
  await expect(textarea).toHaveClass(/textarea-lg/);
  await expect(textarea).toHaveAttribute('rows', '4');
  await textarea.fill('Hydrated release note');
  await expect(textarea).toHaveValue('Hydrated release note');

  const toggle = page.getByTestId('toggle-example');
  await expect(toggle).toHaveClass(/toggle-primary/);
  await expect(toggle).toHaveClass(/toggle-lg/);
  await expect(toggle).toBeChecked();
  await toggle.uncheck();
  await expect(toggle).not.toBeChecked();

  const validator = page.getByTestId('validator-example');
  await expect(validator).toHaveClass(/validator/);
  await expect(validator).toHaveAttribute('required', '');
  await expect(validator).toHaveAttribute('aria-describedby', 'validator-hint');
  await expect(page.locator('#validator-hint')).toHaveClass(/validator-hint/);
  expect(await validator.evaluate(input => (input as HTMLInputElement).checkValidity())).toBe(
    false,
  );

  const otp = page.getByTestId('otp-example');
  await expect(otp.locator('input')).toHaveCount(4);
  await expect(otp.locator('input').first()).toHaveAttribute('autocomplete', 'one-time-code');

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

  const diff = page.getByTestId('diff-example');
  await expect(diff).toHaveClass(/diff/);
  await expect(diff).toHaveAttribute('tabindex', '0');
  await expect(page.getByTestId('diff-before')).toHaveClass(/diff-item-1/);
  await expect(page.getByTestId('diff-after')).toHaveClass(/diff-item-2/);
  await expect(page.getByTestId('diff-resizer')).toHaveClass(/diff-resizer/);

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

  const hover3d = page.getByTestId('hover-3d-example');
  await expect(hover3d).toHaveJSProperty('tagName', 'A');
  await expect(hover3d).toHaveClass(/hover-3d/);
  await expect(hover3d).toHaveAttribute('href', '#hover-3d-target');
  await expect(hover3d.locator(':scope > div')).toHaveCount(9);

  const hoverGallery = page.getByTestId('hover-gallery-example');
  await expect(hoverGallery).toHaveJSProperty('tagName', 'FIGURE');
  await expect(hoverGallery).toHaveClass(/hover-gallery/);
  await expect(hoverGallery.locator(':scope > img')).toHaveCount(3);

  const list = page.getByTestId('list-example');
  const listRow = page.getByTestId('list-row-example');
  await expect(list).toHaveJSProperty('tagName', 'UL');
  await expect(list).toHaveClass(/list/);
  await expect(list).toHaveAttribute('aria-label', 'Recently played tracks');
  await expect(listRow).toHaveClass(/list-row/);
  await expect(listRow.locator('[zdListColGrow]')).toHaveClass(/list-col-grow/);
  await expect(listRow.locator('[zdListColWrap]')).toHaveClass(/list-col-wrap/);

  const table = page.getByTestId('table-example');
  await expect(table).toHaveJSProperty('tagName', 'TABLE');
  await expect(table).toHaveClass(/table-sm/);
  await expect(table).toHaveClass(/table-zebra/);
  await expect(table).toHaveClass(/table-pin-rows/);
  await expect(table.locator('caption')).toHaveText('Monthly deployments');

  const textRotate = page.getByTestId('text-rotate-example');
  await expect(textRotate).toHaveClass(/text-rotate/);
  await expect(textRotate.locator(':scope > span > span')).toHaveCount(3);

  const timeline = page.getByTestId('timeline-example');
  await expect(timeline).toHaveClass(/timeline-vertical/);
  await expect(timeline).toHaveClass(/timeline-compact/);
  await expect(timeline.locator('[zdTimelineEnd]')).toHaveClass(/timeline-end/);

  const stack = page.getByTestId('stack-example');
  await expect(stack).toHaveClass(/stack-top/);
  await expect(stack).toHaveClass(/stack-end/);

  const footer = page.getByTestId('footer-example');
  await expect(footer).toHaveClass(/footer-horizontal/);
  await expect(footer.locator('[zdFooterTitle]')).toHaveClass(/footer-title/);

  const hero = page.getByTestId('hero-example');
  await expect(hero).toHaveClass(/hero/);
  await expect(hero.locator('[zdHeroContent]')).toHaveClass(/hero-content/);

  const indicator = page.getByTestId('indicator-example');
  await expect(indicator).toHaveClass(/indicator/);
  await expect(indicator.locator('[zdIndicatorItem]')).toHaveClass(/indicator-item/);
  await expect(indicator.locator('[zdIndicatorItem]')).toHaveClass(/indicator-end/);
  await expect(indicator.locator('[zdIndicatorItem]')).toHaveClass(/indicator-top/);

  const join = page.getByTestId('join-example');
  await expect(join).toHaveClass(/join-vertical/);
  await expect(join.locator('[zdJoinItem]')).toHaveCount(2);
  await expect(page.getByTestId('mask-example')).toHaveClass(/mask-circle/);
  await expect(page.getByTestId('stat-example')).toHaveClass(/stats-vertical/);
  await expect(page.getByTestId('checkbox-example')).toHaveClass(/checkbox-primary/);
  await expect(page.getByTestId('checkbox-example')).toBeChecked();
  await expect(page.getByTestId('radio-starter')).toHaveClass(/radio-primary/);
  await expect(page.getByTestId('radio-starter')).toBeChecked();
  await expect(page.getByTestId('filter-example')).toHaveClass(/filter/);
  await expect(page.getByTestId('range-example')).toHaveClass(/range-primary/);
  await expect(page.getByTestId('rating-example')).toHaveClass(/rating-lg/);
  await expect(page.getByTestId('filter-all')).toBeChecked();
  await expect(page.getByTestId('file-input-example')).toHaveClass(/file-input-primary/);
  await expect(page.getByTestId('file-input-example')).toHaveAttribute(
    'accept',
    'image/png,image/jpeg',
  );

  const browserMockup = page.getByTestId('browser-mockup-example');
  await expect(browserMockup).toHaveClass(/mockup-browser/);
  await expect(browserMockup.locator('[zdBrowserMockupToolbar]')).toHaveClass(
    /mockup-browser-toolbar/,
  );
  await expect(page.getByTestId('code-mockup-example')).toHaveClass(/mockup-code/);

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
