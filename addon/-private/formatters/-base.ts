/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import { warn } from '@ember/debug';
import type { SafeString } from '@ember/template/-private/handlebars';
import { Formats } from '../../types';
import type IntlMessageFormat from 'intl-messageformat';

export type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];

// eslint-disable-next-line @typescript-eslint/ban-types
const EMPTY_OBJECT: {} = Object.create(null);

export interface FormatterConfig {
  onError: (info: { kind: unknown; error: unknown }) => void;
  readFormatConfig: () => Formats;
}

export interface BaseOptions {
  format?: string;
}

type NamedFormats = Omit<Formats, 'base' | 'defaults'>;

/**
 * @private
 * @hide
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export default abstract class FormatterBase<KnownOptions extends {}> {
  protected readonly config: FormatterConfig;
  protected readonly readFormatConfig: () => Formats;

  static type: keyof NamedFormats;

  protected abstract readonly createNativeFormatter: (
    locales: string | string[],
    options: KnownOptions
  ) => Intl.DateTimeFormat | Intl.RelativeTimeFormat | Intl.NumberFormat | IntlMessageFormat;

  constructor(config: FormatterConfig) {
    this.config = config;

    // NOTE: a fn since we lazily grab the formatter from the config
    // as it can change at runtime by calling intl.set('formats', {...});
    this.readFormatConfig = config.readFormatConfig;
  }

  get options(): readonly (keyof KnownOptions)[] {
    return ([] as unknown[]) as readonly (keyof KnownOptions)[];
  }

  /**
   * Filters out all of the whitelisted formatter options
   *
   * @method filterKnownOptions
   * @param {Object} Options object
   * @return {Object} Options object containing just whitelisted options
   * @private
   */
  filterKnownOptions<O extends BaseOptions>(options?: O): { [K in keyof O & keyof KnownOptions]: O[K] } {
    if (!options) {
      return EMPTY_OBJECT as { [K in keyof O & keyof KnownOptions]: O[K] };
    }

    const found = {} as { [K in keyof O & keyof KnownOptions]: O[K] };

    for (const key in options) {
      if (this.options.includes((key as unknown) as keyof O & keyof KnownOptions)) {
        found[(key as unknown) as keyof O & keyof KnownOptions] =
          options[(key as unknown) as keyof O & keyof KnownOptions];
      }
    }

    return found;
  }

  readOptions<O extends BaseOptions & KnownOptions>(formatOptions?: O): KnownOptions {
    const { base, defaults } = this.getBaseAndDefaultFormat();
    const knownOptions = this.filterKnownOptions(formatOptions);

    if (formatOptions?.format) {
      // If a named `format` was specified, merge it with the other known
      // options, if any.
      const namedFormatsOptions = this.getNamedFormat(formatOptions.format);

      return {
        ...base,
        ...namedFormatsOptions,
        ...knownOptions,
      };
    } else if (Object.keys(knownOptions).length === 0) {
      // If neither a named `format` nor any known options were specified, use
      // the default format for the type, if specified.
      return { ...base, ...defaults } as KnownOptions;
    }

    // If known options are provided, but no named format, just merge them with
    // the base option.
    return { ...base, ...knownOptions };
  }

  validateFormatterOptions(locale: string | string[], _formatterOptions: BaseOptions & KnownOptions): void {
    if (!locale) {
      // TODO: config.onError instead?
      warn(
        `[ember-intl] no locale has been set!  See: https://ember-intl.github.io/ember-intl/docs/quickstart#4-configure-ember-intl`,
        false,
        {
          id: 'ember-intl-no-locale-set',
        }
      );
    }
  }

  getNamedFormat(key: string): void | ValueOf<ValueOf<Required<NamedFormats>>> {
    const formats = this.readFormatConfig();
    const namedFormatsForType = formats[(this.constructor as typeof FormatterBase).type];

    if (namedFormatsForType && namedFormatsForType[key]) {
      return namedFormatsForType[key];
    }
  }

  getBaseAndDefaultFormat(): {
    base: ValueOf<Required<Formats>['base']>;
    defaults: ValueOf<Required<Formats>['defaults']>;
  } {
    const { base, defaults } = this.readFormatConfig();
    const { type } = this.constructor as typeof FormatterBase;
    return { base: base?.[type], defaults: defaults?.[type] };
  }

  abstract format(
    locale: string | string[],
    value: unknown,
    formatOptions?: KnownOptions & BaseOptions
  ): string | SafeString;
}
