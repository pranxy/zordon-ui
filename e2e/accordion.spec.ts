import { expect, test } from './fixtures/accessibility';

test('Accordion coordinates single and multiple expansion, keyboard navigation and disabled items', async ({
  page,
}) => {
  await page.goto('/__zordon-tests__/accordion');
  const profile = page.getByRole('button', { name: 'Profile', exact: true });
  const billing = page.getByRole('button', { name: 'Billing', exact: true });
  const more = page.getByRole('button', { name: 'More information' });
  await expect(profile).toHaveAttribute('aria-expanded', 'true');
  await profile.focus();
  await page.keyboard.press('ArrowDown');
  await expect(billing).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(billing).toHaveAttribute('aria-expanded', 'true');
  await expect(profile).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('ArrowDown');
  await expect(more).toBeFocused();
  await page.keyboard.press('Home');
  await expect(profile).toBeFocused();
  await page.keyboard.press('End');
  await expect(more).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(profile).toBeFocused();
  await page.keyboard.press(' ');
  await expect(profile).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Toggle multiple' }).click();
  await billing.click();
  await expect(profile).toHaveAttribute('aria-expanded', 'true');
  await expect(billing).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Collapse all' }).click();
  await expect(profile).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Expand all' }).click();
  await expect(more).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('button', { name: 'Locked settings' })).toBeDisabled();
  await page.getByRole('button', { name: 'Toggle group disabled' }).click();
  await expect(profile).toBeDisabled();
});

test('Accordion preserves or recreates lazy views and isolates panel controls and nested groups', async ({
  page,
}) => {
  await page.goto('/__zordon-tests__/accordion');
  const profile = page.getByRole('button', { name: 'Profile', exact: true });
  const billing = page.getByRole('button', { name: 'Billing', exact: true });
  const name = page.getByRole('textbox', { name: 'Profile name' });
  await name.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await expect(name).toBeFocused();
  await expect(profile).toHaveAttribute('aria-expanded', 'true');
  const nested = page.getByRole('button', { name: 'Nested option' });
  await nested.click();
  await expect(nested).toHaveAttribute('aria-expanded', 'true');
  await expect(profile).toHaveAttribute('aria-expanded', 'true');
  await nested.focus();
  await page.keyboard.press('End');
  await expect(nested).toBeFocused();
  await billing.click();
  const note = page.getByRole('textbox', { name: 'Invoice note' });
  await note.fill('Discard me');
  await billing.click();
  await expect(page.locator('input[aria-label="Invoice note"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Toggle preservation' }).click();
  await billing.click();
  await note.fill('Keep me');
  await billing.click();
  await expect(page.locator('input[aria-label="Invoice note"]')).toHaveCount(1);
  await expect(note).toBeHidden();
  await billing.click();
  await expect(note).toHaveValue('Keep me');
});

test('Accordion supports consumer deep links and native details and radio alternatives', async ({
  page,
}) => {
  await page.goto('/__zordon-tests__/accordion#billing');
  await expect(page.getByRole('button', { name: 'Billing', exact: true })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(page.getByRole('button', { name: 'Profile', exact: true })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await page.locator('summary').filter({ hasText: 'Native second' }).click();
  await expect(page.getByTestId('accordion-fixture').locator('details').nth(1)).toHaveAttribute(
    'open',
    '',
  );
  await expect(
    page.getByTestId('accordion-fixture').locator('details').first(),
  ).not.toHaveAttribute('open');
  await page.getByRole('radio', { name: 'Radio second' }).check();
  await expect(page.getByRole('radio', { name: 'Radio first' })).not.toBeChecked();
});

test('Accordion keeps labelled relationships, focus, RTL layout and reduced motion with axe', async ({
  page,
  runAxeScan,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 360, height: 1600 });
  await page.goto('/__zordon-tests__/accordion');
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  const profile = page.getByRole('button', { name: 'Profile', exact: true });
  await profile.focus();
  await expect(profile).toBeFocused();
  expect(await profile.evaluate(el => getComputedStyle(el).textAlign)).toBe('start');
  const panel = page.locator('#profile-panel');
  await expect(panel).toHaveAttribute('aria-labelledby', 'profile-trigger');
  expect(
    await page
      .locator('zd-accordion-item')
      .first()
      .evaluate(el => getComputedStyle(el).transitionDuration),
  ).toBe('0s');
  expect(
    await page.getByTestId('accordion-fixture').evaluate(el => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  expect((await runAxeScan()).violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active' });
  await profile.focus();
  await page.keyboard.press('Home');
  await expect(profile).toBeVisible();
  expect(await profile.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
});
