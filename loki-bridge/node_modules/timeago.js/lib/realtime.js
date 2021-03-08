"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.cancel = void 0;

var _dom = require("./utils/dom");

var _date = require("./utils/date");

var _locales = require("./locales");

// 所有的 timer
var TimerPool = {};

var clear = function clear(tid) {
  clearTimeout(tid);
  delete TimerPool[tid];
}; // 定时运行


var run = function run(node, date, localeFunc, nowDate) {
  // 先清理掉之前的
  clear((0, _dom.getTimerId)(node)); // get diff seconds

  var diff = (0, _date.diffSec)(date, nowDate); // render

  node.innerHTML = (0, _date.formatDiff)(diff, localeFunc);
  var tid = setTimeout(function () {
    run(node, date, localeFunc, nowDate);
  }, (0, _date.nextInterval)(diff) * 1000, 0x7FFFFFFF); // there is no need to save node in object. Just save the key

  TimerPool[tid] = 0;
  (0, _dom.saveTimerId)(node, tid);
}; // 取消一个 node 的实时渲染


var cancel = function cancel(node) {
  if (node) clear((0, _dom.getTimerId)(node)); // get the timer of DOM node(native / jq).
  else for (var tid in TimerPool) {
      clear(tid);
    }
}; // 实时渲染一系列节点


exports.cancel = cancel;

var render = function render(nodes, locale, nowDate) {
  // by .length
  if (nodes.length === undefined) nodes = [nodes];
  var node;

  for (var i = 0; i < nodes.length; i++) {
    node = nodes[i];
    var date = (0, _dom.getDateAttribute)(node);
    var localeFunc = (0, _locales.getLocale)(locale);
    run(node, date, localeFunc, nowDate);
  }

  return nodes;
};

exports.render = render;