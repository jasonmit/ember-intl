export default {
  /*
  // Format options that are always implied. Explicitly specified options when
  // invoking a formatter override these base options.
  base: {
    time: {
      hour: 'numeric',
      minute: 'numeric'
    },
    date: { },
    number: { },
    relative: { },
  },

  // Format options that are implicitly used, if neither a named `format` nor
  // any other know options were specified when invoking a formatter. These
  // are combined with and override the `base` options.
  defaults: {
    time: {
      hour: 'numeric',
      minute: 'numeric'
    },
    date: { },
    number: { },
    relative: { },
  },
  */

  time: {
    hhmmss: {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    },
  },
  date: {
    hhmmss: {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    },
  },
  relative: {
    days: {
      unit: 'days',
      numeric: 'always'
    }
  },
  number: {
    compact: { notation: 'compact' },
    EUR: {
      style: 'currency',
      currency: 'EUR',
    },
    USD: {
      style: 'currency',
      currency: 'USD',
    },
  },
};
