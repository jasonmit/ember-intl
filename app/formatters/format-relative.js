/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Formatter from 'ember-intl/formatter-base';

var FormatRelative = Formatter.extend({
    format: function (value, options) {
        var formatOptions = this.filterFormatOptions(options);

        return this.get('intl').formatRelative(value, formatOptions, {
            now: options.now
        });
    }
});

FormatRelative.reopenClass({
    formatOptions: Ember.A(['style', 'units'])
});

export default FormatRelative;
