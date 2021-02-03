import type { Formats as BaseFormats } from 'intl-messageformat';
import { RelativeTimeFormatOptions } from './-private/formatters/format-relative';

interface EmberIntlFormats extends Partial<BaseFormats> {
  relative?: Record<string, RelativeTimeFormatOptions>;
}

export interface Formats extends EmberIntlFormats {
  /**
   * Format options that are always implied. Explicitly specified options when
   * invoking a formatter override these base options.
   */
  base?: {
    [F in keyof EmberIntlFormats]?: NonNullable<EmberIntlFormats[F]>[keyof NonNullable<EmberIntlFormats[F]>];
  };

  /**
   * Format options that are implicitly used, if neither a named `format` nor
   * any other know options were specified when invoking a formatter. These
   * are combined with and override the `base` options.
   */
  defaults?: {
    [F in keyof EmberIntlFormats]?: NonNullable<EmberIntlFormats[F]>[keyof NonNullable<EmberIntlFormats[F]>];
  };
}
