import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl, TestContext } from 'ember-intl/test-support';

module('Format Options Merging', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('base + namedFormat + options', async function (this: TestContext, assert) {
    assert.expect(1);
    this.intl.set('formats', {
      base: {
        number: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
      },
      defaults: {
        number: { currency: 'EUR' },
      },
      number: {
        test: { minimumFractionDigits: 3 },
      },
    });
    await render(hbs`{{format-number 1 format="test" minimumFractionDigits=4}}`);
    assert.equal(this.element.textContent, '$1.0000');
  });

  test('base + namedFormat', async function (this: TestContext, assert) {
    assert.expect(1);
    this.intl.set('formats', {
      base: {
        number: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
      },
      defaults: {
        number: { currency: 'EUR' },
      },
      number: {
        test: { minimumFractionDigits: 3 },
      },
    });
    await render(hbs`{{format-number 1 format="test"}}`);
    assert.equal(this.element.textContent, '$1.000');
  });

  test('base + options', async function (this: TestContext, assert) {
    assert.expect(1);
    this.intl.set('formats', {
      base: {
        number: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
      },
      defaults: {
        number: { currency: 'EUR' },
      },
      number: {
        test: { minimumFractionDigits: 3 },
      },
    });
    await render(hbs`{{format-number 1 format="test" minimumFractionDigits=4}}`);
    assert.equal(this.element.textContent, '$1.0000');
  });

  test('base + defaults', async function (this: TestContext, assert) {
    assert.expect(1);
    this.intl.set('formats', {
      base: {
        number: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
      },
      defaults: {
        number: { currency: 'EUR' },
      },
      number: {
        test: { minimumFractionDigits: 3 },
      },
    });
    await render(hbs`{{format-number 1}}`);
    assert.equal(this.element.textContent, '€1.00');
  });

  // v4 -> v5 regression
  // https://github.com/ember-intl/ember-intl/pull/1401
  test('hash options take precedence over named format options', async function (this: TestContext, assert) {
    assert.expect(1);
    this.intl.set('formats', {
      number: { currency: { style: 'currency', currency: 'USD', minimumFractionDigits: 3 } },
    });
    await render(
      hbs`{{format-number 1 format="currency"}} / {{format-number 1 format="currency" minimumFractionDigits=0}}`
    );
    assert.equal(this.element.textContent, '$1.000 / $1', '`minimumFractionDigits` overrides named format');
  });

  test('hash options take precedence over named format options', async function (this: TestContext, assert) {
    assert.expect(1);
    this.intl.set('formats', {
      number: { currency: { style: 'currency', currency: 'USD', minimumFractionDigits: 3 } },
    });
    await render(
      hbs`{{format-number 1 format="currency"}} / {{format-number 1 format="currency" minimumFractionDigits=0}}`
    );
    assert.equal(this.element.textContent, '$1.000 / $1', '`minimumFractionDigits` overrides named format');
  });
});
