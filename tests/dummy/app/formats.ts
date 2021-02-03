import type { Formats } from 'ember-intl/types';

const hhmmss = { hour: 'numeric', minute: 'numeric', second: 'numeric' };

const formats: Formats = {
  date: { hhmmss },
  time: { hhmmss },
  number: {
    compact: { notation: 'compact' },
    EUR: { style: 'currency', currency: 'EUR' },
    USD: { style: 'currency', currency: 'USD' },
    JPY: { style: 'currency', currency: 'JPY' },
    currency: { style: 'currency', minimumFractionDigits: 2 },
  },
};

export default formats;
