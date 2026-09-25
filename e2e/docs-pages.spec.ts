import { expect, test } from '@playwright/test';

const publicRoutes = [
  { path: '/', heading: 'Zordon UI', body: /Angular component library/i },
  {
    path: '/docs/getting-started',
    heading: 'Get started with Zordon UI',
    body: /Tailwind CSS 4/i,
  },
  { path: '/components', heading: 'Components', body: /component catalogue/i },
  { path: '/components/button', heading: 'Button', body: /native action element/i },
  { path: '/components/dropdown', heading: 'Dropdown', body: /anchored panel/i },
  { path: '/components/kbd', heading: 'Kbd', body: /keys and shortcuts/i },
  { path: '/components/swap', heading: 'Swap', body: /native checkbox or toggle button/i },
  { path: '/components/carousel', heading: 'Carousel', body: /scroll-snap layout/i },
  { path: '/components/collapse', heading: 'Collapse', body: /native disclosures/i },
  { path: '/components/megamenu', heading: 'Megamenu', body: /multi-column surface/i },
  { path: '/components/menu', heading: 'Menu', body: /selectable Angular Aria tree/i },
  { path: '/components/calendar', heading: 'Calendar', body: /civil YYYY-MM-DD strings/i },
  { path: '/components/checkbox', heading: 'Checkbox', body: /native checkbox you already write/i },
  { path: '/components/radio', heading: 'Radio', body: /native radio inputs/i },
  { path: '/components/range', heading: 'Range', body: /native range input/i },
  { path: '/components/rating', heading: 'Rating', body: /laid out as daisyUI stars/i },
  { path: '/components/select', heading: 'Select', body: /native select/i },
  { path: '/components/text-input', heading: 'Text Input', body: /native input of any text type/i },
  { path: '/components/textarea', heading: 'Textarea', body: /native textarea/i },
  { path: '/components/toggle', heading: 'Toggle', body: /styled as a daisyUI switch/i },
  { path: '/components/alert', heading: 'Alert', body: /dismissal is a request you accept/i },
  { path: '/components/loading', heading: 'Loading', body: /indeterminate loading indicator/i },
  { path: '/components/progress', heading: 'Progress', body: /labelled native progress bar/i },
  { path: '/components/radial-progress', heading: 'Radial Progress', body: /ring that fills/i },
  { path: '/components/skeleton', heading: 'Skeleton', body: /decorative placeholders/i },
  { path: '/components/toast', heading: 'Toast', body: /non-blocking notifications/i },
  { path: '/components/tooltip', heading: 'Tooltip', body: /interactive help panel/i },
  { path: '/components/fieldset', heading: 'Fieldset', body: /passes its disabled state/i },
  { path: '/components/file-input', heading: 'File Input', body: /native file input/i },
  { path: '/components/filter', heading: 'Filter', body: /daisyUI filter buttons/i },
  { path: '/components/label', heading: 'Label', body: /floating label/i },
  { path: '/components/validator', heading: 'Validator', body: /validity colors/i },
  { path: '/components/otp', heading: 'OTP', body: /one-time codes/i },
  {
    path: '/foundations/typed-vocabularies',
    heading: 'Typed foundation vocabularies',
    body: /shared type-only vocabularies/i,
  },
  {
    path: '/guides/styling-and-theming',
    heading: 'Styling and theming',
    body: /daisyUI themes/i,
  },
  { path: '/resources', heading: 'Resources', body: /repository/i },
] as const;

test('representative public routes deliver unique, meaningful documents without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const titles = new Map<string, string>();

  try {
    for (const route of publicRoutes) {
      await test.step(route.path, async () => {
        const response = await page.goto(route.path);

        expect(response?.status(), `${route.path} should respond successfully`).toBe(200);
        await expect(page.locator('main')).toContainText(route.body);
        await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
        await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();

        const title = await page.title();
        expect(title.trim(), `${route.path} should have a document title`).not.toBe('');
        titles.set(route.path, title);
      });
    }
  } finally {
    await context.close();
  }

  expect(
    new Set(titles.values()).size,
    'every representative route should have a unique title',
  ).toBe(publicRoutes.length);
});

