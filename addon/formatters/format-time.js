/*
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import FormatDateFormatter from './format-date';

/**
 * @class FormatTimeFormatter
 */
const FormatTime = FormatDateFormatter.extend();

FormatTime.reopenClass({
  formatType: 'time'
});

export default FormatTime;
