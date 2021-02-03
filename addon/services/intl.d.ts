import Evented from '@ember/object/evented';
import Service from '@ember/service';
import { EmberRunTimer } from '@ember/runloop/types';
import type { SafeString } from '@ember/template/-private/handlebars';

import { FormatDate, FormatMessage, FormatNumber, FormatRelative, FormatTime } from '../-private/formatters';
import TranslationContainer from '../-private/store/container';
import { Formats } from '../types';
import { MessageFormatElement } from 'intl-messageformat-parser';
import type Translation from '../-private/store/translation';
import type { TranslationAST } from '../-private/store/translation';

export interface TOptions {
  default?: string | string[];
  locale?: string | string[];
  htmlSafe?: boolean;
  [option: string]: unknown;
}

type FormatterProxy<T extends keyof IntlService['_formatters']> = (
  value: Parameters<IntlService['_formatters'][T]['format']>[1],
  formatOptions?: Parameters<IntlService['_formatters'][T]['format']>[2] & { locale?: string | [string, ...string[]] }
) => ReturnType<IntlService['_formatters'][T]['format']>;

/**
 * By default `utils/intl/missing-message` always returns a string. Users could
 * change this. This type is to indicate that some methods just pass through the
 * return value of that function.
 */
type MissingMessage = string;

export default class IntlService extends Service.extend(Evented) {
  /**
   * @public
   */
  formats: Formats;

  /**
   * Returns an array of registered locale names
   *
   * @property locales
   * @public
   */
  readonly locales: string[];

  locale: string | [string, ...string[]];

  /**
   * Returns the first locale of the currently active locales
   *
   * @property primaryLocale
   * @public
   */
  readonly primaryLocale: string;

  readonly formatRelative: FormatterProxy<'relative'>;
  readonly formatNumber: FormatterProxy<'number'>;
  readonly formatTime: FormatterProxy<'time'>;
  readonly formatDate: FormatterProxy<'date'>;

  // ! This _should_ just be the type shown below, but because TypeScript
  // garbles up function overloads in generics, we need to manually enumerate
  // and duplicate the types here.
  // readonly formatMessage: FormatterProxy<'message'>;
  formatMessage(
    maybeAst: string | TranslationAST,
    options?: Partial<Record<string, unknown>> & { locale?: string | [string, ...string[]]; htmlSafe?: false }
  ): string;
  formatMessage(
    maybeAst: string | TranslationAST,
    options: Partial<Record<string, unknown>> & { locale?: string | [string, ...string[]]; htmlSafe: true }
  ): SafeString;
  formatMessage(
    maybeAst: string | TranslationAST,
    options?: Partial<Record<string, unknown>> & { locale?: string | [string, ...string[]]; htmlSafe?: boolean }
  ): string | SafeString;

  private _translationContainer?: TranslationContainer;

  private _locale: string[];

  private _timer?: EmberRunTimer;

  private _formatters: ReturnType<IntlService['_createFormatters']>;

  private _owner: unknown;

  private onError(info: { kind: unknown; error: unknown }): never;

  lookup(key: string, localeName?: string | string[]): string | undefined;

  lookupAst(
    key: string,
    localeName?: string | string[],
    options?: { resilient: boolean }
  ): MessageFormatElement[] | MissingMessage;

  private validateKeys(keys: string[]): void;
  private validateKeys(keys: unknown[]): void | never;

  t(key: string, options?: TOptions & { htmlSafe?: false }): string | MissingMessage;
  t(key: string, options: TOptions & { htmlSafe: true }): SafeString | MissingMessage;
  t(key: string, options?: TOptions): string | SafeString | MissingMessage;

  exists(key: string, localeName?: string | string[]): boolean;

  setLocale(localeName: string | string[]): void;

  addTranslations(localeName: string, payload: unknown): void;

  translationsFor(localeName: string): Translation | undefined;

  private _localeWithDefault(localeName?: string | string[]): string[];

  private _updateDocumentLanguage(locales: string[]): void;

  private _createFormatters(): {
    message: FormatMessage;
    relative: FormatRelative;
    number: FormatNumber;
    time: FormatTime;
    date: FormatDate;
  };
}
