"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "format", {
  enumerable: true,
  get: function get() {
    return _format.format;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function get() {
    return _realtime.render;
  }
});
Object.defineProperty(exports, "cancel", {
  enumerable: true,
  get: function get() {
    return _realtime.cancel;
  }
});
Object.defineProperty(exports, "register", {
  enumerable: true,
  get: function get() {
    return _locales.register;
  }
});
exports.version = void 0;

var _format = require("./format");

var _realtime = require("./realtime");

var _locales = require("./locales");

/**
 * Created by hustcc on 18/5/20.
 * Contract: i@hust.cc
 */
var version = "4.0.0-beta.2";
exports.version = version;