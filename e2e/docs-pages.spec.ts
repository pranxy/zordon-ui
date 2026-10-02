import { expect, test } from '@playwright/test';

test('Table showcase supports Aria controls and CDK dynamic column templates', async ({ page }) => {
  await page.goto('/components/table');
  await expect(page.locator('html')).toHaveAttribute('data-hydrated');
  const grid = page.getByRole('grid', { name: 'Service controls' });
  await grid.getByRole('rowheader', { name: 'API', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(grid.locator('#service-controls-status-api')).toBeFocused();
  await grid.getByRole('checkbox', { name: 'Alerts for Web' }).focus();
  await page.keyboard.press('Space');
  await expect(grid.getByRole('checkbox', { name: 'Alerts for Web' })).toBeChecked();
  await grid.getByRole('button', { name: 'Restart API' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Restart requested for API.' }),
  ).toBeVisible();
  await page.getByRole('checkbox', { name: 'Show status column' }).uncheck();
  await expect(grid.getByRole('columnheader')).toHaveText(['Service', 'Alerts', 'Action']);
  const data = page.getByRole('table', { name: 'Release ownership', exact: true });
  await expect(data.getByRole('columnheader')).toHaveText(['Service', 'Owner', 'Action']);
  await page.getByRole('button', { name: 'Reverse columns', exact: true }).click();
  await expect(data.getByRole('columnheader')).toHaveText(['Action', 'Owner', 'Service']);
  await page.getByRole('checkbox', { name: 'Show owner column' }).uncheck();
  await expect(data.getByRole('columnheader')).toHaveText(['Action', 'Service']);
  await data.getByRole('button', { name: 'Inspect Web' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Inspecting Web.' })).toBeVisible();
});

test('Modal notes guard retains typed changes for Cancel, Escape and backdrop, then saves', async ({
  page,
}) => {
  await page.goto('/components/modal');
  const opener = page.getByRole('button', { name: 'Edit notes', exact: true });
  const dialog = page.getByRole('dialog', { name: 'Edit notes', exact: true });
  await opener.click();
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await opener.click();
  const notes = dialog.getByRole('textbox', { name: 'Notes', exact: true });
  await notes.pressSequentially(' Remember the proof copy.');
  const draft = await notes.inputValue();
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(dialog).toBeVisible();
  await expect(notes).toHaveValue(draft);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await expect(notes).toHaveValue(draft);
  await page.mouse.click(5, 5);
  await expect(dialog).toBeVisible();
  await expect(notes).toHaveValue(draft);
  await dialog.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  await opener.click();
  await expect(notes).toHaveValue(draft);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

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
  {
    path: '/components/fab',
    heading: 'FAB / Speed Dial',
    body: /discloses a small group of native actions/i,
  },
  { path: '/components/modal', heading: 'Modal', body: /typed results, close guards/i },
  {
    path: '/components/theme-controller',
    heading: 'Theme Controller',
    body: /theme preference scope/i,
  },
  { path: '/components/swap', heading: 'Swap', body: /native checkbox or toggle button/i },
  { path: '/components/accordion', heading: 'Accordion', body: /Grouped expandable sections/i },
  { path: '/components/avatar', heading: 'Avatar', body: /presence dot on your own markup/i },
  { path: '/components/aura', heading: 'Aura', body: /decorative moving light/i },
  { path: '/components/badge', heading: 'Badge', body: /compact label, count or marker/i },
  { path: '/components/card', heading: 'Card', body: /card container and its body/i },
  {
    path: '/components/chat-bubble',
    heading: 'Chat Bubble',
    body: /message layout on your own list items/i,
  },
  { path: '/components/countdown', heading: 'Countdown', body: /rolling-digit animation/i },
  { path: '/components/diff', heading: 'Diff', body: /draggable divider/i },
  {
    path: '/components/hover-3d',
    heading: 'Hover 3D Card',
    body: /tilt-toward-the-pointer effect/i,
  },
  {
    path: '/components/hover-gallery',
    heading: 'Hover Gallery',
    body: /hover-to-preview image strip/i,
  },
  { path: '/components/list', heading: 'List', body: /row layout on a native list/i },
  { path: '/components/stat', heading: 'Stat', body: /layout for key numbers/i },
  { path: '/components/status', heading: 'Status', body: /small state dot/i },
  { path: '/components/table', heading: 'Table', body: /Angular Aria keyboard navigation/i },
  { path: '/components/text-rotate', heading: 'Text Rotate', body: /rotating words/i },
  { path: '/components/timeline', heading: 'Timeline', body: /event layout on a native list/i },
  { path: '/components/divider', heading: 'Divider', body: /separator line on your own element/i },
  { path: '/components/drawer', heading: 'Drawer', body: /side panel beside your content/i },
  {
    path: '/components/footer',
    heading: 'Footer',
    body: /footer grid on your own footer element/i,
  },
  { path: '/components/hero', heading: 'Hero', body: /large banner layout/i },
  { path: '/components/indicator', heading: 'Indicator', body: /corner placement/i },
  { path: '/components/join', heading: 'Join', body: /segmented group/i },
  { path: '/components/mask', heading: 'Mask', body: /shape masks/i },
  { path: '/components/stack', heading: 'Stack', body: /layered pile/i },
  { path: '/components/browser-mockup', heading: 'Browser Mockup', body: /browser window frame/i },
  { path: '/components/code-mockup', heading: 'Code Mockup', body: /terminal-style frame/i },
  { path: '/components/carousel', heading: 'Carousel', body: /scroll-snap layout/i },
  { path: '/components/collapse', heading: 'Collapse', body: /native disclosures/i },
  { path: '/components/breadcrumbs', heading: 'Breadcrumbs', body: /ending at the current page/i },
  { path: '/components/dock', heading: 'Dock', body: /bottom navigation bar of native links/i },
  { path: '/components/link', heading: 'Link', body: /underlined link style on a real anchor/i },
  { path: '/components/navbar', heading: 'Navbar', body: /start, center and end regions/i },
  { path: '/components/pagination', heading: 'Pagination', body: /keep the page in the URL/i },
  { path: '/components/steps', heading: 'Steps', body: /named ordered list of process steps/i },
  { path: '/components/tabs', heading: 'Tabs', body: /built on Angular Aria/i },
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
      'disabled',
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
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });

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
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });

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
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const mute = page.getByRole('button', { name: 'Mute', exact: true });
  await expect(mute).toHaveAttribute('aria-pressed', 'false');
  await mute.click();
  await expect(mute).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/components/collapse');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const refund = page.locator('details', { hasText: 'When is my refund issued?' });
  await refund.locator('summary').click();
  await expect(refund).toHaveAttribute('open', '');

  await page.goto('/components/carousel');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const track = page.getByRole('region', { name: 'Landscape gallery with controls' });
  const before = await track.evaluate(element => element.scrollLeft);
  await page.getByRole('button', { name: 'Next' }).click();
  await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeGreaterThan(before);
});

test('Menu groups and the selectable tree update their models', async ({ page }) => {
  await page.goto('/components/menu');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });

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
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });

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
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const all = page.getByRole('checkbox', { name: 'All toppings' });
  expect(await all.evaluate(input => (input as HTMLInputElement).indeterminate)).toBe(true);
  await all.check();
  expect(await all.evaluate(input => (input as HTMLInputElement).indeterminate)).toBe(false);
  await expect(page.getByRole('checkbox', { name: 'Olives' })).toBeChecked();
  await page.getByRole('checkbox', { name: 'I accept the terms' }).check();
  await expect(page.locator('#terms-help')).toContainText('Valid');

  await page.goto('/components/radio');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  await page.getByRole('radio', { name: 'Team' }).check();
  await expect(page.getByText('Plan: team')).toBeVisible();

  await page.goto('/components/toggle');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  await page.getByRole('checkbox', { name: 'Weekly digest' }).check();
  await expect(page.getByText('On: Email notifications, Weekly digest')).toBeVisible();
});