test('Button reference exposes its planned contract in server-rendered HTML', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    const response = await page.goto('/components/button');

    expect(response?.status()).toBe(200);
    await expect(page.getByText('planned', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Install and import' })).toBeVisible();
    await expect(
      page.locator('pre code').filter({ hasText: '@pranxy/zordon-ui/button' }).first(),
    ).toBeVisible();

    const apiSection = page.locator('section').filter({
      has: page.getByRole('heading', { level: 2, name: 'API', exact: true }),
    });
    await expect(apiSection.getByRole('table')).toBeVisible();
    await expect(apiSection.getByRole('columnheader', { name: 'Input' })).toBeVisible();
    await expect(apiSection.getByRole('columnheader', { name: 'Type' })).toBeVisible();
    await expect(apiSection.getByRole('rowheader')).toHaveText([
      'color',
      'variant',
      'size',
      'layout',
      'active',
      'pressed',
      'loading',
      'zdDisabled',
    ]);

    for (const section of ['Playground', 'Examples', 'Accessibility', 'Customization', 'SSR']) {
      await expect(
        page.getByRole('heading', { level: 2, name: section, exact: true }),
      ).toBeVisible();
    }
  } finally {
    await context.close();
  }
});

test('representative templates expose their distinguishing content without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    await page.goto('/');
    const representativePreview = page.getByRole('region', {
      name: 'Native semantics, daisyUI presentation',
    });
    await expect(
      representativePreview.getByText('Representative preview', { exact: true }),
    ).toBeVisible();
    await expect(representativePreview.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(page.getByText(/Coverage status:/)).toBeVisible();

    await page.goto('/docs/getting-started');
    for (const heading of ['Manual setup', 'Troubleshooting', 'Next steps']) {
      await expect(
        page.getByRole('heading', { level: 2, name: heading, exact: true }),
      ).toBeVisible();
    }
    for (const step of [
      'Install packages',
      'Configure the application',
      'Use your first component',
    ]) {
      await expect(page.getByRole('heading', { level: 3, name: step, exact: true })).toBeVisible();
    }
    await expect(page.locator('pre code').filter({ hasText: 'npm install' })).toBeVisible();

    await page.goto('/components');
    await expect(page.getByRole('heading', { name: 'Actions', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Button', exact: true }).first()).toHaveAttribute(
      'href',
      '/components/button',
    );
    await expect(page.locator('docs-component-card')).toHaveCount(68);

    await page.goto('/components?category=data-input');
    await expect(page.getByRole('heading', { name: 'Data input', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Actions', exact: true })).toHaveCount(0);

    await page.goto('/resources');
    for (const link of ['Roadmap and status', 'Changelog and releases', 'Contributing']) {
      await expect(page.getByRole('link', { name: link, exact: true })).toBeVisible();
    }
  } finally {
    await context.close();
  }
});

test('Button code copy reports success after hydration', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/components/button');

  await page.getByRole('button', { name: 'Copy import code' }).click();

  await expect(page.getByRole('status').filter({ hasText: /Copied/i })).toBeVisible();
});

test('Button playground updates the live button and snippet, then resets', async ({ page }) => {
  await page.goto('/components/button');
  await expect(page.getByRole('button', { name: 'Copy import code' })).toBeVisible();

  const controls = page.getByRole('form', { name: 'Button controls' });
  const color = controls.getByRole('group', { name: 'color' });
  const variant = controls.getByRole('group', { name: 'variant' });
  const snippet = page.locator('pre[aria-label="playground.html code"]');

  await expect(color.getByRole('radio', { name: 'primary' })).toBeChecked();
  await expect(snippet).toHaveText('<button zdButton color="primary">Save changes</button>');

  await color.getByRole('radio', { name: 'secondary' }).check();
  await variant.getByRole('radio', { name: 'outline' }).check();
  await expect(snippet).toHaveText(
    '<button zdButton color="secondary" variant="outline">Save changes</button>',
  );
  const preview = page.locator('docs-playground').getByRole('button', { name: 'Save changes' });
  await expect(preview).toHaveClass(/btn-secondary/);
  await expect(preview).toHaveClass(/btn-outline/);

  await controls.getByRole('button', { name: 'Reset playground' }).click();

  await expect(color.getByRole('radio', { name: 'primary' })).toBeChecked();
  await expect(variant.getByRole('radio', { name: 'solid' })).toBeChecked();
  await expect(snippet).toHaveText('<button zdButton color="primary">Save changes</button>');
});

test('Button enhancement reserves its layout at desktop and mobile widths', async ({ browser }) => {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 375, height: 812 },
  ]) {
    await test.step(`${viewport.width}px`, async () => {
      const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport });
      const hydratedContext = await browser.newContext({ viewport });
      const staticPage = await staticContext.newPage();
      const hydratedPage = await hydratedContext.newPage();

      try {
        await staticPage.goto('/components/button');
        await hydratedPage.goto('/components/button');
        await expect(hydratedPage.getByRole('button', { name: 'Copy import code' })).toBeVisible();

        const staticApiPosition = await staticPage
          .getByRole('heading', { level: 2, name: 'API', exact: true })
          .boundingBox();
        const hydratedApiPosition = await hydratedPage
          .getByRole('heading', { level: 2, name: 'API', exact: true })
          .boundingBox();

        expect(
          staticApiPosition,
          'the server-rendered API heading should have a layout box',
        ).not.toBeNull();
        expect(
          hydratedApiPosition,
          'the hydrated API heading should have a layout box',
        ).not.toBeNull();
        expect(
          Math.abs((staticApiPosition?.y ?? 0) - (hydratedApiPosition?.y ?? 0)),
          `hydration should not move the API heading at ${viewport.width}px`,
        ).toBeLessThanOrEqual(2);
      } finally {
        await staticContext.close();
        await hydratedContext.close();
      }
    });
  }
});

