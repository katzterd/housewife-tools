"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// ==UserScript==
// @name         HouseWife Tools
// @namespace    https://ochan.ru/userjs/
// @version      1.1.10
// @description  UX extension for 314n.org
// @updateURL    https://juribiyan.github.io/housewife-tools/es5/housewife-tools.meta.js
// @downloadURL  https://juribiyan.github.io/housewife-tools/es5/housewife-tools.user.js
// @author       Snivy
// @match        https://314n.org/*
// @match        https://314n.ru/*
// @match        http://314n/*
// @match        https://314n.0chan.one/*
// @match        https://314n.1chan.cyou/*
// @match        https://314n.0chan.club/*
// @match        http://pinachvoguta4szixhost7yh2xkkemjeerfba6tang7siudwusrlsiqd.onion/*
// @match        http://pinachv6cgxmcuojuiabrz6fyizzq2m2m4iu25pcmtesx37f3i4q.b32.i2p/*
// @match        http://[216:acbf:eccd:78f5:f871:7148:dc01:c666]/*
// @icon         https://juribiyan.github.io/housewife-tools/icon.png
// ==/UserScript==

/*-------------------------------- Routing ---------------------------------*/
var MO = new MutationObserver(observe);
function observe(mutationList, observer) {
  var _iterator = _createForOfIteratorHelper(mutationList),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var mutation = _step.value;
      if (mutation.type == 'childList' && mutation.target.id == 'content') {
        if ([].find.call(mutation.addedNodes, function (i) {
          var _i$classList;
          return i === null || i === void 0 ? void 0 : (_i$classList = i.classList) === null || _i$classList === void 0 ? void 0 : _i$classList.contains('content');
        })) {
          determineState();
        } else {
          var msg = [].find.call(mutation.addedNodes, function (i) {
            var _i$classList2, _i$classList3;
            return (i === null || i === void 0 ? void 0 : (_i$classList2 = i.classList) === null || _i$classList2 === void 0 ? void 0 : _i$classList2.contains('error')) || (i === null || i === void 0 ? void 0 : (_i$classList3 = i.classList) === null || _i$classList3 === void 0 ? void 0 : _i$classList3.contains('message'));
          });
          if (msg) {
            messageBroker.handle(msg, msg.className, msg.textContent);
          }
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function reObserve() {
  MO.observe(document.querySelector('#content'), {
    subtree: true,
    childList: true
  });
}
function determineState() {
  setBlur(0);
  if (queuedCommand) {
    runCommand.apply(void 0, _toConsumableArray(queuedCommand));
  }
  var content = document.querySelector('.content');
  if (!content) {
    handleIndex();
    return;
  }
  var hl = getHeadLine(content);
  var _parseHeadLine = parseHeadLine(hl),
    _parseHeadLine2 = _slicedToArray(_parseHeadLine, 4),
    m = _parseHeadLine2[0],
    boardID = _parseHeadLine2[1],
    boardName = _parseHeadLine2[2],
    topicID = _parseHeadLine2[3];
  if (m) {
    if (boardName && topicID) {
      handleTopic(content, boardID, boardName, topicID);
    } else {
      handleBoardPage(content, boardID);
    }
  } else {
    var _hl$;
    var title = hl === null || hl === void 0 ? void 0 : (_hl$ = hl[0]) === null || _hl$ === void 0 ? void 0 : _hl$.textContent;
    if (title == 'The list of existing boards:') {
      handleBoardList(content);
    }
    if (title == 'Revent viewed topics') {
      handleRVT(content);
    }
  }
}
function getHeadLine() {
  var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.querySelector('.content');
  var index = 0,
    ret = [];
  var _iterator2 = _createForOfIteratorHelper(content.childNodes),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var node = _step2.value;
      if (node.nodeName == 'BR') {
        if (index == 0) continue;else break;
      }
      ret.push(node);
      index++;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return ret;
}
function parseHeadLine() {
  var headLine = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getHeadLine(content);
  var headLinePattern = /\[([0-9]+)\](?:\s*(.+?)[\s]{2,}\[([0-9]+)\])?/m;
  return (headLine === null || headLine === void 0 ? void 0 : headLine[0].textContent.match(headLinePattern)) || [0, 0, 0, 0];
}
var actions = {};
actions.home = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
  var pushHistory,
    res,
    htm,
    dom,
    c,
    _args = arguments;
  return _regeneratorRuntime().wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        pushHistory = _args.length > 0 && _args[0] !== undefined ? _args[0] : true;
        setBlur(1);
        _context.next = 4;
        return fetch("/", {
          credentials: 'include'
        });
      case 4:
        res = _context.sent;
        if (res.ok) {
          _context.next = 7;
          break;
        }
        return _context.abrupt("return");
      case 7:
        _context.next = 9;
        return res.text();
      case 9:
        htm = _context.sent;
        if (htm) {
          _context.next = 12;
          break;
        }
        return _context.abrupt("return");
      case 12:
        dom = document.createRange().createContextualFragment(htm);
        c = dom.querySelector('#content');
        document.querySelector('#content').replaceWith(c);
        if (pushHistory) pushHistoryState({
          screen: 'index'
        }, '#/');
        handleIndex();
        setBlur(0);
        reObserve();
      case 19:
      case "end":
        return _context.stop();
    }
  }, _callee);
}));
function handleHash(hash) {
  if (!hash) {
    actions.home(false);
    return;
  }
  var _hash$match$slice = hash.match(/^#(?:\/([0-9]+|[^\/\:\s]*))?(?:\:([0-9]+|))?(?:\/([0-9]+|))?(?:\:([0-9]+|))?(?:#([0-9]+|))?/).slice(1),
    _hash$match$slice2 = _slicedToArray(_hash$match$slice, 5),
    board = _hash$match$slice2[0],
    boardPage = _hash$match$slice2[1],
    topic = _hash$match$slice2[2],
    topicPage = _hash$match$slice2[3],
    post = _hash$match$slice2[4];
  if (board == '') {
    actions.home(false);
  } else {
    messageBroker.expect()["catch"](function () {
      setBlur(0);
      window.history.replaceState({
        screen: 'index'
      }, '', '#/');
    });
    if (!isNaN(+board)) {
      if (!isNaN(+topic)) {
        if (post) interactivePosts.toPin = post;
        runCommand("TOPIC -n ".concat(topic).concat(!isNaN(+topicPage) ? " -p ".concat(topicPage) : ''), {
          skipHistory: true
        });
      } else {
        runCommand("BOARD -n ".concat(board).concat(!isNaN(+boardPage) ? " -p ".concat(boardPage) : ''), {
          skipHistory: true
        });
      }
    } else if (board == 'boards') {
      runCommand("BOARDS", {
        skipHistory: true
      });
    } else if (board == 'rvt') {
      runCommand("RVT", {
        skipHistory: true
      });
    } else {
      console.error('Unhandled hash:', hash);
    }
  }
}
window.addEventListener('hashchange', function (ev) {
  var _URL;
  handleHash((_URL = new URL(ev.newURL)) === null || _URL === void 0 ? void 0 : _URL.hash);
});
var virtualHistory = {};
var historySkip = 0; // runCommand() increments this in cases when a command is initiated by a hashchange or concatenated command;
function pushHistoryState(state, url) {
  // this prevents pushing a state when unnecessary, preserving navigation.
  virtualHistory = {
    state: state,
    url: url
  };
  if (historySkip > 0) {
    historySkip--;
  } else {
    window.history.pushState(state, '', url);
  }
}

/*-------------------------- App state handlers ----------------------------*/
function handleIndex() {
  setLogo();
  var c = document.querySelector('#content'),
    isLoggedIn = [].find.call(c.childNodes, function (node) {
      return node.nodeName == "#text" && node.textContent.indexOf('You are logged in') == 0;
    }),
    lastBr = c.querySelector('.hwt-logo');
  lastBr.insertAdjacentHTML('afterend', "<br>\n    <div class=\"hwt-menu ".concat(!isLoggedIn ? " hwt-guest" : '', "\">\n      <button class=\"hwt-btn hwt-cmdlink hwt-members-only\" data-command=\"BOARDS\">boards</button>\n      <button class=\"hwt-btn hwt-action hwt-guests-only\" data-action=\"login\">login</button>\n      <button class=\"hwt-btn hwt-action hwt-guests-only\" data-action=\"register\" >register</button>\n      <button class=\"hwt-btn hwt-cmdlink\" data-command=\"HELP\" data-noload=\"true\">help</button>\n      <button class=\"hwt-btn hwt-cmdlink hwt-members-only\" data-command=\"LOGOUT\" data-noload=\"true\">logout</button>\n      <button class=\"hwt-btn hwt-cmdlink hwt-members-only\" data-command=\"RVT\" title=\"Recent viewed topics\">recent</button>\n      <button class=\"hwt-btn hwt-cmdlink hwt-members-only\" data-command=\"INVITES\" data-noload=\"true\">invites</button>\n      <button class=\"hwt-btn hwt-cmdlink\" data-command=\"DONATE\" data-noload=\"true\">donate</button>\n      <button class=\"hwt-btn hwt-action\" data-action=\"hwtinfo\" title=\"About this UserScript\">hwt</button>\n      <button class=\"hwt-btn hwt-cmdlink\" data-command=\"LISTFONTS\" title=\"Select font\" data-noload=\"true\">Fonts</button>\n    </div>"));
}
function handleBoardList(content) {
  pushHistoryState({
    screen: 'board-list'
  }, '#/boards');
  content.querySelectorAll('.pendant').forEach(function (p) {
    var _b$textContent$match;
    var b = p.previousSibling;
    if (b.nodeName != '#text') return;
    var n = (_b$textContent$match = b.textContent.match(/^\[([0-9]+)\]/)) === null || _b$textContent$match === void 0 ? void 0 : _b$textContent$match[1];
    if (n) {
      makeClickable(b, "BOARD -n ".concat(n));
    }
  });
  getHeadLine(content)[0].previousElementSibling.insertAdjacentHTML('afterend', "\n    <button class=\"hwt-action hwt-btn\" data-action=\"home\" title=\"Home\">\u2302</button> ");
}
function handleRVT(content) {
  var _pagination = pagination(content),
    _pagination2 = _slicedToArray(_pagination, 2),
    page = _pagination2[0],
    lastPage = _pagination2[1];
  pushHistoryState({
    screen: 'rvt',
    page: page,
    lastPage: lastPage
  }, '#/rvt');
  content.querySelectorAll('.postsnumber').forEach(function (p) {
    var _p$textContent$match;
    var n = (_p$textContent$match = p.textContent.match(/\[(.+)\]/)) === null || _p$textContent$match === void 0 ? void 0 : _p$textContent$match[1];
    if (n) {
      var _p$nextElementSibling, _p$nextElementSibling2;
      (_p$nextElementSibling = p.nextElementSibling) === null || _p$nextElementSibling === void 0 ? void 0 : (_p$nextElementSibling2 = _p$nextElementSibling.querySelector('.pm')) === null || _p$nextElementSibling2 === void 0 ? void 0 : _p$nextElementSibling2.insertAdjacentHTML('beforebegin', "<button class=\"hwt-btn hwt-cmdlink\" data-command=\"TOPIC -n ".concat(n, " && LAST\" title=\"Last page\">&gt;&gt;</button>"));
      makeClickable(p, "TOPIC -n ".concat(n), "First page");
    }
  });
  getHeadLine(content)[0].previousElementSibling.insertAdjacentHTML('afterend', "\n    <button class=\"hwt-action hwt-btn\" data-action=\"home\" title=\"Home\">\u2302</button> ");
}
function handleBoardPage(content, boardID) {
  var _pagination3 = pagination(content),
    _pagination4 = _slicedToArray(_pagination3, 2),
    page = _pagination4[0],
    lastPage = _pagination4[1];
  pushHistoryState({
    screen: 'board-page',
    board: boardID,
    page: page,
    lastPage: lastPage
  }, "#/".concat(boardID, ":").concat(page));
  getHeadLine(content)[0].previousElementSibling.insertAdjacentHTML('afterend', "\n    <button class=\"hwt-cmdlink hwt-btn\" data-command=\"BOARDS\" title=\"To board list\">^</button>");
  content.querySelectorAll('.postsnumber').forEach(function (p) {
    var _p$textContent$match2;
    var n = (_p$textContent$match2 = p.textContent.match(/\[(.+)\]/)) === null || _p$textContent$match2 === void 0 ? void 0 : _p$textContent$match2[1];
    if (n) {
      var _p$nextElementSibling3, _p$nextElementSibling4;
      (_p$nextElementSibling3 = p.nextElementSibling) === null || _p$nextElementSibling3 === void 0 ? void 0 : (_p$nextElementSibling4 = _p$nextElementSibling3.querySelector('.pm')) === null || _p$nextElementSibling4 === void 0 ? void 0 : _p$nextElementSibling4.insertAdjacentHTML('beforebegin', "<button class=\"hwt-btn hwt-cmdlink\" data-command=\"TOPIC -n ".concat(n, " && LAST\" title=\"Last page\">&gt;&gt;</button>"));
      makeClickable(p, "TOPIC -n ".concat(n), "First page");
    }
  });
  content.insertAdjacentHTML('beforeend', "<div class=\"show-topic-form\">\n      <button class=\"hwt-action hwt-btn\" data-action=\"newtopicform\">new topic</button>\n    </div>");
}
function handleTopic(content, boardID, boardName, topicID) {
  var _pagination5 = pagination(content),
    _pagination6 = _slicedToArray(_pagination5, 2),
    page = _pagination6[0],
    lastPage = _pagination6[1];
  pushHistoryState({
    screen: 'topic',
    board: boardID,
    topic: topicID,
    page: page,
    lastPage: lastPage
  }, "#/".concat(boardID, "/").concat(topicID, ":").concat(page));
  var headLine = getHeadLine(content);
  var html = "<span class=\"hwt-backlink\">\n    <button class=\"hwt-btn hwt-cmdlink\" data-command=\"BOARD -n ".concat(boardID, "\" title=\"To board #").concat(boardID, " (").concat(boardName, ")\">^ [").concat(boardID, "] ").concat(boardName, "</button>\n    [").concat(topicID, "]\n  </span>");
  headLine[0].replaceWith(createElementFromHTML(html));
  postingForm.create();
  interactivePosts.init(content.querySelectorAll('.post'));
}

/*---------------------------------- CSS -----------------------------------*/
var cssURL = "https://juribiyan.github.io/housewife-tools/css/hwt.css";
document.head.insertAdjacentHTML('beforeend', "<link rel=\"stylesheet\" type=\"text/css\" href=\"".concat(cssURL, "\">"));
var injector = {
  inject: function inject(alias, css) {
    var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "beforeend";
    var id = "injector:".concat(alias);
    var existing = document.getElementById(id);
    if (existing) {
      existing.innerHTML = css;
      return;
    }
    var head = document.head || document.getElementsByTagName('head')[0];
    head.insertAdjacentHTML(position, "<style type=\"text/css\" id=\"".concat(id, "\">").concat(css, "</style>"));
  },
  remove: function remove(alias) {
    var id = "injector:".concat(alias);
    var style = document.getElementById(id);
    if (style) {
      var head = document.head || document.getElementsByTagName('head')[0];
      if (head) head.removeChild(document.getElementById(id));
    }
  }
};

/*--------------------------- General utilities ----------------------------*/
EventTarget.prototype.delegateEventListener = function (types, targetSelectors, listener, options) {
  // if (! (types instanceof Array))
  // types = types.split(' ')
  if (!(targetSelectors instanceof Array)) targetSelectors = [targetSelectors];
  this.addMultiEventListener(types, function (ev) {
    targetSelectors.some(function (selector) {
      if (ev.target.matches(selector)) {
        listener.bind(ev.target)(ev);
        return true;
      }
    });
  }, options);
};
EventTarget.prototype.addMultiEventListener = function (types, listener, options) {
  var _this = this;
  if (!(types instanceof Array)) types = types.split(' ');
  types.forEach(function (type) {
    _this.addEventListener(type, function (ev) {
      listener.bind(ev.target)(ev);
    }, options);
  });
};
function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}
function repeatString(_char, times) {
  if (isNaN(times) || times <= 0) return "";
  return new Array(times + 1).join(_char);
}
function randomIntBetween() {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  // find diff
  var difference = max - min;
  // generate random number 
  var rand = Math.random();
  // multiply with difference 
  rand = Math.floor(rand * difference);
  // add with min value 
  rand = rand + min;
  return rand;
}