test('text controls report validation, counts and selections', async ({ page }) => {
  await page.goto('/components/text-input');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const email = page.getByRole('textbox', { name: 'Work email' });
  await email.fill('ada');
  await email.blur();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#email-help')).toContainText('Enter an email address');
  await email.fill('ada@example.com');
  await expect(email).not.toHaveAttribute('aria-invalid', 'true');

  await page.goto('/components/textarea');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  await page.getByRole('textbox', { name: 'Summary' }).fill('Hello');
  await expect(page.locator('#summary-count')).toHaveText('5 of 140 characters');

  await page.goto('/components/select');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
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
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const volume = page.getByRole('slider', { name: 'Volume' });
  await volume.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('output[for="volume"]')).toHaveText('41%');
  await expect(volume).toHaveAttribute('aria-valuetext', '41 percent');

  await page.goto('/components/rating');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
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
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const street = page.getByRole('textbox', { name: 'Street' }).last();
  await expect(street).toBeDisabled();
  await page.getByRole('checkbox', { name: 'Same as shipping address' }).uncheck();
  await expect(street).toBeEnabled();
  await expect(page.getByRole('combobox', { name: 'Country' })).toBeEnabled();

  await page.goto('/components/filter');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  await page.getByRole('radio', { name: 'Closed' }).check();
  await expect(page.getByText('Showing: Closed')).toBeVisible();
  await page.getByRole('radio', { name: 'All statuses' }).check();
  await expect(page.getByText('Showing: all')).toBeVisible();

  await page.goto('/components/label');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  await page.locator('label[for="company"]').click();
  await expect(page.getByRole('textbox', { name: 'Company' })).toBeFocused();

  await page.goto('/components/file-input');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  await page.locator('#attachments').setInputFiles([
    { name: 'invoice.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') },
    { name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from('png') },
  ]);
  await expect(page.getByText('invoice.pdf, photo.png')).toBeVisible();
});