test('Dropdown and Kbd references expose their contracts in server-rendered HTML', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    await page.goto('/components/dropdown');
    await expect(page.getByText('preview', { exact: true }).first()).toBeVisible();
    await expect(
      page.locator('pre code').filter({ hasText: '@pranxy/zordon-ui/dropdown' }).first(),
    ).toBeVisible();
    // Closed triggers only: no overlay markup is rendered on the server.
    await expect(page.getByRole('button', { name: 'Actions ▾' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(page.getByRole('menu')).toHaveCount(0);
    for (const table of ['Dropdown root inputs', 'Dropdown outputs and methods']) {
      await expect(page.getByRole('table', { name: table })).toBeVisible();
    }

    await page.goto('/components/kbd');
    await expect(page.locator('kbd.kbd.kbd-xl').first()).toHaveText('Esc');
    await expect(page.getByRole('table', { name: 'Kbd inputs' }).getByRole('rowheader')).toHaveText(
      ['size'],
    );
  } finally {
    await context.close();
  }
});

test('Dropdown menu opens by keyboard, selects, and restores focus', async ({ page }) => {
  await page.goto('/components/dropdown');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });

  const trigger = page.getByRole('button', { name: 'Actions ▾' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const menu = page.getByRole('menu', { name: 'Document actions' });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('menuitem', { name: 'Rename' })).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Duplicate' })).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(menu).toBeHidden();
  await expect(page.getByText('Last action: duplicate')).toBeVisible();
  await expect(trigger).toBeFocused();
});

test('Dropdown playground snippet follows placement inputs', async ({ page }) => {
  await page.goto('/components/dropdown');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });

  const controls = page.getByRole('form', { name: 'Dropdown controls' });
  await controls.getByRole('group', { name: 'side' }).getByRole('radio', { name: 'top' }).check();
  await controls.getByRole('group', { name: 'align' }).getByRole('radio', { name: 'end' }).check();

  await expect(page.locator('pre[aria-label="playground.html code"]')).toContainText(
    '<div zdDropdown mode="menu" side="top" align="end" (selected)="apply($event)">',
  );
});

