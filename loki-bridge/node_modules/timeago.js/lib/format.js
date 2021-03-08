"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = void 0;

var _date = require("./utils/date");

var _locales = require("./locales.js");

var format = function format(date, locale, nowDate) {
  // diff seconds
  var sec = (0, _date.diffSec)(date, nowDate); // format it with locale

  return (0, _date.formatDiff)(sec, (0, _locales.getLocale)(locale));
};

exports.format = format;