test('Validator and OTP report validity and completion', async ({ page }) => {
  await page.goto('/components/validator');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
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
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  await page.getByRole('textbox', { name: 'Verification code digit 1 of 6' }).nth(1).focus();
  await page.keyboard.type('123456');
  await expect(page.getByText('Value: "123456" · complete')).toBeVisible();
  await page.getByRole('textbox', { name: 'Card PIN digit 1 of 4' }).focus();
  await page.keyboard.type('4321');
  await expect(page.getByText('Checking 4 digits…')).toBeVisible();
});

test('Alert, Loading and Skeleton report their state', async ({ page }) => {
  await page.goto('/components/alert');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const saved = page.locator('zd-alert').filter({ hasText: 'Changes saved' });
  await page.getByRole('button', { name: 'Dismiss saved message' }).click();
  await expect(saved).toBeHidden();
  await expect(page.getByText('Closed by: close-button')).toBeVisible();
  await page.getByRole('button', { name: 'Show again' }).click();
  await expect(saved).toBeVisible();
  await page.getByRole('button', { name: 'Copy link' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Link copied' })).toBeVisible();

  await page.goto('/components/loading');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const results = page.getByRole('region', { name: 'Results' });
  await page.getByRole('button', { name: 'Run search' }).click();
  await expect(results).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('status').filter({ hasText: 'Searching' })).toHaveCount(1);
  await expect(results).toHaveText('12 results');
  await expect(results).toHaveAttribute('aria-busy', 'false');

  await page.goto('/components/skeleton');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const profile = page.getByRole('region', { name: 'Profile' });
  await expect(profile).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Loading' }).click();
  await expect(profile).toHaveAttribute('aria-busy', 'false');
  await expect(profile.getByRole('heading', { name: 'Ada Lovelace' })).toBeVisible();
  await expect(page.getByText('Profile ready', { exact: true })).toBeVisible();
});

test('Progress and Radial Progress expose their values', async ({ page }) => {
  await page.goto('/components/progress');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const upload = page.getByRole('progressbar', { name: 'Upload' }).nth(1);
  const send = page.getByRole('button', { name: 'Send 50 MB' });
  await expect(upload).toHaveAttribute('aria-valuetext', '0 of 200 MB');
  for (let step = 0; step < 4; step++) await send.click();
  await expect(upload).toHaveAttribute('aria-valuetext', '200 of 200 MB');
  await expect(page.getByText('Upload complete', { exact: true })).toBeVisible();
  await expect(send).toBeDisabled();

  await page.goto('/components/radial-progress');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const battery = page.getByRole('progressbar', { name: 'Battery' });
  await expect(battery).toHaveAttribute('aria-valuenow', '20');
  await page.getByRole('button', { name: '+10%' }).click();
  await expect(battery).toHaveAttribute('aria-valuenow', '30');
  await expect(battery).toHaveAttribute('aria-valuetext', '30%');
});

test('Toast queues notifications and Tooltip describes its host', async ({ page }) => {
  await page.goto('/components/toast');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
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
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
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

test('FAB, Modal and Theme Controller keep native focus and state', async ({ page }) => {
  await page.goto('/components/fab');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  // The speed-dial trigger; its name changes to the close label while open.
  const create = page.locator('.zd-fab-trigger').nth(1);
  await expect(create).toHaveAccessibleName('Create');
  await create.click();
  await expect(create).toHaveAccessibleName('Close create actions');
  await expect(create).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Template' }).click();
  await expect(page.getByText('Chose: Template')).toBeVisible();
  await expect(create).toHaveAttribute('aria-expanded', 'false');
  await expect(create).toBeFocused();
  await page.getByRole('button', { name: 'New note' }).click();
  await expect(page.getByText('Notes: 1')).toBeVisible();

  await page.goto('/components/modal');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const rename = page.getByRole('button', { name: 'Rename', exact: true }).nth(1);
  await rename.click();
  const dialog = page.getByRole('dialog', { name: 'Rename file' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('textbox', { name: 'Name' }).fill('summary.pdf');
  await dialog.getByRole('button', { name: 'Save' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText('File: summary.pdf')).toBeVisible();
  await expect(rename).toBeFocused();

  await page.getByRole('button', { name: 'Delete project' }).click();
  const confirm = page.getByRole('dialog', { name: 'Delete project' });
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(confirm.getByText('The project could not be deleted. Try again.')).toBeVisible();
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(confirm).toBeHidden();
  await expect(page.getByText('Website redesign: deleted')).toBeVisible();

  await page.getByRole('button', { name: 'Edit notes' }).click();
  const notes = page.getByRole('dialog', { name: 'Edit notes' });
  await notes.getByRole('textbox', { name: 'Notes' }).fill('Changed');
  await page.keyboard.press('Escape');
  await expect(notes).toBeVisible();
  await notes.getByRole('button', { name: 'Save' }).click();
  await expect(notes).toBeHidden();

  await page.goto('/components/theme-controller');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const scope = page.getByRole('region', { name: 'Playground theme scope', exact: true });
  await expect(scope).toHaveAttribute('data-theme', 'light');
  await scope.getByRole('radio', { name: 'Dark' }).check();
  await expect(scope).toHaveAttribute('data-theme', 'dark');
  await expect(scope.getByText('Using dark')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const inner = page.getByRole('complementary', { name: 'Inner theme scope' });
  await expect(inner).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('checkbox', { name: 'Dark outer' }).check();
  await expect(page.getByRole('region', { name: 'Outer theme scope' })).toHaveAttribute(
    'data-theme',
    'dark',
  );
});

test('Breadcrumbs, Dock, Link and Navbar keep native navigation semantics', async ({ page }) => {
  await page.goto('/components/breadcrumbs');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const docsTrail = page.getByRole('navigation', { name: 'Documentation path' });
  await expect(docsTrail.locator('[aria-current="page"]')).toContainText('Breadcrumbs');
  const pagePath = page.getByRole('navigation', { name: 'Page path' });
  await pagePath.locator('summary').click();
  await expect(pagePath.getByRole('link', { name: 'Components' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(pagePath.getByRole('link', { name: 'Components' })).toBeHidden();

  await page.goto('/components/dock');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const dock = page.getByRole('navigation', { name: 'Example destinations' });
  await expect(dock.getByRole('link', { name: 'Dock' })).toHaveAttribute('aria-current', 'page');
  await expect(dock.getByRole('link', { name: /3 unread messages/ })).toBeVisible();
  await page.getByRole('button', { name: 'Costs' }).click();
  const sections = page.getByRole('navigation', { name: 'Report sections' });
  await expect(sections.getByRole('link', { name: 'Costs' })).toHaveAttribute(
    'aria-current',
    'page',
  );

  await page.goto('/components/link');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const billing = page.getByRole('link', { name: 'Billing history' });
  await expect(billing).toHaveAttribute('aria-disabled', 'true');
  // Playwright won't click an aria-disabled element; Enter is the native activation.
  await billing.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/components\/link$/);
  await page.getByRole('checkbox', { name: 'Account paid' }).check();
  await expect(billing).not.toHaveAttribute('aria-disabled', 'true');
  await expect(
    page.getByRole('navigation', { name: 'Example links' }).getByRole('link', { name: 'Link' }),
  ).toHaveAttribute('aria-current', 'page');
  // Enabled again, the same routerLink navigates.
  await billing.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/components\/modal$/);

  await page.goto('/components/navbar');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const filters = page.getByRole('button', { name: 'Filters', exact: true });
  await expect(filters).toHaveAttribute('aria-expanded', 'false');
  await filters.click();
  await expect(filters).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('region', { name: 'Filters' })).toBeVisible();
});

test('Pagination, Steps and Tabs accept requests through their inputs', async ({ page }) => {
  await page.goto('/components/pagination');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const results = page.getByRole('navigation', { name: 'Result pages' });
  await results.getByRole('button', { name: 'Page 6' }).click();
  await expect(results.getByRole('button', { name: 'Page 6' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.getByRole('combobox', { name: 'Items per page' }).first().selectOption('50');
  await expect(page.getByText('Showing orders 1–50 of 1,284')).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Catalog pages' })
    .getByRole('link', { name: 'Page 2' })
    .click();
  await expect(page).toHaveURL(/[?&]page=2/);

  await page.goto('/components/steps');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  await page.getByRole('button', { name: 'Continue' }).first().click();
  await expect(page.getByRole('heading', { name: 'Delivery' })).toBeFocused();
  await expect(
    page.getByRole('list', { name: 'Checkout' }).locator('[aria-current="step"]'),
  ).toContainText('Delivery');

  await page.goto('/components/tabs');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const project = page.getByRole('tablist', { name: 'Project' });
  await project.getByRole('tab', { name: 'Overview' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(project.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByText('12 commits and 3 reviews this week.')).toBeVisible();
  await page.getByRole('button', { name: 'Close app.ts' }).click();
  await expect(
    page.getByRole('tablist', { name: 'Open files' }).getByRole('tab', { name: 'app.ts' }),
  ).toHaveCount(0);
});

test('Calendar selects ranges, popup dates and form values', async ({ page }) => {
  await page.goto('/components/calendar');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });

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

test('Accordion and Countdown keep their state in sync', async ({ page }) => {
  await page.goto('/components/accordion');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const profile = page.locator('#settings-profile-trigger');
  await expect(profile).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Collapse all' }).click();
  await expect(profile).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('Profile closed', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Expand all' }).click();
  await expect(page.locator('#settings-privacy-trigger')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Profile open', { exact: true })).toBeVisible();

  await page.goto('/components/countdown');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const change = page.getByRole('group', { name: 'Change the value' });
  const value = page.locator('.countdown').first().locator('span');
  await expect(value).toHaveAttribute('aria-label', '42');
  await change.getByRole('button', { name: '+10' }).click();
  await expect(value).toHaveAttribute('aria-label', '52');
});

test('Stat actions update the value and Table keeps native headers', async ({ page }) => {
  await page.goto('/components/stat');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const balance = page.getByRole('region', { name: 'Account summary' });
  await expect(balance.getByText('€1,280')).toBeVisible();
  await balance.getByRole('button', { name: 'Add €100' }).click();
  await expect(balance.getByText('€1,380')).toBeVisible();

  await page.goto('/components/table');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const plans = page.getByRole('table', { name: 'Plan limits' });
  await expect(plans.getByRole('rowheader', { name: 'Storage' })).toBeVisible();
  await expect(plans.getByRole('columnheader', { name: 'Team' })).toBeVisible();
  const scroller = page.getByRole('region', { name: 'Deployments, scrollable' });
  await scroller.focus();
  await expect(scroller).toBeFocused();
});

test('Drawer close requests can be refused and Join keeps native submit', async ({ page }) => {
  await page.goto('/components/drawer');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const edit = page.getByRole('button', { name: 'Edit profile' });
  await edit.click();
  const drawer = page.getByRole('dialog', { name: 'Edit profile' });
  await expect(drawer).toBeVisible();
  await drawer.getByRole('textbox', { name: 'Name' }).fill('Ada King');
  await page.keyboard.press('Escape');
  await expect(page.getByText('Last request: escape')).toBeVisible();
  await expect(drawer.getByText('You have unsaved changes.')).toBeVisible();
  await drawer.getByRole('button', { name: 'Discard changes' }).click();
  await expect(drawer).toHaveCount(0);
  await expect(edit).toBeFocused();

  await page.goto('/components/join');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const search = page.getByRole('search');
  await search.getByRole('searchbox', { name: 'Search components' }).fill('drawer');
  await search.getByRole('searchbox', { name: 'Search components' }).press('Enter');
  await expect(page.getByText('Searched for “drawer”')).toBeVisible();
});

test('Avatar starts with an image and placeholder replaces it in both directions', async ({
  page,
}) => {
  await page.goto('/components/avatar');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const playground = page.locator('docs-playground');
  const photo = playground.getByRole('img', { name: 'Ada', exact: true });
  const placeholder = playground.getByRole('checkbox', { name: 'placeholder', exact: true });
  await expect(placeholder).not.toBeChecked();
  await expect(photo).toBeVisible();
  await expect
    .poll(() => photo.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
  await placeholder.check();
  await expect(photo).toHaveCount(0);
  await expect(playground.locator('[zdAvatar]')).toHaveText('AL');
  await expect(playground.locator('docs-code-block')).not.toContainText('<img');
  await placeholder.uncheck();
  await expect(photo).toBeVisible();
  await expect(playground.locator('docs-code-block')).toContainText('<img');
});

test('Card changes from stacked to side-by-side and keeps native selection behavior', async ({
  page,
}) => {
  await page.goto('/components/card');
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
  const responsive = page.locator('section[aria-labelledby="responsive"] article');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() =>
      responsive.evaluate(card => {
        const media = card.querySelector('figure')!.getBoundingClientRect();
        const body = card.querySelector('[zdCardBody]')!.getBoundingClientRect();
        return body.top >= media.bottom - 1 && Math.abs(media.left - body.left) <= 1;
      }),
    )
    .toBe(true);
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect
    .poll(() =>
      responsive.evaluate(card => {
        const media = card.querySelector('figure')!.getBoundingClientRect();
        const body = card.querySelector('[zdCardBody]')!.getBoundingClientRect();
        return body.left >= media.right - 1 && Math.abs(media.top - body.top) <= 1;
      }),
    )
    .toBe(true);
  const selectable = page.locator('section[aria-labelledby="selectable"]');
  const breakfast = selectable.getByRole('checkbox', { name: /^Breakfast/ });
  const kayak = selectable.getByRole('checkbox', { name: /^Kayak hire/ });
  await breakfast.focus();
  await page.keyboard.press('Space');
  await expect(breakfast).toBeChecked();
  await kayak.check();
  await expect(breakfast).toBeChecked();
  await expect(kayak).toBeChecked();
  await expect(selectable.getByRole('checkbox', { name: /^Sauna/ })).toBeDisabled();
  const cabin = selectable.getByRole('radio', { name: /^Cabin/ });
  const suite = selectable.getByRole('radio', { name: /^Suite/ });
  await cabin.focus();
  await page.keyboard.press('ArrowRight');
  await expect(suite).toBeChecked();
  await expect(cabin).not.toBeChecked();
  await page.keyboard.press('ArrowRight');
  await expect(cabin).toBeChecked();
  await expect(selectable.getByRole('radio', { name: /^Lodge/ })).toBeDisabled();
});

for (const direction of ['ltr', 'rtl'] as const) {
  test(`Carousel aligns image controls and indicators precisely in ${direction}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: direction === 'rtl' ? 'reduce' : 'no-preference' });
    await page.goto('/components/carousel');
    await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
    await page
      .locator('html')
      .evaluate((element, dir) => element.setAttribute('dir', dir), direction);
    const controlSection = page.locator('section[aria-labelledby="controls"]');
    const track = page.getByRole('region', {
      name: 'Landscape gallery with controls',
      exact: true,
    });
    const indicators = page.getByRole('region', {
      name: 'Landscape gallery with indicators',
      exact: true,
    });
    const next = controlSection.getByRole('button', { name: 'Next', exact: true });
    const previous = controlSection.getByRole('button', { name: 'Previous', exact: true });
    await expect(previous).toBeDisabled();
    const indicatorBefore = await indicators.evaluate(element => element.scrollLeft);
    for (const index of [1, 2]) {
      await next.click();
      await expect
        .poll(() =>
          track.evaluate((element, target) => {
            const bounds = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            const image = element.children[target].getBoundingClientRect();
            return style.direction === 'rtl'
              ? Math.abs(image.right - (bounds.right - parseFloat(style.paddingRight)))
              : Math.abs(image.left - (bounds.left + parseFloat(style.paddingLeft)));
          }, index),
        )
        .toBeLessThanOrEqual(1);
    }
    await expect(next).toBeDisabled();
    await expect
      .poll(() => indicators.evaluate(element => element.scrollLeft))
      .toBe(indicatorBefore);
    await previous.click();
    await expect(next).toBeEnabled();
    await expect
      .poll(() =>
        track.evaluate(element => {
          const bounds = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const image = element.children[1].getBoundingClientRect();
          return style.direction === 'rtl'
            ? Math.abs(image.right - (bounds.right - parseFloat(style.paddingRight)))
            : Math.abs(image.left - (bounds.left + parseFloat(style.paddingLeft)));
        }),
      )
      .toBeLessThanOrEqual(1);
    const controlsBefore = await track.evaluate(element => element.scrollLeft);
    const choiceSection = page.locator('section[aria-labelledby="indicators"]');
    await choiceSection
      .getByRole('button', { name: 'Show Coast', exact: true })
      .scrollIntoViewIfNeeded();
    const documentBefore = await page.evaluate(() => window.scrollY);
    await choiceSection.getByRole('button', { name: 'Show Coast', exact: true }).click();
    await expect
      .poll(() =>
        indicators.evaluate(element => {
          const bounds = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const image = element.children[2].getBoundingClientRect();
          return style.direction === 'rtl'
            ? Math.abs(image.right - (bounds.right - parseFloat(style.paddingRight)))
            : Math.abs(image.left - (bounds.left + parseFloat(style.paddingLeft)));
        }),
      )
      .toBeLessThanOrEqual(1);
    await expect(
      choiceSection.getByRole('button', { name: 'Show Coast', exact: true }),
    ).toHaveAttribute('aria-current', 'true');
    await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBe(controlsBefore);
    expect(await page.evaluate(() => window.scrollY)).toBe(documentBefore);
    await choiceSection.getByRole('button', { name: 'Show Morning lake', exact: true }).click();
    await expect
      .poll(() => indicators.evaluate(element => Math.abs(element.scrollLeft)))
      .toBeLessThanOrEqual(1);
  });
}

test('Aura size changes the halo while its content stays the same size', async ({ page }) => {
  await page.goto('/components/aura');
  const sizes = page.locator('section[aria-labelledby="sizes"] [zdAura]');
  await expect(sizes).toHaveCount(5);
  const measurements = await sizes.evaluateAll(elements =>
    elements.map(element => {
      const child = element.firstElementChild!.getBoundingClientRect();
      return {
        padding: Number.parseFloat(getComputedStyle(element).paddingTop),
        width: child.width,
        height: child.height,
      };
    }),
  );
  expect(measurements.map(item => item.padding)).toEqual([0, 1, 2, 2.5, 4]);
  expect(new Set(measurements.map(item => item.width)).size).toBe(1);
  expect(new Set(measurements.map(item => item.height)).size).toBe(1);
  const playground = page.locator('docs-playground');
  const aura = playground.locator('[zdAura]');
  const child = aura.getByRole('button', { name: 'Start free trial' });
  const initial = await child.boundingBox();
  for (const [size, padding] of [
    ['xs', '0px'],
    ['sm', '1px'],
    ['md', '2px'],
    ['lg', '2.5px'],
    ['xl', '4px'],
  ] as const) {
    await playground
      .getByRole('group', { name: 'size', exact: true })
      .getByRole('radio', { name: size, exact: true })
      .check();
    await expect(aura).toHaveCSS('padding-top', padding);
    const current = await child.boundingBox();
    expect(current!.width).toBe(initial!.width);
    expect(current!.height).toBe(initial!.height);
  }
});

test('List dedicates spare width to the intended column and wraps the note below', async ({
  page,
}) => {
  await page.goto('/components/list');
  for (const [anchor, index] of [
    ['second-column', 1],
    ['grow', 2],
  ] as const) {
    const row = page.locator(`section[aria-labelledby="${anchor}"] [zdListRow]`).first();
    const boxes = await row.locator(':scope > *').evaluateAll(elements =>
      elements.map(element => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      }),
    );
    expect(boxes[index].width).toBeGreaterThan(boxes[0].width);
    expect(boxes[index].width).toBeGreaterThan(boxes.at(-1)!.width);
  }
  const wrapped = page.locator('section[aria-labelledby="third-column-wrap"] [zdListRow]');
  const image = await wrapped.locator('img').boundingBox();
  const note = await wrapped.locator('[zdListColWrap]').boundingBox();
  expect(note!.y).toBeGreaterThanOrEqual(image!.y + image!.height);
  expect(note!.width).toBeGreaterThan(image!.width * 3);
});

test('Stat changes from vertical to horizontal at the large breakpoint', async ({ page }) => {
  await page.goto('/components/stat');
  const items = page.locator('section[aria-labelledby="responsive"] [zdStat]');
  await page.setViewportSize({ width: 600, height: 900 });
  const firstSmall = await items.nth(0).boundingBox();
  const secondSmall = await items.nth(1).boundingBox();
  expect(secondSmall!.y).toBeGreaterThanOrEqual(firstSmall!.y + firstSmall!.height);
  await page.setViewportSize({ width: 1440, height: 900 });
  const firstLarge = await items.nth(0).boundingBox();
  const secondLarge = await items.nth(1).boundingBox();
  expect(Math.abs(firstLarge!.y - secondLarge!.y)).toBeLessThanOrEqual(1);
  expect(secondLarge!.x).toBeGreaterThanOrEqual(firstLarge!.x + firstLarge!.width);
});

test('Countdown exposes all static units and keeps its independent timer controls', async ({
  page,
}) => {
  await page.goto('/components/countdown');
  for (const anchor of ['labels-below', 'boxes']) {
    const section = page.locator(`section[aria-labelledby="${anchor}"] .preview`);
    for (const unit of ['days', 'hours', 'minutes', 'seconds'])
      await expect(section.getByText(unit, { exact: true })).toBeVisible();
    await expect(section.locator('[aria-label="15 days"]')).toHaveText('15');
  }
  const clock = page.locator('section[aria-labelledby="clock"]');
  await expect(clock.locator('[aria-label="10 hours"]')).toHaveText('10');
  await expect(clock.locator('[aria-label="24 minutes"]')).toHaveText('24');
  await expect(clock.locator('[aria-label="36 seconds"]')).toHaveText('36');
  await page.locator('html').evaluate(element => element.setAttribute('dir', 'rtl'));
  const hoursBox = await clock.locator('[aria-label="10 hours"]').boundingBox();
  const secondsBox = await clock.locator('[aria-label="36 seconds"]').boundingBox();
  expect(hoursBox!.x).toBeLessThan(secondsBox!.x);
  const timer = page.locator('section[aria-labelledby="timer"]');
  await timer.getByRole('button', { name: 'Start', exact: true }).click();
  await timer.getByRole('button', { name: 'Pause', exact: true }).click();
  await timer.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(timer.locator('[aria-label="1 minutes"]')).toHaveText('1');
  await expect(timer.locator('[aria-label="30 seconds"]')).toHaveText('30');
});

test('Hover Gallery swaps the product photograph and restores its useful first view', async ({
  page,
}) => {
  await page.goto('/components/hover-gallery');
  const gallery = page.locator('figure[zdHoverGallery]').first();
  const photos = gallery.locator('img');
  await gallery.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(photos.nth(0)).toHaveCSS('opacity', '1');
  await expect(photos.nth(1)).toHaveCSS('opacity', '0');
  await gallery.hover();
  await expect(photos.nth(1)).toHaveCSS('opacity', '1');
  await page.mouse.move(0, 0);
  await expect(photos.nth(0)).toBeVisible();
  await expect(photos.nth(1)).toHaveCSS('opacity', '0');
});

test('Diff keyboard focus reveals each generated image while retaining the text comparison', async ({
  page,
}) => {
  await page.goto('/components/diff');
  const comparison = page.locator('figure[zdDiff]');
  const before = comparison.locator('[zdDiffItem1]');
  const proportion = () =>
    before.evaluate(
      element =>
        element.getBoundingClientRect().width /
        element.parentElement!.getBoundingClientRect().width,
    );
  await comparison.focus();
  await expect.poll(proportion).toBeGreaterThan(0.9);
  await page.keyboard.press('Tab');
  await expect(before).toBeFocused();
  await expect.poll(proportion).toBeLessThan(0.1);
  await expect(page.locator('section[aria-labelledby="text"] .preview')).toContainText(
    'Our plans start at $12 per seat.',
  );
});

const imageShowcasePages = [
  'avatar',
  'card',
  'carousel',
  'chat-bubble',
  'diff',
  'hover-3d',
  'hover-gallery',
  'list',
  'stat',
] as const;
for (const slug of imageShowcasePages) {
  test(`${slug} showcase serves local generated images without layout overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/components/${slug}`);
    const images = page.locator('main img[src*="images/showcase/"]');
    expect(await images.count()).toBeGreaterThan(0);
    for (const image of await images.all()) {
      if (await image.isVisible()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate(element => {
              const img = element as HTMLImageElement;
              return img.complete && img.naturalWidth > 0;
            }),
          )
          .toBe(true);
      }
      const src = await image.getAttribute('src');
      expect(src).toMatch(/^images\/showcase\/[a-z-]+\.webp$/);
      await expect(image).toHaveAttribute('width', /^\d+$/);
      await expect(image).toHaveAttribute('height', /^\d+$/);
      expect(await image.getAttribute('alt')).not.toBeNull();
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