test('Preview references render their native state on the server', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    await page.goto('/components/collapse');
    // Native details work without JavaScript.
    const shipping = page.locator('details', { hasText: 'Shipping' });
    await expect(shipping).toHaveAttribute('open', '');
    await expect(shipping.getByText('Orders ship within two business days.')).toBeVisible();

    await page.goto('/components/menu');
    const navigation = page.getByRole('navigation', { name: 'Example navigation' });
    await expect(navigation.getByRole('button', { name: 'Components' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(navigation.getByRole('link', { name: 'Dropdown' })).toHaveAttribute(
      'href',
      '/components/dropdown',
    );

    await page.goto('/components/megamenu');
    await expect(page.getByRole('button', { name: 'Components ▾' }).first()).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(page.locator('zd-megamenu-panel')).toHaveCount(0);

    await page.goto('/components/calendar');
    await expect(
      page
        .getByRole('grid', { name: 'Delivery date' })
        .getByRole('button', { name: /September 14/ }),
    ).toHaveAttribute('aria-current', 'date');
  } finally {
    await context.close();
  }
});

test('Swap, Collapse and Carousel examples respond to the platform controls', async ({ page }) => {
  await page.goto('/components/swap');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const mute = page.getByRole('button', { name: 'Mute', exact: true });
  await expect(mute).toHaveAttribute('aria-pressed', 'false');
  await mute.click();
  await expect(mute).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/components/collapse');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const refund = page.locator('details', { hasText: 'When is my refund issued?' });
  await refund.locator('summary').click();
  await expect(refund).toHaveAttribute('open', '');

  await page.goto('/components/carousel');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const track = page.getByRole('region', { name: 'Theme colours with controls' });
  const before = await track.evaluate(element => element.scrollLeft);
  await page.getByRole('button', { name: 'Next' }).click();
  await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeGreaterThan(before);
});

test('Menu groups and the selectable tree update their models', async ({ page }) => {
  await page.goto('/components/menu');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });

  const group = page
    .getByRole('navigation', { name: 'Example navigation' })
    .getByRole('button', { name: 'Components' });
  await group.click();
  await expect(group).toHaveAttribute('aria-expanded', 'false');

  const tree = page.getByRole('tree', { name: 'Project files' });
  await tree.getByRole('treeitem', { name: 'README.md' }).click();
  await expect(page.getByText('Selected: readme')).toBeVisible();
  await expect(tree.getByRole('treeitem', { name: 'README.md' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('Megamenu opens a panel of real links and a keyboard command bar', async ({ page }) => {
  await page.goto('/components/megamenu');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });

  const trigger = page.getByRole('button', { name: 'Components ▾' }).first();
  await trigger.click();
  const panel = page.getByRole('region', { name: 'Components', exact: true });
  await expect(panel.getByRole('link', { name: 'Calendar' })).toHaveAttribute(
    'href',
    '/components/calendar',
  );
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();

  const bar = page.getByRole('menubar', { name: 'Editor commands' });
  await bar.getByRole('menuitem', { name: 'Edit' }).focus();
  await page.keyboard.press('ArrowDown');
  const menu = page.getByRole('menu', { name: 'Edit' });
  await expect(menu.getByRole('menuitem', { name: 'Undo' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Last command: undo')).toBeVisible();
});

test('Checkbox, Radio and Toggle examples bind native state through Angular Forms', async ({
  page,
}) => {
  await page.goto('/components/checkbox');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const all = page.getByRole('checkbox', { name: 'All toppings' });
  expect(await all.evaluate(input => (input as HTMLInputElement).indeterminate)).toBe(true);
  await all.check();
  expect(await all.evaluate(input => (input as HTMLInputElement).indeterminate)).toBe(false);
  await expect(page.getByRole('checkbox', { name: 'Olives' })).toBeChecked();
  await page.getByRole('checkbox', { name: 'I accept the terms' }).check();
  await expect(page.locator('#terms-help')).toContainText('Valid');

  await page.goto('/components/radio');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  await page.getByRole('radio', { name: 'Team' }).check();
  await expect(page.getByText('Plan: team')).toBeVisible();

  await page.goto('/components/toggle');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  await page.getByRole('checkbox', { name: 'Weekly digest' }).check();
  await expect(page.getByText('On: Email notifications, Weekly digest')).toBeVisible();
});

test('text controls report validation, counts and selections', async ({ page }) => {
  await page.goto('/components/text-input');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const email = page.getByRole('textbox', { name: 'Work email' });
  await email.fill('ada');
  await email.blur();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#email-help')).toContainText('Enter an email address');
  await email.fill('ada@example.com');
  await expect(email).not.toHaveAttribute('aria-invalid', 'true');

  await page.goto('/components/textarea');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  await page.getByRole('textbox', { name: 'Summary' }).fill('Hello');
  await expect(page.locator('#summary-count')).toHaveText('5 of 140 characters');

  await page.goto('/components/select');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  await page.getByRole('combobox', { name: 'Region' }).selectOption('us-east');
  await expect(page.getByText('Region: us-east')).toBeVisible();
  expect(
    await page
      .getByRole('option', { name: 'Milan (full)' })
      .evaluate(option => (option as HTMLOptionElement).disabled),
  ).toBe(true);
  await page.getByRole('listbox', { name: 'Channels' }).selectOption(['SMS', 'Push']);
  await expect(page.getByText('Channels: SMS, Push')).toBeVisible();
});

test('Range and Rating stay native radio and slider controls', async ({ page }) => {
  await page.goto('/components/range');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const volume = page.getByRole('slider', { name: 'Volume' });
  await volume.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('output[for="volume"]')).toHaveText('41%');
  await expect(volume).toHaveAttribute('aria-valuetext', '41 percent');

  await page.goto('/components/rating');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const delivery = page.getByRole('group', { name: 'How was your delivery?' });
  await delivery.getByRole('radio', { name: '5 stars' }).check();
  await expect(page.getByText('Rating: 5 of 5')).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByText('Rating: 4 of 5')).toBeVisible();
  await delivery.getByRole('radio', { name: 'No rating' }).check();
  await expect(page.getByText('Rating: 0 of 5')).toBeVisible();
});

test('Fieldset, Filter, Label and File Input keep native behaviour', async ({ page }) => {
  await page.goto('/components/fieldset');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const street = page.getByRole('textbox', { name: 'Street' }).last();
  await expect(street).toBeDisabled();
  await page.getByRole('checkbox', { name: 'Same as shipping address' }).uncheck();
  await expect(street).toBeEnabled();
  await expect(page.getByRole('combobox', { name: 'Country' })).toBeEnabled();

  await page.goto('/components/filter');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  await page.getByRole('radio', { name: 'Closed' }).check();
  await expect(page.getByText('Showing: Closed')).toBeVisible();
  await page.getByRole('radio', { name: 'All statuses' }).check();
  await expect(page.getByText('Showing: all')).toBeVisible();

  await page.goto('/components/label');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  await page.locator('label[for="company"]').click();
  await expect(page.getByRole('textbox', { name: 'Company' })).toBeFocused();

  await page.goto('/components/file-input');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  await page.locator('#attachments').setInputFiles([
    { name: 'invoice.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') },
    { name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from('png') },
  ]);
  await expect(page.getByText('invoice.pdf, photo.png')).toBeVisible();
});

test('Validator and OTP report validity and completion', async ({ page }) => {
  await page.goto('/components/validator');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const email = page.getByRole('textbox', { name: 'Work email' });
  const hint = page.locator('#work-email-hint');
  await expect(hint).toBeHidden();
  await email.fill('ada');
  await email.blur();
  await expect(hint).toBeVisible();
  const invite = page.getByRole('textbox', { name: 'Invite code' });
  await invite.fill('abc');
  await invite.blur();
  await expect(invite).toHaveAttribute('aria-invalid', 'true');
  await invite.fill('ABCD1234');
  await expect(invite).toHaveAttribute('aria-invalid', 'false');

  await page.goto('/components/otp');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  await page.getByRole('textbox', { name: 'Verification code digit 1 of 6' }).nth(1).focus();
  await page.keyboard.type('123456');
  await expect(page.getByText('Value: "123456" · complete')).toBeVisible();
  await page.getByRole('textbox', { name: 'Card PIN digit 1 of 4' }).focus();
  await page.keyboard.type('4321');
  await expect(page.getByText('Checking 4 digits…')).toBeVisible();
});

test('Alert, Loading and Skeleton report their state', async ({ page }) => {
  await page.goto('/components/alert');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const saved = page.locator('zd-alert').filter({ hasText: 'Changes saved' });
  await page.getByRole('button', { name: 'Dismiss saved message' }).click();
  await expect(saved).toBeHidden();
  await expect(page.getByText('Closed by: close-button')).toBeVisible();
  await page.getByRole('button', { name: 'Show again' }).click();
  await expect(saved).toBeVisible();
  await page.getByRole('button', { name: 'Copy link' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Link copied' })).toBeVisible();

  await page.goto('/components/loading');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const results = page.getByRole('region', { name: 'Results' });
  await page.getByRole('button', { name: 'Run search' }).click();
  await expect(results).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('status').filter({ hasText: 'Searching' })).toHaveCount(1);
  await expect(results).toHaveText('12 results');
  await expect(results).toHaveAttribute('aria-busy', 'false');

  await page.goto('/components/skeleton');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const profile = page.getByRole('region', { name: 'Profile' });
  await expect(profile).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Loading' }).click();
  await expect(profile).toHaveAttribute('aria-busy', 'false');
  await expect(profile.getByRole('heading', { name: 'Ada Lovelace' })).toBeVisible();
  await expect(page.getByText('Profile ready', { exact: true })).toBeVisible();
});

test('Progress and Radial Progress expose their values', async ({ page }) => {
  await page.goto('/components/progress');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const upload = page.getByRole('progressbar', { name: 'Upload' }).nth(1);
  const send = page.getByRole('button', { name: 'Send 50 MB' });
  await expect(upload).toHaveAttribute('aria-valuetext', '0 of 200 MB');
  for (let step = 0; step < 4; step++) await send.click();
  await expect(upload).toHaveAttribute('aria-valuetext', '200 of 200 MB');
  await expect(page.getByText('Upload complete', { exact: true })).toBeVisible();
  await expect(send).toBeDisabled();

  await page.goto('/components/radial-progress');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const battery = page.getByRole('progressbar', { name: 'Battery' });
  await expect(battery).toHaveAttribute('aria-valuenow', '20');
  await page.getByRole('button', { name: '+10%' }).click();
  await expect(battery).toHaveAttribute('aria-valuenow', '30');
  await expect(battery).toHaveAttribute('aria-valuetext', '30%');
});

test('Toast queues notifications and Tooltip describes its host', async ({ page }) => {
  await page.goto('/components/toast');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const outlet = page.getByRole('region', { name: 'Example notifications' });
  await page.getByRole('button', { name: 'Delete invoice' }).click();
  const toast = (text: string) => outlet.locator('zd-alert').filter({ hasText: text });
  await expect(toast('Invoice deleted')).toBeVisible();
  await toast('Invoice deleted').getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByText('Invoice INV-042 restored')).toBeVisible();
  await expect(toast('Invoice deleted')).toHaveCount(0);
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await expect(toast('Publishing')).toBeVisible();
  await expect(toast('Published')).toBeVisible();

  await page.goto('/components/tooltip');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  const save = page.getByRole('button', { name: 'Save draft' });
  await expect(save).toHaveAttribute('data-zd-tooltip-ready', 'true');
  await save.focus();
  const tip = page.getByRole('tooltip', { name: 'Saves a copy only you can see' });
  await expect(tip).toBeVisible();
  await expect(save).toHaveAccessibleDescription('Saves a copy only you can see');
  await page.keyboard.press('Escape');
  await expect(tip).toBeHidden();
  await page.getByRole('button', { name: 'Show what’s new' }).click();
  await expect(page.getByRole('tooltip', { name: 'New: export to PDF' })).toBeVisible();
});

test('Calendar selects ranges, popup dates and form values', async ({ page }) => {
  await page.goto('/components/calendar');
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });

  const stay = page.getByRole('grid', { name: 'Stay' });
  await stay.getByRole('button', { name: /September 10/ }).click();
  await stay.getByRole('button', { name: /September 13/ }).click();
  await expect(page.getByText('Stay: 2026-09-10 → 2026-09-13')).toBeVisible();

  const choose = page.getByRole('button', { name: 'Departure date: Choose date' });
  await choose.click();
  const dialog = page.getByRole('dialog', { name: 'Departure date' });
  await dialog.getByRole('button', { name: /September 20/ }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText('Departure: 2026-09-20')).toBeVisible();
  await expect(choose).toBeFocused();

  const arrival = page.getByRole('grid', { name: 'Arrival date' });
  await expect(page.locator('#arrival-help')).toContainText('Choose an arrival date.');
  await arrival.getByRole('button', { name: /September 15/ }).click();
  await expect(page.locator('#arrival-help')).toContainText('Valid');
});

test('an unknown route remains a server-rendered, recoverable noindex 404', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    const response = await page.goto('/definitely-not-a-documentation-page');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex,nofollow',
    );
    await expect(page.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/');
    await expect(page.getByRole('link', { name: 'Browse components' })).toHaveAttribute(
      'href',
      '/components',
    );
  } finally {
    await context.close();
  }
});