// Returns a promise wrapped in an object that contains resolve() and reject() methods for the promise
function exposedPromise() {
  var promiseResolve,
    promiseReject,
    promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });
  return {
    promise: promise,
    resolve: promiseResolve,
    reject: promiseReject
  };
}

/*------------------------- App-specific utilities -------------------------*/
// Turns a text node into a "link"
function makeClickable(node, command) {
  var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var noload = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  node.replaceWith(createElementFromHTML("<button class=\"hwt-cmdlink\" data-command=\"".concat(command, "\" title=\"").concat(title, "\" ").concat(noload ? " data-noload=\"true\"" : '', ">").concat(node.textContent, "</button>")));
}
// Auto-inputting commands
document.body.delegateEventListener(['click', 'input'], '.hwt-cmdlink', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
  var command, noLoad, skipHistory, last;
  return _regeneratorRuntime().wrap(function _callee2$(_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        command = this.dataset.command, noLoad = this.dataset.noload == "true", skipHistory = this.dataset.skiphistory == 'true';
        if (command) {
          command = command.split('&&');
          if (command.length > 1) {
            last = command.pop();
            command = [command.join('&&'), last];
          }
          runCommand(command, {
            load: !noLoad,
            skipHistory: skipHistory
          });
        }
      case 2:
      case "end":
        return _context2.stop();
    }
  }, _callee2, this);
})));
var queuedCommand = null;
function runCommand(_x2) {
  return _runCommand.apply(this, arguments);
}
function _runCommand() {
  _runCommand = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(command) {
    var _ref5,
      _ref5$load,
      load,
      _ref5$skipHistory,
      skipHistory,
      cmdLine,
      _ref6,
      _ref7,
      thisCommand,
      nextCommand,
      _args6 = arguments;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _ref5 = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {}, _ref5$load = _ref5.load, load = _ref5$load === void 0 ? true : _ref5$load, _ref5$skipHistory = _ref5.skipHistory, skipHistory = _ref5$skipHistory === void 0 ? false : _ref5$skipHistory;
          cmdLine = document.querySelector('#cmd');
          if (cmdLine) {
            _context6.next = 4;
            break;
          }
          return _context6.abrupt("return");
        case 4:
          _context6.next = 6;
          return postingForm.quitEditingContext();
        case 6:
          // If in editing context prevent a command from being leaked into the post body
          _ref6 = command instanceof Array ? command : [command], _ref7 = _slicedToArray(_ref6, 2), thisCommand = _ref7[0], nextCommand = _ref7[1];
          if (nextCommand) {
            queuedCommand = [nextCommand, {
              load: load,
              skipHistory: skipHistory
            }];
            skipHistory = true;
          } else {
            queuedCommand = null;
          }
          if (skipHistory) {
            historySkip++;
          }
          cmdLine.value = thisCommand;
          setTimeout(function () {
            cmdLine.dispatchEvent(new KeyboardEvent('keydown', {
              keyCode: 13
            })); // Simulatie pressing Enter
          }, 100);
          if (load) setBlur(1);
        case 12:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _runCommand.apply(this, arguments);
}
function makeLoginForm() {
  var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'LOGIN';
  return function () {
    var _document$querySelect;
    (_document$querySelect = document.querySelector('.hwt-login-form')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.remove();
    document.querySelector('.hwt-menu').insertAdjacentHTML('afterend', "<br>\n      <div class=\"hwt-login-form\">\n        <div class=\"hwt-login-login\">\n          <label for=\"hwt-login\">Login:</label>\n          <input type=\"text\" id=\"hwt-login\">\n        </div>\n      </div><br>");
    var login = document.querySelector('#hwt-login');
    login.focus();
    var passwordAdded = false;
    login.addEventListener('keypress', function (ev) {
      if (ev.key == 'Enter' && !passwordAdded) {
        login.insertAdjacentHTML('afterend', "<br>\n          <div class=\"hwt-login-password\">\n            <label for=\"hwt-password\">Password:</label>\n            <input type=\"password\" id=\"hwt-password\">\n          </div>\n        ");
        passwordAdded = true;
        var password = document.querySelector('#hwt-password');
        password.focus();
        password.addEventListener('keypress', function (ev) {
          if (ev.key == 'Enter') {
            runCommand("".concat(action, " -u ").concat(login.value, " -p ").concat(password.value), {
              load: false
            });
          }
        });
      }
    });
  };
}
actions.login = makeLoginForm('login');
actions.register = makeLoginForm('register');
document.body.delegateEventListener(['click', 'input'], '.hwt-action', /*async*/function () {
  var action = this.dataset.action;
  actions[action](this);
});
function pagination() {
  var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.querySelector('.content');
  var html, current, total;
  var found = [].find.call(content.childNodes, function (node) {
    var _node$textContent$mat;
    var m;
    if (node.nodeName == "#text" && (m = (_node$textContent$mat = node.textContent.match(/Page ([0-9]+)\/([0-9]+)/)) === null || _node$textContent$mat === void 0 ? void 0 : _node$textContent$mat.slice(1))) {
      var _m$map = m.map(function (n) {
        return +n;
      });
      var _m$map2 = _slicedToArray(_m$map, 2);
      current = _m$map2[0];
      total = _m$map2[1];
      html = "<span class=\"hwt-pagination\">\n        ".concat(current > 1 ? "<button class=\"hwt-cmdlink hwt-btn\" data-command=\"FIRST\" title=\"First page\">&lt;&lt;</button>\n          <button class=\"hwt-cmdlink hwt-btn\" data-command=\"PREV\" title=\"Previous page\">&lt;</button>" : '', "\n        ").concat(node.textContent, "\n        ").concat(current < total ? "<button class=\"hwt-cmdlink hwt-btn\" data-command=\"NEXT\" title=\"Next page\">&gt;</button>\n          <button class=\"hwt-cmdlink hwt-btn\" data-command=\"LAST\" title=\"Last page\">&gt;&gt;</button>" : '', "\n      </span>");
      node.replaceWith(createElementFromHTML(html));
      return true;
    } else return false;
  });
  if (found) {
    // Copy pagination to bottom
    content.insertAdjacentHTML('beforeend', '<br>' + html);
    return [current, total];
  }
}
var messageBroker = {
  handle: function handle(element, type, message) {
    //successful login
    if (type == 'message' && message == 'you are logged in') {
      document.querySelector('.hwt-login-form').remove();
      document.querySelector('.hwt-menu').classList.remove('hwt-guest');
    }
    //successful registration -> immediate login
    if (type == 'message' && message == 'you are now registered') {
      var login = document.querySelector('#hwt-login').value,
        password = document.querySelector('#hwt-password').value;
      runCommand("LOGIN -u ".concat(login, " -p ").concat(password), {
        load: false
      });
    }
    // Logout
    if (type == 'message' && message == 'You have been logged out') {
      document.querySelector('.hwt-menu').classList.add('hwt-guest');
    }
    // Successful deletion
    if (type == 'message' && message == 'Post has been deleted') {
      var _this$expected;
      (_this$expected = this.expected) === null || _this$expected === void 0 ? void 0 : _this$expected.resolve();
    }
    // Unsuccessful deletion / edit
    if (type == 'error') {
      var _this$expected2;
      (_this$expected2 = this.expected) === null || _this$expected2 === void 0 ? void 0 : _this$expected2.reject();
    }
    // Font list
    if (type == 'message' && ~message.indexOf('[0] Default')) {
      linkifyFonts(element);
    }
  },
  // expected: {},
  expect: function expect( /*type*/
  ) {
    var xp = exposedPromise();
    this.expected /*['_'+type]*/ = xp;
    return xp.promise;
  }
};

// Keyboard navigation
document.addEventListener("keydown", function (ev) {
  if (ev.ctrlKey) {
    if (ev.key == 'ArrowLeft' && window.history.state.page > 1) {
      runCommand('PREV');
    }
    if (ev.key == 'ArrowRight' && window.history.state.page < window.history.state.lastPage) {
      runCommand('NEXT');
    }
    if (ev.key == 'ArrowUp') {
      ev.preventDefault();
      if (window.history.state.screen == 'board-page') {
        runCommand('BOARDS');
      }
      if (window.history.state.screen == 'topic') {
        runCommand("BOARD -n ".concat(window.history.state.board));
      }
      if (window.history.state.screen == 'board-list') {
        actions.home();
      }
    }
    if (ev.key == 'Enter' && ~document.activeElement.id.indexOf('hwt-pf')) {
      if (document.querySelector('#hwt-pf-title')) actions.newtopic();else if (postingForm.context) postingForm.submitEdit();else actions.reply();
    }
  } else {
    var sc = document.querySelector('.scrollcontent');
    if (ev.key == 'PageUp') {
      sc.scrollTop = 0;
    }
    if (ev.key == 'PageDown') {
      sc.scrollTop = sc.scrollHeight;
    }
  }
});
function setLogo() {
  var _ref3, _ref3$script, _GM;
  var ver = 'v.' + ((_ref3 = ((_GM = GM) === null || _GM === void 0 ? void 0 : _GM.info) || GM_info) === null || _ref3 === void 0 ? void 0 : (_ref3$script = _ref3.script) === null || _ref3$script === void 0 ? void 0 : _ref3$script.version),
    verSpace = (15 - ver.length) / 2,
    verStr = repeatString(' ', Math.ceil(verSpace)) + ver + repeatString(' ', Math.floor(verSpace)),
    logo = ["        ,---------------.", "    |   |   HouseWife   |", "  --+-- |     Tools     |", "    |   |" + verStr + "|", "        `---------------'"].map(function (line) {
      return line.replace(/ /g, ' ');
    }),
    node = document.querySelector('#content br'),
    replacedNodes = '';
  for (var i = 0; i < 8;) {
    if (node.nodeName == '#text') {
      replacedNodes += node.textContent + (i >= 2 ? (logo === null || logo === void 0 ? void 0 : logo[i - 2]) || '' : '');
      i++;
    } else {
      replacedNodes += node.outerHTML;
    }
    var next = node.nextSibling;
    node.remove();
    node = next;
  }
  document.querySelector('#content').insertAdjacentHTML('afterbegin', "<div class=\"hwt-logo\">".concat(replacedNodes, "</div>"));
}
actions.reply = function () {
  var _postingForm$textarea;
  var msg = (_postingForm$textarea = postingForm.textarea) === null || _postingForm$textarea === void 0 ? void 0 : _postingForm$textarea.value;
  if (msg) runCommand(["REPLY -m ".concat(msg), "LAST"]);
};
actions.newtopic = function () {
  var _postingForm$title, _postingForm$textarea2;
  var title = (_postingForm$title = postingForm.title) === null || _postingForm$title === void 0 ? void 0 : _postingForm$title.value,
    content = (_postingForm$textarea2 = postingForm.textarea) === null || _postingForm$textarea2 === void 0 ? void 0 : _postingForm$textarea2.value;
  if (title && content) runCommand("NEWTOPIC -t ".concat(title, " -c ").concat(content));
};
actions.newtopicform = function () {
  var _document$querySelect2;
  (_document$querySelect2 = document.querySelector('.show-topic-form')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.remove();
  postingForm.create(true);
};
actions.edit = function () {
  var _postingForm$textarea3;
  var msg = (_postingForm$textarea3 = postingForm.textarea) === null || _postingForm$textarea3 === void 0 ? void 0 : _postingForm$textarea3.value;
  if (msg) runCommand(msg);
};
var animationRun;
function setBlur() {
  var toggle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var wr = document.querySelector('#wrapper');
  if (toggle) {
    wr.classList.add('hwt-blurred');
    startAnimation();
  } else {
    wr.classList.remove('hwt-blurred');
    setTimeout(function () {
      return clearInterval(animationRun);
    }, 210);
  }
}
function startAnimation() {
  var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 40;
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
  var loader;
  while (!(loader = document.querySelector('.hwt-loading-animation'))) {
    document.querySelector('#wrapper').insertAdjacentHTML('afterbegin', '<div class="hwt-loading-animation"></div>');
  }
  var makeLine = function makeLine() {
    var line = '';
    for (var i = 0; i < size * 2; i++) {
      line += String.fromCharCode(randomIntBetween(0x2800, 0x28ff)); // Braille block
    }

    return line + '<br>';
  };
  var lines = [];
  for (var i = 0; i < size; i++) {
    lines.push(makeLine());
  }
  loader.innerHTML = lines.join('');
  animationRun = setInterval(function () {
    lines.shift();
    lines.push(makeLine());
    loader.innerHTML = lines.join('');
  }, speed);
}
actions.hwtinfo = function () {
  var _script$version, _script$version$scrip, _GM2;
  var r = function r(str) {
      return "<span class=\"reverse\">&nbsp;".concat(str, "&nbsp;</span>");
    },
    d2 = function d2(str) {
      return "<div style=\"padding:2px\">".concat(str, "</div>");
    };
  var msg = "<div class=\"message\"><div style=\"padding-left:10px\">\n    <br>\n    ".concat(r("HouseWife Tools v.".concat((_script$version = (((_GM2 = GM) === null || _GM2 === void 0 ? void 0 : _GM2.info) || GM_info).script.version) === null || _script$version === void 0 ? void 0 : (_script$version$scrip = _script$version.script) === null || _script$version$scrip === void 0 ? void 0 : _script$version$scrip.version)), "\n    <br><br>\n    Keyboard Shortcuts:<br><br>\n    ").concat(d2("".concat(r("Ctrl + \u2192"), ", ").concat(r("Ctrl + \u2190"), " Navigate between pages")), "\n    ").concat(d2("".concat(r("Ctrl + \u2191"), " Move up one layer")), "\n    ").concat(d2("".concat(r("PageUp"), ", ").concat(r("PageDown"), " Scroll up and down the page")), "\n    ").concat(d2("".concat(r("Ctrl + Enter"), " Submit a post")), "\n    <br><br>\n    ").concat(d2("<a href=\"https://github.com/Juribiyan/housewife-tools\" target=\"_blank\">Project GitHub</a>"), "\n    ").concat(d2("<a href=\"#/1/20086:1\" target=\"_blank\">HWT Discussion</a>"), "\n  </div></div>");
  document.querySelector('#content').insertAdjacentHTML('beforeend', msg);
};

// --------------------- Post interaction ---------------------
var interactivePosts = {
  processPost: function processPost(post) {
    var _pn$innerText$match,
      _postCode$innerText$m,
      _this3 = this;
    var pn = post.querySelector('.postnumber');
    var id = +(pn === null || pn === void 0 ? void 0 : (_pn$innerText$match = pn.innerText.match(/[0-9]+/)) === null || _pn$innerText$match === void 0 ? void 0 : _pn$innerText$match[0]);
    if (isNaN(id)) return 0;
    var postCode = post.querySelector('.post-code');
    var pc = postCode === null || postCode === void 0 ? void 0 : (_postCode$innerText$m = postCode.innerText.match(/[A-Z]+/)) === null || _postCode$innerText$m === void 0 ? void 0 : _postCode$innerText$m[0];
    if (!pc) return 0;
    pn.insertAdjacentHTML('beforeend', "<span class=\"hwt-post-menu\">\n      <button class=\"hwt-btn hwt-post-edit\">edit</button>\n      <button class=\"hwt-btn hwt-cmdlink hwt-post-delete\" data-command=\"DELETE -p ".concat(id, "\" data-noload=\"true\">delete</button>\n      <button class=\"hwt-btn hwt-action\" data-action=\"anchor\" data-id=\"").concat(id, "\">#</button>\n    </span"));
    pn.querySelector('.hwt-post-delete').addMultiEventListener(['click', 'input'], function () {
      var _this2 = this;
      messageBroker.expect().then(function () {
        var _pn$querySelector;
        post.classList.add('hwt-deleted');
        (_pn$querySelector = pn.querySelector('.hwt-post-menu')) === null || _pn$querySelector === void 0 ? void 0 : _pn$querySelector.remove();
      })["catch"](function () {
        var _pn$querySelector2;
        _this2.remove();
        (_pn$querySelector2 = pn.querySelector('.hwt-post-edit')) === null || _pn$querySelector2 === void 0 ? void 0 : _pn$querySelector2.remove();
      });
    });
    pn.querySelector('.hwt-post-edit').addMultiEventListener(['click', 'input'], /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var json;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return softCommand("EDIT -p ".concat(id));
          case 2:
            json = _context3.sent;
            if (json && json.edit == 1) {
              postingForm.enterEditingContext(json.edittext, json.path, id);
            } else {
              this.remove();
              pn.querySelector('.hwt-post-delete').remove();
              if (json.message) {
                document.querySelector('#content').insertAdjacentHTML('beforeend', json.message);
              }
            }
          case 4:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    })));
    postCode.addEventListener('mouseenter', function () {
      return _this3.highlight(pc /*, post*/);
    });
    postCode.addEventListener('mouseleave', function () {
      return _this3.highlight(false);
    });
    postCode.addEventListener('click', function () {
      return postingForm.insert("2".concat(pc, ": "));
    });
    var content = post.querySelector('.post-content');
    if (content) {
      [].filter.call(content.childNodes, function (node) {
        var _node$classList, _node$previousSibling;
        return (
          // Find new line nodes
          (node.nodeName == "#text" || node.nodeName != 'BR' && !((_node$classList = node.classList) !== null && _node$classList !== void 0 && _node$classList.contains('postnumber')) && !node.querySelector('.pendant')) && ['BR', 'DIV'].includes((_node$previousSibling = node.previousSibling) === null || _node$previousSibling === void 0 ? void 0 : _node$previousSibling.nodeName)
        );
      }).forEach(function (subNode) {
        // add interactivity to posts references in text
        var refID = false,
          ref,
          replacedContent = subNode.textContent.replace(/^2?([A-Z]+)[,\:]?/, function (m, g1) {
            ref = m;
            refID = g1;
            return '';
          });
        if (refID) {
          subNode.textContent = replacedContent;
          var refLink = createElementFromHTML("<span class=\"hwt-reflink\">".concat(ref, "</span>"));
          refLink.addEventListener('mouseenter', function () {
            return _this3.highlight(refID /*, post*/);
          });
          refLink.addEventListener('mouseleave', function () {
            return _this3.highlight(false);
          });
          if (typeof subNode.innerHTML != 'undefined') subNode.prepend(refLink);else content.insertBefore(refLink, subNode);
        }
      });
      // TODO: multiple references like in https://314n.org/#/1/23:7
    }

    return {
      el: post,
      id: id,
      author: pc
    };
  },
  init: function init(posts, postTo) {
    this.posts = [].map.call(posts, this.processPost.bind(this)).filter(function (post) {
      return post !== 0;
    });
    if (this.toPin) {
      this.pin(this.toPin, true);
      this.toPin = false;
    }
  },
  posts: [],
  highlight: function highlight(pc) {
    this.posts.forEach(function (post) {
      if (pc === false) {
        post.el.classList.remove('hwt-post-highlight');
      } else if (post.author == pc) {
        post.el.classList.add('hwt-post-highlight');
      }
    });
  },
  pin: function pin(id) {
    var initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var found;
    this.posts.forEach(function (post) {
      if (post.id == id) {
        post.el.classList.add('hwt-post-pinned');
        found = true;
        if (initial) {
          setTimeout(function () {
            return post.el.scrollIntoView();
          }, 500);
        }
      } else {
        post.el.classList.remove('hwt-post-pinned');
      }
    });
    return found;
  },
  toPin: false
};
actions.anchor = function (btn) {
  var _virtualHistory, _virtualHistory2;
  var id = btn.dataset.id;
  var found = interactivePosts.pin(id);
  if (!found || !((_virtualHistory = virtualHistory) !== null && _virtualHistory !== void 0 && _virtualHistory.state && (_virtualHistory2 = virtualHistory) !== null && _virtualHistory2 !== void 0 && _virtualHistory2.url)) return;
  virtualHistory.state.post = id;
  window.history.replaceState(virtualHistory.state, '', virtualHistory.url + '#' + id);
};
var postingForm = {
  get form() {
    return this._form || this.update() && this._form;
  },
  get wrapper() {
    return this._wrapper || this.update() && this._wrapper;
  },
  get textarea() {
    return this._textarea || this.update() && this._textarea;
  },
  get title() {
    return this._title || this.update() && this._title;
  },
  update: function update() {
    var _this$_form, _this$_wrapper, _this$_wrapper2;
    this._form = document.querySelector('#hwt-posting-form');
    this._wrapper = (_this$_form = this._form) === null || _this$_form === void 0 ? void 0 : _this$_form.querySelector('.hwt-textarea-wrapper');
    this._textarea = (_this$_wrapper = this._wrapper) === null || _this$_wrapper === void 0 ? void 0 : _this$_wrapper.querySelector('textarea');
    this._title = (_this$_wrapper2 = this._wrapper) === null || _this$_wrapper2 === void 0 ? void 0 : _this$_wrapper2.querySelector('input');
  },
  create: function create() {
    var _this4 = this;
    var withTitle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var html = "\n      <div id=\"hwt-posting-form\" style=\"visibility:hidden\">\n        <div class=\"hwt-textarea-wrapper".concat(withTitle ? ' hwt-tc-with-title' : '', "\">\n          <div class=\"hwt-textarea-border\"></div>\n          ").concat(withTitle ? "<input id=\"hwt-pf-title\" type=\"text\" class=\"hwt-txt-input hwt-title-input\" placeholder=\"Title...\">" : '', "\n          <textarea id=\"hwt-pf-textarea\" style=\"resize:false\" rows=\"3\" class=\"hwt-txt-input hwt-msg-area\"").concat(withTitle ? " placeholder=\"Message...\"" : '', "></textarea>\n        </div>\n        <div class=\"hwt-reply-button-wrapper\">\n          ").concat(withTitle ? "<button class=\"hwt-btn hwt-action\" data-action=\"newtopic\" title=\"Create new topic\">post</button>" : "<button class=\"hwt-btn hwt-action hwt-reply-btn\" data-action=\"reply\">reply</button>", "\n        </div>\n      </div>");
    document.querySelector('.content').insertAdjacentHTML('afterend', html);
    this.update();
    var debounceTimeout, ro;
    var debouncedResizeHandler = function debouncedResizeHandler(ev) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(function () {
        if (!_this4.form.parentNode) {
          ro.disconnect();
          return;
        }
        _this4.updateBorders(withTitle);
      }, 10);
    };
    ro = new ResizeObserver(debouncedResizeHandler);
    setTimeout(function () {
      window.requestAnimationFrame(function () {
        debouncedResizeHandler();
        ro.observe(_this4.textarea);
        _this4.form.style.visibility = 'visible';
      });
    }, 200);
    this.textarea.addEventListener("input", function (ev) {
      _this4.textarea.rows = Math.max(_this4.textarea.value.split(/\n/).length, 3);
    });
  },
  updateBorders: function updateBorders(withTitle) {
    var border = this.wrapper.querySelector('.hwt-textarea-border');
    // Determine the character dimensions
    border.textContent = repeatString("-", 10); // for better subpixel precision in Chrome
    var charWidth = border.offsetWidth / 10,
      charHeight = border.offsetHeight;
    injector.inject('hwt-postingform-margins', "\n      .hwt-textarea-wrapper .hwt-txt-input {\n        border-width: ".concat(charHeight, "px ").concat(charWidth * 2, "px\n      }\n      ").concat(withTitle ? ".hwt-msg-area {\n        border-top-width: 0!important;\n      }" : ''));
    var w = Math.floor(this.wrapper.offsetWidth / charWidth),
      h = Math.round(this.wrapper.offsetHeight / charHeight);
    var head = "," + repeatString("–", w - 2) + ".<br>",
      line = "|" + repeatString("&nbsp;", w - 2) + "|<br>",
      tail = "`" + repeatString("–", w - 2) + "'";
    if (!withTitle) {
      border.innerHTML = head + repeatString(line, h - 2) + tail;
    } else {
      var divider = "}" + repeatString("-", w - 2) + "{<br>";
      border.innerHTML = head + line + divider + repeatString(line, h - 4) + tail;
    }
  },
  insert: function insert(txt) {
    this.textarea.value = txt;
  },
  enterEditingContext: function enterEditingContext(txt, path, postID) {
    var $path = document.querySelector('#path');
    this.context = {
      path: $path.innerHTML,
      value: this.textarea.value,
      edittext: txt,
      postID: postID
    };
    this.textarea.value = txt;
    $path.innerHTML = "".concat(path, "&nbsp;&gt;&nbsp;");
    var rb = this.form.querySelector('.hwt-reply-btn');
    rb.style.display = 'none';
    rb.insertAdjacentHTML('afterend', "<div class=\"hwt-edit-btns\">\n      <button class=\"hwt-btn hwt-action\" data-action=\"submitedit\">edit</button>\n      <button class=\"hwt-btn hwt-action\" data-action=\"unedit\">cancel</button>\n    </div>");
    this.isEditing = true;
  },
  // return to normal context by sending an original message
  quitEditingContext: function () {
    var _quitEditingContext = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var reflectOnly,
        $path,
        _args4 = arguments;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            reflectOnly = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : false;
            if (this.context) {
              _context4.next = 3;
              break;
            }
            return _context4.abrupt("return", false);
          case 3:
            $path = document.querySelector('#path');
            $path.innerHTML = this.context.path;
            this.textarea.value = this.context.value;
            this.form.querySelector('.hwt-reply-btn').style.display = '';
            this.form.querySelector('.hwt-edit-btns').remove();
            if (reflectOnly) {
              _context4.next = 11;
              break;
            }
            _context4.next = 11;
            return softCommand(this.context.edittext, false);
          case 11:
            delete this.context;
            return _context4.abrupt("return", true);
          case 13:
          case "end":
            return _context4.stop();
        }
      }, _callee4, this);
    }));
    function quitEditingContext() {
      return _quitEditingContext.apply(this, arguments);
    }
    return quitEditingContext;
  }(),
  submitEdit: function () {
    var _submitEdit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var res, _this$context, _yield$softCommand, id, htm, dom, newPost, oldPost;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return softCommand(postingForm.textarea.value, false);
          case 2:
            res = _context5.sent;
            if (!res.message) {
              _context5.next = 32;
              break;
            }
            document.querySelector('#content').insertAdjacentHTML('beforeend', res.message);
            if (!~res.message.indexOf("Post has been edited")) {
              _context5.next = 32;
              break;
            }
            id = (_this$context = this.context) === null || _this$context === void 0 ? void 0 : _this$context.postID;
            if (id) {
              _context5.next = 9;
              break;
            }
            return _context5.abrupt("return");
          case 9:
            _context5.next = 11;
            return softCommand("REFRESH", true, true);
          case 11:
            _context5.t1 = _yield$softCommand = _context5.sent;
            _context5.t0 = _context5.t1 === null;
            if (_context5.t0) {
              _context5.next = 15;
              break;
            }
            _context5.t0 = _yield$softCommand === void 0;
          case 15:
            if (!_context5.t0) {
              _context5.next = 19;
              break;
            }
            _context5.t2 = void 0;
            _context5.next = 20;
            break;
          case 19:
            _context5.t2 = _yield$softCommand.message;
          case 20:
            htm = _context5.t2;
            if (htm) {
              _context5.next = 23;
              break;
            }
            return _context5.abrupt("return");
          case 23:
            dom = document.createRange().createContextualFragment(htm);
            newPost = [].find.call(dom.querySelectorAll('.post'), function (post) {
              var _post$querySelector, _post$querySelector$i, _post$querySelector$i2;
              return ((_post$querySelector = post.querySelector('.postnumber')) === null || _post$querySelector === void 0 ? void 0 : (_post$querySelector$i = _post$querySelector.innerText) === null || _post$querySelector$i === void 0 ? void 0 : (_post$querySelector$i2 = _post$querySelector$i.match(/[0-9]+/)) === null || _post$querySelector$i2 === void 0 ? void 0 : _post$querySelector$i2[0]) == id;
            });
            if (newPost) {
              _context5.next = 27;
              break;
            }
            return _context5.abrupt("return");
          case 27:
            oldPost = interactivePosts.posts.find(function (post) {
              return post.id == id;
            });
            if (oldPost) {
              _context5.next = 30;
              break;
            }
            return _context5.abrupt("return");
          case 30:
            oldPost.el.innerHTML = newPost.innerHTML;
            oldPost = interactivePosts.processPost.bind(interactivePosts)(oldPost.el);
          case 32:
          case "end":
            return _context5.stop();
        }
      }, _callee5, this);
    }));
    function submitEdit() {
      return _submitEdit.apply(this, arguments);
    }
    return submitEdit;
  }()
};
actions.submitedit = postingForm.submitEdit.bind(postingForm);
function softCommand(_x3) {
  return _softCommand.apply(this, arguments);
}
function _softCommand() {
  _softCommand = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(command) {
    var quitEditingContext,
      reflectOnly,
      fd,
      f,
      res,
      _args7 = arguments;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          quitEditingContext = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : true;
          reflectOnly = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : false;
          if (!quitEditingContext) {
            _context7.next = 5;
            break;
          }
          _context7.next = 5;
          return postingForm.quitEditingContext(reflectOnly);
        case 5:
          fd = new FormData();
          fd.append('input', command);
          _context7.next = 9;
          return fetch("/console.php", {
            method: 'POST',
            body: fd,
            credentials: 'include'
          });
        case 9:
          f = _context7.sent;
          if (f.ok) {
            _context7.next = 12;
            break;
          }
          return _context7.abrupt("return");
        case 12:
          _context7.next = 14;
          return f.json();
        case 14:
          res = _context7.sent;
          return _context7.abrupt("return", res);
        case 16:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _softCommand.apply(this, arguments);
}
function linkifyFonts(msg) {
  var _msg$childNodes;
  msg === null || msg === void 0 ? void 0 : (_msg$childNodes = msg.childNodes) === null || _msg$childNodes === void 0 ? void 0 : _msg$childNodes.forEach(function (node) {
    if (node.nodeName == '#text') {
      var _node$textContent$mat2;
      var n = (_node$textContent$mat2 = node.textContent.match(/\[([0-9]+)\]/)) === null || _node$textContent$mat2 === void 0 ? void 0 : _node$textContent$mat2[1];
      if (n) {
        makeClickable(node, "SETFONT -f ".concat(n), 'Set font', true);
      }
    }
  });
}

// ---------------- Starting ----------------
reObserve();
handleIndex();
if (document.location.hash) {
  handleHash(document.location.hash);
}
