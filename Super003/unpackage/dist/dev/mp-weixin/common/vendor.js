(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!*********************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var objectKeys = ['qy', 'env', 'error', 'version', 'lanDebug', 'cloud', 'serviceMarket', 'router', 'worklet'];
var singlePageDisableKey = ['lanDebug', 'router', 'worklet'];
var target = typeof globalThis !== 'undefined' ? globalThis : function () {
  return this;
}();
var key = ['w', 'x'].join('');
var oldWx = target[key];
var launchOption = oldWx.getLaunchOptionsSync ? oldWx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof oldWx[key] === 'function';
}
function initWx() {
  var newWx = {};
  for (var _key in oldWx) {
    if (isWxKey(_key)) {
      // TODO wrapper function
      newWx[_key] = oldWx[_key];
    }
  }
  return newWx;
}
target[key] = initWx();
var _default = target[key];
exports.default = _default;

/***/ }),
/* 2 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, global) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApp = createApp;
exports.createComponent = createComponent;
exports.createPage = createPage;
exports.createPlugin = createPlugin;
exports.createSubpackageApp = createSubpackageApp;
exports.default = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _construct2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/construct */ 15));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var _uniI18n = __webpack_require__(/*! @dcloudio/uni-i18n */ 22);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var realAtob;
var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== 'function') {
  realAtob = function realAtob(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, '');
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }

    // Adding the padding if missing, for semplicity
    str += '=='.slice(2 - (str.length & 3));
    var bitmap;
    var result = '';
    var r1;
    var r2;
    var i = 0;
    for (; i < str.length;) {
      bitmap = b64.indexOf(str.charAt(i++)) << 18 | b64.indexOf(str.charAt(i++)) << 12 | (r1 = b64.indexOf(str.charAt(i++))) << 6 | (r2 = b64.indexOf(str.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  // 注意atob只能在全局对象上调用，例如：`const Base64 = {atob};Base64.atob('xxxx')`是错误的用法
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
function getCurrentUserInfo() {
  var token = wx.getStorageSync('uni_id_token') || '';
  var tokenArr = token.split('.');
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  var userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error('获取当前用户信息出错，详细错误信息为：' + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1000;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(Vue) {
  Vue.prototype.uniIDHasRole = function (roleId) {
    var _getCurrentUserInfo = getCurrentUserInfo(),
      role = _getCurrentUserInfo.role;
    return role.indexOf(roleId) > -1;
  };
  Vue.prototype.uniIDHasPermission = function (permissionId) {
    var _getCurrentUserInfo2 = getCurrentUserInfo(),
      permission = _getCurrentUserInfo2.permission;
    return this.uniIDHasRole('admin') || permission.indexOf(permissionId) > -1;
  };
  Vue.prototype.uniIDTokenValid = function () {
    var _getCurrentUserInfo3 = getCurrentUserInfo(),
      tokenExpired = _getCurrentUserInfo3.tokenExpired;
    return tokenExpired > Date.now();
  };
}
var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isFn(fn) {
  return typeof fn === 'function';
}
function isStr(str) {
  return typeof str === 'string';
}
function isObject(obj) {
  return obj !== null && (0, _typeof2.default)(obj) === 'object';
}
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
function noop() {}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});
function sortObject(obj) {
  var sortObj = {};
  if (isPlainObject(obj)) {
    Object.keys(obj).sort().forEach(function (key) {
      sortObj[key] = obj[key];
    });
  }
  return !Object.keys(sortObj) ? obj : sortObj;
}
var HOOKS = ['invoke', 'success', 'fail', 'complete', 'returnValue'];
var globalInterceptors = {};
var scopedInterceptors = {};
function mergeHook(parentVal, childVal) {
  var res = childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}
function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}
function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}
function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}
function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}
function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}
function wrapperHook(hook, params) {
  return function (data) {
    return hook(data, params) || data;
  };
}
function isPromise(obj) {
  return !!obj && ((0, _typeof2.default)(obj) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
function queue(hooks, data, params) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook, params));
    } else {
      var res = hook(data, params);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {}
        };
      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    }
  };
}
function wrapperOptions(interceptor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res, options).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}
function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, (0, _toConsumableArray2.default)(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, (0, _toConsumableArray2.default)(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options) {
  for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    params[_key - 3] = arguments[_key];
  }
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        // 重新访问 getApiInterceptorHooks, 允许 invoke 中再次调用 addInterceptor,removeInterceptor
        return api.apply(void 0, [wrapperOptions(getApiInterceptorHooks(method), options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}
var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return new Promise(function (resolve, reject) {
      res.then(function (res) {
        if (res[0]) {
          reject(res[0]);
        } else {
          resolve(res[1]);
        }
      });
    });
  }
};
var SYNC_API_RE = /^\$|Window$|WindowStyle$|sendHostEvent|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getLocale|setLocale|invokePushCallback|getWindowInfo|getDeviceInfo|getAppBaseInfo|getSystemSetting|getAppAuthorizeSetting|initUTS|requireUTS|registerUTS/;
var CONTEXT_API_RE = /^create|Manager$/;

// Context例外情况
var CONTEXT_API_RE_EXC = ['createBLEConnection'];

// 同步例外情况
var ASYNC_API = ['createBLEConnection', 'createPushMessage'];
var CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}
function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).catch(function (err) {
    return [err];
  });
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}

/* eslint-disable no-extend-native */
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function (callback) {
    var promise = this.constructor;
    return this.then(function (value) {
      return promise.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return promise.resolve(callback()).then(function () {
        throw reason;
      });
    });
  };
}
function promisify(name, api) {
  if (!shouldPromise(name) || !isFn(api)) {
    return api;
  }
  return function promiseApi() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      params[_key2 - 1] = arguments[_key2];
    }
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject
      })].concat(params));
    })));
  };
}
var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;
function checkDeviceWidth() {
  var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
    platform = _wx$getSystemInfoSync.platform,
    pixelRatio = _wx$getSystemInfoSync.pixelRatio,
    windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}
function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}
var LOCALE_ZH_HANS = 'zh-Hans';
var LOCALE_ZH_HANT = 'zh-Hant';
var LOCALE_EN = 'en';
var LOCALE_FR = 'fr';
var LOCALE_ES = 'es';
var messages = {};
var locale;
{
  locale = normalizeLocale(wx.getSystemInfoSync().language) || LOCALE_EN;
}
function initI18nMessages() {
  if (!isEnableLocale()) {
    return;
  }
  var localeKeys = Object.keys(__uniConfig.locales);
  if (localeKeys.length) {
    localeKeys.forEach(function (locale) {
      var curMessages = messages[locale];
      var userMessages = __uniConfig.locales[locale];
      if (curMessages) {
        Object.assign(curMessages, userMessages);
      } else {
        messages[locale] = userMessages;
      }
    });
  }
}
initI18nMessages();
var i18n = (0, _uniI18n.initVueI18n)(locale, {});
var t = i18n.t;
var i18nMixin = i18n.mixin = {
  beforeCreate: function beforeCreate() {
    var _this = this;
    var unwatch = i18n.i18n.watchLocale(function () {
      _this.$forceUpdate();
    });
    this.$once('hook:beforeDestroy', function () {
      unwatch();
    });
  },
  methods: {
    $$t: function $$t(key, values) {
      return t(key, values);
    }
  }
};
var setLocale = i18n.setLocale;
var getLocale = i18n.getLocale;
function initAppLocale(Vue, appVm, locale) {
  var state = Vue.observable({
    locale: locale || i18n.getLocale()
  });
  var localeWatchers = [];
  appVm.$watchLocale = function (fn) {
    localeWatchers.push(fn);
  };
  Object.defineProperty(appVm, '$locale', {
    get: function get() {
      return state.locale;
    },
    set: function set(v) {
      state.locale = v;
      localeWatchers.forEach(function (watch) {
        return watch(v);
      });
    }
  });
}
function isEnableLocale() {
  return typeof __uniConfig !== 'undefined' && __uniConfig.locales && !!Object.keys(__uniConfig.locales).length;
}
function include(str, parts) {
  return !!parts.find(function (part) {
    return str.indexOf(part) !== -1;
  });
}
function startsWith(str, parts) {
  return parts.find(function (part) {
    return str.indexOf(part) === 0;
  });
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, '-');
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === 'chinese') {
    // 支付宝
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf('zh') === 0) {
    if (locale.indexOf('-hans') > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf('-hant') > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ['-tw', '-hk', '-mo', '-cht'])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  var lang = startsWith(locale, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
  if (lang) {
    return lang;
  }
}
// export function initI18n() {
//   const localeKeys = Object.keys(__uniConfig.locales || {})
//   if (localeKeys.length) {
//     localeKeys.forEach((locale) =>
//       i18n.add(locale, __uniConfig.locales[locale])
//     )
//   }
// }

function getLocale$1() {
  // 优先使用 $locale
  if (isFn(getApp)) {
    var app = getApp({
      allowDefault: true
    });
    if (app && app.$vm) {
      return app.$vm.$locale;
    }
  }
  return normalizeLocale(wx.getSystemInfoSync().language) || LOCALE_EN;
}
function setLocale$1(locale) {
  var app = isFn(getApp) ? getApp() : false;
  if (!app) {
    return false;
  }
  var oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach(function (fn) {
      return fn({
        locale: locale
      });
    });
    return true;
  }
  return false;
}
var onLocaleChangeCallbacks = [];
function onLocaleChange(fn) {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
}
if (typeof global !== 'undefined') {
  global.getLocale = getLocale$1;
}
var interceptors = {
  promiseInterceptor: promiseInterceptor
};
var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  getLocale: getLocale$1,
  setLocale: setLocale$1,
  onLocaleChange: onLocaleChange,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor,
  interceptors: interceptors
});
function findExistsPageIndex(url) {
  var pages = getCurrentPages();
  var len = pages.length;
  while (len--) {
    var page = pages[len];
    if (page.$page && page.$page.fullPath === url) {
      return len;
    }
  }
  return -1;
}
var redirectTo = {
  name: function name(fromArgs) {
    if (fromArgs.exists === 'back' && fromArgs.delta) {
      return 'navigateBack';
    }
    return 'redirectTo';
  },
  args: function args(fromArgs) {
    if (fromArgs.exists === 'back' && fromArgs.url) {
      var existsPageIndex = findExistsPageIndex(fromArgs.url);
      if (existsPageIndex !== -1) {
        var delta = getCurrentPages().length - 1 - existsPageIndex;
        if (delta > 0) {
          fromArgs.delta = delta;
        }
      }
    }
  }
};
var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(function (item, index) {
        return index < currentIndex ? item !== urls[currentIndex] : true;
      });
    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
var UUID_KEY = '__DC_STAT_UUID';
var deviceId;
function useDeviceId(result) {
  deviceId = deviceId || wx.getStorageSync(UUID_KEY);
  if (!deviceId) {
    deviceId = Date.now() + '' + Math.floor(Math.random() * 1e7);
    wx.setStorage({
      key: UUID_KEY,
      data: deviceId
    });
  }
  result.deviceId = deviceId;
}
function addSafeAreaInsets(result) {
  if (result.safeArea) {
    var safeArea = result.safeArea;
    result.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: result.windowWidth - safeArea.right,
      bottom: result.screenHeight - safeArea.bottom
    };
  }
}
function populateParameters(result) {
  var _result$brand = result.brand,
    brand = _result$brand === void 0 ? '' : _result$brand,
    _result$model = result.model,
    model = _result$model === void 0 ? '' : _result$model,
    _result$system = result.system,
    system = _result$system === void 0 ? '' : _result$system,
    _result$language = result.language,
    language = _result$language === void 0 ? '' : _result$language,
    theme = result.theme,
    version = result.version,
    platform = result.platform,
    fontSizeSetting = result.fontSizeSetting,
    SDKVersion = result.SDKVersion,
    pixelRatio = result.pixelRatio,
    deviceOrientation = result.deviceOrientation;
  // const isQuickApp = "mp-weixin".indexOf('quickapp-webview') !== -1

  var extraParam = {};

  // osName osVersion
  var osName = '';
  var osVersion = '';
  {
    osName = system.split(' ')[0] || '';
    osVersion = system.split(' ')[1] || '';
  }
  var hostVersion = version;

  // deviceType
  var deviceType = getGetDeviceType(result, model);

  // deviceModel
  var deviceBrand = getDeviceBrand(brand);

  // hostName
  var _hostName = getHostName(result);

  // deviceOrientation
  var _deviceOrientation = deviceOrientation; // 仅 微信 百度 支持

  // devicePixelRatio
  var _devicePixelRatio = pixelRatio;

  // SDKVersion
  var _SDKVersion = SDKVersion;

  // hostLanguage
  var hostLanguage = language.replace(/_/g, '-');

  // wx.getAccountInfoSync

  var parameters = {
    appId: "__UNI__B518E72",
    appName: "SuperBot",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "3.8.4",
    uniRuntimeVersion: "3.8.4",
    uniPlatform: undefined || "mp-weixin",
    deviceBrand: deviceBrand,
    deviceModel: model,
    deviceType: deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName: osName.toLocaleLowerCase(),
    osVersion: osVersion,
    hostTheme: theme,
    hostVersion: hostVersion,
    hostLanguage: hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    // TODO
    osLanguage: undefined,
    osTheme: undefined,
    ua: undefined,
    hostPackageName: undefined,
    browserName: undefined,
    browserVersion: undefined
  };
  Object.assign(result, parameters, extraParam);
}
function getGetDeviceType(result, model) {
  var deviceType = result.deviceType || 'phone';
  {
    var deviceTypeMaps = {
      ipad: 'pad',
      windows: 'pc',
      mac: 'pc'
    };
    var deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    var _model = model.toLocaleLowerCase();
    for (var index = 0; index < deviceTypeMapsKeys.length; index++) {
      var _m = deviceTypeMapsKeys[index];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  var deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = brand.toLocaleLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale$1 ? getLocale$1() : defaultLanguage;
}
function getHostName(result) {
  var _platform = 'WeChat';
  var _hostName = result.hostName || _platform; // mp-jd
  {
    if (result.environment) {
      _hostName = result.environment;
    } else if (result.host && result.host.env) {
      _hostName = result.host.env;
    }
  }
  return _hostName;
}
var getSystemInfo = {
  returnValue: function returnValue(result) {
    useDeviceId(result);
    addSafeAreaInsets(result);
    populateParameters(result);
  }
};
var showActionSheet = {
  args: function args(fromArgs) {
    if ((0, _typeof2.default)(fromArgs) === 'object') {
      fromArgs.alertText = fromArgs.title;
    }
  }
};
var getAppBaseInfo = {
  returnValue: function returnValue(result) {
    var _result = result,
      version = _result.version,
      language = _result.language,
      SDKVersion = _result.SDKVersion,
      theme = _result.theme;
    var _hostName = getHostName(result);
    var hostLanguage = language.replace('_', '-');
    result = sortObject(Object.assign(result, {
      appId: "__UNI__B518E72",
      appName: "SuperBot",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      hostVersion: version,
      hostLanguage: hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme
    }));
  }
};
var getDeviceInfo = {
  returnValue: function returnValue(result) {
    var _result2 = result,
      brand = _result2.brand,
      model = _result2.model;
    var deviceType = getGetDeviceType(result, model);
    var deviceBrand = getDeviceBrand(brand);
    useDeviceId(result);
    result = sortObject(Object.assign(result, {
      deviceType: deviceType,
      deviceBrand: deviceBrand,
      deviceModel: model
    }));
  }
};
var getWindowInfo = {
  returnValue: function returnValue(result) {
    addSafeAreaInsets(result);
    result = sortObject(Object.assign(result, {
      windowTop: 0,
      windowBottom: 0
    }));
  }
};
var getAppAuthorizeSetting = {
  returnValue: function returnValue(result) {
    var locationReducedAccuracy = result.locationReducedAccuracy;
    result.locationAccuracy = 'unsupported';
    if (locationReducedAccuracy === true) {
      result.locationAccuracy = 'reduced';
    } else if (locationReducedAccuracy === false) {
      result.locationAccuracy = 'full';
    }
  }
};

// import navigateTo from 'uni-helpers/navigate-to'

var compressImage = {
  args: function args(fromArgs) {
    // https://developers.weixin.qq.com/community/develop/doc/000c08940c865011298e0a43256800?highLine=compressHeight
    if (fromArgs.compressedHeight && !fromArgs.compressHeight) {
      fromArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !fromArgs.compressWidth) {
      fromArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = {
  redirectTo: redirectTo,
  // navigateTo,  // 由于在微信开发者工具的页面参数，会显示__id__参数，因此暂时关闭mp-weixin对于navigateTo的AOP
  previewImage: previewImage,
  getSystemInfo: getSystemInfo,
  getSystemInfoSync: getSystemInfo,
  showActionSheet: showActionSheet,
  getAppBaseInfo: getAppBaseInfo,
  getDeviceInfo: getDeviceInfo,
  getWindowInfo: getWindowInfo,
  getAppAuthorizeSetting: getAppAuthorizeSetting,
  compressImage: compressImage
};
var todos = ['vibrate', 'preloadPage', 'unPreloadPage', 'loadSubPackage'];
var canIUses = [];
var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];
function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}
function processArgs(methodName, fromArgs) {
  var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {
    // 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {
          // 不支持的参数
          console.warn("The '".concat(methodName, "' method of platform '\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F' does not support option '").concat(key, "'"));
        } else if (isStr(keyOption)) {
          // 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {
          // {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        if (isFn(fromArgs[key])) {
          toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
        }
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}
function processReturnValue(methodName, res, returnValue) {
  var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {
    // 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}
function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {
      // 暂不支持的 api
      return function () {
        console.error("Platform '\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F' does not support '".concat(methodName, "'."));
      };
    }
    return function (arg1, arg2) {
      // 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      if (isFn(options.name)) {
        methodName = options.name(arg1);
      } else if (isStr(options.name)) {
        methodName = options.name;
      }
      var returnValue = wx[methodName].apply(wx, args);
      if (isSyncApi(methodName)) {
        // 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}
var todoApis = Object.create(null);
var TODOS = ['onTabBarMidButtonTap', 'subscribePush', 'unsubscribePush', 'onPush', 'offPush', 'share'];
function createTodoApi(name) {
  return function todoApi(_ref) {
    var fail = _ref.fail,
      complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail method '").concat(name, "' not supported")
    };
    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}
TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});
var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin']
};
function getProvider(_ref2) {
  var service = _ref2.service,
    success = _ref2.success,
    fail = _ref2.fail,
    complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service]
    };
    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail service not found'
    };
    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}
var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider
});
var getEmitter = function () {
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();
function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}
function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}
var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit
});

/**
 * 框架内 try-catch
 */
/**
 * 开发者 try-catch
 */
function tryCatch(fn) {
  return function () {
    try {
      return fn.apply(fn, arguments);
    } catch (e) {
      // TODO
      console.error(e);
    }
  };
}
function getApiCallbacks(params) {
  var apiCallbacks = {};
  for (var name in params) {
    var param = params[name];
    if (isFn(param)) {
      apiCallbacks[name] = tryCatch(param);
      delete params[name];
    }
  }
  return apiCallbacks;
}
var cid;
var cidErrMsg;
var enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e) {}
  return message;
}
function invokePushCallback(args) {
  if (args.type === 'enabled') {
    enabled = true;
  } else if (args.type === 'clientId') {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === 'pushMsg') {
    var message = {
      type: 'receive',
      data: normalizePushMessage(args.message)
    };
    for (var i = 0; i < onPushMessageCallbacks.length; i++) {
      var callback = onPushMessageCallbacks[i];
      callback(message);
      // 该消息已被阻止
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === 'click') {
    onPushMessageCallbacks.forEach(function (callback) {
      callback({
        type: 'click',
        data: normalizePushMessage(args.message)
      });
    });
  }
}
var getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid, errMsg) {
  getPushCidCallbacks.forEach(function (callback) {
    callback(cid, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
function getPushClientId(args) {
  if (!isPlainObject(args)) {
    args = {};
  }
  var _getApiCallbacks = getApiCallbacks(args),
    success = _getApiCallbacks.success,
    fail = _getApiCallbacks.fail,
    complete = _getApiCallbacks.complete;
  var hasSuccess = isFn(success);
  var hasFail = isFn(fail);
  var hasComplete = isFn(complete);
  Promise.resolve().then(function () {
    if (typeof enabled === 'undefined') {
      enabled = false;
      cid = '';
      cidErrMsg = 'uniPush is not enabled';
    }
    getPushCidCallbacks.push(function (cid, errMsg) {
      var res;
      if (cid) {
        res = {
          errMsg: 'getPushClientId:ok',
          cid: cid
        };
        hasSuccess && success(res);
      } else {
        res = {
          errMsg: 'getPushClientId:fail' + (errMsg ? ' ' + errMsg : '')
        };
        hasFail && fail(res);
      }
      hasComplete && complete(res);
    });
    if (typeof cid !== 'undefined') {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
}
var onPushMessageCallbacks = [];
// 不使用 defineOnApi 实现，是因为 defineOnApi 依赖 UniServiceJSBridge ，该对象目前在小程序上未提供，故简单实现
var onPushMessage = function onPushMessage(fn) {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
var offPushMessage = function offPushMessage(fn) {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    var index = onPushMessageCallbacks.indexOf(fn);
    if (index > -1) {
      onPushMessageCallbacks.splice(index, 1);
    }
  }
};
var baseInfo = wx.getAppBaseInfo && wx.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx.getSystemInfoSync();
}
var host = baseInfo ? baseInfo.host : null;
var shareVideoMessage = host && host.env === 'SAAASDK' ? wx.miniapp.shareVideoMessage : wx.shareVideoMessage;
var api = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shareVideoMessage: shareVideoMessage,
  getPushClientId: getPushClientId,
  onPushMessage: onPushMessage,
  offPushMessage: offPushMessage,
  invokePushCallback: invokePushCallback
});
var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];
function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
function initBehavior(options) {
  return Behavior(options);
}
function isPage() {
  return !!this.route;
}
function initRelation(detail) {
  this.triggerEvent('__l', detail);
}
function selectAllComponents(mpInstance, selector, $refs) {
  var components = mpInstance.selectAllComponents(selector) || [];
  components.forEach(function (component) {
    var ref = component.dataset.ref;
    $refs[ref] = component.$vm || toSkip(component);
    {
      if (component.dataset.vueGeneric === 'scoped') {
        component.selectAllComponents('.scoped-ref').forEach(function (scopedComponent) {
          selectAllComponents(scopedComponent, selector, $refs);
        });
      }
    }
  });
}
function syncRefs(refs, newRefs) {
  var oldKeys = (0, _construct2.default)(Set, (0, _toConsumableArray2.default)(Object.keys(refs)));
  var newKeys = Object.keys(newRefs);
  newKeys.forEach(function (key) {
    var oldValue = refs[key];
    var newValue = newRefs[key];
    if (Array.isArray(oldValue) && Array.isArray(newValue) && oldValue.length === newValue.length && newValue.every(function (value) {
      return oldValue.includes(value);
    })) {
      return;
    }
    refs[key] = newValue;
    oldKeys.delete(key);
  });
  oldKeys.forEach(function (key) {
    delete refs[key];
  });
  return refs;
}
function initRefs(vm) {
  var mpInstance = vm.$scope;
  var refs = {};
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      selectAllComponents(mpInstance, '.vue-ref', $refs);
      // TODO 暂不考虑 for 中的 scoped
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for') || [];
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || toSkip(component));
      });
      return syncRefs(refs, $refs);
    }
  });
}
function handleLink(event) {
  var _ref3 = event.detail || event.value,
    vuePid = _ref3.vuePid,
    vueOptions = _ref3.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  vueOptions.parent = parentVm;
}
function markMPComponent(component) {
  // 在 Vue 中标记为小程序组件
  var IS_MP = '__v_isMPComponent';
  Object.defineProperty(component, IS_MP, {
    configurable: true,
    enumerable: false,
    value: true
  });
  return component;
}
function toSkip(obj) {
  var OB = '__ob__';
  var SKIP = '__v_skip';
  if (isObject(obj) && Object.isExtensible(obj)) {
    // 避免被 @vue/composition-api 观测
    Object.defineProperty(obj, OB, {
      configurable: true,
      enumerable: false,
      value: (0, _defineProperty2.default)({}, SKIP, true)
    });
  }
  return obj;
}
var WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach(function (name) {
      var matches = name.match(WORKLET_RE);
      if (matches) {
        var workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
var MPPage = Page;
var MPComponent = Component;
var customizeRE = /:/g;
var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});
function initTriggerEvent(mpInstance) {
  var oldTriggerEvent = mpInstance.triggerEvent;
  var newTriggerEvent = function newTriggerEvent(event) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    // 事件名统一转驼峰格式，仅处理：当前组件为 vue 组件、当前组件为 vue 组件子组件
    if (this.$vm || this.dataset && this.dataset.comType) {
      event = customize(event);
    } else {
      // 针对微信/QQ小程序单独补充驼峰格式事件，以兼容历史项目
      var newEvent = customize(event);
      if (newEvent !== event) {
        oldTriggerEvent.apply(this, [newEvent].concat(args));
      }
    }
    return oldTriggerEvent.apply(this, [event].concat(args));
  };
  try {
    // 京东小程序 triggerEvent 为只读
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initHook(name, options, isComponent) {
  var oldHook = options[name];
  options[name] = function () {
    markMPComponent(this);
    initTriggerEvent(this);
    if (oldHook) {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return oldHook.apply(this, args);
    }
  };
}
if (!MPPage.__$wrappered) {
  MPPage.__$wrappered = true;
  Page = function Page() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    initHook('onLoad', options);
    return MPPage(options);
  };
  Page.after = MPPage.after;
  Component = function Component() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    initHook('created', options);
    return MPComponent(options);
  };
}
var PAGE_EVENT_HOOKS = ['onPullDownRefresh', 'onReachBottom', 'onAddToFavorites', 'onShareTimeline', 'onShareAppMessage', 'onPageScroll', 'onResize', 'onTabItemTap'];
function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}
function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }
  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }
  vueOptions = vueOptions.default || vueOptions;
  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super && vueOptions.super.options && Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }
  if (isFn(vueOptions[hook]) || Array.isArray(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {
      return hasHook(hook, mixin);
    });
  }
}
function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}
function initUnknownHooks(mpOptions, vueOptions) {
  var excludes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  findHooks(vueOptions).forEach(function (hook) {
    return initHook$1(mpOptions, hook, excludes);
  });
}
function findHooks(vueOptions) {
  var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (vueOptions) {
    Object.keys(vueOptions).forEach(function (name) {
      if (name.indexOf('on') === 0 && isFn(vueOptions[name])) {
        hooks.push(name);
      }
    });
  }
  return hooks;
}
function initHook$1(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn(mpOptions, hook)) {
    mpOptions[hook] = function (args) {
      return this.$vm && this.$vm.__call_hook(hook, args);
    };
  }
}
function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  vueOptions = VueComponent.options;
  return [VueComponent, vueOptions];
}
function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}
function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;
  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}
function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};
  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"SuperBot","VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }
  if (!isPlainObject(data)) {
    data = {};
  }
  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });
  return data;
}
var PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions.behaviors;
  var vueExtends = vueOptions.extends;
  var vueMixins = vueOptions.mixins;
  var vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps.name = {
            type: String,
            default: ''
          };
          vueProps.value = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ''
          };
        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(initBehavior({
      properties: initProperties(vueExtends.props, true)
    }));
  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(initBehavior({
          properties: initProperties(vueMixin.props, true)
        }));
      }
    });
  }
  return behaviors;
}
function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function initProperties(props) {
  var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var options = arguments.length > 3 ? arguments[3] : undefined;
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: ''
    };
    {
      if (options.virtualHost) {
        properties.virtualHostStyle = {
          type: null,
          value: ''
        };
        properties.virtualHostClass = {
          type: null,
          value: ''
        };
      }
    }
    // scopedSlotsCompiler auto
    properties.scopedSlotsCompiler = {
      type: String,
      value: ''
    };
    properties.vueSlots = {
      // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots
        });
      }
    };
  }
  if (Array.isArray(props)) {
    // ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key)
      };
    });
  } else if (isPlainObject(props)) {
    // {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {
        // title:{type:String,default:''}
        var value = opts.default;
        if (isFn(value)) {
          value = value();
        }
        opts.type = parsePropType(key, opts.type);
        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key)
        };
      } else {
        // content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key)
        };
      }
    });
  }
  return properties;
}
function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}
  event.stopPropagation = noop;
  event.preventDefault = noop;
  event.target = event.target || {};
  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }
  if (hasOwn(event, 'markerId')) {
    event.detail = (0, _typeof2.default)(event.detail) === 'object' ? event.detail : {};
    event.detail.markerId = event.markerId;
  }
  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }
  return event;
}
function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {
      // ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];
      var vFor;
      if (Number.isInteger(dataPath)) {
        vFor = dataPath;
      } else if (!dataPath) {
        vFor = context;
      } else if (typeof dataPath === 'string' && dataPath) {
        if (dataPath.indexOf('#s#') === 0) {
          vFor = dataPath.substr(3);
        } else {
          vFor = vm.__get_value(dataPath, context);
        }
      }
      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }
      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}
function processEventExtra(vm, extra, event, __args__) {
  var extraObj = {};
  if (Array.isArray(extra) && extra.length) {
    /**
     *[
     *    ['data.items', 'data.id', item.data.id],
     *    ['metas', 'id', meta.id]
     *],
     *[
     *    ['data.items', 'data.id', item.data.id],
     *    ['metas', 'id', meta.id]
     *],
     *'test'
     */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {
          // model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {
            // $event
            extraObj['$' + index] = event;
          } else if (dataPath === 'arguments') {
            extraObj['$' + index] = event.detail ? event.detail.__args__ || __args__ : __args__;
          } else if (dataPath.indexOf('$event.') === 0) {
            // $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }
  return extraObj;
}
function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}
function processEventArgs(vm, event) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var isCustom = arguments.length > 4 ? arguments[4] : undefined;
  var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象

  // fixed 用户直接触发 mpInstance.triggerEvent
  var __args__ = isPlainObject(event.detail) ? event.detail.__args__ || [event.detail] : [event.detail];
  if (isCustom) {
    // 自定义事件
    isCustomMPEvent = event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {
      // 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return __args__;
    }
  }
  var extraObj = processEventExtra(vm, extra, event, __args__);
  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {
        // input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(__args__[0]);
        } else {
          // wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });
  return ret;
}
var ONCE = '~';
var CUSTOM = '^';
function isMatchEventType(eventType, optType) {
  return eventType === optType || optType === 'regionchange' && (eventType === 'begin' || eventType === 'end');
}
function getContextVm(vm) {
  var $parent = vm.$parent;
  // 父组件是 scoped slots 或者其他自定义组件时继续查找
  while ($parent && $parent.$parent && ($parent.$options.generic || $parent.$parent.$options.generic || $parent.$scope._$vuePid)) {
    $parent = $parent.$parent;
  }
  return $parent && $parent.$parent;
}
function handleEvent(event) {
  var _this2 = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn('事件信息不存在');
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn('事件信息不存在');
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;
  var ret = [];
  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];
    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;
    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this2.$vm;
          if (handlerCtx.$options.generic) {
            // mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = getContextVm(handlerCtx) || handlerCtx;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx, processEventArgs(_this2.$vm, event, eventArray[1], eventArray[2], isCustom, methodName));
            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            var _type = _this2.$vm.mpType === 'page' ? 'Page' : 'Component';
            var path = _this2.route || _this2.is;
            throw new Error("".concat(_type, " \"").concat(path, "\" does not have a method \"").concat(methodName, "\""));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          var params = processEventArgs(_this2.$vm, event, eventArray[1], eventArray[2], isCustom, methodName);
          params = Array.isArray(params) ? params : [];
          // 参数尾部增加原始事件对象用于复杂表达式内获取额外数据
          if (/=\s*\S+\.eventParams\s*\|\|\s*\S+\[['"]event-params['"]\]/.test(handler.toString())) {
            // eslint-disable-next-line no-sparse-arrays
            params = params.concat([,,,,,,,,,, event]);
          }
          ret.push(handler.apply(handlerCtx, params));
        }
      });
    }
  });
  if (eventType === 'input' && ret.length === 1 && typeof ret[0] !== 'undefined') {
    return ret[0];
  }
}
var eventChannels = {};
var eventChannelStack = [];
function getEventChannel(id) {
  if (id) {
    var eventChannel = eventChannels[id];
    delete eventChannels[id];
    return eventChannel;
  }
  return eventChannelStack.shift();
}
var hooks = ['onShow', 'onHide', 'onError', 'onPageNotFound', 'onThemeChange', 'onUnhandledRejection'];
function initEventChannel() {
  _vue.default.prototype.getOpenerEventChannel = function () {
    // 微信小程序使用自身getOpenerEventChannel
    {
      return this.$scope.getOpenerEventChannel();
    }
  };
  var callHook = _vue.default.prototype.__call_hook;
  _vue.default.prototype.__call_hook = function (hook, args) {
    if (hook === 'onLoad' && args && args.__id__) {
      this.__eventChannel__ = getEventChannel(args.__id__);
      delete args.__id__;
    }
    return callHook.call(this, hook, args);
  };
}
function initScopedSlotsParams() {
  var center = {};
  var parents = {};
  function currentId(fn) {
    var vueIds = this.$options.propsData.vueId;
    if (vueIds) {
      var vueId = vueIds.split(',')[0];
      fn(vueId);
    }
  }
  _vue.default.prototype.$hasSSP = function (vueId) {
    var slot = center[vueId];
    if (!slot) {
      parents[vueId] = this;
      this.$on('hook:destroyed', function () {
        delete parents[vueId];
      });
    }
    return slot;
  };
  _vue.default.prototype.$getSSP = function (vueId, name, needAll) {
    var slot = center[vueId];
    if (slot) {
      var params = slot[name] || [];
      if (needAll) {
        return params;
      }
      return params[0];
    }
  };
  _vue.default.prototype.$setSSP = function (name, value) {
    var index = 0;
    currentId.call(this, function (vueId) {
      var slot = center[vueId];
      var params = slot[name] = slot[name] || [];
      params.push(value);
      index = params.length - 1;
    });
    return index;
  };
  _vue.default.prototype.$initSSP = function () {
    currentId.call(this, function (vueId) {
      center[vueId] = {};
    });
  };
  _vue.default.prototype.$callSSP = function () {
    currentId.call(this, function (vueId) {
      if (parents[vueId]) {
        parents[vueId].$forceUpdate();
      }
    });
  };
  _vue.default.mixin({
    destroyed: function destroyed() {
      var propsData = this.$options.propsData;
      var vueId = propsData && propsData.vueId;
      if (vueId) {
        delete center[vueId];
        delete parents[vueId];
      }
    }
  });
}
function parseBaseApp(vm, _ref4) {
  var mocks = _ref4.mocks,
    initRefs = _ref4.initRefs;
  initEventChannel();
  {
    initScopedSlotsParams();
  }
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }
  uniIdMixin(_vue.default);
  _vue.default.prototype.mpHost = "mp-weixin";
  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }
      this.mpType = this.$options.mpType;
      this.$mp = (0, _defineProperty2.default)({
        data: {}
      }, this.mpType, this.$options.mpInstance);
      this.$scope = this.$options.mpInstance;
      delete this.$options.mpType;
      delete this.$options.mpInstance;
      if (this.mpType === 'page' && typeof getApp === 'function') {
        // hack vue-i18n
        var app = getApp();
        if (app.$vm && app.$vm.$i18n) {
          this._i18n = app.$vm.$i18n;
        }
      }
      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    }
  });
  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {
        // 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (wx.canIUse && !wx.canIUse('nextTick')) {
          // 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }
      this.$vm = vm;
      this.$vm.$mp = {
        app: this
      };
      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;
      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);
      this.$vm.__call_hook('onLaunch', args);
    }
  };

  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }
  initAppLocale(_vue.default, vm, normalizeLocale(wx.getSystemInfoSync().language) || LOCALE_EN);
  initHooks(appOptions, hooks);
  initUnknownHooks(appOptions, vm.$options);
  return appOptions;
}
function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs
  });
}
function createApp(vm) {
  App(parseApp(vm));
  return vm;
}
var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function encodeReserveReplacer(c) {
  return '%' + c.charCodeAt(0).toString(16);
};
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function encode(str) {
  return encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ',');
};
function stringifyQuery(obj) {
  var encodeStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : encode;
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];
    if (val === undefined) {
      return '';
    }
    if (val === null) {
      return encodeStr(key);
    }
    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return;
        }
        if (val2 === null) {
          result.push(encodeStr(key));
        } else {
          result.push(encodeStr(key) + '=' + encodeStr(val2));
        }
      });
      return result.join('&');
    }
    return encodeStr(key) + '=' + encodeStr(val);
  }).filter(function (x) {
    return x.length > 0;
  }).join('&') : null;
  return res ? "?".concat(res) : '';
}
function parseBaseComponent(vueComponentOptions) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    isPage = _ref5.isPage,
    initRelation = _ref5.initRelation;
  var needVueOptions = arguments.length > 2 ? arguments[2] : undefined;
  var _initVueComponent = initVueComponent(_vue.default, vueComponentOptions),
    _initVueComponent2 = (0, _slicedToArray2.default)(_initVueComponent, 2),
    VueComponent = _initVueComponent2[0],
    vueOptions = _initVueComponent2[1];
  var options = _objectSpread({
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true
  }, vueOptions.options || {});
  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin'].options) {
      Object.assign(options, vueOptions['mp-weixin'].options);
    }
  }
  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file, options),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;
        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties
        };
        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options
        });

        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm && this.$vm.$destroy();
      }
    },
    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      }
    },
    methods: {
      __l: handleLink,
      __e: handleEvent
    }
  };
  // externalClasses
  if (vueOptions.externalClasses) {
    componentOptions.externalClasses = vueOptions.externalClasses;
  }
  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }
  if (needVueOptions) {
    return [componentOptions, vueOptions, VueComponent];
  }
  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}
function parseComponent(vueComponentOptions, needVueOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation
  }, needVueOptions);
}
var hooks$1 = ['onShow', 'onHide', 'onUnload'];
hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);
function parseBasePage(vuePageOptions) {
  var _parseComponent = parseComponent(vuePageOptions, true),
    _parseComponent2 = (0, _slicedToArray2.default)(_parseComponent, 2),
    pageOptions = _parseComponent2[0],
    vueOptions = _parseComponent2[1];
  initHooks(pageOptions.methods, hooks$1, vueOptions);
  pageOptions.methods.onLoad = function (query) {
    this.options = query;
    var copyQuery = Object.assign({}, query);
    delete copyQuery.__id__;
    this.$page = {
      fullPath: '/' + (this.route || this.is) + stringifyQuery(copyQuery)
    };
    this.$vm.$mp.query = query; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', query);
  };
  {
    initUnknownHooks(pageOptions.methods, vuePageOptions, ['onReady']);
  }
  {
    initWorkletMethods(pageOptions.methods, vueOptions.methods);
  }
  return pageOptions;
}
function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions);
}
function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}
function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}
function createSubpackageApp(vm) {
  var appOptions = parseApp(vm);
  var app = getApp({
    allowDefault: true
  });
  vm.$scope = app;
  var globalData = app.globalData;
  if (globalData) {
    Object.keys(appOptions.globalData).forEach(function (name) {
      if (!hasOwn(globalData, name)) {
        globalData[name] = appOptions.globalData[name];
      }
    });
  }
  Object.keys(appOptions).forEach(function (name) {
    if (!hasOwn(app, name)) {
      app[name] = appOptions[name];
    }
  });
  if (isFn(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow(function () {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      vm.__call_hook('onShow', args);
    });
  }
  if (isFn(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide(function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      vm.__call_hook('onHide', args);
    });
  }
  if (isFn(appOptions.onLaunch)) {
    var args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    vm.__call_hook('onLaunch', args);
  }
  return vm;
}
function createPlugin(vm) {
  var appOptions = parseApp(vm);
  if (isFn(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow(function () {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }
      vm.__call_hook('onShow', args);
    });
  }
  if (isFn(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide(function () {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }
      vm.__call_hook('onHide', args);
    });
  }
  if (isFn(appOptions.onLaunch)) {
    var args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    vm.__call_hook('onLaunch', args);
  }
  return vm;
}
todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});
canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name : canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});
var uni = {};
if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (hasOwn(target, name)) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    }
  });
} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });
  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }
  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });
  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });
  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}
wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;
wx.createSubpackageApp = createSubpackageApp;
wx.createPlugin = createPlugin;
var uni$1 = uni;
var _default = uni$1;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 5 */
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles.js */ 6);
var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit.js */ 7);
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ 8);
var nonIterableRest = __webpack_require__(/*! ./nonIterableRest.js */ 10);
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 6 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 7 */
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) {
        ;
      }
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 8 */
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ 9);
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 9 */
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 10 */
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 11 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ 12);
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 12 */
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPropertyKey.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
var toPrimitive = __webpack_require__(/*! ./toPrimitive.js */ 14);
function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 13 */
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 14 */
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPrimitive.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 15 */
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/construct.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ 16);
var isNativeReflectConstruct = __webpack_require__(/*! ./isNativeReflectConstruct.js */ 17);
function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    module.exports = _construct = Reflect.construct.bind(), module.exports.__esModule = true, module.exports["default"] = module.exports;
  } else {
    module.exports = _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) setPrototypeOf(instance, Class.prototype);
      return instance;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
  return _construct.apply(null, arguments);
}
module.exports = _construct, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 16 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 17 */
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/isNativeReflectConstruct.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
module.exports = _isNativeReflectConstruct, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 18 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles.js */ 19);
var iterableToArray = __webpack_require__(/*! ./iterableToArray.js */ 20);
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ 8);
var nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread.js */ 21);
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 19 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ 9);
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 20 */
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 21 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 22 */
/*!*************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-i18n/dist/uni-i18n.es.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, global) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOCALE_ZH_HANT = exports.LOCALE_ZH_HANS = exports.LOCALE_FR = exports.LOCALE_ES = exports.LOCALE_EN = exports.I18n = exports.Formatter = void 0;
exports.compileI18nJsonStr = compileI18nJsonStr;
exports.hasI18nJson = hasI18nJson;
exports.initVueI18n = initVueI18n;
exports.isI18nStr = isI18nStr;
exports.isString = void 0;
exports.normalizeLocale = normalizeLocale;
exports.parseI18nJson = parseI18nJson;
exports.resolveLocale = resolveLocale;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var isObject = function isObject(val) {
  return val !== null && (0, _typeof2.default)(val) === 'object';
};
var defaultDelimiters = ['{', '}'];
var BaseFormatter = /*#__PURE__*/function () {
  function BaseFormatter() {
    (0, _classCallCheck2.default)(this, BaseFormatter);
    this._caches = Object.create(null);
  }
  (0, _createClass2.default)(BaseFormatter, [{
    key: "interpolate",
    value: function interpolate(message, values) {
      var delimiters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultDelimiters;
      if (!values) {
        return [message];
      }
      var tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }]);
  return BaseFormatter;
}();
exports.Formatter = BaseFormatter;
var RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
var RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
function parse(format, _ref) {
  var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
    startDelimiter = _ref2[0],
    endDelimiter = _ref2[1];
  var tokens = [];
  var position = 0;
  var text = '';
  while (position < format.length) {
    var char = format[position++];
    if (char === startDelimiter) {
      if (text) {
        tokens.push({
          type: 'text',
          value: text
        });
      }
      text = '';
      var sub = '';
      char = format[position++];
      while (char !== undefined && char !== endDelimiter) {
        sub += char;
        char = format[position++];
      }
      var isClosed = char === endDelimiter;
      var type = RE_TOKEN_LIST_VALUE.test(sub) ? 'list' : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? 'named' : 'unknown';
      tokens.push({
        value: sub,
        type: type
      });
    }
    //  else if (char === '%') {
    //   // when found rails i18n syntax, skip text capture
    //   if (format[position] !== '{') {
    //     text += char
    //   }
    // }
    else {
      text += char;
    }
  }
  text && tokens.push({
    type: 'text',
    value: text
  });
  return tokens;
}
function compile(tokens, values) {
  var compiled = [];
  var index = 0;
  var mode = Array.isArray(values) ? 'list' : isObject(values) ? 'named' : 'unknown';
  if (mode === 'unknown') {
    return compiled;
  }
  while (index < tokens.length) {
    var token = tokens[index];
    switch (token.type) {
      case 'text':
        compiled.push(token.value);
        break;
      case 'list':
        compiled.push(values[parseInt(token.value, 10)]);
        break;
      case 'named':
        if (mode === 'named') {
          compiled.push(values[token.value]);
        } else {
          if (true) {
            console.warn("Type of token '".concat(token.type, "' and format of value '").concat(mode, "' don't match!"));
          }
        }
        break;
      case 'unknown':
        if (true) {
          console.warn("Detect 'unknown' type of token!");
        }
        break;
    }
    index++;
  }
  return compiled;
}
var LOCALE_ZH_HANS = 'zh-Hans';
exports.LOCALE_ZH_HANS = LOCALE_ZH_HANS;
var LOCALE_ZH_HANT = 'zh-Hant';
exports.LOCALE_ZH_HANT = LOCALE_ZH_HANT;
var LOCALE_EN = 'en';
exports.LOCALE_EN = LOCALE_EN;
var LOCALE_FR = 'fr';
exports.LOCALE_FR = LOCALE_FR;
var LOCALE_ES = 'es';
exports.LOCALE_ES = LOCALE_ES;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = function hasOwn(val, key) {
  return hasOwnProperty.call(val, key);
};
var defaultFormatter = new BaseFormatter();
function include(str, parts) {
  return !!parts.find(function (part) {
    return str.indexOf(part) !== -1;
  });
}
function startsWith(str, parts) {
  return parts.find(function (part) {
    return str.indexOf(part) === 0;
  });
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, '-');
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === 'chinese') {
    // 支付宝
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf('zh') === 0) {
    if (locale.indexOf('-hans') > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf('-hant') > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ['-tw', '-hk', '-mo', '-cht'])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  var locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  if (messages && Object.keys(messages).length > 0) {
    locales = Object.keys(messages);
  }
  var lang = startsWith(locale, locales);
  if (lang) {
    return lang;
  }
}
var I18n = /*#__PURE__*/function () {
  function I18n(_ref3) {
    var locale = _ref3.locale,
      fallbackLocale = _ref3.fallbackLocale,
      messages = _ref3.messages,
      watcher = _ref3.watcher,
      formater = _ref3.formater;
    (0, _classCallCheck2.default)(this, I18n);
    this.locale = LOCALE_EN;
    this.fallbackLocale = LOCALE_EN;
    this.message = {};
    this.messages = {};
    this.watchers = [];
    if (fallbackLocale) {
      this.fallbackLocale = fallbackLocale;
    }
    this.formater = formater || defaultFormatter;
    this.messages = messages || {};
    this.setLocale(locale || LOCALE_EN);
    if (watcher) {
      this.watchLocale(watcher);
    }
  }
  (0, _createClass2.default)(I18n, [{
    key: "setLocale",
    value: function setLocale(locale) {
      var _this = this;
      var oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        // 可能初始化时不存在
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      // 仅发生变化时，通知
      if (oldLocale !== this.locale) {
        this.watchers.forEach(function (watcher) {
          watcher(_this.locale, oldLocale);
        });
      }
    }
  }, {
    key: "getLocale",
    value: function getLocale() {
      return this.locale;
    }
  }, {
    key: "watchLocale",
    value: function watchLocale(fn) {
      var _this2 = this;
      var index = this.watchers.push(fn) - 1;
      return function () {
        _this2.watchers.splice(index, 1);
      };
    }
  }, {
    key: "add",
    value: function add(locale, message) {
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach(function (key) {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
  }, {
    key: "f",
    value: function f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join('');
    }
  }, {
    key: "t",
    value: function t(key, locale, values) {
      var message = this.message;
      if (typeof locale === 'string') {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn("Cannot translate the value of keypath ".concat(key, ". Use the value of keypath as default."));
        return key;
      }
      return this.formater.interpolate(message[key], values).join('');
    }
  }]);
  return I18n;
}();
exports.I18n = I18n;
function watchAppLocale(appVm, i18n) {
  // 需要保证 watch 的触发在组件渲染之前
  if (appVm.$watchLocale) {
    // vue2
    appVm.$watchLocale(function (newLocale) {
      i18n.setLocale(newLocale);
    });
  } else {
    appVm.$watch(function () {
      return appVm.$locale;
    }, function (newLocale) {
      i18n.setLocale(newLocale);
    });
  }
}
function getDefaultLocale() {
  if (typeof uni !== 'undefined' && uni.getLocale) {
    return uni.getLocale();
  }
  // 小程序平台，uni 和 uni-i18n 互相引用，导致访问不到 uni，故在 global 上挂了 getLocale
  if (typeof global !== 'undefined' && global.getLocale) {
    return global.getLocale();
  }
  return LOCALE_EN;
}
function initVueI18n(locale) {
  var messages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fallbackLocale = arguments.length > 2 ? arguments[2] : undefined;
  var watcher = arguments.length > 3 ? arguments[3] : undefined;
  // 兼容旧版本入参
  if (typeof locale !== 'string') {
    var _ref4 = [messages, locale];
    locale = _ref4[0];
    messages = _ref4[1];
  }
  if (typeof locale !== 'string') {
    // 因为小程序平台，uni-i18n 和 uni 互相引用，导致此时访问 uni 时，为 undefined
    locale = getDefaultLocale();
  }
  if (typeof fallbackLocale !== 'string') {
    fallbackLocale = typeof __uniConfig !== 'undefined' && __uniConfig.fallbackLocale || LOCALE_EN;
  }
  var i18n = new I18n({
    locale: locale,
    fallbackLocale: fallbackLocale,
    messages: messages,
    watcher: watcher
  });
  var _t = function t(key, values) {
    if (typeof getApp !== 'function') {
      // app view
      /* eslint-disable no-func-assign */
      _t = function t(key, values) {
        return i18n.t(key, values);
      };
    } else {
      var isWatchedAppLocale = false;
      _t = function t(key, values) {
        var appVm = getApp().$vm;
        // 可能$vm还不存在，比如在支付宝小程序中，组件定义较早，在props的default里使用了t()函数（如uni-goods-nav），此时app还未初始化
        // options: {
        // 	type: Array,
        // 	default () {
        // 		return [{
        // 			icon: 'shop',
        // 			text: t("uni-goods-nav.options.shop"),
        // 		}, {
        // 			icon: 'cart',
        // 			text: t("uni-goods-nav.options.cart")
        // 		}]
        // 	}
        // },
        if (appVm) {
          // 触发响应式
          appVm.$locale;
          if (!isWatchedAppLocale) {
            isWatchedAppLocale = true;
            watchAppLocale(appVm, i18n);
          }
        }
        return i18n.t(key, values);
      };
    }
    return _t(key, values);
  };
  return {
    i18n: i18n,
    f: function f(message, values, delimiters) {
      return i18n.f(message, values, delimiters);
    },
    t: function t(key, values) {
      return _t(key, values);
    },
    add: function add(locale, message) {
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      return i18n.add(locale, message, override);
    },
    watch: function watch(fn) {
      return i18n.watchLocale(fn);
    },
    getLocale: function getLocale() {
      return i18n.getLocale();
    },
    setLocale: function setLocale(newLocale) {
      return i18n.setLocale(newLocale);
    }
  };
}
var isString = function isString(val) {
  return typeof val === 'string';
};
exports.isString = isString;
var formater;
function hasI18nJson(jsonObj, delimiters) {
  if (!formater) {
    formater = new BaseFormatter();
  }
  return walkJsonObj(jsonObj, function (jsonObj, key) {
    var value = jsonObj[key];
    if (isString(value)) {
      if (isI18nStr(value, delimiters)) {
        return true;
      }
    } else {
      return hasI18nJson(value, delimiters);
    }
  });
}
function parseI18nJson(jsonObj, values, delimiters) {
  if (!formater) {
    formater = new BaseFormatter();
  }
  walkJsonObj(jsonObj, function (jsonObj, key) {
    var value = jsonObj[key];
    if (isString(value)) {
      if (isI18nStr(value, delimiters)) {
        jsonObj[key] = compileStr(value, values, delimiters);
      }
    } else {
      parseI18nJson(value, values, delimiters);
    }
  });
  return jsonObj;
}
function compileI18nJsonStr(jsonStr, _ref5) {
  var locale = _ref5.locale,
    locales = _ref5.locales,
    delimiters = _ref5.delimiters;
  if (!isI18nStr(jsonStr, delimiters)) {
    return jsonStr;
  }
  if (!formater) {
    formater = new BaseFormatter();
  }
  var localeValues = [];
  Object.keys(locales).forEach(function (name) {
    if (name !== locale) {
      localeValues.push({
        locale: name,
        values: locales[name]
      });
    }
  });
  localeValues.unshift({
    locale: locale,
    values: locales[locale]
  });
  try {
    return JSON.stringify(compileJsonObj(JSON.parse(jsonStr), localeValues, delimiters), null, 2);
  } catch (e) {}
  return jsonStr;
}
function isI18nStr(value, delimiters) {
  return value.indexOf(delimiters[0]) > -1;
}
function compileStr(value, values, delimiters) {
  return formater.interpolate(value, values, delimiters).join('');
}
function compileValue(jsonObj, key, localeValues, delimiters) {
  var value = jsonObj[key];
  if (isString(value)) {
    // 存在国际化
    if (isI18nStr(value, delimiters)) {
      jsonObj[key] = compileStr(value, localeValues[0].values, delimiters);
      if (localeValues.length > 1) {
        // 格式化国际化语言
        var valueLocales = jsonObj[key + 'Locales'] = {};
        localeValues.forEach(function (localValue) {
          valueLocales[localValue.locale] = compileStr(value, localValue.values, delimiters);
        });
      }
    }
  } else {
    compileJsonObj(value, localeValues, delimiters);
  }
}
function compileJsonObj(jsonObj, localeValues, delimiters) {
  walkJsonObj(jsonObj, function (jsonObj, key) {
    compileValue(jsonObj, key, localeValues, delimiters);
  });
  return jsonObj;
}
function walkJsonObj(jsonObj, walk) {
  if (Array.isArray(jsonObj)) {
    for (var i = 0; i < jsonObj.length; i++) {
      if (walk(jsonObj, i)) {
        return true;
      }
    }
  } else if (isObject(jsonObj)) {
    for (var key in jsonObj) {
      if (walk(jsonObj, key)) {
        return true;
      }
    }
  }
  return false;
}
function resolveLocale(locales) {
  return function (locale) {
    if (!locale) {
      return locale;
    }
    locale = normalizeLocale(locale) || locale;
    return resolveLocaleChain(locale).find(function (locale) {
      return locales.indexOf(locale) > -1;
    });
  };
}
function resolveLocaleChain(locale) {
  var chain = [];
  var tokens = locale.split('-');
  while (tokens.length) {
    chain.push(tokens.join('-'));
    tokens.pop();
  }
  return chain;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 23 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 24 */
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ 12);
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 25 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2023 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      if (vm.$options && vm.$options.__file) { // fixed by xxxxxx
        return ('') + vm.$options.__file
      }
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm && vm.$options.name !== 'PageBody') {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        !vm.$options.isReserved && tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
  Dep.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
  Dep.target = Dep.SharedObject.target;
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue &&
    !value.__v_isMPComponent
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i, i++)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu' || vm.mpHost === 'mp-kuaishou' || vm.mpHost === 'mp-xhs'){//百度、快手、小红书 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    !vm._$fallback && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    !vm._$fallback && initProvide(vm); // resolve provide after data/props
    !vm._$fallback && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
var NULLTYPE = '[object Null]';
var UNDEFINEDTYPE = '[object Undefined]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function nullOrUndefined(currentType, preType) {
    if(
        (currentType === NULLTYPE || currentType === UNDEFINEDTYPE) && 
        (preType === NULLTYPE || preType === UNDEFINEDTYPE)
    ) {
        return false
    }
    return true
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue !== pre[key] && nullOrUndefined(currentType, preType)) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"SuperBot","VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"SuperBot","VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"SuperBot","VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function clearInstance(key, value) {
  // 简易去除 Vue 和小程序组件实例
  if (value) {
    if (value._isVue || value.__v_isMPComponent) {
      return {}
    }
  }
  return value
}

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);

  // vue-composition-api
  var compositionApiState = vm.__composition_api_state__ || vm.__secret_vfa_state__;
  var rawBindings = compositionApiState && compositionApiState.rawBindings;
  if (rawBindings) {
    Object.keys(rawBindings).forEach(function (key) {
      ret[key] = vm[key];
    });
  }

  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret, clearInstance))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = this.$shouldDiffData === false ? data : diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"SuperBot","VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  !vm._$fallback && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err, vm, info) {
    Vue.util.warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    console.error(err);
    /* eslint-disable no-undef */
    var app = typeof getApp === 'function' && getApp();
    if (app && app.onError) {
      app.onError(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      var triggerEvent = this.$scope['_triggerEvent'] || this.$scope['triggerEvent'];
      if (triggerEvent) {
        try {
          triggerEvent.call(this.$scope, event, {
            __args__: toArray(arguments, 1)
          });
        } catch (error) {

        }
      }
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    // 解决动态属性添加
    Vue.set(target, key, value);
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    // 解决动态属性添加
    Vue.set(target, key, value);
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0, l = val; i < l; i++) {
        // 第一个参数暂时仍和小程序一致
        ret[i] = iteratee(i, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onPageNotFound',
    'onThemeChange',
    'onError',
    'onUnhandledRejection',
    //Page
    'onInit',
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onAddToFavorites',
    'onShareTimeline',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    'onUploadDouyinVideo',
    'onNFCReadMessage',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 26 */
/*!**************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/pages.json ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    if (!options.components) {
      options.components = {}
    }
    var hasOwn = Object.prototype.hasOwnProperty
    for (var name in components) {
      if (hasOwn.call(components, name) && !hasOwn.call(options.components, name)) {
        options.components[name] = components[name]
      }
    }
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    if(typeof renderjs.beforeCreate === 'function'){
			renderjs.beforeCreate = [renderjs.beforeCreate]
		}
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 33 */
/*!*****************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/share/share.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  data: function data() {
    return {
      // 默认的全局分享内容
      share: {
        title: '欢迎体验SuperBot',
        path: '/pages/dialogue/dialogue',
        imageUrl: '/static/images/icon/icon.png'
      }
    };
  },
  // 定义全局分享
  // 1.发送给朋友
  onShareAppMessage: function onShareAppMessage(res) {
    return {
      title: this.share.title,
      path: this.share.path,
      imageUrl: this.share.imageUrl
    };
  },
  //2.分享到朋友圈
  onShareTimeline: function onShareTimeline(res) {
    return {
      title: this.share.title,
      path: this.share.path,
      imageUrl: this.share.imageUrl
    };
  }
};
exports.default = _default;

/***/ }),
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */
/*!*******************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/static/images/img/bot-4.png ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPgAAAD4CAYAAADB0SsLAAAACXBIWXMAAAsTAAALEwEAmpwYAAA6jUlEQVR4nO3dd5Bk2XXf+e+597k05au9d9NmvMMAGBAkQGBBAhBBigBICFhRlARCAZHSitRuyKzsrhTUbkjUbnBDWkpcGYomBImSKJJBJ4gACI/xpnvau+ou77LSPHPv2T+yegyIwWBmqjuzst8nomZ6gOzKk1X5y3fvu05UlVKpNJhMrwsolUo3TxnwUmmAlQEvlQZYGfBSaYCVAS+VBlgZ8FJpgJUBL5UGWBnwUmmAlQEvlQZYGfBSaYCVAS+VBlgZ8FJpgJUBL5UGWBnwUmmAlQEvlQZYsJHf7I9+bY2lBYdTYd8dMc99vUWlZhgetTz+WIvDB2LWmp6LV1IO7I05dm/C8pzj4rmUo3dXOPVMG+eVXbsjnnmmTb1muPPuCiMTlie/0mLHrhDn4bnn2xzaF3H8oSp5qpx6os2RuxOuns9YWnIcPBLzxGMtokC454EqW/eGPPfVFrVhQ23I8tQ3Whw+GjM/U3DpSsbxYwlH7k5YnC6Yupxx+M6Ek091MAJbtwd8/RsttowH3PVAhfqo5ZmvtNixLyRLlTOnOhw7kXD+bMrSiufuExX2Hou4fCaj2XDsORDx1DdaTEwEhJHwzHNt9uyMOH5vBVR5/qk2B+9ImL1ecO16xtGjCQfuSli4ljM7lbP/aMzpZzqEVhiZsDz1ZIutEyHH768Q14ST3+iwc19Iu+W5dC7l0PGE86dSGk3PibsSdh+KuHw6pdP27Ngb8dzjLSa2hKBw8lSHvbtDjt5ToSiUs8912HckZu5azsJCwf6DMc893cEYOHFPhS27A04/0SGuGoZGLM8/2WLPgZjV5e7P8dDBhMN3xjSXPXPXco4+VGHqTEYQCbuPRFw+lfLCyQ6TkwHH7q9w7XzOCy+0GR8NuO/tVVmZdyzNF2ZpsZCVZSezC4U8/FDNHL0/qS3PuvE81Uqn5WtpW6tp6quttq97pzawkgeRZIGVwgZkQSCZDcRFsXTGtgUL7Yaf+9x/b2RrLa/DNatjI0aHhq0ePpH42au5//rjLfbvCjlwJGZhxvHsC22OHIg58WCVIlcunEq5496E6xczOk3P3iMxp55qM7k1JEqE0893uPO+CrPXcpaXCu58oMqz32gjWrB10vDBvzy5kTF7XTY04KXS66ZgDUQVE4WxD4NAxq2RSWMYS2IzfPJUp33pYvaA9/rjXlXUYby+9AWIgCKogIqsf63/2Vr5giq/5gqthVZEIDVWFoNAVqJYpoNI5gZ5y5My4KVbSj1YK8RVI1EklSSRbQtLrvbEF5rb0tT/cLvtd6SpVtNMK0Cy1vL5SsPtFGG/GBBARNb//bLvu57SF8OqoCjeMylwKI4ksQYpnBYrK67Vbmsn67R/vbHmvhZaxAYyF8amE4RuWcHd0h/KTVQGvHRTKWCMEESCsQRhKLXmmkumzqQ7FubcO53j0OJKUbs6m41ZkT9pLRgRjAEjEAVAIK/1NK9CAIaAR2/8Z+GVrKX4pufabDYmIo8M1UzcbPnpuWv515eX3JNWWDVGGjakqfpGn7s/lAEv3VQC4gpvOk2tFZmeCAI5PDVTjJ69lO21wk+KUDEC9eTW3O8Vul0CC4TWPAI8UhTK7HzB9Fzx607ZWY0l9l7PZG19zBV6le7n1I2vTaUMeGnDKSCG7s24MTt85rnO/meear/FO/10WjBR5N4aIUKo0EcXSBHeGwhvc07Nlam8Mz1bfKZeNf9hx85oNqmaq0Eg+Wbbo7QMeGlDhbFQG5Jg+opOPvX55sTamvvY9Gxx/8JKsTcK5S5rus1v22cDtCIg3eb8kCo0O5501X+8sWbu9Z755pr7d97rs5Nbg6WoYhoiwmYIexnw0oYQgcAytHCtiNtN/9DCYvGOy9fyLV71Y0lkhuqVPkv0awgMhInZ4ZUdV2cyzl7R4S1jwckoMi/YS9ln80KXgpCWtZL2utZvpwx4aSOIIFXgnicfb++bXyg+EUZ8fyUW6Kc2+OukdD+4okCIAvlAmvoPPHOyfdoaapMTwYIx0UlX6Glg7WV/pa+UAS+9KWEoQ3Fi7khTv+v8+TRqp/7HjOXt3XT0urqNtZ7eg87zV5dXXPHE483fiALzmWrNtJKquRQEstBvzfYy4KXXRRVsAHEidWNl/OrldKKT6g945T0rTd+xhrcFlkqv67wZ1u/AB8DuLFcaTf+RMPDHxp1NTz3d/qVWyz9dq5nVODGzRsT5Pgh7GfDSd0QEbCCEIXFr1Q+7rLgny/S9UzNF4FS/Nw7kvs3Vy35zjEAllh0KO5ZWHdfnc1OJzbl9u6KrM1fz3yw8c6ExhSoeWO1VnWXAS98RVXCF1mxg7jl/obNvadW9LbB8OrAEwaC1xV+HG+PqtcR8AODytez8lWtZXonN2q6tZlaEaeBrvaqvDHjp21KgUpFaa9Uf+eLvNXa2Ov6nWi1/GBhWJZDbN9uv4DxgLPWa2Ve3+V957Ktn3NCx0X9z+N3bf7GXdZUBL/0xyvo00cgMRwETjYafSNP04SvXs4+YQL4nsiKB7XWVvacKXiEIDFsmQlbn15g/t2xXNN17/tp1HtifjMUVafSyxjLgpVcwViSwEueOkaWF4lDh+L75lWIYkf2VxLyr1/X1C1UII4MBiixHmynt6RnOnZ9iLS9oOkeYhJn39PSjsAx46RVUtW4Duaux6g7PzOYT3vOJKJC9DNyg15ujCtWqJdGMuZk5vvb4DCutNoExVMOQRuH7YqZbGfDbnGp3emlUMZEI+599rD2x1nJ/pp3quwpHYIR9lDv/AFA4CEJLvWaphQXXTk9x5eoszjsa7Xavy/uWyoDf5pKKGb5+Ma+vLLu3Liy4D88uFpXc6aNJKFv6bb54L6jeWDxjGB8LcO02184sUJWcq1NzXFxcoRpFBMYQmP5r5JQBvw2JIIIkQDVL9cCpK523XJrOfrhWMe+2FgLbf2/UXlCFwBpsAJ12jqQZ7Zl5Tr5wnsJ74iBgrFpF+6Et/irKgN+GBOrGcrfzevzshTTzqj80UjPv7HVd/UQBp1CvGkYrytXpBZ56ZpaFRpM4CIhvPK6Pww1lwG8LqmCNEFdNLU7MrkuXstE81+91Tv904chF2GOkfC8AeN9tjo9NxIRFyuLULN+4Mker3aHR7uDUY3t7Y/x1KX+pA+rGSqgwESo1E15byLacfbpzx/Ky+9G5xWIiy/VoHMnhsp/d5TwYa6jVDCEFC+ev41pN5ueXODu7SBwEhNYS2c0TbigDPrCsIF6JV2aLoNX0b5+ZLe6fnssPR5H5s9ZgkqjsZ8ONST1CJRE67QLXyrFZi5PPnWG+3aYexQwnSa/LfMPKgA+oKJJq0dG7vvAHa3saTfeTCA9XEmOkHM9+kSp4IAyFHVsDLj49w7Pnr5EVOYXCcJxgNvlc3DLgA0IBBKJE6kkie+euFZOds+nBpYb7pPM8GFriTf5e3TBewaswuSUh8BmLV+Z5+swK84srNNptnCqBtZs+3FAGfCDYUEhiU3EFE1fPZduWV91HW21/dLXpqpGVt9vytwx0+9lhZKnGBuNymtfnaS2tsLiwxMXZZRRIwnAT3UJ7beWvfrOS7n7jIoSthq/mqX+w1fFvvXoyjxQ+Glr22z6ceNEL3c1lhDgSwOGabQLtcO75i5ydX2Q4TojDsNdl3hRlwDehlx0mEISxHHv2yfaOlTX3o4J+OLAIDOaOKm/EjX62NcK2LQFz52f42pMXiCxkhWM0qQxEU/zVlAHfhOp1W5u+mu2Y/nJ+X6PpP7m0WoxlTg9EVoYG+L36ungFp8L4WEQ1cFw/P8cLlxssLCzTSdukxhAYM9DhhjLgm4ICxkIYSd2IDC8vF1ua1/27LlzJPlxJ5NHQCkkg/belZw94BWsNQ1WLZgXF8gpzK6vMXZvnysIymVOqA9oc/1bKgPc7QYwQZJnWW01/F/COC1czj/I/jNTNozceVoYbQLAGAuOxhUPSJhdeuMqzU7NUowgjAdXbJ9tAGfC+ZgSCQOIkMUfOn093nb2QPuSd/pQ1RMDmnX2xwZT16bihZXJEKJaW+dqXzpFlOaqeehwPfFP81ZQB70NxTaiPWi6fzfY9/qXmntVV/8lG0x1Nc50IrWy9Td+rf4zz3YPBa7WAiVHD5RdmeeHMMkW7xdLaGt4robVYc/vOxy0D3keMCDaQoaunsmR5oXjH/Hzx7qm5bKsR+VAcShy94WN0B4vX7hnhw8MBLsspGqssL6fMXpni8twyXpVqFDFQA9pvUBnw/iDSXc1Vzzp69Okn1+6eWyo+WUnMw9X49r36fCsiggVElMQ68qzB9IXrnL4+DwjJbXQD7TtRBrwPhJEkcSLH19pu//Mn29VO5v98JTb3lPNUXqlwUK0FDNeA5honv36ZmcUVBAhMebn+VsqA90B3R07BhhJbKzvOPNcZbTT9x4pc39V2qtZwvzFlAxO667MVIYwtu7dZ5i8t8PwzcwTkXJ9fopHmJEFwW/ezv50y4D0QRVJfmiuqnZa/d63pf2BmvogLp+9NItkflrEGbuyFJlRrFuMdjeUGa2nBzMUpnr0yTRKGxDagHsd9v6tKL5UBv3WE7m2f0BiOnXmhc+zyVP7+OJaPBeU+aH+MNYJzSi3yaKvFlStXeHZumU7hGK9WX3xcGe5vrwz4LaCAtZKEoTnhlUMXr2aZOj4QRfKBcsjrlQoPlUrA+KjFraxx6dlrXLq2gKrHqRKWW9C8LmXAbxL13QUhcUVqcSTbr8/kI0bknQIf73S0ZYTj1jDU6zr7wY0FIXESMlEXsqUGp782g+Yp0wsrLDXb3WWcZT/7dSsDfhMEoRDGJMuLfvj6peJQmukPzi4UI0Whx5JIHizP9eq60c+OY0NklcZSg1YjZ3l2nqfOXkbEUgkD6klSNsXfoDLgG0sAm7Y1QnlgfqE4ceZCuscInwwMY0G5D9orGAPOKbFR6kHGhQuXeGJ+CQWGk5dWvJbhfuPKgG8QBeKIwCv3fPVza6Orq+5TWa5vN0Iowmiv6+sXqt39xsPAsG17TLq4yrVzMzw9u0irkwLctvPGb4Yy4G+SCESR1KJQds0v+Impq+nB63PFRwun745DqZfdxi6lO3e8VgupJoJba3Ll6WkaSyssLDeYa7aJrCUof2Abqgz4G2SMYAMq3jOyOO+2Z6l+qJ3qwanZ3IZWfqAc9urS9Q3abSDUAshbLdaW2uSrqzzzwlVWs4x6FN1Wa7RvpTLgb4y4Qmt47slzvf/Z59vqlR9IInmg14X1GxHwqhivjNfhuecu8+zl61TCEGMMo5t4z/HNoAz4d0gVgkBIqsbGiRw6fbIz0Wr5H+yk/ke9ogJbe11jv7gx7IUYdmyPccsNLrxwjcvPNllaXSO0tnvjrOxr33RlwL9DlaqpL84Wk5fOpEfm54s/M7tYjKeZHk8i2VMuCulS1heEVAPqVUPWaDF/dp7F6UVmF1dYbHUwxhAHQXln/BYpA/5tSHdr4qpALcv8nosX0kfOXc7eV0nMhwIDlbhMNtzYLkoIAiGOwLqU9lybfGWV589d49pqk5E4fnEpZxnuW6cM+LehSt177hLDw1eu5Vlg+e7hmvlQr+vqR0bAGtgy5Jk6Nc1Xnrv4YqDHK+Uuzr1SBvxlbnQL48RElYo5fOVKumV+objTOf2LRohUGS27jV3K+lJOMWyZCAldh5NPXuZiq0Wz3cYYwXmPiJTj2j1UBnxdlBiqdRNmGdtPP93eMj9f/Fij5e/Ich1PIjlaDs923ZioEkeWkSFLa6XNyuVFmkvLTM/MsdJJsWJJwrBsiveB2z7gYrr97KWZIlhZLB5ZXnHfffp8PiKGPxUFMl4es9t1I6ph1N3S1WpOsdIinVvg7KUZppYa1KKIahh1H1+Guy+UARcSMdz9jS83d80u5j8WWPlA9wwrymv2NxEgiS31MGf56jxfeuYyaV5gjdnUZ2gPsts24GEs1TiWOzqp7jp/Lk3WWu7PqfIOVWzZZXyJ86DGMlQzjFUdp5+4yPzCEuIdaV50++KqZT+7T902Ab8xUSWuSGIsW65ezMZaLf9DqrxzYaVoBVbeFQWSlA3L9YkqCsYaJiYCOittVq+s0HIdrly9xvW1FrUwIi7Xvfa9gQ+40D3XywZEzTVf8V7vzgt937mLqXiV98cB9yvdq08Z7vUPwtBgAJ8XmE5GNj/HpXPXmG12iKxlolot+9ibxMAHHAEEG8XmxJnTnb2rDfdOMXw6sGKAoHybvpJXqFYs9bBgdWqZJ5+6xmxjjdCaFxeElOHePAY24ApUq1JZW3EHT/9We1ejqT/ZaLqDuWM8gErZZXyJ82ADQ70eMBR5ps9N89zlGcQ7lpotvCrOl/3szWigAq50NwsIQqkHViZX1/x4djF7y/mp9IdDI++JQiEcqFf8xnW3SwLEMDps0Sxl/sIcTXIuX5nh7PwS1TAispY4sJQX7c1pYN7u6/PG49z5ocaKO6yq3ze3UFSslUP1xLyn1/X1E1WwVrBWyNICm+e0FhY4/cIF1rKCwBgmqrUXm+JluDevgQm4sRLFsdy1vOyOzC+0JgunH48j2UV5BN0rqHab5NWqZbyuLF5e4eSpaa4vNTBI2c8eMJs24Krd6aVhAhgOPfXV5mhjzf+5NPPflRWEgeGQCGWncZ33gDGMjkckpmBlaoEnnpwl7XRYarbJi4I42LRvh9Kr2LS/0bhihq5fSKury/7BpUX34emFvOYd74oj2VIe//MSryDGUK0aIilYvjwLaYvFuSVOXZ8jMpYwCEiCoBwmHECbK+AGMUoEVPNCDz3zZPu+y9P5j9QS854okM32am6q7lZoQhQILndImkHR5ORzp5lrtqhGMcNx8orHlwbPpoqEEalIyF1FoSfOnktT7/TDQxXzXeXozSvdmIkWRcL2Scv8+QXOnrvOSqtN7pThOCmHvG4TfR1wVbCBkNRNHMWy59KFdKQo9D3AxzuZZkY4ZIS413X2C6/gVRgfi4itY/X6EqfOLbK4uMJyq03beUJjBibcmfOs5TkGGE1ihLIl8s36OuBxJLW1FTfWWHEHmk3/IzPzxUhW6F2VWE4E5VqvF/n1iSrV2BBoQbq4zMryCqsLK7xwfYHcK5UwILaDcXMic57cO7bWEu47sBVEeP7SHEW5UuiP6ceAi0AIBCLcMXU1e+DiteyhODSftBZbKfcb/2MCKxg8kufEtDl98iKnphcYjmOiICDqdYEbxK8P3VVDy1BS4cjecR5+30GyjufkL8xTOIcdkA+xjdJ3AReRxARyl7FyaGa+cIGVhyqR+YRIOZ79ci+fibZja8DqlTmeeOYieE87LxiJ44E7jbNdOATP3fu2810fvAOCkGg4ZmF6GaAcE/0Weh5wpburSpRILY5l77WZfMKd1zuc0z/vPKGi241Q73Wd/cIrOBVGR0JqkWdxaokLT64wN7fEarOJUwiMHYhwiwidwrGYplSM4X0PHmD77hFq4zVqkzUKDyaw+KLseb+angY8CIUoNkleMHHtUrat2fQfabb1YLOd18NA3lYuN36JV7DGUKsYcA7XWGVxtcHi7BIXphdZzQqG4qj3n9gbwKtSeKVVFOwdrXH3nglqtQr3vGMv4/uH6bSUViMHATtsyvMTvo2evR8Ewk7LR3nqH2h33CNPPpNHAh+NAg6Wja0/zogQiCdUhy1aXDw7xdOXZ6mEAUYMQ/Fg9LRv7A5TjwPi0HLPHdu573v2Upms0m46Vuey7grg8i3yHelJwI0RCWN54OnH2kMLy+6jvvA/ZAVBGOlFPf1KWR8qjAImhgS3usxjX7lAmmZ49VTDYH1b4l5XujG8KgudjB31hIeObeOOB3ZSm6ziVWivFqgvP/pfr1sa8CCiFubszQudmJ4ptqysFh/uZPqeOJTJ8hP5Jd6DF6GSWMaGhIWpJS5dXKa12mBxdZXMK7EdrH52My8YjoT33rmHw3dvoz5WYXzPECpCuuZwTstwvwE3PeBiIAioiTC8OO+2Zbm+z6u+ZX6pWLWGD1QiGSlvkXTdOGq3WrPgHEVzjdWVlPnLM1yYWaBdeGpRyCDcm/BA4TytvGBbPeH+A1upVELufXQPO+6aoDGX0Wl6VLuHJ5ThfmNuZsBFDLbItZal3KXw6PkrWS7C94ZW3nvjQWW4XyIGjCqV0EPaZOrKdZ6/OodXJbKWWjQAyeZl/ewoAIFj+7bw7h8+irMBzsHilfaLfWwpm3ZvyoYHvHv8jxBVxCYVc/TypWz7+QvZw3nu/5Lt7uU3tNHPudk5D5VKyHANpLXGqcevMLOwCnSDMChTSwEK71lKM8aiiHc9uI/dRyepTlTJ1aBF99zhAXq5PbfhAQ9CM7a0VOx66ovF0MKS++TKmjuU5bo1CmVH+Yt7iVdQhCC0bBsWVmeXOfPCPMblTM0t0uhkxEFAMAD9bA/kzrGcZhwaG+Ktx3eya/84W/eNMLS9hiKkawVle27jbXTAK2HIULPp7zt9Pn2fDeQjlUjiuDz+50W6HuwkMRg87dU1OmnO7IXrPHvlOtYExDagHscDsatK6jyCMpZEHNsxwf4D49zx4DYmD43SWMhoNxzgy6b4TbLRAd8uhrASm+1jQ/YThd/8b9CNZgw4p1RCJchazF+/xnPTizSzgqH4pWN2ByHcHoitoR4HHN07yds/eJhoJKHdcCxOtV82nl2G+2bZ0IDbyORB4f/U5FbzFye2VLg2lXNtpqDd8STx7f1LLDwklYCxYYtrrHH11HUuX19AvScrPMGAXMFEhNw5VrOCtiv46Nvu4OiDO9EgQIOArOW7j+txnbeLDQ24EZyx7Akj2RGFhu3bA4aGDKurnsvXc/JCiQIhMLdHb0sVPEIcB4xWIF9d49zjc2jWYWZhhbm1FpUwxIjBbuLZKiLgvJI5z1wn5fjkMO+8dy9xNebgXVsY2ztElipFx60Pe/W64tvHhgZcux/MbVconcJTqQqj4yFjTSXLlKxQOh2l2fFYw8DMwPpWlO4yzsB42qsN2o2c1dl5njp9BWMMcRAwnCQD0RRPC48V2D5UYd/EMHce28qdj+6muqVK2nSsLecv/q7LcN9aN20cXAS8g3bTI8DRoxFqhKsXM85d6b4hNv9b+9V5hTgShkLH3JlrPD+9QKdwDL3smN1BCPcNY7UK953Yzom376Y6WaG5XNCYS4HB/iDvd7d0qqoAu3aHjI1Z5hcc12YKWuv980F7DxiBTqYUzrL3yA7a7Q7PXp2mHieE69NMN2vAu/1sz1pekHvH957Yw8PvPgAmwCYRWefGXfHN+foGyS0LuCrglCgWosQShMLwsGFuzjGzUOC8Ys3g9M8FKJxSeENcq7HtwF7i2jA+73B5ep61tEMShJtuPnnqPNPtlMk44nuO7+DEnRPsvncL4ViNxnxBkXq0cOWwV5+45avJsqy7aKBSFca3hFSrBkHJC1hd82SFYgakf959DcpyQ6mMjbF32yj5SgOHZWF5haIoSPNifUVY/75gT3cGmvfKSBJxYKLO0YNjPPJ9e3/5zh/c8ql6jebnf3VNXeZfnMlY6g+3POA3fvXeQXPVE8fCHUdjQHjhhZSpmZxgwPZdswayTk7aASMVDt13mB1zy1y+cI3ZpZUX9xrrV2b9K7CGuw9M8L6PHfmFYx+c+Ol6jSbAhSeKu3tbYenV9HwDEAFk/XJ94EDItq2W5RXPpamcwilxKAN151UR2hn4Sp0dh/axO2tz9twUs8sriEhfHR9U+O767NE45O1Ht/G29+59Zuedw//o+LuGfrnRGJi9HAdaz99NCqhb3y2zbqjUDUnNU6kIi4uepdWCTg6R3fxDLN3ylTR1iLGEw3USqbAtNwyPjtJeW2VmcRmnSmiDnjTbRYRO7mgWjuHI8u6jO7j7vi0cfevk/3bfD0787WaHMYChIbJbXlzpdet5wF8uT9eDnhjGD1uGZx3xtW7fvNn2ON/t1272oBsB1JOnnhxhePskkzvHaM0v4dTQTjvkWU7uXHef71vwgj3gvSd1npEk5Oj2EfbtHuZt37/nlx/5xNZPdDwHAWoJSze9mNKG6auA3+Cc0lxVkkQ4fEdMpwPPPtNmteUxfVnxG3Pjiu6ynBZgh0c4fO8wa3PLXLtyjfnVFewtesEGQISWczy6dzvf96NHfvmRT2z5xI3/PzGcvyWFlDZUX8flxoUrCuGOwxHOw9x8wfmrGWFgCCwDNWFG1YCFeGyE/dWEbSurTF2bZXltDdQTBQEbPYu78J6pVsq2Ssw7ju/gre/afWrvg8M/c+TRod/e0Ccq9URfB1wVikK7Z09NWEQgioUgENptZWnV0U79QNyIE0DVkxcgQUBSjYlqCc5EjDfXWFleYWmtAbC+CcSbGz/vFI6O84wlEd9/fBf33LeVww9N/NyDH5746RSObcBLKvWBvg448OKBcnmmKDA0bBgZjVlZcsTXhfllR1F0++eDsJ2uAHhPp+MRsYzt2kIg41SvL+KvTpOnKVme4b3HGOH1XtGdVxxKPQ44MlLl4N5R3vGD+3/+oY9M/NRaixpADKc2/pWVemFDAy6C5ya2mIVu0EGJK8KR4zFbFx2nz6Q0OzcmWdysZ7+1unNkPC73OKA6Oc6BoTprC0tcn7pOs9nEiH3dLfZCuxON7tk/yff+8KH/su8tY5/adTycAahXu+PapcGxsevBQwqT4vFws08S696JVmo14cih7pDsxcs5U7M5cWQIbfcxg9I/FxHCJGZoywTV4SEa80vMzs3TaDYwAsZ862E1ke700pl2SiTC9921h0e+Z/fMobeO/tn69uofbD9ky+GuAbahAQ9CyYwluhWhUu0OqxnT7Z9bI3ivxLHgClhYLugUSmgH42AA9R4QgiikMlQhqsTYOGa0sUajscpaq0XhC4xYjAheIXee1TxnRy3h/Sd2cfT4JEcenvyFt/zo5KdyOBZSjmUPug0NeBiazBh/AbgO7NjI7/2tiKzfiMuUAmViS8D4loDGqsdchuWGw7tuvxMZhF1EFPVK1s4QGzCxZyviJli8vsDc9BztdhPnPYXrLvYYTkJ2jFS468gk3/3hA//oxA+N/+uixRWAsOxn3xY2dkeXSJwY+ZcobeDnuekN9Vfq9s8hiYXjd8UszjmuXM1ZWnWIdvcdHxSqHpd3/zyybZJkuM7K3CJL8/PMrzYYjgLuPTjJOz90gP0Pj+3ZdWd4FYBqD4su3XIb20QPpDBWGsDiRn7f18uY7tV6eMRwMIhIM8+Z8znLjeLF/vkgESPE1YSxbZMkw0McIOP+E1Ue+sAk+x6uSzlv/Pa1oQFfmS80bTojQuW1H33zvKJ/Pm5QDHmqrDYMaa7MLztQsHYwlqV63z0tIKolRPUqtViJtse0qXD5pN+297iZ6XWNpd7Y0IAvTGVgwPTBcs8b/fNsfX77zr0huwSWFhx5pmRO8U67h8j3vtw3TxVfOMCxksGXv1bwzDNtThxN/rC5WPmZ44+G5cy029CG9krFSt8u9i8ypUiVet1wz90JRw/G1GuWLFf6fDn262YEogCK3PPsqdax//afV37rd3+x8fvnynXbt52NvclmBenON3H9uN/Y+uGdRBVh2BgOVyK2jFuuThestrp3nmM7GGPnQnfjxyxVZtOC9lP+PTPXi6cvPht95uC98V87cE9QLh65DWxowONEEFDvKNKO9uWtrBvDat3+uaVWN4hAq2NYWvEsrzpsINgBWJYqAqEVVGFx1TG/4pieyT+yOFu8c+FK9HOTe8LP7C+DPtA2NOBJzWCMkKe6mHb8dVUmRQg38jk2iiq0W90tnXfsCgli4eqlnE7qCQKhKBQ/ICddikCyfj5cs+356hPNbWfOdX72rruqH8nT5KeOPBx+uccllm6SDe2DxxVDXDU2jOVx4GP0+WSKl/aHU7K2Z2LS8MA9Fe44GBNHhnaqDNrxasZArWLICuW559oP/uavLn/pN/9540vny/75QNrgs8kEa/FFxiJwFuhs5Pe/WXT9H0EgRKEQxXD0SMzSYsH8omNp1WMtBH3Z6Xj9jHT7582OZ7WppM+237ayVHzjyqn4V3YfCX/+0EPhY2tNajc2VSxtXhsa8Oaiw1g0T1VUGeEWz2R7s7wDT7d/PrHVUq93j/kdrnvmlx2t9SOX7ADMiDMCxnb76CtrjpVTLroylf+Zg1PR9y/OxD+3bX/4y/U7gzLgm9yGBnx5oegeUCaIMfj1lYmbjip01o9c2rYjYOc+4ezJlGszHmO7/fNBWpp6o3/eTj2PPdPeduFi9rMnTiQfaTcqP330reHne1xe6U3Y0IBXh7uXNgEH0ug0fbUofF9v6v/tKN3+uW/Drl0B27YHrDU9L5xJ6WRKHA3GSrUbzPrNuE7mefrZ9oPnzqefO/14/Njd76h9dNtR26zElDPiNpkNDfjwePeGuRhQz1KRZX+3yPgUlu/ZyOe5lXS9gx7FhthCGAnHjsQ01zzzS47FFUcYdo9cGgRmfQZgs+NpND1pqg+urrhze05Gv7DjUPwLRx4KHms1qVXL/vmmsKEBr9TW3+XdfZZay0Z+zXveajZxwG9wTsFBYGDHzoC0A9VqQRIJax2l0+kebD8I/XMRiAOBAFabnieea3PxUvYTR6eK96/Mxv9k24HgV6rHy/75ZrChb8ciV4pccUX338ZQMwEFDM6nvVdIO91to7bvDDhxImH7pKVWMQNzcOLLRQEMVbvDak891979e7+9+k++8futPzz1lfydva6t9No29ArebrpX/Helbq16/t9Ww00ZK/8I+nPSyxtV5N04b98esH1HyOxMwclzKdYK4YBt6SzSbb7nmef5U+1j09P5584/HX3+zrdXP24jlgbpXsQg2dCA+1fmmyCUjgk4o8pFBizcwIuLVOLEEASwdZtFJMIXMD3vWGo4kkheXJ++mYnc2NoZmi1Pq5OztubeOT9bXNm2I6BSHaBPswGywQF/5W+48GRAEISSqvJZ4H7onm01SLxTUtfdSWbfgYgigzDMiQLIHHRSj9cB6p9H3fntK03P5WdbHF6KuPPO+MXFPKX+sbF98FRf8ZV1PEakklTNU8CPKzy3kc/XTwRwrrvRhKqyZ3/IXXcm7Ji0VGIzUMNpcGMhCwxXLTaAdlvLgPehW3FNaQFzqliFyVvwfH0hLxRrYev2gHvvjtk+GdDOlKzoNnPLHJRuhZsecFWciBRxYoy18nOq+oc3+zn7wY37EXFiqNUNO3eFnDgUcXBPiDHQ7CjO97bG0uC7JUcXicFEiVl1TfcLDvYIm39c/LXcOHJJndIpYKhuGB2L6aSK98ryiqdw3emhN+5Ql0ob7VadTVao6hxQARLAsckWorwZIlA4pXDdyfkHD0WkqTJ9veDKdY+WV/LSTXJL7+vGialGifkVVf46m2Qp6c2gHsJQ2Lkz5L67K2ydDFAgzcpxptLG2thhste4ElkrHXJ50ju/wwaSbORzbyY3brLFsXTHj33A6LBlZcUxNVfgnBIGMpAz40q31sYeXRR9+46kCM0oFnAmKwr9osKD0m2y33aU7tnnFDA0bBnfIoyuWPJCyZ3SSbtf1pRDT6U3bmMXmwy9dou/asVmbf+1xen8T3uv/0pEbvs5zc4prqWEIRw/HlM4uHIp59L1nKAMd+lNuOVzqxS8sbSTmmlbI39dlX9zq2voV0J3b/kwEPbsCbj3eMz2iQAUOmX/vPQG3Kq76C9Srwo4sTRV+ZJ6/aD0wUko/UAB1qf7VmqGpGJIYsPwiGVmvmB+yaHa3RtukBaylG6eWx5wAAQfBLKaVE2YpTrtCj0rwuGe1NKnbpyUWhs2jG+z64s5uls5r7W6/fRB2Lu9dHNt+Mkm39HjjBCMGIYm8I0F94vLs/kVsfJLQG0j6xkE3intNaVeM5w4nuCccPp0yvRCjn2Nm5qlUs/WN61feXxSlXZ9LHgc+HFVLvWqnr4nYAMhDOHggZB7jydsmwzIXHf8vA9Piir1gd400VlfS+1QY8XENTPrMv3NrOPHvepPiMgDvaqrX6l2p70C1EcM9SFDtWaoJsLismN1zZMV3RVeZbO9dEPPAn6DKg7VNKrKuPPyL32qGfC3gf09Lq1vFev98/qQYWwiYmjGMT1drG+S6HHrE2nKoJf6ZQsCr8qCDWSrDcwfKvxPwFqvi+p3rlA6re6RyHfcEXH8aPfIJe+0vMNeAvon4NAd9Vk0liUjct47/QlVzva6qM3AmO4NzkpVOHo44u4TCVvGA5odJXOU/fPbWM+b6N8kBbChTMcVezJta70o/Ketlft6XFdfU+1ezUVgdMKiAtH6Xu2dTFlpuG7/PCg3mrjd9FvAUU9qLXO1EVsPQv8vmquaqfJ3gQLYCVR7W2H/Un1p/Hxk1DI8YllZdlyfFpaWHYV/6W572T+/PfRTE/1F61ek5sjWgNFtwR94p/8j8CHgi72ubbMoCsU5pVY3HD0ec/RwRBgIXssm++2k767gL6PWCtbKNWAO2KLK/wEsivAjPa5t0zCm+zU0ajl6KMIDl6/mTM8XxFH3sIbyaj64+jngeK+oR4FMwYWxfF49RZ76urHygV7Xtxmodnd6tQbGtwYY0/3fKpGQFbC06sjL8fOB1dcBfzlVnQ4jU7dWHlflZ9TrhFd2CNSBiV7X189k/UDBG+PnW7YETExaVpc9cgUaax5Pd557GfLB0pd98FfjCm3GVbM2sTOcsaH8tDr9oMI/7XVdm01RKN5BtW6480TCoQMRSWwo/GvvylPaXDbNFXydikWDUFaAr4axCYzhN9stH1grf1Nk072enrIGbAhj45YkETqpcvlKzlLDYa0QlT/NTW/T/QpVwXtV9ai1YuOqeSEI5f9OO7q1KHQLcMAID/a6zs3gxrBaEMD4pMUDWijDQ4ZWy7O05hEot43axDZdwF/OOW2HsTA0HurCVP631bGK5U+o039Gd2vmEbpbNZdexY0DBbN0/aTU3SE7DMzPFqQXcnyheC3755vVpuqDfyvqwTtS73WxOmIYHrWPq/IJ73i/Kr/T6/o2G18oLldGRi33nYg5fCCiGttySeomtamv4C+jgBorubFcEeFyMmSsd/qv05b/uhgJRPgb3KY7uL4euv4PY7vbRtlASCqGyWXD1HRBs+MREaLb5tiKzW1QAg6Adg/2LADixMR55v9bZvjtIJSxItcRhR8xwu5e17kZqIMCxQYwvsVSrwsi0Gkryw1Po+UxQnkqS58bqIC/nFdteQ/GSBhXJZYOf9NlZIp+av0hI9xGxye9UaqQtro323bviQhC4erljAtXMgS5MRmp1KcGNuA3qJKrZ3piR+g6Lf9vl+fcf1fnAzHyz0XY2+v6NgsF8EqewuQWy9BQhXbb88KZjKzc0rlvDXzA1xVBLJhUToURpyr1sNpecz+btf0YhjuMyI/1usDNQNc76EFgiIYgToSjRyLc+sIWKPdy7je3S8BR192h1AZCbdgWWcv/fzaQNAjlgTzTHaoUCHcK7Ot1rf3OO8XTHR/fvjMgS5VOu0x2P9r0w2SvV3dYTTPnNY0rJq6N2CkRPinCRwz8S6DZ6xo3C1XIOgoKlURePBO91D9umyv4t6KQqWdeFeKqGfZO/3276TvWyv9ZTup4fcpg96fbOuCs7y0BINCuj9jT1br9tWbD1bLUF3i+31h5tNdFlkpv1O0e8Bd5p52oaokrcjVt+79vjFHvuZBnKiiFCA/QXZpaKm0at10f/NtRpxRZd5OJ4ckgGBq3v6+qnzCGHwE+C7SADmWLtLRJlAF/NYpTx4I1cmV4MmhFifm/vNOPeNWfodyctLRJlE30V6Gg6lEMPoilLU0+bwPjoooczNr6D7zXAvhuEb6n17WW+lbU6wLKgH8H1JGrU4KIIE7MUtZ2/9AYaYH+SecZM8K9va6x1HeWgXl63Norm+ivgyqFKougrSBiSxjLlw38FHCF7r7trscllvqDAs8Az9Lj+zXlFfwN8o6l2ohlaELS1fniL6Udn+L5kLHyqdf+26VBV6hKFNt2bSxa7WUdZcDfIFUKG0JSNUsN4T9XahYRVtpr3ivaEOSjIuUJqber0TCwp15Y0PYv5cXRd93XszrKgL8ZHpxDvUK9ZgIRebq15v/nKDRNr3RcoR9ACAXuprzzflsZikN98vKCfOH8DJ/mvp7VUQZ8g3hPIeiaEaQ6Yseytv93rcz/W2NlAvhl4HCvayzdOkYoRpLQjRD2to6ePvtgUjE01HPBBuZqUjOzqnzaF/rVXhdWuvn8+sZ11ShojlTDdCjpbcDLK/hNoL67bRTgg0AWRyaD3886fkun6b/LO62IlY9L+bMfaPUkXKvEQbu7Tr53yjfZTaSqHlgd3RLQXHGfyVP992Es40Wmw95zAGFUKG/EDSAdqkSNoVrULnoc8LKJfgu47hz3PIpFx7aHnSCS/1W9fkjgf+91baWNpaqIwFAtXhqfqLTGRuOe1lMG/NZyIqypciqp2Wv1Eftl4C94x4dV+cNeF1d687rXazFj4/Hi1p31lclttZ7WUzbRbzXF4yFIRMLYXAD3QlQR5xy+SL0zVr633Gxi83JKJ4TTE1trp7cdqK911orX/ks3URnwHlGvzjltA8QVGQX5jdSy4HJ2elVF2SHCWI/LLL1+TYHPD41GZ0a3J3l7Ne9pMWUTvQ8UOSv1Meu37omeiCryIwLvV89/6HVdpTfEABWvuuq1Owmql8oreH9QY8FYGsAzY1sC8kz/1eqyewKvToz8PRG297rI0muLrfGRNekfffZyUfvydZz3PPKxyZ7VUwa8T6iCX1+LFtesIO6rxshXK3UTZaluz3N/QJAdIryvt5WWXo3znmoUmvGhePn6UssV877nJ7KWAe9D3qm6Ag0s1MdtsDrnfj7PWbOBPOid7qG7kcAElH30flJ4zSphcHX/rpHLIpL2vH1OGfC+poD3NJ1qK05MElftTHO5+KT3zInwF4G/3OsaSy9Jvb9QS+x/PXR0/KQxtH2PJ7lAGfDNoHs0MnSMYQrlYphIxTt+Jev43Fr5q71uBpZABFKv1isLlVrwlLHScUXvT2UsA75JKHhVTQGMFZNU5bEkkZlOW7cWhbcg9xrhrl7XebsqnLKrXumMDcXXZ6eaKyL0/hY6ZcA3JVdoozJuiStmavZy/pfArCj8hDr9W4AHtgJJj8u8rXSc69y7c+KZw4fHn2uuZr0u50VlwDcpr+AchVdtDI3bSL1+dnm2OC1GVhH+qcB39brG24jrOPf4xHjlv93xlsmrrZXeTm55uTLgm583ltwjF4yRi9URG+Wp//m05X8dw1Yj8td7XeDAE2w9CBrVWng2GQqW+6FpfkMZ8EHgUfU4EYirJnKF/lex0gkjOZC1dRL4IWPp3WyLAVZ43wmNuXzvvsmTQyPx9NJU2+dp72+u3VAGfMCo05Z6JQgkTmqmA/4vuxxV1Q8Blu74eXnffYN4ZSWw5neOHZv4vfpoNDt3tYn00Y+3nIs+oLwjM0Zmtu+POiOT9p8I/KB3+heARq9rGxRelchKOBSHmXp9XpUVawRjeMVXL5VX8MGlgAsSg4h7IUoMSc2MN1bc38o7XkR41Fj5SK+L3MyahZvaP1b7wsN373iyUg8Xisz1T9t8XRnwAeed4h2EEdRG7Eqz4f5ZGJvcBjydpzqiShvhEaFczPJ6Kbo4Uo0/t+vQ8B8VqUvzrPdzz79Z2US/TWh3D3fnHXl12ES1EfusKn9WDB83wmeARWCJ7jh66TUU3mfba5XV8ZFkNm0Xl5zXvN/CDWXAb0vqyb1jUYSZ6pBJwtj8ilf9qCo/TjfopW+vWMvd14/uHvvtY/dOnlGnaB/MO/9WyoDfnpTuQYmFCaQphseNyOfCWB73yl/zTp/pdYH9yisIBGNJNDs0HH05iux555Rv99VLZR/8dqd01IMINgwljRL5xbyjYZbqhxW1RuRR6PHxHH1CgNx5xcrFtx3b/vjegyMng8g0ayM9Pwb8VZUBLwGgigNmx7eHNFfdry1cL/6LNaaqqv+G7tlqAVDtbZW95RSnMDVSif7j/Y/u+C/bDtZn2o3+mZb6rZQBL71Sd2eZlSiWxvBEMLy6UPydtOWdWN5mRP5hr8vrpbU8P7t/tP4Hb3t419eTmr2SdZzi6euObhnw0isooB41ggtjaSD8YZQYF0ay2Gn5Ma8sC/yQCA/1utZbyaPUwqA1NpR8rT4UfU5EVtRpdx/0Ph53KANe+pYU8E4LFMJYwjgxlzst/3eskbYYFr3TDt239lsY8KWpXmEtL1Ye3LvlmTvv3PJ0XLEzGEG1P++cv1wZ8NJrUiX3yjJAXJFJ9fp7nYLfXh/3/UXguxncG3EKtAORz524c/JX73/fzmebiynqX9oks5/1ce+h1KeWVbkiwmwQSKjK3/BO/1Ovi7oZRKCZF21V/zsfesfB/7Tv2OiT6VrR26NKXqfyCl56vW68wXMMi8MTwbki8/+i2XDX8aRi5M+JMNHTCjeAAKtZsTCZRF+69/CW391zYOSzUdXMFJlD+7jP/c3KgJfeEFXAs1QftaQt+Xyz4b4YV40vCqq+0AcR6tIdXtt0POC9XxgKw6/dsWv0N44cm/iSV72StbxWhi3rt9Y2hTLgpTfFd2drZdYYGR4PhteW3M+1M98xVu4CfgUYodsV3CzdQQVaHj53bOfIY3v2DD/XbubPB1GEbJZX8DKbsORSn1IMa6p6KYzNYqVuLonwk175oHaD3vdEhE7hGoX3nz22Y/Ty2FjyuaLQp3pd15tRXsFLG8fjFDAWbChTwNkgEFGveZGrMYH8qT5ccAV0b6jNt7PlXfXkiyf2jf92EJpnjZgnndNWr2t7M8qAlzacKg7PGoCxjAeJ+WrkuJylfpv3DAE7Rdjd4zJf5FXJCr+6a6jy2fsPT/767v0jT165uPxcljkqyeaOSNlEL91ULmexNmybW/aGV2won1b4ARH+n17X9U1aXvW/v/stuz9z79t3/G6rkT3nugtwNr3N/fFU2hwMiCHFc3Z41Hpj+K3l+WIWWBYjf0uE+3pRlldY6KSd8Tj6vR9979Ff3XNk5HOddrHQi1puljLgpZvPd3eUUcWHFYPASTGcrNSsFpluyXJ/nyB1ET5xs0sRwKnSLty5ehRkD++ZfPr4HRP/9tA9419BWGwspTe7hFuqDHjpllpfoFGICJVhO9RpuF/Lcv6VDWSPd7oV2AJMAns2+rk9UHjvA5HLu0dqvwWcO3Fs8omHv3/3V5autfMicwPRLH+5sg9e6hl12vCOVRuYMK6IiMj/osqfAP7xzXg+AxTOXx1Owt94+4M7v7F9vPqZtUb6xXYjz1EduHBDeQUv9Z4CbYGrQG4MQyh/VBT6V4yVnxUhfrNPkHnPWu6+sm+4uvDuB3d/ad8dY7+xtpzN5M7Pvfny+1sZ8FI/8Aod6A6xxVXzQi2WM61Vv73I/CiGY0bku1/vN828Zy1zbjwJv/rOOyZ/oyj0iW27hp7fd+/Y1ec/N0PRB+d332xlwEt9xas2okQY3RaatJX+Q+9k1QbyflfoToVCYCfd6a+vynnFoY16GLR2j9YeP7Bz+FfvvH/rs88/OfdkYyXVzmqO6mAMg72WMuClvqMKrlCvjkZt2MZRYp5ZnMn/tMKsCH8f+Pi3+/uFatN5/f3De0cef9f7D/zu9qNDT539yrzvdJzK7ZDqlykDXupnKpYMwzURrlVqJvGF/lKn478gSCDCP2D9al54z+VW59yR4dq5d96547nj9275D3PXmheAuWQo3FRruDdSGfBSf/MoXh1AGBkt8F8Q4Q+CQCa90z3q2SnC8Fg1OnL//on/GEX28xOTlUvH3rn1TOd3pmiv5RSdTbD1yk1SBry0aajXllcwIkEYS5h1+Mfea46RveO15JF3ffDg55dm2y+cP7VEaymjyD1ibq8m+TcrA17ajApVrq3/eQdQeK//Lm3mWZYO3mSVN0M2w86QpVLpjSlnspVKA6wMeKk0wMqAl0oDrAx4qTTAyoCXSgOsDHipNMDKgJdKA6wMeKk0wMqAl0oDrAx4qTTAyoCXSgPs/wdpsi+gP5AydgAAAABJRU5ErkJggg=="

/***/ }),
/* 39 */,
/* 40 */,
/* 41 */
/*!************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/@babel/runtime/regenerator/index.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(/*! @babel/runtime/helpers/regeneratorRuntime */ 42)();
module.exports = runtime;

/***/ }),
/* 42 */
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/regeneratorRuntime.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) {
              if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            }
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) {
      keys.push(key);
    }
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) {
        "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      }
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 43 */
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */
/*!*****************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/utils/data.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getData = getData;
exports.getServerToken = getServerToken;
exports.getToken = getToken;
exports.removeData = removeData;
exports.removeServerToken = removeServerToken;
exports.removeToken = removeToken;
exports.setData = setData;
exports.setServerToken = setServerToken;
exports.setToken = setToken;
var tokenKey = "TOKEN_KEY";
var dataKey = "DATA_KEY";
var serverKey = "SERVER_KEY";
function setServerToken(data) {
  uni.setStorageSync(serverKey, data);
}
function getServerToken() {
  return uni.getStorageSync(serverKey);
}
function removeServerToken() {
  return uni.removeStorageSync(serverKey);
}
function setToken(data) {
  uni.setStorageSync(tokenKey, data);
}
function getToken() {
  return uni.getStorageSync(tokenKey);
}
function removeToken() {
  return uni.removeStorageSync(tokenKey);
}
function setData(data) {
  uni.setStorageSync(dataKey, data);
}
function getData() {
  return uni.getStorageSync(dataKey);
}
function removeData() {
  return uni.getStorageSync(dataKey);
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */
/*!********************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/static/css/md.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  tagStyle: {
    p: 'font-size: 26rpx;padding-top: 8px;padding-bottom: 8px;margin: 0;line-height: 26px;color: white',
    h1: 'margin-bottom: 15px;font-weight: bold;font-size: 26rpx;color: white',
    h2: 'margin-bottom: 15px;font-weight: bold;font-size: 26rpx;color: white',
    h3: 'margin-bottom: 15px;font-weight: bold;font-size: 26rpx;color: white',
    h4: 'margin-bottom: 15px;font-weight: bold;font-size: 26rpx;color: white',
    h5: 'margin-bottom: 15px;font-weight: bold;font-size: 26rpx;color: white',
    h6: 'margin-bottom: 15px;font-weight: bold;font-size: 26rpx;color: white',
    ol: 'margin-bottom: 8px;padding-left: 25px;color: white;',
    ul: 'margin-bottom: 8px;padding-left: 25px;color: white',
    li: 'margin-bottom: 5px;line-height: 26px;color: white'
  }
};
exports.default = _default;

/***/ }),
/* 60 */
/*!***************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/api/chat.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bing = bing;
exports.chat = chat;
exports.code = code;
exports.face = face;
exports.generations = generations;
exports.intensifier = intensifier;
exports.translation = translation;
var _request = _interopRequireDefault(__webpack_require__(/*! ./../utils/request */ 61));
function chat(data) {
  return (0, _request.default)({
    url: 'v1/chat/completions',
    method: 'POST',
    data: data
  });
}
function intensifier(data) {
  return (0, _request.default)({
    url: 'v1/chat/intensifier',
    method: 'POST',
    data: data
  });
}
function code(data) {
  return (0, _request.default)({
    url: 'v1/chat/code',
    method: 'POST',
    data: data
  });
}
function translation(data) {
  return (0, _request.default)({
    url: 'v1/chat/translation',
    method: 'POST',
    data: data
  });
}
function generations(data) {
  return (0, _request.default)({
    url: 'v1/images/generations',
    method: 'POST',
    data: data
  });
}
function bing(data) {
  return (0, _request.default)({
    url: 'v1/chat/bing',
    method: 'POST',
    data: data
  });
}
function face(data) {
  return (0, _request.default)({
    url: 'v1/images/face',
    method: 'POST',
    data: data
  });
}

/***/ }),
/* 61 */
/*!********************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/utils/request.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _env = _interopRequireDefault(__webpack_require__(/*! ../utils/env */ 62));
var _data = __webpack_require__(/*! @/utils/data */ 49);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function service() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  options.url = "".concat(_env.default.baseUrl).concat(options.url);
  options.timeout = 100000;
  if ((0, _data.getToken)()) {
    options.header = {
      'content-type': 'application/json',
      'token': "".concat((0, _data.getToken)())
    };
  }
  return new Promise(function (resolve, reject) {
    // 发送 HTTP 请求
    uni.request(_objectSpread(_objectSpread({}, options), {}, {
      success: function success(res) {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else {
            if (res.data.code === 401) {
              (0, _data.removeToken)();
              (0, _data.removeServerToken)();
              uni.reLaunch({
                url: '/pages/member/member'
              });
            } else {
              reject(res.data.msg);
            }
          }
        } else {
          reject('与服务器建立连接失败');
        }
      },
      fail: function fail() {
        reject('请检查您的网络环境是否正常');
      }
    }));
  });
}
var _default = service;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),
/* 62 */
/*!****************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/utils/env.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  // 微信APPID
  appid: 'wx702314decfab3839',
  // 服务器IP
  baseUrl: 'http://127.0.01:8624/',
  // 广告ID
  advertisement: ''
};
exports.default = _default;

/***/ }),
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */
/*!*******************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/static/images/img/bot-3.png ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */
/*!***************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/api/auth.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exchangeCode = exchangeCode;
exports.reward = reward;
exports.userInfo = userInfo;
exports.weChatLogin = weChatLogin;
exports.weChatLogout = weChatLogout;
var _request = _interopRequireDefault(__webpack_require__(/*! ./../utils/request */ 61));
function userInfo() {
  return (0, _request.default)({
    url: 'user/get/info',
    method: 'GET'
  });
}
function reward(data) {
  return (0, _request.default)({
    url: 'user/get/reward/' + data,
    method: 'GET'
  });
}
function weChatLogin(data) {
  return (0, _request.default)({
    url: 'auth/wx/login',
    method: 'POST',
    data: data
  });
}
function weChatLogout() {
  return (0, _request.default)({
    url: 'auth/wx/logout',
    method: 'POST'
  });
}
function exchangeCode(data) {
  return (0, _request.default)({
    url: 'user/get/exchange/' + data,
    method: 'GET'
  });
}

/***/ }),
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */
/*!*************************************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/node_modules/lottie-miniprogram/miniprogram_dist/index.js ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(wx) {var _typeof2 = __webpack_require__(/*! @babel/runtime/helpers/typeof */ 13);
!function (t, e) {
  for (var r in e) {
    t[r] = e[r];
  }
}(exports, function (t) {
  var e = {};
  function r(i) {
    if (e[i]) return e[i].exports;
    var s = e[i] = {
      i: i,
      l: !1,
      exports: {}
    };
    return t[i].call(s.exports, s, s.exports, r), s.l = !0, s.exports;
  }
  return r.m = t, r.c = e, r.d = function (t, e, i) {
    r.o(t, e) || Object.defineProperty(t, e, {
      enumerable: !0,
      get: i
    });
  }, r.r = function (t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(t, "__esModule", {
      value: !0
    });
  }, r.t = function (t, e) {
    if (1 & e && (t = r(t)), 8 & e) return t;
    if (4 & e && "object" == _typeof2(t) && t && t.__esModule) return t;
    var i = Object.create(null);
    if (r.r(i), Object.defineProperty(i, "default", {
      enumerable: !0,
      value: t
    }), 2 & e && "string" != typeof t) for (var s in t) {
      r.d(i, s, function (e) {
        return t[e];
      }.bind(null, s));
    }
    return i;
  }, r.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    return r.d(e, "a", e), e;
  }, r.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  }, r.p = "", r(r.s = 1);
}([function (t, e, r) {
  "use strict";

  function i(t, e) {
    for (var r = 0; r < e.length; r++) {
      var i = e[r];
      i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
    }
  }
  function s(t, e, r) {
    return e in t ? Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : t[e] = r, t;
  }
  r.d(e, "c", function () {
    return _;
  }), r.d(e, "b", function () {
    return x;
  }), r.d(e, "a", function () {
    return P;
  });
  var a = new WeakMap(),
    n = new WeakMap(),
    o = new WeakMap(),
    h = new WeakMap(),
    l = new WeakMap();
  function p(t) {
    if ("function" == typeof this["on".concat(t)]) {
      for (var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++) {
        r[i - 1] = arguments[i];
      }
      this["on".concat(t)].apply(this, r);
    }
  }
  function f(t) {
    this.readyState = t, p.call(this, "readystatechange");
  }
  var m = function () {
    function t() {
      !function (t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
      }(this, t), s(this, "onabort", null), s(this, "onerror", null), s(this, "onload", null), s(this, "onloadstart", null), s(this, "onprogress", null), s(this, "ontimeout", null), s(this, "onloadend", null), s(this, "onreadystatechange", null), s(this, "readyState", 0), s(this, "response", null), s(this, "responseText", null), s(this, "responseType", ""), s(this, "responseXML", null), s(this, "status", 0), s(this, "statusText", ""), s(this, "upload", {}), s(this, "withCredentials", !1), o.set(this, {
        "content-type": "application/x-www-form-urlencoded"
      }), h.set(this, {});
    }
    var e, r, m;
    return e = t, (r = [{
      key: "abort",
      value: function value() {
        var t = l.get(this);
        t && t.abort();
      }
    }, {
      key: "getAllResponseHeaders",
      value: function value() {
        var t = h.get(this);
        return Object.keys(t).map(function (e) {
          return "".concat(e, ": ").concat(t[e]);
        }).join("\n");
      }
    }, {
      key: "getResponseHeader",
      value: function value(t) {
        return h.get(this)[t];
      }
    }, {
      key: "open",
      value: function value(e, r) {
        n.set(this, e), a.set(this, r), f.call(this, t.OPENED);
      }
    }, {
      key: "overrideMimeType",
      value: function value() {}
    }, {
      key: "send",
      value: function value() {
        var e = this,
          r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
        if (this.readyState !== t.OPENED) throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
        wx.request({
          data: r,
          url: a.get(this),
          method: n.get(this),
          header: o.get(this),
          success: function success(r) {
            var i = r.data,
              s = r.statusCode,
              a = r.header;
            if ("string" != typeof i && !(i instanceof ArrayBuffer)) try {
              i = JSON.stringify(i);
            } catch (t) {}
            if (e.status = s, h.set(e, a), p.call(e, "loadstart"), f.call(e, t.HEADERS_RECEIVED), f.call(e, t.LOADING), e.response = i, i instanceof ArrayBuffer) {
              e.responseText = "";
              for (var n = new Uint8Array(i), o = n.byteLength, l = 0; l < o; l++) {
                e.responseText += String.fromCharCode(n[l]);
              }
            } else e.responseText = i;
            f.call(e, t.DONE), p.call(e, "load"), p.call(e, "loadend");
          },
          fail: function fail(t) {
            var r = t.errMsg;
            -1 !== r.indexOf("abort") ? p.call(e, "abort") : p.call(e, "error", r), p.call(e, "loadend");
          }
        });
      }
    }, {
      key: "setRequestHeader",
      value: function value(t, e) {
        var r = o.get(this);
        r[t] = e, o.set(this, r);
      }
    }]) && i(e.prototype, r), m && i(e, m), t;
  }();
  function c() {}
  function d() {
    console.error("小程序由于不支持动态创建 canvas 的能力，故 lottie 中有关图片处理的操作无法支持，请保持图片的原始宽高与 JSON 描述的一致，避免需要对图片处理");
  }
  function u(t) {
    return "canvas" === t ? (console.warn("发现 Lottie 动态创建 canvas 组件，但小程序不支持动态创建组件，接下来可能会出现异常"), {
      getContext: function getContext() {
        return {
          fillRect: c,
          createImage: d,
          drawImage: d
        };
      }
    }) : "img" === t ? function (t) {
      if (void 0 === t.createImage) return {};
      var e = t.createImage();
      return e.addEventListener = e.addEventListener || function (t, r) {
        "load" === t ? e.onload = function () {
          setTimeout(r, 0);
        } : "error" === t && (e.onerror = r);
      }, e;
    }(this) : void 0;
  }
  function y(t, e) {
    return function (r) {
      return e.call(t, Array.from(r));
    };
  }
  function g(t, e) {
    return function () {
      return e.call(t);
    };
  }
  function v(t, e, r) {
    var i = t[e];
    t[e] = r(t, i);
  }
  s(m, "UNSEND", 0), s(m, "OPENED", 1), s(m, "HEADERS_RECEIVED", 2), s(m, "LOADING", 3), s(m, "DONE", 4);
  var b = wx.getSystemInfoSync(),
    P = {
      requestAnimationFrame: function requestAnimationFrame(t) {
        setTimeout(function () {
          "function" == typeof t && t(Date.now());
        }, 16);
      }
    };
  P.window = {
    devicePixelRatio: b.pixelRatio
  }, P.document = P.window.document = {
    body: {},
    createElement: u
  }, P.navigator = P.window.navigator = {
    userAgent: ""
  }, XMLHttpRequest = m;
  var _ = function _(t) {
      var e = P.window,
        r = P.document;
      P._requestAnimationFrame = e.requestAnimationFrame, P._cancelAnimationFrame = e.cancelAnimationFrame, e.requestAnimationFrame = function (e) {
        var r = !1;
        setTimeout(function () {
          r || (r = !0, "function" == typeof e && e(Date.now()));
        }, 100), t.requestAnimationFrame(function (t) {
          r || (r = !0, "function" == typeof e && e(t));
        });
      }, e.cancelAnimationFrame = t.cancelAnimationFrame.bind(t), P._body = r.body, P._createElement = r.createElement, r.body = {}, r.createElement = u.bind(t);
      var i = t.getContext("2d");
      i.canvas || (i.canvas = t), v(i, "setLineDash", y), v(i, "fill", g);
    },
    x = function x() {
      var t = P.window,
        e = P.document;
      t.requestAnimationFrame = P._requestAnimationFrame, t.cancelAnimationFrame = P._cancelAnimationFrame, e.body = P._body, e.createElement = P._createElement;
    };
}, function (module, __webpack_exports__, __webpack_require__) {
  "use strict";

  __webpack_require__.r(__webpack_exports__), function (module) {
    __webpack_require__.d(__webpack_exports__, "loadAnimation", function () {
      return loadAnimation;
    }), __webpack_require__.d(__webpack_exports__, "freeze", function () {
      return freeze;
    }), __webpack_require__.d(__webpack_exports__, "unfreeze", function () {
      return unfreeze;
    });
    var _adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
    function _typeof(t) {
      return (_typeof = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function (t) {
        return _typeof2(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof2(t);
      })(t);
    }
    __webpack_require__.d(__webpack_exports__, "setup", function () {
      return _adapter__WEBPACK_IMPORTED_MODULE_0__.c;
    });
    var window = _adapter__WEBPACK_IMPORTED_MODULE_0__.a.window,
      document = _adapter__WEBPACK_IMPORTED_MODULE_0__.a.document,
      navigator = _adapter__WEBPACK_IMPORTED_MODULE_0__.a.navigator;
    function loadAnimation(t) {
      if (["wrapper", "container"].forEach(function (e) {
        if (e in t) throw new Error("Not support '".concat(e, "' parameter in miniprogram version of lottie."));
      }), "string" == typeof t.path && !/^https?\:\/\//.test(t.path)) throw new Error("The 'path' is only support http protocol.");
      if (!t.rendererSettings || !t.rendererSettings.context) throw new Error("Parameter 'rendererSettings.context' should be a CanvasRenderingContext2D.");
      t.renderer = "canvas";
      var e = window.lottie.loadAnimation(t),
        r = e.destroy.bind(e);
      return e.destroy = function () {
        Object(_adapter__WEBPACK_IMPORTED_MODULE_0__.b)(), e.renderer && !e.renderer.destroyed && (e.renderer.renderConfig.clearCanvas = !1), r();
      }.bind(e), e;
    }
    void 0 !== navigator && function (t, e) {
      "object" === _typeof(module) && module.exports ? module.exports = e(t) : (t.lottie = e(t), t.bodymovin = t.lottie);
    }(window || {}, function (window) {
      var svgNS = "http://www.w3.org/2000/svg",
        locationHref = "",
        initialDefaultFrame = -999999,
        subframeEnabled = !0,
        expressionsPlugin,
        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
        cachedColors = {},
        bm_rounder = Math.round,
        bm_rnd,
        bm_pow = Math.pow,
        bm_sqrt = Math.sqrt,
        bm_abs = Math.abs,
        bm_floor = Math.floor,
        bm_max = Math.max,
        bm_min = Math.min,
        blitter = 10,
        BMMath = {};
      function ProjectInterface() {
        return {};
      }
      !function () {
        var t,
          e = ["abs", "acos", "acosh", "asin", "asinh", "atan", "atanh", "atan2", "ceil", "cbrt", "expm1", "clz32", "cos", "cosh", "exp", "floor", "fround", "hypot", "imul", "log", "log1p", "log2", "log10", "max", "min", "pow", "random", "round", "sign", "sin", "sinh", "sqrt", "tan", "tanh", "trunc", "E", "LN10", "LN2", "LOG10E", "LOG2E", "PI", "SQRT1_2", "SQRT2"],
          r = e.length;
        for (t = 0; t < r; t += 1) {
          BMMath[e[t]] = Math[e[t]];
        }
      }(), BMMath.random = Math.random, BMMath.abs = function (t) {
        if ("object" === _typeof(t) && t.length) {
          var e,
            r = createSizedArray(t.length),
            i = t.length;
          for (e = 0; e < i; e += 1) {
            r[e] = Math.abs(t[e]);
          }
          return r;
        }
        return Math.abs(t);
      };
      var defaultCurveSegments = 150,
        degToRads = Math.PI / 180,
        roundCorner = .5519;
      function roundValues(t) {
        bm_rnd = t ? Math.round : function (t) {
          return t;
        };
      }
      function styleDiv(t) {
        t.style.position = "absolute", t.style.top = 0, t.style.left = 0, t.style.display = "block", t.style.transformOrigin = t.style.webkitTransformOrigin = "0 0", t.style.backfaceVisibility = t.style.webkitBackfaceVisibility = "visible", t.style.transformStyle = t.style.webkitTransformStyle = t.style.mozTransformStyle = "preserve-3d";
      }
      function BMEnterFrameEvent(t, e, r, i) {
        this.type = t, this.currentTime = e, this.totalTime = r, this.direction = i < 0 ? -1 : 1;
      }
      function BMCompleteEvent(t, e) {
        this.type = t, this.direction = e < 0 ? -1 : 1;
      }
      function BMCompleteLoopEvent(t, e, r, i) {
        this.type = t, this.currentLoop = r, this.totalLoops = e, this.direction = i < 0 ? -1 : 1;
      }
      function BMSegmentStartEvent(t, e, r) {
        this.type = t, this.firstFrame = e, this.totalFrames = r;
      }
      function BMDestroyEvent(t, e) {
        this.type = t, this.target = e;
      }
      roundValues(!1);
      var createElementID = (_count = 0, function () {
          return "__lottie_element_" + ++_count;
        }),
        _count;
      function HSVtoRGB(t, e, r) {
        var i, s, a, n, o, h, l, p;
        switch (h = r * (1 - e), l = r * (1 - (o = 6 * t - (n = Math.floor(6 * t))) * e), p = r * (1 - (1 - o) * e), n % 6) {
          case 0:
            i = r, s = p, a = h;
            break;
          case 1:
            i = l, s = r, a = h;
            break;
          case 2:
            i = h, s = r, a = p;
            break;
          case 3:
            i = h, s = l, a = r;
            break;
          case 4:
            i = p, s = h, a = r;
            break;
          case 5:
            i = r, s = h, a = l;
        }
        return [i, s, a];
      }
      function RGBtoHSV(t, e, r) {
        var i,
          s = Math.max(t, e, r),
          a = Math.min(t, e, r),
          n = s - a,
          o = 0 === s ? 0 : n / s,
          h = s / 255;
        switch (s) {
          case a:
            i = 0;
            break;
          case t:
            i = e - r + n * (e < r ? 6 : 0), i /= 6 * n;
            break;
          case e:
            i = r - t + 2 * n, i /= 6 * n;
            break;
          case r:
            i = t - e + 4 * n, i /= 6 * n;
        }
        return [i, o, h];
      }
      function addSaturationToRGB(t, e) {
        var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
        return r[1] += e, r[1] > 1 ? r[1] = 1 : r[1] <= 0 && (r[1] = 0), HSVtoRGB(r[0], r[1], r[2]);
      }
      function addBrightnessToRGB(t, e) {
        var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
        return r[2] += e, r[2] > 1 ? r[2] = 1 : r[2] < 0 && (r[2] = 0), HSVtoRGB(r[0], r[1], r[2]);
      }
      function addHueToRGB(t, e) {
        var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
        return r[0] += e / 360, r[0] > 1 ? r[0] -= 1 : r[0] < 0 && (r[0] += 1), HSVtoRGB(r[0], r[1], r[2]);
      }
      var rgbToHex = function () {
        var t,
          e,
          r = [];
        for (t = 0; t < 256; t += 1) {
          e = t.toString(16), r[t] = 1 == e.length ? "0" + e : e;
        }
        return function (t, e, i) {
          return t < 0 && (t = 0), e < 0 && (e = 0), i < 0 && (i = 0), "#" + r[t] + r[e] + r[i];
        };
      }();
      function BaseEvent() {}
      BaseEvent.prototype = {
        triggerEvent: function triggerEvent(t, e) {
          if (this._cbs[t]) for (var r = this._cbs[t].length, i = 0; i < r; i++) {
            this._cbs[t][i](e);
          }
        },
        addEventListener: function addEventListener(t, e) {
          return this._cbs[t] || (this._cbs[t] = []), this._cbs[t].push(e), function () {
            this.removeEventListener(t, e);
          }.bind(this);
        },
        removeEventListener: function removeEventListener(t, e) {
          if (e) {
            if (this._cbs[t]) {
              for (var r = 0, i = this._cbs[t].length; r < i;) {
                this._cbs[t][r] === e && (this._cbs[t].splice(r, 1), r -= 1, i -= 1), r += 1;
              }
              this._cbs[t].length || (this._cbs[t] = null);
            }
          } else this._cbs[t] = null;
        }
      };
      var createTypedArray = "function" == typeof Uint8ClampedArray && "function" == typeof Float32Array ? function (t, e) {
        return "float32" === t ? new Float32Array(e) : "int16" === t ? new Int16Array(e) : "uint8c" === t ? new Uint8ClampedArray(e) : void 0;
      } : function (t, e) {
        var r,
          i = 0,
          s = [];
        switch (t) {
          case "int16":
          case "uint8c":
            r = 1;
            break;
          default:
            r = 1.1;
        }
        for (i = 0; i < e; i += 1) {
          s.push(r);
        }
        return s;
      };
      function createSizedArray(t) {
        return Array.apply(null, {
          length: t
        });
      }
      function createTag(t) {
        return document.createElement(t);
      }
      function DynamicPropertyContainer() {}
      DynamicPropertyContainer.prototype = {
        addDynamicProperty: function addDynamicProperty(t) {
          -1 === this.dynamicProperties.indexOf(t) && (this.dynamicProperties.push(t), this.container.addDynamicProperty(this), this._isAnimated = !0);
        },
        iterateDynamicProperties: function iterateDynamicProperties() {
          this._mdf = !1;
          var t,
            e = this.dynamicProperties.length;
          for (t = 0; t < e; t += 1) {
            this.dynamicProperties[t].getValue(), this.dynamicProperties[t]._mdf && (this._mdf = !0);
          }
        },
        initDynamicPropertyContainer: function initDynamicPropertyContainer(t) {
          this.container = t, this.dynamicProperties = [], this._mdf = !1, this._isAnimated = !1;
        }
      };
      var getBlendMode = (blendModeEnums = {
          0: "source-over",
          1: "multiply",
          2: "screen",
          3: "overlay",
          4: "darken",
          5: "lighten",
          6: "color-dodge",
          7: "color-burn",
          8: "hard-light",
          9: "soft-light",
          10: "difference",
          11: "exclusion",
          12: "hue",
          13: "saturation",
          14: "color",
          15: "luminosity"
        }, function (t) {
          return blendModeEnums[t] || "";
        }),
        blendModeEnums,
        Matrix = function () {
          var t = Math.cos,
            e = Math.sin,
            r = Math.tan,
            i = Math.round;
          function s() {
            return this.props[0] = 1, this.props[1] = 0, this.props[2] = 0, this.props[3] = 0, this.props[4] = 0, this.props[5] = 1, this.props[6] = 0, this.props[7] = 0, this.props[8] = 0, this.props[9] = 0, this.props[10] = 1, this.props[11] = 0, this.props[12] = 0, this.props[13] = 0, this.props[14] = 0, this.props[15] = 1, this;
          }
          function a(r) {
            if (0 === r) return this;
            var i = t(r),
              s = e(r);
            return this._t(i, -s, 0, 0, s, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
          }
          function n(r) {
            if (0 === r) return this;
            var i = t(r),
              s = e(r);
            return this._t(1, 0, 0, 0, 0, i, -s, 0, 0, s, i, 0, 0, 0, 0, 1);
          }
          function o(r) {
            if (0 === r) return this;
            var i = t(r),
              s = e(r);
            return this._t(i, 0, s, 0, 0, 1, 0, 0, -s, 0, i, 0, 0, 0, 0, 1);
          }
          function h(r) {
            if (0 === r) return this;
            var i = t(r),
              s = e(r);
            return this._t(i, -s, 0, 0, s, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
          }
          function l(t, e) {
            return this._t(1, e, t, 1, 0, 0);
          }
          function p(t, e) {
            return this.shear(r(t), r(e));
          }
          function f(i, s) {
            var a = t(s),
              n = e(s);
            return this._t(a, n, 0, 0, -n, a, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, r(i), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(a, -n, 0, 0, n, a, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
          }
          function m(t, e, r) {
            return r || 0 === r || (r = 1), 1 === t && 1 === e && 1 === r ? this : this._t(t, 0, 0, 0, 0, e, 0, 0, 0, 0, r, 0, 0, 0, 0, 1);
          }
          function c(t, e, r, i, s, a, n, o, h, l, p, f, m, c, d, u) {
            return this.props[0] = t, this.props[1] = e, this.props[2] = r, this.props[3] = i, this.props[4] = s, this.props[5] = a, this.props[6] = n, this.props[7] = o, this.props[8] = h, this.props[9] = l, this.props[10] = p, this.props[11] = f, this.props[12] = m, this.props[13] = c, this.props[14] = d, this.props[15] = u, this;
          }
          function d(t, e, r) {
            return r = r || 0, 0 !== t || 0 !== e || 0 !== r ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, r, 1) : this;
          }
          function u(t, e, r, i, s, a, n, o, h, l, p, f, m, c, d, u) {
            var y = this.props;
            if (1 === t && 0 === e && 0 === r && 0 === i && 0 === s && 1 === a && 0 === n && 0 === o && 0 === h && 0 === l && 1 === p && 0 === f) return y[12] = y[12] * t + y[15] * m, y[13] = y[13] * a + y[15] * c, y[14] = y[14] * p + y[15] * d, y[15] = y[15] * u, this._identityCalculated = !1, this;
            var g = y[0],
              v = y[1],
              b = y[2],
              P = y[3],
              _ = y[4],
              x = y[5],
              S = y[6],
              E = y[7],
              T = y[8],
              C = y[9],
              A = y[10],
              k = y[11],
              D = y[12],
              M = y[13],
              I = y[14],
              w = y[15];
            return y[0] = g * t + v * s + b * h + P * m, y[1] = g * e + v * a + b * l + P * c, y[2] = g * r + v * n + b * p + P * d, y[3] = g * i + v * o + b * f + P * u, y[4] = _ * t + x * s + S * h + E * m, y[5] = _ * e + x * a + S * l + E * c, y[6] = _ * r + x * n + S * p + E * d, y[7] = _ * i + x * o + S * f + E * u, y[8] = T * t + C * s + A * h + k * m, y[9] = T * e + C * a + A * l + k * c, y[10] = T * r + C * n + A * p + k * d, y[11] = T * i + C * o + A * f + k * u, y[12] = D * t + M * s + I * h + w * m, y[13] = D * e + M * a + I * l + w * c, y[14] = D * r + M * n + I * p + w * d, y[15] = D * i + M * o + I * f + w * u, this._identityCalculated = !1, this;
          }
          function y() {
            return this._identityCalculated || (this._identity = !(1 !== this.props[0] || 0 !== this.props[1] || 0 !== this.props[2] || 0 !== this.props[3] || 0 !== this.props[4] || 1 !== this.props[5] || 0 !== this.props[6] || 0 !== this.props[7] || 0 !== this.props[8] || 0 !== this.props[9] || 1 !== this.props[10] || 0 !== this.props[11] || 0 !== this.props[12] || 0 !== this.props[13] || 0 !== this.props[14] || 1 !== this.props[15]), this._identityCalculated = !0), this._identity;
          }
          function g(t) {
            for (var e = 0; e < 16;) {
              if (t.props[e] !== this.props[e]) return !1;
              e += 1;
            }
            return !0;
          }
          function v(t) {
            var e;
            for (e = 0; e < 16; e += 1) {
              t.props[e] = this.props[e];
            }
          }
          function b(t) {
            var e;
            for (e = 0; e < 16; e += 1) {
              this.props[e] = t[e];
            }
          }
          function P(t, e, r) {
            return {
              x: t * this.props[0] + e * this.props[4] + r * this.props[8] + this.props[12],
              y: t * this.props[1] + e * this.props[5] + r * this.props[9] + this.props[13],
              z: t * this.props[2] + e * this.props[6] + r * this.props[10] + this.props[14]
            };
          }
          function _(t, e, r) {
            return t * this.props[0] + e * this.props[4] + r * this.props[8] + this.props[12];
          }
          function x(t, e, r) {
            return t * this.props[1] + e * this.props[5] + r * this.props[9] + this.props[13];
          }
          function S(t, e, r) {
            return t * this.props[2] + e * this.props[6] + r * this.props[10] + this.props[14];
          }
          function E(t) {
            var e = this.props[0] * this.props[5] - this.props[1] * this.props[4],
              r = this.props[5] / e,
              i = -this.props[1] / e,
              s = -this.props[4] / e,
              a = this.props[0] / e,
              n = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / e,
              o = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / e;
            return [t[0] * r + t[1] * s + n, t[0] * i + t[1] * a + o, 0];
          }
          function T(t) {
            var e,
              r = t.length,
              i = [];
            for (e = 0; e < r; e += 1) {
              i[e] = E(t[e]);
            }
            return i;
          }
          function C(t, e, r) {
            var i = createTypedArray("float32", 6);
            if (this.isIdentity()) i[0] = t[0], i[1] = t[1], i[2] = e[0], i[3] = e[1], i[4] = r[0], i[5] = r[1];else {
              var s = this.props[0],
                a = this.props[1],
                n = this.props[4],
                o = this.props[5],
                h = this.props[12],
                l = this.props[13];
              i[0] = t[0] * s + t[1] * n + h, i[1] = t[0] * a + t[1] * o + l, i[2] = e[0] * s + e[1] * n + h, i[3] = e[0] * a + e[1] * o + l, i[4] = r[0] * s + r[1] * n + h, i[5] = r[0] * a + r[1] * o + l;
            }
            return i;
          }
          function A(t, e, r) {
            return this.isIdentity() ? [t, e, r] : [t * this.props[0] + e * this.props[4] + r * this.props[8] + this.props[12], t * this.props[1] + e * this.props[5] + r * this.props[9] + this.props[13], t * this.props[2] + e * this.props[6] + r * this.props[10] + this.props[14]];
          }
          function k(t, e) {
            if (this.isIdentity()) return t + "," + e;
            var r = this.props;
            return Math.round(100 * (t * r[0] + e * r[4] + r[12])) / 100 + "," + Math.round(100 * (t * r[1] + e * r[5] + r[13])) / 100;
          }
          function D() {
            for (var t = 0, e = this.props, r = "matrix3d("; t < 16;) {
              r += i(1e4 * e[t]) / 1e4, r += 15 === t ? ")" : ",", t += 1;
            }
            return r;
          }
          function M(t) {
            return t < 1e-6 && t > 0 || t > -1e-6 && t < 0 ? i(1e4 * t) / 1e4 : t;
          }
          function I() {
            var t = this.props;
            return "matrix(" + M(t[0]) + "," + M(t[1]) + "," + M(t[4]) + "," + M(t[5]) + "," + M(t[12]) + "," + M(t[13]) + ")";
          }
          return function () {
            this.reset = s, this.rotate = a, this.rotateX = n, this.rotateY = o, this.rotateZ = h, this.skew = p, this.skewFromAxis = f, this.shear = l, this.scale = m, this.setTransform = c, this.translate = d, this.transform = u, this.applyToPoint = P, this.applyToX = _, this.applyToY = x, this.applyToZ = S, this.applyToPointArray = A, this.applyToTriplePoints = C, this.applyToPointStringified = k, this.toCSS = D, this.to2dCSS = I, this.clone = v, this.cloneFromProps = b, this.equals = g, this.inversePoints = T, this.inversePoint = E, this._t = this.transform, this.isIdentity = y, this._identity = !0, this._identityCalculated = !1, this.props = createTypedArray("float32", 16), this.reset();
          };
        }();
      /*!
         Transformation Matrix v2.0
         (c) Epistemex 2014-2015
         www.epistemex.com
         By Ken Fyrstenberg
         Contributions by leeoniya.
         License: MIT, header required.
         */
      !function (t, e) {
        var r = this,
          i = e.pow(256, 6),
          s = e.pow(2, 52),
          a = 2 * s;
        function n(t) {
          var e,
            r = t.length,
            i = this,
            s = 0,
            a = i.i = i.j = 0,
            n = i.S = [];
          for (r || (t = [r++]); s < 256;) {
            n[s] = s++;
          }
          for (s = 0; s < 256; s++) {
            n[s] = n[a = 255 & a + t[s % r] + (e = n[s])], n[a] = e;
          }
          i.g = function (t) {
            for (var e, r = 0, s = i.i, a = i.j, n = i.S; t--;) {
              e = n[s = 255 & s + 1], r = 256 * r + n[255 & (n[s] = n[a = 255 & a + e]) + (n[a] = e)];
            }
            return i.i = s, i.j = a, r;
          };
        }
        function o(t, e) {
          return e.i = t.i, e.j = t.j, e.S = t.S.slice(), e;
        }
        function h(t, e) {
          for (var r, i = t + "", s = 0; s < i.length;) {
            e[255 & s] = 255 & (r ^= 19 * e[255 & s]) + i.charCodeAt(s++);
          }
          return l(e);
        }
        function l(t) {
          return String.fromCharCode.apply(0, t);
        }
        e.seedrandom = function (p, f, m) {
          var c = [],
            d = h(function t(e, r) {
              var i,
                s = [],
                a = _typeof(e);
              if (r && "object" == a) for (i in e) {
                try {
                  s.push(t(e[i], r - 1));
                } catch (t) {}
              }
              return s.length ? s : "string" == a ? e : e + "\0";
            }((f = !0 === f ? {
              entropy: !0
            } : f || {}).entropy ? [p, l(t)] : null === p ? function () {
              try {
                void 0;
                var e = new Uint8Array(256);
                return (r.crypto || r.msCrypto).getRandomValues(e), l(e);
              } catch (e) {
                var i = r.navigator,
                  s = i && i.plugins;
                return [+new Date(), r, s, r.screen, l(t)];
              }
            }() : p, 3), c),
            u = new n(c),
            y = function y() {
              for (var t = u.g(6), e = i, r = 0; t < s;) {
                t = 256 * (t + r), e *= 256, r = u.g(1);
              }
              for (; t >= a;) {
                t /= 2, e /= 2, r >>>= 1;
              }
              return (t + r) / e;
            };
          return y.int32 = function () {
            return 0 | u.g(4);
          }, y.quick = function () {
            return u.g(4) / 4294967296;
          }, y.double = y, h(l(u.S), t), (f.pass || m || function (t, r, i, s) {
            return s && (s.S && o(s, u), t.state = function () {
              return o(u, {});
            }), i ? (e.random = t, r) : t;
          })(y, d, "global" in f ? f.global : this == e, f.state);
        }, h(e.random(), t);
      }([], BMMath);
      var BezierFactory = function () {
        var t = {
            getBezierEasing: function getBezierEasing(t, r, i, s, a) {
              var n = a || ("bez_" + t + "_" + r + "_" + i + "_" + s).replace(/\./g, "p");
              if (e[n]) return e[n];
              var o = new h([t, r, i, s]);
              return e[n] = o, o;
            }
          },
          e = {};
        var r = "function" == typeof Float32Array;
        function i(t, e) {
          return 1 - 3 * e + 3 * t;
        }
        function s(t, e) {
          return 3 * e - 6 * t;
        }
        function a(t) {
          return 3 * t;
        }
        function n(t, e, r) {
          return ((i(e, r) * t + s(e, r)) * t + a(e)) * t;
        }
        function o(t, e, r) {
          return 3 * i(e, r) * t * t + 2 * s(e, r) * t + a(e);
        }
        function h(t) {
          this._p = t, this._mSampleValues = r ? new Float32Array(11) : new Array(11), this._precomputed = !1, this.get = this.get.bind(this);
        }
        return h.prototype = {
          get: function get(t) {
            var e = this._p[0],
              r = this._p[1],
              i = this._p[2],
              s = this._p[3];
            return this._precomputed || this._precompute(), e === r && i === s ? t : 0 === t ? 0 : 1 === t ? 1 : n(this._getTForX(t), r, s);
          },
          _precompute: function _precompute() {
            var t = this._p[0],
              e = this._p[1],
              r = this._p[2],
              i = this._p[3];
            this._precomputed = !0, t === e && r === i || this._calcSampleValues();
          },
          _calcSampleValues: function _calcSampleValues() {
            for (var t = this._p[0], e = this._p[2], r = 0; r < 11; ++r) {
              this._mSampleValues[r] = n(.1 * r, t, e);
            }
          },
          _getTForX: function _getTForX(t) {
            for (var e = this._p[0], r = this._p[2], i = this._mSampleValues, s = 0, a = 1; 10 !== a && i[a] <= t; ++a) {
              s += .1;
            }
            var h = s + .1 * ((t - i[--a]) / (i[a + 1] - i[a])),
              l = o(h, e, r);
            return l >= .001 ? function (t, e, r, i) {
              for (var s = 0; s < 4; ++s) {
                var a = o(e, r, i);
                if (0 === a) return e;
                e -= (n(e, r, i) - t) / a;
              }
              return e;
            }(t, h, e, r) : 0 === l ? h : function (t, e, r, i, s) {
              var a,
                o,
                h = 0;
              do {
                (a = n(o = e + (r - e) / 2, i, s) - t) > 0 ? r = o : e = o;
              } while (Math.abs(a) > 1e-7 && ++h < 10);
              return o;
            }(t, s, s + .1, e, r);
          }
        }, t;
      }();
      function extendPrototype(t, e) {
        var r,
          i,
          s = t.length;
        for (r = 0; r < s; r += 1) {
          for (var a in i = t[r].prototype) {
            i.hasOwnProperty(a) && (e.prototype[a] = i[a]);
          }
        }
      }
      function getDescriptor(t, e) {
        return Object.getOwnPropertyDescriptor(t, e);
      }
      function createProxyFunction(t) {
        function e() {}
        return e.prototype = t, e;
      }
      function bezFunction() {
        Math;
        function t(t, e, r, i, s, a) {
          var n = t * i + e * s + r * a - s * i - a * t - r * e;
          return n > -.001 && n < .001;
        }
        var e = function e(t, _e, r, i) {
          var s,
            a,
            n,
            o,
            h,
            l,
            p = defaultCurveSegments,
            f = 0,
            m = [],
            c = [],
            d = bezier_length_pool.newElement();
          for (n = r.length, s = 0; s < p; s += 1) {
            for (h = s / (p - 1), l = 0, a = 0; a < n; a += 1) {
              o = bm_pow(1 - h, 3) * t[a] + 3 * bm_pow(1 - h, 2) * h * r[a] + 3 * (1 - h) * bm_pow(h, 2) * i[a] + bm_pow(h, 3) * _e[a], m[a] = o, null !== c[a] && (l += bm_pow(m[a] - c[a], 2)), c[a] = m[a];
            }
            l && (f += l = bm_sqrt(l)), d.percents[s] = h, d.lengths[s] = f;
          }
          return d.addedLength = f, d;
        };
        function r(t) {
          this.segmentLength = 0, this.points = new Array(t);
        }
        function i(t, e) {
          this.partialLength = t, this.point = e;
        }
        var s,
          a = (s = {}, function (e, a, n, o) {
            var h = (e[0] + "_" + e[1] + "_" + a[0] + "_" + a[1] + "_" + n[0] + "_" + n[1] + "_" + o[0] + "_" + o[1]).replace(/\./g, "p");
            if (!s[h]) {
              var l,
                p,
                f,
                m,
                c,
                d,
                u,
                y = defaultCurveSegments,
                g = 0,
                v = null;
              2 === e.length && (e[0] != a[0] || e[1] != a[1]) && t(e[0], e[1], a[0], a[1], e[0] + n[0], e[1] + n[1]) && t(e[0], e[1], a[0], a[1], a[0] + o[0], a[1] + o[1]) && (y = 2);
              var b = new r(y);
              for (f = n.length, l = 0; l < y; l += 1) {
                for (u = createSizedArray(f), c = l / (y - 1), d = 0, p = 0; p < f; p += 1) {
                  m = bm_pow(1 - c, 3) * e[p] + 3 * bm_pow(1 - c, 2) * c * (e[p] + n[p]) + 3 * (1 - c) * bm_pow(c, 2) * (a[p] + o[p]) + bm_pow(c, 3) * a[p], u[p] = m, null !== v && (d += bm_pow(u[p] - v[p], 2));
                }
                g += d = bm_sqrt(d), b.points[l] = new i(d, u), v = u;
              }
              b.segmentLength = g, s[h] = b;
            }
            return s[h];
          });
        function n(t, e) {
          var r = e.percents,
            i = e.lengths,
            s = r.length,
            a = bm_floor((s - 1) * t),
            n = t * e.addedLength,
            o = 0;
          if (a === s - 1 || 0 === a || n === i[a]) return r[a];
          for (var h = i[a] > n ? -1 : 1, l = !0; l;) {
            if (i[a] <= n && i[a + 1] > n ? (o = (n - i[a]) / (i[a + 1] - i[a]), l = !1) : a += h, a < 0 || a >= s - 1) {
              if (a === s - 1) return r[a];
              l = !1;
            }
          }
          return r[a] + (r[a + 1] - r[a]) * o;
        }
        var o = createTypedArray("float32", 8);
        return {
          getSegmentsLength: function getSegmentsLength(t) {
            var r,
              i = segments_length_pool.newElement(),
              s = t.c,
              a = t.v,
              n = t.o,
              o = t.i,
              h = t._length,
              l = i.lengths,
              p = 0;
            for (r = 0; r < h - 1; r += 1) {
              l[r] = e(a[r], a[r + 1], n[r], o[r + 1]), p += l[r].addedLength;
            }
            return s && h && (l[r] = e(a[r], a[0], n[r], o[0]), p += l[r].addedLength), i.totalLength = p, i;
          },
          getNewSegment: function getNewSegment(t, e, r, i, s, a, h) {
            var l,
              p = n(s = s < 0 ? 0 : s > 1 ? 1 : s, h),
              f = n(a = a > 1 ? 1 : a, h),
              m = t.length,
              c = 1 - p,
              d = 1 - f,
              u = c * c * c,
              y = p * c * c * 3,
              g = p * p * c * 3,
              v = p * p * p,
              b = c * c * d,
              P = p * c * d + c * p * d + c * c * f,
              _ = p * p * d + c * p * f + p * c * f,
              x = p * p * f,
              S = c * d * d,
              E = p * d * d + c * f * d + c * d * f,
              T = p * f * d + c * f * f + p * d * f,
              C = p * f * f,
              A = d * d * d,
              k = f * d * d + d * f * d + d * d * f,
              D = f * f * d + d * f * f + f * d * f,
              M = f * f * f;
            for (l = 0; l < m; l += 1) {
              o[4 * l] = Math.round(1e3 * (u * t[l] + y * r[l] + g * i[l] + v * e[l])) / 1e3, o[4 * l + 1] = Math.round(1e3 * (b * t[l] + P * r[l] + _ * i[l] + x * e[l])) / 1e3, o[4 * l + 2] = Math.round(1e3 * (S * t[l] + E * r[l] + T * i[l] + C * e[l])) / 1e3, o[4 * l + 3] = Math.round(1e3 * (A * t[l] + k * r[l] + D * i[l] + M * e[l])) / 1e3;
            }
            return o;
          },
          getPointInSegment: function getPointInSegment(t, e, r, i, s, a) {
            var o = n(s, a),
              h = 1 - o;
            return [Math.round(1e3 * (h * h * h * t[0] + (o * h * h + h * o * h + h * h * o) * r[0] + (o * o * h + h * o * o + o * h * o) * i[0] + o * o * o * e[0])) / 1e3, Math.round(1e3 * (h * h * h * t[1] + (o * h * h + h * o * h + h * h * o) * r[1] + (o * o * h + h * o * o + o * h * o) * i[1] + o * o * o * e[1])) / 1e3];
          },
          buildBezierData: a,
          pointOnLine2D: t,
          pointOnLine3D: function pointOnLine3D(e, r, i, s, a, n, o, h, l) {
            if (0 === i && 0 === n && 0 === l) return t(e, r, s, a, o, h);
            var p,
              f = Math.sqrt(Math.pow(s - e, 2) + Math.pow(a - r, 2) + Math.pow(n - i, 2)),
              m = Math.sqrt(Math.pow(o - e, 2) + Math.pow(h - r, 2) + Math.pow(l - i, 2)),
              c = Math.sqrt(Math.pow(o - s, 2) + Math.pow(h - a, 2) + Math.pow(l - n, 2));
            return (p = f > m ? f > c ? f - m - c : c - m - f : c > m ? c - m - f : m - f - c) > -1e-4 && p < 1e-4;
          }
        };
      }
      !function () {
        for (var t = 0, e = ["ms", "moz", "webkit", "o"], r = 0; r < e.length && !window.requestAnimationFrame; ++r) {
          window.requestAnimationFrame = window[e[r] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[e[r] + "CancelAnimationFrame"] || window[e[r] + "CancelRequestAnimationFrame"];
        }
        window.requestAnimationFrame || (window.requestAnimationFrame = function (e, r) {
          var i = new Date().getTime(),
            s = Math.max(0, 16 - (i - t)),
            a = setTimeout(function () {
              e(i + s);
            }, s);
          return t = i + s, a;
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function (t) {
          clearTimeout(t);
        });
      }();
      var bez = bezFunction();
      function dataFunctionManager() {
        function t(t, e) {
          for (var r = 0, i = e.length; r < i;) {
            if (e[r].id === t) return e[r].layers.__used ? JSON.parse(JSON.stringify(e[r].layers)) : (e[r].layers.__used = !0, e[r].layers);
            r += 1;
          }
        }
        function e(t) {
          var i, s, a;
          for (i = t.length - 1; i >= 0; i -= 1) {
            if ("sh" == t[i].ty) {
              if (t[i].ks.k.i) r(t[i].ks.k);else for (a = t[i].ks.k.length, s = 0; s < a; s += 1) {
                t[i].ks.k[s].s && r(t[i].ks.k[s].s[0]), t[i].ks.k[s].e && r(t[i].ks.k[s].e[0]);
              }
              !0;
            } else "gr" == t[i].ty && e(t[i].it);
          }
        }
        function r(t) {
          var e,
            r = t.i.length;
          for (e = 0; e < r; e += 1) {
            t.i[e][0] += t.v[e][0], t.i[e][1] += t.v[e][1], t.o[e][0] += t.v[e][0], t.o[e][1] += t.v[e][1];
          }
        }
        function i(t, e) {
          var r = e ? e.split(".") : [100, 100, 100];
          return t[0] > r[0] || !(r[0] > t[0]) && (t[1] > r[1] || !(r[1] > t[1]) && (t[2] > r[2] || !(r[2] > t[2]) && void 0));
        }
        var s,
          a = function () {
            var t = [4, 4, 14];
            function e(t) {
              var e,
                r,
                i,
                s = t.length;
              for (e = 0; e < s; e += 1) {
                5 === t[e].ty && (r = t[e], i = void 0, i = r.t.d, r.t.d = {
                  k: [{
                    s: i,
                    t: 0
                  }]
                });
              }
            }
            return function (r) {
              if (i(t, r.v) && (e(r.layers), r.assets)) {
                var s,
                  a = r.assets.length;
                for (s = 0; s < a; s += 1) {
                  r.assets[s].layers && e(r.assets[s].layers);
                }
              }
            };
          }(),
          n = (s = [4, 7, 99], function (t) {
            if (t.chars && !i(s, t.v)) {
              var e,
                a,
                n,
                o,
                h,
                l = t.chars.length;
              for (e = 0; e < l; e += 1) {
                if (t.chars[e].data && t.chars[e].data.shapes) for (n = (h = t.chars[e].data.shapes[0].it).length, a = 0; a < n; a += 1) {
                  (o = h[a].ks.k).__converted || (r(h[a].ks.k), o.__converted = !0);
                }
              }
            }
          }),
          o = function () {
            var t = [4, 1, 9];
            function e(t) {
              var r,
                i,
                s,
                a = t.length;
              for (r = 0; r < a; r += 1) {
                if ("gr" === t[r].ty) e(t[r].it);else if ("fl" === t[r].ty || "st" === t[r].ty) if (t[r].c.k && t[r].c.k[0].i) for (s = t[r].c.k.length, i = 0; i < s; i += 1) {
                  t[r].c.k[i].s && (t[r].c.k[i].s[0] /= 255, t[r].c.k[i].s[1] /= 255, t[r].c.k[i].s[2] /= 255, t[r].c.k[i].s[3] /= 255), t[r].c.k[i].e && (t[r].c.k[i].e[0] /= 255, t[r].c.k[i].e[1] /= 255, t[r].c.k[i].e[2] /= 255, t[r].c.k[i].e[3] /= 255);
                } else t[r].c.k[0] /= 255, t[r].c.k[1] /= 255, t[r].c.k[2] /= 255, t[r].c.k[3] /= 255;
              }
            }
            function r(t) {
              var r,
                i = t.length;
              for (r = 0; r < i; r += 1) {
                4 === t[r].ty && e(t[r].shapes);
              }
            }
            return function (e) {
              if (i(t, e.v) && (r(e.layers), e.assets)) {
                var s,
                  a = e.assets.length;
                for (s = 0; s < a; s += 1) {
                  e.assets[s].layers && r(e.assets[s].layers);
                }
              }
            };
          }(),
          h = function () {
            var t = [4, 4, 18];
            function e(t) {
              var r, i, s;
              for (r = t.length - 1; r >= 0; r -= 1) {
                if ("sh" == t[r].ty) {
                  if (t[r].ks.k.i) t[r].ks.k.c = t[r].closed;else for (s = t[r].ks.k.length, i = 0; i < s; i += 1) {
                    t[r].ks.k[i].s && (t[r].ks.k[i].s[0].c = t[r].closed), t[r].ks.k[i].e && (t[r].ks.k[i].e[0].c = t[r].closed);
                  }
                  !0;
                } else "gr" == t[r].ty && e(t[r].it);
              }
            }
            function r(t) {
              var r,
                i,
                s,
                a,
                n,
                o,
                h = t.length;
              for (i = 0; i < h; i += 1) {
                if ((r = t[i]).hasMask) {
                  var l = r.masksProperties;
                  for (a = l.length, s = 0; s < a; s += 1) {
                    if (l[s].pt.k.i) l[s].pt.k.c = l[s].cl;else for (o = l[s].pt.k.length, n = 0; n < o; n += 1) {
                      l[s].pt.k[n].s && (l[s].pt.k[n].s[0].c = l[s].cl), l[s].pt.k[n].e && (l[s].pt.k[n].e[0].c = l[s].cl);
                    }
                  }
                }
                4 === r.ty && e(r.shapes);
              }
            }
            return function (e) {
              if (i(t, e.v) && (r(e.layers), e.assets)) {
                var s,
                  a = e.assets.length;
                for (s = 0; s < a; s += 1) {
                  e.assets[s].layers && r(e.assets[s].layers);
                }
              }
            };
          }();
        function l(t, e) {
          0 !== t.t.a.length || "m" in t.t.p || (t.singleShape = !0);
        }
        var p = {
          completeData: function completeData(i, s) {
            i.__complete || (o(i), a(i), n(i), h(i), function i(s, a, n) {
              var o,
                h,
                p,
                f,
                m,
                c,
                d = s.length;
              for (h = 0; h < d; h += 1) {
                if ("ks" in (o = s[h]) && !o.completed) {
                  if (o.completed = !0, o.tt && (s[h - 1].td = o.tt), [], -1, o.hasMask) {
                    var u = o.masksProperties;
                    for (f = u.length, p = 0; p < f; p += 1) {
                      if (u[p].pt.k.i) r(u[p].pt.k);else for (c = u[p].pt.k.length, m = 0; m < c; m += 1) {
                        u[p].pt.k[m].s && r(u[p].pt.k[m].s[0]), u[p].pt.k[m].e && r(u[p].pt.k[m].e[0]);
                      }
                    }
                  }
                  0 === o.ty ? (o.layers = t(o.refId, a), i(o.layers, a, n)) : 4 === o.ty ? e(o.shapes) : 5 == o.ty && l(o, n);
                }
              }
            }(i.layers, i.assets, s), i.__complete = !0);
          }
        };
        return p;
      }
      var dataManager = dataFunctionManager(),
        FontManager = function () {
          var t = {
              w: 0,
              size: 0,
              shapes: []
            },
            e = [];
          function r(t, e) {
            var r = createTag("span");
            r.style.fontFamily = e;
            var i = createTag("span");
            i.innerHTML = "giItT1WQy@!-/#", r.style.position = "absolute", r.style.left = "-10000px", r.style.top = "-10000px", r.style.fontSize = "300px", r.style.fontVariant = "normal", r.style.fontStyle = "normal", r.style.fontWeight = "normal", r.style.letterSpacing = "0", r.appendChild(i), document.body.appendChild(r);
            var s = i.offsetWidth;
            return i.style.fontFamily = t + ", " + e, {
              node: i,
              w: s,
              parent: r
            };
          }
          function i(t, e) {
            var r = createNS("text");
            return r.style.fontSize = "100px", r.setAttribute("font-family", e.fFamily), r.setAttribute("font-style", e.fStyle), r.setAttribute("font-weight", e.fWeight), r.textContent = "1", e.fClass ? (r.style.fontFamily = "inherit", r.setAttribute("class", e.fClass)) : r.style.fontFamily = e.fFamily, t.appendChild(r), createTag("canvas").getContext("2d").font = e.fWeight + " " + e.fStyle + " 100px " + e.fFamily, r;
          }
          e = e.concat([2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403]);
          var s = function s() {
            this.fonts = [], this.chars = null, this.typekitLoaded = 0, this.isLoaded = !1, this.initTime = Date.now();
          };
          return s.getCombinedCharacterCodes = function () {
            return e;
          }, s.prototype.addChars = function (t) {
            if (t) {
              this.chars || (this.chars = []);
              var e,
                r,
                i,
                s = t.length,
                a = this.chars.length;
              for (e = 0; e < s; e += 1) {
                for (r = 0, i = !1; r < a;) {
                  this.chars[r].style === t[e].style && this.chars[r].fFamily === t[e].fFamily && this.chars[r].ch === t[e].ch && (i = !0), r += 1;
                }
                i || (this.chars.push(t[e]), a += 1);
              }
            }
          }, s.prototype.addFonts = function (t, e) {
            if (t) {
              if (this.chars) return this.isLoaded = !0, void (this.fonts = t.list);
              var s,
                a = t.list,
                n = a.length,
                o = n;
              for (s = 0; s < n; s += 1) {
                var h,
                  l,
                  p = !0;
                if (a[s].loaded = !1, a[s].monoCase = r(a[s].fFamily, "monospace"), a[s].sansCase = r(a[s].fFamily, "sans-serif"), a[s].fPath) {
                  if ("p" === a[s].fOrigin || 3 === a[s].origin) {
                    if ((h = document.querySelectorAll('style[f-forigin="p"][f-family="' + a[s].fFamily + '"], style[f-origin="3"][f-family="' + a[s].fFamily + '"]')).length > 0 && (p = !1), p) {
                      var f = createTag("style");
                      f.setAttribute("f-forigin", a[s].fOrigin), f.setAttribute("f-origin", a[s].origin), f.setAttribute("f-family", a[s].fFamily), f.type = "text/css", f.innerHTML = "@font-face {font-family: " + a[s].fFamily + "; font-style: normal; src: url('" + a[s].fPath + "');}", e.appendChild(f);
                    }
                  } else if ("g" === a[s].fOrigin || 1 === a[s].origin) {
                    for (h = document.querySelectorAll('link[f-forigin="g"], link[f-origin="1"]'), l = 0; l < h.length; l++) {
                      -1 !== h[l].href.indexOf(a[s].fPath) && (p = !1);
                    }
                    if (p) {
                      var m = createTag("link");
                      m.setAttribute("f-forigin", a[s].fOrigin), m.setAttribute("f-origin", a[s].origin), m.type = "text/css", m.rel = "stylesheet", m.href = a[s].fPath, document.body.appendChild(m);
                    }
                  } else if ("t" === a[s].fOrigin || 2 === a[s].origin) {
                    for (h = document.querySelectorAll('script[f-forigin="t"], script[f-origin="2"]'), l = 0; l < h.length; l++) {
                      a[s].fPath === h[l].src && (p = !1);
                    }
                    if (p) {
                      var c = createTag("link");
                      c.setAttribute("f-forigin", a[s].fOrigin), c.setAttribute("f-origin", a[s].origin), c.setAttribute("rel", "stylesheet"), c.setAttribute("href", a[s].fPath), e.appendChild(c);
                    }
                  }
                } else a[s].loaded = !0, o -= 1;
                a[s].helper = i(e, a[s]), a[s].cache = {}, this.fonts.push(a[s]);
              }
              0 === o ? this.isLoaded = !0 : setTimeout(this.checkLoadedFonts.bind(this), 100);
            } else this.isLoaded = !0;
          }, s.prototype.getCharData = function (e, r, i) {
            for (var s = 0, a = this.chars.length; s < a;) {
              if (this.chars[s].ch === e && this.chars[s].style === r && this.chars[s].fFamily === i) return this.chars[s];
              s += 1;
            }
            return ("string" == typeof e && 13 !== e.charCodeAt(0) || !e) && console && console.warn && console.warn("Missing character from exported characters list: ", e, r, i), t;
          }, s.prototype.getFontByName = function (t) {
            for (var e = 0, r = this.fonts.length; e < r;) {
              if (this.fonts[e].fName === t) return this.fonts[e];
              e += 1;
            }
            return this.fonts[0];
          }, s.prototype.measureText = function (t, e, r) {
            var i = this.getFontByName(e),
              s = t.charCodeAt(0);
            if (!i.cache[s + 1]) {
              var a = i.helper;
              if (" " === t) {
                a.textContent = "|" + t + "|";
                var n = a.getComputedTextLength();
                a.textContent = "||";
                var o = a.getComputedTextLength();
                i.cache[s + 1] = (n - o) / 100;
              } else a.textContent = t, i.cache[s + 1] = a.getComputedTextLength() / 100;
            }
            return i.cache[s + 1] * r;
          }, s.prototype.checkLoadedFonts = function () {
            var t,
              e,
              r,
              i = this.fonts.length,
              s = i;
            for (t = 0; t < i; t += 1) {
              this.fonts[t].loaded ? s -= 1 : "n" === this.fonts[t].fOrigin || 0 === this.fonts[t].origin ? this.fonts[t].loaded = !0 : (e = this.fonts[t].monoCase.node, r = this.fonts[t].monoCase.w, e.offsetWidth !== r ? (s -= 1, this.fonts[t].loaded = !0) : (e = this.fonts[t].sansCase.node, r = this.fonts[t].sansCase.w, e.offsetWidth !== r && (s -= 1, this.fonts[t].loaded = !0)), this.fonts[t].loaded && (this.fonts[t].sansCase.parent.parentNode.removeChild(this.fonts[t].sansCase.parent), this.fonts[t].monoCase.parent.parentNode.removeChild(this.fonts[t].monoCase.parent)));
            }
            0 !== s && Date.now() - this.initTime < 5e3 ? setTimeout(this.checkLoadedFonts.bind(this), 20) : setTimeout(function () {
              this.isLoaded = !0;
            }.bind(this), 0);
          }, s.prototype.loaded = function () {
            return this.isLoaded;
          }, s;
        }(),
        PropertyFactory = function () {
          var t = initialDefaultFrame,
            e = Math.abs;
          function r(t, e) {
            var r,
              s = this.offsetTime;
            "multidimensional" === this.propType && (r = createTypedArray("float32", this.pv.length));
            for (var a, n, o, h, l, p, f, m, c = e.lastIndex, d = c, u = this.keyframes.length - 1, y = !0; y;) {
              if (a = this.keyframes[d], n = this.keyframes[d + 1], d === u - 1 && t >= n.t - s) {
                a.h && (a = n), c = 0;
                break;
              }
              if (n.t - s > t) {
                c = d;
                break;
              }
              d < u - 1 ? d += 1 : (c = 0, y = !1);
            }
            var g,
              v = n.t - s,
              b = a.t - s;
            if (a.to) {
              a.bezierData || (a.bezierData = bez.buildBezierData(a.s, n.s || a.e, a.to, a.ti));
              var P = a.bezierData;
              if (t >= v || t < b) {
                var _ = t >= v ? P.points.length - 1 : 0;
                for (h = P.points[_].point.length, o = 0; o < h; o += 1) {
                  r[o] = P.points[_].point[o];
                }
              } else {
                a.__fnct ? m = a.__fnct : (m = BezierFactory.getBezierEasing(a.o.x, a.o.y, a.i.x, a.i.y, a.n).get, a.__fnct = m), l = m((t - b) / (v - b));
                var x,
                  S = P.segmentLength * l,
                  E = e.lastFrame < t && e._lastKeyframeIndex === d ? e._lastAddedLength : 0;
                for (f = e.lastFrame < t && e._lastKeyframeIndex === d ? e._lastPoint : 0, y = !0, p = P.points.length; y;) {
                  if (E += P.points[f].partialLength, 0 === S || 0 === l || f === P.points.length - 1) {
                    for (h = P.points[f].point.length, o = 0; o < h; o += 1) {
                      r[o] = P.points[f].point[o];
                    }
                    break;
                  }
                  if (S >= E && S < E + P.points[f + 1].partialLength) {
                    for (x = (S - E) / P.points[f + 1].partialLength, h = P.points[f].point.length, o = 0; o < h; o += 1) {
                      r[o] = P.points[f].point[o] + (P.points[f + 1].point[o] - P.points[f].point[o]) * x;
                    }
                    break;
                  }
                  f < p - 1 ? f += 1 : y = !1;
                }
                e._lastPoint = f, e._lastAddedLength = E - P.points[f].partialLength, e._lastKeyframeIndex = d;
              }
            } else {
              var T, C, A, k, D;
              if (u = a.s.length, g = n.s || a.e, this.sh && 1 !== a.h) {
                if (t >= v) r[0] = g[0], r[1] = g[1], r[2] = g[2];else if (t <= b) r[0] = a.s[0], r[1] = a.s[1], r[2] = a.s[2];else {
                  !function (t, e) {
                    var r = e[0],
                      i = e[1],
                      s = e[2],
                      a = e[3],
                      n = Math.atan2(2 * i * a - 2 * r * s, 1 - 2 * i * i - 2 * s * s),
                      o = Math.asin(2 * r * i + 2 * s * a),
                      h = Math.atan2(2 * r * a - 2 * i * s, 1 - 2 * r * r - 2 * s * s);
                    t[0] = n / degToRads, t[1] = o / degToRads, t[2] = h / degToRads;
                  }(r, function (t, e, r) {
                    var i,
                      s,
                      a,
                      n,
                      o,
                      h = [],
                      l = t[0],
                      p = t[1],
                      f = t[2],
                      m = t[3],
                      c = e[0],
                      d = e[1],
                      u = e[2],
                      y = e[3];
                    (s = l * c + p * d + f * u + m * y) < 0 && (s = -s, c = -c, d = -d, u = -u, y = -y);
                    1 - s > 1e-6 ? (i = Math.acos(s), a = Math.sin(i), n = Math.sin((1 - r) * i) / a, o = Math.sin(r * i) / a) : (n = 1 - r, o = r);
                    return h[0] = n * l + o * c, h[1] = n * p + o * d, h[2] = n * f + o * u, h[3] = n * m + o * y, h;
                  }(i(a.s), i(g), (t - b) / (v - b)));
                }
              } else for (d = 0; d < u; d += 1) {
                1 !== a.h && (t >= v ? l = 1 : t < b ? l = 0 : (a.o.x.constructor === Array ? (a.__fnct || (a.__fnct = []), a.__fnct[d] ? m = a.__fnct[d] : (T = void 0 === a.o.x[d] ? a.o.x[0] : a.o.x[d], C = void 0 === a.o.y[d] ? a.o.y[0] : a.o.y[d], A = void 0 === a.i.x[d] ? a.i.x[0] : a.i.x[d], k = void 0 === a.i.y[d] ? a.i.y[0] : a.i.y[d], m = BezierFactory.getBezierEasing(T, C, A, k).get, a.__fnct[d] = m)) : a.__fnct ? m = a.__fnct : (T = a.o.x, C = a.o.y, A = a.i.x, k = a.i.y, m = BezierFactory.getBezierEasing(T, C, A, k).get, a.__fnct = m), l = m((t - b) / (v - b)))), g = n.s || a.e, D = 1 === a.h ? a.s[d] : a.s[d] + (g[d] - a.s[d]) * l, 1 === u ? r = D : r[d] = D;
              }
            }
            return e.lastIndex = c, r;
          }
          function i(t) {
            var e = t[0] * degToRads,
              r = t[1] * degToRads,
              i = t[2] * degToRads,
              s = Math.cos(e / 2),
              a = Math.cos(r / 2),
              n = Math.cos(i / 2),
              o = Math.sin(e / 2),
              h = Math.sin(r / 2),
              l = Math.sin(i / 2);
            return [o * h * n + s * a * l, o * a * n + s * h * l, s * h * n - o * a * l, s * a * n - o * h * l];
          }
          function s() {
            var e = this.comp.renderedFrame - this.offsetTime,
              r = this.keyframes[0].t - this.offsetTime,
              i = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
            if (!(e === this._caching.lastFrame || this._caching.lastFrame !== t && (this._caching.lastFrame >= i && e >= i || this._caching.lastFrame < r && e < r))) {
              this._caching.lastFrame >= e && (this._caching._lastKeyframeIndex = -1, this._caching.lastIndex = 0);
              var s = this.interpolateValue(e, this._caching);
              this.pv = s;
            }
            return this._caching.lastFrame = e, this.pv;
          }
          function a(t) {
            var r;
            if ("unidimensional" === this.propType) r = t * this.mult, e(this.v - r) > 1e-5 && (this.v = r, this._mdf = !0);else for (var i = 0, s = this.v.length; i < s;) {
              r = t[i] * this.mult, e(this.v[i] - r) > 1e-5 && (this.v[i] = r, this._mdf = !0), i += 1;
            }
          }
          function n() {
            if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length) if (this.lock) this.setVValue(this.pv);else {
              this.lock = !0, this._mdf = this._isFirstFrame;
              var t,
                e = this.effectsSequence.length,
                r = this.kf ? this.pv : this.data.k;
              for (t = 0; t < e; t += 1) {
                r = this.effectsSequence[t](r);
              }
              this.setVValue(r), this._isFirstFrame = !1, this.lock = !1, this.frameId = this.elem.globalData.frameId;
            }
          }
          function o(t) {
            this.effectsSequence.push(t), this.container.addDynamicProperty(this);
          }
          function h(t, e, r, i) {
            this.propType = "unidimensional", this.mult = r || 1, this.data = e, this.v = r ? e.k * r : e.k, this.pv = e.k, this._mdf = !1, this.elem = t, this.container = i, this.comp = t.comp, this.k = !1, this.kf = !1, this.vel = 0, this.effectsSequence = [], this._isFirstFrame = !0, this.getValue = n, this.setVValue = a, this.addEffect = o;
          }
          function l(t, e, r, i) {
            this.propType = "multidimensional", this.mult = r || 1, this.data = e, this._mdf = !1, this.elem = t, this.container = i, this.comp = t.comp, this.k = !1, this.kf = !1, this.frameId = -1;
            var s,
              h = e.k.length;
            this.v = createTypedArray("float32", h), this.pv = createTypedArray("float32", h);
            createTypedArray("float32", h);
            for (this.vel = createTypedArray("float32", h), s = 0; s < h; s += 1) {
              this.v[s] = e.k[s] * this.mult, this.pv[s] = e.k[s];
            }
            this._isFirstFrame = !0, this.effectsSequence = [], this.getValue = n, this.setVValue = a, this.addEffect = o;
          }
          function p(e, i, h, l) {
            this.propType = "unidimensional", this.keyframes = i.k, this.offsetTime = e.data.st, this.frameId = -1, this._caching = {
              lastFrame: t,
              lastIndex: 0,
              value: 0,
              _lastKeyframeIndex: -1
            }, this.k = !0, this.kf = !0, this.data = i, this.mult = h || 1, this.elem = e, this.container = l, this.comp = e.comp, this.v = t, this.pv = t, this._isFirstFrame = !0, this.getValue = n, this.setVValue = a, this.interpolateValue = r, this.effectsSequence = [s.bind(this)], this.addEffect = o;
          }
          function f(e, i, h, l) {
            this.propType = "multidimensional";
            var p,
              f,
              m,
              c,
              d,
              u = i.k.length;
            for (p = 0; p < u - 1; p += 1) {
              i.k[p].to && i.k[p].s && i.k[p].e && (f = i.k[p].s, m = i.k[p].e, c = i.k[p].to, d = i.k[p].ti, (2 === f.length && (f[0] !== m[0] || f[1] !== m[1]) && bez.pointOnLine2D(f[0], f[1], m[0], m[1], f[0] + c[0], f[1] + c[1]) && bez.pointOnLine2D(f[0], f[1], m[0], m[1], m[0] + d[0], m[1] + d[1]) || 3 === f.length && (f[0] !== m[0] || f[1] !== m[1] || f[2] !== m[2]) && bez.pointOnLine3D(f[0], f[1], f[2], m[0], m[1], m[2], f[0] + c[0], f[1] + c[1], f[2] + c[2]) && bez.pointOnLine3D(f[0], f[1], f[2], m[0], m[1], m[2], m[0] + d[0], m[1] + d[1], m[2] + d[2])) && (i.k[p].to = null, i.k[p].ti = null), f[0] === m[0] && f[1] === m[1] && 0 === c[0] && 0 === c[1] && 0 === d[0] && 0 === d[1] && (2 === f.length || f[2] === m[2] && 0 === c[2] && 0 === d[2]) && (i.k[p].to = null, i.k[p].ti = null));
            }
            this.effectsSequence = [s.bind(this)], this.keyframes = i.k, this.offsetTime = e.data.st, this.k = !0, this.kf = !0, this._isFirstFrame = !0, this.mult = h || 1, this.elem = e, this.container = l, this.comp = e.comp, this.getValue = n, this.setVValue = a, this.interpolateValue = r, this.frameId = -1;
            var y = i.k[0].s.length;
            for (this.v = createTypedArray("float32", y), this.pv = createTypedArray("float32", y), p = 0; p < y; p += 1) {
              this.v[p] = t, this.pv[p] = t;
            }
            this._caching = {
              lastFrame: t,
              lastIndex: 0,
              value: createTypedArray("float32", y)
            }, this.addEffect = o;
          }
          return {
            getProp: function getProp(t, e, r, i, s) {
              var a;
              if (e.k.length) {
                if ("number" == typeof e.k[0]) a = new l(t, e, i, s);else switch (r) {
                  case 0:
                    a = new p(t, e, i, s);
                    break;
                  case 1:
                    a = new f(t, e, i, s);
                }
              } else a = new h(t, e, i, s);
              return a.effectsSequence.length && s.addDynamicProperty(a), a;
            }
          };
        }(),
        TransformPropertyFactory = function () {
          function t(t, e, r) {
            if (this.elem = t, this.frameId = -1, this.propType = "transform", this.data = e, this.v = new Matrix(), this.pre = new Matrix(), this.appliedTransformations = 0, this.initDynamicPropertyContainer(r || t), e.p && e.p.s ? (this.px = PropertyFactory.getProp(t, e.p.x, 0, 0, this), this.py = PropertyFactory.getProp(t, e.p.y, 0, 0, this), e.p.z && (this.pz = PropertyFactory.getProp(t, e.p.z, 0, 0, this))) : this.p = PropertyFactory.getProp(t, e.p || {
              k: [0, 0, 0]
            }, 1, 0, this), e.rx) {
              if (this.rx = PropertyFactory.getProp(t, e.rx, 0, degToRads, this), this.ry = PropertyFactory.getProp(t, e.ry, 0, degToRads, this), this.rz = PropertyFactory.getProp(t, e.rz, 0, degToRads, this), e.or.k[0].ti) {
                var i,
                  s = e.or.k.length;
                for (i = 0; i < s; i += 1) {
                  e.or.k[i].to = e.or.k[i].ti = null;
                }
              }
              this.or = PropertyFactory.getProp(t, e.or, 1, degToRads, this), this.or.sh = !0;
            } else this.r = PropertyFactory.getProp(t, e.r || {
              k: 0
            }, 0, degToRads, this);
            e.sk && (this.sk = PropertyFactory.getProp(t, e.sk, 0, degToRads, this), this.sa = PropertyFactory.getProp(t, e.sa, 0, degToRads, this)), this.a = PropertyFactory.getProp(t, e.a || {
              k: [0, 0, 0]
            }, 1, 0, this), this.s = PropertyFactory.getProp(t, e.s || {
              k: [100, 100, 100]
            }, 1, .01, this), e.o ? this.o = PropertyFactory.getProp(t, e.o, 0, .01, t) : this.o = {
              _mdf: !1,
              v: 1
            }, this._isDirty = !0, this.dynamicProperties.length || this.getValue(!0);
          }
          return t.prototype = {
            applyToMatrix: function applyToMatrix(t) {
              var e = this._mdf;
              this.iterateDynamicProperties(), this._mdf = this._mdf || e, this.a && t.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.s && t.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && t.skewFromAxis(-this.sk.v, this.sa.v), this.r ? t.rotate(-this.r.v) : t.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.data.p.s ? this.data.p.z ? t.translate(this.px.v, this.py.v, -this.pz.v) : t.translate(this.px.v, this.py.v, 0) : t.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
            },
            getValue: function getValue(t) {
              if (this.elem.globalData.frameId !== this.frameId) {
                if (this._isDirty && (this.precalculateMatrix(), this._isDirty = !1), this.iterateDynamicProperties(), this._mdf || t) {
                  if (this.v.cloneFromProps(this.pre.props), this.appliedTransformations < 1 && this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations < 2 && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && this.appliedTransformations < 3 && this.v.skewFromAxis(-this.sk.v, this.sa.v), this.r && this.appliedTransformations < 4 ? this.v.rotate(-this.r.v) : !this.r && this.appliedTransformations < 4 && this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.autoOriented) {
                    var e,
                      r,
                      i = this.elem.globalData.frameRate;
                    if (this.p && this.p.keyframes && this.p.getValueAtTime) this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t ? (e = this.p.getValueAtTime((this.p.keyframes[0].t + .01) / i, 0), r = this.p.getValueAtTime(this.p.keyframes[0].t / i, 0)) : this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t ? (e = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / i, 0), r = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - .01) / i, 0)) : (e = this.p.pv, r = this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - .01) / i, this.p.offsetTime));else if (this.px && this.px.keyframes && this.py.keyframes && this.px.getValueAtTime && this.py.getValueAtTime) {
                      e = [], r = [];
                      var s = this.px,
                        a = this.py;
                      s._caching.lastFrame + s.offsetTime <= s.keyframes[0].t ? (e[0] = s.getValueAtTime((s.keyframes[0].t + .01) / i, 0), e[1] = a.getValueAtTime((a.keyframes[0].t + .01) / i, 0), r[0] = s.getValueAtTime(s.keyframes[0].t / i, 0), r[1] = a.getValueAtTime(a.keyframes[0].t / i, 0)) : s._caching.lastFrame + s.offsetTime >= s.keyframes[s.keyframes.length - 1].t ? (e[0] = s.getValueAtTime(s.keyframes[s.keyframes.length - 1].t / i, 0), e[1] = a.getValueAtTime(a.keyframes[a.keyframes.length - 1].t / i, 0), r[0] = s.getValueAtTime((s.keyframes[s.keyframes.length - 1].t - .01) / i, 0), r[1] = a.getValueAtTime((a.keyframes[a.keyframes.length - 1].t - .01) / i, 0)) : (e = [s.pv, a.pv], r[0] = s.getValueAtTime((s._caching.lastFrame + s.offsetTime - .01) / i, s.offsetTime), r[1] = a.getValueAtTime((a._caching.lastFrame + a.offsetTime - .01) / i, a.offsetTime));
                    }
                    this.v.rotate(-Math.atan2(e[1] - r[1], e[0] - r[0]));
                  }
                  this.data.p && this.data.p.s ? this.data.p.z ? this.v.translate(this.px.v, this.py.v, -this.pz.v) : this.v.translate(this.px.v, this.py.v, 0) : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
                }
                this.frameId = this.elem.globalData.frameId;
              }
            },
            precalculateMatrix: function precalculateMatrix() {
              if (!this.a.k && (this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations = 1, !this.s.effectsSequence.length)) {
                if (this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.appliedTransformations = 2, this.sk) {
                  if (this.sk.effectsSequence.length || this.sa.effectsSequence.length) return;
                  this.pre.skewFromAxis(-this.sk.v, this.sa.v), this.appliedTransformations = 3;
                }
                if (this.r) {
                  if (this.r.effectsSequence.length) return;
                  this.pre.rotate(-this.r.v), this.appliedTransformations = 4;
                } else this.rz.effectsSequence.length || this.ry.effectsSequence.length || this.rx.effectsSequence.length || this.or.effectsSequence.length || (this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.appliedTransformations = 4);
              }
            },
            autoOrient: function autoOrient() {}
          }, extendPrototype([DynamicPropertyContainer], t), t.prototype.addDynamicProperty = function (t) {
            this._addDynamicProperty(t), this.elem.addDynamicProperty(t), this._isDirty = !0;
          }, t.prototype._addDynamicProperty = DynamicPropertyContainer.prototype.addDynamicProperty, {
            getTransformProperty: function getTransformProperty(e, r, i) {
              return new t(e, r, i);
            }
          };
        }();
      function ShapePath() {
        this.c = !1, this._length = 0, this._maxLength = 8, this.v = createSizedArray(this._maxLength), this.o = createSizedArray(this._maxLength), this.i = createSizedArray(this._maxLength);
      }
      ShapePath.prototype.setPathData = function (t, e) {
        this.c = t, this.setLength(e);
        for (var r = 0; r < e;) {
          this.v[r] = point_pool.newElement(), this.o[r] = point_pool.newElement(), this.i[r] = point_pool.newElement(), r += 1;
        }
      }, ShapePath.prototype.setLength = function (t) {
        for (; this._maxLength < t;) {
          this.doubleArrayLength();
        }
        this._length = t;
      }, ShapePath.prototype.doubleArrayLength = function () {
        this.v = this.v.concat(createSizedArray(this._maxLength)), this.i = this.i.concat(createSizedArray(this._maxLength)), this.o = this.o.concat(createSizedArray(this._maxLength)), this._maxLength *= 2;
      }, ShapePath.prototype.setXYAt = function (t, e, r, i, s) {
        var a;
        switch (this._length = Math.max(this._length, i + 1), this._length >= this._maxLength && this.doubleArrayLength(), r) {
          case "v":
            a = this.v;
            break;
          case "i":
            a = this.i;
            break;
          case "o":
            a = this.o;
        }
        (!a[i] || a[i] && !s) && (a[i] = point_pool.newElement()), a[i][0] = t, a[i][1] = e;
      }, ShapePath.prototype.setTripleAt = function (t, e, r, i, s, a, n, o) {
        this.setXYAt(t, e, "v", n, o), this.setXYAt(r, i, "o", n, o), this.setXYAt(s, a, "i", n, o);
      }, ShapePath.prototype.reverse = function () {
        var t = new ShapePath();
        t.setPathData(this.c, this._length);
        var e = this.v,
          r = this.o,
          i = this.i,
          s = 0;
        this.c && (t.setTripleAt(e[0][0], e[0][1], i[0][0], i[0][1], r[0][0], r[0][1], 0, !1), s = 1);
        var a,
          n = this._length - 1,
          o = this._length;
        for (a = s; a < o; a += 1) {
          t.setTripleAt(e[n][0], e[n][1], i[n][0], i[n][1], r[n][0], r[n][1], a, !1), n -= 1;
        }
        return t;
      };
      var ShapePropertyFactory = function () {
          function t(t, e, r) {
            var i,
              s,
              a,
              n,
              o,
              h,
              l,
              p,
              f,
              m = r.lastIndex,
              c = this.keyframes;
            if (t < c[0].t - this.offsetTime) i = c[0].s[0], a = !0, m = 0;else if (t >= c[c.length - 1].t - this.offsetTime) i = c[c.length - 1].s ? c[c.length - 1].s[0] : c[c.length - 2].e[0], a = !0;else {
              for (var d, u, y = m, g = c.length - 1, v = !0; v && (d = c[y], !((u = c[y + 1]).t - this.offsetTime > t));) {
                y < g - 1 ? y += 1 : v = !1;
              }
              if (m = y, !(a = 1 === d.h)) {
                if (t >= u.t - this.offsetTime) p = 1;else if (t < d.t - this.offsetTime) p = 0;else {
                  var b;
                  d.__fnct ? b = d.__fnct : (b = BezierFactory.getBezierEasing(d.o.x, d.o.y, d.i.x, d.i.y).get, d.__fnct = b), p = b((t - (d.t - this.offsetTime)) / (u.t - this.offsetTime - (d.t - this.offsetTime)));
                }
                s = u.s ? u.s[0] : d.e[0];
              }
              i = d.s[0];
            }
            for (h = e._length, l = i.i[0].length, r.lastIndex = m, n = 0; n < h; n += 1) {
              for (o = 0; o < l; o += 1) {
                f = a ? i.i[n][o] : i.i[n][o] + (s.i[n][o] - i.i[n][o]) * p, e.i[n][o] = f, f = a ? i.o[n][o] : i.o[n][o] + (s.o[n][o] - i.o[n][o]) * p, e.o[n][o] = f, f = a ? i.v[n][o] : i.v[n][o] + (s.v[n][o] - i.v[n][o]) * p, e.v[n][o] = f;
              }
            }
          }
          function e() {
            var t = this.comp.renderedFrame - this.offsetTime,
              e = this.keyframes[0].t - this.offsetTime,
              r = this.keyframes[this.keyframes.length - 1].t - this.offsetTime,
              i = this._caching.lastFrame;
            return -999999 !== i && (i < e && t < e || i > r && t > r) || (this._caching.lastIndex = i < t ? this._caching.lastIndex : 0, this.interpolateShape(t, this.pv, this._caching)), this._caching.lastFrame = t, this.pv;
          }
          function r() {
            this.paths = this.localShapeCollection;
          }
          function i(t) {
            (function (t, e) {
              if (t._length !== e._length || t.c !== e.c) return !1;
              var r,
                i = t._length;
              for (r = 0; r < i; r += 1) {
                if (t.v[r][0] !== e.v[r][0] || t.v[r][1] !== e.v[r][1] || t.o[r][0] !== e.o[r][0] || t.o[r][1] !== e.o[r][1] || t.i[r][0] !== e.i[r][0] || t.i[r][1] !== e.i[r][1]) return !1;
              }
              return !0;
            })(this.v, t) || (this.v = shape_pool.clone(t), this.localShapeCollection.releaseShapes(), this.localShapeCollection.addShape(this.v), this._mdf = !0, this.paths = this.localShapeCollection);
          }
          function s() {
            if (this.elem.globalData.frameId !== this.frameId) if (this.effectsSequence.length) {
              if (this.lock) this.setVValue(this.pv);else {
                this.lock = !0, this._mdf = !1;
                var t,
                  e = this.kf ? this.pv : this.data.ks ? this.data.ks.k : this.data.pt.k,
                  r = this.effectsSequence.length;
                for (t = 0; t < r; t += 1) {
                  e = this.effectsSequence[t](e);
                }
                this.setVValue(e), this.lock = !1, this.frameId = this.elem.globalData.frameId;
              }
            } else this._mdf = !1;
          }
          function a(t, e, i) {
            this.propType = "shape", this.comp = t.comp, this.container = t, this.elem = t, this.data = e, this.k = !1, this.kf = !1, this._mdf = !1;
            var s = 3 === i ? e.pt.k : e.ks.k;
            this.v = shape_pool.clone(s), this.pv = shape_pool.clone(this.v), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.reset = r, this.effectsSequence = [];
          }
          function n(t) {
            this.effectsSequence.push(t), this.container.addDynamicProperty(this);
          }
          function o(t, i, s) {
            this.propType = "shape", this.comp = t.comp, this.elem = t, this.container = t, this.offsetTime = t.data.st, this.keyframes = 3 === s ? i.pt.k : i.ks.k, this.k = !0, this.kf = !0;
            var a = this.keyframes[0].s[0].i.length;
            this.keyframes[0].s[0].i[0].length;
            this.v = shape_pool.newElement(), this.v.setPathData(this.keyframes[0].s[0].c, a), this.pv = shape_pool.clone(this.v), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.lastFrame = -999999, this.reset = r, this._caching = {
              lastFrame: -999999,
              lastIndex: 0
            }, this.effectsSequence = [e.bind(this)];
          }
          a.prototype.interpolateShape = t, a.prototype.getValue = s, a.prototype.setVValue = i, a.prototype.addEffect = n, o.prototype.getValue = s, o.prototype.interpolateShape = t, o.prototype.setVValue = i, o.prototype.addEffect = n;
          var h = function () {
              var t = roundCorner;
              function e(t, e) {
                this.v = shape_pool.newElement(), this.v.setPathData(!0, 4), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.paths = this.localShapeCollection, this.localShapeCollection.addShape(this.v), this.d = e.d, this.elem = t, this.comp = t.comp, this.frameId = -1, this.initDynamicPropertyContainer(t), this.p = PropertyFactory.getProp(t, e.p, 1, 0, this), this.s = PropertyFactory.getProp(t, e.s, 1, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertEllToPath());
              }
              return e.prototype = {
                reset: r,
                getValue: function getValue() {
                  this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertEllToPath());
                },
                convertEllToPath: function convertEllToPath() {
                  var e = this.p.v[0],
                    r = this.p.v[1],
                    i = this.s.v[0] / 2,
                    s = this.s.v[1] / 2,
                    a = 3 !== this.d,
                    n = this.v;
                  n.v[0][0] = e, n.v[0][1] = r - s, n.v[1][0] = a ? e + i : e - i, n.v[1][1] = r, n.v[2][0] = e, n.v[2][1] = r + s, n.v[3][0] = a ? e - i : e + i, n.v[3][1] = r, n.i[0][0] = a ? e - i * t : e + i * t, n.i[0][1] = r - s, n.i[1][0] = a ? e + i : e - i, n.i[1][1] = r - s * t, n.i[2][0] = a ? e + i * t : e - i * t, n.i[2][1] = r + s, n.i[3][0] = a ? e - i : e + i, n.i[3][1] = r + s * t, n.o[0][0] = a ? e + i * t : e - i * t, n.o[0][1] = r - s, n.o[1][0] = a ? e + i : e - i, n.o[1][1] = r + s * t, n.o[2][0] = a ? e - i * t : e + i * t, n.o[2][1] = r + s, n.o[3][0] = a ? e - i : e + i, n.o[3][1] = r - s * t;
                }
              }, extendPrototype([DynamicPropertyContainer], e), e;
            }(),
            l = function () {
              function t(t, e) {
                this.v = shape_pool.newElement(), this.v.setPathData(!0, 0), this.elem = t, this.comp = t.comp, this.data = e, this.frameId = -1, this.d = e.d, this.initDynamicPropertyContainer(t), 1 === e.sy ? (this.ir = PropertyFactory.getProp(t, e.ir, 0, 0, this), this.is = PropertyFactory.getProp(t, e.is, 0, .01, this), this.convertToPath = this.convertStarToPath) : this.convertToPath = this.convertPolygonToPath, this.pt = PropertyFactory.getProp(t, e.pt, 0, 0, this), this.p = PropertyFactory.getProp(t, e.p, 1, 0, this), this.r = PropertyFactory.getProp(t, e.r, 0, degToRads, this), this.or = PropertyFactory.getProp(t, e.or, 0, 0, this), this.os = PropertyFactory.getProp(t, e.os, 0, .01, this), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertToPath());
              }
              return t.prototype = {
                reset: r,
                getValue: function getValue() {
                  this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertToPath());
                },
                convertStarToPath: function convertStarToPath() {
                  var t,
                    e,
                    r,
                    i,
                    s = 2 * Math.floor(this.pt.v),
                    a = 2 * Math.PI / s,
                    n = !0,
                    o = this.or.v,
                    h = this.ir.v,
                    l = this.os.v,
                    p = this.is.v,
                    f = 2 * Math.PI * o / (2 * s),
                    m = 2 * Math.PI * h / (2 * s),
                    c = -Math.PI / 2;
                  c += this.r.v;
                  var d = 3 === this.data.d ? -1 : 1;
                  for (this.v._length = 0, t = 0; t < s; t += 1) {
                    r = n ? l : p, i = n ? f : m;
                    var u = (e = n ? o : h) * Math.cos(c),
                      y = e * Math.sin(c),
                      g = 0 === u && 0 === y ? 0 : y / Math.sqrt(u * u + y * y),
                      v = 0 === u && 0 === y ? 0 : -u / Math.sqrt(u * u + y * y);
                    u += +this.p.v[0], y += +this.p.v[1], this.v.setTripleAt(u, y, u - g * i * r * d, y - v * i * r * d, u + g * i * r * d, y + v * i * r * d, t, !0), n = !n, c += a * d;
                  }
                },
                convertPolygonToPath: function convertPolygonToPath() {
                  var t,
                    e = Math.floor(this.pt.v),
                    r = 2 * Math.PI / e,
                    i = this.or.v,
                    s = this.os.v,
                    a = 2 * Math.PI * i / (4 * e),
                    n = -Math.PI / 2,
                    o = 3 === this.data.d ? -1 : 1;
                  for (n += this.r.v, this.v._length = 0, t = 0; t < e; t += 1) {
                    var h = i * Math.cos(n),
                      l = i * Math.sin(n),
                      p = 0 === h && 0 === l ? 0 : l / Math.sqrt(h * h + l * l),
                      f = 0 === h && 0 === l ? 0 : -h / Math.sqrt(h * h + l * l);
                    h += +this.p.v[0], l += +this.p.v[1], this.v.setTripleAt(h, l, h - p * a * s * o, l - f * a * s * o, h + p * a * s * o, l + f * a * s * o, t, !0), n += r * o;
                  }
                  this.paths.length = 0, this.paths[0] = this.v;
                }
              }, extendPrototype([DynamicPropertyContainer], t), t;
            }(),
            p = function () {
              function t(t, e) {
                this.v = shape_pool.newElement(), this.v.c = !0, this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.elem = t, this.comp = t.comp, this.frameId = -1, this.d = e.d, this.initDynamicPropertyContainer(t), this.p = PropertyFactory.getProp(t, e.p, 1, 0, this), this.s = PropertyFactory.getProp(t, e.s, 1, 0, this), this.r = PropertyFactory.getProp(t, e.r, 0, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertRectToPath());
              }
              return t.prototype = {
                convertRectToPath: function convertRectToPath() {
                  var t = this.p.v[0],
                    e = this.p.v[1],
                    r = this.s.v[0] / 2,
                    i = this.s.v[1] / 2,
                    s = bm_min(r, i, this.r.v),
                    a = s * (1 - roundCorner);
                  this.v._length = 0, 2 === this.d || 1 === this.d ? (this.v.setTripleAt(t + r, e - i + s, t + r, e - i + s, t + r, e - i + a, 0, !0), this.v.setTripleAt(t + r, e + i - s, t + r, e + i - a, t + r, e + i - s, 1, !0), 0 !== s ? (this.v.setTripleAt(t + r - s, e + i, t + r - s, e + i, t + r - a, e + i, 2, !0), this.v.setTripleAt(t - r + s, e + i, t - r + a, e + i, t - r + s, e + i, 3, !0), this.v.setTripleAt(t - r, e + i - s, t - r, e + i - s, t - r, e + i - a, 4, !0), this.v.setTripleAt(t - r, e - i + s, t - r, e - i + a, t - r, e - i + s, 5, !0), this.v.setTripleAt(t - r + s, e - i, t - r + s, e - i, t - r + a, e - i, 6, !0), this.v.setTripleAt(t + r - s, e - i, t + r - a, e - i, t + r - s, e - i, 7, !0)) : (this.v.setTripleAt(t - r, e + i, t - r + a, e + i, t - r, e + i, 2), this.v.setTripleAt(t - r, e - i, t - r, e - i + a, t - r, e - i, 3))) : (this.v.setTripleAt(t + r, e - i + s, t + r, e - i + a, t + r, e - i + s, 0, !0), 0 !== s ? (this.v.setTripleAt(t + r - s, e - i, t + r - s, e - i, t + r - a, e - i, 1, !0), this.v.setTripleAt(t - r + s, e - i, t - r + a, e - i, t - r + s, e - i, 2, !0), this.v.setTripleAt(t - r, e - i + s, t - r, e - i + s, t - r, e - i + a, 3, !0), this.v.setTripleAt(t - r, e + i - s, t - r, e + i - a, t - r, e + i - s, 4, !0), this.v.setTripleAt(t - r + s, e + i, t - r + s, e + i, t - r + a, e + i, 5, !0), this.v.setTripleAt(t + r - s, e + i, t + r - a, e + i, t + r - s, e + i, 6, !0), this.v.setTripleAt(t + r, e + i - s, t + r, e + i - s, t + r, e + i - a, 7, !0)) : (this.v.setTripleAt(t - r, e - i, t - r + a, e - i, t - r, e - i, 1, !0), this.v.setTripleAt(t - r, e + i, t - r, e + i - a, t - r, e + i, 2, !0), this.v.setTripleAt(t + r, e + i, t + r - a, e + i, t + r, e + i, 3, !0)));
                },
                getValue: function getValue(t) {
                  this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertRectToPath());
                },
                reset: r
              }, extendPrototype([DynamicPropertyContainer], t), t;
            }();
          var f = {
            getShapeProp: function getShapeProp(t, e, r) {
              var i;
              return 3 === r || 4 === r ? i = (3 === r ? e.pt : e.ks).k.length ? new o(t, e, r) : new a(t, e, r) : 5 === r ? i = new p(t, e) : 6 === r ? i = new h(t, e) : 7 === r && (i = new l(t, e)), i.k && t.addDynamicProperty(i), i;
            },
            getConstructorFunction: function getConstructorFunction() {
              return a;
            },
            getKeyframedConstructorFunction: function getKeyframedConstructorFunction() {
              return o;
            }
          };
          return f;
        }(),
        ShapeModifiers = function () {
          var t = {},
            e = {};
          return t.registerModifier = function (t, r) {
            e[t] || (e[t] = r);
          }, t.getModifier = function (t, r, i) {
            return new e[t](r, i);
          }, t;
        }();
      function ShapeModifier() {}
      function TrimModifier() {}
      function RoundCornersModifier() {}
      function RepeaterModifier() {}
      function ShapeCollection() {
        this._length = 0, this._maxLength = 4, this.shapes = createSizedArray(this._maxLength);
      }
      function DashProperty(t, e, r, i) {
        this.elem = t, this.frameId = -1, this.dataProps = createSizedArray(e.length), this.renderer = r, this.k = !1, this.dashStr = "", this.dashArray = createTypedArray("float32", e.length ? e.length - 1 : 0), this.dashoffset = createTypedArray("float32", 1), this.initDynamicPropertyContainer(i);
        var s,
          a,
          n = e.length || 0;
        for (s = 0; s < n; s += 1) {
          a = PropertyFactory.getProp(t, e[s].v, 0, 0, this), this.k = a.k || this.k, this.dataProps[s] = {
            n: e[s].n,
            p: a
          };
        }
        this.k || this.getValue(!0), this._isAnimated = this.k;
      }
      function GradientProperty(t, e, r) {
        this.data = e, this.c = createTypedArray("uint8c", 4 * e.p);
        var i = e.k.k[0].s ? e.k.k[0].s.length - 4 * e.p : e.k.k.length - 4 * e.p;
        this.o = createTypedArray("float32", i), this._cmdf = !1, this._omdf = !1, this._collapsable = this.checkCollapsable(), this._hasOpacity = i, this.initDynamicPropertyContainer(r), this.prop = PropertyFactory.getProp(t, e.k, 1, null, this), this.k = this.prop.k, this.getValue(!0);
      }
      ShapeModifier.prototype.initModifierProperties = function () {}, ShapeModifier.prototype.addShapeToModifier = function () {}, ShapeModifier.prototype.addShape = function (t) {
        if (!this.closed) {
          t.sh.container.addDynamicProperty(t.sh);
          var e = {
            shape: t.sh,
            data: t,
            localShapeCollection: shapeCollection_pool.newShapeCollection()
          };
          this.shapes.push(e), this.addShapeToModifier(e), this._isAnimated && t.setAsAnimated();
        }
      }, ShapeModifier.prototype.init = function (t, e) {
        this.shapes = [], this.elem = t, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e), this.frameId = initialDefaultFrame, this.closed = !1, this.k = !1, this.dynamicProperties.length ? this.k = !0 : this.getValue(!0);
      }, ShapeModifier.prototype.processKeys = function () {
        this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties());
      }, extendPrototype([DynamicPropertyContainer], ShapeModifier), extendPrototype([ShapeModifier], TrimModifier), TrimModifier.prototype.initModifierProperties = function (t, e) {
        this.s = PropertyFactory.getProp(t, e.s, 0, .01, this), this.e = PropertyFactory.getProp(t, e.e, 0, .01, this), this.o = PropertyFactory.getProp(t, e.o, 0, 0, this), this.sValue = 0, this.eValue = 0, this.getValue = this.processKeys, this.m = e.m, this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length;
      }, TrimModifier.prototype.addShapeToModifier = function (t) {
        t.pathsData = [];
      }, TrimModifier.prototype.calculateShapeEdges = function (t, e, r, i, s) {
        var a = [];
        e <= 1 ? a.push({
          s: t,
          e: e
        }) : t >= 1 ? a.push({
          s: t - 1,
          e: e - 1
        }) : (a.push({
          s: t,
          e: 1
        }), a.push({
          s: 0,
          e: e - 1
        }));
        var n,
          o,
          h = [],
          l = a.length;
        for (n = 0; n < l; n += 1) {
          var p, f;
          if ((o = a[n]).e * s < i || o.s * s > i + r) ;else p = o.s * s <= i ? 0 : (o.s * s - i) / r, f = o.e * s >= i + r ? 1 : (o.e * s - i) / r, h.push([p, f]);
        }
        return h.length || h.push([0, 0]), h;
      }, TrimModifier.prototype.releasePathsData = function (t) {
        var e,
          r = t.length;
        for (e = 0; e < r; e += 1) {
          segments_length_pool.release(t[e]);
        }
        return t.length = 0, t;
      }, TrimModifier.prototype.processShapes = function (t) {
        var e, r, i;
        if (this._mdf || t) {
          var s = this.o.v % 360 / 360;
          if (s < 0 && (s += 1), (e = (this.s.v > 1 ? 1 : this.s.v < 0 ? 0 : this.s.v) + s) > (r = (this.e.v > 1 ? 1 : this.e.v < 0 ? 0 : this.e.v) + s)) {
            var a = e;
            e = r, r = a;
          }
          e = 1e-4 * Math.round(1e4 * e), r = 1e-4 * Math.round(1e4 * r), this.sValue = e, this.eValue = r;
        } else e = this.sValue, r = this.eValue;
        var n,
          o,
          h,
          l,
          p,
          f,
          m = this.shapes.length,
          c = 0;
        if (r === e) for (n = 0; n < m; n += 1) {
          this.shapes[n].localShapeCollection.releaseShapes(), this.shapes[n].shape._mdf = !0, this.shapes[n].shape.paths = this.shapes[n].localShapeCollection;
        } else if (1 === r && 0 === e || 0 === r && 1 === e) {
          if (this._mdf) for (n = 0; n < m; n += 1) {
            this.shapes[n].pathsData.length = 0, this.shapes[n].shape._mdf = !0;
          }
        } else {
          var d,
            u,
            y = [];
          for (n = 0; n < m; n += 1) {
            if ((d = this.shapes[n]).shape._mdf || this._mdf || t || 2 === this.m) {
              if (h = (i = d.shape.paths)._length, f = 0, !d.shape._mdf && d.pathsData.length) f = d.totalShapeLength;else {
                for (l = this.releasePathsData(d.pathsData), o = 0; o < h; o += 1) {
                  p = bez.getSegmentsLength(i.shapes[o]), l.push(p), f += p.totalLength;
                }
                d.totalShapeLength = f, d.pathsData = l;
              }
              c += f, d.shape._mdf = !0;
            } else d.shape.paths = d.localShapeCollection;
          }
          var g,
            v = e,
            b = r,
            P = 0;
          for (n = m - 1; n >= 0; n -= 1) {
            if ((d = this.shapes[n]).shape._mdf) {
              for ((u = d.localShapeCollection).releaseShapes(), 2 === this.m && m > 1 ? (g = this.calculateShapeEdges(e, r, d.totalShapeLength, P, c), P += d.totalShapeLength) : g = [[v, b]], h = g.length, o = 0; o < h; o += 1) {
                v = g[o][0], b = g[o][1], y.length = 0, b <= 1 ? y.push({
                  s: d.totalShapeLength * v,
                  e: d.totalShapeLength * b
                }) : v >= 1 ? y.push({
                  s: d.totalShapeLength * (v - 1),
                  e: d.totalShapeLength * (b - 1)
                }) : (y.push({
                  s: d.totalShapeLength * v,
                  e: d.totalShapeLength
                }), y.push({
                  s: 0,
                  e: d.totalShapeLength * (b - 1)
                }));
                var _ = this.addShapes(d, y[0]);
                if (y[0].s !== y[0].e) {
                  if (y.length > 1) if (d.shape.paths.shapes[d.shape.paths._length - 1].c) {
                    var x = _.pop();
                    this.addPaths(_, u), _ = this.addShapes(d, y[1], x);
                  } else this.addPaths(_, u), _ = this.addShapes(d, y[1]);
                  this.addPaths(_, u);
                }
              }
              d.shape.paths = u;
            }
          }
        }
      }, TrimModifier.prototype.addPaths = function (t, e) {
        var r,
          i = t.length;
        for (r = 0; r < i; r += 1) {
          e.addShape(t[r]);
        }
      }, TrimModifier.prototype.addSegment = function (t, e, r, i, s, a, n) {
        s.setXYAt(e[0], e[1], "o", a), s.setXYAt(r[0], r[1], "i", a + 1), n && s.setXYAt(t[0], t[1], "v", a), s.setXYAt(i[0], i[1], "v", a + 1);
      }, TrimModifier.prototype.addSegmentFromArray = function (t, e, r, i) {
        e.setXYAt(t[1], t[5], "o", r), e.setXYAt(t[2], t[6], "i", r + 1), i && e.setXYAt(t[0], t[4], "v", r), e.setXYAt(t[3], t[7], "v", r + 1);
      }, TrimModifier.prototype.addShapes = function (t, e, r) {
        var i,
          s,
          a,
          n,
          o,
          h,
          l,
          p,
          f = t.pathsData,
          m = t.shape.paths.shapes,
          c = t.shape.paths._length,
          d = 0,
          u = [],
          y = !0;
        for (r ? (o = r._length, p = r._length) : (r = shape_pool.newElement(), o = 0, p = 0), u.push(r), i = 0; i < c; i += 1) {
          for (h = f[i].lengths, r.c = m[i].c, a = m[i].c ? h.length : h.length + 1, s = 1; s < a; s += 1) {
            if (d + (n = h[s - 1]).addedLength < e.s) d += n.addedLength, r.c = !1;else {
              if (d > e.e) {
                r.c = !1;
                break;
              }
              e.s <= d && e.e >= d + n.addedLength ? (this.addSegment(m[i].v[s - 1], m[i].o[s - 1], m[i].i[s], m[i].v[s], r, o, y), y = !1) : (l = bez.getNewSegment(m[i].v[s - 1], m[i].v[s], m[i].o[s - 1], m[i].i[s], (e.s - d) / n.addedLength, (e.e - d) / n.addedLength, h[s - 1]), this.addSegmentFromArray(l, r, o, y), y = !1, r.c = !1), d += n.addedLength, o += 1;
            }
          }
          if (m[i].c && h.length) {
            if (n = h[s - 1], d <= e.e) {
              var g = h[s - 1].addedLength;
              e.s <= d && e.e >= d + g ? (this.addSegment(m[i].v[s - 1], m[i].o[s - 1], m[i].i[0], m[i].v[0], r, o, y), y = !1) : (l = bez.getNewSegment(m[i].v[s - 1], m[i].v[0], m[i].o[s - 1], m[i].i[0], (e.s - d) / g, (e.e - d) / g, h[s - 1]), this.addSegmentFromArray(l, r, o, y), y = !1, r.c = !1);
            } else r.c = !1;
            d += n.addedLength, o += 1;
          }
          if (r._length && (r.setXYAt(r.v[p][0], r.v[p][1], "i", p), r.setXYAt(r.v[r._length - 1][0], r.v[r._length - 1][1], "o", r._length - 1)), d > e.e) break;
          i < c - 1 && (r = shape_pool.newElement(), y = !0, u.push(r), o = 0);
        }
        return u;
      }, ShapeModifiers.registerModifier("tm", TrimModifier), extendPrototype([ShapeModifier], RoundCornersModifier), RoundCornersModifier.prototype.initModifierProperties = function (t, e) {
        this.getValue = this.processKeys, this.rd = PropertyFactory.getProp(t, e.r, 0, null, this), this._isAnimated = !!this.rd.effectsSequence.length;
      }, RoundCornersModifier.prototype.processPath = function (t, e) {
        var r = shape_pool.newElement();
        r.c = t.c;
        var i,
          s,
          a,
          n,
          o,
          h,
          l,
          p,
          f,
          m,
          c,
          d,
          u,
          y = t._length,
          g = 0;
        for (i = 0; i < y; i += 1) {
          s = t.v[i], n = t.o[i], a = t.i[i], s[0] === n[0] && s[1] === n[1] && s[0] === a[0] && s[1] === a[1] ? 0 !== i && i !== y - 1 || t.c ? (o = 0 === i ? t.v[y - 1] : t.v[i - 1], l = (h = Math.sqrt(Math.pow(s[0] - o[0], 2) + Math.pow(s[1] - o[1], 2))) ? Math.min(h / 2, e) / h : 0, p = d = s[0] + (o[0] - s[0]) * l, f = u = s[1] - (s[1] - o[1]) * l, m = p - (p - s[0]) * roundCorner, c = f - (f - s[1]) * roundCorner, r.setTripleAt(p, f, m, c, d, u, g), g += 1, o = i === y - 1 ? t.v[0] : t.v[i + 1], l = (h = Math.sqrt(Math.pow(s[0] - o[0], 2) + Math.pow(s[1] - o[1], 2))) ? Math.min(h / 2, e) / h : 0, p = m = s[0] + (o[0] - s[0]) * l, f = c = s[1] + (o[1] - s[1]) * l, d = p - (p - s[0]) * roundCorner, u = f - (f - s[1]) * roundCorner, r.setTripleAt(p, f, m, c, d, u, g), g += 1) : (r.setTripleAt(s[0], s[1], n[0], n[1], a[0], a[1], g), g += 1) : (r.setTripleAt(t.v[i][0], t.v[i][1], t.o[i][0], t.o[i][1], t.i[i][0], t.i[i][1], g), g += 1);
        }
        return r;
      }, RoundCornersModifier.prototype.processShapes = function (t) {
        var e,
          r,
          i,
          s,
          a,
          n,
          o = this.shapes.length,
          h = this.rd.v;
        if (0 !== h) for (r = 0; r < o; r += 1) {
          if ((a = this.shapes[r]).shape.paths, n = a.localShapeCollection, a.shape._mdf || this._mdf || t) for (n.releaseShapes(), a.shape._mdf = !0, e = a.shape.paths.shapes, s = a.shape.paths._length, i = 0; i < s; i += 1) {
            n.addShape(this.processPath(e[i], h));
          }
          a.shape.paths = a.localShapeCollection;
        }
        this.dynamicProperties.length || (this._mdf = !1);
      }, ShapeModifiers.registerModifier("rd", RoundCornersModifier), extendPrototype([ShapeModifier], RepeaterModifier), RepeaterModifier.prototype.initModifierProperties = function (t, e) {
        this.getValue = this.processKeys, this.c = PropertyFactory.getProp(t, e.c, 0, null, this), this.o = PropertyFactory.getProp(t, e.o, 0, null, this), this.tr = TransformPropertyFactory.getTransformProperty(t, e.tr, this), this.so = PropertyFactory.getProp(t, e.tr.so, 0, .01, this), this.eo = PropertyFactory.getProp(t, e.tr.eo, 0, .01, this), this.data = e, this.dynamicProperties.length || this.getValue(!0), this._isAnimated = !!this.dynamicProperties.length, this.pMatrix = new Matrix(), this.rMatrix = new Matrix(), this.sMatrix = new Matrix(), this.tMatrix = new Matrix(), this.matrix = new Matrix();
      }, RepeaterModifier.prototype.applyTransforms = function (t, e, r, i, s, a) {
        var n = a ? -1 : 1,
          o = i.s.v[0] + (1 - i.s.v[0]) * (1 - s),
          h = i.s.v[1] + (1 - i.s.v[1]) * (1 - s);
        t.translate(i.p.v[0] * n * s, i.p.v[1] * n * s, i.p.v[2]), e.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]), e.rotate(-i.r.v * n * s), e.translate(i.a.v[0], i.a.v[1], i.a.v[2]), r.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]), r.scale(a ? 1 / o : o, a ? 1 / h : h), r.translate(i.a.v[0], i.a.v[1], i.a.v[2]);
      }, RepeaterModifier.prototype.init = function (t, e, r, i) {
        this.elem = t, this.arr = e, this.pos = r, this.elemsData = i, this._currentCopies = 0, this._elements = [], this._groups = [], this.frameId = -1, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e[r]);
        for (; r > 0;) {
          r -= 1, this._elements.unshift(e[r]), 1;
        }
        this.dynamicProperties.length ? this.k = !0 : this.getValue(!0);
      }, RepeaterModifier.prototype.resetElements = function (t) {
        var e,
          r = t.length;
        for (e = 0; e < r; e += 1) {
          t[e]._processed = !1, "gr" === t[e].ty && this.resetElements(t[e].it);
        }
      }, RepeaterModifier.prototype.cloneElements = function (t) {
        t.length;
        var e = JSON.parse(JSON.stringify(t));
        return this.resetElements(e), e;
      }, RepeaterModifier.prototype.changeGroupRender = function (t, e) {
        var r,
          i = t.length;
        for (r = 0; r < i; r += 1) {
          t[r]._render = e, "gr" === t[r].ty && this.changeGroupRender(t[r].it, e);
        }
      }, RepeaterModifier.prototype.processShapes = function (t) {
        var e, r, i, s, a;
        if (this._mdf || t) {
          var n,
            o = Math.ceil(this.c.v);
          if (this._groups.length < o) {
            for (; this._groups.length < o;) {
              var h = {
                it: this.cloneElements(this._elements),
                ty: "gr"
              };
              h.it.push({
                a: {
                  a: 0,
                  ix: 1,
                  k: [0, 0]
                },
                nm: "Transform",
                o: {
                  a: 0,
                  ix: 7,
                  k: 100
                },
                p: {
                  a: 0,
                  ix: 2,
                  k: [0, 0]
                },
                r: {
                  a: 1,
                  ix: 6,
                  k: [{
                    s: 0,
                    e: 0,
                    t: 0
                  }, {
                    s: 0,
                    e: 0,
                    t: 1
                  }]
                },
                s: {
                  a: 0,
                  ix: 3,
                  k: [100, 100]
                },
                sa: {
                  a: 0,
                  ix: 5,
                  k: 0
                },
                sk: {
                  a: 0,
                  ix: 4,
                  k: 0
                },
                ty: "tr"
              }), this.arr.splice(0, 0, h), this._groups.splice(0, 0, h), this._currentCopies += 1;
            }
            this.elem.reloadShapes();
          }
          for (a = 0, i = 0; i <= this._groups.length - 1; i += 1) {
            n = a < o, this._groups[i]._render = n, this.changeGroupRender(this._groups[i].it, n), a += 1;
          }
          this._currentCopies = o;
          var l = this.o.v,
            p = l % 1,
            f = l > 0 ? Math.floor(l) : Math.ceil(l),
            m = (this.tr.v.props, this.pMatrix.props),
            c = this.rMatrix.props,
            d = this.sMatrix.props;
          this.pMatrix.reset(), this.rMatrix.reset(), this.sMatrix.reset(), this.tMatrix.reset(), this.matrix.reset();
          var u,
            y,
            g = 0;
          if (l > 0) {
            for (; g < f;) {
              this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), g += 1;
            }
            p && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, p, !1), g += p);
          } else if (l < 0) {
            for (; g > f;) {
              this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !0), g -= 1;
            }
            p && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -p, !0), g -= p);
          }
          for (i = 1 === this.data.m ? 0 : this._currentCopies - 1, s = 1 === this.data.m ? 1 : -1, a = this._currentCopies; a;) {
            if (y = (r = (e = this.elemsData[i].it)[e.length - 1].transform.mProps.v.props).length, e[e.length - 1].transform.mProps._mdf = !0, e[e.length - 1].transform.op._mdf = !0, e[e.length - 1].transform.op.v = this.so.v + (this.eo.v - this.so.v) * (i / (this._currentCopies - 1)), 0 !== g) {
              for ((0 !== i && 1 === s || i !== this._currentCopies - 1 && -1 === s) && this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), this.matrix.transform(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], c[10], c[11], c[12], c[13], c[14], c[15]), this.matrix.transform(d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8], d[9], d[10], d[11], d[12], d[13], d[14], d[15]), this.matrix.transform(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]), u = 0; u < y; u += 1) {
                r[u] = this.matrix.props[u];
              }
              this.matrix.reset();
            } else for (this.matrix.reset(), u = 0; u < y; u += 1) {
              r[u] = this.matrix.props[u];
            }
            g += 1, a -= 1, i += s;
          }
        } else for (a = this._currentCopies, i = 0, s = 1; a;) {
          r = (e = this.elemsData[i].it)[e.length - 1].transform.mProps.v.props, e[e.length - 1].transform.mProps._mdf = !1, e[e.length - 1].transform.op._mdf = !1, a -= 1, i += s;
        }
      }, RepeaterModifier.prototype.addShape = function () {}, ShapeModifiers.registerModifier("rp", RepeaterModifier), ShapeCollection.prototype.addShape = function (t) {
        this._length === this._maxLength && (this.shapes = this.shapes.concat(createSizedArray(this._maxLength)), this._maxLength *= 2), this.shapes[this._length] = t, this._length += 1;
      }, ShapeCollection.prototype.releaseShapes = function () {
        var t;
        for (t = 0; t < this._length; t += 1) {
          shape_pool.release(this.shapes[t]);
        }
        this._length = 0;
      }, DashProperty.prototype.getValue = function (t) {
        if ((this.elem.globalData.frameId !== this.frameId || t) && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf = this._mdf || t, this._mdf)) {
          var e = 0,
            r = this.dataProps.length;
          for ("svg" === this.renderer && (this.dashStr = ""), e = 0; e < r; e += 1) {
            "o" != this.dataProps[e].n ? "svg" === this.renderer ? this.dashStr += " " + this.dataProps[e].p.v : this.dashArray[e] = this.dataProps[e].p.v : this.dashoffset[0] = this.dataProps[e].p.v;
          }
        }
      }, extendPrototype([DynamicPropertyContainer], DashProperty), GradientProperty.prototype.comparePoints = function (t, e) {
        for (var r = 0, i = this.o.length / 2; r < i;) {
          if (Math.abs(t[4 * r] - t[4 * e + 2 * r]) > .01) return !1;
          r += 1;
        }
        return !0;
      }, GradientProperty.prototype.checkCollapsable = function () {
        if (this.o.length / 2 != this.c.length / 4) return !1;
        if (this.data.k.k[0].s) for (var t = 0, e = this.data.k.k.length; t < e;) {
          if (!this.comparePoints(this.data.k.k[t].s, this.data.p)) return !1;
          t += 1;
        } else if (!this.comparePoints(this.data.k.k, this.data.p)) return !1;
        return !0;
      }, GradientProperty.prototype.getValue = function (t) {
        if (this.prop.getValue(), this._mdf = !1, this._cmdf = !1, this._omdf = !1, this.prop._mdf || t) {
          var e,
            r,
            i,
            s = 4 * this.data.p;
          for (e = 0; e < s; e += 1) {
            r = e % 4 == 0 ? 100 : 255, i = Math.round(this.prop.v[e] * r), this.c[e] !== i && (this.c[e] = i, this._cmdf = !t);
          }
          if (this.o.length) for (s = this.prop.v.length, e = 4 * this.data.p; e < s; e += 1) {
            r = e % 2 == 0 ? 100 : 1, i = e % 2 == 0 ? Math.round(100 * this.prop.v[e]) : this.prop.v[e], this.o[e - 4 * this.data.p] !== i && (this.o[e - 4 * this.data.p] = i, this._omdf = !t);
          }
          this._mdf = !t;
        }
      }, extendPrototype([DynamicPropertyContainer], GradientProperty);
      var buildShapeString = function buildShapeString(t, e, r, i) {
          if (0 === e) return "";
          var s,
            a = t.o,
            n = t.i,
            o = t.v,
            h = " M" + i.applyToPointStringified(o[0][0], o[0][1]);
          for (s = 1; s < e; s += 1) {
            h += " C" + i.applyToPointStringified(a[s - 1][0], a[s - 1][1]) + " " + i.applyToPointStringified(n[s][0], n[s][1]) + " " + i.applyToPointStringified(o[s][0], o[s][1]);
          }
          return r && e && (h += " C" + i.applyToPointStringified(a[s - 1][0], a[s - 1][1]) + " " + i.applyToPointStringified(n[0][0], n[0][1]) + " " + i.applyToPointStringified(o[0][0], o[0][1]), h += "z"), h;
        },
        ImagePreloader = function () {
          var t = function () {
            var t = createTag("canvas");
            t.width = 1, t.height = 1;
            var e = t.getContext("2d");
            return e.fillStyle = "rgba(0,0,0,0)", e.fillRect(0, 0, 1, 1), t;
          }();
          function e() {
            this.loadedAssets += 1, this.loadedAssets === this.totalImages && this.imagesLoadedCb && this.imagesLoadedCb(null);
          }
          function r(e) {
            var r = function (t, e, r) {
                var i = "";
                if (t.e) i = t.p;else if (e) {
                  var s = t.p;
                  -1 !== s.indexOf("images/") && (s = s.split("/")[1]), i = e + s;
                } else i = r, i += t.u ? t.u : "", i += t.p;
                return i;
              }(e, this.assetsPath, this.path),
              i = createTag("img");
            i.crossOrigin = "anonymous", i.addEventListener("load", this._imageLoaded.bind(this), !1), i.addEventListener("error", function () {
              s.img = t, this._imageLoaded();
            }.bind(this), !1), i.src = r;
            var s = {
              img: i,
              assetData: e
            };
            return s;
          }
          function i(t, e) {
            this.imagesLoadedCb = e;
            var r,
              i = t.length;
            for (r = 0; r < i; r += 1) {
              t[r].layers || (this.totalImages += 1, this.images.push(this._createImageData(t[r])));
            }
          }
          function s(t) {
            this.path = t || "";
          }
          function a(t) {
            this.assetsPath = t || "";
          }
          function n(t) {
            for (var e = 0, r = this.images.length; e < r;) {
              if (this.images[e].assetData === t) return this.images[e].img;
              e += 1;
            }
          }
          function o() {
            this.imagesLoadedCb = null, this.images.length = 0;
          }
          function h() {
            return this.totalImages === this.loadedAssets;
          }
          return function () {
            this.loadAssets = i, this.setAssetsPath = a, this.setPath = s, this.loaded = h, this.destroy = o, this.getImage = n, this._createImageData = r, this._imageLoaded = e, this.assetsPath = "", this.path = "", this.totalImages = 0, this.loadedAssets = 0, this.imagesLoadedCb = null, this.images = [];
          };
        }(),
        featureSupport = function () {
          var t = {
            maskType: !0
          };
          return (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) && (t.maskType = !1), t;
        }(),
        filtersFactory = function () {
          var t = {};
          return t.createFilter = function (t) {
            var e = createNS("filter");
            return e.setAttribute("id", t), e.setAttribute("filterUnits", "objectBoundingBox"), e.setAttribute("x", "0%"), e.setAttribute("y", "0%"), e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e;
          }, t.createAlphaToLuminanceFilter = function () {
            var t = createNS("feColorMatrix");
            return t.setAttribute("type", "matrix"), t.setAttribute("color-interpolation-filters", "sRGB"), t.setAttribute("values", "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1"), t;
          }, t;
        }(),
        assetLoader = function () {
          function t(t) {
            return t.response && "object" === _typeof(t.response) ? t.response : t.response && "string" == typeof t.response ? JSON.parse(t.response) : t.responseText ? JSON.parse(t.responseText) : void 0;
          }
          return {
            load: function load(e, r, i) {
              var s,
                a = new XMLHttpRequest();
              a.open("GET", e, !0);
              try {
                a.responseType = "json";
              } catch (t) {}
              a.send(), a.onreadystatechange = function () {
                if (4 == a.readyState) if (200 == a.status) s = t(a), r(s);else try {
                  s = t(a), r(s);
                } catch (t) {
                  i && i(t);
                }
              };
            }
          };
        }();
      function TextAnimatorProperty(t, e, r) {
        this._isFirstFrame = !0, this._hasMaskedPath = !1, this._frameId = -1, this._textData = t, this._renderType = e, this._elem = r, this._animatorsData = createSizedArray(this._textData.a.length), this._pathData = {}, this._moreOptions = {
          alignment: {}
        }, this.renderedLetters = [], this.lettersChangedFlag = !1, this.initDynamicPropertyContainer(r);
      }
      function TextAnimatorDataProperty(t, e, r) {
        var i = {
            propType: !1
          },
          s = PropertyFactory.getProp,
          a = e.a;
        this.a = {
          r: a.r ? s(t, a.r, 0, degToRads, r) : i,
          rx: a.rx ? s(t, a.rx, 0, degToRads, r) : i,
          ry: a.ry ? s(t, a.ry, 0, degToRads, r) : i,
          sk: a.sk ? s(t, a.sk, 0, degToRads, r) : i,
          sa: a.sa ? s(t, a.sa, 0, degToRads, r) : i,
          s: a.s ? s(t, a.s, 1, .01, r) : i,
          a: a.a ? s(t, a.a, 1, 0, r) : i,
          o: a.o ? s(t, a.o, 0, .01, r) : i,
          p: a.p ? s(t, a.p, 1, 0, r) : i,
          sw: a.sw ? s(t, a.sw, 0, 0, r) : i,
          sc: a.sc ? s(t, a.sc, 1, 0, r) : i,
          fc: a.fc ? s(t, a.fc, 1, 0, r) : i,
          fh: a.fh ? s(t, a.fh, 0, 0, r) : i,
          fs: a.fs ? s(t, a.fs, 0, .01, r) : i,
          fb: a.fb ? s(t, a.fb, 0, .01, r) : i,
          t: a.t ? s(t, a.t, 0, 0, r) : i
        }, this.s = TextSelectorProp.getTextSelectorProp(t, e.s, r), this.s.t = e.s.t;
      }
      function LetterProps(t, e, r, i, s, a) {
        this.o = t, this.sw = e, this.sc = r, this.fc = i, this.m = s, this.p = a, this._mdf = {
          o: !0,
          sw: !!e,
          sc: !!r,
          fc: !!i,
          m: !0,
          p: !0
        };
      }
      function TextProperty(t, e) {
        this._frameId = initialDefaultFrame, this.pv = "", this.v = "", this.kf = !1, this._isFirstFrame = !0, this._mdf = !1, this.data = e, this.elem = t, this.comp = this.elem.comp, this.keysIndex = 0, this.canResize = !1, this.minimumFontSize = 1, this.effectsSequence = [], this.currentData = {
          ascent: 0,
          boxWidth: this.defaultBoxWidth,
          f: "",
          fStyle: "",
          fWeight: "",
          fc: "",
          j: "",
          justifyOffset: "",
          l: [],
          lh: 0,
          lineWidths: [],
          ls: "",
          of: "",
          s: "",
          sc: "",
          sw: 0,
          t: 0,
          tr: 0,
          sz: 0,
          ps: null,
          fillColorAnim: !1,
          strokeColorAnim: !1,
          strokeWidthAnim: !1,
          yOffset: 0,
          finalSize: 0,
          finalText: [],
          finalLineHeight: 0,
          __complete: !1
        }, this.copyData(this.currentData, this.data.d.k[0].s), this.searchProperty() || this.completeTextData(this.currentData);
      }
      TextAnimatorProperty.prototype.searchProperties = function () {
        var t,
          e,
          r = this._textData.a.length,
          i = PropertyFactory.getProp;
        for (t = 0; t < r; t += 1) {
          e = this._textData.a[t], this._animatorsData[t] = new TextAnimatorDataProperty(this._elem, e, this);
        }
        this._textData.p && "m" in this._textData.p ? (this._pathData = {
          f: i(this._elem, this._textData.p.f, 0, 0, this),
          l: i(this._elem, this._textData.p.l, 0, 0, this),
          r: this._textData.p.r,
          m: this._elem.maskManager.getMaskProperty(this._textData.p.m)
        }, this._hasMaskedPath = !0) : this._hasMaskedPath = !1, this._moreOptions.alignment = i(this._elem, this._textData.m.a, 1, 0, this);
      }, TextAnimatorProperty.prototype.getMeasures = function (t, e) {
        if (this.lettersChangedFlag = e, this._mdf || this._isFirstFrame || e || this._hasMaskedPath && this._pathData.m._mdf) {
          this._isFirstFrame = !1;
          var r,
            i,
            s,
            a,
            n,
            o,
            h,
            l,
            p,
            f,
            m,
            c,
            d,
            u,
            y,
            g,
            v,
            b,
            P,
            _ = this._moreOptions.alignment.v,
            x = this._animatorsData,
            S = this._textData,
            E = this.mHelper,
            T = this._renderType,
            C = this.renderedLetters.length,
            A = (this.data, t.l);
          if (this._hasMaskedPath) {
            if (P = this._pathData.m, !this._pathData.n || this._pathData._mdf) {
              var k,
                D = P.v;
              for (this._pathData.r && (D = D.reverse()), n = {
                tLength: 0,
                segments: []
              }, a = D._length - 1, g = 0, s = 0; s < a; s += 1) {
                k = bez.buildBezierData(D.v[s], D.v[s + 1], [D.o[s][0] - D.v[s][0], D.o[s][1] - D.v[s][1]], [D.i[s + 1][0] - D.v[s + 1][0], D.i[s + 1][1] - D.v[s + 1][1]]), n.tLength += k.segmentLength, n.segments.push(k), g += k.segmentLength;
              }
              s = a, P.v.c && (k = bez.buildBezierData(D.v[s], D.v[0], [D.o[s][0] - D.v[s][0], D.o[s][1] - D.v[s][1]], [D.i[0][0] - D.v[0][0], D.i[0][1] - D.v[0][1]]), n.tLength += k.segmentLength, n.segments.push(k), g += k.segmentLength), this._pathData.pi = n;
            }
            if (n = this._pathData.pi, o = this._pathData.f.v, m = 0, f = 1, l = 0, p = !0, u = n.segments, o < 0 && P.v.c) for (n.tLength < Math.abs(o) && (o = -Math.abs(o) % n.tLength), f = (d = u[m = u.length - 1].points).length - 1; o < 0;) {
              o += d[f].partialLength, (f -= 1) < 0 && (f = (d = u[m -= 1].points).length - 1);
            }
            c = (d = u[m].points)[f - 1], y = (h = d[f]).partialLength;
          }
          a = A.length, r = 0, i = 0;
          var M,
            I,
            w,
            F,
            R = 1.2 * t.finalSize * .714,
            V = !0;
          w = x.length;
          var L,
            O,
            z,
            B,
            N,
            G,
            j,
            q,
            H,
            W,
            Y,
            X,
            K,
            $ = -1,
            J = o,
            U = m,
            Z = f,
            Q = -1,
            tt = "",
            et = this.defaultPropsArray;
          if (2 === t.j || 1 === t.j) {
            var rt = 0,
              it = 0,
              st = 2 === t.j ? -.5 : -1,
              at = 0,
              nt = !0;
            for (s = 0; s < a; s += 1) {
              if (A[s].n) {
                for (rt && (rt += it); at < s;) {
                  A[at].animatorJustifyOffset = rt, at += 1;
                }
                rt = 0, nt = !0;
              } else {
                for (I = 0; I < w; I += 1) {
                  (M = x[I].a).t.propType && (nt && 2 === t.j && (it += M.t.v * st), (L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars)).length ? rt += M.t.v * L[0] * st : rt += M.t.v * L * st);
                }
                nt = !1;
              }
            }
            for (rt && (rt += it); at < s;) {
              A[at].animatorJustifyOffset = rt, at += 1;
            }
          }
          for (s = 0; s < a; s += 1) {
            if (E.reset(), N = 1, A[s].n) r = 0, i += t.yOffset, i += V ? 1 : 0, o = J, V = !1, 0, this._hasMaskedPath && (f = Z, c = (d = u[m = U].points)[f - 1], y = (h = d[f]).partialLength, l = 0), K = W = X = tt = "", et = this.defaultPropsArray;else {
              if (this._hasMaskedPath) {
                if (Q !== A[s].line) {
                  switch (t.j) {
                    case 1:
                      o += g - t.lineWidths[A[s].line];
                      break;
                    case 2:
                      o += (g - t.lineWidths[A[s].line]) / 2;
                  }
                  Q = A[s].line;
                }
                $ !== A[s].ind && (A[$] && (o += A[$].extra), o += A[s].an / 2, $ = A[s].ind), o += _[0] * A[s].an / 200;
                var ot = 0;
                for (I = 0; I < w; I += 1) {
                  (M = x[I].a).p.propType && ((L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars)).length ? ot += M.p.v[0] * L[0] : ot += M.p.v[0] * L), M.a.propType && ((L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars)).length ? ot += M.a.v[0] * L[0] : ot += M.a.v[0] * L);
                }
                for (p = !0; p;) {
                  l + y >= o + ot || !d ? (v = (o + ot - l) / h.partialLength, z = c.point[0] + (h.point[0] - c.point[0]) * v, B = c.point[1] + (h.point[1] - c.point[1]) * v, E.translate(-_[0] * A[s].an / 200, -_[1] * R / 100), p = !1) : d && (l += h.partialLength, (f += 1) >= d.length && (f = 0, u[m += 1] ? d = u[m].points : P.v.c ? (f = 0, d = u[m = 0].points) : (l -= h.partialLength, d = null)), d && (c = h, y = (h = d[f]).partialLength));
                }
                O = A[s].an / 2 - A[s].add, E.translate(-O, 0, 0);
              } else O = A[s].an / 2 - A[s].add, E.translate(-O, 0, 0), E.translate(-_[0] * A[s].an / 200, -_[1] * R / 100, 0);
              for (A[s].l / 2, I = 0; I < w; I += 1) {
                (M = x[I].a).t.propType && (L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars), 0 === r && 0 === t.j || (this._hasMaskedPath ? L.length ? o += M.t.v * L[0] : o += M.t.v * L : L.length ? r += M.t.v * L[0] : r += M.t.v * L));
              }
              for (A[s].l / 2, t.strokeWidthAnim && (j = t.sw || 0), t.strokeColorAnim && (G = t.sc ? [t.sc[0], t.sc[1], t.sc[2]] : [0, 0, 0]), t.fillColorAnim && t.fc && (q = [t.fc[0], t.fc[1], t.fc[2]]), I = 0; I < w; I += 1) {
                (M = x[I].a).a.propType && ((L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars)).length ? E.translate(-M.a.v[0] * L[0], -M.a.v[1] * L[1], M.a.v[2] * L[2]) : E.translate(-M.a.v[0] * L, -M.a.v[1] * L, M.a.v[2] * L));
              }
              for (I = 0; I < w; I += 1) {
                (M = x[I].a).s.propType && ((L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars)).length ? E.scale(1 + (M.s.v[0] - 1) * L[0], 1 + (M.s.v[1] - 1) * L[1], 1) : E.scale(1 + (M.s.v[0] - 1) * L, 1 + (M.s.v[1] - 1) * L, 1));
              }
              for (I = 0; I < w; I += 1) {
                if (M = x[I].a, L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars), M.sk.propType && (L.length ? E.skewFromAxis(-M.sk.v * L[0], M.sa.v * L[1]) : E.skewFromAxis(-M.sk.v * L, M.sa.v * L)), M.r.propType && (L.length ? E.rotateZ(-M.r.v * L[2]) : E.rotateZ(-M.r.v * L)), M.ry.propType && (L.length ? E.rotateY(M.ry.v * L[1]) : E.rotateY(M.ry.v * L)), M.rx.propType && (L.length ? E.rotateX(M.rx.v * L[0]) : E.rotateX(M.rx.v * L)), M.o.propType && (L.length ? N += (M.o.v * L[0] - N) * L[0] : N += (M.o.v * L - N) * L), t.strokeWidthAnim && M.sw.propType && (L.length ? j += M.sw.v * L[0] : j += M.sw.v * L), t.strokeColorAnim && M.sc.propType) for (H = 0; H < 3; H += 1) {
                  L.length ? G[H] = G[H] + (M.sc.v[H] - G[H]) * L[0] : G[H] = G[H] + (M.sc.v[H] - G[H]) * L;
                }
                if (t.fillColorAnim && t.fc) {
                  if (M.fc.propType) for (H = 0; H < 3; H += 1) {
                    L.length ? q[H] = q[H] + (M.fc.v[H] - q[H]) * L[0] : q[H] = q[H] + (M.fc.v[H] - q[H]) * L;
                  }
                  M.fh.propType && (q = L.length ? addHueToRGB(q, M.fh.v * L[0]) : addHueToRGB(q, M.fh.v * L)), M.fs.propType && (q = L.length ? addSaturationToRGB(q, M.fs.v * L[0]) : addSaturationToRGB(q, M.fs.v * L)), M.fb.propType && (q = L.length ? addBrightnessToRGB(q, M.fb.v * L[0]) : addBrightnessToRGB(q, M.fb.v * L));
                }
              }
              for (I = 0; I < w; I += 1) {
                (M = x[I].a).p.propType && (L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars), this._hasMaskedPath ? L.length ? E.translate(0, M.p.v[1] * L[0], -M.p.v[2] * L[1]) : E.translate(0, M.p.v[1] * L, -M.p.v[2] * L) : L.length ? E.translate(M.p.v[0] * L[0], M.p.v[1] * L[1], -M.p.v[2] * L[2]) : E.translate(M.p.v[0] * L, M.p.v[1] * L, -M.p.v[2] * L));
              }
              if (t.strokeWidthAnim && (W = j < 0 ? 0 : j), t.strokeColorAnim && (Y = "rgb(" + Math.round(255 * G[0]) + "," + Math.round(255 * G[1]) + "," + Math.round(255 * G[2]) + ")"), t.fillColorAnim && t.fc && (X = "rgb(" + Math.round(255 * q[0]) + "," + Math.round(255 * q[1]) + "," + Math.round(255 * q[2]) + ")"), this._hasMaskedPath) {
                if (E.translate(0, -t.ls), E.translate(0, _[1] * R / 100 + i, 0), S.p.p) {
                  b = (h.point[1] - c.point[1]) / (h.point[0] - c.point[0]);
                  var ht = 180 * Math.atan(b) / Math.PI;
                  h.point[0] < c.point[0] && (ht += 180), E.rotate(-ht * Math.PI / 180);
                }
                E.translate(z, B, 0), o -= _[0] * A[s].an / 200, A[s + 1] && $ !== A[s + 1].ind && (o += A[s].an / 2, o += t.tr / 1e3 * t.finalSize);
              } else {
                switch (E.translate(r, i, 0), t.ps && E.translate(t.ps[0], t.ps[1] + t.ascent, 0), t.j) {
                  case 1:
                    E.translate(A[s].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[A[s].line]), 0, 0);
                    break;
                  case 2:
                    E.translate(A[s].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[A[s].line]) / 2, 0, 0);
                }
                E.translate(0, -t.ls), E.translate(O, 0, 0), E.translate(_[0] * A[s].an / 200, _[1] * R / 100, 0), r += A[s].l + t.tr / 1e3 * t.finalSize;
              }
              "html" === T ? tt = E.toCSS() : "svg" === T ? tt = E.to2dCSS() : et = [E.props[0], E.props[1], E.props[2], E.props[3], E.props[4], E.props[5], E.props[6], E.props[7], E.props[8], E.props[9], E.props[10], E.props[11], E.props[12], E.props[13], E.props[14], E.props[15]], K = N;
            }
            C <= s ? (F = new LetterProps(K, W, Y, X, tt, et), this.renderedLetters.push(F), C += 1, this.lettersChangedFlag = !0) : (F = this.renderedLetters[s], this.lettersChangedFlag = F.update(K, W, Y, X, tt, et) || this.lettersChangedFlag);
          }
        }
      }, TextAnimatorProperty.prototype.getValue = function () {
        this._elem.globalData.frameId !== this._frameId && (this._frameId = this._elem.globalData.frameId, this.iterateDynamicProperties());
      }, TextAnimatorProperty.prototype.mHelper = new Matrix(), TextAnimatorProperty.prototype.defaultPropsArray = [], extendPrototype([DynamicPropertyContainer], TextAnimatorProperty), LetterProps.prototype.update = function (t, e, r, i, s, a) {
        this._mdf.o = !1, this._mdf.sw = !1, this._mdf.sc = !1, this._mdf.fc = !1, this._mdf.m = !1, this._mdf.p = !1;
        var n = !1;
        return this.o !== t && (this.o = t, this._mdf.o = !0, n = !0), this.sw !== e && (this.sw = e, this._mdf.sw = !0, n = !0), this.sc !== r && (this.sc = r, this._mdf.sc = !0, n = !0), this.fc !== i && (this.fc = i, this._mdf.fc = !0, n = !0), this.m !== s && (this.m = s, this._mdf.m = !0, n = !0), !a.length || this.p[0] === a[0] && this.p[1] === a[1] && this.p[4] === a[4] && this.p[5] === a[5] && this.p[12] === a[12] && this.p[13] === a[13] || (this.p = a, this._mdf.p = !0, n = !0), n;
      }, TextProperty.prototype.defaultBoxWidth = [0, 0], TextProperty.prototype.copyData = function (t, e) {
        for (var r in e) {
          e.hasOwnProperty(r) && (t[r] = e[r]);
        }
        return t;
      }, TextProperty.prototype.setCurrentData = function (t) {
        t.__complete || this.completeTextData(t), this.currentData = t, this.currentData.boxWidth = this.currentData.boxWidth || this.defaultBoxWidth, this._mdf = !0;
      }, TextProperty.prototype.searchProperty = function () {
        return this.searchKeyframes();
      }, TextProperty.prototype.searchKeyframes = function () {
        return this.kf = this.data.d.k.length > 1, this.kf && this.addEffect(this.getKeyframeValue.bind(this)), this.kf;
      }, TextProperty.prototype.addEffect = function (t) {
        this.effectsSequence.push(t), this.elem.addDynamicProperty(this);
      }, TextProperty.prototype.getValue = function (t) {
        if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length || t) {
          this.currentData.t = this.data.d.k[this.keysIndex].s.t;
          var e = this.currentData,
            r = this.keysIndex;
          if (this.lock) this.setCurrentData(this.currentData);else {
            this.lock = !0, this._mdf = !1;
            var i,
              s = this.effectsSequence.length,
              a = t || this.data.d.k[this.keysIndex].s;
            for (i = 0; i < s; i += 1) {
              a = r !== this.keysIndex ? this.effectsSequence[i](a, a.t) : this.effectsSequence[i](this.currentData, a.t);
            }
            e !== a && this.setCurrentData(a), this.pv = this.v = this.currentData, this.lock = !1, this.frameId = this.elem.globalData.frameId;
          }
        }
      }, TextProperty.prototype.getKeyframeValue = function () {
        for (var t = this.data.d.k, e = this.elem.comp.renderedFrame, r = 0, i = t.length; r <= i - 1 && (t[r].s, !(r === i - 1 || t[r + 1].t > e));) {
          r += 1;
        }
        return this.keysIndex !== r && (this.keysIndex = r), this.data.d.k[this.keysIndex].s;
      }, TextProperty.prototype.buildFinalText = function (t) {
        for (var e, r = FontManager.getCombinedCharacterCodes(), i = [], s = 0, a = t.length; s < a;) {
          e = t.charCodeAt(s), -1 !== r.indexOf(e) ? i[i.length - 1] += t.charAt(s) : e >= 55296 && e <= 56319 && (e = t.charCodeAt(s + 1)) >= 56320 && e <= 57343 ? (i.push(t.substr(s, 2)), ++s) : i.push(t.charAt(s)), s += 1;
        }
        return i;
      }, TextProperty.prototype.completeTextData = function (t) {
        t.__complete = !0;
        var e,
          r,
          i,
          s,
          a,
          n,
          o,
          h = this.elem.globalData.fontManager,
          l = this.data,
          p = [],
          f = 0,
          m = l.m.g,
          c = 0,
          d = 0,
          u = 0,
          y = [],
          g = 0,
          v = 0,
          b = h.getFontByName(t.f),
          P = 0,
          _ = b.fStyle ? b.fStyle.split(" ") : [],
          x = "normal",
          S = "normal";
        for (r = _.length, e = 0; e < r; e += 1) {
          switch (_[e].toLowerCase()) {
            case "italic":
              S = "italic";
              break;
            case "bold":
              x = "700";
              break;
            case "black":
              x = "900";
              break;
            case "medium":
              x = "500";
              break;
            case "regular":
            case "normal":
              x = "400";
              break;
            case "light":
            case "thin":
              x = "200";
          }
        }
        t.fWeight = b.fWeight || x, t.fStyle = S, t.finalSize = t.s, t.finalText = this.buildFinalText(t.t), r = t.finalText.length, t.finalLineHeight = t.lh;
        var E,
          T = t.tr / 1e3 * t.finalSize;
        if (t.sz) for (var C, A, k = !0, D = t.sz[0], M = t.sz[1]; k;) {
          C = 0, g = 0, r = (A = this.buildFinalText(t.t)).length, T = t.tr / 1e3 * t.finalSize;
          var I = -1;
          for (e = 0; e < r; e += 1) {
            E = A[e].charCodeAt(0), i = !1, " " === A[e] ? I = e : 13 !== E && 3 !== E || (g = 0, i = !0, C += t.finalLineHeight || 1.2 * t.finalSize), h.chars ? (o = h.getCharData(A[e], b.fStyle, b.fFamily), P = i ? 0 : o.w * t.finalSize / 100) : P = h.measureText(A[e], t.f, t.finalSize), g + P > D && " " !== A[e] ? (-1 === I ? r += 1 : e = I, C += t.finalLineHeight || 1.2 * t.finalSize, A.splice(e, I === e ? 1 : 0, "\r"), I = -1, g = 0) : (g += P, g += T);
          }
          C += b.ascent * t.finalSize / 100, this.canResize && t.finalSize > this.minimumFontSize && M < C ? (t.finalSize -= 1, t.finalLineHeight = t.finalSize * t.lh / t.s) : (t.finalText = A, r = t.finalText.length, k = !1);
        }
        g = -T, P = 0;
        var w,
          F = 0;
        for (e = 0; e < r; e += 1) {
          if (i = !1, E = (w = t.finalText[e]).charCodeAt(0), " " === w ? s = " " : 13 === E || 3 === E ? (F = 0, y.push(g), v = g > v ? g : v, g = -2 * T, s = "", i = !0, u += 1) : s = t.finalText[e], h.chars ? (o = h.getCharData(w, b.fStyle, h.getFontByName(t.f).fFamily), P = i ? 0 : o.w * t.finalSize / 100) : P = h.measureText(s, t.f, t.finalSize), " " === w ? F += P + T : (g += P + T + F, F = 0), p.push({
            l: P,
            an: P,
            add: c,
            n: i,
            anIndexes: [],
            val: s,
            line: u,
            animatorJustifyOffset: 0
          }), 2 == m) {
            if (c += P, "" === s || " " === s || e === r - 1) {
              for ("" !== s && " " !== s || (c -= P); d <= e;) {
                p[d].an = c, p[d].ind = f, p[d].extra = P, d += 1;
              }
              f += 1, c = 0;
            }
          } else if (3 == m) {
            if (c += P, "" === s || e === r - 1) {
              for ("" === s && (c -= P); d <= e;) {
                p[d].an = c, p[d].ind = f, p[d].extra = P, d += 1;
              }
              c = 0, f += 1;
            }
          } else p[f].ind = f, p[f].extra = 0, f += 1;
        }
        if (t.l = p, v = g > v ? g : v, y.push(g), t.sz) t.boxWidth = t.sz[0], t.justifyOffset = 0;else switch (t.boxWidth = v, t.j) {
          case 1:
            t.justifyOffset = -t.boxWidth;
            break;
          case 2:
            t.justifyOffset = -t.boxWidth / 2;
            break;
          default:
            t.justifyOffset = 0;
        }
        t.lineWidths = y;
        var R,
          V,
          L = l.a;
        n = L.length;
        var O,
          z,
          B = [];
        for (a = 0; a < n; a += 1) {
          for ((R = L[a]).a.sc && (t.strokeColorAnim = !0), R.a.sw && (t.strokeWidthAnim = !0), (R.a.fc || R.a.fh || R.a.fs || R.a.fb) && (t.fillColorAnim = !0), z = 0, O = R.s.b, e = 0; e < r; e += 1) {
            (V = p[e]).anIndexes[a] = z, (1 == O && "" !== V.val || 2 == O && "" !== V.val && " " !== V.val || 3 == O && (V.n || " " == V.val || e == r - 1) || 4 == O && (V.n || e == r - 1)) && (1 === R.s.rn && B.push(z), z += 1);
          }
          l.a[a].s.totalChars = z;
          var N,
            G = -1;
          if (1 === R.s.rn) for (e = 0; e < r; e += 1) {
            G != (V = p[e]).anIndexes[a] && (G = V.anIndexes[a], N = B.splice(Math.floor(Math.random() * B.length), 1)[0]), V.anIndexes[a] = N;
          }
        }
        t.yOffset = t.finalLineHeight || 1.2 * t.finalSize, t.ls = t.ls || 0, t.ascent = b.ascent * t.finalSize / 100;
      }, TextProperty.prototype.updateDocumentData = function (t, e) {
        e = void 0 === e ? this.keysIndex : e;
        var r = this.copyData({}, this.data.d.k[e].s);
        r = this.copyData(r, t), this.data.d.k[e].s = r, this.recalculate(e), this.elem.addDynamicProperty(this);
      }, TextProperty.prototype.recalculate = function (t) {
        var e = this.data.d.k[t].s;
        e.__complete = !1, this.keysIndex = 0, this._isFirstFrame = !0, this.getValue(e);
      }, TextProperty.prototype.canResizeFont = function (t) {
        this.canResize = t, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this);
      }, TextProperty.prototype.setMinimumFontSize = function (t) {
        this.minimumFontSize = Math.floor(t) || 1, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this);
      };
      var TextSelectorProp = function () {
          var t = Math.max,
            e = Math.min,
            r = Math.floor;
          function i(t, e) {
            this._currentTextLength = -1, this.k = !1, this.data = e, this.elem = t, this.comp = t.comp, this.finalS = 0, this.finalE = 0, this.initDynamicPropertyContainer(t), this.s = PropertyFactory.getProp(t, e.s || {
              k: 0
            }, 0, 0, this), this.e = "e" in e ? PropertyFactory.getProp(t, e.e, 0, 0, this) : {
              v: 100
            }, this.o = PropertyFactory.getProp(t, e.o || {
              k: 0
            }, 0, 0, this), this.xe = PropertyFactory.getProp(t, e.xe || {
              k: 0
            }, 0, 0, this), this.ne = PropertyFactory.getProp(t, e.ne || {
              k: 0
            }, 0, 0, this), this.a = PropertyFactory.getProp(t, e.a, 0, .01, this), this.dynamicProperties.length || this.getValue();
          }
          return i.prototype = {
            getMult: function getMult(i) {
              this._currentTextLength !== this.elem.textProperty.currentData.l.length && this.getValue();
              var s = BezierFactory.getBezierEasing(this.ne.v / 100, 0, 1 - this.xe.v / 100, 1).get,
                a = 0,
                n = this.finalS,
                o = this.finalE,
                h = this.data.sh;
              if (2 == h) a = s(a = o === n ? i >= o ? 1 : 0 : t(0, e(.5 / (o - n) + (i - n) / (o - n), 1)));else if (3 == h) a = s(a = o === n ? i >= o ? 0 : 1 : 1 - t(0, e(.5 / (o - n) + (i - n) / (o - n), 1)));else if (4 == h) o === n ? a = 0 : (a = t(0, e(.5 / (o - n) + (i - n) / (o - n), 1))) < .5 ? a *= 2 : a = 1 - 2 * (a - .5), a = s(a);else if (5 == h) {
                if (o === n) a = 0;else {
                  var l = o - n,
                    p = -l / 2 + (i = e(t(0, i + .5 - n), o - n)),
                    f = l / 2;
                  a = Math.sqrt(1 - p * p / (f * f));
                }
                a = s(a);
              } else 6 == h ? (o === n ? a = 0 : (i = e(t(0, i + .5 - n), o - n), a = (1 + Math.cos(Math.PI + 2 * Math.PI * i / (o - n))) / 2), a = s(a)) : (i >= r(n) && (a = i - n < 0 ? 1 - (n - i) : t(0, e(o - i, 1))), a = s(a));
              return a * this.a.v;
            },
            getValue: function getValue(t) {
              this.iterateDynamicProperties(), this._mdf = t || this._mdf, this._currentTextLength = this.elem.textProperty.currentData.l.length || 0, t && 2 === this.data.r && (this.e.v = this._currentTextLength);
              var e = 2 === this.data.r ? 1 : 100 / this.data.totalChars,
                r = this.o.v / e,
                i = this.s.v / e + r,
                s = this.e.v / e + r;
              if (i > s) {
                var a = i;
                i = s, s = a;
              }
              this.finalS = i, this.finalE = s;
            }
          }, extendPrototype([DynamicPropertyContainer], i), {
            getTextSelectorProp: function getTextSelectorProp(t, e, r) {
              return new i(t, e, r);
            }
          };
        }(),
        pool_factory = function pool_factory(t, e, r, i) {
          var s = 0,
            a = t,
            n = createSizedArray(a);
          function o() {
            return s ? n[s -= 1] : e();
          }
          return {
            newElement: o,
            release: function release(t) {
              s === a && (n = pooling.double(n), a *= 2), r && r(t), n[s] = t, s += 1;
            }
          };
        },
        pooling = {
          double: function double(t) {
            return t.concat(createSizedArray(t.length));
          }
        },
        point_pool = pool_factory(8, function () {
          return createTypedArray("float32", 2);
        }),
        shape_pool = (factory = pool_factory(4, function () {
          return new ShapePath();
        }, function (t) {
          var e,
            r = t._length;
          for (e = 0; e < r; e += 1) {
            point_pool.release(t.v[e]), point_pool.release(t.i[e]), point_pool.release(t.o[e]), t.v[e] = null, t.i[e] = null, t.o[e] = null;
          }
          t._length = 0, t.c = !1;
        }), factory.clone = function (t) {
          var e,
            r = factory.newElement(),
            i = void 0 === t._length ? t.v.length : t._length;
          for (r.setLength(i), r.c = t.c, e = 0; e < i; e += 1) {
            r.setTripleAt(t.v[e][0], t.v[e][1], t.o[e][0], t.o[e][1], t.i[e][0], t.i[e][1], e);
          }
          return r;
        }, factory),
        factory,
        shapeCollection_pool = function () {
          var t = {
              newShapeCollection: function newShapeCollection() {
                var t;
                t = e ? i[e -= 1] : new ShapeCollection();
                return t;
              },
              release: function release(t) {
                var s,
                  a = t._length;
                for (s = 0; s < a; s += 1) {
                  shape_pool.release(t.shapes[s]);
                }
                t._length = 0, e === r && (i = pooling.double(i), r *= 2);
                i[e] = t, e += 1;
              }
            },
            e = 0,
            r = 4,
            i = createSizedArray(r);
          return t;
        }(),
        segments_length_pool = pool_factory(8, function () {
          return {
            lengths: [],
            totalLength: 0
          };
        }, function (t) {
          var e,
            r = t.lengths.length;
          for (e = 0; e < r; e += 1) {
            bezier_length_pool.release(t.lengths[e]);
          }
          t.lengths.length = 0;
        }),
        bezier_length_pool = pool_factory(8, function () {
          return {
            addedLength: 0,
            percents: createTypedArray("float32", defaultCurveSegments),
            lengths: createTypedArray("float32", defaultCurveSegments)
          };
        });
      function BaseRenderer() {}
      function SVGRenderer(t, e) {
        this.animationItem = t, this.layers = null, this.renderedFrame = -1, this.svgElement = createNS("svg");
        var r = "";
        if (e && e.title) {
          var i = createNS("title"),
            s = createElementID();
          i.setAttribute("id", s), i.textContent = e.title, this.svgElement.appendChild(i), r += s;
        }
        if (e && e.description) {
          var a = createNS("desc"),
            n = createElementID();
          a.setAttribute("id", n), a.textContent = e.description, this.svgElement.appendChild(a), r += " " + n;
        }
        r && this.svgElement.setAttribute("aria-labelledby", r);
        var o = createNS("defs");
        this.svgElement.appendChild(o);
        var h = createNS("g");
        this.svgElement.appendChild(h), this.layerElement = h, this.renderConfig = {
          preserveAspectRatio: e && e.preserveAspectRatio || "xMidYMid meet",
          imagePreserveAspectRatio: e && e.imagePreserveAspectRatio || "xMidYMid slice",
          progressiveLoad: e && e.progressiveLoad || !1,
          hideOnTransparent: !e || !1 !== e.hideOnTransparent,
          viewBoxOnly: e && e.viewBoxOnly || !1,
          viewBoxSize: e && e.viewBoxSize || !1,
          className: e && e.className || ""
        }, this.globalData = {
          _mdf: !1,
          frameNum: -1,
          defs: o,
          renderConfig: this.renderConfig
        }, this.elements = [], this.pendingElements = [], this.destroyed = !1, this.rendererType = "svg";
      }
      function CanvasRenderer(t, e) {
        this.animationItem = t, this.renderConfig = {
          clearCanvas: !e || void 0 === e.clearCanvas || e.clearCanvas,
          context: e && e.context || null,
          progressiveLoad: e && e.progressiveLoad || !1,
          preserveAspectRatio: e && e.preserveAspectRatio || "xMidYMid meet",
          imagePreserveAspectRatio: e && e.imagePreserveAspectRatio || "xMidYMid slice",
          className: e && e.className || ""
        }, this.renderConfig.dpr = e && e.dpr || 1, this.animationItem.wrapper && (this.renderConfig.dpr = e && e.dpr || window.devicePixelRatio || 1), this.renderedFrame = -1, this.globalData = {
          frameNum: -1,
          _mdf: !1,
          renderConfig: this.renderConfig,
          currentGlobalAlpha: -1
        }, this.contextData = new CVContextData(), this.elements = [], this.pendingElements = [], this.transformMat = new Matrix(), this.completeLayers = !1, this.rendererType = "canvas";
      }
      function MaskElement(t, e, r) {
        this.data = t, this.element = e, this.globalData = r, this.storedData = [], this.masksProperties = this.data.masksProperties || [], this.maskElement = null;
        var i,
          s = this.globalData.defs,
          a = this.masksProperties ? this.masksProperties.length : 0;
        this.viewData = createSizedArray(a), this.solidPath = "";
        var n,
          o,
          h,
          l,
          p,
          f,
          m,
          c = this.masksProperties,
          d = 0,
          u = [],
          y = createElementID(),
          g = "clipPath",
          v = "clip-path";
        for (i = 0; i < a; i++) {
          if (("a" !== c[i].mode && "n" !== c[i].mode || c[i].inv || 100 !== c[i].o.k || c[i].o.x) && (g = "mask", v = "mask"), "s" != c[i].mode && "i" != c[i].mode || 0 !== d ? l = null : ((l = createNS("rect")).setAttribute("fill", "#ffffff"), l.setAttribute("width", this.element.comp.data.w || 0), l.setAttribute("height", this.element.comp.data.h || 0), u.push(l)), n = createNS("path"), "n" != c[i].mode) {
            var b;
            if (d += 1, n.setAttribute("fill", "s" === c[i].mode ? "#000000" : "#ffffff"), n.setAttribute("clip-rule", "nonzero"), 0 !== c[i].x.k ? (g = "mask", v = "mask", m = PropertyFactory.getProp(this.element, c[i].x, 0, null, this.element), b = createElementID(), (p = createNS("filter")).setAttribute("id", b), (f = createNS("feMorphology")).setAttribute("operator", "erode"), f.setAttribute("in", "SourceGraphic"), f.setAttribute("radius", "0"), p.appendChild(f), s.appendChild(p), n.setAttribute("stroke", "s" === c[i].mode ? "#000000" : "#ffffff")) : (f = null, m = null), this.storedData[i] = {
              elem: n,
              x: m,
              expan: f,
              lastPath: "",
              lastOperator: "",
              filterId: b,
              lastRadius: 0
            }, "i" == c[i].mode) {
              h = u.length;
              var P = createNS("g");
              for (o = 0; o < h; o += 1) {
                P.appendChild(u[o]);
              }
              var _ = createNS("mask");
              _.setAttribute("mask-type", "alpha"), _.setAttribute("id", y + "_" + d), _.appendChild(n), s.appendChild(_), P.setAttribute("mask", "url(" + locationHref + "#" + y + "_" + d + ")"), u.length = 0, u.push(P);
            } else u.push(n);
            c[i].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()), this.viewData[i] = {
              elem: n,
              lastPath: "",
              op: PropertyFactory.getProp(this.element, c[i].o, 0, .01, this.element),
              prop: ShapePropertyFactory.getShapeProp(this.element, c[i], 3),
              invRect: l
            }, this.viewData[i].prop.k || this.drawPath(c[i], this.viewData[i].prop.v, this.viewData[i]);
          } else this.viewData[i] = {
            op: PropertyFactory.getProp(this.element, c[i].o, 0, .01, this.element),
            prop: ShapePropertyFactory.getShapeProp(this.element, c[i], 3),
            elem: n,
            lastPath: ""
          }, s.appendChild(n);
        }
        for (this.maskElement = createNS(g), a = u.length, i = 0; i < a; i += 1) {
          this.maskElement.appendChild(u[i]);
        }
        d > 0 && (this.maskElement.setAttribute("id", y), this.element.maskedElement.setAttribute(v, "url(" + locationHref + "#" + y + ")"), s.appendChild(this.maskElement)), this.viewData.length && this.element.addRenderableComponent(this);
      }
      function HierarchyElement() {}
      function FrameElement() {}
      function TransformElement() {}
      function RenderableElement() {}
      function RenderableDOMElement() {}
      function ProcessedElement(t, e) {
        this.elem = t, this.pos = e;
      }
      function SVGShapeData(t, e, r) {
        this.caches = [], this.styles = [], this.transformers = t, this.lStr = "", this.sh = r, this.lvl = e, this._isAnimated = !!r.k;
        for (var i = 0, s = t.length; i < s;) {
          if (t[i].mProps.dynamicProperties.length) {
            this._isAnimated = !0;
            break;
          }
          i += 1;
        }
      }
      function ShapeGroupData() {
        this.it = [], this.prevViewData = [], this.gr = createNS("g");
      }
      function ShapeTransformManager() {
        this.sequences = {}, this.sequenceList = [], this.transform_key_count = 0;
      }
      function CVShapeData(t, e, r, i) {
        this.styledShapes = [], this.tr = [0, 0, 0, 0, 0, 0];
        var s = 4;
        "rc" == e.ty ? s = 5 : "el" == e.ty ? s = 6 : "sr" == e.ty && (s = 7), this.sh = ShapePropertyFactory.getShapeProp(t, e, s, t);
        var a,
          n,
          o = r.length;
        for (a = 0; a < o; a += 1) {
          r[a].closed || (n = {
            transforms: i.addTransformSequence(r[a].transforms),
            trNodes: []
          }, this.styledShapes.push(n), r[a].elements.push(n));
        }
      }
      function BaseElement() {}
      function NullElement(t, e, r) {
        this.initFrame(), this.initBaseData(t, e, r), this.initFrame(), this.initTransform(t, e, r), this.initHierarchy();
      }
      function SVGBaseElement() {}
      function IShapeElement() {}
      function ITextElement() {}
      function ICompElement() {}
      function IImageElement(t, e, r) {
        this.assetData = e.getAssetData(t.refId), this.initElement(t, e, r), this.sourceRect = {
          top: 0,
          left: 0,
          width: this.assetData.w,
          height: this.assetData.h
        };
      }
      function ISolidElement(t, e, r) {
        this.initElement(t, e, r);
      }
      function SVGShapeElement(t, e, r) {
        this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.shapeModifiers = [], this.itemsData = [], this.processedElements = [], this.animatedContents = [], this.initElement(t, e, r), this.prevViewData = [];
      }
      function CVContextData() {
        this.saved = [], this.cArrPos = 0, this.cTr = new Matrix(), this.cO = 1;
        var t;
        for (this.savedOp = createTypedArray("float32", 15), t = 0; t < 15; t += 1) {
          this.saved[t] = createTypedArray("float32", 16);
        }
        this._length = 15;
      }
      function CVBaseElement() {}
      function CVImageElement(t, e, r) {
        this.assetData = e.getAssetData(t.refId), this.img = e.imageLoader.getImage(this.assetData), this.initElement(t, e, r);
      }
      function CVCompElement(t, e, r) {
        this.completeLayers = !1, this.layers = t.layers, this.pendingElements = [], this.elements = createSizedArray(this.layers.length), this.initElement(t, e, r), this.tm = t.tm ? PropertyFactory.getProp(this, t.tm, 0, e.frameRate, this) : {
          _placeholder: !0
        };
      }
      function CVMaskElement(t, e) {
        this.data = t, this.element = e, this.masksProperties = this.data.masksProperties || [], this.viewData = createSizedArray(this.masksProperties.length);
        var r,
          i = this.masksProperties.length,
          s = !1;
        for (r = 0; r < i; r++) {
          "n" !== this.masksProperties[r].mode && (s = !0), this.viewData[r] = ShapePropertyFactory.getShapeProp(this.element, this.masksProperties[r], 3);
        }
        this.hasMasks = s, s && this.element.addRenderableComponent(this);
      }
      function CVShapeElement(t, e, r) {
        this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.itemsData = [], this.prevViewData = [], this.shapeModifiers = [], this.processedElements = [], this.transformsManager = new ShapeTransformManager(), this.initElement(t, e, r);
      }
      function CVSolidElement(t, e, r) {
        this.initElement(t, e, r);
      }
      function CVTextElement(t, e, r) {
        this.textSpans = [], this.yOffset = 0, this.fillColorAnim = !1, this.strokeColorAnim = !1, this.strokeWidthAnim = !1, this.stroke = !1, this.fill = !1, this.justifyOffset = 0, this.currentRender = null, this.renderType = "canvas", this.values = {
          fill: "rgba(0,0,0,0)",
          stroke: "rgba(0,0,0,0)",
          sWidth: 0,
          fValue: ""
        }, this.initElement(t, e, r);
      }
      function CVEffects() {}
      BaseRenderer.prototype.checkLayers = function (t) {
        var e,
          r,
          i = this.layers.length;
        for (this.completeLayers = !0, e = i - 1; e >= 0; e--) {
          this.elements[e] || (r = this.layers[e]).ip - r.st <= t - this.layers[e].st && r.op - r.st > t - this.layers[e].st && this.buildItem(e), this.completeLayers = !!this.elements[e] && this.completeLayers;
        }
        this.checkPendingElements();
      }, BaseRenderer.prototype.createItem = function (t) {
        switch (t.ty) {
          case 2:
            return this.createImage(t);
          case 0:
            return this.createComp(t);
          case 1:
            return this.createSolid(t);
          case 3:
            return this.createNull(t);
          case 4:
            return this.createShape(t);
          case 5:
            return this.createText(t);
          case 13:
            return this.createCamera(t);
        }
        return this.createNull(t);
      }, BaseRenderer.prototype.createCamera = function () {
        throw new Error("You're using a 3d camera. Try the html renderer.");
      }, BaseRenderer.prototype.buildAllItems = function () {
        var t,
          e = this.layers.length;
        for (t = 0; t < e; t += 1) {
          this.buildItem(t);
        }
        this.checkPendingElements();
      }, BaseRenderer.prototype.includeLayers = function (t) {
        this.completeLayers = !1;
        var e,
          r,
          i = t.length,
          s = this.layers.length;
        for (e = 0; e < i; e += 1) {
          for (r = 0; r < s;) {
            if (this.layers[r].id == t[e].id) {
              this.layers[r] = t[e];
              break;
            }
            r += 1;
          }
        }
      }, BaseRenderer.prototype.setProjectInterface = function (t) {
        this.globalData.projectInterface = t;
      }, BaseRenderer.prototype.initItems = function () {
        this.globalData.progressiveLoad || this.buildAllItems();
      }, BaseRenderer.prototype.buildElementParenting = function (t, e, r) {
        for (var i = this.elements, s = this.layers, a = 0, n = s.length; a < n;) {
          s[a].ind == e && (i[a] && !0 !== i[a] ? (r.push(i[a]), i[a].setAsParent(), void 0 !== s[a].parent ? this.buildElementParenting(t, s[a].parent, r) : t.setHierarchy(r)) : (this.buildItem(a), this.addPendingElement(t))), a += 1;
        }
      }, BaseRenderer.prototype.addPendingElement = function (t) {
        this.pendingElements.push(t);
      }, BaseRenderer.prototype.searchExtraCompositions = function (t) {
        var e,
          r = t.length;
        for (e = 0; e < r; e += 1) {
          if (t[e].xt) {
            var i = this.createComp(t[e]);
            i.initExpressions(), this.globalData.projectInterface.registerComposition(i);
          }
        }
      }, BaseRenderer.prototype.setupGlobalData = function (t, e) {
        this.globalData.fontManager = new FontManager(), this.globalData.fontManager.addChars(t.chars), this.globalData.fontManager.addFonts(t.fonts, e), this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem), this.globalData.imageLoader = this.animationItem.imagePreloader, this.globalData.frameId = 0, this.globalData.frameRate = t.fr, this.globalData.nm = t.nm, this.globalData.compSize = {
          w: t.w,
          h: t.h
        };
      }, extendPrototype([BaseRenderer], SVGRenderer), SVGRenderer.prototype.createNull = function (t) {
        return new NullElement(t, this.globalData, this);
      }, SVGRenderer.prototype.createShape = function (t) {
        return new SVGShapeElement(t, this.globalData, this);
      }, SVGRenderer.prototype.createText = function (t) {
        return new SVGTextElement(t, this.globalData, this);
      }, SVGRenderer.prototype.createImage = function (t) {
        return new IImageElement(t, this.globalData, this);
      }, SVGRenderer.prototype.createComp = function (t) {
        return new SVGCompElement(t, this.globalData, this);
      }, SVGRenderer.prototype.createSolid = function (t) {
        return new ISolidElement(t, this.globalData, this);
      }, SVGRenderer.prototype.configAnimation = function (t) {
        this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.renderConfig.viewBoxSize ? this.svgElement.setAttribute("viewBox", this.renderConfig.viewBoxSize) : this.svgElement.setAttribute("viewBox", "0 0 " + t.w + " " + t.h), this.renderConfig.viewBoxOnly || (this.svgElement.setAttribute("width", t.w), this.svgElement.setAttribute("height", t.h), this.svgElement.style.width = "100%", this.svgElement.style.height = "100%", this.svgElement.style.transform = "translate3d(0,0,0)"), this.renderConfig.className && this.svgElement.setAttribute("class", this.renderConfig.className), this.svgElement.setAttribute("preserveAspectRatio", this.renderConfig.preserveAspectRatio), this.animationItem.wrapper.appendChild(this.svgElement);
        var e = this.globalData.defs;
        this.setupGlobalData(t, e), this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.data = t;
        var r = createNS("clipPath"),
          i = createNS("rect");
        i.setAttribute("width", t.w), i.setAttribute("height", t.h), i.setAttribute("x", 0), i.setAttribute("y", 0);
        var s = createElementID();
        r.setAttribute("id", s), r.appendChild(i), this.layerElement.setAttribute("clip-path", "url(" + locationHref + "#" + s + ")"), e.appendChild(r), this.layers = t.layers, this.elements = createSizedArray(t.layers.length);
      }, SVGRenderer.prototype.destroy = function () {
        this.animationItem.wrapper.innerHTML = "", this.layerElement = null, this.globalData.defs = null;
        var t,
          e = this.layers ? this.layers.length : 0;
        for (t = 0; t < e; t++) {
          this.elements[t] && this.elements[t].destroy();
        }
        this.elements.length = 0, this.destroyed = !0, this.animationItem = null;
      }, SVGRenderer.prototype.updateContainerSize = function () {}, SVGRenderer.prototype.buildItem = function (t) {
        var e = this.elements;
        if (!e[t] && 99 != this.layers[t].ty) {
          e[t] = !0;
          var r = this.createItem(this.layers[t]);
          e[t] = r, expressionsPlugin && (0 === this.layers[t].ty && this.globalData.projectInterface.registerComposition(r), r.initExpressions()), this.appendElementInPos(r, t), this.layers[t].tt && (this.elements[t - 1] && !0 !== this.elements[t - 1] ? r.setMatte(e[t - 1].layerId) : (this.buildItem(t - 1), this.addPendingElement(r)));
        }
      }, SVGRenderer.prototype.checkPendingElements = function () {
        for (; this.pendingElements.length;) {
          var t = this.pendingElements.pop();
          if (t.checkParenting(), t.data.tt) for (var e = 0, r = this.elements.length; e < r;) {
            if (this.elements[e] === t) {
              t.setMatte(this.elements[e - 1].layerId);
              break;
            }
            e += 1;
          }
        }
      }, SVGRenderer.prototype.renderFrame = function (t) {
        if (this.renderedFrame !== t && !this.destroyed) {
          null === t ? t = this.renderedFrame : this.renderedFrame = t, this.globalData.frameNum = t, this.globalData.frameId += 1, this.globalData.projectInterface.currentFrame = t, this.globalData._mdf = !1;
          var e,
            r = this.layers.length;
          for (this.completeLayers || this.checkLayers(t), e = r - 1; e >= 0; e--) {
            (this.completeLayers || this.elements[e]) && this.elements[e].prepareFrame(t - this.layers[e].st);
          }
          if (this.globalData._mdf) for (e = 0; e < r; e += 1) {
            (this.completeLayers || this.elements[e]) && this.elements[e].renderFrame();
          }
        }
      }, SVGRenderer.prototype.appendElementInPos = function (t, e) {
        var r = t.getBaseElement();
        if (r) {
          for (var i, s = 0; s < e;) {
            this.elements[s] && !0 !== this.elements[s] && this.elements[s].getBaseElement() && (i = this.elements[s].getBaseElement()), s += 1;
          }
          i ? this.layerElement.insertBefore(r, i) : this.layerElement.appendChild(r);
        }
      }, SVGRenderer.prototype.hide = function () {
        this.layerElement.style.display = "none";
      }, SVGRenderer.prototype.show = function () {
        this.layerElement.style.display = "block";
      }, extendPrototype([BaseRenderer], CanvasRenderer), CanvasRenderer.prototype.createShape = function (t) {
        return new CVShapeElement(t, this.globalData, this);
      }, CanvasRenderer.prototype.createText = function (t) {
        return new CVTextElement(t, this.globalData, this);
      }, CanvasRenderer.prototype.createImage = function (t) {
        return new CVImageElement(t, this.globalData, this);
      }, CanvasRenderer.prototype.createComp = function (t) {
        return new CVCompElement(t, this.globalData, this);
      }, CanvasRenderer.prototype.createSolid = function (t) {
        return new CVSolidElement(t, this.globalData, this);
      }, CanvasRenderer.prototype.createNull = SVGRenderer.prototype.createNull, CanvasRenderer.prototype.ctxTransform = function (t) {
        if (1 !== t[0] || 0 !== t[1] || 0 !== t[4] || 1 !== t[5] || 0 !== t[12] || 0 !== t[13]) if (this.renderConfig.clearCanvas) {
          this.transformMat.cloneFromProps(t);
          var e = this.contextData.cTr.props;
          this.transformMat.transform(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]), this.contextData.cTr.cloneFromProps(this.transformMat.props);
          var r = this.contextData.cTr.props;
          this.canvasContext.setTransform(r[0], r[1], r[4], r[5], r[12], r[13]);
        } else this.canvasContext.transform(t[0], t[1], t[4], t[5], t[12], t[13]);
      }, CanvasRenderer.prototype.ctxOpacity = function (t) {
        if (!this.renderConfig.clearCanvas) return this.canvasContext.globalAlpha *= t < 0 ? 0 : t, void (this.globalData.currentGlobalAlpha = this.contextData.cO);
        this.contextData.cO *= t < 0 ? 0 : t, this.globalData.currentGlobalAlpha !== this.contextData.cO && (this.canvasContext.globalAlpha = this.contextData.cO, this.globalData.currentGlobalAlpha = this.contextData.cO);
      }, CanvasRenderer.prototype.reset = function () {
        this.renderConfig.clearCanvas ? this.contextData.reset() : this.canvasContext.restore();
      }, CanvasRenderer.prototype.save = function (t) {
        if (this.renderConfig.clearCanvas) {
          t && this.canvasContext.save();
          var e = this.contextData.cTr.props;
          this.contextData._length <= this.contextData.cArrPos && this.contextData.duplicate();
          var r,
            i = this.contextData.saved[this.contextData.cArrPos];
          for (r = 0; r < 16; r += 1) {
            i[r] = e[r];
          }
          this.contextData.savedOp[this.contextData.cArrPos] = this.contextData.cO, this.contextData.cArrPos += 1;
        } else this.canvasContext.save();
      }, CanvasRenderer.prototype.restore = function (t) {
        if (this.renderConfig.clearCanvas) {
          t && (this.canvasContext.restore(), this.globalData.blendMode = "source-over"), this.contextData.cArrPos -= 1;
          var e,
            r = this.contextData.saved[this.contextData.cArrPos],
            i = this.contextData.cTr.props;
          for (e = 0; e < 16; e += 1) {
            i[e] = r[e];
          }
          this.canvasContext.setTransform(r[0], r[1], r[4], r[5], r[12], r[13]), r = this.contextData.savedOp[this.contextData.cArrPos], this.contextData.cO = r, this.globalData.currentGlobalAlpha !== r && (this.canvasContext.globalAlpha = r, this.globalData.currentGlobalAlpha = r);
        } else this.canvasContext.restore();
      }, CanvasRenderer.prototype.configAnimation = function (t) {
        this.animationItem.wrapper ? (this.animationItem.container = createTag("canvas"), this.animationItem.container.style.width = "100%", this.animationItem.container.style.height = "100%", this.animationItem.container.style.transformOrigin = this.animationItem.container.style.mozTransformOrigin = this.animationItem.container.style.webkitTransformOrigin = this.animationItem.container.style["-webkit-transform"] = "0px 0px 0px", this.animationItem.wrapper.appendChild(this.animationItem.container), this.canvasContext = this.animationItem.container.getContext("2d"), this.renderConfig.className && this.animationItem.container.setAttribute("class", this.renderConfig.className)) : this.canvasContext = this.renderConfig.context, this.data = t, this.layers = t.layers, this.transformCanvas = {
          w: t.w,
          h: t.h,
          sx: 0,
          sy: 0,
          tx: 0,
          ty: 0
        }, this.setupGlobalData(t, document.body), this.globalData.canvasContext = this.canvasContext, this.globalData.renderer = this, this.globalData.isDashed = !1, this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.globalData.transformCanvas = this.transformCanvas, this.elements = createSizedArray(t.layers.length), this.updateContainerSize();
      }, CanvasRenderer.prototype.updateContainerSize = function () {
        var t, e, r, i;
        if (this.reset(), this.animationItem.wrapper && this.animationItem.container ? (t = this.animationItem.wrapper.offsetWidth, e = this.animationItem.wrapper.offsetHeight, this.animationItem.container.setAttribute("width", t * this.renderConfig.dpr), this.animationItem.container.setAttribute("height", e * this.renderConfig.dpr)) : (t = this.canvasContext.canvas.width * this.renderConfig.dpr, e = this.canvasContext.canvas.height * this.renderConfig.dpr), -1 !== this.renderConfig.preserveAspectRatio.indexOf("meet") || -1 !== this.renderConfig.preserveAspectRatio.indexOf("slice")) {
          var s = this.renderConfig.preserveAspectRatio.split(" "),
            a = s[1] || "meet",
            n = s[0] || "xMidYMid",
            o = n.substr(0, 4),
            h = n.substr(4);
          r = t / e, (i = this.transformCanvas.w / this.transformCanvas.h) > r && "meet" === a || i < r && "slice" === a ? (this.transformCanvas.sx = t / (this.transformCanvas.w / this.renderConfig.dpr), this.transformCanvas.sy = t / (this.transformCanvas.w / this.renderConfig.dpr)) : (this.transformCanvas.sx = e / (this.transformCanvas.h / this.renderConfig.dpr), this.transformCanvas.sy = e / (this.transformCanvas.h / this.renderConfig.dpr)), this.transformCanvas.tx = "xMid" === o && (i < r && "meet" === a || i > r && "slice" === a) ? (t - this.transformCanvas.w * (e / this.transformCanvas.h)) / 2 * this.renderConfig.dpr : "xMax" === o && (i < r && "meet" === a || i > r && "slice" === a) ? (t - this.transformCanvas.w * (e / this.transformCanvas.h)) * this.renderConfig.dpr : 0, this.transformCanvas.ty = "YMid" === h && (i > r && "meet" === a || i < r && "slice" === a) ? (e - this.transformCanvas.h * (t / this.transformCanvas.w)) / 2 * this.renderConfig.dpr : "YMax" === h && (i > r && "meet" === a || i < r && "slice" === a) ? (e - this.transformCanvas.h * (t / this.transformCanvas.w)) * this.renderConfig.dpr : 0;
        } else "none" == this.renderConfig.preserveAspectRatio ? (this.transformCanvas.sx = t / (this.transformCanvas.w / this.renderConfig.dpr), this.transformCanvas.sy = e / (this.transformCanvas.h / this.renderConfig.dpr), this.transformCanvas.tx = 0, this.transformCanvas.ty = 0) : (this.transformCanvas.sx = this.renderConfig.dpr, this.transformCanvas.sy = this.renderConfig.dpr, this.transformCanvas.tx = 0, this.transformCanvas.ty = 0);
        this.transformCanvas.props = [this.transformCanvas.sx, 0, 0, 0, 0, this.transformCanvas.sy, 0, 0, 0, 0, 1, 0, this.transformCanvas.tx, this.transformCanvas.ty, 0, 1], this.ctxTransform(this.transformCanvas.props), this.canvasContext.beginPath(), this.canvasContext.rect(0, 0, this.transformCanvas.w, this.transformCanvas.h), this.canvasContext.closePath(), this.canvasContext.clip(), this.renderFrame(this.renderedFrame, !0);
      }, CanvasRenderer.prototype.destroy = function () {
        var t;
        for (this.renderConfig.clearCanvas && (this.animationItem.wrapper.innerHTML = ""), t = (this.layers ? this.layers.length : 0) - 1; t >= 0; t -= 1) {
          this.elements[t] && this.elements[t].destroy();
        }
        this.elements.length = 0, this.globalData.canvasContext = null, this.animationItem.container = null, this.destroyed = !0;
      }, CanvasRenderer.prototype.renderFrame = function (t, e) {
        if ((this.renderedFrame !== t || !0 !== this.renderConfig.clearCanvas || e) && !this.destroyed && -1 !== t) {
          this.renderedFrame = t, this.globalData.frameNum = t - this.animationItem._isFirstFrame, this.globalData.frameId += 1, this.globalData._mdf = !this.renderConfig.clearCanvas || e, this.globalData.projectInterface.currentFrame = t;
          var r,
            i = this.layers.length;
          for (this.completeLayers || this.checkLayers(t), r = 0; r < i; r++) {
            (this.completeLayers || this.elements[r]) && this.elements[r].prepareFrame(t - this.layers[r].st);
          }
          if (this.globalData._mdf) {
            for (!0 === this.renderConfig.clearCanvas ? this.canvasContext.clearRect(0, 0, this.transformCanvas.w, this.transformCanvas.h) : this.save(), r = i - 1; r >= 0; r -= 1) {
              (this.completeLayers || this.elements[r]) && this.elements[r].renderFrame();
            }
            !0 !== this.renderConfig.clearCanvas && this.restore();
          }
        }
      }, CanvasRenderer.prototype.buildItem = function (t) {
        var e = this.elements;
        if (!e[t] && 99 != this.layers[t].ty) {
          var r = this.createItem(this.layers[t], this, this.globalData);
          e[t] = r, r.initExpressions();
        }
      }, CanvasRenderer.prototype.checkPendingElements = function () {
        for (; this.pendingElements.length;) {
          this.pendingElements.pop().checkParenting();
        }
      }, CanvasRenderer.prototype.hide = function () {
        this.animationItem.container.style.display = "none";
      }, CanvasRenderer.prototype.show = function () {
        this.animationItem.container.style.display = "block";
      }, MaskElement.prototype.getMaskProperty = function (t) {
        return this.viewData[t].prop;
      }, MaskElement.prototype.renderFrame = function (t) {
        var e,
          r = this.element.finalTransform.mat,
          i = this.masksProperties.length;
        for (e = 0; e < i; e++) {
          if ((this.viewData[e].prop._mdf || t) && this.drawPath(this.masksProperties[e], this.viewData[e].prop.v, this.viewData[e]), (this.viewData[e].op._mdf || t) && this.viewData[e].elem.setAttribute("fill-opacity", this.viewData[e].op.v), "n" !== this.masksProperties[e].mode && (this.viewData[e].invRect && (this.element.finalTransform.mProp._mdf || t) && (this.viewData[e].invRect.setAttribute("x", -r.props[12]), this.viewData[e].invRect.setAttribute("y", -r.props[13])), this.storedData[e].x && (this.storedData[e].x._mdf || t))) {
            var s = this.storedData[e].expan;
            this.storedData[e].x.v < 0 ? ("erode" !== this.storedData[e].lastOperator && (this.storedData[e].lastOperator = "erode", this.storedData[e].elem.setAttribute("filter", "url(" + locationHref + "#" + this.storedData[e].filterId + ")")), s.setAttribute("radius", -this.storedData[e].x.v)) : ("dilate" !== this.storedData[e].lastOperator && (this.storedData[e].lastOperator = "dilate", this.storedData[e].elem.setAttribute("filter", null)), this.storedData[e].elem.setAttribute("stroke-width", 2 * this.storedData[e].x.v));
          }
        }
      }, MaskElement.prototype.getMaskelement = function () {
        return this.maskElement;
      }, MaskElement.prototype.createLayerSolidPath = function () {
        var t = "M0,0 ";
        return t += " h" + this.globalData.compSize.w, t += " v" + this.globalData.compSize.h, t += " h-" + this.globalData.compSize.w, t += " v-" + this.globalData.compSize.h + " ";
      }, MaskElement.prototype.drawPath = function (t, e, r) {
        var i,
          s,
          a = " M" + e.v[0][0] + "," + e.v[0][1];
        for (s = e._length, i = 1; i < s; i += 1) {
          a += " C" + e.o[i - 1][0] + "," + e.o[i - 1][1] + " " + e.i[i][0] + "," + e.i[i][1] + " " + e.v[i][0] + "," + e.v[i][1];
        }
        if (e.c && s > 1 && (a += " C" + e.o[i - 1][0] + "," + e.o[i - 1][1] + " " + e.i[0][0] + "," + e.i[0][1] + " " + e.v[0][0] + "," + e.v[0][1]), r.lastPath !== a) {
          var n = "";
          r.elem && (e.c && (n = t.inv ? this.solidPath + a : a), r.elem.setAttribute("d", n)), r.lastPath = a;
        }
      }, MaskElement.prototype.destroy = function () {
        this.element = null, this.globalData = null, this.maskElement = null, this.data = null, this.masksProperties = null;
      }, HierarchyElement.prototype = {
        initHierarchy: function initHierarchy() {
          this.hierarchy = [], this._isParent = !1, this.checkParenting();
        },
        setHierarchy: function setHierarchy(t) {
          this.hierarchy = t;
        },
        setAsParent: function setAsParent() {
          this._isParent = !0;
        },
        checkParenting: function checkParenting() {
          void 0 !== this.data.parent && this.comp.buildElementParenting(this, this.data.parent, []);
        }
      }, FrameElement.prototype = {
        initFrame: function initFrame() {
          this._isFirstFrame = !1, this.dynamicProperties = [], this._mdf = !1;
        },
        prepareProperties: function prepareProperties(t, e) {
          var r,
            i = this.dynamicProperties.length;
          for (r = 0; r < i; r += 1) {
            (e || this._isParent && "transform" === this.dynamicProperties[r].propType) && (this.dynamicProperties[r].getValue(), this.dynamicProperties[r]._mdf && (this.globalData._mdf = !0, this._mdf = !0));
          }
        },
        addDynamicProperty: function addDynamicProperty(t) {
          -1 === this.dynamicProperties.indexOf(t) && this.dynamicProperties.push(t);
        }
      }, TransformElement.prototype = {
        initTransform: function initTransform() {
          this.finalTransform = {
            mProp: this.data.ks ? TransformPropertyFactory.getTransformProperty(this, this.data.ks, this) : {
              o: 0
            },
            _matMdf: !1,
            _opMdf: !1,
            mat: new Matrix()
          }, this.data.ao && (this.finalTransform.mProp.autoOriented = !0), this.data.ty;
        },
        renderTransform: function renderTransform() {
          if (this.finalTransform._opMdf = this.finalTransform.mProp.o._mdf || this._isFirstFrame, this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame, this.hierarchy) {
            var t,
              e = this.finalTransform.mat,
              r = 0,
              i = this.hierarchy.length;
            if (!this.finalTransform._matMdf) for (; r < i;) {
              if (this.hierarchy[r].finalTransform.mProp._mdf) {
                this.finalTransform._matMdf = !0;
                break;
              }
              r += 1;
            }
            if (this.finalTransform._matMdf) for (t = this.finalTransform.mProp.v.props, e.cloneFromProps(t), r = 0; r < i; r += 1) {
              t = this.hierarchy[r].finalTransform.mProp.v.props, e.transform(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15]);
            }
          }
        },
        globalToLocal: function globalToLocal(t) {
          var e = [];
          e.push(this.finalTransform);
          for (var r = !0, i = this.comp; r;) {
            i.finalTransform ? (i.data.hasMask && e.splice(0, 0, i.finalTransform), i = i.comp) : r = !1;
          }
          var s,
            a,
            n = e.length;
          for (s = 0; s < n; s += 1) {
            a = e[s].mat.applyToPointArray(0, 0, 0), t = [t[0] - a[0], t[1] - a[1], 0];
          }
          return t;
        },
        mHelper: new Matrix()
      }, RenderableElement.prototype = {
        initRenderable: function initRenderable() {
          this.isInRange = !1, this.hidden = !1, this.isTransparent = !1, this.renderableComponents = [];
        },
        addRenderableComponent: function addRenderableComponent(t) {
          -1 === this.renderableComponents.indexOf(t) && this.renderableComponents.push(t);
        },
        removeRenderableComponent: function removeRenderableComponent(t) {
          -1 !== this.renderableComponents.indexOf(t) && this.renderableComponents.splice(this.renderableComponents.indexOf(t), 1);
        },
        prepareRenderableFrame: function prepareRenderableFrame(t) {
          this.checkLayerLimits(t);
        },
        checkTransparency: function checkTransparency() {
          this.finalTransform.mProp.o.v <= 0 ? !this.isTransparent && this.globalData.renderConfig.hideOnTransparent && (this.isTransparent = !0, this.hide()) : this.isTransparent && (this.isTransparent = !1, this.show());
        },
        checkLayerLimits: function checkLayerLimits(t) {
          this.data.ip - this.data.st <= t && this.data.op - this.data.st > t ? !0 !== this.isInRange && (this.globalData._mdf = !0, this._mdf = !0, this.isInRange = !0, this.show()) : !1 !== this.isInRange && (this.globalData._mdf = !0, this.isInRange = !1, this.hide());
        },
        renderRenderable: function renderRenderable() {
          var t,
            e = this.renderableComponents.length;
          for (t = 0; t < e; t += 1) {
            this.renderableComponents[t].renderFrame(this._isFirstFrame);
          }
        },
        sourceRectAtTime: function sourceRectAtTime() {
          return {
            top: 0,
            left: 0,
            width: 100,
            height: 100
          };
        },
        getLayerSize: function getLayerSize() {
          return 5 === this.data.ty ? {
            w: this.data.textData.width,
            h: this.data.textData.height
          } : {
            w: this.data.width,
            h: this.data.height
          };
        }
      }, extendPrototype([RenderableElement, createProxyFunction({
        initElement: function initElement(t, e, r) {
          this.initFrame(), this.initBaseData(t, e, r), this.initTransform(t, e, r), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide();
        },
        hide: function hide() {
          this.hidden || this.isInRange && !this.isTransparent || ((this.baseElement || this.layerElement).style.display = "none", this.hidden = !0);
        },
        show: function show() {
          this.isInRange && !this.isTransparent && (this.data.hd || ((this.baseElement || this.layerElement).style.display = "block"), this.hidden = !1, this._isFirstFrame = !0);
        },
        renderFrame: function renderFrame() {
          this.data.hd || this.hidden || (this.renderTransform(), this.renderRenderable(), this.renderElement(), this.renderInnerContent(), this._isFirstFrame && (this._isFirstFrame = !1));
        },
        renderInnerContent: function renderInnerContent() {},
        prepareFrame: function prepareFrame(t) {
          this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), this.checkTransparency();
        },
        destroy: function destroy() {
          this.innerElem = null, this.destroyBaseElement();
        }
      })], RenderableDOMElement), SVGShapeData.prototype.setAsAnimated = function () {
        this._isAnimated = !0;
      }, ShapeTransformManager.prototype = {
        addTransformSequence: function addTransformSequence(t) {
          var e,
            r = t.length,
            i = "_";
          for (e = 0; e < r; e += 1) {
            i += t[e].transform.key + "_";
          }
          var s = this.sequences[i];
          return s || (s = {
            transforms: [].concat(t),
            finalTransform: new Matrix(),
            _mdf: !1
          }, this.sequences[i] = s, this.sequenceList.push(s)), s;
        },
        processSequence: function processSequence(t, e) {
          for (var r, i = 0, s = t.transforms.length, a = e; i < s && !e;) {
            if (t.transforms[i].transform.mProps._mdf) {
              a = !0;
              break;
            }
            i += 1;
          }
          if (a) for (t.finalTransform.reset(), i = s - 1; i >= 0; i -= 1) {
            r = t.transforms[i].transform.mProps.v.props, t.finalTransform.transform(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]);
          }
          t._mdf = a;
        },
        processSequences: function processSequences(t) {
          var e,
            r = this.sequenceList.length;
          for (e = 0; e < r; e += 1) {
            this.processSequence(this.sequenceList[e], t);
          }
        },
        getNewKey: function getNewKey() {
          return "_" + this.transform_key_count++;
        }
      }, CVShapeData.prototype.setAsAnimated = SVGShapeData.prototype.setAsAnimated, BaseElement.prototype = {
        checkMasks: function checkMasks() {
          if (!this.data.hasMask) return !1;
          for (var t = 0, e = this.data.masksProperties.length; t < e;) {
            if ("n" !== this.data.masksProperties[t].mode && !1 !== this.data.masksProperties[t].cl) return !0;
            t += 1;
          }
          return !1;
        },
        initExpressions: function initExpressions() {
          this.layerInterface = LayerExpressionInterface(this), this.data.hasMask && this.maskManager && this.layerInterface.registerMaskInterface(this.maskManager);
          var t = EffectsExpressionInterface.createEffectsInterface(this, this.layerInterface);
          this.layerInterface.registerEffectsInterface(t), 0 === this.data.ty || this.data.xt ? this.compInterface = CompExpressionInterface(this) : 4 === this.data.ty ? (this.layerInterface.shapeInterface = ShapeExpressionInterface(this.shapesData, this.itemsData, this.layerInterface), this.layerInterface.content = this.layerInterface.shapeInterface) : 5 === this.data.ty && (this.layerInterface.textInterface = TextExpressionInterface(this), this.layerInterface.text = this.layerInterface.textInterface);
        },
        setBlendMode: function setBlendMode() {
          var t = getBlendMode(this.data.bm);
          (this.baseElement || this.layerElement).style["mix-blend-mode"] = t;
        },
        initBaseData: function initBaseData(t, e, r) {
          this.globalData = e, this.comp = r, this.data = t, this.layerId = createElementID(), this.data.sr || (this.data.sr = 1), this.effectsManager = new EffectsManager(this.data, this, this.dynamicProperties);
        },
        getType: function getType() {
          return this.type;
        },
        sourceRectAtTime: function sourceRectAtTime() {}
      }, NullElement.prototype.prepareFrame = function (t) {
        this.prepareProperties(t, !0);
      }, NullElement.prototype.renderFrame = function () {}, NullElement.prototype.getBaseElement = function () {
        return null;
      }, NullElement.prototype.destroy = function () {}, NullElement.prototype.sourceRectAtTime = function () {}, NullElement.prototype.hide = function () {}, extendPrototype([BaseElement, TransformElement, HierarchyElement, FrameElement], NullElement), SVGBaseElement.prototype = {
        initRendererElement: function initRendererElement() {
          this.layerElement = createNS("g");
        },
        createContainerElements: function createContainerElements() {
          this.matteElement = createNS("g"), this.transformedElement = this.layerElement, this.maskedElement = this.layerElement, this._sizeChanged = !1;
          var t,
            e,
            r,
            i = null;
          if (this.data.td) {
            if (3 == this.data.td || 1 == this.data.td) {
              var s = createNS("mask");
              s.setAttribute("id", this.layerId), s.setAttribute("mask-type", 3 == this.data.td ? "luminance" : "alpha"), s.appendChild(this.layerElement), i = s, this.globalData.defs.appendChild(s), featureSupport.maskType || 1 != this.data.td || (s.setAttribute("mask-type", "luminance"), t = createElementID(), e = filtersFactory.createFilter(t), this.globalData.defs.appendChild(e), e.appendChild(filtersFactory.createAlphaToLuminanceFilter()), (r = createNS("g")).appendChild(this.layerElement), i = r, s.appendChild(r), r.setAttribute("filter", "url(" + locationHref + "#" + t + ")"));
            } else if (2 == this.data.td) {
              var a = createNS("mask");
              a.setAttribute("id", this.layerId), a.setAttribute("mask-type", "alpha");
              var n = createNS("g");
              a.appendChild(n), t = createElementID(), e = filtersFactory.createFilter(t);
              var o = createNS("feComponentTransfer");
              o.setAttribute("in", "SourceGraphic"), e.appendChild(o);
              var h = createNS("feFuncA");
              h.setAttribute("type", "table"), h.setAttribute("tableValues", "1.0 0.0"), o.appendChild(h), this.globalData.defs.appendChild(e);
              var l = createNS("rect");
              l.setAttribute("width", this.comp.data.w), l.setAttribute("height", this.comp.data.h), l.setAttribute("x", "0"), l.setAttribute("y", "0"), l.setAttribute("fill", "#ffffff"), l.setAttribute("opacity", "0"), n.setAttribute("filter", "url(" + locationHref + "#" + t + ")"), n.appendChild(l), n.appendChild(this.layerElement), i = n, featureSupport.maskType || (a.setAttribute("mask-type", "luminance"), e.appendChild(filtersFactory.createAlphaToLuminanceFilter()), r = createNS("g"), n.appendChild(l), r.appendChild(this.layerElement), i = r, n.appendChild(r)), this.globalData.defs.appendChild(a);
            }
          } else this.data.tt ? (this.matteElement.appendChild(this.layerElement), i = this.matteElement, this.baseElement = this.matteElement) : this.baseElement = this.layerElement;
          if (this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl), 0 === this.data.ty && !this.data.hd) {
            var p = createNS("clipPath"),
              f = createNS("path");
            f.setAttribute("d", "M0,0 L" + this.data.w + ",0 L" + this.data.w + "," + this.data.h + " L0," + this.data.h + "z");
            var m = createElementID();
            if (p.setAttribute("id", m), p.appendChild(f), this.globalData.defs.appendChild(p), this.checkMasks()) {
              var c = createNS("g");
              c.setAttribute("clip-path", "url(" + locationHref + "#" + m + ")"), c.appendChild(this.layerElement), this.transformedElement = c, i ? i.appendChild(this.transformedElement) : this.baseElement = this.transformedElement;
            } else this.layerElement.setAttribute("clip-path", "url(" + locationHref + "#" + m + ")");
          }
          0 !== this.data.bm && this.setBlendMode();
        },
        renderElement: function renderElement() {
          this.finalTransform._matMdf && this.transformedElement.setAttribute("transform", this.finalTransform.mat.to2dCSS()), this.finalTransform._opMdf && this.transformedElement.setAttribute("opacity", this.finalTransform.mProp.o.v);
        },
        destroyBaseElement: function destroyBaseElement() {
          this.layerElement = null, this.matteElement = null, this.maskManager.destroy();
        },
        getBaseElement: function getBaseElement() {
          return this.data.hd ? null : this.baseElement;
        },
        createRenderableComponents: function createRenderableComponents() {
          this.maskManager = new MaskElement(this.data, this, this.globalData), this.renderableEffectsManager = new SVGEffects(this);
        },
        setMatte: function setMatte(t) {
          this.matteElement && this.matteElement.setAttribute("mask", "url(" + locationHref + "#" + t + ")");
        }
      }, IShapeElement.prototype = {
        addShapeToModifiers: function addShapeToModifiers(t) {
          var e,
            r = this.shapeModifiers.length;
          for (e = 0; e < r; e += 1) {
            this.shapeModifiers[e].addShape(t);
          }
        },
        isShapeInAnimatedModifiers: function isShapeInAnimatedModifiers(t) {
          for (var e = this.shapeModifiers.length; 0 < e;) {
            if (this.shapeModifiers[0].isAnimatedWithShape(t)) return !0;
          }
          return !1;
        },
        renderModifiers: function renderModifiers() {
          if (this.shapeModifiers.length) {
            var t,
              e = this.shapes.length;
            for (t = 0; t < e; t += 1) {
              this.shapes[t].sh.reset();
            }
            for (t = (e = this.shapeModifiers.length) - 1; t >= 0; t -= 1) {
              this.shapeModifiers[t].processShapes(this._isFirstFrame);
            }
          }
        },
        lcEnum: {
          1: "butt",
          2: "round",
          3: "square"
        },
        ljEnum: {
          1: "miter",
          2: "round",
          3: "bevel"
        },
        searchProcessedElement: function searchProcessedElement(t) {
          for (var e = this.processedElements, r = 0, i = e.length; r < i;) {
            if (e[r].elem === t) return e[r].pos;
            r += 1;
          }
          return 0;
        },
        addProcessedElement: function addProcessedElement(t, e) {
          for (var r = this.processedElements, i = r.length; i;) {
            if (r[i -= 1].elem === t) return void (r[i].pos = e);
          }
          r.push(new ProcessedElement(t, e));
        },
        prepareFrame: function prepareFrame(t) {
          this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange);
        }
      }, ITextElement.prototype.initElement = function (t, e, r) {
        this.lettersChangedFlag = !0, this.initFrame(), this.initBaseData(t, e, r), this.textProperty = new TextProperty(this, t.t, this.dynamicProperties), this.textAnimator = new TextAnimatorProperty(t.t, this.renderType, this), this.initTransform(t, e, r), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide(), this.textAnimator.searchProperties(this.dynamicProperties);
      }, ITextElement.prototype.prepareFrame = function (t) {
        this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), (this.textProperty._mdf || this.textProperty._isFirstFrame) && (this.buildNewText(), this.textProperty._isFirstFrame = !1, this.textProperty._mdf = !1);
      }, ITextElement.prototype.createPathShape = function (t, e) {
        var r,
          i,
          s = e.length,
          a = "";
        for (r = 0; r < s; r += 1) {
          i = e[r].ks.k, a += buildShapeString(i, i.i.length, !0, t);
        }
        return a;
      }, ITextElement.prototype.updateDocumentData = function (t, e) {
        this.textProperty.updateDocumentData(t, e);
      }, ITextElement.prototype.canResizeFont = function (t) {
        this.textProperty.canResizeFont(t);
      }, ITextElement.prototype.setMinimumFontSize = function (t) {
        this.textProperty.setMinimumFontSize(t);
      }, ITextElement.prototype.applyTextPropertiesToMatrix = function (t, e, r, i, s) {
        switch (t.ps && e.translate(t.ps[0], t.ps[1] + t.ascent, 0), e.translate(0, -t.ls, 0), t.j) {
          case 1:
            e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[r]), 0, 0);
            break;
          case 2:
            e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[r]) / 2, 0, 0);
        }
        e.translate(i, s, 0);
      }, ITextElement.prototype.buildColor = function (t) {
        return "rgb(" + Math.round(255 * t[0]) + "," + Math.round(255 * t[1]) + "," + Math.round(255 * t[2]) + ")";
      }, ITextElement.prototype.emptyProp = new LetterProps(), ITextElement.prototype.destroy = function () {}, extendPrototype([BaseElement, TransformElement, HierarchyElement, FrameElement, RenderableDOMElement], ICompElement), ICompElement.prototype.initElement = function (t, e, r) {
        this.initFrame(), this.initBaseData(t, e, r), this.initTransform(t, e, r), this.initRenderable(), this.initHierarchy(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), !this.data.xt && e.progressiveLoad || this.buildAllItems(), this.hide();
      }, ICompElement.prototype.prepareFrame = function (t) {
        if (this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), this.isInRange || this.data.xt) {
          if (this.tm._placeholder) this.renderedFrame = t / this.data.sr;else {
            var e = this.tm.v;
            e === this.data.op && (e = this.data.op - 1), this.renderedFrame = e;
          }
          var r,
            i = this.elements.length;
          for (this.completeLayers || this.checkLayers(this.renderedFrame), r = i - 1; r >= 0; r -= 1) {
            (this.completeLayers || this.elements[r]) && (this.elements[r].prepareFrame(this.renderedFrame - this.layers[r].st), this.elements[r]._mdf && (this._mdf = !0));
          }
        }
      }, ICompElement.prototype.renderInnerContent = function () {
        var t,
          e = this.layers.length;
        for (t = 0; t < e; t += 1) {
          (this.completeLayers || this.elements[t]) && this.elements[t].renderFrame();
        }
      }, ICompElement.prototype.setElements = function (t) {
        this.elements = t;
      }, ICompElement.prototype.getElements = function () {
        return this.elements;
      }, ICompElement.prototype.destroyElements = function () {
        var t,
          e = this.layers.length;
        for (t = 0; t < e; t += 1) {
          this.elements[t] && this.elements[t].destroy();
        }
      }, ICompElement.prototype.destroy = function () {
        this.destroyElements(), this.destroyBaseElement();
      }, extendPrototype([BaseElement, TransformElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement], IImageElement), IImageElement.prototype.createContent = function () {
        var t = this.globalData.getAssetsPath(this.assetData);
        this.innerElem = createNS("image"), this.innerElem.setAttribute("width", this.assetData.w + "px"), this.innerElem.setAttribute("height", this.assetData.h + "px"), this.innerElem.setAttribute("preserveAspectRatio", this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio), this.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", t), this.layerElement.appendChild(this.innerElem);
      }, IImageElement.prototype.sourceRectAtTime = function () {
        return this.sourceRect;
      }, extendPrototype([IImageElement], ISolidElement), ISolidElement.prototype.createContent = function () {
        var t = createNS("rect");
        t.setAttribute("width", this.data.sw), t.setAttribute("height", this.data.sh), t.setAttribute("fill", this.data.sc), this.layerElement.appendChild(t);
      }, extendPrototype([BaseElement, TransformElement, SVGBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableDOMElement], SVGShapeElement), SVGShapeElement.prototype.initSecondaryElement = function () {}, SVGShapeElement.prototype.identityMatrix = new Matrix(), SVGShapeElement.prototype.buildExpressionInterface = function () {}, SVGShapeElement.prototype.createContent = function () {
        this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes();
      }, SVGShapeElement.prototype.filterUniqueShapes = function () {
        var t,
          e,
          r,
          i,
          s = this.shapes.length,
          a = this.stylesList.length,
          n = [],
          o = !1;
        for (r = 0; r < a; r += 1) {
          for (i = this.stylesList[r], o = !1, n.length = 0, t = 0; t < s; t += 1) {
            -1 !== (e = this.shapes[t]).styles.indexOf(i) && (n.push(e), o = e._isAnimated || o);
          }
          n.length > 1 && o && this.setShapesAsAnimated(n);
        }
      }, SVGShapeElement.prototype.setShapesAsAnimated = function (t) {
        var e,
          r = t.length;
        for (e = 0; e < r; e += 1) {
          t[e].setAsAnimated();
        }
      }, SVGShapeElement.prototype.createStyleElement = function (t, e) {
        var r,
          i = new SVGStyleData(t, e),
          s = i.pElem;
        if ("st" === t.ty) r = new SVGStrokeStyleData(this, t, i);else if ("fl" === t.ty) r = new SVGFillStyleData(this, t, i);else if ("gf" === t.ty || "gs" === t.ty) {
          r = new ("gf" === t.ty ? SVGGradientFillStyleData : SVGGradientStrokeStyleData)(this, t, i), this.globalData.defs.appendChild(r.gf), r.maskId && (this.globalData.defs.appendChild(r.ms), this.globalData.defs.appendChild(r.of), s.setAttribute("mask", "url(" + locationHref + "#" + r.maskId + ")"));
        }
        return "st" !== t.ty && "gs" !== t.ty || (s.setAttribute("stroke-linecap", this.lcEnum[t.lc] || "round"), s.setAttribute("stroke-linejoin", this.ljEnum[t.lj] || "round"), s.setAttribute("fill-opacity", "0"), 1 === t.lj && s.setAttribute("stroke-miterlimit", t.ml)), 2 === t.r && s.setAttribute("fill-rule", "evenodd"), t.ln && s.setAttribute("id", t.ln), t.cl && s.setAttribute("class", t.cl), t.bm && (s.style["mix-blend-mode"] = getBlendMode(t.bm)), this.stylesList.push(i), this.addToAnimatedContents(t, r), r;
      }, SVGShapeElement.prototype.createGroupElement = function (t) {
        var e = new ShapeGroupData();
        return t.ln && e.gr.setAttribute("id", t.ln), t.cl && e.gr.setAttribute("class", t.cl), t.bm && (e.gr.style["mix-blend-mode"] = getBlendMode(t.bm)), e;
      }, SVGShapeElement.prototype.createTransformElement = function (t, e) {
        var r = TransformPropertyFactory.getTransformProperty(this, t, this),
          i = new SVGTransformData(r, r.o, e);
        return this.addToAnimatedContents(t, i), i;
      }, SVGShapeElement.prototype.createShapeElement = function (t, e, r) {
        var i = 4;
        "rc" === t.ty ? i = 5 : "el" === t.ty ? i = 6 : "sr" === t.ty && (i = 7);
        var s = new SVGShapeData(e, r, ShapePropertyFactory.getShapeProp(this, t, i, this));
        return this.shapes.push(s), this.addShapeToModifiers(s), this.addToAnimatedContents(t, s), s;
      }, SVGShapeElement.prototype.addToAnimatedContents = function (t, e) {
        for (var r = 0, i = this.animatedContents.length; r < i;) {
          if (this.animatedContents[r].element === e) return;
          r += 1;
        }
        this.animatedContents.push({
          fn: SVGElementsRenderer.createRenderFunction(t),
          element: e,
          data: t
        });
      }, SVGShapeElement.prototype.setElementStyles = function (t) {
        var e,
          r = t.styles,
          i = this.stylesList.length;
        for (e = 0; e < i; e += 1) {
          this.stylesList[e].closed || r.push(this.stylesList[e]);
        }
      }, SVGShapeElement.prototype.reloadShapes = function () {
        this._isFirstFrame = !0;
        var t,
          e = this.itemsData.length;
        for (t = 0; t < e; t += 1) {
          this.prevViewData[t] = this.itemsData[t];
        }
        for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes(), e = this.dynamicProperties.length, t = 0; t < e; t += 1) {
          this.dynamicProperties[t].getValue();
        }
        this.renderModifiers();
      }, SVGShapeElement.prototype.searchShapes = function (t, e, r, i, s, a, n) {
        var o,
          h,
          l,
          p,
          f,
          m,
          c = [].concat(a),
          d = t.length - 1,
          u = [],
          y = [];
        for (o = d; o >= 0; o -= 1) {
          if ((m = this.searchProcessedElement(t[o])) ? e[o] = r[m - 1] : t[o]._render = n, "fl" == t[o].ty || "st" == t[o].ty || "gf" == t[o].ty || "gs" == t[o].ty) m ? e[o].style.closed = !1 : e[o] = this.createStyleElement(t[o], s), t[o]._render && i.appendChild(e[o].style.pElem), u.push(e[o].style);else if ("gr" == t[o].ty) {
            if (m) for (l = e[o].it.length, h = 0; h < l; h += 1) {
              e[o].prevViewData[h] = e[o].it[h];
            } else e[o] = this.createGroupElement(t[o]);
            this.searchShapes(t[o].it, e[o].it, e[o].prevViewData, e[o].gr, s + 1, c, n), t[o]._render && i.appendChild(e[o].gr);
          } else "tr" == t[o].ty ? (m || (e[o] = this.createTransformElement(t[o], i)), p = e[o].transform, c.push(p)) : "sh" == t[o].ty || "rc" == t[o].ty || "el" == t[o].ty || "sr" == t[o].ty ? (m || (e[o] = this.createShapeElement(t[o], c, s)), this.setElementStyles(e[o])) : "tm" == t[o].ty || "rd" == t[o].ty || "ms" == t[o].ty ? (m ? (f = e[o]).closed = !1 : ((f = ShapeModifiers.getModifier(t[o].ty)).init(this, t[o]), e[o] = f, this.shapeModifiers.push(f)), y.push(f)) : "rp" == t[o].ty && (m ? (f = e[o]).closed = !0 : (f = ShapeModifiers.getModifier(t[o].ty), e[o] = f, f.init(this, t, o, e), this.shapeModifiers.push(f), n = !1), y.push(f));
          this.addProcessedElement(t[o], o + 1);
        }
        for (d = u.length, o = 0; o < d; o += 1) {
          u[o].closed = !0;
        }
        for (d = y.length, o = 0; o < d; o += 1) {
          y[o].closed = !0;
        }
      }, SVGShapeElement.prototype.renderInnerContent = function () {
        this.renderModifiers();
        var t,
          e = this.stylesList.length;
        for (t = 0; t < e; t += 1) {
          this.stylesList[t].reset();
        }
        for (this.renderShape(), t = 0; t < e; t += 1) {
          (this.stylesList[t]._mdf || this._isFirstFrame) && (this.stylesList[t].msElem && (this.stylesList[t].msElem.setAttribute("d", this.stylesList[t].d), this.stylesList[t].d = "M0 0" + this.stylesList[t].d), this.stylesList[t].pElem.setAttribute("d", this.stylesList[t].d || "M0 0"));
        }
      }, SVGShapeElement.prototype.renderShape = function () {
        var t,
          e,
          r = this.animatedContents.length;
        for (t = 0; t < r; t += 1) {
          e = this.animatedContents[t], (this._isFirstFrame || e.element._isAnimated) && !0 !== e.data && e.fn(e.data, e.element, this._isFirstFrame);
        }
      }, SVGShapeElement.prototype.destroy = function () {
        this.destroyBaseElement(), this.shapesData = null, this.itemsData = null;
      }, CVContextData.prototype.duplicate = function () {
        var t = 2 * this._length,
          e = this.savedOp;
        this.savedOp = createTypedArray("float32", t), this.savedOp.set(e);
        var r = 0;
        for (r = this._length; r < t; r += 1) {
          this.saved[r] = createTypedArray("float32", 16);
        }
        this._length = t;
      }, CVContextData.prototype.reset = function () {
        this.cArrPos = 0, this.cTr.reset(), this.cO = 1;
      }, CVBaseElement.prototype = {
        createElements: function createElements() {},
        initRendererElement: function initRendererElement() {},
        createContainerElements: function createContainerElements() {
          this.canvasContext = this.globalData.canvasContext, this.renderableEffectsManager = new CVEffects(this);
        },
        createContent: function createContent() {},
        setBlendMode: function setBlendMode() {
          var t = this.globalData;
          if (t.blendMode !== this.data.bm) {
            t.blendMode = this.data.bm;
            var e = getBlendMode(this.data.bm);
            t.canvasContext.globalCompositeOperation = e;
          }
        },
        createRenderableComponents: function createRenderableComponents() {
          this.maskManager = new CVMaskElement(this.data, this);
        },
        hideElement: function hideElement() {
          this.hidden || this.isInRange && !this.isTransparent || (this.hidden = !0);
        },
        showElement: function showElement() {
          this.isInRange && !this.isTransparent && (this.hidden = !1, this._isFirstFrame = !0, this.maskManager._isFirstFrame = !0);
        },
        renderFrame: function renderFrame() {
          this.hidden || this.data.hd || (this.renderTransform(), this.renderRenderable(), this.setBlendMode(), this.globalData.renderer.save(), this.globalData.renderer.ctxTransform(this.finalTransform.mat.props), this.globalData.renderer.ctxOpacity(this.finalTransform.mProp.o.v), this.renderInnerContent(), this.globalData.renderer.restore(), this.maskManager.hasMasks && this.globalData.renderer.restore(!0), this._isFirstFrame && (this._isFirstFrame = !1));
        },
        destroy: function destroy() {
          this.canvasContext = null, this.data = null, this.globalData = null, this.maskManager.destroy();
        },
        mHelper: new Matrix()
      }, CVBaseElement.prototype.hide = CVBaseElement.prototype.hideElement, CVBaseElement.prototype.show = CVBaseElement.prototype.showElement, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVImageElement), CVImageElement.prototype.initElement = SVGShapeElement.prototype.initElement, CVImageElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame, CVImageElement.prototype.createContent = function () {
        if (this.img.width && (this.assetData.w !== this.img.width || this.assetData.h !== this.img.height)) {
          var t = createTag("canvas");
          t.width = this.assetData.w, t.height = this.assetData.h;
          var e,
            r,
            i = t.getContext("2d"),
            s = this.img.width,
            a = this.img.height,
            n = s / a,
            o = this.assetData.w / this.assetData.h,
            h = this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio;
          n > o && "xMidYMid slice" === h || n < o && "xMidYMid slice" !== h ? e = (r = a) * o : r = (e = s) / o, i.drawImage(this.img, (s - e) / 2, (a - r) / 2, e, r, 0, 0, this.assetData.w, this.assetData.h), this.img = t;
        }
      }, CVImageElement.prototype.renderInnerContent = function (t) {
        this.canvasContext.drawImage(this.img, 0, 0);
      }, CVImageElement.prototype.destroy = function () {
        this.img = null;
      }, extendPrototype([CanvasRenderer, ICompElement, CVBaseElement], CVCompElement), CVCompElement.prototype.renderInnerContent = function () {
        var t;
        for (t = this.layers.length - 1; t >= 0; t -= 1) {
          (this.completeLayers || this.elements[t]) && this.elements[t].renderFrame();
        }
      }, CVCompElement.prototype.destroy = function () {
        var t;
        for (t = this.layers.length - 1; t >= 0; t -= 1) {
          this.elements[t] && this.elements[t].destroy();
        }
        this.layers = null, this.elements = null;
      }, CVMaskElement.prototype.renderFrame = function () {
        if (this.hasMasks) {
          var t,
            e,
            r,
            i,
            s = this.element.finalTransform.mat,
            a = this.element.canvasContext,
            n = this.masksProperties.length;
          for (a.beginPath(), t = 0; t < n; t++) {
            if ("n" !== this.masksProperties[t].mode) {
              this.masksProperties[t].inv && (a.moveTo(0, 0), a.lineTo(this.element.globalData.compSize.w, 0), a.lineTo(this.element.globalData.compSize.w, this.element.globalData.compSize.h), a.lineTo(0, this.element.globalData.compSize.h), a.lineTo(0, 0)), i = this.viewData[t].v, e = s.applyToPointArray(i.v[0][0], i.v[0][1], 0), a.moveTo(e[0], e[1]);
              var o,
                h = i._length;
              for (o = 1; o < h; o++) {
                r = s.applyToTriplePoints(i.o[o - 1], i.i[o], i.v[o]), a.bezierCurveTo(r[0], r[1], r[2], r[3], r[4], r[5]);
              }
              r = s.applyToTriplePoints(i.o[o - 1], i.i[0], i.v[0]), a.bezierCurveTo(r[0], r[1], r[2], r[3], r[4], r[5]);
            }
          }
          this.element.globalData.renderer.save(!0), a.clip();
        }
      }, CVMaskElement.prototype.getMaskProperty = MaskElement.prototype.getMaskProperty, CVMaskElement.prototype.destroy = function () {
        this.element = null;
      }, extendPrototype([BaseElement, TransformElement, CVBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableElement], CVShapeElement), CVShapeElement.prototype.initElement = RenderableDOMElement.prototype.initElement, CVShapeElement.prototype.transformHelper = {
        opacity: 1,
        _opMdf: !1
      }, CVShapeElement.prototype.dashResetter = [], CVShapeElement.prototype.createContent = function () {
        this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, !0, []);
      }, CVShapeElement.prototype.createStyleElement = function (t, e) {
        var r = {
            data: t,
            type: t.ty,
            preTransforms: this.transformsManager.addTransformSequence(e),
            transforms: [],
            elements: [],
            closed: !0 === t.hd
          },
          i = {};
        if ("fl" == t.ty || "st" == t.ty ? (i.c = PropertyFactory.getProp(this, t.c, 1, 255, this), i.c.k || (r.co = "rgb(" + bm_floor(i.c.v[0]) + "," + bm_floor(i.c.v[1]) + "," + bm_floor(i.c.v[2]) + ")")) : "gf" !== t.ty && "gs" !== t.ty || (i.s = PropertyFactory.getProp(this, t.s, 1, null, this), i.e = PropertyFactory.getProp(this, t.e, 1, null, this), i.h = PropertyFactory.getProp(this, t.h || {
          k: 0
        }, 0, .01, this), i.a = PropertyFactory.getProp(this, t.a || {
          k: 0
        }, 0, degToRads, this), i.g = new GradientProperty(this, t.g, this)), i.o = PropertyFactory.getProp(this, t.o, 0, .01, this), "st" == t.ty || "gs" == t.ty) {
          if (r.lc = this.lcEnum[t.lc] || "round", r.lj = this.ljEnum[t.lj] || "round", 1 == t.lj && (r.ml = t.ml), i.w = PropertyFactory.getProp(this, t.w, 0, null, this), i.w.k || (r.wi = i.w.v), t.d) {
            var s = new DashProperty(this, t.d, "canvas", this);
            i.d = s, i.d.k || (r.da = i.d.dashArray, r.do = i.d.dashoffset[0]);
          }
        } else r.r = 2 === t.r ? "evenodd" : "nonzero";
        return this.stylesList.push(r), i.style = r, i;
      }, CVShapeElement.prototype.createGroupElement = function (t) {
        return {
          it: [],
          prevViewData: []
        };
      }, CVShapeElement.prototype.createTransformElement = function (t) {
        return {
          transform: {
            opacity: 1,
            _opMdf: !1,
            key: this.transformsManager.getNewKey(),
            op: PropertyFactory.getProp(this, t.o, 0, .01, this),
            mProps: TransformPropertyFactory.getTransformProperty(this, t, this)
          }
        };
      }, CVShapeElement.prototype.createShapeElement = function (t) {
        var e = new CVShapeData(this, t, this.stylesList, this.transformsManager);
        return this.shapes.push(e), this.addShapeToModifiers(e), e;
      }, CVShapeElement.prototype.reloadShapes = function () {
        this._isFirstFrame = !0;
        var t,
          e = this.itemsData.length;
        for (t = 0; t < e; t += 1) {
          this.prevViewData[t] = this.itemsData[t];
        }
        for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, !0, []), e = this.dynamicProperties.length, t = 0; t < e; t += 1) {
          this.dynamicProperties[t].getValue();
        }
        this.renderModifiers(), this.transformsManager.processSequences(this._isFirstFrame);
      }, CVShapeElement.prototype.addTransformToStyleList = function (t) {
        var e,
          r = this.stylesList.length;
        for (e = 0; e < r; e += 1) {
          this.stylesList[e].closed || this.stylesList[e].transforms.push(t);
        }
      }, CVShapeElement.prototype.removeTransformFromStyleList = function () {
        var t,
          e = this.stylesList.length;
        for (t = 0; t < e; t += 1) {
          this.stylesList[t].closed || this.stylesList[t].transforms.pop();
        }
      }, CVShapeElement.prototype.closeStyles = function (t) {
        var e,
          r = t.length;
        for (e = 0; e < r; e += 1) {
          t[e].closed = !0;
        }
      }, CVShapeElement.prototype.searchShapes = function (t, e, r, i, s) {
        var a,
          n,
          o,
          h,
          l,
          p,
          f = t.length - 1,
          m = [],
          c = [],
          d = [].concat(s);
        for (a = f; a >= 0; a -= 1) {
          if ((h = this.searchProcessedElement(t[a])) ? e[a] = r[h - 1] : t[a]._shouldRender = i, "fl" == t[a].ty || "st" == t[a].ty || "gf" == t[a].ty || "gs" == t[a].ty) h ? e[a].style.closed = !1 : e[a] = this.createStyleElement(t[a], d), m.push(e[a].style);else if ("gr" == t[a].ty) {
            if (h) for (o = e[a].it.length, n = 0; n < o; n += 1) {
              e[a].prevViewData[n] = e[a].it[n];
            } else e[a] = this.createGroupElement(t[a]);
            this.searchShapes(t[a].it, e[a].it, e[a].prevViewData, i, d);
          } else "tr" == t[a].ty ? (h || (p = this.createTransformElement(t[a]), e[a] = p), d.push(e[a]), this.addTransformToStyleList(e[a])) : "sh" == t[a].ty || "rc" == t[a].ty || "el" == t[a].ty || "sr" == t[a].ty ? h || (e[a] = this.createShapeElement(t[a])) : "tm" == t[a].ty || "rd" == t[a].ty ? (h ? (l = e[a]).closed = !1 : ((l = ShapeModifiers.getModifier(t[a].ty)).init(this, t[a]), e[a] = l, this.shapeModifiers.push(l)), c.push(l)) : "rp" == t[a].ty && (h ? (l = e[a]).closed = !0 : (l = ShapeModifiers.getModifier(t[a].ty), e[a] = l, l.init(this, t, a, e), this.shapeModifiers.push(l), i = !1), c.push(l));
          this.addProcessedElement(t[a], a + 1);
        }
        for (this.removeTransformFromStyleList(), this.closeStyles(m), f = c.length, a = 0; a < f; a += 1) {
          c[a].closed = !0;
        }
      }, CVShapeElement.prototype.renderInnerContent = function () {
        this.transformHelper.opacity = 1, this.transformHelper._opMdf = !1, this.renderModifiers(), this.transformsManager.processSequences(this._isFirstFrame), this.renderShape(this.transformHelper, this.shapesData, this.itemsData, !0);
      }, CVShapeElement.prototype.renderShapeTransform = function (t, e) {
        (t._opMdf || e.op._mdf || this._isFirstFrame) && (e.opacity = t.opacity, e.opacity *= e.op.v, e._opMdf = !0);
      }, CVShapeElement.prototype.drawLayer = function () {
        var t,
          e,
          r,
          i,
          s,
          a,
          n,
          o,
          h,
          l = this.stylesList.length,
          p = this.globalData.renderer,
          f = this.globalData.canvasContext;
        for (t = 0; t < l; t += 1) {
          if (("st" !== (o = (h = this.stylesList[t]).type) && "gs" !== o || 0 !== h.wi) && h.data._shouldRender && 0 !== h.coOp && 0 !== this.globalData.currentGlobalAlpha) {
            for (p.save(), a = h.elements, "st" === o || "gs" === o ? (f.strokeStyle = "st" === o ? h.co : h.grd, f.lineWidth = h.wi, f.lineCap = h.lc, f.lineJoin = h.lj, f.miterLimit = h.ml || 0) : f.fillStyle = "fl" === o ? h.co : h.grd, p.ctxOpacity(h.coOp), "st" !== o && "gs" !== o && f.beginPath(), p.ctxTransform(h.preTransforms.finalTransform.props), r = a.length, e = 0; e < r; e += 1) {
              for ("st" !== o && "gs" !== o || (f.beginPath(), h.da && (f.setLineDash(h.da), f.lineDashOffset = h.do)), s = (n = a[e].trNodes).length, i = 0; i < s; i += 1) {
                "m" == n[i].t ? f.moveTo(n[i].p[0], n[i].p[1]) : "c" == n[i].t ? f.bezierCurveTo(n[i].pts[0], n[i].pts[1], n[i].pts[2], n[i].pts[3], n[i].pts[4], n[i].pts[5]) : f.closePath();
              }
              "st" !== o && "gs" !== o || (f.stroke(), h.da && f.setLineDash(this.dashResetter));
            }
            "st" !== o && "gs" !== o && f.fill(h.r), p.restore();
          }
        }
      }, CVShapeElement.prototype.renderShape = function (t, e, r, i) {
        var s, a;
        for (a = t, s = e.length - 1; s >= 0; s -= 1) {
          "tr" == e[s].ty ? (a = r[s].transform, this.renderShapeTransform(t, a)) : "sh" == e[s].ty || "el" == e[s].ty || "rc" == e[s].ty || "sr" == e[s].ty ? this.renderPath(e[s], r[s]) : "fl" == e[s].ty ? this.renderFill(e[s], r[s], a) : "st" == e[s].ty ? this.renderStroke(e[s], r[s], a) : "gf" == e[s].ty || "gs" == e[s].ty ? this.renderGradientFill(e[s], r[s], a) : "gr" == e[s].ty ? this.renderShape(a, e[s].it, r[s].it) : e[s].ty;
        }
        i && this.drawLayer();
      }, CVShapeElement.prototype.renderStyledShape = function (t, e) {
        if (this._isFirstFrame || e._mdf || t.transforms._mdf) {
          var r,
            i,
            s,
            a = t.trNodes,
            n = e.paths,
            o = n._length;
          a.length = 0;
          var h = t.transforms.finalTransform;
          for (s = 0; s < o; s += 1) {
            var l = n.shapes[s];
            if (l && l.v) {
              for (i = l._length, r = 1; r < i; r += 1) {
                1 === r && a.push({
                  t: "m",
                  p: h.applyToPointArray(l.v[0][0], l.v[0][1], 0)
                }), a.push({
                  t: "c",
                  pts: h.applyToTriplePoints(l.o[r - 1], l.i[r], l.v[r])
                });
              }
              1 === i && a.push({
                t: "m",
                p: h.applyToPointArray(l.v[0][0], l.v[0][1], 0)
              }), l.c && i && (a.push({
                t: "c",
                pts: h.applyToTriplePoints(l.o[r - 1], l.i[0], l.v[0])
              }), a.push({
                t: "z"
              }));
            }
          }
          t.trNodes = a;
        }
      }, CVShapeElement.prototype.renderPath = function (t, e) {
        if (!0 !== t.hd && t._shouldRender) {
          var r,
            i = e.styledShapes.length;
          for (r = 0; r < i; r += 1) {
            this.renderStyledShape(e.styledShapes[r], e.sh);
          }
        }
      }, CVShapeElement.prototype.renderFill = function (t, e, r) {
        var i = e.style;
        (e.c._mdf || this._isFirstFrame) && (i.co = "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o._mdf || r._opMdf || this._isFirstFrame) && (i.coOp = e.o.v * r.opacity);
      }, CVShapeElement.prototype.renderGradientFill = function (t, e, r) {
        var i = e.style;
        if (!i.grd || e.g._mdf || e.s._mdf || e.e._mdf || 1 !== t.t && (e.h._mdf || e.a._mdf)) {
          var s = this.globalData.canvasContext,
            a = e.s.v,
            n = e.e.v;
          if (1 === t.t) m = s.createLinearGradient(a[0], a[1], n[0], n[1]);else var o = Math.sqrt(Math.pow(a[0] - n[0], 2) + Math.pow(a[1] - n[1], 2)),
            h = Math.atan2(n[1] - a[1], n[0] - a[0]),
            l = o * (e.h.v >= 1 ? .99 : e.h.v <= -1 ? -.99 : e.h.v),
            p = Math.cos(h + e.a.v) * l + a[0],
            f = Math.sin(h + e.a.v) * l + a[1],
            m = s.createRadialGradient(p, f, 0, a[0], a[1], o);
          var c,
            d = t.g.p,
            u = e.g.c,
            y = 1;
          for (c = 0; c < d; c += 1) {
            e.g._hasOpacity && e.g._collapsable && (y = e.g.o[2 * c + 1]), m.addColorStop(u[4 * c] / 100, "rgba(" + u[4 * c + 1] + "," + u[4 * c + 2] + "," + u[4 * c + 3] + "," + y + ")");
          }
          i.grd = m;
        }
        i.coOp = e.o.v * r.opacity;
      }, CVShapeElement.prototype.renderStroke = function (t, e, r) {
        var i = e.style,
          s = e.d;
        s && (s._mdf || this._isFirstFrame) && (i.da = s.dashArray, i.do = s.dashoffset[0]), (e.c._mdf || this._isFirstFrame) && (i.co = "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o._mdf || r._opMdf || this._isFirstFrame) && (i.coOp = e.o.v * r.opacity), (e.w._mdf || this._isFirstFrame) && (i.wi = e.w.v);
      }, CVShapeElement.prototype.destroy = function () {
        this.shapesData = null, this.globalData = null, this.canvasContext = null, this.stylesList.length = 0, this.itemsData.length = 0;
      }, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVSolidElement), CVSolidElement.prototype.initElement = SVGShapeElement.prototype.initElement, CVSolidElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame, CVSolidElement.prototype.renderInnerContent = function () {
        var t = this.canvasContext;
        t.fillStyle = this.data.sc, t.fillRect(0, 0, this.data.sw, this.data.sh);
      }, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement, ITextElement], CVTextElement), CVTextElement.prototype.tHelper = createTag("canvas").getContext("2d"), CVTextElement.prototype.buildNewText = function () {
        var t = this.textProperty.currentData;
        this.renderedLetters = createSizedArray(t.l ? t.l.length : 0);
        var e = !1;
        t.fc ? (e = !0, this.values.fill = this.buildColor(t.fc)) : this.values.fill = "rgba(0,0,0,0)", this.fill = e;
        var r = !1;
        t.sc && (r = !0, this.values.stroke = this.buildColor(t.sc), this.values.sWidth = t.sw);
        var i,
          s,
          a = this.globalData.fontManager.getFontByName(t.f),
          n = t.l,
          o = this.mHelper;
        this.stroke = r, this.values.fValue = t.finalSize + "px " + this.globalData.fontManager.getFontByName(t.f).fFamily, s = t.finalText.length;
        var h,
          l,
          p,
          f,
          m,
          c,
          d,
          u,
          y,
          g,
          v = this.data.singleShape,
          b = t.tr / 1e3 * t.finalSize,
          P = 0,
          _ = 0,
          x = !0,
          S = 0;
        for (i = 0; i < s; i += 1) {
          for (l = (h = this.globalData.fontManager.getCharData(t.finalText[i], a.fStyle, this.globalData.fontManager.getFontByName(t.f).fFamily)) && h.data || {}, o.reset(), v && n[i].n && (P = -b, _ += t.yOffset, _ += x ? 1 : 0, x = !1), d = (m = l.shapes ? l.shapes[0].it : []).length, o.scale(t.finalSize / 100, t.finalSize / 100), v && this.applyTextPropertiesToMatrix(t, o, n[i].line, P, _), y = createSizedArray(d), c = 0; c < d; c += 1) {
            for (f = m[c].ks.k.i.length, u = m[c].ks.k, g = [], p = 1; p < f; p += 1) {
              1 == p && g.push(o.applyToX(u.v[0][0], u.v[0][1], 0), o.applyToY(u.v[0][0], u.v[0][1], 0)), g.push(o.applyToX(u.o[p - 1][0], u.o[p - 1][1], 0), o.applyToY(u.o[p - 1][0], u.o[p - 1][1], 0), o.applyToX(u.i[p][0], u.i[p][1], 0), o.applyToY(u.i[p][0], u.i[p][1], 0), o.applyToX(u.v[p][0], u.v[p][1], 0), o.applyToY(u.v[p][0], u.v[p][1], 0));
            }
            g.push(o.applyToX(u.o[p - 1][0], u.o[p - 1][1], 0), o.applyToY(u.o[p - 1][0], u.o[p - 1][1], 0), o.applyToX(u.i[0][0], u.i[0][1], 0), o.applyToY(u.i[0][0], u.i[0][1], 0), o.applyToX(u.v[0][0], u.v[0][1], 0), o.applyToY(u.v[0][0], u.v[0][1], 0)), y[c] = g;
          }
          v && (P += n[i].l, P += b), this.textSpans[S] ? this.textSpans[S].elem = y : this.textSpans[S] = {
            elem: y
          }, S += 1;
        }
      }, CVTextElement.prototype.renderInnerContent = function () {
        var t,
          e,
          r,
          i,
          s,
          a,
          n = this.canvasContext;
        this.finalTransform.mat.props;
        n.font = this.values.fValue, n.lineCap = "butt", n.lineJoin = "miter", n.miterLimit = 4, this.data.singleShape || this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag);
        var o,
          h = this.textAnimator.renderedLetters,
          l = this.textProperty.currentData.l;
        e = l.length;
        var p,
          f,
          m = null,
          c = null,
          d = null;
        for (t = 0; t < e; t += 1) {
          if (!l[t].n) {
            if ((o = h[t]) && (this.globalData.renderer.save(), this.globalData.renderer.ctxTransform(o.p), this.globalData.renderer.ctxOpacity(o.o)), this.fill) {
              for (o && o.fc ? m !== o.fc && (m = o.fc, n.fillStyle = o.fc) : m !== this.values.fill && (m = this.values.fill, n.fillStyle = this.values.fill), i = (p = this.textSpans[t].elem).length, this.globalData.canvasContext.beginPath(), r = 0; r < i; r += 1) {
                for (a = (f = p[r]).length, this.globalData.canvasContext.moveTo(f[0], f[1]), s = 2; s < a; s += 6) {
                  this.globalData.canvasContext.bezierCurveTo(f[s], f[s + 1], f[s + 2], f[s + 3], f[s + 4], f[s + 5]);
                }
              }
              this.globalData.canvasContext.closePath(), this.globalData.canvasContext.fill();
            }
            if (this.stroke) {
              for (o && o.sw ? d !== o.sw && (d = o.sw, n.lineWidth = o.sw) : d !== this.values.sWidth && (d = this.values.sWidth, n.lineWidth = this.values.sWidth), o && o.sc ? c !== o.sc && (c = o.sc, n.strokeStyle = o.sc) : c !== this.values.stroke && (c = this.values.stroke, n.strokeStyle = this.values.stroke), i = (p = this.textSpans[t].elem).length, this.globalData.canvasContext.beginPath(), r = 0; r < i; r += 1) {
                for (a = (f = p[r]).length, this.globalData.canvasContext.moveTo(f[0], f[1]), s = 2; s < a; s += 6) {
                  this.globalData.canvasContext.bezierCurveTo(f[s], f[s + 1], f[s + 2], f[s + 3], f[s + 4], f[s + 5]);
                }
              }
              this.globalData.canvasContext.closePath(), this.globalData.canvasContext.stroke();
            }
            o && this.globalData.renderer.restore();
          }
        }
      }, CVEffects.prototype.renderFrame = function () {};
      var animationManager = function () {
          var t = {},
            e = [],
            r = 0,
            i = 0,
            s = 0,
            a = !0,
            n = !1;
          function o(t) {
            for (var r = 0, s = t.target; r < i;) {
              e[r].animation === s && (e.splice(r, 1), r -= 1, i -= 1, s.isPaused || p()), r += 1;
            }
          }
          function h(t, r) {
            if (!t) return null;
            for (var s = 0; s < i;) {
              if (e[s].elem == t && null !== e[s].elem) return e[s].animation;
              s += 1;
            }
            var a = new AnimationItem();
            return f(a, t), a.setData(t, r), a;
          }
          function l() {
            s += 1, d();
          }
          function p() {
            s -= 1;
          }
          function f(t, r) {
            t.addEventListener("destroy", o), t.addEventListener("_active", l), t.addEventListener("_idle", p), e.push({
              elem: r,
              animation: t
            }), i += 1;
          }
          function m(t) {
            var o,
              h = t - r;
            for (o = 0; o < i; o += 1) {
              e[o].animation.advanceTime(h);
            }
            r = t, s && !n ? window.requestAnimationFrame(m) : a = !0;
          }
          function c(t) {
            r = t, window.requestAnimationFrame(m);
          }
          function d() {
            !n && s && a && (window.requestAnimationFrame(c), a = !1);
          }
          return t.registerAnimation = h, t.loadAnimation = function (t) {
            var e = new AnimationItem();
            return f(e, null), e.setParams(t), e;
          }, t.setSpeed = function (t, r) {
            var s;
            for (s = 0; s < i; s += 1) {
              e[s].animation.setSpeed(t, r);
            }
          }, t.setDirection = function (t, r) {
            var s;
            for (s = 0; s < i; s += 1) {
              e[s].animation.setDirection(t, r);
            }
          }, t.play = function (t) {
            var r;
            for (r = 0; r < i; r += 1) {
              e[r].animation.play(t);
            }
          }, t.pause = function (t) {
            var r;
            for (r = 0; r < i; r += 1) {
              e[r].animation.pause(t);
            }
          }, t.stop = function (t) {
            var r;
            for (r = 0; r < i; r += 1) {
              e[r].animation.stop(t);
            }
          }, t.togglePause = function (t) {
            var r;
            for (r = 0; r < i; r += 1) {
              e[r].animation.togglePause(t);
            }
          }, t.searchAnimations = function (t, e, r) {
            var i,
              s = [].concat([].slice.call(document.getElementsByClassName("lottie")), [].slice.call(document.getElementsByClassName("bodymovin"))),
              a = s.length;
            for (i = 0; i < a; i += 1) {
              r && s[i].setAttribute("data-bm-type", r), h(s[i], t);
            }
            if (e && 0 === a) {
              r || (r = "svg");
              var n = document.getElementsByTagName("body")[0];
              n.innerHTML = "";
              var o = createTag("div");
              o.style.width = "100%", o.style.height = "100%", o.setAttribute("data-bm-type", r), n.appendChild(o), h(o, t);
            }
          }, t.resize = function () {
            var t;
            for (t = 0; t < i; t += 1) {
              e[t].animation.resize();
            }
          }, t.goToAndStop = function (t, r, s) {
            var a;
            for (a = 0; a < i; a += 1) {
              e[a].animation.goToAndStop(t, r, s);
            }
          }, t.destroy = function (t) {
            var r;
            for (r = i - 1; r >= 0; r -= 1) {
              e[r].animation.destroy(t);
            }
          }, t.freeze = function () {
            n = !0;
          }, t.unfreeze = function () {
            n = !1, d();
          }, t.getRegisteredAnimations = function () {
            var t,
              r = e.length,
              i = [];
            for (t = 0; t < r; t += 1) {
              i.push(e[t].animation);
            }
            return i;
          }, t;
        }(),
        AnimationItem = function AnimationItem() {
          this._cbs = [], this.name = "", this.path = "", this.isLoaded = !1, this.currentFrame = 0, this.currentRawFrame = 0, this.totalFrames = 0, this.frameRate = 0, this.frameMult = 0, this.playSpeed = 1, this.playDirection = 1, this.playCount = 0, this.animationData = {}, this.assets = [], this.isPaused = !0, this.autoplay = !1, this.loop = !0, this.renderer = null, this.animationID = createElementID(), this.assetsPath = "", this.timeCompleted = 0, this.segmentPos = 0, this.subframeEnabled = subframeEnabled, this.segments = [], this._idle = !0, this._completedLoop = !1, this.projectInterface = ProjectInterface(), this.imagePreloader = new ImagePreloader();
        };
      extendPrototype([BaseEvent], AnimationItem), AnimationItem.prototype.setParams = function (t) {
        t.context && (this.context = t.context), (t.wrapper || t.container) && (this.wrapper = t.wrapper || t.container);
        var e = t.animType ? t.animType : t.renderer ? t.renderer : "svg";
        switch (e) {
          case "canvas":
            this.renderer = new CanvasRenderer(this, t.rendererSettings);
            break;
          case "svg":
            this.renderer = new SVGRenderer(this, t.rendererSettings);
            break;
          default:
            this.renderer = new HybridRenderer(this, t.rendererSettings);
        }
        this.renderer.setProjectInterface(this.projectInterface), this.animType = e, "" === t.loop || null === t.loop || (!1 === t.loop ? this.loop = !1 : !0 === t.loop ? this.loop = !0 : this.loop = parseInt(t.loop)), this.autoplay = !("autoplay" in t) || t.autoplay, this.name = t.name ? t.name : "", this.autoloadSegments = !t.hasOwnProperty("autoloadSegments") || t.autoloadSegments, this.assetsPath = t.assetsPath, t.animationData ? this.configAnimation(t.animationData) : t.path && ("json" != t.path.substr(-4) && ("/" != t.path.substr(-1, 1) && (t.path += "/"), t.path += "data.json"), -1 != t.path.lastIndexOf("\\") ? this.path = t.path.substr(0, t.path.lastIndexOf("\\") + 1) : this.path = t.path.substr(0, t.path.lastIndexOf("/") + 1), this.fileName = t.path.substr(t.path.lastIndexOf("/") + 1), this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf(".json")), assetLoader.load(t.path, this.configAnimation.bind(this), function () {
          this.trigger("data_failed");
        }.bind(this)));
      }, AnimationItem.prototype.setData = function (t, e) {
        var r = {
            wrapper: t,
            animationData: e ? "object" === _typeof(e) ? e : JSON.parse(e) : null
          },
          i = t.attributes;
        r.path = i.getNamedItem("data-animation-path") ? i.getNamedItem("data-animation-path").value : i.getNamedItem("data-bm-path") ? i.getNamedItem("data-bm-path").value : i.getNamedItem("bm-path") ? i.getNamedItem("bm-path").value : "", r.animType = i.getNamedItem("data-anim-type") ? i.getNamedItem("data-anim-type").value : i.getNamedItem("data-bm-type") ? i.getNamedItem("data-bm-type").value : i.getNamedItem("bm-type") ? i.getNamedItem("bm-type").value : i.getNamedItem("data-bm-renderer") ? i.getNamedItem("data-bm-renderer").value : i.getNamedItem("bm-renderer") ? i.getNamedItem("bm-renderer").value : "canvas";
        var s = i.getNamedItem("data-anim-loop") ? i.getNamedItem("data-anim-loop").value : i.getNamedItem("data-bm-loop") ? i.getNamedItem("data-bm-loop").value : i.getNamedItem("bm-loop") ? i.getNamedItem("bm-loop").value : "";
        "" === s || (r.loop = "false" !== s && ("true" === s || parseInt(s)));
        var a = i.getNamedItem("data-anim-autoplay") ? i.getNamedItem("data-anim-autoplay").value : i.getNamedItem("data-bm-autoplay") ? i.getNamedItem("data-bm-autoplay").value : !i.getNamedItem("bm-autoplay") || i.getNamedItem("bm-autoplay").value;
        r.autoplay = "false" !== a, r.name = i.getNamedItem("data-name") ? i.getNamedItem("data-name").value : i.getNamedItem("data-bm-name") ? i.getNamedItem("data-bm-name").value : i.getNamedItem("bm-name") ? i.getNamedItem("bm-name").value : "", "false" === (i.getNamedItem("data-anim-prerender") ? i.getNamedItem("data-anim-prerender").value : i.getNamedItem("data-bm-prerender") ? i.getNamedItem("data-bm-prerender").value : i.getNamedItem("bm-prerender") ? i.getNamedItem("bm-prerender").value : "") && (r.prerender = !1), this.setParams(r);
      }, AnimationItem.prototype.includeLayers = function (t) {
        t.op > this.animationData.op && (this.animationData.op = t.op, this.totalFrames = Math.floor(t.op - this.animationData.ip));
        var e,
          r,
          i = this.animationData.layers,
          s = i.length,
          a = t.layers,
          n = a.length;
        for (r = 0; r < n; r += 1) {
          for (e = 0; e < s;) {
            if (i[e].id == a[r].id) {
              i[e] = a[r];
              break;
            }
            e += 1;
          }
        }
        if ((t.chars || t.fonts) && (this.renderer.globalData.fontManager.addChars(t.chars), this.renderer.globalData.fontManager.addFonts(t.fonts, this.renderer.globalData.defs)), t.assets) for (s = t.assets.length, e = 0; e < s; e += 1) {
          this.animationData.assets.push(t.assets[e]);
        }
        this.animationData.__complete = !1, dataManager.completeData(this.animationData, this.renderer.globalData.fontManager), this.renderer.includeLayers(t.layers), expressionsPlugin && expressionsPlugin.initExpressions(this), this.loadNextSegment();
      }, AnimationItem.prototype.loadNextSegment = function () {
        var t = this.animationData.segments;
        if (!t || 0 === t.length || !this.autoloadSegments) return this.trigger("data_ready"), void (this.timeCompleted = this.totalFrames);
        var e = t.shift();
        this.timeCompleted = e.time * this.frameRate;
        var r = this.path + this.fileName + "_" + this.segmentPos + ".json";
        this.segmentPos += 1, assetLoader.load(r, this.includeLayers.bind(this), function () {
          this.trigger("data_failed");
        }.bind(this));
      }, AnimationItem.prototype.loadSegments = function () {
        this.animationData.segments || (this.timeCompleted = this.totalFrames), this.loadNextSegment();
      }, AnimationItem.prototype.imagesLoaded = function () {
        this.trigger("loaded_images"), this.checkLoaded();
      }, AnimationItem.prototype.preloadImages = function () {
        this.imagePreloader.setAssetsPath(this.assetsPath), this.imagePreloader.setPath(this.path), this.imagePreloader.loadAssets(this.animationData.assets, this.imagesLoaded.bind(this));
      }, AnimationItem.prototype.configAnimation = function (t) {
        this.renderer && (this.animationData = t, this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip), this.renderer.configAnimation(t), t.assets || (t.assets = []), this.renderer.searchExtraCompositions(t.assets), this.assets = this.animationData.assets, this.frameRate = this.animationData.fr, this.firstFrame = Math.round(this.animationData.ip), this.frameMult = this.animationData.fr / 1e3, this.trigger("config_ready"), this.preloadImages(), this.loadSegments(), this.updaFrameModifier(), this.waitForFontsLoaded());
      }, AnimationItem.prototype.waitForFontsLoaded = function () {
        this.renderer && (this.renderer.globalData.fontManager.loaded() ? this.checkLoaded() : setTimeout(this.waitForFontsLoaded.bind(this), 20));
      }, AnimationItem.prototype.checkLoaded = function () {
        this.isLoaded || !this.renderer.globalData.fontManager.loaded() || !this.imagePreloader.loaded() && "canvas" === this.renderer.rendererType || (this.isLoaded = !0, dataManager.completeData(this.animationData, this.renderer.globalData.fontManager), expressionsPlugin && expressionsPlugin.initExpressions(this), this.renderer.initItems(), setTimeout(function () {
          this.trigger("DOMLoaded");
        }.bind(this), 0), this.gotoFrame(), this.autoplay && this.play());
      }, AnimationItem.prototype.resize = function () {
        this.renderer.updateContainerSize();
      }, AnimationItem.prototype.setSubframe = function (t) {
        this.subframeEnabled = !!t;
      }, AnimationItem.prototype.gotoFrame = function () {
        this.currentFrame = this.subframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame, this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted && (this.currentFrame = this.timeCompleted), this.trigger("enterFrame"), this.renderFrame();
      }, AnimationItem.prototype.renderFrame = function () {
        !1 !== this.isLoaded && this.renderer.renderFrame(this.currentFrame + this.firstFrame);
      }, AnimationItem.prototype.play = function (t) {
        t && this.name != t || !0 === this.isPaused && (this.isPaused = !1, this._idle && (this._idle = !1, this.trigger("_active")));
      }, AnimationItem.prototype.pause = function (t) {
        t && this.name != t || !1 === this.isPaused && (this.isPaused = !0, this._idle = !0, this.trigger("_idle"));
      }, AnimationItem.prototype.togglePause = function (t) {
        t && this.name != t || (!0 === this.isPaused ? this.play() : this.pause());
      }, AnimationItem.prototype.stop = function (t) {
        t && this.name != t || (this.pause(), this.playCount = 0, this._completedLoop = !1, this.setCurrentRawFrameValue(0));
      }, AnimationItem.prototype.goToAndStop = function (t, e, r) {
        r && this.name != r || (e ? this.setCurrentRawFrameValue(t) : this.setCurrentRawFrameValue(t * this.frameModifier), this.pause());
      }, AnimationItem.prototype.goToAndPlay = function (t, e, r) {
        this.goToAndStop(t, e, r), this.play();
      }, AnimationItem.prototype.advanceTime = function (t) {
        if (!0 !== this.isPaused && !1 !== this.isLoaded) {
          var e = this.currentRawFrame + t * this.frameModifier,
            r = !1;
          e >= this.totalFrames - 1 && this.frameModifier > 0 ? this.loop && this.playCount !== this.loop ? e >= this.totalFrames ? (this.playCount += 1, this.checkSegments(e % this.totalFrames) || (this.setCurrentRawFrameValue(e % this.totalFrames), this._completedLoop = !0, this.trigger("loopComplete"))) : this.setCurrentRawFrameValue(e) : this.checkSegments(e > this.totalFrames ? e % this.totalFrames : 0) || (r = !0, e = this.totalFrames - 1) : e < 0 ? this.checkSegments(e % this.totalFrames) || (!this.loop || this.playCount-- <= 0 && !0 !== this.loop ? (r = !0, e = 0) : (this.setCurrentRawFrameValue(this.totalFrames + e % this.totalFrames), this._completedLoop ? this.trigger("loopComplete") : this._completedLoop = !0)) : this.setCurrentRawFrameValue(e), r && (this.setCurrentRawFrameValue(e), this.pause(), this.trigger("complete"));
        }
      }, AnimationItem.prototype.adjustSegment = function (t, e) {
        this.playCount = 0, t[1] < t[0] ? (this.frameModifier > 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(-1)), this.timeCompleted = this.totalFrames = t[0] - t[1], this.firstFrame = t[1], this.setCurrentRawFrameValue(this.totalFrames - .001 - e)) : t[1] > t[0] && (this.frameModifier < 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(1)), this.timeCompleted = this.totalFrames = t[1] - t[0], this.firstFrame = t[0], this.setCurrentRawFrameValue(.001 + e)), this.trigger("segmentStart");
      }, AnimationItem.prototype.setSegment = function (t, e) {
        var r = -1;
        this.isPaused && (this.currentRawFrame + this.firstFrame < t ? r = t : this.currentRawFrame + this.firstFrame > e && (r = e - t)), this.firstFrame = t, this.timeCompleted = this.totalFrames = e - t, -1 !== r && this.goToAndStop(r, !0);
      }, AnimationItem.prototype.playSegments = function (t, e) {
        if (e && (this.segments.length = 0), "object" === _typeof(t[0])) {
          var r,
            i = t.length;
          for (r = 0; r < i; r += 1) {
            this.segments.push(t[r]);
          }
        } else this.segments.push(t);
        this.segments.length && e && this.adjustSegment(this.segments.shift(), 0), this.isPaused && this.play();
      }, AnimationItem.prototype.resetSegments = function (t) {
        this.segments.length = 0, this.segments.push([this.animationData.ip, this.animationData.op]), t && this.checkSegments(0);
      }, AnimationItem.prototype.checkSegments = function (t) {
        return !!this.segments.length && (this.adjustSegment(this.segments.shift(), t), !0);
      }, AnimationItem.prototype.destroy = function (t) {
        t && this.name != t || !this.renderer || (this.renderer.destroy(), this.imagePreloader.destroy(), this.trigger("destroy"), this._cbs = null, this.onEnterFrame = this.onLoopComplete = this.onComplete = this.onSegmentStart = this.onDestroy = null, this.renderer = null);
      }, AnimationItem.prototype.setCurrentRawFrameValue = function (t) {
        this.currentRawFrame = t, this.gotoFrame();
      }, AnimationItem.prototype.setSpeed = function (t) {
        this.playSpeed = t, this.updaFrameModifier();
      }, AnimationItem.prototype.setDirection = function (t) {
        this.playDirection = t < 0 ? -1 : 1, this.updaFrameModifier();
      }, AnimationItem.prototype.updaFrameModifier = function () {
        this.frameModifier = this.frameMult * this.playSpeed * this.playDirection;
      }, AnimationItem.prototype.getPath = function () {
        return this.path;
      }, AnimationItem.prototype.getAssetsPath = function (t) {
        var e = "";
        if (t.e) e = t.p;else if (this.assetsPath) {
          var r = t.p;
          -1 !== r.indexOf("images/") && (r = r.split("/")[1]), e = this.assetsPath + r;
        } else e = this.path, e += t.u ? t.u : "", e += t.p;
        return e;
      }, AnimationItem.prototype.getAssetData = function (t) {
        for (var e = 0, r = this.assets.length; e < r;) {
          if (t == this.assets[e].id) return this.assets[e];
          e += 1;
        }
      }, AnimationItem.prototype.hide = function () {
        this.renderer.hide();
      }, AnimationItem.prototype.show = function () {
        this.renderer.show();
      }, AnimationItem.prototype.getDuration = function (t) {
        return t ? this.totalFrames : this.totalFrames / this.frameRate;
      }, AnimationItem.prototype.trigger = function (t) {
        if (this._cbs && this._cbs[t]) switch (t) {
          case "enterFrame":
            this.triggerEvent(t, new BMEnterFrameEvent(t, this.currentFrame, this.totalFrames, this.frameModifier));
            break;
          case "loopComplete":
            this.triggerEvent(t, new BMCompleteLoopEvent(t, this.loop, this.playCount, this.frameMult));
            break;
          case "complete":
            this.triggerEvent(t, new BMCompleteEvent(t, this.frameMult));
            break;
          case "segmentStart":
            this.triggerEvent(t, new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames));
            break;
          case "destroy":
            this.triggerEvent(t, new BMDestroyEvent(t, this));
            break;
          default:
            this.triggerEvent(t);
        }
        "enterFrame" === t && this.onEnterFrame && this.onEnterFrame.call(this, new BMEnterFrameEvent(t, this.currentFrame, this.totalFrames, this.frameMult)), "loopComplete" === t && this.onLoopComplete && this.onLoopComplete.call(this, new BMCompleteLoopEvent(t, this.loop, this.playCount, this.frameMult)), "complete" === t && this.onComplete && this.onComplete.call(this, new BMCompleteEvent(t, this.frameMult)), "segmentStart" === t && this.onSegmentStart && this.onSegmentStart.call(this, new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames)), "destroy" === t && this.onDestroy && this.onDestroy.call(this, new BMDestroyEvent(t, this));
      };
      var Expressions = function () {
        var t = {};
        return t.initExpressions = function (t) {
          var e = 0,
            r = [];
          t.renderer.compInterface = CompExpressionInterface(t.renderer), t.renderer.globalData.projectInterface.registerComposition(t.renderer), t.renderer.globalData.pushExpression = function () {
            e += 1;
          }, t.renderer.globalData.popExpression = function () {
            0 === (e -= 1) && function () {
              var t,
                e = r.length;
              for (t = 0; t < e; t += 1) {
                r[t].release();
              }
              r.length = 0;
            }();
          }, t.renderer.globalData.registerExpressionProperty = function (t) {
            -1 === r.indexOf(t) && r.push(t);
          };
        }, t;
      }();
      expressionsPlugin = Expressions;
      var ExpressionManager = function () {
          var ob = {},
            Math = BMMath,
            window = null,
            document = null;
          function $bm_isInstanceOfArray(t) {
            return t.constructor === Array || t.constructor === Float32Array;
          }
          function isNumerable(t, e) {
            return "number" === t || "boolean" === t || "string" === t || e instanceof Number;
          }
          function $bm_neg(t) {
            var e = _typeof(t);
            if ("number" === e || "boolean" === e || t instanceof Number) return -t;
            if ($bm_isInstanceOfArray(t)) {
              var r,
                i = t.length,
                s = [];
              for (r = 0; r < i; r += 1) {
                s[r] = -t[r];
              }
              return s;
            }
            return t.propType ? t.v : void 0;
          }
          var easeInBez = BezierFactory.getBezierEasing(.333, 0, .833, .833, "easeIn").get,
            easeOutBez = BezierFactory.getBezierEasing(.167, .167, .667, 1, "easeOut").get,
            easeInOutBez = BezierFactory.getBezierEasing(.33, 0, .667, 1, "easeInOut").get;
          function sum(t, e) {
            var r = _typeof(t),
              i = _typeof(e);
            if ("string" === r || "string" === i) return t + e;
            if (isNumerable(r, t) && isNumerable(i, e)) return t + e;
            if ($bm_isInstanceOfArray(t) && isNumerable(i, e)) return (t = t.slice(0))[0] = t[0] + e, t;
            if (isNumerable(r, t) && $bm_isInstanceOfArray(e)) return (e = e.slice(0))[0] = t + e[0], e;
            if ($bm_isInstanceOfArray(t) && $bm_isInstanceOfArray(e)) {
              for (var s = 0, a = t.length, n = e.length, o = []; s < a || s < n;) {
                ("number" == typeof t[s] || t[s] instanceof Number) && ("number" == typeof e[s] || e[s] instanceof Number) ? o[s] = t[s] + e[s] : o[s] = void 0 === e[s] ? t[s] : t[s] || e[s], s += 1;
              }
              return o;
            }
            return 0;
          }
          var add = sum;
          function sub(t, e) {
            var r = _typeof(t),
              i = _typeof(e);
            if (isNumerable(r, t) && isNumerable(i, e)) return "string" === r && (t = parseInt(t)), "string" === i && (e = parseInt(e)), t - e;
            if ($bm_isInstanceOfArray(t) && isNumerable(i, e)) return (t = t.slice(0))[0] = t[0] - e, t;
            if (isNumerable(r, t) && $bm_isInstanceOfArray(e)) return (e = e.slice(0))[0] = t - e[0], e;
            if ($bm_isInstanceOfArray(t) && $bm_isInstanceOfArray(e)) {
              for (var s = 0, a = t.length, n = e.length, o = []; s < a || s < n;) {
                ("number" == typeof t[s] || t[s] instanceof Number) && ("number" == typeof e[s] || e[s] instanceof Number) ? o[s] = t[s] - e[s] : o[s] = void 0 === e[s] ? t[s] : t[s] || e[s], s += 1;
              }
              return o;
            }
            return 0;
          }
          function mul(t, e) {
            var r,
              i,
              s,
              a = _typeof(t),
              n = _typeof(e);
            if (isNumerable(a, t) && isNumerable(n, e)) return t * e;
            if ($bm_isInstanceOfArray(t) && isNumerable(n, e)) {
              for (s = t.length, r = createTypedArray("float32", s), i = 0; i < s; i += 1) {
                r[i] = t[i] * e;
              }
              return r;
            }
            if (isNumerable(a, t) && $bm_isInstanceOfArray(e)) {
              for (s = e.length, r = createTypedArray("float32", s), i = 0; i < s; i += 1) {
                r[i] = t * e[i];
              }
              return r;
            }
            return 0;
          }
          function div(t, e) {
            var r,
              i,
              s,
              a = _typeof(t),
              n = _typeof(e);
            if (isNumerable(a, t) && isNumerable(n, e)) return t / e;
            if ($bm_isInstanceOfArray(t) && isNumerable(n, e)) {
              for (s = t.length, r = createTypedArray("float32", s), i = 0; i < s; i += 1) {
                r[i] = t[i] / e;
              }
              return r;
            }
            if (isNumerable(a, t) && $bm_isInstanceOfArray(e)) {
              for (s = e.length, r = createTypedArray("float32", s), i = 0; i < s; i += 1) {
                r[i] = t / e[i];
              }
              return r;
            }
            return 0;
          }
          function mod(t, e) {
            return "string" == typeof t && (t = parseInt(t)), "string" == typeof e && (e = parseInt(e)), t % e;
          }
          var $bm_sum = sum,
            $bm_sub = sub,
            $bm_mul = mul,
            $bm_div = div,
            $bm_mod = mod;
          function clamp(t, e, r) {
            if (e > r) {
              var i = r;
              r = e, e = i;
            }
            return Math.min(Math.max(t, e), r);
          }
          function radiansToDegrees(t) {
            return t / degToRads;
          }
          var radians_to_degrees = radiansToDegrees;
          function degreesToRadians(t) {
            return t * degToRads;
          }
          var degrees_to_radians = radiansToDegrees,
            helperLengthArray = [0, 0, 0, 0, 0, 0];
          function length(t, e) {
            if ("number" == typeof t || t instanceof Number) return e = e || 0, Math.abs(t - e);
            e || (e = helperLengthArray);
            var r,
              i = Math.min(t.length, e.length),
              s = 0;
            for (r = 0; r < i; r += 1) {
              s += Math.pow(e[r] - t[r], 2);
            }
            return Math.sqrt(s);
          }
          function normalize(t) {
            return div(t, length(t));
          }
          function rgbToHsl(t) {
            var e,
              r,
              i = t[0],
              s = t[1],
              a = t[2],
              n = Math.max(i, s, a),
              o = Math.min(i, s, a),
              h = (n + o) / 2;
            if (n == o) e = r = 0;else {
              var l = n - o;
              switch (r = h > .5 ? l / (2 - n - o) : l / (n + o), n) {
                case i:
                  e = (s - a) / l + (s < a ? 6 : 0);
                  break;
                case s:
                  e = (a - i) / l + 2;
                  break;
                case a:
                  e = (i - s) / l + 4;
              }
              e /= 6;
            }
            return [e, r, h, t[3]];
          }
          function hue2rgb(t, e, r) {
            return r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? t + 6 * (e - t) * r : r < .5 ? e : r < 2 / 3 ? t + (e - t) * (2 / 3 - r) * 6 : t;
          }
          function hslToRgb(t) {
            var e,
              r,
              i,
              s = t[0],
              a = t[1],
              n = t[2];
            if (0 === a) e = r = i = n;else {
              var o = n < .5 ? n * (1 + a) : n + a - n * a,
                h = 2 * n - o;
              e = hue2rgb(h, o, s + 1 / 3), r = hue2rgb(h, o, s), i = hue2rgb(h, o, s - 1 / 3);
            }
            return [e, r, i, t[3]];
          }
          function linear(t, e, r, i, s) {
            if (void 0 !== i && void 0 !== s || (i = e, s = r, e = 0, r = 1), r < e) {
              var a = r;
              r = e, e = a;
            }
            if (t <= e) return i;
            if (t >= r) return s;
            var n = r === e ? 0 : (t - e) / (r - e);
            if (!i.length) return i + (s - i) * n;
            var o,
              h = i.length,
              l = createTypedArray("float32", h);
            for (o = 0; o < h; o += 1) {
              l[o] = i[o] + (s[o] - i[o]) * n;
            }
            return l;
          }
          function random(t, e) {
            if (void 0 === e && (void 0 === t ? (t = 0, e = 1) : (e = t, t = void 0)), e.length) {
              var r,
                i = e.length;
              t || (t = createTypedArray("float32", i));
              var s = createTypedArray("float32", i),
                a = BMMath.random();
              for (r = 0; r < i; r += 1) {
                s[r] = t[r] + a * (e[r] - t[r]);
              }
              return s;
            }
            return void 0 === t && (t = 0), t + BMMath.random() * (e - t);
          }
          function createPath(t, e, r, i) {
            var s,
              a = t.length,
              n = shape_pool.newElement();
            n.setPathData(!!i, a);
            var o,
              h,
              l = [0, 0];
            for (s = 0; s < a; s += 1) {
              o = e && e[s] ? e[s] : l, h = r && r[s] ? r[s] : l, n.setTripleAt(t[s][0], t[s][1], h[0] + t[s][0], h[1] + t[s][1], o[0] + t[s][0], o[1] + t[s][1], s, !0);
            }
            return n;
          }
          function initiateExpression(elem, data, property) {
            var val = data.x,
              needsVelocity = /velocity(?![\w\d])/.test(val),
              _needsRandom = -1 !== val.indexOf("random"),
              elemType = elem.data.ty,
              transform,
              $bm_transform,
              content,
              effect,
              thisProperty = property;
            thisProperty.valueAtTime = thisProperty.getValueAtTime, Object.defineProperty(thisProperty, "value", {
              get: function get() {
                return thisProperty.v;
              }
            }), elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate, elem.comp.displayStartTime = 0;
            var inPoint = elem.data.ip / elem.comp.globalData.frameRate,
              outPoint = elem.data.op / elem.comp.globalData.frameRate,
              width = elem.data.sw ? elem.data.sw : 0,
              height = elem.data.sh ? elem.data.sh : 0,
              name = elem.data.nm,
              loopIn,
              loop_in,
              loopOut,
              loop_out,
              smooth,
              toWorld,
              fromWorld,
              fromComp,
              toComp,
              fromCompToSurface,
              position,
              rotation,
              anchorPoint,
              scale,
              thisLayer,
              thisComp,
              mask,
              valueAtTime,
              velocityAtTime,
              __expression_functions = [],
              scoped_bm_rt;
            if (data.xf) {
              var i,
                len = data.xf.length;
              for (i = 0; i < len; i += 1) {
                __expression_functions[i] = eval("(function(){ return " + data.xf[i] + "}())");
              }
            }
            var expression_function = eval("[function _expression_function(){" + val + ";scoped_bm_rt=$bm_rt}]")[0],
              numKeys = property.kf ? data.k.length : 0,
              active = !this.data || !0 !== this.data.hd,
              wiggle = function (t, e) {
                var r,
                  i,
                  s = this.pv.length ? this.pv.length : 1,
                  a = createTypedArray("float32", s);
                var n = Math.floor(5 * time);
                for (r = 0, i = 0; r < n;) {
                  for (i = 0; i < s; i += 1) {
                    a[i] += -e + 2 * e * BMMath.random();
                  }
                  r += 1;
                }
                var o = 5 * time,
                  h = o - Math.floor(o),
                  l = createTypedArray("float32", s);
                if (s > 1) {
                  for (i = 0; i < s; i += 1) {
                    l[i] = this.pv[i] + a[i] + (-e + 2 * e * BMMath.random()) * h;
                  }
                  return l;
                }
                return this.pv + a[0] + (-e + 2 * e * BMMath.random()) * h;
              }.bind(this);
            function loopInDuration(t, e) {
              return loopIn(t, e, !0);
            }
            function loopOutDuration(t, e) {
              return loopOut(t, e, !0);
            }
            thisProperty.loopIn && (loopIn = thisProperty.loopIn.bind(thisProperty), loop_in = loopIn), thisProperty.loopOut && (loopOut = thisProperty.loopOut.bind(thisProperty), loop_out = loopOut), thisProperty.smooth && (smooth = thisProperty.smooth.bind(thisProperty)), this.getValueAtTime && (valueAtTime = this.getValueAtTime.bind(this)), this.getVelocityAtTime && (velocityAtTime = this.getVelocityAtTime.bind(this));
            var comp = elem.comp.globalData.projectInterface.bind(elem.comp.globalData.projectInterface),
              time,
              velocity,
              value,
              text,
              textIndex,
              textTotal,
              selectorValue;
            function lookAt(t, e) {
              var r = [e[0] - t[0], e[1] - t[1], e[2] - t[2]],
                i = Math.atan2(r[0], Math.sqrt(r[1] * r[1] + r[2] * r[2])) / degToRads;
              return [-Math.atan2(r[1], r[2]) / degToRads, i, 0];
            }
            function easeOut(t, e, r, i, s) {
              return applyEase(easeOutBez, t, e, r, i, s);
            }
            function easeIn(t, e, r, i, s) {
              return applyEase(easeInBez, t, e, r, i, s);
            }
            function ease(t, e, r, i, s) {
              return applyEase(easeInOutBez, t, e, r, i, s);
            }
            function applyEase(t, e, r, i, s, a) {
              void 0 === s ? (s = r, a = i) : e = (e - r) / (i - r);
              var n = t(e = e > 1 ? 1 : e < 0 ? 0 : e);
              if ($bm_isInstanceOfArray(s)) {
                var o,
                  h = s.length,
                  l = createTypedArray("float32", h);
                for (o = 0; o < h; o += 1) {
                  l[o] = (a[o] - s[o]) * n + s[o];
                }
                return l;
              }
              return (a - s) * n + s;
            }
            function nearestKey(t) {
              var e,
                r,
                i,
                s = data.k.length;
              if (data.k.length && "number" != typeof data.k[0]) {
                if (r = -1, (t *= elem.comp.globalData.frameRate) < data.k[0].t) r = 1, i = data.k[0].t;else {
                  for (e = 0; e < s - 1; e += 1) {
                    if (t === data.k[e].t) {
                      r = e + 1, i = data.k[e].t;
                      break;
                    }
                    if (t > data.k[e].t && t < data.k[e + 1].t) {
                      t - data.k[e].t > data.k[e + 1].t - t ? (r = e + 2, i = data.k[e + 1].t) : (r = e + 1, i = data.k[e].t);
                      break;
                    }
                  }
                  -1 === r && (r = e + 1, i = data.k[e].t);
                }
              } else r = 0, i = 0;
              var a = {};
              return a.index = r, a.time = i / elem.comp.globalData.frameRate, a;
            }
            function key(t) {
              var e, r, i;
              if (!data.k.length || "number" == typeof data.k[0]) throw new Error("The property has no keyframe at index " + t);
              t -= 1, e = {
                time: data.k[t].t / elem.comp.globalData.frameRate,
                value: []
              };
              var s = data.k[t].hasOwnProperty("s") ? data.k[t].s : data.k[t - 1].e;
              for (i = s.length, r = 0; r < i; r += 1) {
                e[r] = s[r], e.value[r] = s[r];
              }
              return e;
            }
            function framesToTime(t, e) {
              return e || (e = elem.comp.globalData.frameRate), t / e;
            }
            function timeToFrames(t, e) {
              return t || 0 === t || (t = time), e || (e = elem.comp.globalData.frameRate), t * e;
            }
            function seedRandom(t) {
              BMMath.seedrandom(randSeed + t);
            }
            function sourceRectAtTime() {
              return elem.sourceRectAtTime();
            }
            function substring(t, e) {
              return "string" == typeof value ? void 0 === e ? value.substring(t) : value.substring(t, e) : "";
            }
            function substr(t, e) {
              return "string" == typeof value ? void 0 === e ? value.substr(t) : value.substr(t, e) : "";
            }
            var index = elem.data.ind,
              hasParent = !(!elem.hierarchy || !elem.hierarchy.length),
              parent,
              randSeed = Math.floor(1e6 * Math.random()),
              globalData = elem.globalData;
            function executeExpression(t) {
              return value = t, _needsRandom && seedRandom(randSeed), this.frameExpressionId === elem.globalData.frameId && "textSelector" !== this.propType ? value : ("textSelector" === this.propType && (textIndex = this.textIndex, textTotal = this.textTotal, selectorValue = this.selectorValue), thisLayer || (text = elem.layerInterface.text, thisLayer = elem.layerInterface, thisComp = elem.comp.compInterface, toWorld = thisLayer.toWorld.bind(thisLayer), fromWorld = thisLayer.fromWorld.bind(thisLayer), fromComp = thisLayer.fromComp.bind(thisLayer), toComp = thisLayer.toComp.bind(thisLayer), mask = thisLayer.mask ? thisLayer.mask.bind(thisLayer) : null, fromCompToSurface = fromComp), transform || (transform = elem.layerInterface("ADBE Transform Group"), $bm_transform = transform, transform && (anchorPoint = transform.anchorPoint)), 4 !== elemType || content || (content = thisLayer("ADBE Root Vectors Group")), effect || (effect = thisLayer(4)), (hasParent = !(!elem.hierarchy || !elem.hierarchy.length)) && !parent && (parent = elem.hierarchy[0].layerInterface), time = this.comp.renderedFrame / this.comp.globalData.frameRate, needsVelocity && (velocity = velocityAtTime(time)), expression_function(), this.frameExpressionId = elem.globalData.frameId, "shape" === scoped_bm_rt.propType && (scoped_bm_rt = scoped_bm_rt.v), scoped_bm_rt);
            }
            return executeExpression;
          }
          return ob.initiateExpression = initiateExpression, ob;
        }(),
        expressionHelpers = {
          searchExpressions: function searchExpressions(t, e, r) {
            e.x && (r.k = !0, r.x = !0, r.initiateExpression = ExpressionManager.initiateExpression, r.effectsSequence.push(r.initiateExpression(t, e, r).bind(r)));
          },
          getSpeedAtTime: function getSpeedAtTime(t) {
            var e = this.getValueAtTime(t),
              r = this.getValueAtTime(t + -.01),
              i = 0;
            if (e.length) {
              var s;
              for (s = 0; s < e.length; s += 1) {
                i += Math.pow(r[s] - e[s], 2);
              }
              i = 100 * Math.sqrt(i);
            } else i = 0;
            return i;
          },
          getVelocityAtTime: function getVelocityAtTime(t) {
            if (void 0 !== this.vel) return this.vel;
            var e,
              r,
              i = this.getValueAtTime(t),
              s = this.getValueAtTime(t + -.001);
            if (i.length) for (e = createTypedArray("float32", i.length), r = 0; r < i.length; r += 1) {
              e[r] = (s[r] - i[r]) / -.001;
            } else e = (s - i) / -.001;
            return e;
          },
          getValueAtTime: function getValueAtTime(t) {
            return t *= this.elem.globalData.frameRate, (t -= this.offsetTime) !== this._cachingAtTime.lastFrame && (this._cachingAtTime.lastIndex = this._cachingAtTime.lastFrame < t ? this._cachingAtTime.lastIndex : 0, this._cachingAtTime.value = this.interpolateValue(t, this._cachingAtTime), this._cachingAtTime.lastFrame = t), this._cachingAtTime.value;
          },
          getStaticValueAtTime: function getStaticValueAtTime() {
            return this.pv;
          },
          setGroupProperty: function setGroupProperty(t) {
            this.propertyGroup = t;
          }
        };
      !function () {
        function t(t, e, r) {
          if (!this.k || !this.keyframes) return this.pv;
          t = t ? t.toLowerCase() : "";
          var i,
            s,
            a,
            n,
            o,
            h = this.comp.renderedFrame,
            l = this.keyframes,
            p = l[l.length - 1].t;
          if (h <= p) return this.pv;
          if (r ? s = p - (i = e ? Math.abs(p - elem.comp.globalData.frameRate * e) : Math.max(0, p - this.elem.data.ip)) : ((!e || e > l.length - 1) && (e = l.length - 1), i = p - (s = l[l.length - 1 - e].t)), "pingpong" === t) {
            if (Math.floor((h - s) / i) % 2 != 0) return this.getValueAtTime((i - (h - s) % i + s) / this.comp.globalData.frameRate, 0);
          } else {
            if ("offset" === t) {
              var f = this.getValueAtTime(s / this.comp.globalData.frameRate, 0),
                m = this.getValueAtTime(p / this.comp.globalData.frameRate, 0),
                c = this.getValueAtTime(((h - s) % i + s) / this.comp.globalData.frameRate, 0),
                d = Math.floor((h - s) / i);
              if (this.pv.length) {
                for (n = (o = new Array(f.length)).length, a = 0; a < n; a += 1) {
                  o[a] = (m[a] - f[a]) * d + c[a];
                }
                return o;
              }
              return (m - f) * d + c;
            }
            if ("continue" === t) {
              var u = this.getValueAtTime(p / this.comp.globalData.frameRate, 0),
                y = this.getValueAtTime((p - .001) / this.comp.globalData.frameRate, 0);
              if (this.pv.length) {
                for (n = (o = new Array(u.length)).length, a = 0; a < n; a += 1) {
                  o[a] = u[a] + (u[a] - y[a]) * ((h - p) / this.comp.globalData.frameRate) / 5e-4;
                }
                return o;
              }
              return u + (h - p) / .001 * (u - y);
            }
          }
          return this.getValueAtTime(((h - s) % i + s) / this.comp.globalData.frameRate, 0);
        }
        function e(t, e, r) {
          if (!this.k) return this.pv;
          t = t ? t.toLowerCase() : "";
          var i,
            s,
            a,
            n,
            o,
            h = this.comp.renderedFrame,
            l = this.keyframes,
            p = l[0].t;
          if (h >= p) return this.pv;
          if (r ? s = p + (i = e ? Math.abs(elem.comp.globalData.frameRate * e) : Math.max(0, this.elem.data.op - p)) : ((!e || e > l.length - 1) && (e = l.length - 1), i = (s = l[e].t) - p), "pingpong" === t) {
            if (Math.floor((p - h) / i) % 2 == 0) return this.getValueAtTime(((p - h) % i + p) / this.comp.globalData.frameRate, 0);
          } else {
            if ("offset" === t) {
              var f = this.getValueAtTime(p / this.comp.globalData.frameRate, 0),
                m = this.getValueAtTime(s / this.comp.globalData.frameRate, 0),
                c = this.getValueAtTime((i - (p - h) % i + p) / this.comp.globalData.frameRate, 0),
                d = Math.floor((p - h) / i) + 1;
              if (this.pv.length) {
                for (n = (o = new Array(f.length)).length, a = 0; a < n; a += 1) {
                  o[a] = c[a] - (m[a] - f[a]) * d;
                }
                return o;
              }
              return c - (m - f) * d;
            }
            if ("continue" === t) {
              var u = this.getValueAtTime(p / this.comp.globalData.frameRate, 0),
                y = this.getValueAtTime((p + .001) / this.comp.globalData.frameRate, 0);
              if (this.pv.length) {
                for (n = (o = new Array(u.length)).length, a = 0; a < n; a += 1) {
                  o[a] = u[a] + (u[a] - y[a]) * (p - h) / .001;
                }
                return o;
              }
              return u + (u - y) * (p - h) / .001;
            }
          }
          return this.getValueAtTime((i - (p - h) % i + p) / this.comp.globalData.frameRate, 0);
        }
        function r(t, e) {
          if (!this.k) return this.pv;
          if (t = .5 * (t || .4), (e = Math.floor(e || 5)) <= 1) return this.pv;
          var r,
            i,
            s = this.comp.renderedFrame / this.comp.globalData.frameRate,
            a = s - t,
            n = e > 1 ? (s + t - a) / (e - 1) : 1,
            o = 0,
            h = 0;
          for (r = this.pv.length ? createTypedArray("float32", this.pv.length) : 0; o < e;) {
            if (i = this.getValueAtTime(a + o * n), this.pv.length) for (h = 0; h < this.pv.length; h += 1) {
              r[h] += i[h];
            } else r += i;
            o += 1;
          }
          if (this.pv.length) for (h = 0; h < this.pv.length; h += 1) {
            r[h] /= e;
          } else r /= e;
          return r;
        }
        function i(t) {
          console.warn("Transform at time not supported");
        }
        function s(t) {}
        var a = TransformPropertyFactory.getTransformProperty;
        TransformPropertyFactory.getTransformProperty = function (t, e, r) {
          var n = a(t, e, r);
          return n.dynamicProperties.length ? n.getValueAtTime = i.bind(n) : n.getValueAtTime = s.bind(n), n.setGroupProperty = expressionHelpers.setGroupProperty, n;
        };
        var n = PropertyFactory.getProp;
        PropertyFactory.getProp = function (i, s, a, o, h) {
          var l = n(i, s, a, o, h);
          l.kf ? l.getValueAtTime = expressionHelpers.getValueAtTime.bind(l) : l.getValueAtTime = expressionHelpers.getStaticValueAtTime.bind(l), l.setGroupProperty = expressionHelpers.setGroupProperty, l.loopOut = t, l.loopIn = e, l.smooth = r, l.getVelocityAtTime = expressionHelpers.getVelocityAtTime.bind(l), l.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(l), l.numKeys = 1 === s.a ? s.k.length : 0, l.propertyIndex = s.ix;
          var p = 0;
          return 0 !== a && (p = createTypedArray("float32", 1 === s.a ? s.k[0].s.length : s.k.length)), l._cachingAtTime = {
            lastFrame: initialDefaultFrame,
            lastIndex: 0,
            value: p
          }, expressionHelpers.searchExpressions(i, s, l), l.k && h.addDynamicProperty(l), l;
        };
        var o = ShapePropertyFactory.getConstructorFunction(),
          h = ShapePropertyFactory.getKeyframedConstructorFunction();
        function l() {}
        l.prototype = {
          vertices: function vertices(t, e) {
            this.k && this.getValue();
            var r = this.v;
            void 0 !== e && (r = this.getValueAtTime(e, 0));
            var i,
              s = r._length,
              a = r[t],
              n = r.v,
              o = createSizedArray(s);
            for (i = 0; i < s; i += 1) {
              o[i] = "i" === t || "o" === t ? [a[i][0] - n[i][0], a[i][1] - n[i][1]] : [a[i][0], a[i][1]];
            }
            return o;
          },
          points: function points(t) {
            return this.vertices("v", t);
          },
          inTangents: function inTangents(t) {
            return this.vertices("i", t);
          },
          outTangents: function outTangents(t) {
            return this.vertices("o", t);
          },
          isClosed: function isClosed() {
            return this.v.c;
          },
          pointOnPath: function pointOnPath(t, e) {
            var r = this.v;
            void 0 !== e && (r = this.getValueAtTime(e, 0)), this._segmentsLength || (this._segmentsLength = bez.getSegmentsLength(r));
            for (var i, s = this._segmentsLength, a = s.lengths, n = s.totalLength * t, o = 0, h = a.length, l = 0; o < h;) {
              if (l + a[o].addedLength > n) {
                var p = o,
                  f = r.c && o === h - 1 ? 0 : o + 1,
                  m = (n - l) / a[o].addedLength;
                i = bez.getPointInSegment(r.v[p], r.v[f], r.o[p], r.i[f], m, a[o]);
                break;
              }
              l += a[o].addedLength, o += 1;
            }
            return i || (i = r.c ? [r.v[0][0], r.v[0][1]] : [r.v[r._length - 1][0], r.v[r._length - 1][1]]), i;
          },
          vectorOnPath: function vectorOnPath(t, e, r) {
            t = 1 == t ? this.v.c ? 0 : .999 : t;
            var i = this.pointOnPath(t, e),
              s = this.pointOnPath(t + .001, e),
              a = s[0] - i[0],
              n = s[1] - i[1],
              o = Math.sqrt(Math.pow(a, 2) + Math.pow(n, 2));
            return 0 === o ? [0, 0] : "tangent" === r ? [a / o, n / o] : [-n / o, a / o];
          },
          tangentOnPath: function tangentOnPath(t, e) {
            return this.vectorOnPath(t, e, "tangent");
          },
          normalOnPath: function normalOnPath(t, e) {
            return this.vectorOnPath(t, e, "normal");
          },
          setGroupProperty: expressionHelpers.setGroupProperty,
          getValueAtTime: expressionHelpers.getStaticValueAtTime
        }, extendPrototype([l], o), extendPrototype([l], h), h.prototype.getValueAtTime = function (t) {
          return this._cachingAtTime || (this._cachingAtTime = {
            shapeValue: shape_pool.clone(this.pv),
            lastIndex: 0,
            lastTime: initialDefaultFrame
          }), t *= this.elem.globalData.frameRate, (t -= this.offsetTime) !== this._cachingAtTime.lastTime && (this._cachingAtTime.lastIndex = this._cachingAtTime.lastTime < t ? this._caching.lastIndex : 0, this._cachingAtTime.lastTime = t, this.interpolateShape(t, this._cachingAtTime.shapeValue, this._cachingAtTime)), this._cachingAtTime.shapeValue;
        }, h.prototype.initiateExpression = ExpressionManager.initiateExpression;
        var p = ShapePropertyFactory.getShapeProp;
        ShapePropertyFactory.getShapeProp = function (t, e, r, i, s) {
          var a = p(t, e, r, i, s);
          return a.propertyIndex = e.ix, a.lock = !1, 3 === r ? expressionHelpers.searchExpressions(t, e.pt, a) : 4 === r && expressionHelpers.searchExpressions(t, e.ks, a), a.k && t.addDynamicProperty(a), a;
        };
      }(), TextProperty.prototype.getExpressionValue = function (t, e) {
        var r = this.calculateExpression(e);
        if (t.t !== r) {
          var i = {};
          return this.copyData(i, t), i.t = r.toString(), i.__complete = !1, i;
        }
        return t;
      }, TextProperty.prototype.searchProperty = function () {
        var t = this.searchKeyframes(),
          e = this.searchExpressions();
        return this.kf = t || e, this.kf;
      }, TextProperty.prototype.searchExpressions = function () {
        if (this.data.d.x) return this.calculateExpression = ExpressionManager.initiateExpression.bind(this)(this.elem, this.data.d, this), this.addEffect(this.getExpressionValue.bind(this)), !0;
      };
      var ShapeExpressionInterface = function () {
          function t(t, f, m) {
            var c,
              d = [],
              u = t ? t.length : 0;
            for (c = 0; c < u; c += 1) {
              "gr" == t[c].ty ? d.push(e(t[c], f[c], m)) : "fl" == t[c].ty ? d.push(r(t[c], f[c], m)) : "st" == t[c].ty ? d.push(i(t[c], f[c], m)) : "tm" == t[c].ty ? d.push(s(t[c], f[c], m)) : "tr" == t[c].ty || ("el" == t[c].ty ? d.push(a(t[c], f[c], m)) : "sr" == t[c].ty ? d.push(n(t[c], f[c], m)) : "sh" == t[c].ty ? d.push(p(t[c], f[c], m)) : "rc" == t[c].ty ? d.push(o(t[c], f[c], m)) : "rd" == t[c].ty ? d.push(h(t[c], f[c], m)) : "rp" == t[c].ty && d.push(l(t[c], f[c], m)));
            }
            return d;
          }
          function e(e, r, i) {
            var s = function s(t) {
              switch (t) {
                case "ADBE Vectors Group":
                case "Contents":
                case 2:
                  return s.content;
                default:
                  return s.transform;
              }
            };
            s.propertyGroup = function (t) {
              return 1 === t ? s : i(t - 1);
            };
            var a = function (e, r, i) {
                var s,
                  a = function a(t) {
                    for (var e = 0, r = s.length; e < r;) {
                      if (s[e]._name === t || s[e].mn === t || s[e].propertyIndex === t || s[e].ix === t || s[e].ind === t) return s[e];
                      e += 1;
                    }
                    if ("number" == typeof t) return s[t - 1];
                  };
                return a.propertyGroup = function (t) {
                  return 1 === t ? a : i(t - 1);
                }, s = t(e.it, r.it, a.propertyGroup), a.numProperties = s.length, a.propertyIndex = e.cix, a._name = e.nm, a;
              }(e, r, s.propertyGroup),
              n = function (t, e, r) {
                function i(t) {
                  return 1 == t ? s : r(--t);
                }
                e.transform.mProps.o.setGroupProperty(i), e.transform.mProps.p.setGroupProperty(i), e.transform.mProps.a.setGroupProperty(i), e.transform.mProps.s.setGroupProperty(i), e.transform.mProps.r.setGroupProperty(i), e.transform.mProps.sk && (e.transform.mProps.sk.setGroupProperty(i), e.transform.mProps.sa.setGroupProperty(i));
                function s(e) {
                  return t.a.ix === e || "Anchor Point" === e ? s.anchorPoint : t.o.ix === e || "Opacity" === e ? s.opacity : t.p.ix === e || "Position" === e ? s.position : t.r.ix === e || "Rotation" === e || "ADBE Vector Rotation" === e ? s.rotation : t.s.ix === e || "Scale" === e ? s.scale : t.sk && t.sk.ix === e || "Skew" === e ? s.skew : t.sa && t.sa.ix === e || "Skew Axis" === e ? s.skewAxis : void 0;
                }
                return e.transform.op.setGroupProperty(i), Object.defineProperties(s, {
                  opacity: {
                    get: ExpressionPropertyInterface(e.transform.mProps.o)
                  },
                  position: {
                    get: ExpressionPropertyInterface(e.transform.mProps.p)
                  },
                  anchorPoint: {
                    get: ExpressionPropertyInterface(e.transform.mProps.a)
                  },
                  scale: {
                    get: ExpressionPropertyInterface(e.transform.mProps.s)
                  },
                  rotation: {
                    get: ExpressionPropertyInterface(e.transform.mProps.r)
                  },
                  skew: {
                    get: ExpressionPropertyInterface(e.transform.mProps.sk)
                  },
                  skewAxis: {
                    get: ExpressionPropertyInterface(e.transform.mProps.sa)
                  },
                  _name: {
                    value: t.nm
                  }
                }), s.ty = "tr", s.mn = t.mn, s.propertyGroup = r, s;
              }(e.it[e.it.length - 1], r.it[r.it.length - 1], s.propertyGroup);
            return s.content = a, s.transform = n, Object.defineProperty(s, "_name", {
              get: function get() {
                return e.nm;
              }
            }), s.numProperties = e.np, s.propertyIndex = e.ix, s.nm = e.nm, s.mn = e.mn, s;
          }
          function r(t, e, r) {
            function i(t) {
              return "Color" === t || "color" === t ? i.color : "Opacity" === t || "opacity" === t ? i.opacity : void 0;
            }
            return Object.defineProperties(i, {
              color: {
                get: ExpressionPropertyInterface(e.c)
              },
              opacity: {
                get: ExpressionPropertyInterface(e.o)
              },
              _name: {
                value: t.nm
              },
              mn: {
                value: t.mn
              }
            }), e.c.setGroupProperty(r), e.o.setGroupProperty(r), i;
          }
          function i(t, e, r) {
            function i(t) {
              return 1 === t ? ob : r(t - 1);
            }
            function s(t) {
              return 1 === t ? h : i(t - 1);
            }
            function a(r) {
              Object.defineProperty(h, t.d[r].nm, {
                get: ExpressionPropertyInterface(e.d.dataProps[r].p)
              });
            }
            var n,
              o = t.d ? t.d.length : 0,
              h = {};
            for (n = 0; n < o; n += 1) {
              a(n), e.d.dataProps[n].p.setGroupProperty(s);
            }
            function l(t) {
              return "Color" === t || "color" === t ? l.color : "Opacity" === t || "opacity" === t ? l.opacity : "Stroke Width" === t || "stroke width" === t ? l.strokeWidth : void 0;
            }
            return Object.defineProperties(l, {
              color: {
                get: ExpressionPropertyInterface(e.c)
              },
              opacity: {
                get: ExpressionPropertyInterface(e.o)
              },
              strokeWidth: {
                get: ExpressionPropertyInterface(e.w)
              },
              dash: {
                get: function get() {
                  return h;
                }
              },
              _name: {
                value: t.nm
              },
              mn: {
                value: t.mn
              }
            }), e.c.setGroupProperty(i), e.o.setGroupProperty(i), e.w.setGroupProperty(i), l;
          }
          function s(t, e, r) {
            function i(t) {
              return 1 == t ? s : r(--t);
            }
            function s(e) {
              return e === t.e.ix || "End" === e || "end" === e ? s.end : e === t.s.ix ? s.start : e === t.o.ix ? s.offset : void 0;
            }
            return s.propertyIndex = t.ix, e.s.setGroupProperty(i), e.e.setGroupProperty(i), e.o.setGroupProperty(i), s.propertyIndex = t.ix, s.propertyGroup = r, Object.defineProperties(s, {
              start: {
                get: ExpressionPropertyInterface(e.s)
              },
              end: {
                get: ExpressionPropertyInterface(e.e)
              },
              offset: {
                get: ExpressionPropertyInterface(e.o)
              },
              _name: {
                value: t.nm
              }
            }), s.mn = t.mn, s;
          }
          function a(t, e, r) {
            function i(t) {
              return 1 == t ? a : r(--t);
            }
            a.propertyIndex = t.ix;
            var s = "tm" === e.sh.ty ? e.sh.prop : e.sh;
            function a(e) {
              return t.p.ix === e ? a.position : t.s.ix === e ? a.size : void 0;
            }
            return s.s.setGroupProperty(i), s.p.setGroupProperty(i), Object.defineProperties(a, {
              size: {
                get: ExpressionPropertyInterface(s.s)
              },
              position: {
                get: ExpressionPropertyInterface(s.p)
              },
              _name: {
                value: t.nm
              }
            }), a.mn = t.mn, a;
          }
          function n(t, e, r) {
            function i(t) {
              return 1 == t ? a : r(--t);
            }
            var s = "tm" === e.sh.ty ? e.sh.prop : e.sh;
            function a(e) {
              return t.p.ix === e ? a.position : t.r.ix === e ? a.rotation : t.pt.ix === e ? a.points : t.or.ix === e || "ADBE Vector Star Outer Radius" === e ? a.outerRadius : t.os.ix === e ? a.outerRoundness : !t.ir || t.ir.ix !== e && "ADBE Vector Star Inner Radius" !== e ? t.is && t.is.ix === e ? a.innerRoundness : void 0 : a.innerRadius;
            }
            return a.propertyIndex = t.ix, s.or.setGroupProperty(i), s.os.setGroupProperty(i), s.pt.setGroupProperty(i), s.p.setGroupProperty(i), s.r.setGroupProperty(i), t.ir && (s.ir.setGroupProperty(i), s.is.setGroupProperty(i)), Object.defineProperties(a, {
              position: {
                get: ExpressionPropertyInterface(s.p)
              },
              rotation: {
                get: ExpressionPropertyInterface(s.r)
              },
              points: {
                get: ExpressionPropertyInterface(s.pt)
              },
              outerRadius: {
                get: ExpressionPropertyInterface(s.or)
              },
              outerRoundness: {
                get: ExpressionPropertyInterface(s.os)
              },
              innerRadius: {
                get: ExpressionPropertyInterface(s.ir)
              },
              innerRoundness: {
                get: ExpressionPropertyInterface(s.is)
              },
              _name: {
                value: t.nm
              }
            }), a.mn = t.mn, a;
          }
          function o(t, e, r) {
            function i(t) {
              return 1 == t ? a : r(--t);
            }
            var s = "tm" === e.sh.ty ? e.sh.prop : e.sh;
            function a(e) {
              return t.p.ix === e ? a.position : t.r.ix === e ? a.roundness : t.s.ix === e || "Size" === e || "ADBE Vector Rect Size" === e ? a.size : void 0;
            }
            return a.propertyIndex = t.ix, s.p.setGroupProperty(i), s.s.setGroupProperty(i), s.r.setGroupProperty(i), Object.defineProperties(a, {
              position: {
                get: ExpressionPropertyInterface(s.p)
              },
              roundness: {
                get: ExpressionPropertyInterface(s.r)
              },
              size: {
                get: ExpressionPropertyInterface(s.s)
              },
              _name: {
                value: t.nm
              }
            }), a.mn = t.mn, a;
          }
          function h(t, e, r) {
            var i = e;
            function s(e) {
              if (t.r.ix === e || "Round Corners 1" === e) return s.radius;
            }
            return s.propertyIndex = t.ix, i.rd.setGroupProperty(function (t) {
              return 1 == t ? s : r(--t);
            }), Object.defineProperties(s, {
              radius: {
                get: ExpressionPropertyInterface(i.rd)
              },
              _name: {
                value: t.nm
              }
            }), s.mn = t.mn, s;
          }
          function l(t, e, r) {
            function i(t) {
              return 1 == t ? a : r(--t);
            }
            var s = e;
            function a(e) {
              return t.c.ix === e || "Copies" === e ? a.copies : t.o.ix === e || "Offset" === e ? a.offset : void 0;
            }
            return a.propertyIndex = t.ix, s.c.setGroupProperty(i), s.o.setGroupProperty(i), Object.defineProperties(a, {
              copies: {
                get: ExpressionPropertyInterface(s.c)
              },
              offset: {
                get: ExpressionPropertyInterface(s.o)
              },
              _name: {
                value: t.nm
              }
            }), a.mn = t.mn, a;
          }
          function p(t, e, r) {
            var i = e.sh;
            function s(t) {
              if ("Shape" === t || "shape" === t || "Path" === t || "path" === t || "ADBE Vector Shape" === t || 2 === t) return s.path;
            }
            return i.setGroupProperty(function (t) {
              return 1 == t ? s : r(--t);
            }), Object.defineProperties(s, {
              path: {
                get: function get() {
                  return i.k && i.getValue(), i;
                }
              },
              shape: {
                get: function get() {
                  return i.k && i.getValue(), i;
                }
              },
              _name: {
                value: t.nm
              },
              ix: {
                value: t.ix
              },
              propertyIndex: {
                value: t.ix
              },
              mn: {
                value: t.mn
              }
            }), s;
          }
          return function (e, r, i) {
            var s;
            function a(t) {
              if ("number" == typeof t) return s[t - 1];
              for (var e = 0, r = s.length; e < r;) {
                if (s[e]._name === t) return s[e];
                e += 1;
              }
            }
            return a.propertyGroup = i, s = t(e, r, a), a.numProperties = s.length, a;
          };
        }(),
        TextExpressionInterface = function TextExpressionInterface(t) {
          var e;
          function r() {}
          return Object.defineProperty(r, "sourceText", {
            get: function get() {
              t.textProperty.getValue();
              var r = t.textProperty.currentData.t;
              return void 0 !== r && (t.textProperty.currentData.t = void 0, (e = new String(r)).value = r || new String(r)), e;
            }
          }), r;
        },
        LayerExpressionInterface = function () {
          function t(t, e) {
            var r = new Matrix();
            if (r.reset(), this._elem.finalTransform.mProp.applyToMatrix(r), this._elem.hierarchy && this._elem.hierarchy.length) {
              var i,
                s = this._elem.hierarchy.length;
              for (i = 0; i < s; i += 1) {
                this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(r);
              }
              return r.applyToPointArray(t[0], t[1], t[2] || 0);
            }
            return r.applyToPointArray(t[0], t[1], t[2] || 0);
          }
          function e(t, e) {
            var r = new Matrix();
            if (r.reset(), this._elem.finalTransform.mProp.applyToMatrix(r), this._elem.hierarchy && this._elem.hierarchy.length) {
              var i,
                s = this._elem.hierarchy.length;
              for (i = 0; i < s; i += 1) {
                this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(r);
              }
              return r.inversePoint(t);
            }
            return r.inversePoint(t);
          }
          function r(t) {
            var e = new Matrix();
            if (e.reset(), this._elem.finalTransform.mProp.applyToMatrix(e), this._elem.hierarchy && this._elem.hierarchy.length) {
              var r,
                i = this._elem.hierarchy.length;
              for (r = 0; r < i; r += 1) {
                this._elem.hierarchy[r].finalTransform.mProp.applyToMatrix(e);
              }
              return e.inversePoint(t);
            }
            return e.inversePoint(t);
          }
          function i() {
            return [1, 1, 1, 1];
          }
          return function (s) {
            var a;
            function n(t) {
              switch (t) {
                case "ADBE Root Vectors Group":
                case "Contents":
                case 2:
                  return n.shapeInterface;
                case 1:
                case 6:
                case "Transform":
                case "transform":
                case "ADBE Transform Group":
                  return a;
                case 4:
                case "ADBE Effect Parade":
                case "effects":
                case "Effects":
                  return n.effect;
              }
            }
            n.toWorld = t, n.fromWorld = e, n.toComp = t, n.fromComp = r, n.sampleImage = i, n.sourceRectAtTime = s.sourceRectAtTime.bind(s), n._elem = s;
            var o = getDescriptor(a = TransformExpressionInterface(s.finalTransform.mProp), "anchorPoint");
            return Object.defineProperties(n, {
              hasParent: {
                get: function get() {
                  return s.hierarchy.length;
                }
              },
              parent: {
                get: function get() {
                  return s.hierarchy[0].layerInterface;
                }
              },
              rotation: getDescriptor(a, "rotation"),
              scale: getDescriptor(a, "scale"),
              position: getDescriptor(a, "position"),
              opacity: getDescriptor(a, "opacity"),
              anchorPoint: o,
              anchor_point: o,
              transform: {
                get: function get() {
                  return a;
                }
              },
              active: {
                get: function get() {
                  return s.isInRange;
                }
              }
            }), n.startTime = s.data.st, n.index = s.data.ind, n.source = s.data.refId, n.height = 0 === s.data.ty ? s.data.h : 100, n.width = 0 === s.data.ty ? s.data.w : 100, n.inPoint = s.data.ip / s.comp.globalData.frameRate, n.outPoint = s.data.op / s.comp.globalData.frameRate, n._name = s.data.nm, n.registerMaskInterface = function (t) {
              n.mask = new MaskManagerInterface(t, s);
            }, n.registerEffectsInterface = function (t) {
              n.effect = t;
            }, n;
          };
        }(),
        CompExpressionInterface = function CompExpressionInterface(t) {
          function e(e) {
            for (var r = 0, i = t.layers.length; r < i;) {
              if (t.layers[r].nm === e || t.layers[r].ind === e) return t.elements[r].layerInterface;
              r += 1;
            }
            return null;
          }
          return Object.defineProperty(e, "_name", {
            value: t.data.nm
          }), e.layer = e, e.pixelAspect = 1, e.height = t.data.h || t.globalData.compSize.h, e.width = t.data.w || t.globalData.compSize.w, e.pixelAspect = 1, e.frameDuration = 1 / t.globalData.frameRate, e.displayStartTime = 0, e.numLayers = t.layers.length, e;
        },
        TransformExpressionInterface = function TransformExpressionInterface(t) {
          function e(t) {
            switch (t) {
              case "scale":
              case "Scale":
              case "ADBE Scale":
              case 6:
                return e.scale;
              case "rotation":
              case "Rotation":
              case "ADBE Rotation":
              case "ADBE Rotate Z":
              case 10:
                return e.rotation;
              case "ADBE Rotate X":
                return e.xRotation;
              case "ADBE Rotate Y":
                return e.yRotation;
              case "position":
              case "Position":
              case "ADBE Position":
              case 2:
                return e.position;
              case "ADBE Position_0":
                return e.xPosition;
              case "ADBE Position_1":
                return e.yPosition;
              case "ADBE Position_2":
                return e.zPosition;
              case "anchorPoint":
              case "AnchorPoint":
              case "Anchor Point":
              case "ADBE AnchorPoint":
              case 1:
                return e.anchorPoint;
              case "opacity":
              case "Opacity":
              case 11:
                return e.opacity;
            }
          }
          if (Object.defineProperty(e, "rotation", {
            get: ExpressionPropertyInterface(t.r || t.rz)
          }), Object.defineProperty(e, "zRotation", {
            get: ExpressionPropertyInterface(t.rz || t.r)
          }), Object.defineProperty(e, "xRotation", {
            get: ExpressionPropertyInterface(t.rx)
          }), Object.defineProperty(e, "yRotation", {
            get: ExpressionPropertyInterface(t.ry)
          }), Object.defineProperty(e, "scale", {
            get: ExpressionPropertyInterface(t.s)
          }), t.p) var r = ExpressionPropertyInterface(t.p);
          return Object.defineProperty(e, "position", {
            get: function get() {
              return t.p ? r() : [t.px.v, t.py.v, t.pz ? t.pz.v : 0];
            }
          }), Object.defineProperty(e, "xPosition", {
            get: ExpressionPropertyInterface(t.px)
          }), Object.defineProperty(e, "yPosition", {
            get: ExpressionPropertyInterface(t.py)
          }), Object.defineProperty(e, "zPosition", {
            get: ExpressionPropertyInterface(t.pz)
          }), Object.defineProperty(e, "anchorPoint", {
            get: ExpressionPropertyInterface(t.a)
          }), Object.defineProperty(e, "opacity", {
            get: ExpressionPropertyInterface(t.o)
          }), Object.defineProperty(e, "skew", {
            get: ExpressionPropertyInterface(t.sk)
          }), Object.defineProperty(e, "skewAxis", {
            get: ExpressionPropertyInterface(t.sa)
          }), Object.defineProperty(e, "orientation", {
            get: ExpressionPropertyInterface(t.or)
          }), e;
        },
        ProjectInterface = function () {
          function t(t) {
            this.compositions.push(t);
          }
          return function () {
            function e(t) {
              for (var e = 0, r = this.compositions.length; e < r;) {
                if (this.compositions[e].data && this.compositions[e].data.nm === t) return this.compositions[e].prepareFrame && this.compositions[e].data.xt && this.compositions[e].prepareFrame(this.currentFrame), this.compositions[e].compInterface;
                e += 1;
              }
            }
            return e.compositions = [], e.currentFrame = 0, e.registerComposition = t, e;
          };
        }(),
        EffectsExpressionInterface = function () {
          function t(r, i, s, a) {
            var n,
              o = [],
              h = r.ef.length;
            for (n = 0; n < h; n += 1) {
              5 === r.ef[n].ty ? o.push(t(r.ef[n], i.effectElements[n], i.effectElements[n].propertyGroup, a)) : o.push(e(i.effectElements[n], r.ef[n].ty, a, l));
            }
            function l(t) {
              return 1 === t ? p : s(t - 1);
            }
            var p = function p(t) {
              for (var e = r.ef, i = 0, s = e.length; i < s;) {
                if (t === e[i].nm || t === e[i].mn || t === e[i].ix) return 5 === e[i].ty ? o[i] : o[i]();
                i += 1;
              }
              return o[0]();
            };
            return p.propertyGroup = l, "ADBE Color Control" === r.mn && Object.defineProperty(p, "color", {
              get: function get() {
                return o[0]();
              }
            }), Object.defineProperty(p, "numProperties", {
              get: function get() {
                return r.np;
              }
            }), p.active = p.enabled = 0 !== r.en, p;
          }
          function e(t, e, r, i) {
            var s = ExpressionPropertyInterface(t.p);
            return t.p.setGroupProperty && t.p.setGroupProperty(i), function () {
              return 10 === e ? r.comp.compInterface(t.p.v) : s();
            };
          }
          return {
            createEffectsInterface: function createEffectsInterface(e, r) {
              if (e.effectsManager) {
                var i,
                  s = [],
                  a = e.data.ef,
                  n = e.effectsManager.effectElements.length;
                for (i = 0; i < n; i += 1) {
                  s.push(t(a[i], e.effectsManager.effectElements[i], r, e));
                }
                return function (t) {
                  for (var r = e.data.ef || [], i = 0, a = r.length; i < a;) {
                    if (t === r[i].nm || t === r[i].mn || t === r[i].ix) return s[i];
                    i += 1;
                  }
                };
              }
            }
          };
        }(),
        MaskManagerInterface = function () {
          function t(t, e) {
            this._mask = t, this._data = e;
          }
          Object.defineProperty(t.prototype, "maskPath", {
            get: function get() {
              return this._mask.prop.k && this._mask.prop.getValue(), this._mask.prop;
            }
          }), Object.defineProperty(t.prototype, "maskOpacity", {
            get: function get() {
              return this._mask.op.k && this._mask.op.getValue(), 100 * this._mask.op.v;
            }
          });
          return function (e, r) {
            var i,
              s = createSizedArray(e.viewData.length),
              a = e.viewData.length;
            for (i = 0; i < a; i += 1) {
              s[i] = new t(e.viewData[i], e.masksProperties[i]);
            }
            return function (t) {
              for (i = 0; i < a;) {
                if (e.masksProperties[i].nm === t) return s[i];
                i += 1;
              }
            };
          };
        }(),
        ExpressionPropertyInterface = function () {
          var t = {
              pv: 0,
              v: 0,
              mult: 1
            },
            e = {
              pv: [0, 0, 0],
              v: [0, 0, 0],
              mult: 1
            };
          function r(t, e, r) {
            Object.defineProperty(t, "velocity", {
              get: function get() {
                return e.getVelocityAtTime(e.comp.currentFrame);
              }
            }), t.numKeys = e.keyframes ? e.keyframes.length : 0, t.key = function (i) {
              if (t.numKeys) {
                var s = "";
                s = "s" in e.keyframes[i - 1] ? e.keyframes[i - 1].s : "e" in e.keyframes[i - 2] ? e.keyframes[i - 2].e : e.keyframes[i - 2].s;
                var a = "unidimensional" === r ? new Number(s) : Object.assign({}, s);
                return a.time = e.keyframes[i - 1].t / e.elem.comp.globalData.frameRate, a;
              }
              return 0;
            }, t.valueAtTime = e.getValueAtTime, t.speedAtTime = e.getSpeedAtTime, t.velocityAtTime = e.getVelocityAtTime, t.propertyGroup = e.propertyGroup;
          }
          function i() {
            return t;
          }
          return function (s) {
            return s ? "unidimensional" === s.propType ? function (e) {
              e && "pv" in e || (e = t);
              var i = 1 / e.mult,
                s = e.pv * i,
                a = new Number(s);
              return a.value = s, r(a, e, "unidimensional"), function () {
                return e.k && e.getValue(), s = e.v * i, a.value !== s && ((a = new Number(s)).value = s, r(a, e, "unidimensional")), a;
              };
            }(s) : function (t) {
              t && "pv" in t || (t = e);
              var i = 1 / t.mult,
                s = t.pv.length,
                a = createTypedArray("float32", s),
                n = createTypedArray("float32", s);
              return a.value = n, r(a, t, "multidimensional"), function () {
                t.k && t.getValue();
                for (var e = 0; e < s; e += 1) {
                  a[e] = n[e] = t.v[e] * i;
                }
                return a;
              };
            }(s) : i;
          };
        }(),
        TextExpressionSelectorProp,
        propertyGetTextProp;
      function SliderEffect(t, e, r) {
        this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
      }
      function AngleEffect(t, e, r) {
        this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
      }
      function ColorEffect(t, e, r) {
        this.p = PropertyFactory.getProp(e, t.v, 1, 0, r);
      }
      function PointEffect(t, e, r) {
        this.p = PropertyFactory.getProp(e, t.v, 1, 0, r);
      }
      function LayerIndexEffect(t, e, r) {
        this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
      }
      function MaskIndexEffect(t, e, r) {
        this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
      }
      function CheckboxEffect(t, e, r) {
        this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
      }
      function NoValueEffect() {
        this.p = {};
      }
      function EffectsManager() {}
      function EffectsManager(t, e) {
        var r = t.ef || [];
        this.effectElements = [];
        var i,
          s,
          a = r.length;
        for (i = 0; i < a; i++) {
          s = new GroupEffect(r[i], e), this.effectElements.push(s);
        }
      }
      function GroupEffect(t, e) {
        this.init(t, e);
      }
      TextExpressionSelectorProp = function () {
        function t(t, e) {
          return this.textIndex = t + 1, this.textTotal = e, this.v = this.getValue() * this.mult, this.v;
        }
        return function (e, r) {
          this.pv = 1, this.comp = e.comp, this.elem = e, this.mult = .01, this.propType = "textSelector", this.textTotal = r.totalChars, this.selectorValue = 100, this.lastValue = [1, 1, 1], this.k = !0, this.x = !0, this.getValue = ExpressionManager.initiateExpression.bind(this)(e, r, this), this.getMult = t, this.getVelocityAtTime = expressionHelpers.getVelocityAtTime, this.kf ? this.getValueAtTime = expressionHelpers.getValueAtTime.bind(this) : this.getValueAtTime = expressionHelpers.getStaticValueAtTime.bind(this), this.setGroupProperty = expressionHelpers.setGroupProperty;
        };
      }(), propertyGetTextProp = TextSelectorProp.getTextSelectorProp, TextSelectorProp.getTextSelectorProp = function (t, e, r) {
        return 1 === e.t ? new TextExpressionSelectorProp(t, e, r) : propertyGetTextProp(t, e, r);
      }, extendPrototype([DynamicPropertyContainer], GroupEffect), GroupEffect.prototype.getValue = GroupEffect.prototype.iterateDynamicProperties, GroupEffect.prototype.init = function (t, e) {
        this.data = t, this.effectElements = [], this.initDynamicPropertyContainer(e);
        var r,
          i,
          s = this.data.ef.length,
          a = this.data.ef;
        for (r = 0; r < s; r += 1) {
          switch (i = null, a[r].ty) {
            case 0:
              i = new SliderEffect(a[r], e, this);
              break;
            case 1:
              i = new AngleEffect(a[r], e, this);
              break;
            case 2:
              i = new ColorEffect(a[r], e, this);
              break;
            case 3:
              i = new PointEffect(a[r], e, this);
              break;
            case 4:
            case 7:
              i = new CheckboxEffect(a[r], e, this);
              break;
            case 10:
              i = new LayerIndexEffect(a[r], e, this);
              break;
            case 11:
              i = new MaskIndexEffect(a[r], e, this);
              break;
            case 5:
              i = new EffectsManager(a[r], e, this);
              break;
            default:
              i = new NoValueEffect(a[r], e, this);
          }
          i && this.effectElements.push(i);
        }
      };
      var lottiejs = {},
        _isFrozen = !1;
      function setLocationHref(t) {
        locationHref = t;
      }
      function searchAnimations() {
        !0 === standalone ? animationManager.searchAnimations(animationData, standalone, renderer) : animationManager.searchAnimations();
      }
      function setSubframeRendering(t) {
        subframeEnabled = t;
      }
      function loadAnimation(t) {
        return !0 === standalone && (t.animationData = JSON.parse(animationData)), animationManager.loadAnimation(t);
      }
      function setQuality(t) {
        if ("string" == typeof t) switch (t) {
          case "high":
            defaultCurveSegments = 200;
            break;
          case "medium":
            defaultCurveSegments = 50;
            break;
          case "low":
            defaultCurveSegments = 10;
        } else !isNaN(t) && t > 1 && (defaultCurveSegments = t);
        roundValues(!(defaultCurveSegments >= 50));
      }
      function inBrowser() {
        return void 0 !== navigator;
      }
      function installPlugin(t, e) {
        "expressions" === t && (expressionsPlugin = e);
      }
      function getFactory(t) {
        switch (t) {
          case "propertyFactory":
            return PropertyFactory;
          case "shapePropertyFactory":
            return ShapePropertyFactory;
          case "matrix":
            return Matrix;
        }
      }
      function checkReady() {
        "complete" === document.readyState && (clearInterval(readyStateCheckInterval), searchAnimations());
      }
      function getQueryVariable(t) {
        for (var e = queryString.split("&"), r = 0; r < e.length; r++) {
          var i = e[r].split("=");
          if (decodeURIComponent(i[0]) == t) return decodeURIComponent(i[1]);
        }
      }
      lottiejs.play = animationManager.play, lottiejs.pause = animationManager.pause, lottiejs.setLocationHref = setLocationHref, lottiejs.togglePause = animationManager.togglePause, lottiejs.setSpeed = animationManager.setSpeed, lottiejs.setDirection = animationManager.setDirection, lottiejs.stop = animationManager.stop, lottiejs.searchAnimations = searchAnimations, lottiejs.registerAnimation = animationManager.registerAnimation, lottiejs.loadAnimation = loadAnimation, lottiejs.setSubframeRendering = setSubframeRendering, lottiejs.resize = animationManager.resize, lottiejs.goToAndStop = animationManager.goToAndStop, lottiejs.destroy = animationManager.destroy, lottiejs.setQuality = setQuality, lottiejs.inBrowser = inBrowser, lottiejs.installPlugin = installPlugin, lottiejs.freeze = animationManager.freeze, lottiejs.unfreeze = animationManager.unfreeze, lottiejs.getRegisteredAnimations = animationManager.getRegisteredAnimations, lottiejs.__getFactory = getFactory, lottiejs.version = "5.5.7";
      var standalone = "",
        animationData = "__[ANIMATIONDATA]__",
        renderer = "";
      if (standalone) {
        var scripts = document.getElementsByTagName("script"),
          index = scripts.length - 1,
          myScript = scripts[index] || {
            src: ""
          },
          queryString = myScript.src.replace(/^[^\?]+\??/, "");
        renderer = getQueryVariable("renderer");
      }
      var readyStateCheckInterval = setInterval(checkReady, 100);
      return lottiejs;
    });
    var _window$lottie = window.lottie,
      freeze = _window$lottie.freeze,
      unfreeze = _window$lottie.unfreeze;
  }.call(this, __webpack_require__(2)(module));
}, function (t, e) {
  t.exports = function (t) {
    if (!t.webpackPolyfill) {
      var e = Object.create(t);
      e.children || (e.children = []), Object.defineProperty(e, "loaded", {
        enumerable: !0,
        get: function get() {
          return e.l;
        }
      }), Object.defineProperty(e, "id", {
        enumerable: !0,
        get: function get() {
          return e.i;
        }
      }), Object.defineProperty(e, "exports", {
        enumerable: !0
      }), e.webpackPolyfill = 1;
    }
    return e;
  };
}]));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"]))

/***/ }),
/* 100 */
/*!*****************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/static/json sync ^\.\/.*$ ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./Loading6": 101,
	"./Loading6.json": 101
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 100;

/***/ }),
/* 101 */
/*!*****************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/static/json/Loading6.json ***!
  \*****************************************************************************************/
/*! exports provided: v, fr, ip, op, w, h, nm, ddd, assets, layers, markers, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"v\":\"5.9.4\",\"fr\":25,\"ip\":0,\"op\":86,\"w\":720,\"h\":720,\"nm\":\"loading-color 6\",\"ddd\":0,\"assets\":[],\"layers\":[{\"ddd\":0,\"ind\":1,\"ty\":4,\"nm\":\"形状图层 1\",\"sr\":1,\"ks\":{\"o\":{\"a\":0,\"k\":100,\"ix\":11},\"r\":{\"a\":0,\"k\":0,\"ix\":10},\"p\":{\"a\":1,\"k\":[{\"i\":{\"x\":0.745,\"y\":1},\"o\":{\"x\":0.573,\"y\":0},\"t\":0,\"s\":[220,360,0],\"to\":[48.333,0,0],\"ti\":[-48.333,0,0]},{\"i\":{\"x\":0.745,\"y\":0.745},\"o\":{\"x\":0.333,\"y\":0.333},\"t\":40,\"s\":[510,360,0],\"to\":[0,0,0],\"ti\":[0,0,0]},{\"i\":{\"x\":0.667,\"y\":1},\"o\":{\"x\":0.526,\"y\":0},\"t\":45,\"s\":[510,360,0],\"to\":[-48.333,0,0],\"ti\":[48.333,0,0]},{\"t\":85,\"s\":[220,360,0]}],\"ix\":2,\"l\":2},\"a\":{\"a\":0,\"k\":[-136,-18,0],\"ix\":1,\"l\":2},\"s\":{\"a\":0,\"k\":[90,90,100],\"ix\":6,\"l\":2}},\"ao\":0,\"shapes\":[{\"ty\":\"gr\",\"it\":[{\"d\":1,\"ty\":\"el\",\"s\":{\"a\":0,\"k\":[45,45],\"ix\":2},\"p\":{\"a\":0,\"k\":[0,0],\"ix\":3},\"nm\":\"椭圆路径 1\",\"mn\":\"ADBE Vector Shape - Ellipse\",\"hd\":false},{\"ty\":\"fl\",\"c\":{\"a\":0,\"k\":[1,0.556862745098,0.03137254902,1],\"ix\":4},\"o\":{\"a\":0,\"k\":100,\"ix\":5},\"r\":1,\"bm\":0,\"nm\":\"填充 1\",\"mn\":\"ADBE Vector Graphic - Fill\",\"hd\":false},{\"ty\":\"tr\",\"p\":{\"a\":0,\"k\":[-136,-18],\"ix\":2},\"a\":{\"a\":0,\"k\":[0,0],\"ix\":1},\"s\":{\"a\":0,\"k\":[100,100],\"ix\":3},\"r\":{\"a\":0,\"k\":0,\"ix\":6},\"o\":{\"a\":0,\"k\":100,\"ix\":7},\"sk\":{\"a\":0,\"k\":0,\"ix\":4},\"sa\":{\"a\":0,\"k\":0,\"ix\":5},\"nm\":\"变换\"}],\"nm\":\"椭圆 2\",\"np\":3,\"cix\":2,\"bm\":0,\"ix\":1,\"mn\":\"ADBE Vector Group\",\"hd\":false},{\"ty\":\"gr\",\"it\":[{\"d\":1,\"ty\":\"el\",\"s\":{\"a\":0,\"k\":[45,45],\"ix\":2},\"p\":{\"a\":0,\"k\":[0,0],\"ix\":3},\"nm\":\"椭圆路径 1\",\"mn\":\"ADBE Vector Shape - Ellipse\",\"hd\":false},{\"ty\":\"fl\",\"c\":{\"a\":0,\"k\":[1,0.556862745098,0.03137254902,1],\"ix\":4},\"o\":{\"a\":0,\"k\":100,\"ix\":5},\"r\":1,\"bm\":0,\"nm\":\"填充 1\",\"mn\":\"ADBE Vector Graphic - Fill\",\"hd\":false},{\"ty\":\"tr\",\"p\":{\"a\":0,\"k\":[-136,-18],\"ix\":2},\"a\":{\"a\":0,\"k\":[0,0],\"ix\":1},\"s\":{\"a\":0,\"k\":[100,100],\"ix\":3},\"r\":{\"a\":0,\"k\":0,\"ix\":6},\"o\":{\"a\":0,\"k\":100,\"ix\":7},\"sk\":{\"a\":0,\"k\":0,\"ix\":4},\"sa\":{\"a\":0,\"k\":0,\"ix\":5},\"nm\":\"变换\"}],\"nm\":\"椭圆 1\",\"np\":3,\"cix\":2,\"bm\":0,\"ix\":2,\"mn\":\"ADBE Vector Group\",\"hd\":false}],\"ip\":0,\"op\":125,\"st\":0,\"ct\":1,\"bm\":0},{\"ddd\":0,\"ind\":2,\"ty\":4,\"nm\":\"形状图层 2\",\"sr\":1,\"ks\":{\"o\":{\"a\":0,\"k\":100,\"ix\":11},\"r\":{\"a\":0,\"k\":0,\"ix\":10},\"p\":{\"a\":1,\"k\":[{\"i\":{\"x\":0.833,\"y\":0.978},\"o\":{\"x\":0.167,\"y\":0.167},\"t\":5,\"s\":[300,360,0],\"to\":[-39.333,-153,0],\"ti\":[0,0,0]},{\"i\":{\"x\":0.833,\"y\":0.833},\"o\":{\"x\":0.167,\"y\":0.167},\"t\":14,\"s\":[220,360,0],\"to\":[0,0,0],\"ti\":[0,0,0]},{\"i\":{\"x\":0.833,\"y\":0.833},\"o\":{\"x\":0.167,\"y\":0.017},\"t\":74,\"s\":[220,360,0],\"to\":[0,0,0],\"ti\":[-38,140,0]},{\"t\":81,\"s\":[300,360,0]}],\"ix\":2,\"l\":2},\"a\":{\"a\":0,\"k\":[-136,-18,0],\"ix\":1,\"l\":2},\"s\":{\"a\":0,\"k\":[90,90,100],\"ix\":6,\"l\":2}},\"ao\":0,\"shapes\":[{\"ty\":\"gr\",\"it\":[{\"d\":1,\"ty\":\"el\",\"s\":{\"a\":0,\"k\":[45,45],\"ix\":2},\"p\":{\"a\":0,\"k\":[0,0],\"ix\":3},\"nm\":\"椭圆路径 1\",\"mn\":\"ADBE Vector Shape - Ellipse\",\"hd\":false},{\"ty\":\"fl\",\"c\":{\"a\":0,\"k\":[1,0.443137254902,0.125490196078,1],\"ix\":4},\"o\":{\"a\":0,\"k\":100,\"ix\":5},\"r\":1,\"bm\":0,\"nm\":\"填充 1\",\"mn\":\"ADBE Vector Graphic - Fill\",\"hd\":false},{\"ty\":\"tr\",\"p\":{\"a\":0,\"k\":[-136,-18],\"ix\":2},\"a\":{\"a\":0,\"k\":[0,0],\"ix\":1},\"s\":{\"a\":0,\"k\":[100,100],\"ix\":3},\"r\":{\"a\":0,\"k\":0,\"ix\":6},\"o\":{\"a\":0,\"k\":100,\"ix\":7},\"sk\":{\"a\":0,\"k\":0,\"ix\":4},\"sa\":{\"a\":0,\"k\":0,\"ix\":5},\"nm\":\"变换\"}],\"nm\":\"椭圆 2\",\"np\":3,\"cix\":2,\"bm\":0,\"ix\":1,\"mn\":\"ADBE Vector Group\",\"hd\":false},{\"ty\":\"gr\",\"it\":[{\"d\":1,\"ty\":\"el\",\"s\":{\"a\":0,\"k\":[45,45],\"ix\":2},\"p\":{\"a\":0,\"k\":[0,0],\"ix\":3},\"nm\":\"椭圆路径 1\",\"mn\":\"ADBE Vector Shape - Ellipse\",\"hd\":false},{\"ty\":\"fl\",\"c\":{\"a\":0,\"k\":[1,0.443137254902,0.125490196078,1],\"ix\":4},\"o\":{\"a\":0,\"k\":100,\"ix\":5},\"r\":1,\"bm\":0,\"nm\":\"填充 1\",\"mn\":\"ADBE Vector Graphic - Fill\",\"hd\":false},{\"ty\":\"tr\",\"p\":{\"a\":0,\"k\":[-136,-18],\"ix\":2},\"a\":{\"a\":0,\"k\":[0,0],\"ix\":1},\"s\":{\"a\":0,\"k\":[100,100],\"ix\":3},\"r\":{\"a\":0,\"k\":0,\"ix\":6},\"o\":{\"a\":0,\"k\":100,\"ix\":7},\"sk\":{\"a\":0,\"k\":0,\"ix\":4},\"sa\":{\"a\":0,\"k\":0,\"ix\":5},\"nm\":\"变换\"}],\"nm\":\"椭圆 1\",\"np\":3,\"cix\":2,\"bm\":0,\"ix\":2,\"mn\":\"ADBE Vector Group\",\"hd\":false}],\"ip\":0,\"op\":125,\"st\":0,\"ct\":1,\"bm\":0},{\"ddd\":0,\"ind\":3,\"ty\":4,\"nm\":\"形状图层 3\",\"sr\":1,\"ks\":{\"o\":{\"a\":0,\"k\":100,\"ix\":11},\"r\":{\"a\":0,\"k\":0,\"ix\":10},\"p\":{\"a\":1,\"k\":[{\"i\":{\"x\":0.833,\"y\":0.971},\"o\":{\"x\":0.167,\"y\":0.167},\"t\":16,\"s\":[370,360,0],\"to\":[-35.917,-154,0],\"ti\":[0,0,0]},{\"i\":{\"x\":0.833,\"y\":0.833},\"o\":{\"x\":0.167,\"y\":0.167},\"t\":25,\"s\":[300,360,0],\"to\":[0,0,0],\"ti\":[0,0,0]},{\"i\":{\"x\":0.833,\"y\":0.833},\"o\":{\"x\":0.167,\"y\":0.02},\"t\":68,\"s\":[300,360,0],\"to\":[0,0,0],\"ti\":[-36.5,142.5,0]},{\"t\":74,\"s\":[370,360,0]}],\"ix\":2,\"l\":2},\"a\":{\"a\":0,\"k\":[-136,-18,0],\"ix\":1,\"l\":2},\"s\":{\"a\":0,\"k\":[90,90,100],\"ix\":6,\"l\":2}},\"ao\":0,\"shapes\":[{\"ty\":\"gr\",\"it\":[{\"d\":1,\"ty\":\"el\",\"s\":{\"a\":0,\"k\":[45,45],\"ix\":2},\"p\":{\"a\":0,\"k\":[0,0],\"ix\":3},\"nm\":\"椭圆路径 1\",\"mn\":\"ADBE Vector Shape - Ellipse\",\"hd\":false},{\"ty\":\"fl\",\"c\":{\"a\":0,\"k\":[1,0.286274509804,0.270588235294,1],\"ix\":4},\"o\":{\"a\":0,\"k\":100,\"ix\":5},\"r\":1,\"bm\":0,\"nm\":\"填充 1\",\"mn\":\"ADBE Vector Graphic - Fill\",\"hd\":false},{\"ty\":\"tr\",\"p\":{\"a\":0,\"k\":[-136,-18],\"ix\":2},\"a\":{\"a\":0,\"k\":[0,0],\"ix\":1},\"s\":{\"a\":0,\"k\":[100,100],\"ix\":3},\"r\":{\"a\":0,\"k\":0,\"ix\":6},\"o\":{\"a\":0,\"k\":100,\"ix\":7},\"sk\":{\"a\":0,\"k\":0,\"ix\":4},\"sa\":{\"a\":0,\"k\":0,\"ix\":5},\"nm\":\"变换\"}],\"nm\":\"椭圆 2\",\"np\":3,\"cix\":2,\"bm\":0,\"ix\":1,\"mn\":\"ADBE Vector Group\",\"hd\":false},{\"ty\":\"gr\",\"it\":[{\"d\":1,\"ty\":\"el\",\"s\":{\"a\":0,\"k\":[45,45],\"ix\":2},\"p\":{\"a\":0,\"k\":[0,0],\"ix\":3},\"nm\":\"椭圆路径 1\",\"mn\":\"ADBE Vector Shape - Ellipse\",\"hd\":false},{\"ty\":\"fl\",\"c\":{\"a\":0,\"k\":[1,0.286274509804,0.270588235294,1],\"ix\":4},\"o\":{\"a\":0,\"k\":100,\"ix\":5},\"r\":1,\"bm\":0,\"nm\":\"填充 1\",\"mn\":\"ADBE Vector Graphic - Fill\",\"hd\":false},{\"ty\":\"tr\",\"p\":{\"a\":0,\"k\":[-136,-18],\"ix\":2},\"a\":{\"a\":0,\"k\":[0,0],\"ix\":1},\"s\":{\"a\":0,\"k\":[100,100],\"ix\":3},\"r\":{\"a\":0,\"k\":0,\"ix\":6},\"o\":{\"a\":0,\"k\":100,\"ix\":7},\"sk\":{\"a\":0,\"k\":0,\"ix\":4},\"sa\":{\"a\":0,\"k\":0,\"ix\":5},\"nm\":\"变换\"}],\"nm\":\"椭圆 1\",\"np\":3,\"cix\":2,\"bm\":0,\"ix\":2,\"mn\":\"ADBE Vector Group\",\"hd\":false}],\"ip\":0,\"op\":125,\"st\":0,\"ct\":1,\"bm\":0},{\"ddd\":0,\"ind\":4,\"ty\":4,\"nm\":\"形状图层 4\",\"sr\":1,\"ks\":{\"o\":{\"a\":0,\"k\":100,\"ix\":11},\"r\":{\"a\":0,\"k\":0,\"ix\":10},\"p\":{\"a\":1,\"k\":[{\"i\":{\"x\":0.833,\"y\":0.954},\"o\":{\"x\":0.167,\"y\":0.167},\"t\":25,\"s\":[440,360,0],\"to\":[-29.167,-153.75,0],\"ti\":[0,0,0]},{\"i\":{\"x\":0.833,\"y\":0.833},\"o\":{\"x\":0.167,\"y\":0.167},\"t\":35,\"s\":[370,360,0],\"to\":[0,0,0],\"ti\":[0,0,0]},{\"i\":{\"x\":0.833,\"y\":0.833},\"o\":{\"x\":0.167,\"y\":0.031},\"t\":61,\"s\":[370,360,0],\"to\":[0,0,0],\"ti\":[-45,141.5,0]},{\"t\":67,\"s\":[440,360,0]}],\"ix\":2,\"l\":2},\"a\":{\"a\":0,\"k\":[-136,-18,0],\"ix\":1,\"l\":2},\"s\":{\"a\":0,\"k\":[90,90,100],\"ix\":6,\"l\":2}},\"ao\":0,\"shapes\":[{\"ty\":\"gr\",\"it\":[{\"d\":1,\"ty\":\"el\",\"s\":{\"a\":0,\"k\":[45,45],\"ix\":2},\"p\":{\"a\":0,\"k\":[0,0],\"ix\":3},\"nm\":\"椭圆路径 1\",\"mn\":\"ADBE Vector Shape - Ellipse\",\"hd\":false},{\"ty\":\"fl\",\"c\":{\"a\":0,\"k\":[1,0.141176470588,0.396078431373,1],\"ix\":4},\"o\":{\"a\":0,\"k\":100,\"ix\":5},\"r\":1,\"bm\":0,\"nm\":\"填充 1\",\"mn\":\"ADBE Vector Graphic - Fill\",\"hd\":false},{\"ty\":\"tr\",\"p\":{\"a\":0,\"k\":[-136,-18],\"ix\":2},\"a\":{\"a\":0,\"k\":[0,0],\"ix\":1},\"s\":{\"a\":0,\"k\":[100,100],\"ix\":3},\"r\":{\"a\":0,\"k\":0,\"ix\":6},\"o\":{\"a\":0,\"k\":100,\"ix\":7},\"sk\":{\"a\":0,\"k\":0,\"ix\":4},\"sa\":{\"a\":0,\"k\":0,\"ix\":5},\"nm\":\"变换\"}],\"nm\":\"椭圆 2\",\"np\":3,\"cix\":2,\"bm\":0,\"ix\":1,\"mn\":\"ADBE Vector Group\",\"hd\":false},{\"ty\":\"gr\",\"it\":[{\"d\":1,\"ty\":\"el\",\"s\":{\"a\":0,\"k\":[45,45],\"ix\":2},\"p\":{\"a\":0,\"k\":[0,0],\"ix\":3},\"nm\":\"椭圆路径 1\",\"mn\":\"ADBE Vector Shape - Ellipse\",\"hd\":false},{\"ty\":\"fl\",\"c\":{\"a\":0,\"k\":[1,0.141176470588,0.396078431373,1],\"ix\":4},\"o\":{\"a\":0,\"k\":100,\"ix\":5},\"r\":1,\"bm\":0,\"nm\":\"填充 1\",\"mn\":\"ADBE Vector Graphic - Fill\",\"hd\":false},{\"ty\":\"tr\",\"p\":{\"a\":0,\"k\":[-136,-18],\"ix\":2},\"a\":{\"a\":0,\"k\":[0,0],\"ix\":1},\"s\":{\"a\":0,\"k\":[100,100],\"ix\":3},\"r\":{\"a\":0,\"k\":0,\"ix\":6},\"o\":{\"a\":0,\"k\":100,\"ix\":7},\"sk\":{\"a\":0,\"k\":0,\"ix\":4},\"sa\":{\"a\":0,\"k\":0,\"ix\":5},\"nm\":\"变换\"}],\"nm\":\"椭圆 1\",\"np\":3,\"cix\":2,\"bm\":0,\"ix\":2,\"mn\":\"ADBE Vector Group\",\"hd\":false}],\"ip\":0,\"op\":125,\"st\":0,\"ct\":1,\"bm\":0},{\"ddd\":0,\"ind\":5,\"ty\":4,\"nm\":\"形状图层 6\",\"sr\":1,\"ks\":{\"o\":{\"a\":0,\"k\":100,\"ix\":11},\"r\":{\"a\":0,\"k\":0,\"ix\":10},\"p\":{\"a\":1,\"k\":[{\"i\":{\"x\":0.833,\"y\":0.917},\"o\":{\"x\":0.167,\"y\":0.167},\"t\":31,\"s\":[510,360,0],\"to\":[-33.042,-154.625,0],\"ti\":[0,0,0]},{\"i\":{\"x\":0.833,\"y\":0.833},\"o\":{\"x\":0.167,\"y\":0.167},\"t\":40,\"s\":[440,360,0],\"to\":[0,0,0],\"ti\":[0,0,0]},{\"i\":{\"x\":0.833,\"y\":0.833},\"o\":{\"x\":0.167,\"y\":0.088},\"t\":49,\"s\":[440,360,0],\"to\":[0,0,0],\"ti\":[-29.5,140,0]},{\"t\":59,\"s\":[510,360,0]}],\"ix\":2,\"l\":2},\"a\":{\"a\":0,\"k\":[-136,-18,0],\"ix\":1,\"l\":2},\"s\":{\"a\":0,\"k\":[90,90,100],\"ix\":6,\"l\":2}},\"ao\":0,\"shapes\":[{\"ty\":\"gr\",\"it\":[{\"d\":1,\"ty\":\"el\",\"s\":{\"a\":0,\"k\":[45,45],\"ix\":2},\"p\":{\"a\":0,\"k\":[0,0],\"ix\":3},\"nm\":\"椭圆路径 1\",\"mn\":\"ADBE Vector Shape - Ellipse\",\"hd\":false},{\"ty\":\"fl\",\"c\":{\"a\":0,\"k\":[1,0.01568627451,0.509803921569,1],\"ix\":4},\"o\":{\"a\":0,\"k\":100,\"ix\":5},\"r\":1,\"bm\":0,\"nm\":\"填充 1\",\"mn\":\"ADBE Vector Graphic - Fill\",\"hd\":false},{\"ty\":\"tr\",\"p\":{\"a\":0,\"k\":[-136,-18],\"ix\":2},\"a\":{\"a\":0,\"k\":[0,0],\"ix\":1},\"s\":{\"a\":0,\"k\":[100,100],\"ix\":3},\"r\":{\"a\":0,\"k\":0,\"ix\":6},\"o\":{\"a\":0,\"k\":100,\"ix\":7},\"sk\":{\"a\":0,\"k\":0,\"ix\":4},\"sa\":{\"a\":0,\"k\":0,\"ix\":5},\"nm\":\"变换\"}],\"nm\":\"椭圆 2\",\"np\":3,\"cix\":2,\"bm\":0,\"ix\":1,\"mn\":\"ADBE Vector Group\",\"hd\":false},{\"ty\":\"gr\",\"it\":[{\"d\":1,\"ty\":\"el\",\"s\":{\"a\":0,\"k\":[45,45],\"ix\":2},\"p\":{\"a\":0,\"k\":[0,0],\"ix\":3},\"nm\":\"椭圆路径 1\",\"mn\":\"ADBE Vector Shape - Ellipse\",\"hd\":false},{\"ty\":\"fl\",\"c\":{\"a\":0,\"k\":[1,0.01568627451,0.509803921569,1],\"ix\":4},\"o\":{\"a\":0,\"k\":100,\"ix\":5},\"r\":1,\"bm\":0,\"nm\":\"填充 1\",\"mn\":\"ADBE Vector Graphic - Fill\",\"hd\":false},{\"ty\":\"tr\",\"p\":{\"a\":0,\"k\":[-136,-18],\"ix\":2},\"a\":{\"a\":0,\"k\":[0,0],\"ix\":1},\"s\":{\"a\":0,\"k\":[100,100],\"ix\":3},\"r\":{\"a\":0,\"k\":0,\"ix\":6},\"o\":{\"a\":0,\"k\":100,\"ix\":7},\"sk\":{\"a\":0,\"k\":0,\"ix\":4},\"sa\":{\"a\":0,\"k\":0,\"ix\":5},\"nm\":\"变换\"}],\"nm\":\"椭圆 1\",\"np\":3,\"cix\":2,\"bm\":0,\"ix\":2,\"mn\":\"ADBE Vector Group\",\"hd\":false}],\"ip\":0,\"op\":125,\"st\":0,\"ct\":1,\"bm\":0}],\"markers\":[]}");

/***/ }),
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */
/*!*****************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/api/server.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateCode = generateCode;
exports.getCode = getCode;
exports.getConfig = getConfig;
exports.putConfig = putConfig;
exports.serverLogin = serverLogin;
exports.tactics = tactics;
var _server = _interopRequireDefault(__webpack_require__(/*! ../utils/server */ 119));
function serverLogin(data) {
  return (0, _server.default)({
    url: 'auth/server/login',
    method: 'POST',
    data: data
  });
}
function generateCode(data) {
  return (0, _server.default)({
    url: 'server/generate/code',
    method: 'POST',
    data: data
  });
}
function getCode() {
  return (0, _server.default)({
    url: 'server/get/code',
    method: 'GET'
  });
}
function tactics(data) {
  return (0, _server.default)({
    url: 'server/choose/tactics',
    method: 'POST',
    data: data
  });
}
function getConfig() {
  return (0, _server.default)({
    url: 'server/get/config',
    method: 'GET'
  });
}
function putConfig(data) {
  return (0, _server.default)({
    url: 'server/put/config',
    method: 'POST',
    data: data
  });
}

/***/ }),
/* 119 */
/*!*******************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/utils/server.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _env = _interopRequireDefault(__webpack_require__(/*! ../utils/env */ 62));
var _data = __webpack_require__(/*! @/utils/data */ 49);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function service() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  options.url = "".concat(_env.default.baseUrl).concat(options.url);
  options.timeout = 100000;
  if ((0, _data.getServerToken)()) {
    options.header = {
      'content-type': 'application/json',
      'token': "".concat((0, _data.getServerToken)())
    };
  }
  return new Promise(function (resolve, reject) {
    // 发送 HTTP 请求
    uni.request(_objectSpread(_objectSpread({}, options), {}, {
      success: function success(res) {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.msg);
          }
        } else {
          reject('与服务器建立连接失败');
        }
      },
      fail: function fail() {
        reject('请检查您的网络环境是否正常');
      }
    }));
  });
}
var _default = service;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */
/*!*******************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/static/images/img/bot-5.png ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */
/*!********************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/parser.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, wx) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * @fileoverview html 解析器
 */

// 配置
var config = {
  // 信任的标签（保持标签名不变）
  trustTags: makeMap('a,abbr,ad,audio,b,blockquote,br,code,col,colgroup,dd,del,dl,dt,div,em,fieldset,h1,h2,h3,h4,h5,h6,hr,i,img,ins,label,legend,li,ol,p,q,ruby,rt,source,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,title,ul,video'),
  // 块级标签（转为 div，其他的非信任标签转为 span）
  blockTags: makeMap('address,article,aside,body,caption,center,cite,footer,header,html,nav,pre,section'),
  // 要移除的标签
  ignoreTags: makeMap('area,base,canvas,embed,frame,head,iframe,input,link,map,meta,param,rp,script,source,style,textarea,title,track,wbr'),
  // 自闭合的标签
  voidTags: makeMap('area,base,br,col,circle,ellipse,embed,frame,hr,img,input,line,link,meta,param,path,polygon,rect,source,track,use,wbr'),
  // html 实体
  entities: {
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    ensp: "\u2002",
    emsp: "\u2003",
    nbsp: '\xA0',
    semi: ';',
    ndash: '–',
    mdash: '—',
    middot: '·',
    lsquo: '‘',
    rsquo: '’',
    ldquo: '“',
    rdquo: '”',
    bull: '•',
    hellip: '…',
    larr: '←',
    uarr: '↑',
    rarr: '→',
    darr: '↓'
  },
  // 默认的标签样式
  tagStyle: {
    address: 'font-style:italic',
    big: 'display:inline;font-size:1.2em',
    caption: 'display:table-caption;text-align:center',
    center: 'text-align:center',
    cite: 'font-style:italic',
    dd: 'margin-left:40px',
    mark: 'background-color:yellow',
    pre: 'font-family:monospace;white-space:pre',
    s: 'text-decoration:line-through',
    small: 'display:inline;font-size:0.8em',
    strike: 'text-decoration:line-through',
    u: 'text-decoration:underline'
  },
  // svg 大小写对照表
  svgDict: {
    animatetransform: 'animateTransform',
    lineargradient: 'linearGradient',
    viewbox: 'viewBox',
    attributename: 'attributeName',
    repeatcount: 'repeatCount',
    repeatdur: 'repeatDur'
  }
};
var tagSelector = {};
var _uni$getSystemInfoSyn = uni.getSystemInfoSync(),
  windowWidth = _uni$getSystemInfoSyn.windowWidth,
  system = _uni$getSystemInfoSyn.system;
var blankChar = makeMap(' ,\r,\n,\t,\f');
var idIndex = 0;

/**
 * @description 创建 map
 * @param {String} str 逗号分隔
 */
function makeMap(str) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = list.length; i--;) {
    map[list[i]] = true;
  }
  return map;
}

/**
 * @description 解码 html 实体
 * @param {String} str 要解码的字符串
 * @param {Boolean} amp 要不要解码 &amp;
 * @returns {String} 解码后的字符串
 */
function decodeEntity(str, amp) {
  var i = str.indexOf('&');
  while (i !== -1) {
    var j = str.indexOf(';', i + 3);
    var code = void 0;
    if (j === -1) break;
    if (str[i + 1] === '#') {
      // &#123; 形式的实体
      code = parseInt((str[i + 2] === 'x' ? '0' : '') + str.substring(i + 2, j));
      if (!isNaN(code)) {
        str = str.substr(0, i) + String.fromCharCode(code) + str.substr(j + 1);
      }
    } else {
      // &nbsp; 形式的实体
      code = str.substring(i + 1, j);
      if (config.entities[code] || code === 'amp' && amp) {
        str = str.substr(0, i) + (config.entities[code] || '&') + str.substr(j + 1);
      }
    }
    i = str.indexOf('&', i + 1);
  }
  return str;
}

/**
 * @description 合并多个块级标签，加快长内容渲染
 * @param {Array} nodes 要合并的标签数组
 */
function mergeNodes(nodes) {
  var i = nodes.length - 1;
  for (var j = i; j >= -1; j--) {
    if (j === -1 || nodes[j].c || !nodes[j].name || nodes[j].name !== 'div' && nodes[j].name !== 'p' && nodes[j].name[0] !== 'h' || (nodes[j].attrs.style || '').includes('inline')) {
      if (i - j >= 5) {
        nodes.splice(j + 1, i - j, {
          name: 'div',
          attrs: {},
          children: nodes.slice(j + 1, i + 1)
        });
      }
      i = j - 1;
    }
  }
}

/**
 * @description html 解析器
 * @param {Object} vm 组件实例
 */
function Parser(vm) {
  this.options = vm || {};
  this.tagStyle = Object.assign({}, config.tagStyle, this.options.tagStyle);
  this.imgList = vm.imgList || [];
  this.imgList._unloadimgs = 0;
  this.plugins = vm.plugins || [];
  this.attrs = Object.create(null);
  this.stack = [];
  this.nodes = [];
  this.pre = (this.options.containerStyle || '').includes('white-space') && this.options.containerStyle.includes('pre') ? 2 : 0;
}

/**
 * @description 执行解析
 * @param {String} content 要解析的文本
 */
Parser.prototype.parse = function (content) {
  // 插件处理
  for (var i = this.plugins.length; i--;) {
    if (this.plugins[i].onUpdate) {
      content = this.plugins[i].onUpdate(content, config) || content;
    }
  }
  new Lexer(this).parse(content);
  // 出栈未闭合的标签
  while (this.stack.length) {
    this.popNode();
  }
  if (this.nodes.length > 50) {
    mergeNodes(this.nodes);
  }
  return this.nodes;
};

/**
 * @description 将标签暴露出来（不被 rich-text 包含）
 */
Parser.prototype.expose = function () {
  for (var i = this.stack.length; i--;) {
    var item = this.stack[i];
    if (item.c || item.name === 'a' || item.name === 'video' || item.name === 'audio') return;
    item.c = 1;
  }
};

/**
 * @description 处理插件
 * @param {Object} node 要处理的标签
 * @returns {Boolean} 是否要移除此标签
 */
Parser.prototype.hook = function (node) {
  for (var i = this.plugins.length; i--;) {
    if (this.plugins[i].onParse && this.plugins[i].onParse(node, this) === false) {
      return false;
    }
  }
  return true;
};

/**
 * @description 将链接拼接上主域名
 * @param {String} url 需要拼接的链接
 * @returns {String} 拼接后的链接
 */
Parser.prototype.getUrl = function (url) {
  var domain = this.options.domain;
  if (url[0] === '/') {
    if (url[1] === '/') {
      // // 开头的补充协议名
      url = (domain ? domain.split('://')[0] : 'http') + ':' + url;
    } else if (domain) {
      // 否则补充整个域名
      url = domain + url;
    }
  } else if (!url.includes('data:') && !url.includes('://')) {
    if (domain) {
      url = domain + '/' + url;
    }
  }
  return url;
};

/**
 * @description 解析样式表
 * @param {Object} node 标签
 * @returns {Object}
 */
Parser.prototype.parseStyle = function (node) {
  var attrs = node.attrs;
  var list = (this.tagStyle[node.name] || '').split(';').concat((attrs.style || '').split(';'));
  var styleObj = {};
  var tmp = '';
  if (attrs.id && !this.xml) {
    // 暴露锚点
    if (this.options.useAnchor) {
      this.expose();
    } else if (node.name !== 'img' && node.name !== 'a' && node.name !== 'video' && node.name !== 'audio') {
      attrs.id = undefined;
    }
  }

  // 转换 width 和 height 属性
  if (attrs.width) {
    styleObj.width = parseFloat(attrs.width) + (attrs.width.includes('%') ? '%' : 'px');
    attrs.width = undefined;
  }
  if (attrs.height) {
    styleObj.height = parseFloat(attrs.height) + (attrs.height.includes('%') ? '%' : 'px');
    attrs.height = undefined;
  }
  for (var i = 0, len = list.length; i < len; i++) {
    var info = list[i].split(':');
    if (info.length < 2) continue;
    var key = info.shift().trim().toLowerCase();
    var value = info.join(':').trim();
    if (value[0] === '-' && value.lastIndexOf('-') > 0 || value.includes('safe')) {
      // 兼容性的 css 不压缩
      tmp += ";".concat(key, ":").concat(value);
    } else if (!styleObj[key] || value.includes('import') || !styleObj[key].includes('import')) {
      // 重复的样式进行覆盖
      if (value.includes('url')) {
        // 填充链接
        var j = value.indexOf('(') + 1;
        if (j) {
          while (value[j] === '"' || value[j] === "'" || blankChar[value[j]]) {
            j++;
          }
          value = value.substr(0, j) + this.getUrl(value.substr(j));
        }
      } else if (value.includes('rpx')) {
        // 转换 rpx（rich-text 内部不支持 rpx）
        value = value.replace(/[0-9.]+\s*rpx/g, function ($) {
          return parseFloat($) * windowWidth / 750 + 'px';
        });
      }
      styleObj[key] = value;
    }
  }
  node.attrs.style = tmp;
  return styleObj;
};

/**
 * @description 解析到标签名
 * @param {String} name 标签名
 * @private
 */
Parser.prototype.onTagName = function (name) {
  this.tagName = this.xml ? name : name.toLowerCase();
  if (this.tagName === 'svg') {
    this.xml = (this.xml || 0) + 1; // svg 标签内大小写敏感
  }
};

/**
 * @description 解析到属性名
 * @param {String} name 属性名
 * @private
 */
Parser.prototype.onAttrName = function (name) {
  name = this.xml ? name : name.toLowerCase();
  if (name.substr(0, 5) === 'data-') {
    if (name === 'data-src' && !this.attrs.src) {
      // data-src 自动转为 src
      this.attrName = 'src';
    } else if (this.tagName === 'img' || this.tagName === 'a') {
      // a 和 img 标签保留 data- 的属性，可以在 imgtap 和 linktap 事件中使用
      this.attrName = name;
    } else {
      // 剩余的移除以减小大小
      this.attrName = undefined;
    }
  } else {
    this.attrName = name;
    this.attrs[name] = 'T'; // boolean 型属性缺省设置
  }
};

/**
 * @description 解析到属性值
 * @param {String} val 属性值
 * @private
 */
Parser.prototype.onAttrVal = function (val) {
  var name = this.attrName || '';
  if (name === 'style' || name === 'href') {
    // 部分属性进行实体解码
    this.attrs[name] = decodeEntity(val, true);
  } else if (name.includes('src')) {
    // 拼接主域名
    this.attrs[name] = this.getUrl(decodeEntity(val, true));
  } else if (name) {
    this.attrs[name] = val;
  }
};

/**
 * @description 解析到标签开始
 * @param {Boolean} selfClose 是否有自闭合标识 />
 * @private
 */
Parser.prototype.onOpenTag = function (selfClose) {
  // 拼装 node
  var node = Object.create(null);
  node.name = this.tagName;
  node.attrs = this.attrs;
  // 避免因为自动 diff 使得 type 被设置为 null 导致部分内容不显示
  if (this.options.nodes.length) {
    node.type = 'node';
  }
  this.attrs = Object.create(null);
  var attrs = node.attrs;
  var parent = this.stack[this.stack.length - 1];
  var siblings = parent ? parent.children : this.nodes;
  var close = this.xml ? selfClose : config.voidTags[node.name];

  // 替换标签名选择器
  if (tagSelector[node.name]) {
    attrs.class = tagSelector[node.name] + (attrs.class ? ' ' + attrs.class : '');
  }

  // 转换 embed 标签
  if (node.name === 'embed') {
    var src = attrs.src || '';
    // 按照后缀名和 type 将 embed 转为 video 或 audio
    if (src.includes('.mp4') || src.includes('.3gp') || src.includes('.m3u8') || (attrs.type || '').includes('video')) {
      node.name = 'video';
    } else if (src.includes('.mp3') || src.includes('.wav') || src.includes('.aac') || src.includes('.m4a') || (attrs.type || '').includes('audio')) {
      node.name = 'audio';
    }
    if (attrs.autostart) {
      attrs.autoplay = 'T';
    }
    attrs.controls = 'T';
  }

  // 处理音视频
  if (node.name === 'video' || node.name === 'audio') {
    // 设置 id 以便获取 context
    if (node.name === 'video' && !attrs.id) {
      attrs.id = 'v' + idIndex++;
    }
    // 没有设置 controls 也没有设置 autoplay 的自动设置 controls
    if (!attrs.controls && !attrs.autoplay) {
      attrs.controls = 'T';
    }
    // 用数组存储所有可用的 source
    node.src = [];
    if (attrs.src) {
      node.src.push(attrs.src);
      attrs.src = undefined;
    }
    this.expose();
  }

  // 处理自闭合标签
  if (close) {
    if (!this.hook(node) || config.ignoreTags[node.name]) {
      // 通过 base 标签设置主域名
      if (node.name === 'base' && !this.options.domain) {
        this.options.domain = attrs.href;
      } else if (node.name === 'source' && parent && (parent.name === 'video' || parent.name === 'audio') && attrs.src) {
        // 设置 source 标签（仅父节点为 video 或 audio 时有效）
        parent.src.push(attrs.src);
      }
      return;
    }

    // 解析 style
    var styleObj = this.parseStyle(node);

    // 处理图片
    if (node.name === 'img') {
      if (attrs.src) {
        // 标记 webp
        if (attrs.src.includes('webp')) {
          node.webp = 'T';
        }
        // data url 图片如果没有设置 original-src 默认为不可预览的小图片
        if (attrs.src.includes('data:') && !attrs['original-src']) {
          attrs.ignore = 'T';
        }
        if (!attrs.ignore || node.webp || attrs.src.includes('cloud://')) {
          for (var i = this.stack.length; i--;) {
            var item = this.stack[i];
            if (item.name === 'a') {
              node.a = item.attrs;
            }
            if (item.name === 'table' && !node.webp && !attrs.src.includes('cloud://')) {
              if (!styleObj.display || styleObj.display.includes('inline')) {
                node.t = 'inline-block';
              } else {
                node.t = styleObj.display;
              }
              styleObj.display = undefined;
            }
            var style = item.attrs.style || '';
            if (style.includes('flex:') && !style.includes('flex:0') && !style.includes('flex: 0') && (!styleObj.width || parseInt(styleObj.width) > 100)) {
              styleObj.width = '100% !important';
              styleObj.height = '';
              for (var j = i + 1; j < this.stack.length; j++) {
                this.stack[j].attrs.style = (this.stack[j].attrs.style || '').replace('inline-', '');
              }
            } else if (style.includes('flex') && styleObj.width === '100%') {
              for (var _j = i + 1; _j < this.stack.length; _j++) {
                var _style = this.stack[_j].attrs.style || '';
                if (!_style.includes(';width') && !_style.includes(' width') && _style.indexOf('width') !== 0) {
                  styleObj.width = '';
                  break;
                }
              }
            } else if (style.includes('inline-block')) {
              if (styleObj.width && styleObj.width[styleObj.width.length - 1] === '%') {
                item.attrs.style += ';max-width:' + styleObj.width;
                styleObj.width = '';
              } else {
                item.attrs.style += ';max-width:100%';
              }
            }
            item.c = 1;
          }
          attrs.i = this.imgList.length.toString();
          var _src = attrs['original-src'] || attrs.src;
          if (this.imgList.includes(_src)) {
            // 如果有重复的链接则对域名进行随机大小写变换避免预览时错位
            var _i = _src.indexOf('://');
            if (_i !== -1) {
              _i += 3;
              var newSrc = _src.substr(0, _i);
              for (; _i < _src.length; _i++) {
                if (_src[_i] === '/') break;
                newSrc += Math.random() > 0.5 ? _src[_i].toUpperCase() : _src[_i];
              }
              newSrc += _src.substr(_i);
              _src = newSrc;
            }
          }
          this.imgList.push(_src);
          if (!node.t) {
            this.imgList._unloadimgs += 1;
          }
        }
      }
      if (styleObj.display === 'inline') {
        styleObj.display = '';
      }
      if (attrs.ignore) {
        styleObj['max-width'] = styleObj['max-width'] || '100%';
        attrs.style += ';-webkit-touch-callout:none';
      }

      // 设置的宽度超出屏幕，为避免变形，高度转为自动
      if (parseInt(styleObj.width) > windowWidth) {
        styleObj.height = undefined;
      }
      // 记录是否设置了宽高
      if (!isNaN(parseInt(styleObj.width))) {
        node.w = 'T';
      }
      if (!isNaN(parseInt(styleObj.height)) && (!styleObj.height.includes('%') || parent && (parent.attrs.style || '').includes('height'))) {
        node.h = 'T';
      }
    } else if (node.name === 'svg') {
      siblings.push(node);
      this.stack.push(node);
      this.popNode();
      return;
    }
    for (var key in styleObj) {
      if (styleObj[key]) {
        attrs.style += ";".concat(key, ":").concat(styleObj[key].replace(' !important', ''));
      }
    }
    attrs.style = attrs.style.substr(1) || undefined;
  } else {
    if ((node.name === 'pre' || (attrs.style || '').includes('white-space') && attrs.style.includes('pre')) && this.pre !== 2) {
      this.pre = node.pre = 1;
    }
    node.children = [];
    this.stack.push(node);
  }

  // 加入节点树
  siblings.push(node);
};

/**
 * @description 解析到标签结束
 * @param {String} name 标签名
 * @private
 */
Parser.prototype.onCloseTag = function (name) {
  // 依次出栈到匹配为止
  name = this.xml ? name : name.toLowerCase();
  var i;
  for (i = this.stack.length; i--;) {
    if (this.stack[i].name === name) break;
  }
  if (i !== -1) {
    while (this.stack.length > i) {
      this.popNode();
    }
  } else if (name === 'p' || name === 'br') {
    var siblings = this.stack.length ? this.stack[this.stack.length - 1].children : this.nodes;
    siblings.push({
      name: name,
      attrs: {
        class: tagSelector[name] || '',
        style: this.tagStyle[name] || ''
      }
    });
  }
};

/**
 * @description 处理标签出栈
 * @private
 */
Parser.prototype.popNode = function () {
  var editable = this.options.editable;
  var node = this.stack.pop();
  var attrs = node.attrs;
  var children = node.children;
  var parent = this.stack[this.stack.length - 1];
  var siblings = parent ? parent.children : this.nodes;
  if (!this.hook(node) || config.ignoreTags[node.name]) {
    // 获取标题
    if (node.name === 'title' && children.length && children[0].type === 'text' && this.options.setTitle) {
      uni.setNavigationBarTitle({
        title: children[0].text
      });
    }
    siblings.pop();
    return;
  }
  if (node.pre && this.pre !== 2) {
    // 是否合并空白符标识
    this.pre = node.pre = undefined;
    for (var i = this.stack.length; i--;) {
      if (this.stack[i].pre) {
        this.pre = 1;
      }
    }
  }
  var styleObj = {};

  // 转换 svg
  if (node.name === 'svg') {
    if (this.xml > 1) {
      // 多层 svg 嵌套
      this.xml--;
      return;
    }
    var src = '';
    var style = attrs.style;
    attrs.style = '';
    attrs.xmlns = 'http://www.w3.org/2000/svg';
    (function traversal(node) {
      if (node.type === 'text') {
        src += node.text;
        return;
      }
      var name = config.svgDict[node.name] || node.name;
      src += '<' + name;
      for (var item in node.attrs) {
        var val = node.attrs[item];
        if (val) {
          src += " ".concat(config.svgDict[item] || item, "=\"").concat(val, "\"");
        }
      }
      if (!node.children) {
        src += '/>';
      } else {
        src += '>';
        for (var _i2 = 0; _i2 < node.children.length; _i2++) {
          traversal(node.children[_i2]);
        }
        src += '</' + name + '>';
      }
    })(node);
    node.name = 'img';
    node.attrs = {
      src: 'data:image/svg+xml;utf8,' + src.replace(/#/g, '%23'),
      style: style,
      ignore: 'T'
    };
    node.children = undefined;
    this.xml = false;
    return;
  }

  // 转换 align 属性
  if (attrs.align) {
    if (node.name === 'table') {
      if (attrs.align === 'center') {
        styleObj['margin-inline-start'] = styleObj['margin-inline-end'] = 'auto';
      } else {
        styleObj.float = attrs.align;
      }
    } else {
      styleObj['text-align'] = attrs.align;
    }
    attrs.align = undefined;
  }

  // 转换 dir 属性
  if (attrs.dir) {
    styleObj.direction = attrs.dir;
    attrs.dir = undefined;
  }

  // 转换 font 标签的属性
  if (node.name === 'font') {
    if (attrs.color) {
      styleObj.color = attrs.color;
      attrs.color = undefined;
    }
    if (attrs.face) {
      styleObj['font-family'] = attrs.face;
      attrs.face = undefined;
    }
    if (attrs.size) {
      var size = parseInt(attrs.size);
      if (!isNaN(size)) {
        if (size < 1) {
          size = 1;
        } else if (size > 7) {
          size = 7;
        }
        styleObj['font-size'] = ['x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'xxx-large'][size - 1];
      }
      attrs.size = undefined;
    }
  }

  // 一些编辑器的自带 class
  if ((attrs.class || '').includes('align-center')) {
    styleObj['text-align'] = 'center';
  }
  Object.assign(styleObj, this.parseStyle(node));
  if (node.name !== 'table' && parseInt(styleObj.width) > windowWidth) {
    styleObj['max-width'] = '100%';
    styleObj['box-sizing'] = 'border-box';
  }
  if (config.blockTags[node.name]) {
    if (!editable) {
      node.name = 'div';
    }
  } else if (!config.trustTags[node.name] && !this.xml) {
    // 未知标签转为 span，避免无法显示
    node.name = 'span';
  }
  if (node.name === 'a' || node.name === 'ad') {
    this.expose();
  } else if (node.name === 'video') {
    if ((styleObj.height || '').includes('auto')) {
      styleObj.height = undefined;
    }
  } else if ((node.name === 'ul' || node.name === 'ol') && (node.c || editable)) {
    // 列表处理
    var types = {
      a: 'lower-alpha',
      A: 'upper-alpha',
      i: 'lower-roman',
      I: 'upper-roman'
    };
    if (types[attrs.type]) {
      attrs.style += ';list-style-type:' + types[attrs.type];
      attrs.type = undefined;
    }
    for (var _i3 = children.length; _i3--;) {
      if (children[_i3].name === 'li') {
        children[_i3].c = 1;
      }
    }
  } else if (node.name === 'table') {
    // 表格处理
    // cellpadding、cellspacing、border 这几个常用表格属性需要通过转换实现
    var padding = parseFloat(attrs.cellpadding);
    var spacing = parseFloat(attrs.cellspacing);
    var border = parseFloat(attrs.border);
    var bordercolor = styleObj['border-color'];
    var borderstyle = styleObj['border-style'];
    if (node.c || editable) {
      // padding 和 spacing 默认 2
      if (isNaN(padding)) {
        padding = 2;
      }
      if (isNaN(spacing)) {
        spacing = 2;
      }
    }
    if (border) {
      attrs.style += ";border:".concat(border, "px ").concat(borderstyle || 'solid', " ").concat(bordercolor || 'gray');
    }
    if (node.flag && (node.c || editable)) {
      // 有 colspan 或 rowspan 且含有链接的表格通过 grid 布局实现
      styleObj.display = 'grid';
      if (spacing) {
        styleObj['grid-gap'] = spacing + 'px';
        styleObj.padding = spacing + 'px';
      } else if (border) {
        // 无间隔的情况下避免边框重叠
        attrs.style += ';border-left:0;border-top:0';
      }
      var width = []; // 表格的列宽
      var trList = []; // tr 列表
      var cells = []; // 保存新的单元格
      var map = {}; // 被合并单元格占用的格子

      (function traversal(nodes) {
        for (var _i4 = 0; _i4 < nodes.length; _i4++) {
          if (nodes[_i4].name === 'tr') {
            trList.push(nodes[_i4]);
          } else {
            traversal(nodes[_i4].children || []);
          }
        }
      })(children);
      for (var row = 1; row <= trList.length; row++) {
        var col = 1;
        for (var j = 0; j < trList[row - 1].children.length; j++) {
          var td = trList[row - 1].children[j];
          if (td.name === 'td' || td.name === 'th') {
            // 这个格子被上面的单元格占用，则列号++
            while (map[row + '.' + col]) {
              col++;
            }
            if (editable) {
              td.r = row;
            }
            var _style2 = td.attrs.style || '';
            var start = _style2.indexOf('width') ? _style2.indexOf(';width') : 0;
            // 提取出 td 的宽度
            if (start !== -1) {
              var end = _style2.indexOf(';', start + 6);
              if (end === -1) {
                end = _style2.length;
              }
              if (!td.attrs.colspan) {
                width[col] = _style2.substring(start ? start + 7 : 6, end);
              }
              _style2 = _style2.substr(0, start) + _style2.substr(end);
            }
            // 设置竖直对齐
            _style2 += ';display:flex';
            start = _style2.indexOf('vertical-align');
            if (start !== -1) {
              var val = _style2.substr(start + 15, 10);
              if (val.includes('middle')) {
                _style2 += ';align-items:center';
              } else if (val.includes('bottom')) {
                _style2 += ';align-items:flex-end';
              }
            } else {
              _style2 += ';align-items:center';
            }
            // 设置水平对齐
            start = _style2.indexOf('text-align');
            if (start !== -1) {
              var _val = _style2.substr(start + 11, 10);
              if (_val.includes('center')) {
                _style2 += ';justify-content: center';
              } else if (_val.includes('right')) {
                _style2 += ';justify-content: right';
              }
            }
            _style2 = (border ? ";border:".concat(border, "px ").concat(borderstyle || 'solid', " ").concat(bordercolor || 'gray') + (spacing ? '' : ';border-right:0;border-bottom:0') : '') + (padding ? ";padding:".concat(padding, "px") : '') + ';' + _style2;
            // 处理列合并
            if (td.attrs.colspan) {
              _style2 += ";grid-column-start:".concat(col, ";grid-column-end:").concat(col + parseInt(td.attrs.colspan));
              if (!td.attrs.rowspan) {
                _style2 += ";grid-row-start:".concat(row, ";grid-row-end:").concat(row + 1);
              }
              col += parseInt(td.attrs.colspan) - 1;
            }
            // 处理行合并
            if (td.attrs.rowspan) {
              _style2 += ";grid-row-start:".concat(row, ";grid-row-end:").concat(row + parseInt(td.attrs.rowspan));
              if (!td.attrs.colspan) {
                _style2 += ";grid-column-start:".concat(col, ";grid-column-end:").concat(col + 1);
              }
              // 记录下方单元格被占用
              for (var rowspan = 1; rowspan < td.attrs.rowspan; rowspan++) {
                for (var colspan = 0; colspan < (td.attrs.colspan || 1); colspan++) {
                  map[row + rowspan + '.' + (col - colspan)] = 1;
                }
              }
            }
            if (_style2) {
              td.attrs.style = _style2;
            }
            cells.push(td);
            col++;
          }
        }
        if (row === 1) {
          var temp = '';
          for (var _i5 = 1; _i5 < col; _i5++) {
            temp += (width[_i5] ? width[_i5] : 'auto') + ' ';
          }
          styleObj['grid-template-columns'] = temp;
        }
      }
      node.children = cells;
    } else {
      // 没有使用合并单元格的表格通过 table 布局实现
      if (node.c || editable) {
        styleObj.display = 'table';
      }
      if (!isNaN(spacing)) {
        styleObj['border-spacing'] = spacing + 'px';
      }
      if (border || padding) {
        // 遍历
        (function traversal(nodes) {
          for (var _i6 = 0; _i6 < nodes.length; _i6++) {
            var _td = nodes[_i6];
            if (_td.name === 'th' || _td.name === 'td') {
              if (border) {
                _td.attrs.style = "border:".concat(border, "px ").concat(borderstyle || 'solid', " ").concat(bordercolor || 'gray', ";").concat(_td.attrs.style || '');
              }
              if (padding) {
                _td.attrs.style = "padding:".concat(padding, "px;").concat(_td.attrs.style || '');
              }
            } else if (_td.children) {
              traversal(_td.children);
            }
          }
        })(children);
      }
    }
    // 给表格添加一个单独的横向滚动层
    if (this.options.scrollTable && !(attrs.style || '').includes('inline')) {
      var table = Object.assign({}, node);
      node.name = 'div';
      node.attrs = {
        style: 'overflow:auto'
      };
      node.children = [table];
      attrs = table.attrs;
    }
  } else if ((node.name === 'td' || node.name === 'th') && (attrs.colspan || attrs.rowspan)) {
    for (var _i7 = this.stack.length; _i7--;) {
      if (this.stack[_i7].name === 'table') {
        this.stack[_i7].flag = 1; // 指示含有合并单元格
        break;
      }
    }
  } else if (node.name === 'ruby') {
    // 转换 ruby
    node.name = 'span';
    for (var _i8 = 0; _i8 < children.length - 1; _i8++) {
      if (children[_i8].type === 'text' && children[_i8 + 1].name === 'rt') {
        children[_i8] = {
          name: 'div',
          attrs: {
            style: 'display:inline-block;text-align:center'
          },
          children: [{
            name: 'div',
            attrs: {
              style: 'font-size:50%;' + (children[_i8 + 1].attrs.style || '')
            },
            children: children[_i8 + 1].children
          }, children[_i8]]
        };
        children.splice(_i8 + 1, 1);
      }
    }
  } else if (!editable && node.c) {
    (function traversal(node) {
      node.c = 2;
      for (var _i9 = node.children.length; _i9--;) {
        var child = node.children[_i9];
        if (!child.c || child.name === 'table') {
          node.c = 1;
        }
      }
    })(node);
  }
  if ((styleObj.display || '').includes('flex') && !(node.c || editable)) {
    for (var _i10 = children.length; _i10--;) {
      var item = children[_i10];
      if (item.f) {
        item.attrs.style = (item.attrs.style || '') + item.f;
        item.f = undefined;
      }
    }
  }
  // flex 布局时部分样式需要提取到 rich-text 外层
  var flex = parent && ((parent.attrs.style || '').includes('flex') || (parent.attrs.style || '').includes('grid'))

  // 检查基础库版本 virtualHost 是否可用
  && !((node.c || editable) && wx.getNFCAdapter); // eslint-disable-line

  if (flex) {
    node.f = ';max-width:100%';
  }
  if (children.length >= 50 && (node.c || editable) && !(styleObj.display || '').includes('flex')) {
    mergeNodes(children);
  }
  for (var key in styleObj) {
    if (styleObj[key]) {
      var _val2 = ";".concat(key, ":").concat(styleObj[key].replace(' !important', ''));
      if (flex && (key.includes('flex') && key !== 'flex-direction' || key === 'align-self' || key.includes('grid') || styleObj[key][0] === '-' || key.includes('width') && _val2.includes('%'))) {
        node.f += _val2;
        if (key === 'width') {
          attrs.style += ';width:100%';
        }
      } else {
        attrs.style += _val2;
      }
    }
  }
  attrs.style = attrs.style.substr(1) || undefined;
};

/**
 * @description 解析到文本
 * @param {String} text 文本内容
 */
Parser.prototype.onText = function (text) {
  if (!this.pre) {
    // 合并空白符
    var trim = '';
    var flag;
    for (var i = 0, len = text.length; i < len; i++) {
      if (!blankChar[text[i]]) {
        trim += text[i];
      } else {
        if (trim[trim.length - 1] !== ' ') {
          trim += ' ';
        }
        if (text[i] === '\n' && !flag) {
          flag = true;
        }
      }
    }
    // 去除含有换行符的空串
    if (trim === ' ') {
      if (flag) return;
    }
    text = trim;
  }
  var node = Object.create(null);
  node.type = 'text';
  node.text = decodeEntity(text);
  if (this.hook(node)) {
    if (this.options.selectable === 'force' && system.includes('iOS') && !uni.canIUse('rich-text.user-select')) {
      this.expose();
    }
    var siblings = this.stack.length ? this.stack[this.stack.length - 1].children : this.nodes;
    siblings.push(node);
  }
};

/**
 * @description html 词法分析器
 * @param {Object} handler 高层处理器
 */
function Lexer(handler) {
  this.handler = handler;
}

/**
 * @description 执行解析
 * @param {String} content 要解析的文本
 */
Lexer.prototype.parse = function (content) {
  this.content = content || '';
  this.i = 0; // 标记解析位置
  this.start = 0; // 标记一个单词的开始位置
  this.state = this.text; // 当前状态
  for (var len = this.content.length; this.i !== -1 && this.i < len;) {
    this.state();
  }
};

/**
 * @description 检查标签是否闭合
 * @param {String} method 如果闭合要进行的操作
 * @returns {Boolean} 是否闭合
 * @private
 */
Lexer.prototype.checkClose = function (method) {
  var selfClose = this.content[this.i] === '/';
  if (this.content[this.i] === '>' || selfClose && this.content[this.i + 1] === '>') {
    if (method) {
      this.handler[method](this.content.substring(this.start, this.i));
    }
    this.i += selfClose ? 2 : 1;
    this.start = this.i;
    this.handler.onOpenTag(selfClose);
    if (this.handler.tagName === 'script') {
      this.i = this.content.indexOf('</', this.i);
      if (this.i !== -1) {
        this.i += 2;
        this.start = this.i;
      }
      this.state = this.endTag;
    } else {
      this.state = this.text;
    }
    return true;
  }
  return false;
};

/**
 * @description 文本状态
 * @private
 */
Lexer.prototype.text = function () {
  this.i = this.content.indexOf('<', this.i); // 查找最近的标签
  if (this.i === -1) {
    // 没有标签了
    if (this.start < this.content.length) {
      this.handler.onText(this.content.substring(this.start, this.content.length));
    }
    return;
  }
  var c = this.content[this.i + 1];
  if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
    // 标签开头
    if (this.start !== this.i) {
      this.handler.onText(this.content.substring(this.start, this.i));
    }
    this.start = ++this.i;
    this.state = this.tagName;
  } else if (c === '/' || c === '!' || c === '?') {
    if (this.start !== this.i) {
      this.handler.onText(this.content.substring(this.start, this.i));
    }
    var next = this.content[this.i + 2];
    if (c === '/' && (next >= 'a' && next <= 'z' || next >= 'A' && next <= 'Z')) {
      // 标签结尾
      this.i += 2;
      this.start = this.i;
      this.state = this.endTag;
      return;
    }
    // 处理注释
    var end = '-->';
    if (c !== '!' || this.content[this.i + 2] !== '-' || this.content[this.i + 3] !== '-') {
      end = '>';
    }
    this.i = this.content.indexOf(end, this.i);
    if (this.i !== -1) {
      this.i += end.length;
      this.start = this.i;
    }
  } else {
    this.i++;
  }
};

/**
 * @description 标签名状态
 * @private
 */
Lexer.prototype.tagName = function () {
  if (blankChar[this.content[this.i]]) {
    // 解析到标签名
    this.handler.onTagName(this.content.substring(this.start, this.i));
    while (blankChar[this.content[++this.i]]) {
      ;
    }
    if (this.i < this.content.length && !this.checkClose()) {
      this.start = this.i;
      this.state = this.attrName;
    }
  } else if (!this.checkClose('onTagName')) {
    this.i++;
  }
};

/**
 * @description 属性名状态
 * @private
 */
Lexer.prototype.attrName = function () {
  var c = this.content[this.i];
  if (blankChar[c] || c === '=') {
    // 解析到属性名
    this.handler.onAttrName(this.content.substring(this.start, this.i));
    var needVal = c === '=';
    var len = this.content.length;
    while (++this.i < len) {
      c = this.content[this.i];
      if (!blankChar[c]) {
        if (this.checkClose()) return;
        if (needVal) {
          // 等号后遇到第一个非空字符
          this.start = this.i;
          this.state = this.attrVal;
          return;
        }
        if (this.content[this.i] === '=') {
          needVal = true;
        } else {
          this.start = this.i;
          this.state = this.attrName;
          return;
        }
      }
    }
  } else if (!this.checkClose('onAttrName')) {
    this.i++;
  }
};

/**
 * @description 属性值状态
 * @private
 */
Lexer.prototype.attrVal = function () {
  var c = this.content[this.i];
  var len = this.content.length;
  if (c === '"' || c === "'") {
    // 有冒号的属性
    this.start = ++this.i;
    this.i = this.content.indexOf(c, this.i);
    if (this.i === -1) return;
    this.handler.onAttrVal(this.content.substring(this.start, this.i));
  } else {
    // 没有冒号的属性
    for (; this.i < len; this.i++) {
      if (blankChar[this.content[this.i]]) {
        this.handler.onAttrVal(this.content.substring(this.start, this.i));
        break;
      } else if (this.checkClose('onAttrVal')) return;
    }
  }
  while (blankChar[this.content[++this.i]]) {
    ;
  }
  if (this.i < len && !this.checkClose()) {
    this.start = this.i;
    this.state = this.attrName;
  }
};

/**
 * @description 结束标签状态
 * @returns {String} 结束的标签名
 * @private
 */
Lexer.prototype.endTag = function () {
  var c = this.content[this.i];
  if (blankChar[c] || c === '>' || c === '/') {
    this.handler.onCloseTag(this.content.substring(this.start, this.i));
    if (c !== '>') {
      this.i = this.content.indexOf('>', this.i);
      if (this.i === -1) return;
    }
    this.start = ++this.i;
    this.state = this.text;
  } else {
    this.i++;
  }
};
var _default = Parser;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"]))

/***/ }),
/* 198 */
/*!****************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/markdown/index.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _marked = _interopRequireDefault(__webpack_require__(/*! ./marked.min */ 199));
/**
 * @fileoverview markdown 插件
 * Include marked (https://github.com/markedjs/marked)
 * Include github-markdown-css (https://github.com/sindresorhus/github-markdown-css)
 */

var index = 0;
function Markdown(vm) {
  this.vm = vm;
  vm._ids = {};
}
Markdown.prototype.onUpdate = function (content) {
  if (this.vm.markdown) {
    return (0, _marked.default)(content);
  }
};
Markdown.prototype.onParse = function (node, vm) {
  if (vm.options.markdown) {
    // 中文 id 需要转换，否则无法跳转
    if (vm.options.useAnchor && node.attrs && /[\u4e00-\u9fa5]/.test(node.attrs.id)) {
      var id = 't' + index++;
      this.vm._ids[node.attrs.id] = id;
      node.attrs.id = id;
    }
    if (node.name === 'p' || node.name === 'table' || node.name === 'tr' || node.name === 'th' || node.name === 'td' || node.name === 'blockquote' || node.name === 'pre' || node.name === 'code') {
      node.attrs.class = "md-".concat(node.name, " ").concat(node.attrs.class || '');
    }
  }
};
var _default = Markdown;
exports.default = _default;

/***/ }),
/* 199 */
/*!*********************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/markdown/marked.min.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/*!
 * marked - a markdown parser
 * Copyright (c) 2011-2020, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */
function t() {
  "use strict";

  function i(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
    }
  }
  function s(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) {
      r[n] = e[n];
    }
    return r;
  }
  function p(e, t) {
    var n;
    if ("undefined" != typeof Symbol && null != e[Symbol.iterator]) return (n = e[Symbol.iterator]()).next.bind(n);
    if (Array.isArray(e) || (n = function (e, t) {
      if (e) {
        if ("string" == typeof e) return s(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? s(e, t) : void 0;
      }
    }(e)) || t && e && "number" == typeof e.length) {
      n && (e = n);
      var r = 0;
      return function () {
        return r >= e.length ? {
          done: !0
        } : {
          done: !1,
          value: e[r++]
        };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function n(e) {
    return c[e];
  }
  var e,
    t = (function (t) {
      function e() {
        return {
          baseUrl: null,
          breaks: !1,
          gfm: !0,
          headerIds: !0,
          headerPrefix: "",
          highlight: null,
          langPrefix: "language-",
          mangle: !0,
          pedantic: !1,
          renderer: null,
          sanitize: !1,
          sanitizer: null,
          silent: !1,
          smartLists: !1,
          smartypants: !1,
          tokenizer: null,
          walkTokens: null,
          xhtml: !1
        };
      }
      t.exports = {
        defaults: e(),
        getDefaults: e,
        changeDefaults: function changeDefaults(e) {
          t.exports.defaults = e;
        }
      };
    }(e = {
      exports: {}
    }), e.exports),
    r = (t.defaults, t.getDefaults, t.changeDefaults, /[&<>"']/),
    l = /[&<>"']/g,
    a = /[<>"']|&(?!#?\w+;)/,
    o = /[<>"']|&(?!#?\w+;)/g,
    c = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
  var u = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;
  function h(e) {
    return e.replace(u, function (e, t) {
      return "colon" === (t = t.toLowerCase()) ? ":" : "#" === t.charAt(0) ? "x" === t.charAt(1) ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(+t.substring(1)) : "";
    });
  }
  var g = /(^|[^\[])\^/g;
  var f = /[^\w:]/g,
    d = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
  var k = {},
    b = /^[^:]+:\/*[^/]*$/,
    m = /^([^:]+:)[\s\S]*$/,
    x = /^([^:]+:\/*[^/]*)[\s\S]*$/;
  function w(e, t) {
    k[" " + e] || (b.test(e) ? k[" " + e] = e + "/" : k[" " + e] = v(e, "/", !0));
    var n = -1 === (e = k[" " + e]).indexOf(":");
    return "//" === t.substring(0, 2) ? n ? t : e.replace(m, "$1") + t : "/" === t.charAt(0) ? n ? t : e.replace(x, "$1") + t : e + t;
  }
  function v(e, t, n) {
    var r = e.length;
    if (0 === r) return "";
    for (var i = 0; i < r;) {
      var s = e.charAt(r - i - 1);
      if (s !== t || n) {
        if (s === t || !n) break;
        i++;
      } else i++;
    }
    return e.substr(0, r - i);
  }
  var _ = function _(e, t) {
      if (t) {
        if (r.test(e)) return e.replace(l, n);
      } else if (a.test(e)) return e.replace(o, n);
      return e;
    },
    y = h,
    z = function z(n, e) {
      n = n.source || n, e = e || "";
      var r = {
        replace: function replace(e, t) {
          return t = (t = t.source || t).replace(g, "$1"), n = n.replace(e, t), r;
        },
        getRegex: function getRegex() {
          return new RegExp(n, e);
        }
      };
      return r;
    },
    S = function S(e, t, n) {
      if (e) {
        var r;
        try {
          r = decodeURIComponent(h(n)).replace(f, "").toLowerCase();
        } catch (e) {
          return null;
        }
        if (0 === r.indexOf("javascript:") || 0 === r.indexOf("vbscript:") || 0 === r.indexOf("data:")) return null;
      }
      t && !d.test(n) && (n = w(t, n));
      try {
        n = encodeURI(n).replace(/%25/g, "%");
      } catch (e) {
        return null;
      }
      return n;
    },
    $ = {
      exec: function exec() {}
    },
    A = function A(e) {
      for (var t, n, r = 1; r < arguments.length; r++) {
        for (n in t = arguments[r]) {
          Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
        }
      }
      return e;
    },
    R = function R(e, t) {
      var n = e.replace(/\|/g, function (e, t, n) {
          for (var r = !1, i = t; 0 <= --i && "\\" === n[i];) {
            r = !r;
          }
          return r ? "|" : " |";
        }).split(/ \|/),
        r = 0;
      if (n.length > t) n.splice(t);else for (; n.length < t;) {
        n.push("");
      }
      for (; r < n.length; r++) {
        n[r] = n[r].trim().replace(/\\\|/g, "|");
      }
      return n;
    },
    T = function T(e, t) {
      if (-1 === e.indexOf(t[1])) return -1;
      for (var n = e.length, r = 0, i = 0; i < n; i++) {
        if ("\\" === e[i]) i++;else if (e[i] === t[0]) r++;else if (e[i] === t[1] && --r < 0) return i;
      }
      return -1;
    },
    I = function I(e) {
      e && e.sanitize && !e.silent && console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
    },
    Z = function Z(e, t) {
      if (t < 1) return "";
      for (var n = ""; 1 < t;) {
        1 & t && (n += e), t >>= 1, e += e;
      }
      return n + e;
    },
    q = t.defaults,
    O = v,
    C = R,
    U = _,
    j = T;
  function E(e, t, n) {
    var r = t.href,
      i = t.title ? U(t.title) : null,
      t = e[1].replace(/\\([\[\]])/g, "$1");
    return "!" !== e[0].charAt(0) ? {
      type: "link",
      raw: n,
      href: r,
      title: i,
      text: t
    } : {
      type: "image",
      raw: n,
      href: r,
      title: i,
      text: U(t)
    };
  }
  var D = function () {
      function e(e) {
        this.options = e || q;
      }
      var t = e.prototype;
      return t.space = function (e) {
        e = this.rules.block.newline.exec(e);
        if (e) return 1 < e[0].length ? {
          type: "space",
          raw: e[0]
        } : {
          raw: "\n"
        };
      }, t.code = function (e, t) {
        e = this.rules.block.code.exec(e);
        if (e) {
          t = t[t.length - 1];
          if (t && "paragraph" === t.type) return {
            raw: e[0],
            text: e[0].trimRight()
          };
          t = e[0].replace(/^ {4}/gm, "");
          return {
            type: "code",
            raw: e[0],
            codeBlockStyle: "indented",
            text: this.options.pedantic ? t : O(t, "\n")
          };
        }
      }, t.fences = function (e) {
        var t = this.rules.block.fences.exec(e);
        if (t) {
          var n = t[0],
            e = function (e, t) {
              if (null === (e = e.match(/^(\s+)(?:```)/))) return t;
              var n = e[1];
              return t.split("\n").map(function (e) {
                var t = e.match(/^\s+/);
                return null !== t && t[0].length >= n.length ? e.slice(n.length) : e;
              }).join("\n");
            }(n, t[3] || "");
          return {
            type: "code",
            raw: n,
            lang: t[2] && t[2].trim(),
            text: e
          };
        }
      }, t.heading = function (e) {
        e = this.rules.block.heading.exec(e);
        if (e) return {
          type: "heading",
          raw: e[0],
          depth: e[1].length,
          text: e[2]
        };
      }, t.nptable = function (e) {
        e = this.rules.block.nptable.exec(e);
        if (e) {
          var t = {
            type: "table",
            header: C(e[1].replace(/^ *| *\| *$/g, "")),
            align: e[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: e[3] ? e[3].replace(/\n$/, "").split("\n") : [],
            raw: e[0]
          };
          if (t.header.length === t.align.length) {
            for (var n = t.align.length, r = 0; r < n; r++) {
              /^ *-+: *$/.test(t.align[r]) ? t.align[r] = "right" : /^ *:-+: *$/.test(t.align[r]) ? t.align[r] = "center" : /^ *:-+ *$/.test(t.align[r]) ? t.align[r] = "left" : t.align[r] = null;
            }
            for (n = t.cells.length, r = 0; r < n; r++) {
              t.cells[r] = C(t.cells[r], t.header.length);
            }
            return t;
          }
        }
      }, t.hr = function (e) {
        e = this.rules.block.hr.exec(e);
        if (e) return {
          type: "hr",
          raw: e[0]
        };
      }, t.blockquote = function (e) {
        var t = this.rules.block.blockquote.exec(e);
        if (t) {
          e = t[0].replace(/^ *> ?/gm, "");
          return {
            type: "blockquote",
            raw: t[0],
            text: e
          };
        }
      }, t.list = function (e) {
        e = this.rules.block.list.exec(e);
        if (e) {
          for (var t, n, r, i, s, l = e[0], a = e[2], o = 1 < a.length, c = {
              type: "list",
              raw: l,
              ordered: o,
              start: o ? +a.slice(0, -1) : "",
              loose: !1,
              items: []
            }, u = e[0].match(this.rules.block.item), p = !1, h = u.length, g = this.rules.block.listItemStart.exec(u[0]), f = 0; f < h; f++) {
            if (l = t = u[f], f !== h - 1) {
              if ((r = this.rules.block.listItemStart.exec(u[f + 1]))[1].length > g[0].length || 3 < r[1].length) {
                u.splice(f, 2, u[f] + "\n" + u[f + 1]), f--, h--;
                continue;
              }
              (!this.options.pedantic || this.options.smartLists ? r[2][r[2].length - 1] !== a[a.length - 1] : o == (1 === r[2].length)) && (n = u.slice(f + 1).join("\n"), c.raw = c.raw.substring(0, c.raw.length - n.length), f = h - 1), g = r;
            }
            r = t.length, ~(t = t.replace(/^ *([*+-]|\d+[.)]) ?/, "")).indexOf("\n ") && (r -= t.length, t = this.options.pedantic ? t.replace(/^ {1,4}/gm, "") : t.replace(new RegExp("^ {1," + r + "}", "gm"), "")), r = p || /\n\n(?!\s*$)/.test(t), f !== h - 1 && (p = "\n" === t.charAt(t.length - 1), r = r || p), r && (c.loose = !0), this.options.gfm && (s = void 0, (i = /^\[[ xX]\] /.test(t)) && (s = " " !== t[1], t = t.replace(/^\[[ xX]\] +/, ""))), c.items.push({
              type: "list_item",
              raw: l,
              task: i,
              checked: s,
              loose: r,
              text: t
            });
          }
          return c;
        }
      }, t.html = function (e) {
        e = this.rules.block.html.exec(e);
        if (e) return {
          type: this.options.sanitize ? "paragraph" : "html",
          raw: e[0],
          pre: !this.options.sanitizer && ("pre" === e[1] || "script" === e[1] || "style" === e[1]),
          text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : U(e[0]) : e[0]
        };
      }, t.def = function (e) {
        e = this.rules.block.def.exec(e);
        if (e) return e[3] && (e[3] = e[3].substring(1, e[3].length - 1)), {
          tag: e[1].toLowerCase().replace(/\s+/g, " "),
          raw: e[0],
          href: e[2],
          title: e[3]
        };
      }, t.table = function (e) {
        e = this.rules.block.table.exec(e);
        if (e) {
          var t = {
            type: "table",
            header: C(e[1].replace(/^ *| *\| *$/g, "")),
            align: e[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: e[3] ? e[3].replace(/\n$/, "").split("\n") : []
          };
          if (t.header.length === t.align.length) {
            t.raw = e[0];
            for (var n = t.align.length, r = 0; r < n; r++) {
              /^ *-+: *$/.test(t.align[r]) ? t.align[r] = "right" : /^ *:-+: *$/.test(t.align[r]) ? t.align[r] = "center" : /^ *:-+ *$/.test(t.align[r]) ? t.align[r] = "left" : t.align[r] = null;
            }
            for (n = t.cells.length, r = 0; r < n; r++) {
              t.cells[r] = C(t.cells[r].replace(/^ *\| *| *\| *$/g, ""), t.header.length);
            }
            return t;
          }
        }
      }, t.lheading = function (e) {
        e = this.rules.block.lheading.exec(e);
        if (e) return {
          type: "heading",
          raw: e[0],
          depth: "=" === e[2].charAt(0) ? 1 : 2,
          text: e[1]
        };
      }, t.paragraph = function (e) {
        e = this.rules.block.paragraph.exec(e);
        if (e) return {
          type: "paragraph",
          raw: e[0],
          text: "\n" === e[1].charAt(e[1].length - 1) ? e[1].slice(0, -1) : e[1]
        };
      }, t.text = function (e, t) {
        e = this.rules.block.text.exec(e);
        if (e) {
          t = t[t.length - 1];
          return t && "text" === t.type ? {
            raw: e[0],
            text: e[0]
          } : {
            type: "text",
            raw: e[0],
            text: e[0]
          };
        }
      }, t.escape = function (e) {
        e = this.rules.inline.escape.exec(e);
        if (e) return {
          type: "escape",
          raw: e[0],
          text: U(e[1])
        };
      }, t.tag = function (e, t, n) {
        e = this.rules.inline.tag.exec(e);
        if (e) return !t && /^<a /i.test(e[0]) ? t = !0 : t && /^<\/a>/i.test(e[0]) && (t = !1), !n && /^<(pre|code|kbd|script)(\s|>)/i.test(e[0]) ? n = !0 : n && /^<\/(pre|code|kbd|script)(\s|>)/i.test(e[0]) && (n = !1), {
          type: this.options.sanitize ? "text" : "html",
          raw: e[0],
          inLink: t,
          inRawBlock: n,
          text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : U(e[0]) : e[0]
        };
      }, t.link = function (e) {
        var t = this.rules.inline.link.exec(e);
        if (t) {
          e = j(t[2], "()");
          -1 < e && (r = (0 === t[0].indexOf("!") ? 5 : 4) + t[1].length + e, t[2] = t[2].substring(0, e), t[0] = t[0].substring(0, r).trim(), t[3] = "");
          var n,
            e = t[2],
            r = "";
          return r = this.options.pedantic ? (n = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(e), n ? (e = n[1], n[3]) : "") : t[3] ? t[3].slice(1, -1) : "", E(t, {
            href: (e = e.trim().replace(/^<([\s\S]*)>$/, "$1")) && e.replace(this.rules.inline._escapes, "$1"),
            title: r && r.replace(this.rules.inline._escapes, "$1")
          }, t[0]);
        }
      }, t.reflink = function (e, t) {
        if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
          e = (n[2] || n[1]).replace(/\s+/g, " ");
          if ((e = t[e.toLowerCase()]) && e.href) return E(n, e, n[0]);
          var n = n[0].charAt(0);
          return {
            type: "text",
            raw: n,
            text: n
          };
        }
      }, t.strong = function (e, t, n) {
        void 0 === n && (n = "");
        var r = this.rules.inline.strong.start.exec(e);
        if (r && (!r[1] || r[1] && ("" === n || this.rules.inline.punctuation.exec(n)))) {
          t = t.slice(-1 * e.length);
          var i,
            s = "**" === r[0] ? this.rules.inline.strong.endAst : this.rules.inline.strong.endUnd;
          for (s.lastIndex = 0; null != (r = s.exec(t));) {
            if (i = this.rules.inline.strong.middle.exec(t.slice(0, r.index + 3))) return {
              type: "strong",
              raw: e.slice(0, i[0].length),
              text: e.slice(2, i[0].length - 2)
            };
          }
        }
      }, t.em = function (e, t, n) {
        void 0 === n && (n = "");
        var r = this.rules.inline.em.start.exec(e);
        if (r && (!r[1] || r[1] && ("" === n || this.rules.inline.punctuation.exec(n)))) {
          t = t.slice(-1 * e.length);
          var i,
            s = "*" === r[0] ? this.rules.inline.em.endAst : this.rules.inline.em.endUnd;
          for (s.lastIndex = 0; null != (r = s.exec(t));) {
            if (i = this.rules.inline.em.middle.exec(t.slice(0, r.index + 2))) return {
              type: "em",
              raw: e.slice(0, i[0].length),
              text: e.slice(1, i[0].length - 1)
            };
          }
        }
      }, t.codespan = function (e) {
        var t = this.rules.inline.code.exec(e);
        if (t) {
          var n = t[2].replace(/\n/g, " "),
            r = /[^ ]/.test(n),
            e = n.startsWith(" ") && n.endsWith(" ");
          return r && e && (n = n.substring(1, n.length - 1)), n = U(n, !0), {
            type: "codespan",
            raw: t[0],
            text: n
          };
        }
      }, t.br = function (e) {
        e = this.rules.inline.br.exec(e);
        if (e) return {
          type: "br",
          raw: e[0]
        };
      }, t.del = function (e) {
        e = this.rules.inline.del.exec(e);
        if (e) return {
          type: "del",
          raw: e[0],
          text: e[2]
        };
      }, t.autolink = function (e, t) {
        e = this.rules.inline.autolink.exec(e);
        if (e) {
          var n,
            t = "@" === e[2] ? "mailto:" + (n = U(this.options.mangle ? t(e[1]) : e[1])) : n = U(e[1]);
          return {
            type: "link",
            raw: e[0],
            text: n,
            href: t,
            tokens: [{
              type: "text",
              raw: n,
              text: n
            }]
          };
        }
      }, t.url = function (e, t) {
        var n, r, i, s;
        if (n = this.rules.inline.url.exec(e)) {
          if ("@" === n[2]) i = "mailto:" + (r = U(this.options.mangle ? t(n[0]) : n[0]));else {
            for (; s = n[0], n[0] = this.rules.inline._backpedal.exec(n[0])[0], s !== n[0];) {
              ;
            }
            r = U(n[0]), i = "www." === n[1] ? "http://" + r : r;
          }
          return {
            type: "link",
            raw: n[0],
            text: r,
            href: i,
            tokens: [{
              type: "text",
              raw: r,
              text: r
            }]
          };
        }
      }, t.inlineText = function (e, t, n) {
        e = this.rules.inline.text.exec(e);
        if (e) {
          n = t ? this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : U(e[0]) : e[0] : U(this.options.smartypants ? n(e[0]) : e[0]);
          return {
            type: "text",
            raw: e[0],
            text: n
          };
        }
      }, e;
    }(),
    R = $,
    T = z,
    $ = A,
    z = {
      newline: /^\n+/,
      code: /^( {4}[^\n]+\n*)+/,
      fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
      hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?! {0,3}bull )\n*|\s*$)/,
      html: "^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$))",
      def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
      nptable: R,
      table: R,
      lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
      text: /^[^\n]+/,
      _label: /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/,
      _title: /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
    };
  z.def = T(z.def).replace("label", z._label).replace("title", z._title).getRegex(), z.bullet = /(?:[*+-]|\d{1,9}[.)])/, z.item = /^( *)(bull) ?[^\n]*(?:\n(?! *bull ?)[^\n]*)*/, z.item = T(z.item, "gm").replace(/bull/g, z.bullet).getRegex(), z.listItemStart = T(/^( *)(bull)/).replace("bull", z.bullet).getRegex(), z.list = T(z.list).replace(/bull/g, z.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + z.def.source + ")").getRegex(), z._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", z._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/, z.html = T(z.html, "i").replace("comment", z._comment).replace("tag", z._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), z.paragraph = T(z._paragraph).replace("hr", z.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", z._tag).getRegex(), z.blockquote = T(z.blockquote).replace("paragraph", z.paragraph).getRegex(), z.normal = $({}, z), z.gfm = $({}, z.normal, {
    nptable: "^ *([^|\\n ].*\\|.*)\\n {0,3}([-:]+ *\\|[-| :]*)(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)",
    table: "^ *\\|(.+)\\n {0,3}\\|?( *[-:]+[-| :]*)(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
  }), z.gfm.nptable = T(z.gfm.nptable).replace("hr", z.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", z._tag).getRegex(), z.gfm.table = T(z.gfm.table).replace("hr", z.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", z._tag).getRegex(), z.pedantic = $({}, z.normal, {
    html: T("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", z._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
    fences: R,
    paragraph: T(z.normal._paragraph).replace("hr", z.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", z.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
  });
  R = {
    escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: R,
    tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
    link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
    reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
    nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
    reflinkSearch: "reflink|nolink(?!\\()",
    strong: {
      start: /^(?:(\*\*(?=[*punctuation]))|\*\*)(?![\s])|__/,
      middle: /^\*\*(?:(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)|\*(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)*?\*)+?\*\*$|^__(?![\s])((?:(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)|_(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)*?_)+?)__$/,
      endAst: /[^punctuation\s]\*\*(?!\*)|[punctuation]\*\*(?!\*)(?:(?=[punctuation_\s]|$))/,
      endUnd: /[^\s]__(?!_)(?:(?=[punctuation*\s])|$)/
    },
    em: {
      start: /^(?:(\*(?=[punctuation]))|\*)(?![*\s])|_/,
      middle: /^\*(?:(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)|\*(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)*?\*)+?\*$|^_(?![_\s])(?:(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)|_(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)*?_)+?_$/,
      endAst: /[^punctuation\s]\*(?!\*)|[punctuation]\*(?!\*)(?:(?=[punctuation_\s]|$))/,
      endUnd: /[^\s]_(?!_)(?:(?=[punctuation*\s])|$)/
    },
    code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    br: /^( {2,}|\\)\n(?!\s*$)/,
    del: R,
    text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n)))/,
    punctuation: /^([\s*punctuation])/,
    _punctuation: "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~"
  };
  R.punctuation = T(R.punctuation).replace(/punctuation/g, R._punctuation).getRegex(), R._blockSkip = "\\[[^\\]]*?\\]\\([^\\)]*?\\)|`[^`]*?`|<[^>]*?>", R._overlapSkip = "__[^_]*?__|\\*\\*\\[^\\*\\]*?\\*\\*", R._comment = T(z._comment).replace("(?:--\x3e|$)", "--\x3e").getRegex(), R.em.start = T(R.em.start).replace(/punctuation/g, R._punctuation).getRegex(), R.em.middle = T(R.em.middle).replace(/punctuation/g, R._punctuation).replace(/overlapSkip/g, R._overlapSkip).getRegex(), R.em.endAst = T(R.em.endAst, "g").replace(/punctuation/g, R._punctuation).getRegex(), R.em.endUnd = T(R.em.endUnd, "g").replace(/punctuation/g, R._punctuation).getRegex(), R.strong.start = T(R.strong.start).replace(/punctuation/g, R._punctuation).getRegex(), R.strong.middle = T(R.strong.middle).replace(/punctuation/g, R._punctuation).replace(/overlapSkip/g, R._overlapSkip).getRegex(), R.strong.endAst = T(R.strong.endAst, "g").replace(/punctuation/g, R._punctuation).getRegex(), R.strong.endUnd = T(R.strong.endUnd, "g").replace(/punctuation/g, R._punctuation).getRegex(), R.blockSkip = T(R._blockSkip, "g").getRegex(), R.overlapSkip = T(R._overlapSkip, "g").getRegex(), R._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g, R._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/, R._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/, R.autolink = T(R.autolink).replace("scheme", R._scheme).replace("email", R._email).getRegex(), R._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/, R.tag = T(R.tag).replace("comment", R._comment).replace("attribute", R._attribute).getRegex(), R._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, R._href = /<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/, R._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/, R.link = T(R.link).replace("label", R._label).replace("href", R._href).replace("title", R._title).getRegex(), R.reflink = T(R.reflink).replace("label", R._label).getRegex(), R.reflinkSearch = T(R.reflinkSearch, "g").replace("reflink", R.reflink).replace("nolink", R.nolink).getRegex(), R.normal = $({}, R), R.pedantic = $({}, R.normal, {
    strong: {
      start: /^__|\*\*/,
      middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
      endAst: /\*\*(?!\*)/g,
      endUnd: /__(?!_)/g
    },
    em: {
      start: /^_|\*/,
      middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
      endAst: /\*(?!\*)/g,
      endUnd: /_(?!_)/g
    },
    link: T(/^!?\[(label)\]\((.*?)\)/).replace("label", R._label).getRegex(),
    reflink: T(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", R._label).getRegex()
  }), R.gfm = $({}, R.normal, {
    escape: T(R.escape).replace("])", "~|])").getRegex(),
    _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
    url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
    _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
  }), R.gfm.url = T(R.gfm.url, "i").replace("email", R.gfm._extended_email).getRegex(), R.breaks = $({}, R.gfm, {
    br: T(R.br).replace("{2,}", "*").getRegex(),
    text: T(R.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
  });
  var R = {
      block: z,
      inline: R
    },
    P = t.defaults,
    L = R.block,
    N = R.inline,
    B = Z;
  function F(e) {
    return e.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…");
  }
  function M(e) {
    for (var t, n = "", r = e.length, i = 0; i < r; i++) {
      t = e.charCodeAt(i), .5 < Math.random() && (t = "x" + t.toString(16)), n += "&#" + t + ";";
    }
    return n;
  }
  var W = function () {
      function n(e) {
        this.tokens = [], this.tokens.links = Object.create(null), this.options = e || P, this.options.tokenizer = this.options.tokenizer || new D(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options;
        e = {
          block: L.normal,
          inline: N.normal
        };
        this.options.pedantic ? (e.block = L.pedantic, e.inline = N.pedantic) : this.options.gfm && (e.block = L.gfm, this.options.breaks ? e.inline = N.breaks : e.inline = N.gfm), this.tokenizer.rules = e;
      }
      n.lex = function (e, t) {
        return new n(t).lex(e);
      }, n.lexInline = function (e, t) {
        return new n(t).inlineTokens(e);
      };
      var e,
        t,
        r = n.prototype;
      return r.lex = function (e) {
        return e = e.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    "), this.blockTokens(e, this.tokens, !0), this.inline(this.tokens), this.tokens;
      }, r.blockTokens = function (e, t, n) {
        var r, i, s, l;
        for (void 0 === t && (t = []), void 0 === n && (n = !0), e = e.replace(/^ +$/gm, ""); e;) {
          if (r = this.tokenizer.space(e)) e = e.substring(r.raw.length), r.type && t.push(r);else if (r = this.tokenizer.code(e, t)) e = e.substring(r.raw.length), r.type ? t.push(r) : ((l = t[t.length - 1]).raw += "\n" + r.raw, l.text += "\n" + r.text);else if (r = this.tokenizer.fences(e)) e = e.substring(r.raw.length), t.push(r);else if (r = this.tokenizer.heading(e)) e = e.substring(r.raw.length), t.push(r);else if (r = this.tokenizer.nptable(e)) e = e.substring(r.raw.length), t.push(r);else if (r = this.tokenizer.hr(e)) e = e.substring(r.raw.length), t.push(r);else if (r = this.tokenizer.blockquote(e)) e = e.substring(r.raw.length), r.tokens = this.blockTokens(r.text, [], n), t.push(r);else if (r = this.tokenizer.list(e)) {
            for (e = e.substring(r.raw.length), s = r.items.length, i = 0; i < s; i++) {
              r.items[i].tokens = this.blockTokens(r.items[i].text, [], !1);
            }
            t.push(r);
          } else if (r = this.tokenizer.html(e)) e = e.substring(r.raw.length), t.push(r);else if (n && (r = this.tokenizer.def(e))) e = e.substring(r.raw.length), this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
            href: r.href,
            title: r.title
          });else if (r = this.tokenizer.table(e)) e = e.substring(r.raw.length), t.push(r);else if (r = this.tokenizer.lheading(e)) e = e.substring(r.raw.length), t.push(r);else if (n && (r = this.tokenizer.paragraph(e))) e = e.substring(r.raw.length), t.push(r);else if (r = this.tokenizer.text(e, t)) e = e.substring(r.raw.length), r.type ? t.push(r) : ((l = t[t.length - 1]).raw += "\n" + r.raw, l.text += "\n" + r.text);else if (e) {
            var a = "Infinite loop on byte: " + e.charCodeAt(0);
            if (this.options.silent) {
              console.error(a);
              break;
            }
            throw new Error(a);
          }
        }
        return t;
      }, r.inline = function (e) {
        for (var t, n, r, i, s, l = e.length, a = 0; a < l; a++) {
          switch ((s = e[a]).type) {
            case "paragraph":
            case "text":
            case "heading":
              s.tokens = [], this.inlineTokens(s.text, s.tokens);
              break;
            case "table":
              for (s.tokens = {
                header: [],
                cells: []
              }, r = s.header.length, t = 0; t < r; t++) {
                s.tokens.header[t] = [], this.inlineTokens(s.header[t], s.tokens.header[t]);
              }
              for (r = s.cells.length, t = 0; t < r; t++) {
                for (i = s.cells[t], s.tokens.cells[t] = [], n = 0; n < i.length; n++) {
                  s.tokens.cells[t][n] = [], this.inlineTokens(i[n], s.tokens.cells[t][n]);
                }
              }
              break;
            case "blockquote":
              this.inline(s.tokens);
              break;
            case "list":
              for (r = s.items.length, t = 0; t < r; t++) {
                this.inline(s.items[t].tokens);
              }
          }
        }
        return e;
      }, r.inlineTokens = function (e, t, n, r) {
        var i;
        void 0 === t && (t = []), void 0 === n && (n = !1), void 0 === r && (r = !1);
        var s,
          l,
          a,
          o = e;
        if (this.tokens.links) {
          var c = Object.keys(this.tokens.links);
          if (0 < c.length) for (; null != (s = this.tokenizer.rules.inline.reflinkSearch.exec(o));) {
            c.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (o = o.slice(0, s.index) + "[" + B("a", s[0].length - 2) + "]" + o.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
          }
        }
        for (; null != (s = this.tokenizer.rules.inline.blockSkip.exec(o));) {
          o = o.slice(0, s.index) + "[" + B("a", s[0].length - 2) + "]" + o.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }
        for (; e;) {
          if (l || (a = ""), l = !1, i = this.tokenizer.escape(e)) e = e.substring(i.raw.length), t.push(i);else if (i = this.tokenizer.tag(e, n, r)) e = e.substring(i.raw.length), n = i.inLink, r = i.inRawBlock, t.push(i);else if (i = this.tokenizer.link(e)) e = e.substring(i.raw.length), "link" === i.type && (i.tokens = this.inlineTokens(i.text, [], !0, r)), t.push(i);else if (i = this.tokenizer.reflink(e, this.tokens.links)) e = e.substring(i.raw.length), "link" === i.type && (i.tokens = this.inlineTokens(i.text, [], !0, r)), t.push(i);else if (i = this.tokenizer.strong(e, o, a)) e = e.substring(i.raw.length), i.tokens = this.inlineTokens(i.text, [], n, r), t.push(i);else if (i = this.tokenizer.em(e, o, a)) e = e.substring(i.raw.length), i.tokens = this.inlineTokens(i.text, [], n, r), t.push(i);else if (i = this.tokenizer.codespan(e)) e = e.substring(i.raw.length), t.push(i);else if (i = this.tokenizer.br(e)) e = e.substring(i.raw.length), t.push(i);else if (i = this.tokenizer.del(e)) e = e.substring(i.raw.length), i.tokens = this.inlineTokens(i.text, [], n, r), t.push(i);else if (i = this.tokenizer.autolink(e, M)) e = e.substring(i.raw.length), t.push(i);else if (n || !(i = this.tokenizer.url(e, M))) {
            if (i = this.tokenizer.inlineText(e, r, F)) e = e.substring(i.raw.length), a = i.raw.slice(-1), l = !0, t.push(i);else if (e) {
              var u = "Infinite loop on byte: " + e.charCodeAt(0);
              if (this.options.silent) {
                console.error(u);
                break;
              }
              throw new Error(u);
            }
          } else e = e.substring(i.raw.length), t.push(i);
        }
        return t;
      }, e = n, t = [{
        key: "rules",
        get: function get() {
          return {
            block: L,
            inline: N
          };
        }
      }], (r = null) && i(e.prototype, r), t && i(e, t), n;
    }(),
    X = t.defaults,
    G = S,
    V = _,
    H = function () {
      function e(e) {
        this.options = e || X;
      }
      var t = e.prototype;
      return t.code = function (e, t, n) {
        var r = (t || "").match(/\S*/)[0];
        return !this.options.highlight || null != (t = this.options.highlight(e, r)) && t !== e && (n = !0, e = t), r ? '<pre><code class="' + this.options.langPrefix + V(r, !0) + '">' + (n ? e : V(e, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? e : V(e, !0)) + "</code></pre>\n";
      }, t.blockquote = function (e) {
        return "<blockquote>\n" + e + "</blockquote>\n";
      }, t.html = function (e) {
        return e;
      }, t.heading = function (e, t, n, r) {
        return this.options.headerIds ? "<h" + t + ' id="' + this.options.headerPrefix + r.slug(n) + '">' + e + "</h" + t + ">\n" : "<h" + t + ">" + e + "</h" + t + ">\n";
      }, t.hr = function () {
        return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
      }, t.list = function (e, t, n) {
        var r = t ? "ol" : "ul";
        return "<" + r + (t && 1 !== n ? ' start="' + n + '"' : "") + ">\n" + e + "</" + r + ">\n";
      }, t.listitem = function (e) {
        return "<li>" + e + "</li>\n";
      }, t.checkbox = function (e) {
        return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
      }, t.paragraph = function (e) {
        return "<p>" + e + "</p>\n";
      }, t.table = function (e, t) {
        return "<table>\n<thead>\n" + e + "</thead>\n" + (t = t && "<tbody>" + t + "</tbody>") + "</table>\n";
      }, t.tablerow = function (e) {
        return "<tr>\n" + e + "</tr>\n";
      }, t.tablecell = function (e, t) {
        var n = t.header ? "th" : "td";
        return (t.align ? "<" + n + ' align="' + t.align + '">' : "<" + n + ">") + e + "</" + n + ">\n";
      }, t.strong = function (e) {
        return "<strong>" + e + "</strong>";
      }, t.em = function (e) {
        return "<em>" + e + "</em>";
      }, t.codespan = function (e) {
        return "<code>" + e + "</code>";
      }, t.br = function () {
        return this.options.xhtml ? "<br/>" : "<br>";
      }, t.del = function (e) {
        return "<del>" + e + "</del>";
      }, t.link = function (e, t, n) {
        if (null === (e = G(this.options.sanitize, this.options.baseUrl, e))) return n;
        e = '<a href="' + V(e) + '"';
        return t && (e += ' title="' + t + '"'), e += ">" + n + "</a>";
      }, t.image = function (e, t, n) {
        if (null === (e = G(this.options.sanitize, this.options.baseUrl, e))) return n;
        n = '<img src="' + e + '" alt="' + n + '"';
        return t && (n += ' title="' + t + '"'), n += this.options.xhtml ? "/>" : ">";
      }, t.text = function (e) {
        return e;
      }, e;
    }(),
    J = function () {
      function e() {}
      var t = e.prototype;
      return t.strong = function (e) {
        return e;
      }, t.em = function (e) {
        return e;
      }, t.codespan = function (e) {
        return e;
      }, t.del = function (e) {
        return e;
      }, t.html = function (e) {
        return e;
      }, t.text = function (e) {
        return e;
      }, t.link = function (e, t, n) {
        return "" + n;
      }, t.image = function (e, t, n) {
        return "" + n;
      }, t.br = function () {
        return "";
      }, e;
    }(),
    K = function () {
      function e() {
        this.seen = {};
      }
      var t = e.prototype;
      return t.serialize = function (e) {
        return e.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
      }, t.getNextSafeSlug = function (e, t) {
        var n = e,
          r = 0;
        if (this.seen.hasOwnProperty(n)) for (r = this.seen[e]; n = e + "-" + ++r, this.seen.hasOwnProperty(n);) {
          ;
        }
        return t || (this.seen[e] = r, this.seen[n] = 0), n;
      }, t.slug = function (e, t) {
        void 0 === t && (t = {});
        var n = this.serialize(e);
        return this.getNextSafeSlug(n, t.dryrun);
      }, e;
    }(),
    Q = t.defaults,
    Y = y,
    ee = function () {
      function n(e) {
        this.options = e || Q, this.options.renderer = this.options.renderer || new H(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new J(), this.slugger = new K();
      }
      n.parse = function (e, t) {
        return new n(t).parse(e);
      }, n.parseInline = function (e, t) {
        return new n(t).parseInline(e);
      };
      var e = n.prototype;
      return e.parse = function (e, t) {
        void 0 === t && (t = !0);
        for (var n, r, i, s, l, a, o, c, u, p, h, g, f, d, k, b = "", m = e.length, x = 0; x < m; x++) {
          switch ((c = e[x]).type) {
            case "space":
              continue;
            case "hr":
              b += this.renderer.hr();
              continue;
            case "heading":
              b += this.renderer.heading(this.parseInline(c.tokens), c.depth, Y(this.parseInline(c.tokens, this.textRenderer)), this.slugger);
              continue;
            case "code":
              b += this.renderer.code(c.text, c.lang, c.escaped);
              continue;
            case "table":
              for (a = u = "", i = c.header.length, n = 0; n < i; n++) {
                a += this.renderer.tablecell(this.parseInline(c.tokens.header[n]), {
                  header: !0,
                  align: c.align[n]
                });
              }
              for (u += this.renderer.tablerow(a), o = "", i = c.cells.length, n = 0; n < i; n++) {
                for (a = "", s = (l = c.tokens.cells[n]).length, r = 0; r < s; r++) {
                  a += this.renderer.tablecell(this.parseInline(l[r]), {
                    header: !1,
                    align: c.align[r]
                  });
                }
                o += this.renderer.tablerow(a);
              }
              b += this.renderer.table(u, o);
              continue;
            case "blockquote":
              o = this.parse(c.tokens), b += this.renderer.blockquote(o);
              continue;
            case "list":
              for (u = c.ordered, w = c.start, p = c.loose, i = c.items.length, o = "", n = 0; n < i; n++) {
                f = (g = c.items[n]).checked, d = g.task, h = "", g.task && (k = this.renderer.checkbox(f), p ? 0 < g.tokens.length && "text" === g.tokens[0].type ? (g.tokens[0].text = k + " " + g.tokens[0].text, g.tokens[0].tokens && 0 < g.tokens[0].tokens.length && "text" === g.tokens[0].tokens[0].type && (g.tokens[0].tokens[0].text = k + " " + g.tokens[0].tokens[0].text)) : g.tokens.unshift({
                  type: "text",
                  text: k
                }) : h += k), h += this.parse(g.tokens, p), o += this.renderer.listitem(h, d, f);
              }
              b += this.renderer.list(o, u, w);
              continue;
            case "html":
              b += this.renderer.html(c.text);
              continue;
            case "paragraph":
              b += this.renderer.paragraph(this.parseInline(c.tokens));
              continue;
            case "text":
              for (o = c.tokens ? this.parseInline(c.tokens) : c.text; x + 1 < m && "text" === e[x + 1].type;) {
                o += "\n" + ((c = e[++x]).tokens ? this.parseInline(c.tokens) : c.text);
              }
              b += t ? this.renderer.paragraph(o) : o;
              continue;
            default:
              var w = 'Token with "' + c.type + '" type was not found.';
              if (this.options.silent) return void console.error(w);
              throw new Error(w);
          }
        }
        return b;
      }, e.parseInline = function (e, t) {
        t = t || this.renderer;
        for (var n, r = "", i = e.length, s = 0; s < i; s++) {
          switch ((n = e[s]).type) {
            case "escape":
              r += t.text(n.text);
              break;
            case "html":
              r += t.html(n.text);
              break;
            case "link":
              r += t.link(n.href, n.title, this.parseInline(n.tokens, t));
              break;
            case "image":
              r += t.image(n.href, n.title, n.text);
              break;
            case "strong":
              r += t.strong(this.parseInline(n.tokens, t));
              break;
            case "em":
              r += t.em(this.parseInline(n.tokens, t));
              break;
            case "codespan":
              r += t.codespan(n.text);
              break;
            case "br":
              r += t.br();
              break;
            case "del":
              r += t.del(this.parseInline(n.tokens, t));
              break;
            case "text":
              r += t.text(n.text);
              break;
            default:
              var l = 'Token with "' + n.type + '" type was not found.';
              if (this.options.silent) return void console.error(l);
              throw new Error(l);
          }
        }
        return r;
      }, n;
    }(),
    te = A,
    ne = I,
    re = _,
    _ = t.getDefaults,
    ie = t.changeDefaults,
    t = t.defaults;
  function se(e, n, r) {
    if (null == e) throw new Error("marked(): input parameter is undefined or null");
    if ("string" != typeof e) throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected");
    if ("function" == typeof n && (r = n, n = null), n = te({}, se.defaults, n || {}), ne(n), r) {
      var i,
        s = n.highlight;
      try {
        i = W.lex(e, n);
      } catch (e) {
        return r(e);
      }
      var l = function l(t) {
        var e;
        if (!t) try {
          e = ee.parse(i, n);
        } catch (e) {
          t = e;
        }
        return n.highlight = s, t ? r(t) : r(null, e);
      };
      if (!s || s.length < 3) return l();
      if (delete n.highlight, !i.length) return l();
      var a = 0;
      return se.walkTokens(i, function (n) {
        "code" === n.type && (a++, setTimeout(function () {
          s(n.text, n.lang, function (e, t) {
            return e ? l(e) : (null != t && t !== n.text && (n.text = t, n.escaped = !0), void (0 === --a && l()));
          });
        }, 0));
      }), void (0 === a && l());
    }
    try {
      var t = W.lex(e, n);
      return n.walkTokens && se.walkTokens(t, n.walkTokens), ee.parse(t, n);
    } catch (e) {
      if (e.message += "\nPlease report this to https://github.com/markedjs/marked.", n.silent) return "<p>An error occurred:</p><pre>" + re(e.message + "", !0) + "</pre>";
      throw e;
    }
  }
  return se.options = se.setOptions = function (e) {
    return te(se.defaults, e), ie(se.defaults), se;
  }, se.getDefaults = _, se.defaults = t, se.use = function (a) {
    var t,
      n = te({}, a);
    a.renderer && function () {
      var e,
        l = se.defaults.renderer || new H();
      for (e in a.renderer) {
        !function (i) {
          var s = l[i];
          l[i] = function () {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) {
              t[n] = arguments[n];
            }
            var r = a.renderer[i].apply(l, t);
            return !1 === r && (r = s.apply(l, t)), r;
          };
        }(e);
      }
      n.renderer = l;
    }(), a.tokenizer && function () {
      var e,
        l = se.defaults.tokenizer || new D();
      for (e in a.tokenizer) {
        !function (i) {
          var s = l[i];
          l[i] = function () {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) {
              t[n] = arguments[n];
            }
            var r = a.tokenizer[i].apply(l, t);
            return !1 === r && (r = s.apply(l, t)), r;
          };
        }(e);
      }
      n.tokenizer = l;
    }(), a.walkTokens && (t = se.defaults.walkTokens, n.walkTokens = function (e) {
      a.walkTokens(e), t && t(e);
    }), se.setOptions(n);
  }, se.walkTokens = function (e, t) {
    for (var n, r = p(e); !(n = r()).done;) {
      var i = n.value;
      switch (t(i), i.type) {
        case "table":
          for (var s = p(i.tokens.header); !(l = s()).done;) {
            var l = l.value;
            se.walkTokens(l, t);
          }
          for (var a, o = p(i.tokens.cells); !(a = o()).done;) {
            for (var c = p(a.value); !(u = c()).done;) {
              var u = u.value;
              se.walkTokens(u, t);
            }
          }
          break;
        case "list":
          se.walkTokens(i.items, t);
          break;
        default:
          i.tokens && se.walkTokens(i.tokens, t);
      }
    }
  }, se.parseInline = function (e, t) {
    if (null == e) throw new Error("marked.parseInline(): input parameter is undefined or null");
    if ("string" != typeof e) throw new Error("marked.parseInline(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected");
    t = te({}, se.defaults, t || {}), ne(t);
    try {
      var n = W.lexInline(e, t);
      return t.walkTokens && se.walkTokens(n, t.walkTokens), ee.parseInline(n, t);
    } catch (e) {
      if (e.message += "\nPlease report this to https://github.com/markedjs/marked.", t.silent) return "<p>An error occurred:</p><pre>" + re(e.message + "", !0) + "</pre>";
      throw e;
    }
  }, se.Parser = ee, se.parser = ee.parse, se.Renderer = H, se.TextRenderer = J, se.Lexer = W, se.lexer = W.lex, se.Tokenizer = D, se.Slugger = K, se.parse = se;
}
;
var _default = t();
exports.default = _default;

/***/ }),
/* 200 */
/*!*************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/audio/index.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _context = _interopRequireDefault(__webpack_require__(/*! ./context */ 201));
/**
 * @fileoverview audio 插件
 */

var index = 0;
function Audio(vm) {
  this.vm = vm;
}
Audio.prototype.onUpdate = function () {
  this.audios = [];
};
Audio.prototype.onParse = function (node) {
  if (node.name === 'audio') {
    if (!node.attrs.id) {
      node.attrs.id = 'a' + index++;
    }
    this.audios.push(node.attrs.id);
  }
};
Audio.prototype.onLoad = function () {
  var _this = this;
  setTimeout(function () {
    for (var i = 0; i < _this.audios.length; i++) {
      var ctx = _context.default.get(_this.audios[i]);
      ctx.id = _this.audios[i];
      _this.vm._videos.push(ctx);
    }
  }, 500);
};
var _default = Audio;
exports.default = _default;

/***/ }),
/* 201 */
/*!***************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/audio/context.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var ctx = {};
var _default = {
  get: function get(id) {
    return ctx[id];
  },
  set: function set(id, vm) {
    ctx[id] = vm;
  },
  remove: function remove(id) {
    ctx[id] = undefined;
  }
};
exports.default = _default;

/***/ }),
/* 202 */
/*!*************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/emoji/index.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * @fileoverview emoji 插件
 */
var reg = /\[(\S+?)\]/g;
var data = {
  笑脸: '😄',
  生病: '😷',
  破涕为笑: '😂',
  吐舌: '😝',
  脸红: '😳',
  恐惧: '😱',
  失望: '😔',
  无语: '😒',
  眨眼: '😉',
  酷: '😎',
  哭: '😭',
  痴迷: '😍',
  吻: '😘',
  思考: '🤔',
  困惑: '😕',
  颠倒: '🙃',
  钱: '🤑',
  惊讶: '😲',
  白眼: '🙄',
  叹气: '😤',
  睡觉: '😴',
  书呆子: '🤓',
  愤怒: '😡',
  面无表情: '😑',
  张嘴: '😮',
  量体温: '🤒',
  呕吐: '🤮',
  光环: '😇',
  幽灵: '👻',
  外星人: '👽',
  机器人: '🤖',
  捂眼镜: '🙈',
  捂耳朵: '🙉',
  捂嘴: '🙊',
  婴儿: '👶',
  男孩: '👦',
  女孩: '👧',
  男人: '👨',
  女人: '👩',
  老人: '👴',
  老妇人: '👵',
  警察: '👮',
  王子: '🤴',
  公主: '🤴',
  举手: '🙋',
  跑步: '🏃',
  家庭: '👪',
  眼睛: '👀',
  鼻子: '👃',
  耳朵: '👂',
  舌头: '👅',
  嘴: '👄',
  心: '❤️',
  心碎: '💔',
  雪人: '☃️',
  情书: '💌',
  大便: '💩',
  闹钟: '⏰',
  眼镜: '👓',
  雨伞: '☂️',
  音乐: '🎵',
  话筒: '🎤',
  游戏机: '🎮',
  喇叭: '📢',
  耳机: '🎧',
  礼物: '🎁',
  电话: '📞',
  电脑: '💻',
  打印机: '🖨️',
  手电筒: '🔦',
  灯泡: '💡',
  书本: '📖',
  信封: '✉️',
  药丸: '💊',
  口红: '💄',
  手机: '📱',
  相机: '📷',
  电视: '📺',
  中: '🀄',
  垃圾桶: '🚮',
  厕所: '🚾',
  感叹号: '❗',
  禁: '🈲',
  可: '🉑',
  彩虹: '🌈',
  旋风: '🌀',
  雷电: '⚡',
  雪花: '❄️',
  星星: '⭐',
  水滴: '💧',
  玫瑰: '🌹',
  加油: '💪',
  左: '👈',
  右: '👉',
  上: '👆',
  下: '👇',
  手掌: '🖐️',
  好的: '👌',
  好: '👍',
  差: '👎',
  胜利: '✌',
  拳头: '👊',
  挥手: '👋',
  鼓掌: '👏',
  猴子: '🐒',
  狗: '🐶',
  狼: '🐺',
  猫: '🐱',
  老虎: '🐯',
  马: '🐎',
  独角兽: '🦄',
  斑马: '🦓',
  鹿: '🦌',
  牛: '🐮',
  猪: '🐷',
  羊: '🐏',
  长颈鹿: '🦒',
  大象: '🐘',
  老鼠: '🐭',
  蝙蝠: '🦇',
  刺猬: '🦔',
  熊猫: '🐼',
  鸽子: '🕊️',
  鸭子: '🦆',
  兔子: '🐇',
  老鹰: '🦅',
  青蛙: '🐸',
  蛇: '🐍',
  龙: '🐉',
  鲸鱼: '🐳',
  海豚: '🐬',
  足球: '⚽',
  棒球: '⚾',
  篮球: '🏀',
  排球: '🏐',
  橄榄球: '🏉',
  网球: '🎾',
  骰子: '🎲',
  鸡腿: '🍗',
  蛋糕: '🎂',
  啤酒: '🍺',
  饺子: '🥟',
  汉堡: '🍔',
  薯条: '🍟',
  意大利面: '🍝',
  干杯: '🥂',
  筷子: '🥢',
  糖果: '🍬',
  奶瓶: '🍼',
  爆米花: '🍿',
  邮局: '🏤',
  医院: '🏥',
  银行: '🏦',
  酒店: '🏨',
  学校: '🏫',
  城堡: '🏰',
  火车: '🚂',
  高铁: '🚄',
  地铁: '🚇',
  公交: '🚌',
  救护车: '🚑',
  消防车: '🚒',
  警车: '🚓',
  出租车: '🚕',
  汽车: '🚗',
  货车: '🚛',
  自行车: '🚲',
  摩托: '🛵',
  红绿灯: '🚥',
  帆船: '⛵',
  游轮: '🛳️',
  轮船: '⛴️',
  飞机: '✈️',
  直升机: '🚁',
  缆车: '🚠',
  警告: '⚠️',
  禁止: '⛔'
};
function Emoji() {}
Emoji.prototype.onUpdate = function (content) {
  return content.replace(reg, function ($, $1) {
    if (data[$1]) return data[$1];
    return $;
  });
};
Emoji.prototype.onGetContent = function (content) {
  for (var item in data) {
    content = content.replace(new RegExp(data[item], 'g'), '[' + item + ']');
  }
  return content;
};
var _default = Emoji;
exports.default = _default;

/***/ }),
/* 203 */
/*!*****************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/highlight/index.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prism = _interopRequireDefault(__webpack_require__(/*! ./prism.min */ 204));
var _config = _interopRequireDefault(__webpack_require__(/*! ./config */ 205));
var _parser = _interopRequireDefault(__webpack_require__(/*! ../parser */ 197));
/**
 * @fileoverview highlight 插件
 * Include prismjs (https://prismjs.com)
 */

function Highlight(vm) {
  this.vm = vm;
}
Highlight.prototype.onParse = function (node, vm) {
  if (node.name === 'pre') {
    if (vm.options.editable) {
      node.attrs.class = (node.attrs.class || '') + ' hl-pre';
      return;
    }
    var i;
    for (i = node.children.length; i--;) {
      if (node.children[i].name === 'code') break;
    }
    if (i === -1) return;
    var code = node.children[i];
    var className = code.attrs.class + ' ' + node.attrs.class;
    i = className.indexOf('language-');
    if (i === -1) {
      i = className.indexOf('lang-');
      if (i === -1) {
        className = 'language-text';
        i = 9;
      } else {
        i += 5;
      }
    } else {
      i += 9;
    }
    var j;
    for (j = i; j < className.length; j++) {
      if (className[j] === ' ') break;
    }
    var lang = className.substring(i, j);
    if (code.children.length) {
      var text = this.vm.getText(code.children).replace(/&amp;/g, '&');
      if (!text) return;
      if (node.c) {
        node.c = undefined;
      }
      if (_prism.default.languages[lang]) {
        code.children = new _parser.default(this.vm).parse(
        // 加一层 pre 保留空白符
        '<pre>' + _prism.default.highlight(text, _prism.default.languages[lang], lang).replace(/token /g, 'hl-') + '</pre>')[0].children;
      }
      node.attrs.class = 'hl-pre';
      code.attrs.class = 'hl-code';
      if (_config.default.showLanguageName) {
        node.children.push({
          name: 'div',
          attrs: {
            class: 'hl-language',
            style: 'user-select:none'
          },
          children: [{
            type: 'text',
            text: lang
          }]
        });
      }
      if (_config.default.copyByLongPress) {
        node.attrs.style += (node.attrs.style || '') + ';user-select:none';
        node.attrs['data-content'] = text;
        vm.expose();
      }
      if (_config.default.showLineNumber) {
        var line = text.split('\n').length;
        var children = [];
        for (var k = line; k--;) {
          children.push({
            name: 'span',
            attrs: {
              class: 'span'
            }
          });
        }
        node.children.push({
          name: 'span',
          attrs: {
            class: 'line-numbers-rows'
          },
          children: children
        });
      }
    }
  }
};
var _default = Highlight;
exports.default = _default;

/***/ }),
/* 204 */
/*!*********************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/highlight/prism.min.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/* PrismJS 1.29.0
https://prismjs.com/download.html#themes=prism-dark&languages=markup+css+clike+javascript+c+csharp+cpp+docker+git+go+java+markup-templating+php+plsql+powershell+python+sql */
var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
  Prism = function (e) {
    var n = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
      t = 0,
      r = {},
      a = {
        manual: e.Prism && e.Prism.manual,
        disableWorkerMessageHandler: e.Prism && e.Prism.disableWorkerMessageHandler,
        util: {
          encode: function e(n) {
            return n instanceof i ? new i(n.type, e(n.content), n.alias) : Array.isArray(n) ? n.map(e) : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
          },
          type: function type(e) {
            return Object.prototype.toString.call(e).slice(8, -1);
          },
          objId: function objId(e) {
            return e.__id || Object.defineProperty(e, "__id", {
              value: ++t
            }), e.__id;
          },
          clone: function e(n, t) {
            var r, i;
            switch (t = t || {}, a.util.type(n)) {
              case "Object":
                if (i = a.util.objId(n), t[i]) return t[i];
                for (var l in r = {}, t[i] = r, n) {
                  n.hasOwnProperty(l) && (r[l] = e(n[l], t));
                }
                return r;
              case "Array":
                return i = a.util.objId(n), t[i] ? t[i] : (r = [], t[i] = r, n.forEach(function (n, a) {
                  r[a] = e(n, t);
                }), r);
              default:
                return n;
            }
          },
          getLanguage: function getLanguage(e) {
            for (; e;) {
              var t = n.exec(e.className);
              if (t) return t[1].toLowerCase();
              e = e.parentElement;
            }
            return "none";
          },
          setLanguage: function setLanguage(e, t) {
            e.className = e.className.replace(RegExp(n, "gi"), ""), e.classList.add("language-" + t);
          },
          currentScript: function currentScript() {
            if ("undefined" == typeof document) return null;
            if ("currentScript" in document) return document.currentScript;
            try {
              throw new Error();
            } catch (r) {
              var e = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack) || [])[1];
              if (e) {
                var n = document.getElementsByTagName("script");
                for (var t in n) {
                  if (n[t].src == e) return n[t];
                }
              }
              return null;
            }
          },
          isActive: function isActive(e, n, t) {
            for (var r = "no-" + n; e;) {
              var a = e.classList;
              if (a.contains(n)) return !0;
              if (a.contains(r)) return !1;
              e = e.parentElement;
            }
            return !!t;
          }
        },
        languages: {
          plain: r,
          plaintext: r,
          text: r,
          txt: r,
          extend: function extend(e, n) {
            var t = a.util.clone(a.languages[e]);
            for (var r in n) {
              t[r] = n[r];
            }
            return t;
          },
          insertBefore: function insertBefore(e, n, t, r) {
            var i = (r = r || a.languages)[e],
              l = {};
            for (var o in i) {
              if (i.hasOwnProperty(o)) {
                if (o == n) for (var s in t) {
                  t.hasOwnProperty(s) && (l[s] = t[s]);
                }
                t.hasOwnProperty(o) || (l[o] = i[o]);
              }
            }
            var u = r[e];
            return r[e] = l, a.languages.DFS(a.languages, function (n, t) {
              t === u && n != e && (this[n] = l);
            }), l;
          },
          DFS: function e(n, t, r, i) {
            i = i || {};
            var l = a.util.objId;
            for (var o in n) {
              if (n.hasOwnProperty(o)) {
                t.call(n, o, n[o], r || o);
                var s = n[o],
                  u = a.util.type(s);
                "Object" !== u || i[l(s)] ? "Array" !== u || i[l(s)] || (i[l(s)] = !0, e(s, t, o, i)) : (i[l(s)] = !0, e(s, t, null, i));
              }
            }
          }
        },
        plugins: {},
        highlightAll: function highlightAll(e, n) {
          a.highlightAllUnder(document, e, n);
        },
        highlightAllUnder: function highlightAllUnder(e, n, t) {
          var r = {
            callback: t,
            container: e,
            selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
          };
          a.hooks.run("before-highlightall", r), r.elements = Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)), a.hooks.run("before-all-elements-highlight", r);
          for (var i, l = 0; i = r.elements[l++];) {
            a.highlightElement(i, !0 === n, r.callback);
          }
        },
        highlightElement: function highlightElement(n, t, r) {
          var i = a.util.getLanguage(n),
            l = a.languages[i];
          a.util.setLanguage(n, i);
          var o = n.parentElement;
          o && "pre" === o.nodeName.toLowerCase() && a.util.setLanguage(o, i);
          var s = {
            element: n,
            language: i,
            grammar: l,
            code: n.textContent
          };
          function u(e) {
            s.highlightedCode = e, a.hooks.run("before-insert", s), s.element.innerHTML = s.highlightedCode, a.hooks.run("after-highlight", s), a.hooks.run("complete", s), r && r.call(s.element);
          }
          if (a.hooks.run("before-sanity-check", s), (o = s.element.parentElement) && "pre" === o.nodeName.toLowerCase() && !o.hasAttribute("tabindex") && o.setAttribute("tabindex", "0"), !s.code) return a.hooks.run("complete", s), void (r && r.call(s.element));
          if (a.hooks.run("before-highlight", s), s.grammar) {
            if (t && e.Worker) {
              var c = new Worker(a.filename);
              c.onmessage = function (e) {
                u(e.data);
              }, c.postMessage(JSON.stringify({
                language: s.language,
                code: s.code,
                immediateClose: !0
              }));
            } else u(a.highlight(s.code, s.grammar, s.language));
          } else u(a.util.encode(s.code));
        },
        highlight: function highlight(e, n, t) {
          var r = {
            code: e,
            grammar: n,
            language: t
          };
          if (a.hooks.run("before-tokenize", r), !r.grammar) throw new Error('The language "' + r.language + '" has no grammar.');
          return r.tokens = a.tokenize(r.code, r.grammar), a.hooks.run("after-tokenize", r), i.stringify(a.util.encode(r.tokens), r.language);
        },
        tokenize: function tokenize(e, n) {
          var t = n.rest;
          if (t) {
            for (var r in t) {
              n[r] = t[r];
            }
            delete n.rest;
          }
          var a = new s();
          return u(a, a.head, e), o(e, a, n, a.head, 0), function (e) {
            for (var n = [], t = e.head.next; t !== e.tail;) {
              n.push(t.value), t = t.next;
            }
            return n;
          }(a);
        },
        hooks: {
          all: {},
          add: function add(e, n) {
            var t = a.hooks.all;
            t[e] = t[e] || [], t[e].push(n);
          },
          run: function run(e, n) {
            var t = a.hooks.all[e];
            if (t && t.length) for (var r, i = 0; r = t[i++];) {
              r(n);
            }
          }
        },
        Token: i
      };
    function i(e, n, t, r) {
      this.type = e, this.content = n, this.alias = t, this.length = 0 | (r || "").length;
    }
    function l(e, n, t, r) {
      e.lastIndex = n;
      var a = e.exec(t);
      if (a && r && a[1]) {
        var i = a[1].length;
        a.index += i, a[0] = a[0].slice(i);
      }
      return a;
    }
    function o(e, n, t, r, s, g) {
      for (var f in t) {
        if (t.hasOwnProperty(f) && t[f]) {
          var h = t[f];
          h = Array.isArray(h) ? h : [h];
          for (var d = 0; d < h.length; ++d) {
            if (g && g.cause == f + "," + d) return;
            var v = h[d],
              p = v.inside,
              m = !!v.lookbehind,
              y = !!v.greedy,
              k = v.alias;
            if (y && !v.pattern.global) {
              var x = v.pattern.toString().match(/[imsuy]*$/)[0];
              v.pattern = RegExp(v.pattern.source, x + "g");
            }
            for (var b = v.pattern || v, w = r.next, A = s; w !== n.tail && !(g && A >= g.reach); A += w.value.length, w = w.next) {
              var E = w.value;
              if (n.length > e.length) return;
              if (!(E instanceof i)) {
                var P,
                  L = 1;
                if (y) {
                  if (!(P = l(b, A, e, m)) || P.index >= e.length) break;
                  var S = P.index,
                    O = P.index + P[0].length,
                    j = A;
                  for (j += w.value.length; S >= j;) {
                    j += (w = w.next).value.length;
                  }
                  if (A = j -= w.value.length, w.value instanceof i) continue;
                  for (var C = w; C !== n.tail && (j < O || "string" == typeof C.value); C = C.next) {
                    L++, j += C.value.length;
                  }
                  L--, E = e.slice(A, j), P.index -= A;
                } else if (!(P = l(b, 0, E, m))) continue;
                S = P.index;
                var N = P[0],
                  _ = E.slice(0, S),
                  M = E.slice(S + N.length),
                  W = A + E.length;
                g && W > g.reach && (g.reach = W);
                var z = w.prev;
                if (_ && (z = u(n, z, _), A += _.length), c(n, z, L), w = u(n, z, new i(f, p ? a.tokenize(N, p) : N, k, N)), M && u(n, w, M), L > 1) {
                  var I = {
                    cause: f + "," + d,
                    reach: W
                  };
                  o(e, n, t, w.prev, A, I), g && I.reach > g.reach && (g.reach = I.reach);
                }
              }
            }
          }
        }
      }
    }
    function s() {
      var e = {
          value: null,
          prev: null,
          next: null
        },
        n = {
          value: null,
          prev: e,
          next: null
        };
      e.next = n, this.head = e, this.tail = n, this.length = 0;
    }
    function u(e, n, t) {
      var r = n.next,
        a = {
          value: t,
          prev: n,
          next: r
        };
      return n.next = a, r.prev = a, e.length++, a;
    }
    function c(e, n, t) {
      for (var r = n.next, a = 0; a < t && r !== e.tail; a++) {
        r = r.next;
      }
      n.next = r, r.prev = n, e.length -= a;
    }
    if (e.Prism = a, i.stringify = function e(n, t) {
      if ("string" == typeof n) return n;
      if (Array.isArray(n)) {
        var r = "";
        return n.forEach(function (n) {
          r += e(n, t);
        }), r;
      }
      var i = {
          type: n.type,
          content: e(n.content, t),
          tag: "span",
          classes: ["token", n.type],
          attributes: {},
          language: t
        },
        l = n.alias;
      l && (Array.isArray(l) ? Array.prototype.push.apply(i.classes, l) : i.classes.push(l)), a.hooks.run("wrap", i);
      var o = "";
      for (var s in i.attributes) {
        o += " " + s + '="' + (i.attributes[s] || "").replace(/"/g, "&quot;") + '"';
      }
      return "<" + i.tag + ' class="' + i.classes.join(" ") + '"' + o + ">" + i.content + "</" + i.tag + ">";
    }, !e.document) return e.addEventListener ? (a.disableWorkerMessageHandler || e.addEventListener("message", function (n) {
      var t = JSON.parse(n.data),
        r = t.language,
        i = t.code,
        l = t.immediateClose;
      e.postMessage(a.highlight(i, a.languages[r], r)), l && e.close();
    }, !1), a) : a;
    var g = a.util.currentScript();
    function f() {
      a.manual || a.highlightAll();
    }
    if (g && (a.filename = g.src, g.hasAttribute("data-manual") && (a.manual = !0)), !a.manual) {
      var h = document.readyState;
      "loading" === h || "interactive" === h && g && g.defer ? document.addEventListener("DOMContentLoaded", f) : window.requestAnimationFrame ? window.requestAnimationFrame(f) : window.setTimeout(f, 16);
    }
    return a;
  }(_self);
 true && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism);
Prism.languages.markup = {
  comment: {
    pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
    greedy: !0
  },
  prolog: {
    pattern: /<\?[\s\S]+?\?>/,
    greedy: !0
  },
  doctype: {
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: !0,
    inside: {
      "internal-subset": {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: !0,
        greedy: !0,
        inside: null
      },
      string: {
        pattern: /"[^"]*"|'[^']*'/,
        greedy: !0
      },
      punctuation: /^<!|>$|[[\]]/,
      "doctype-tag": /^DOCTYPE/i,
      name: /[^\s<>'"]+/
    }
  },
  cdata: {
    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    greedy: !0
  },
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          punctuation: /^<\/?/,
          namespace: /^[^\s>\/:]+:/
        }
      },
      "special-attr": [],
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          punctuation: [{
            pattern: /^=/,
            alias: "attr-equals"
          }, {
            pattern: /^(\s*)["']|["']$/,
            lookbehind: !0
          }]
        }
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: {
          namespace: /^[^\s>\/:]+:/
        }
      }
    }
  },
  entity: [{
    pattern: /&[\da-z]{1,8};/i,
    alias: "named-entity"
  }, /&#x?[\da-f]{1,8};/i]
}, Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity, Prism.languages.markup.doctype.inside["internal-subset"].inside = Prism.languages.markup, Prism.hooks.add("wrap", function (a) {
  "entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"));
}), Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
  value: function value(a, e) {
    var s = {};
    s["language-" + e] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: !0,
      inside: Prism.languages[e]
    }, s.cdata = /^<!\[CDATA\[|\]\]>$/i;
    var t = {
      "included-cdata": {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: s
      }
    };
    t["language-" + e] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[e]
    };
    var n = {};
    n[a] = {
      pattern: RegExp("(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(/__/g, function () {
        return a;
      }), "i"),
      lookbehind: !0,
      greedy: !0,
      inside: t
    }, Prism.languages.insertBefore("markup", "cdata", n);
  }
}), Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
  value: function value(a, e) {
    Prism.languages.markup.tag.inside["special-attr"].push({
      pattern: RegExp("(^|[\"'\\s])(?:" + a + ")\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s'\">=]+(?=[\\s>]))", "i"),
      lookbehind: !0,
      inside: {
        "attr-name": /^[^\s=]+/,
        "attr-value": {
          pattern: /=[\s\S]+/,
          inside: {
            value: {
              pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
              lookbehind: !0,
              alias: [e, "language-" + e],
              inside: Prism.languages[e]
            },
            punctuation: [{
              pattern: /^=/,
              alias: "attr-equals"
            }, /"|'/]
          }
        }
      }
    });
  }
}), Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup, Prism.languages.xml = Prism.languages.extend("markup", {}), Prism.languages.ssml = Prism.languages.xml, Prism.languages.atom = Prism.languages.xml, Prism.languages.rss = Prism.languages.xml;
!function (s) {
  var e = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
  s.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: RegExp("@[\\w-](?:[^;{\\s\"']|\\s+(?!\\s)|" + e.source + ")*?(?:;|(?=\\s*\\{))"),
      inside: {
        rule: /^@[\w-]+/,
        "selector-function-argument": {
          pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: !0,
          alias: "selector"
        },
        keyword: {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: !0
        }
      }
    },
    url: {
      pattern: RegExp("\\burl\\((?:" + e.source + "|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)", "i"),
      greedy: !0,
      inside: {
        function: /^url/i,
        punctuation: /^\(|\)$/,
        string: {
          pattern: RegExp("^" + e.source + "$"),
          alias: "url"
        }
      }
    },
    selector: {
      pattern: RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|" + e.source + ")*(?=\\s*\\{)"),
      lookbehind: !0
    },
    string: {
      pattern: e,
      greedy: !0
    },
    property: {
      pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
      lookbehind: !0
    },
    important: /!important\b/i,
    function: {
      pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
      lookbehind: !0
    },
    punctuation: /[(){};:,]/
  }, s.languages.css.atrule.inside.rest = s.languages.css;
  var t = s.languages.markup;
  t && (t.tag.addInlined("style", "css"), t.tag.addAttribute("style", "css"));
}(Prism);
Prism.languages.clike = {
  comment: [{
    pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    lookbehind: !0,
    greedy: !0
  }, {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: !0,
    greedy: !0
  }],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  "class-name": {
    pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: !0,
    inside: {
      punctuation: /[.\\]/
    }
  },
  keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
  boolean: /\b(?:false|true)\b/,
  function: /\b\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/
};
Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [Prism.languages.clike["class-name"], {
    pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
    lookbehind: !0
  }],
  keyword: [{
    pattern: /((?:^|\})\s*)catch\b/,
    lookbehind: !0
  }, {
    pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    lookbehind: !0
  }],
  function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  number: {
    pattern: RegExp("(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])"),
    lookbehind: !0
  },
  operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
}), Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/, Prism.languages.insertBefore("javascript", "keyword", {
  regex: {
    pattern: RegExp("((?:^|[^$\\w\\xA0-\\uFFFF.\"'\\])\\s]|\\b(?:return|yield))\\s*)/(?:(?:\\[(?:[^\\]\\\\\r\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|/\\*(?:[^*]|\\*(?!/))*\\*/)*(?:$|[\r\n,.;:})\\]]|//))"),
    lookbehind: !0,
    greedy: !0,
    inside: {
      "regex-source": {
        pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
        lookbehind: !0,
        alias: "language-regex",
        inside: Prism.languages.regex
      },
      "regex-delimiter": /^\/|\/$/,
      "regex-flags": /^[a-z]+$/
    }
  },
  "function-variable": {
    pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    alias: "function"
  },
  parameter: [{
    pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }, {
    pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }, {
    pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }, {
    pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }],
  constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
}), Prism.languages.insertBefore("javascript", "string", {
  hashbang: {
    pattern: /^#!.*/,
    greedy: !0,
    alias: "comment"
  },
  "template-string": {
    pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
    greedy: !0,
    inside: {
      "template-punctuation": {
        pattern: /^`|`$/,
        alias: "string"
      },
      interpolation: {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
        lookbehind: !0,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\$\{|\}$/,
            alias: "punctuation"
          },
          rest: Prism.languages.javascript
        }
      },
      string: /[\s\S]+/
    }
  },
  "string-property": {
    pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    lookbehind: !0,
    greedy: !0,
    alias: "property"
  }
}), Prism.languages.insertBefore("javascript", "operator", {
  "literal-property": {
    pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
    lookbehind: !0,
    alias: "property"
  }
}), Prism.languages.markup && (Prism.languages.markup.tag.addInlined("script", "javascript"), Prism.languages.markup.tag.addAttribute("on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)", "javascript")), Prism.languages.js = Prism.languages.javascript;
Prism.languages.c = Prism.languages.extend("clike", {
  comment: {
    pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: !0
  },
  string: {
    pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: !0
  },
  "class-name": {
    pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
    lookbehind: !0
  },
  keyword: /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
  function: /\b[a-z_]\w*(?=\s*\()/i,
  number: /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
  operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/
}), Prism.languages.insertBefore("c", "string", {
  char: {
    pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
    greedy: !0
  }
}), Prism.languages.insertBefore("c", "string", {
  macro: {
    pattern: /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
    lookbehind: !0,
    greedy: !0,
    alias: "property",
    inside: {
      string: [{
        pattern: /^(#\s*include\s*)<[^>]+>/,
        lookbehind: !0
      }, Prism.languages.c.string],
      char: Prism.languages.c.char,
      comment: Prism.languages.c.comment,
      "macro-name": [{
        pattern: /(^#\s*define\s+)\w+\b(?!\()/i,
        lookbehind: !0
      }, {
        pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
        lookbehind: !0,
        alias: "function"
      }],
      directive: {
        pattern: /^(#\s*)[a-z]+/,
        lookbehind: !0,
        alias: "keyword"
      },
      "directive-hash": /^#/,
      punctuation: /##|\\(?=[\r\n])/,
      expression: {
        pattern: /\S[\s\S]*/,
        inside: Prism.languages.c
      }
    }
  }
}), Prism.languages.insertBefore("c", "function", {
  constant: /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/
}), delete Prism.languages.c.boolean;
!function (e) {
  function n(e, n) {
    return e.replace(/<<(\d+)>>/g, function (e, s) {
      return "(?:" + n[+s] + ")";
    });
  }
  function s(e, s, a) {
    return RegExp(n(e, s), a || "");
  }
  function a(e, n) {
    for (var s = 0; s < n; s++) {
      e = e.replace(/<<self>>/g, function () {
        return "(?:" + e + ")";
      });
    }
    return e.replace(/<<self>>/g, "[^\\s\\S]");
  }
  var t = "bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void",
    r = "class enum interface record struct",
    i = "add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)",
    o = "abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield";
  function l(e) {
    return "\\b(?:" + e.trim().replace(/ /g, "|") + ")\\b";
  }
  var d = l(r),
    p = RegExp(l(t + " " + r + " " + i + " " + o)),
    c = l(r + " " + i + " " + o),
    u = l(t + " " + r + " " + o),
    g = a("<(?:[^<>;=+\\-*/%&|^]|<<self>>)*>", 2),
    b = a("\\((?:[^()]|<<self>>)*\\)", 2),
    h = "@?\\b[A-Za-z_]\\w*\\b",
    f = n("<<0>>(?:\\s*<<1>>)?", [h, g]),
    m = n("(?!<<0>>)<<1>>(?:\\s*\\.\\s*<<1>>)*", [c, f]),
    k = "\\[\\s*(?:,\\s*)*\\]",
    y = n("<<0>>(?:\\s*(?:\\?\\s*)?<<1>>)*(?:\\s*\\?)?", [m, k]),
    w = n("[^,()<>[\\];=+\\-*/%&|^]|<<0>>|<<1>>|<<2>>", [g, b, k]),
    v = n("\\(<<0>>+(?:,<<0>>+)+\\)", [w]),
    x = n("(?:<<0>>|<<1>>)(?:\\s*(?:\\?\\s*)?<<2>>)*(?:\\s*\\?)?", [v, m, k]),
    $ = {
      keyword: p,
      punctuation: /[<>()?,.:[\]]/
    },
    _ = "'(?:[^\r\n'\\\\]|\\\\.|\\\\[Uux][\\da-fA-F]{1,8})'",
    B = '"(?:\\\\.|[^\\\\"\r\n])*"';
  e.languages.csharp = e.languages.extend("clike", {
    string: [{
      pattern: s("(^|[^$\\\\])<<0>>", ['@"(?:""|\\\\[^]|[^\\\\"])*"(?!")']),
      lookbehind: !0,
      greedy: !0
    }, {
      pattern: s("(^|[^@$\\\\])<<0>>", [B]),
      lookbehind: !0,
      greedy: !0
    }],
    "class-name": [{
      pattern: s("(\\busing\\s+static\\s+)<<0>>(?=\\s*;)", [m]),
      lookbehind: !0,
      inside: $
    }, {
      pattern: s("(\\busing\\s+<<0>>\\s*=\\s*)<<1>>(?=\\s*;)", [h, x]),
      lookbehind: !0,
      inside: $
    }, {
      pattern: s("(\\busing\\s+)<<0>>(?=\\s*=)", [h]),
      lookbehind: !0
    }, {
      pattern: s("(\\b<<0>>\\s+)<<1>>", [d, f]),
      lookbehind: !0,
      inside: $
    }, {
      pattern: s("(\\bcatch\\s*\\(\\s*)<<0>>", [m]),
      lookbehind: !0,
      inside: $
    }, {
      pattern: s("(\\bwhere\\s+)<<0>>", [h]),
      lookbehind: !0
    }, {
      pattern: s("(\\b(?:is(?:\\s+not)?|as)\\s+)<<0>>", [y]),
      lookbehind: !0,
      inside: $
    }, {
      pattern: s("\\b<<0>>(?=\\s+(?!<<1>>|with\\s*\\{)<<2>>(?:\\s*[=,;:{)\\]]|\\s+(?:in|when)\\b))", [x, u, h]),
      inside: $
    }],
    keyword: p,
    number: /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,
    operator: />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
    punctuation: /\?\.?|::|[{}[\];(),.:]/
  }), e.languages.insertBefore("csharp", "number", {
    range: {
      pattern: /\.\./,
      alias: "operator"
    }
  }), e.languages.insertBefore("csharp", "punctuation", {
    "named-parameter": {
      pattern: s("([(,]\\s*)<<0>>(?=\\s*:)", [h]),
      lookbehind: !0,
      alias: "punctuation"
    }
  }), e.languages.insertBefore("csharp", "class-name", {
    namespace: {
      pattern: s("(\\b(?:namespace|using)\\s+)<<0>>(?:\\s*\\.\\s*<<0>>)*(?=\\s*[;{])", [h]),
      lookbehind: !0,
      inside: {
        punctuation: /\./
      }
    },
    "type-expression": {
      pattern: s("(\\b(?:default|sizeof|typeof)\\s*\\(\\s*(?!\\s))(?:[^()\\s]|\\s(?!\\s)|<<0>>)*(?=\\s*\\))", [b]),
      lookbehind: !0,
      alias: "class-name",
      inside: $
    },
    "return-type": {
      pattern: s("<<0>>(?=\\s+(?:<<1>>\\s*(?:=>|[({]|\\.\\s*this\\s*\\[)|this\\s*\\[))", [x, m]),
      inside: $,
      alias: "class-name"
    },
    "constructor-invocation": {
      pattern: s("(\\bnew\\s+)<<0>>(?=\\s*[[({])", [x]),
      lookbehind: !0,
      inside: $,
      alias: "class-name"
    },
    "generic-method": {
      pattern: s("<<0>>\\s*<<1>>(?=\\s*\\()", [h, g]),
      inside: {
        function: s("^<<0>>", [h]),
        generic: {
          pattern: RegExp(g),
          alias: "class-name",
          inside: $
        }
      }
    },
    "type-list": {
      pattern: s("\\b((?:<<0>>\\s+<<1>>|record\\s+<<1>>\\s*<<5>>|where\\s+<<2>>)\\s*:\\s*)(?:<<3>>|<<4>>|<<1>>\\s*<<5>>|<<6>>)(?:\\s*,\\s*(?:<<3>>|<<4>>|<<6>>))*(?=\\s*(?:where|[{;]|=>|$))", [d, f, h, x, p.source, b, "\\bnew\\s*\\(\\s*\\)"]),
      lookbehind: !0,
      inside: {
        "record-arguments": {
          pattern: s("(^(?!new\\s*\\()<<0>>\\s*)<<1>>", [f, b]),
          lookbehind: !0,
          greedy: !0,
          inside: e.languages.csharp
        },
        keyword: p,
        "class-name": {
          pattern: RegExp(x),
          greedy: !0,
          inside: $
        },
        punctuation: /[,()]/
      }
    },
    preprocessor: {
      pattern: /(^[\t ]*)#.*/m,
      lookbehind: !0,
      alias: "property",
      inside: {
        directive: {
          pattern: /(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,
          lookbehind: !0,
          alias: "keyword"
        }
      }
    }
  });
  var E = B + "|" + _,
    R = n("/(?![*/])|//[^\r\n]*[\r\n]|/\\*(?:[^*]|\\*(?!/))*\\*/|<<0>>", [E]),
    z = a(n("[^\"'/()]|<<0>>|\\(<<self>>*\\)", [R]), 2),
    S = "\\b(?:assembly|event|field|method|module|param|property|return|type)\\b",
    j = n("<<0>>(?:\\s*\\(<<1>>*\\))?", [m, z]);
  e.languages.insertBefore("csharp", "class-name", {
    attribute: {
      pattern: s("((?:^|[^\\s\\w>)?])\\s*\\[\\s*)(?:<<0>>\\s*:\\s*)?<<1>>(?:\\s*,\\s*<<1>>)*(?=\\s*\\])", [S, j]),
      lookbehind: !0,
      greedy: !0,
      inside: {
        target: {
          pattern: s("^<<0>>(?=\\s*:)", [S]),
          alias: "keyword"
        },
        "attribute-arguments": {
          pattern: s("\\(<<0>>*\\)", [z]),
          inside: e.languages.csharp
        },
        "class-name": {
          pattern: RegExp(m),
          inside: {
            punctuation: /\./
          }
        },
        punctuation: /[:,]/
      }
    }
  });
  var A = ":[^}\r\n]+",
    F = a(n("[^\"'/()]|<<0>>|\\(<<self>>*\\)", [R]), 2),
    P = n("\\{(?!\\{)(?:(?![}:])<<0>>)*<<1>>?\\}", [F, A]),
    U = a(n("[^\"'/()]|/(?!\\*)|/\\*(?:[^*]|\\*(?!/))*\\*/|<<0>>|\\(<<self>>*\\)", [E]), 2),
    Z = n("\\{(?!\\{)(?:(?![}:])<<0>>)*<<1>>?\\}", [U, A]);
  function q(n, a) {
    return {
      interpolation: {
        pattern: s("((?:^|[^{])(?:\\{\\{)*)<<0>>", [n]),
        lookbehind: !0,
        inside: {
          "format-string": {
            pattern: s("(^\\{(?:(?![}:])<<0>>)*)<<1>>(?=\\}$)", [a, A]),
            lookbehind: !0,
            inside: {
              punctuation: /^:/
            }
          },
          punctuation: /^\{|\}$/,
          expression: {
            pattern: /[\s\S]+/,
            alias: "language-csharp",
            inside: e.languages.csharp
          }
        }
      },
      string: /[\s\S]+/
    };
  }
  e.languages.insertBefore("csharp", "string", {
    "interpolation-string": [{
      pattern: s('(^|[^\\\\])(?:\\$@|@\\$)"(?:""|\\\\[^]|\\{\\{|<<0>>|[^\\\\{"])*"', [P]),
      lookbehind: !0,
      greedy: !0,
      inside: q(P, F)
    }, {
      pattern: s('(^|[^@\\\\])\\$"(?:\\\\.|\\{\\{|<<0>>|[^\\\\"{])*"', [Z]),
      lookbehind: !0,
      greedy: !0,
      inside: q(Z, U)
    }],
    char: {
      pattern: RegExp(_),
      greedy: !0
    }
  }), e.languages.dotnet = e.languages.cs = e.languages.csharp;
}(Prism);
!function (e) {
  var t = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
    n = "\\b(?!<keyword>)\\w+(?:\\s*\\.\\s*\\w+)*\\b".replace(/<keyword>/g, function () {
      return t.source;
    });
  e.languages.cpp = e.languages.extend("c", {
    "class-name": [{
      pattern: RegExp("(\\b(?:class|concept|enum|struct|typename)\\s+)(?!<keyword>)\\w+".replace(/<keyword>/g, function () {
        return t.source;
      })),
      lookbehind: !0
    }, /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/, /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i, /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/],
    keyword: t,
    number: {
      pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
      greedy: !0
    },
    operator: />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
    boolean: /\b(?:false|true)\b/
  }), e.languages.insertBefore("cpp", "string", {
    module: {
      pattern: RegExp('(\\b(?:import|module)\\s+)(?:"(?:\\\\(?:\r\n|[^])|[^"\\\\\r\n])*"|<[^<>\r\n]*>|' + "<mod-name>(?:\\s*:\\s*<mod-name>)?|:\\s*<mod-name>".replace(/<mod-name>/g, function () {
        return n;
      }) + ")"),
      lookbehind: !0,
      greedy: !0,
      inside: {
        string: /^[<"][\s\S]+/,
        operator: /:/,
        punctuation: /\./
      }
    },
    "raw-string": {
      pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
      alias: "string",
      greedy: !0
    }
  }), e.languages.insertBefore("cpp", "keyword", {
    "generic-function": {
      pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
      inside: {
        function: /^\w+/,
        generic: {
          pattern: /<[\s\S]+/,
          alias: "class-name",
          inside: e.languages.cpp
        }
      }
    }
  }), e.languages.insertBefore("cpp", "operator", {
    "double-colon": {
      pattern: /::/,
      alias: "punctuation"
    }
  }), e.languages.insertBefore("cpp", "class-name", {
    "base-clause": {
      pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
      lookbehind: !0,
      greedy: !0,
      inside: e.languages.extend("cpp", {})
    }
  }), e.languages.insertBefore("inside", "double-colon", {
    "class-name": /\b[a-z_]\w*\b(?!\s*::)/i
  }, e.languages.cpp["base-clause"]);
}(Prism);
!function (e) {
  var n = "(?:[ \t]+(?![ \t])(?:<SP_BS>)?|<SP_BS>)".replace(/<SP_BS>/g, function () {
      return "\\\\[\r\n](?:\\s|\\\\[\r\n]|#.*(?!.))*(?![\\s#]|\\\\[\r\n])";
    }),
    r = "\"(?:[^\"\\\\\r\n]|\\\\(?:\r\n|[^]))*\"|'(?:[^'\\\\\r\n]|\\\\(?:\r\n|[^]))*'",
    t = "--[\\w-]+=(?:<STR>|(?![\"'])(?:[^\\s\\\\]|\\\\.)+)".replace(/<STR>/g, function () {
      return r;
    }),
    o = {
      pattern: RegExp(r),
      greedy: !0
    },
    i = {
      pattern: /(^[ \t]*)#.*/m,
      lookbehind: !0,
      greedy: !0
    };
  function a(e, r) {
    return e = e.replace(/<OPT>/g, function () {
      return t;
    }).replace(/<SP>/g, function () {
      return n;
    }), RegExp(e, r);
  }
  e.languages.docker = {
    instruction: {
      pattern: /(^[ \t]*)(?:ADD|ARG|CMD|COPY|ENTRYPOINT|ENV|EXPOSE|FROM|HEALTHCHECK|LABEL|MAINTAINER|ONBUILD|RUN|SHELL|STOPSIGNAL|USER|VOLUME|WORKDIR)(?=\s)(?:\\.|[^\r\n\\])*(?:\\$(?:\s|#.*$)*(?![\s#])(?:\\.|[^\r\n\\])*)*/im,
      lookbehind: !0,
      greedy: !0,
      inside: {
        options: {
          pattern: a("(^(?:ONBUILD<SP>)?\\w+<SP>)<OPT>(?:<SP><OPT>)*", "i"),
          lookbehind: !0,
          greedy: !0,
          inside: {
            property: {
              pattern: /(^|\s)--[\w-]+/,
              lookbehind: !0
            },
            string: [o, {
              pattern: /(=)(?!["'])(?:[^\s\\]|\\.)+/,
              lookbehind: !0
            }],
            operator: /\\$/m,
            punctuation: /=/
          }
        },
        keyword: [{
          pattern: a("(^(?:ONBUILD<SP>)?HEALTHCHECK<SP>(?:<OPT><SP>)*)(?:CMD|NONE)\\b", "i"),
          lookbehind: !0,
          greedy: !0
        }, {
          pattern: a("(^(?:ONBUILD<SP>)?FROM<SP>(?:<OPT><SP>)*(?!--)[^ \t\\\\]+<SP>)AS", "i"),
          lookbehind: !0,
          greedy: !0
        }, {
          pattern: a("(^ONBUILD<SP>)\\w+", "i"),
          lookbehind: !0,
          greedy: !0
        }, {
          pattern: /^\w+/,
          greedy: !0
        }],
        comment: i,
        string: o,
        variable: /\$(?:\w+|\{[^{}"'\\]*\})/,
        operator: /\\$/m
      }
    },
    comment: i
  }, e.languages.dockerfile = e.languages.docker;
}(Prism);
Prism.languages.git = {
  comment: /^#.*/m,
  deleted: /^[-–].*/m,
  inserted: /^\+.*/m,
  string: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
  command: {
    pattern: /^.*\$ git .*$/m,
    inside: {
      parameter: /\s--?\w+/
    }
  },
  coord: /^@@.*@@$/m,
  "commit-sha1": /^commit \w{40}$/m
};
Prism.languages.go = Prism.languages.extend("clike", {
  string: {
    pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,
    lookbehind: !0,
    greedy: !0
  },
  keyword: /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
  boolean: /\b(?:_|false|iota|nil|true)\b/,
  number: [/\b0(?:b[01_]+|o[0-7_]+)i?\b/i, /\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i, /(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i],
  operator: /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
  builtin: /\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/
}), Prism.languages.insertBefore("go", "string", {
  char: {
    pattern: /'(?:\\.|[^'\\\r\n]){0,10}'/,
    greedy: !0
  }
}), delete Prism.languages.go["class-name"];
!function (e) {
  var n = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,
    t = "(?:[a-z]\\w*\\s*\\.\\s*)*(?:[A-Z]\\w*\\s*\\.\\s*)*",
    s = {
      pattern: RegExp("(^|[^\\w.])" + t + "[A-Z](?:[\\d_A-Z]*[a-z]\\w*)?\\b"),
      lookbehind: !0,
      inside: {
        namespace: {
          pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
          inside: {
            punctuation: /\./
          }
        },
        punctuation: /\./
      }
    };
  e.languages.java = e.languages.extend("clike", {
    string: {
      pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,
      lookbehind: !0,
      greedy: !0
    },
    "class-name": [s, {
      pattern: RegExp("(^|[^\\w.])" + t + "[A-Z]\\w*(?=\\s+\\w+\\s*[;,=()]|\\s*(?:\\[[\\s,]*\\]\\s*)?::\\s*new\\b)"),
      lookbehind: !0,
      inside: s.inside
    }, {
      pattern: RegExp("(\\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\\s+)" + t + "[A-Z]\\w*\\b"),
      lookbehind: !0,
      inside: s.inside
    }],
    keyword: n,
    function: [e.languages.clike.function, {
      pattern: /(::\s*)[a-z_]\w*/,
      lookbehind: !0
    }],
    number: /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    operator: {
      pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
      lookbehind: !0
    },
    constant: /\b[A-Z][A-Z_\d]+\b/
  }), e.languages.insertBefore("java", "string", {
    "triple-quoted-string": {
      pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
      greedy: !0,
      alias: "string"
    },
    char: {
      pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/,
      greedy: !0
    }
  }), e.languages.insertBefore("java", "class-name", {
    annotation: {
      pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
      lookbehind: !0,
      alias: "punctuation"
    },
    generics: {
      pattern: /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
      inside: {
        "class-name": s,
        keyword: n,
        punctuation: /[<>(),.:]/,
        operator: /[?&|]/
      }
    },
    import: [{
      pattern: RegExp("(\\bimport\\s+)" + t + "(?:[A-Z]\\w*|\\*)(?=\\s*;)"),
      lookbehind: !0,
      inside: {
        namespace: s.inside.namespace,
        punctuation: /\./,
        operator: /\*/,
        "class-name": /\w+/
      }
    }, {
      pattern: RegExp("(\\bimport\\s+static\\s+)" + t + "(?:\\w+|\\*)(?=\\s*;)"),
      lookbehind: !0,
      alias: "static",
      inside: {
        namespace: s.inside.namespace,
        static: /\b\w+$/,
        punctuation: /\./,
        operator: /\*/,
        "class-name": /\w+/
      }
    }],
    namespace: {
      pattern: RegExp("(\\b(?:exports|import(?:\\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\\s+)(?!<keyword>)[a-z]\\w*(?:\\.[a-z]\\w*)*\\.?".replace(/<keyword>/g, function () {
        return n.source;
      })),
      lookbehind: !0,
      inside: {
        punctuation: /\./
      }
    }
  });
}(Prism);
!function (e) {
  function n(e, n) {
    return "___" + e.toUpperCase() + n + "___";
  }
  Object.defineProperties(e.languages["markup-templating"] = {}, {
    buildPlaceholders: {
      value: function value(t, a, r, o) {
        if (t.language === a) {
          var c = t.tokenStack = [];
          t.code = t.code.replace(r, function (e) {
            if ("function" == typeof o && !o(e)) return e;
            for (var r, i = c.length; -1 !== t.code.indexOf(r = n(a, i));) {
              ++i;
            }
            return c[i] = e, r;
          }), t.grammar = e.languages.markup;
        }
      }
    },
    tokenizePlaceholders: {
      value: function value(t, a) {
        if (t.language === a && t.tokenStack) {
          t.grammar = e.languages[a];
          var r = 0,
            o = Object.keys(t.tokenStack);
          !function c(i) {
            for (var u = 0; u < i.length && !(r >= o.length); u++) {
              var g = i[u];
              if ("string" == typeof g || g.content && "string" == typeof g.content) {
                var l = o[r],
                  s = t.tokenStack[l],
                  f = "string" == typeof g ? g : g.content,
                  p = n(a, l),
                  k = f.indexOf(p);
                if (k > -1) {
                  ++r;
                  var m = f.substring(0, k),
                    d = new e.Token(a, e.tokenize(s, t.grammar), "language-" + a, s),
                    h = f.substring(k + p.length),
                    v = [];
                  m && v.push.apply(v, c([m])), v.push(d), h && v.push.apply(v, c([h])), "string" == typeof g ? i.splice.apply(i, [u, 1].concat(v)) : g.content = v;
                }
              } else g.content && c(g.content);
            }
            return i;
          }(t.tokens);
        }
      }
    }
  });
}(Prism);
!function (e) {
  var a = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/,
    t = [{
      pattern: /\b(?:false|true)\b/i,
      alias: "boolean"
    }, {
      pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i,
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i,
      greedy: !0,
      lookbehind: !0
    }, /\b(?:null)\b/i, /\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/],
    i = /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    n = /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/,
    s = /[{}\[\](),:;]/;
  e.languages.php = {
    delimiter: {
      pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
      alias: "important"
    },
    comment: a,
    variable: /\$+(?:\w+\b|(?=\{))/,
    package: {
      pattern: /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      lookbehind: !0,
      inside: {
        punctuation: /\\/
      }
    },
    "class-name-definition": {
      pattern: /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
      lookbehind: !0,
      alias: "class-name"
    },
    "function-definition": {
      pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,
      lookbehind: !0,
      alias: "function"
    },
    keyword: [{
      pattern: /(\(\s*)\b(?:array|bool|boolean|float|int|integer|object|string)\b(?=\s*\))/i,
      alias: "type-casting",
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /([(,?]\s*)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string)\b(?=\s*\$)/i,
      alias: "type-hint",
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /(\)\s*:\s*(?:\?\s*)?)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|never|object|self|static|string|void)\b/i,
      alias: "return-type",
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /\b(?:array(?!\s*\()|bool|float|int|iterable|mixed|object|string|void)\b/i,
      alias: "type-declaration",
      greedy: !0
    }, {
      pattern: /(\|\s*)(?:false|null)\b|\b(?:false|null)(?=\s*\|)/i,
      alias: "type-declaration",
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /\b(?:parent|self|static)(?=\s*::)/i,
      alias: "static-context",
      greedy: !0
    }, {
      pattern: /(\byield\s+)from\b/i,
      lookbehind: !0
    }, /\bclass\b/i, {
      pattern: /((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|never|new|or|parent|print|private|protected|public|readonly|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/i,
      lookbehind: !0
    }],
    "argument-name": {
      pattern: /([(,]\s*)\b[a-z_]\w*(?=\s*:(?!:))/i,
      lookbehind: !0
    },
    "class-name": [{
      pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i,
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i,
      greedy: !0
    }, {
      pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
      alias: "class-name-fully-qualified",
      greedy: !0,
      lookbehind: !0,
      inside: {
        punctuation: /\\/
      }
    }, {
      pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
      alias: "class-name-fully-qualified",
      greedy: !0,
      inside: {
        punctuation: /\\/
      }
    }, {
      pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      alias: "class-name-fully-qualified",
      greedy: !0,
      lookbehind: !0,
      inside: {
        punctuation: /\\/
      }
    }, {
      pattern: /\b[a-z_]\w*(?=\s*\$)/i,
      alias: "type-declaration",
      greedy: !0
    }, {
      pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
      alias: ["class-name-fully-qualified", "type-declaration"],
      greedy: !0,
      inside: {
        punctuation: /\\/
      }
    }, {
      pattern: /\b[a-z_]\w*(?=\s*::)/i,
      alias: "static-context",
      greedy: !0
    }, {
      pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
      alias: ["class-name-fully-qualified", "static-context"],
      greedy: !0,
      inside: {
        punctuation: /\\/
      }
    }, {
      pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
      alias: "type-hint",
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
      alias: ["class-name-fully-qualified", "type-hint"],
      greedy: !0,
      lookbehind: !0,
      inside: {
        punctuation: /\\/
      }
    }, {
      pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
      alias: "return-type",
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      alias: ["class-name-fully-qualified", "return-type"],
      greedy: !0,
      lookbehind: !0,
      inside: {
        punctuation: /\\/
      }
    }],
    constant: t,
    function: {
      pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
      lookbehind: !0,
      inside: {
        punctuation: /\\/
      }
    },
    property: {
      pattern: /(->\s*)\w+/,
      lookbehind: !0
    },
    number: i,
    operator: n,
    punctuation: s
  };
  var l = {
      pattern: /\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
      lookbehind: !0,
      inside: e.languages.php
    },
    r = [{
      pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
      alias: "nowdoc-string",
      greedy: !0,
      inside: {
        delimiter: {
          pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
          alias: "symbol",
          inside: {
            punctuation: /^<<<'?|[';]$/
          }
        }
      }
    }, {
      pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
      alias: "heredoc-string",
      greedy: !0,
      inside: {
        delimiter: {
          pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
          alias: "symbol",
          inside: {
            punctuation: /^<<<"?|[";]$/
          }
        },
        interpolation: l
      }
    }, {
      pattern: /`(?:\\[\s\S]|[^\\`])*`/,
      alias: "backtick-quoted-string",
      greedy: !0
    }, {
      pattern: /'(?:\\[\s\S]|[^\\'])*'/,
      alias: "single-quoted-string",
      greedy: !0
    }, {
      pattern: /"(?:\\[\s\S]|[^\\"])*"/,
      alias: "double-quoted-string",
      greedy: !0,
      inside: {
        interpolation: l
      }
    }];
  e.languages.insertBefore("php", "variable", {
    string: r,
    attribute: {
      pattern: /#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
      greedy: !0,
      inside: {
        "attribute-content": {
          pattern: /^(#\[)[\s\S]+(?=\]$)/,
          lookbehind: !0,
          inside: {
            comment: a,
            string: r,
            "attribute-class-name": [{
              pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
              alias: "class-name",
              greedy: !0,
              lookbehind: !0
            }, {
              pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
              alias: ["class-name", "class-name-fully-qualified"],
              greedy: !0,
              lookbehind: !0,
              inside: {
                punctuation: /\\/
              }
            }],
            constant: t,
            number: i,
            operator: n,
            punctuation: s
          }
        },
        delimiter: {
          pattern: /^#\[|\]$/,
          alias: "punctuation"
        }
      }
    }
  }), e.hooks.add("before-tokenize", function (a) {
    /<\?/.test(a.code) && e.languages["markup-templating"].buildPlaceholders(a, "php", /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/g);
  }), e.hooks.add("after-tokenize", function (a) {
    e.languages["markup-templating"].tokenizePlaceholders(a, "php");
  });
}(Prism);
Prism.languages.sql = {
  comment: {
    pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
    lookbehind: !0
  },
  variable: [{
    pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
    greedy: !0
  }, /@[\w.$]+/],
  string: {
    pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
    greedy: !0,
    lookbehind: !0
  },
  identifier: {
    pattern: /(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,
    greedy: !0,
    lookbehind: !0,
    inside: {
      punctuation: /^`|`$/
    }
  },
  function: /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
  keyword: /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
  boolean: /\b(?:FALSE|NULL|TRUE)\b/i,
  number: /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
  operator: /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
  punctuation: /[;[\]()`,.]/
};
Prism.languages.plsql = Prism.languages.extend("sql", {
  comment: {
    pattern: /\/\*[\s\S]*?\*\/|--.*/,
    greedy: !0
  },
  keyword: /\b(?:A|ACCESSIBLE|ADD|AGENT|AGGREGATE|ALL|ALTER|AND|ANY|ARRAY|AS|ASC|AT|ATTRIBUTE|AUTHID|AVG|BEGIN|BETWEEN|BFILE_BASE|BINARY|BLOB_BASE|BLOCK|BODY|BOTH|BOUND|BULK|BY|BYTE|C|CALL|CALLING|CASCADE|CASE|CHAR|CHARACTER|CHARSET|CHARSETFORM|CHARSETID|CHAR_BASE|CHECK|CLOB_BASE|CLONE|CLOSE|CLUSTER|CLUSTERS|COLAUTH|COLLECT|COLUMNS|COMMENT|COMMIT|COMMITTED|COMPILED|COMPRESS|CONNECT|CONSTANT|CONSTRUCTOR|CONTEXT|CONTINUE|CONVERT|COUNT|CRASH|CREATE|CREDENTIAL|CURRENT|CURSOR|CUSTOMDATUM|DANGLING|DATA|DATE|DATE_BASE|DAY|DECLARE|DEFAULT|DEFINE|DELETE|DESC|DETERMINISTIC|DIRECTORY|DISTINCT|DOUBLE|DROP|DURATION|ELEMENT|ELSE|ELSIF|EMPTY|END|ESCAPE|EXCEPT|EXCEPTION|EXCEPTIONS|EXCLUSIVE|EXECUTE|EXISTS|EXIT|EXTERNAL|FETCH|FINAL|FIRST|FIXED|FLOAT|FOR|FORALL|FORCE|FROM|FUNCTION|GENERAL|GOTO|GRANT|GROUP|HASH|HAVING|HEAP|HIDDEN|HOUR|IDENTIFIED|IF|IMMEDIATE|IMMUTABLE|IN|INCLUDING|INDEX|INDEXES|INDICATOR|INDICES|INFINITE|INSERT|INSTANTIABLE|INT|INTERFACE|INTERSECT|INTERVAL|INTO|INVALIDATE|IS|ISOLATION|JAVA|LANGUAGE|LARGE|LEADING|LENGTH|LEVEL|LIBRARY|LIKE|LIKE2|LIKE4|LIKEC|LIMIT|LIMITED|LOCAL|LOCK|LONG|LOOP|MAP|MAX|MAXLEN|MEMBER|MERGE|MIN|MINUS|MINUTE|MOD|MODE|MODIFY|MONTH|MULTISET|MUTABLE|NAME|NAN|NATIONAL|NATIVE|NCHAR|NEW|NOCOMPRESS|NOCOPY|NOT|NOWAIT|NULL|NUMBER_BASE|OBJECT|OCICOLL|OCIDATE|OCIDATETIME|OCIDURATION|OCIINTERVAL|OCILOBLOCATOR|OCINUMBER|OCIRAW|OCIREF|OCIREFCURSOR|OCIROWID|OCISTRING|OCITYPE|OF|OLD|ON|ONLY|OPAQUE|OPEN|OPERATOR|OPTION|OR|ORACLE|ORADATA|ORDER|ORGANIZATION|ORLANY|ORLVARY|OTHERS|OUT|OVERLAPS|OVERRIDING|PACKAGE|PARALLEL_ENABLE|PARAMETER|PARAMETERS|PARENT|PARTITION|PASCAL|PERSISTABLE|PIPE|PIPELINED|PLUGGABLE|POLYMORPHIC|PRAGMA|PRECISION|PRIOR|PRIVATE|PROCEDURE|PUBLIC|RAISE|RANGE|RAW|READ|RECORD|REF|REFERENCE|RELIES_ON|REM|REMAINDER|RENAME|RESOURCE|RESULT|RESULT_CACHE|RETURN|RETURNING|REVERSE|REVOKE|ROLLBACK|ROW|SAMPLE|SAVE|SAVEPOINT|SB1|SB2|SB4|SECOND|SEGMENT|SELECT|SELF|SEPARATE|SEQUENCE|SERIALIZABLE|SET|SHARE|SHORT|SIZE|SIZE_T|SOME|SPARSE|SQL|SQLCODE|SQLDATA|SQLNAME|SQLSTATE|STANDARD|START|STATIC|STDDEV|STORED|STRING|STRUCT|STYLE|SUBMULTISET|SUBPARTITION|SUBSTITUTABLE|SUBTYPE|SUM|SYNONYM|TABAUTH|TABLE|TDO|THE|THEN|TIME|TIMESTAMP|TIMEZONE_ABBR|TIMEZONE_HOUR|TIMEZONE_MINUTE|TIMEZONE_REGION|TO|TRAILING|TRANSACTION|TRANSACTIONAL|TRUSTED|TYPE|UB1|UB2|UB4|UNDER|UNION|UNIQUE|UNPLUG|UNSIGNED|UNTRUSTED|UPDATE|USE|USING|VALIST|VALUE|VALUES|VARIABLE|VARIANCE|VARRAY|VARYING|VIEW|VIEWS|VOID|WHEN|WHERE|WHILE|WITH|WORK|WRAPPED|WRITE|YEAR|ZONE)\b/i,
  operator: /:=?|=>|[<>^~!]=|\.\.|\|\||\*\*|[-+*/%<>=@]/
}), Prism.languages.insertBefore("plsql", "operator", {
  label: {
    pattern: /<<\s*\w+\s*>>/,
    alias: "symbol"
  }
});
!function (e) {
  var i = e.languages.powershell = {
    comment: [{
      pattern: /(^|[^`])<#[\s\S]*?#>/,
      lookbehind: !0
    }, {
      pattern: /(^|[^`])#.*/,
      lookbehind: !0
    }],
    string: [{
      pattern: /"(?:`[\s\S]|[^`"])*"/,
      greedy: !0,
      inside: null
    }, {
      pattern: /'(?:[^']|'')*'/,
      greedy: !0
    }],
    namespace: /\[[a-z](?:\[(?:\[[^\]]*\]|[^\[\]])*\]|[^\[\]])*\]/i,
    boolean: /\$(?:false|true)\b/i,
    variable: /\$\w+\b/,
    function: [/\b(?:Add|Approve|Assert|Backup|Block|Checkpoint|Clear|Close|Compare|Complete|Compress|Confirm|Connect|Convert|ConvertFrom|ConvertTo|Copy|Debug|Deny|Disable|Disconnect|Dismount|Edit|Enable|Enter|Exit|Expand|Export|Find|ForEach|Format|Get|Grant|Group|Hide|Import|Initialize|Install|Invoke|Join|Limit|Lock|Measure|Merge|Move|New|Open|Optimize|Out|Ping|Pop|Protect|Publish|Push|Read|Receive|Redo|Register|Remove|Rename|Repair|Request|Reset|Resize|Resolve|Restart|Restore|Resume|Revoke|Save|Search|Select|Send|Set|Show|Skip|Sort|Split|Start|Step|Stop|Submit|Suspend|Switch|Sync|Tee|Test|Trace|Unblock|Undo|Uninstall|Unlock|Unprotect|Unpublish|Unregister|Update|Use|Wait|Watch|Where|Write)-[a-z]+\b/i, /\b(?:ac|cat|chdir|clc|cli|clp|clv|compare|copy|cp|cpi|cpp|cvpa|dbp|del|diff|dir|ebp|echo|epal|epcsv|epsn|erase|fc|fl|ft|fw|gal|gbp|gc|gci|gcs|gdr|gi|gl|gm|gp|gps|group|gsv|gu|gv|gwmi|iex|ii|ipal|ipcsv|ipsn|irm|iwmi|iwr|kill|lp|ls|measure|mi|mount|move|mp|mv|nal|ndr|ni|nv|ogv|popd|ps|pushd|pwd|rbp|rd|rdr|ren|ri|rm|rmdir|rni|rnp|rp|rv|rvpa|rwmi|sal|saps|sasv|sbp|sc|select|set|shcm|si|sl|sleep|sls|sort|sp|spps|spsv|start|sv|swmi|tee|trcm|type|write)\b/i],
    keyword: /\b(?:Begin|Break|Catch|Class|Continue|Data|Define|Do|DynamicParam|Else|ElseIf|End|Exit|Filter|Finally|For|ForEach|From|Function|If|InlineScript|Parallel|Param|Process|Return|Sequence|Switch|Throw|Trap|Try|Until|Using|Var|While|Workflow)\b/i,
    operator: {
      pattern: /(^|\W)(?:!|-(?:b?(?:and|x?or)|as|(?:Not)?(?:Contains|In|Like|Match)|eq|ge|gt|is(?:Not)?|Join|le|lt|ne|not|Replace|sh[lr])\b|-[-=]?|\+[+=]?|[*\/%]=?)/i,
      lookbehind: !0
    },
    punctuation: /[|{}[\];(),.]/
  };
  i.string[0].inside = {
    function: {
      pattern: /(^|[^`])\$\((?:\$\([^\r\n()]*\)|(?!\$\()[^\r\n)])*\)/,
      lookbehind: !0,
      inside: i
    },
    boolean: i.boolean,
    variable: i.variable
  };
}(Prism);
Prism.languages.python = {
  comment: {
    pattern: /(^|[^\\])#.*/,
    lookbehind: !0,
    greedy: !0
  },
  "string-interpolation": {
    pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
    greedy: !0,
    inside: {
      interpolation: {
        pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
        lookbehind: !0,
        inside: {
          "format-spec": {
            pattern: /(:)[^:(){}]+(?=\}$)/,
            lookbehind: !0
          },
          "conversion-option": {
            pattern: /![sra](?=[:}]$)/,
            alias: "punctuation"
          },
          rest: null
        }
      },
      string: /[\s\S]+/
    }
  },
  "triple-quoted-string": {
    pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
    greedy: !0,
    alias: "string"
  },
  string: {
    pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
    greedy: !0
  },
  function: {
    pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
    lookbehind: !0
  },
  "class-name": {
    pattern: /(\bclass\s+)\w+/i,
    lookbehind: !0
  },
  decorator: {
    pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
    lookbehind: !0,
    alias: ["annotation", "punctuation"],
    inside: {
      punctuation: /\./
    }
  },
  keyword: /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
  builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
  boolean: /\b(?:False|None|True)\b/,
  number: /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
  operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
  punctuation: /[{}[\];(),.:]/
}, Prism.languages.python["string-interpolation"].inside.interpolation.inside.rest = Prism.languages.python, Prism.languages.py = Prism.languages.python;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! (webpack)/buildin/global.js */ 3)))

/***/ }),
/* 205 */
/*!******************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/highlight/config.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  copyByLongPress: true,
  // 是否需要长按代码块时显示复制代码内容菜单
  showLanguageName: true,
  // 是否在代码块右上角显示语言的名称
  showLineNumber: true // 是否显示行号
};
exports.default = _default;

/***/ }),
/* 206 */
/*!*************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/style/index.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _parser = _interopRequireDefault(__webpack_require__(/*! ./parser */ 207));
/**
 * @fileoverview style 插件
 */

function Style() {
  this.styles = [];
}
Style.prototype.onParse = function (node, vm) {
  // 获取样式
  if (node.name === 'style' && node.children.length && node.children[0].type === 'text') {
    this.styles = this.styles.concat(new _parser.default().parse(node.children[0].text));
  } else if (node.name) {
    // 匹配样式（对非文本标签）
    // 存储不同优先级的样式 name < class < id < 后代
    var matched = ['', '', '', ''];
    for (var i = 0, len = this.styles.length; i < len; i++) {
      var item = this.styles[i];
      var res = match(node, item.key || item.list[item.list.length - 1]);
      var j = void 0;
      if (res) {
        // 后代选择器
        if (!item.key) {
          j = item.list.length - 2;
          for (var k = vm.stack.length; j >= 0 && k--;) {
            // 子选择器
            if (item.list[j] === '>') {
              // 错误情况
              if (j < 1 || j > item.list.length - 2) break;
              if (match(vm.stack[k], item.list[j - 1])) {
                j -= 2;
              } else {
                j++;
              }
            } else if (match(vm.stack[k], item.list[j])) {
              j--;
            }
          }
          res = 4;
        }
        if (item.key || j < 0) {
          // 添加伪类
          if (item.pseudo && node.children) {
            var text = void 0;
            item.style = item.style.replace(/content:([^;]+)/, function (_, $1) {
              text = $1.replace(/['"]/g, '')
              // 处理 attr 函数
              .replace(/attr\((.+?)\)/, function (_, $1) {
                return node.attrs[$1.trim()] || '';
              })
              // 编码 \xxx
              .replace(/\\(\w{4})/, function (_, $1) {
                return String.fromCharCode(parseInt($1, 16));
              });
              return '';
            });
            var pseudo = {
              name: 'span',
              attrs: {
                style: item.style
              },
              children: [{
                type: 'text',
                text: text
              }]
            };
            if (item.pseudo === 'before') {
              node.children.unshift(pseudo);
            } else {
              node.children.push(pseudo);
            }
          } else {
            matched[res - 1] += item.style + (item.style[item.style.length - 1] === ';' ? '' : ';');
          }
        }
      }
    }
    matched = matched.join('');
    if (matched.length > 2) {
      node.attrs.style = matched + (node.attrs.style || '');
    }
  }
};

/**
 * @description 匹配样式
 * @param {object} node 要匹配的标签
 * @param {string|string[]} keys 选择器
 * @returns {number} 0：不匹配；1：name 匹配；2：class 匹配；3：id 匹配
 */
function match(node, keys) {
  function matchItem(key) {
    if (key[0] === '#') {
      // 匹配 id
      if (node.attrs.id && node.attrs.id.trim() === key.substr(1)) return 3;
    } else if (key[0] === '.') {
      // 匹配 class
      key = key.substr(1);
      var selectors = (node.attrs.class || '').split(' ');
      for (var i = 0; i < selectors.length; i++) {
        if (selectors[i].trim() === key) return 2;
      }
    } else if (node.name === key) {
      // 匹配 name
      return 1;
    }
    return 0;
  }

  // 多选择器交集
  if (keys instanceof Array) {
    var res = 0;
    for (var j = 0; j < keys.length; j++) {
      var tmp = matchItem(keys[j]);
      // 任意一个不匹配就失败
      if (!tmp) return 0;
      // 优先级最大的一个作为最终优先级
      if (tmp > res) {
        res = tmp;
      }
    }
    return res;
  }
  return matchItem(keys);
}
var _default = Style;
exports.default = _default;

/***/ }),
/* 207 */
/*!**************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/style/parser.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var blank = {
  ' ': true,
  '\n': true,
  '\t': true,
  '\r': true,
  '\f': true
};
function Parser() {
  this.styles = [];
  this.selectors = [];
}

/**
 * @description 解析 css 字符串
 * @param {string} content css 内容
 */
Parser.prototype.parse = function (content) {
  new Lexer(this).parse(content);
  return this.styles;
};

/**
 * @description 解析到一个选择器
 * @param {string} name 名称
 */
Parser.prototype.onSelector = function (name) {
  // 不支持的选择器
  if (name.includes('[') || name.includes('*') || name.includes('@')) return;
  var selector = {};
  // 伪类
  if (name.includes(':')) {
    var info = name.split(':');
    var pseudo = info.pop();
    if (pseudo === 'before' || pseudo === 'after') {
      selector.pseudo = pseudo;
      name = info[0];
    } else return;
  }

  // 分割交集选择器
  function splitItem(str) {
    var arr = [];
    var i, start;
    for (i = 1, start = 0; i < str.length; i++) {
      if (str[i] === '.' || str[i] === '#') {
        arr.push(str.substring(start, i));
        start = i;
      }
    }
    if (!arr.length) {
      return str;
    } else {
      arr.push(str.substring(start, i));
      return arr;
    }
  }

  // 后代选择器
  if (name.includes(' ')) {
    selector.list = [];
    var list = name.split(' ');
    for (var i = 0; i < list.length; i++) {
      if (list[i].length) {
        // 拆分子选择器
        var arr = list[i].split('>');
        for (var j = 0; j < arr.length; j++) {
          selector.list.push(splitItem(arr[j]));
          if (j < arr.length - 1) {
            selector.list.push('>');
          }
        }
      }
    }
  } else {
    selector.key = splitItem(name);
  }
  this.selectors.push(selector);
};

/**
 * @description 解析到选择器内容
 * @param {string} content 内容
 */
Parser.prototype.onContent = function (content) {
  // 并集选择器
  for (var i = 0; i < this.selectors.length; i++) {
    this.selectors[i].style = content;
  }
  this.styles = this.styles.concat(this.selectors);
  this.selectors = [];
};

/**
 * @description css 词法分析器
 * @param {object} handler 高层处理器
 */
function Lexer(handler) {
  this.selector = '';
  this.style = '';
  this.handler = handler;
}
Lexer.prototype.parse = function (content) {
  this.i = 0;
  this.content = content;
  this.state = this.blank;
  for (var len = content.length; this.i < len; this.i++) {
    this.state(content[this.i]);
  }
};
Lexer.prototype.comment = function () {
  this.i = this.content.indexOf('*/', this.i) + 1;
  if (!this.i) {
    this.i = this.content.length;
  }
};
Lexer.prototype.blank = function (c) {
  if (!blank[c]) {
    if (c === '/' && this.content[this.i + 1] === '*') {
      this.comment();
      return;
    }
    this.selector += c;
    this.state = this.name;
  }
};
Lexer.prototype.name = function (c) {
  if (c === '/' && this.content[this.i + 1] === '*') {
    this.comment();
    return;
  }
  if (c === '{' || c === ',' || c === ';') {
    this.handler.onSelector(this.selector.trimEnd());
    this.selector = '';
    if (c !== '{') {
      while (blank[this.content[++this.i]]) {
        ;
      }
    }
    if (this.content[this.i] === '{') {
      this.floor = 1;
      this.state = this.val;
    } else {
      this.selector += this.content[this.i];
    }
  } else if (blank[c]) {
    this.selector += ' ';
  } else {
    this.selector += c;
  }
};
Lexer.prototype.val = function (c) {
  if (c === '/' && this.content[this.i + 1] === '*') {
    this.comment();
    return;
  }
  if (c === '{') {
    this.floor++;
  } else if (c === '}') {
    this.floor--;
    if (!this.floor) {
      this.handler.onContent(this.style);
      this.style = '';
      this.state = this.blank;
      return;
    }
  }
  this.style += c;
};
var _default = Parser;
exports.default = _default;

/***/ }),
/* 208 */
/*!*****************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/img-cache/index.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 41));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 43));
var data = {
  name: 'imgcache',
  prefix: 'imgcache_'
};
function ImgCache(vm) {
  this.vm = vm; // 保存实例在其他周期使用
  this.i = 0; // 用于标记第几张图
  vm.imgCache = {
    get list() {
      return uni.getStorageInfoSync().keys.filter(function (key) {
        return key.startsWith(data.prefix);
      }).map(function (key) {
        return key.split(data.prefix)[1];
      });
    },
    get: function get(url) {
      return uni.getStorageSync(data.prefix + url);
    },
    delete: function _delete(url) {
      var path = uni.getStorageSync(data.prefix + url);
      if (!path) return false;
      plus.io.resolveLocalFileSystemURL(path, function (entry) {
        entry.remove();
      });
      uni.removeStorageSync(data.prefix + url);
      return true;
    },
    add: function add(url) {
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var filename;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return download(url);
              case 2:
                filename = _context.sent;
                if (!filename) {
                  _context.next = 6;
                  break;
                }
                uni.setStorageSync(data.prefix + url, filename);
                return _context.abrupt("return", 'file://' + plus.io.convertLocalFileSystemURL(filename));
              case 6:
                return _context.abrupt("return", null);
              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    clear: function clear() {
      uni.getStorageInfoSync().keys.filter(function (key) {
        return key.startsWith(data.prefix);
      }).forEach(function (key) {
        uni.removeStorageSync(key);
      });
      plus.io.resolveLocalFileSystemURL("_doc/".concat(data.name, "/"), function (entry) {
        entry.removeRecursively(function (entry) {
          console.log("".concat(data.name, "\u7F13\u5B58\u5220\u9664\u6210\u529F"), entry);
        }, function (e) {
          console.log("".concat(data.name, "\u7F13\u5B58\u5220\u9664\u5931\u8D25"), e);
        });
      });
    }
  };
}
var _default = ImgCache;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),
/* 209 */
/*!****************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/editable/index.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _config = _interopRequireDefault(__webpack_require__(/*! ./config */ 210));
var _parser = _interopRequireDefault(__webpack_require__(/*! ../parser */ 197));
/**
 * @fileoverview editable 插件
 */

function Editable(vm) {
  var _this = this;
  this.vm = vm;
  this.editHistory = []; // 历史记录
  this.editI = -1; // 历史记录指针
  vm._mask = []; // 蒙版被点击时进行的操作

  vm._setData = function (path, val) {
    var paths = path.split('.');
    var target = vm;
    for (var i = 0; i < paths.length - 1; i++) {
      target = target[paths[i]];
    }
    vm.$set(target, paths.pop(), val);
  };

  /**
   * @description 移动历史记录指针
   * @param {Number} num 移动距离
   */
  var move = function move(num) {
    setTimeout(function () {
      var item = _this.editHistory[_this.editI + num];
      if (item) {
        _this.editI += num;
        vm._setData(item.key, item.value);
      }
    }, 200);
  };
  vm.undo = function () {
    return move(-1);
  }; // 撤销
  vm.redo = function () {
    return move(1);
  }; // 重做

  /**
   * @description 更新记录
   * @param {String} path 更新内容路径
   * @param {*} oldVal 旧值
   * @param {*} newVal 新值
   * @param {Boolean} set 是否更新到视图
   * @private
   */
  vm._editVal = function (path, oldVal, newVal, set) {
    // 当前指针后的内容去除
    while (_this.editI < _this.editHistory.length - 1) {
      _this.editHistory.pop();
    }

    // 最多存储 30 条操作记录
    while (_this.editHistory.length > 30) {
      _this.editHistory.pop();
      _this.editI--;
    }
    var last = _this.editHistory[_this.editHistory.length - 1];
    if (!last || last.key !== path) {
      if (last) {
        // 去掉上一次的新值
        _this.editHistory.pop();
        _this.editI--;
      }
      // 存入这一次的旧值
      _this.editHistory.push({
        key: path,
        value: oldVal
      });
      _this.editI++;
    }

    // 存入本次的新值
    _this.editHistory.push({
      key: path,
      value: newVal
    });
    _this.editI++;

    // 更新到视图
    if (set) {
      vm._setData(path, newVal);
    }
  };

  /**
   * @description 获取菜单项
   * @private
   */
  vm._getItem = function (node, up, down) {
    var items;
    var i;
    if (node.name === 'img') {
      items = _config.default.img.slice(0);
      if (!vm.getSrc) {
        i = items.indexOf('换图');
        if (i !== -1) {
          items.splice(i, 1);
        }
        i = items.indexOf('超链接');
        if (i !== -1) {
          items.splice(i, 1);
        }
        i = items.indexOf('预览图');
        if (i !== -1) {
          items.splice(i, 1);
        }
      }
      i = items.indexOf('禁用预览');
      if (i !== -1 && node.attrs.ignore) {
        items[i] = '启用预览';
      }
    } else if (node.name === 'a') {
      items = _config.default.link.slice(0);
      if (!vm.getSrc) {
        i = items.indexOf('更换链接');
        if (i !== -1) {
          items.splice(i, 1);
        }
      }
    } else if (node.name === 'video' || node.name === 'audio') {
      items = _config.default.media.slice(0);
      i = items.indexOf('封面');
      if (!vm.getSrc && i !== -1) {
        items.splice(i, 1);
      }
      i = items.indexOf('循环');
      if (node.attrs.loop && i !== -1) {
        items[i] = '不循环';
      }
      i = items.indexOf('自动播放');
      if (node.attrs.autoplay && i !== -1) {
        items[i] = '不自动播放';
      }
    } else {
      items = _config.default.node.slice(0);
    }
    if (!up) {
      i = items.indexOf('上移');
      if (i !== -1) {
        items.splice(i, 1);
      }
    }
    if (!down) {
      i = items.indexOf('下移');
      if (i !== -1) {
        items.splice(i, 1);
      }
    }
    return items;
  };

  /**
   * @description 显示 tooltip
   * @param {object} obj
   * @private
   */
  vm._tooltip = function (obj) {
    vm.$set(vm, 'tooltip', {
      top: obj.top,
      items: obj.items
    });
    vm._tooltipcb = obj.success;
  };

  /**
   * @description 显示滚动条
   * @param {object} obj
   * @private
   */
  vm._slider = function (obj) {
    vm.$set(vm, 'slider', {
      min: obj.min,
      max: obj.max,
      value: obj.value,
      top: obj.top
    });
    vm._slideringcb = obj.changing;
    vm._slidercb = obj.change;
  };

  /**
   * @description 点击蒙版
   * @private
   */
  vm._maskTap = function () {
    // 隐藏所有悬浮窗
    while (vm._mask.length) {
      vm._mask.pop()();
    }
    if (vm.tooltip) {
      vm.$set(vm, 'tooltip', null);
    }
    if (vm.slider) {
      vm.$set(vm, 'slider', null);
    }
  };

  /**
   * @description 插入节点
   * @param {Object} node
   */
  function insert(node) {
    if (vm._edit) {
      vm._edit.insert(node);
    } else {
      var nodes = vm.nodes.slice(0);
      nodes.push(node);
      vm._editVal('nodes', vm.nodes, nodes, true);
    }
  }

  /**
   * @description 在光标处插入指定 html 内容
   * @param {String} html 内容
   */
  vm.insertHtml = function (html) {
    _this.inserting = true;
    var arr = new _parser.default(vm).parse(html);
    _this.inserting = undefined;
    for (var i = 0; i < arr.length; i++) {
      insert(arr[i]);
    }
  };

  /**
   * @description 在光标处插入图片
   */
  vm.insertImg = function () {
    vm.getSrc && vm.getSrc('img').then(function (src) {
      if (typeof src === 'string') {
        src = [src];
      }
      var parser = new _parser.default(vm);
      for (var i = 0; i < src.length; i++) {
        insert({
          name: 'img',
          attrs: {
            src: parser.getUrl(src[i])
          }
        });
      }
    }).catch(function () {});
  };

  /**
   * @description 在光标处插入一个链接
   */
  vm.insertLink = function () {
    vm.getSrc && vm.getSrc('link').then(function (url) {
      insert({
        name: 'a',
        attrs: {
          href: url
        },
        children: [{
          type: 'text',
          text: url
        }]
      });
    }).catch(function () {});
  };

  /**
   * @description 在光标处插入一个表格
   * @param {Number} rows 行数
   * @param {Number} cols 列数
   */
  vm.insertTable = function (rows, cols) {
    var table = {
      name: 'table',
      attrs: {
        style: 'display:table;width:100%;margin:10px 0;text-align:center;border-spacing:0;border-collapse:collapse;border:1px solid gray'
      },
      children: []
    };
    for (var i = 0; i < rows; i++) {
      var tr = {
        name: 'tr',
        attrs: {},
        children: []
      };
      for (var j = 0; j < cols; j++) {
        tr.children.push({
          name: 'td',
          attrs: {
            style: 'padding:2px;border:1px solid gray'
          },
          children: [{
            type: 'text',
            text: ''
          }]
        });
      }
      table.children.push(tr);
    }
    insert(table);
  };

  /**
   * @description 插入视频/音频
   * @param {Object} node
   */
  function insertMedia(node) {
    if (typeof node.src === 'string') {
      node.src = [node.src];
    }
    var parser = new _parser.default(vm);
    // 拼接主域名
    for (var i = 0; i < node.src.length; i++) {
      node.src[i] = parser.getUrl(node.src[i]);
    }
    insert({
      name: 'div',
      attrs: {
        style: 'text-align:center'
      },
      children: [node]
    });
  }

  /**
   * @description 在光标处插入一个视频
   */
  vm.insertVideo = function () {
    vm.getSrc && vm.getSrc('video').then(function (src) {
      insertMedia({
        name: 'video',
        attrs: {
          controls: 'T'
        },
        children: [],
        src: src
      });
    }).catch(function () {});
  };

  /**
   * @description 在光标处插入一个音频
   */
  vm.insertAudio = function () {
    vm.getSrc && vm.getSrc('audio').then(function (attrs) {
      var src;
      if (attrs.src) {
        src = attrs.src;
        attrs.src = undefined;
      } else {
        src = attrs;
        attrs = {};
      }
      attrs.controls = 'T';
      insertMedia({
        name: 'audio',
        attrs: attrs,
        children: [],
        src: src
      });
    }).catch(function () {});
  };

  /**
   * @description 在光标处插入一段文本
   */
  vm.insertText = function () {
    insert({
      name: 'p',
      attrs: {},
      children: [{
        type: 'text',
        text: ''
      }]
    });
  };

  /**
   * @description 清空内容
   */
  vm.clear = function () {
    vm._maskTap();
    vm._edit = undefined;
    vm.$set(vm, 'nodes', [{
      name: 'p',
      attrs: {},
      children: [{
        type: 'text',
        text: ''
      }]
    }]);
  };

  /**
   * @description 获取编辑后的 html
   */
  vm.getContent = function () {
    var html = '';
    // 递归遍历获取
    (function traversal(nodes, table) {
      for (var i = 0; i < nodes.length; i++) {
        var item = nodes[i];
        if (item.type === 'text') {
          html += item.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>').replace(/\xa0/g, '&nbsp;'); // 编码实体
        } else {
          if (item.name === 'img') {
            item.attrs.i = '';
            // 还原被转换的 svg
            if ((item.attrs.src || '').includes('data:image/svg+xml;utf8,')) {
              html += item.attrs.src.substr(24).replace(/%23/g, '#').replace('<svg', '<svg style="' + (item.attrs.style || '') + '"');
              continue;
            }
          } else if (item.name === 'video' || item.name === 'audio') {
            // 还原 video 和 audio 的 source
            item = JSON.parse(JSON.stringify(item));
            if (item.src.length > 1) {
              item.children = [];
              for (var j = 0; j < item.src.length; j++) {
                item.children.push({
                  name: 'source',
                  attrs: {
                    src: item.src[j]
                  }
                });
              }
            } else {
              item.attrs.src = item.src[0];
            }
          } else if (item.name === 'div' && (item.attrs.style || '').includes('overflow:auto') && (item.children[0] || {}).name === 'table') {
            // 还原滚动层
            item = item.children[0];
          }
          // 还原 table
          if (item.name === 'table') {
            item = JSON.parse(JSON.stringify(item));
            table = item.attrs;
            if ((item.attrs.style || '').includes('display:grid')) {
              item.attrs.style = item.attrs.style.split('display:grid')[0];
              var children = [{
                name: 'tr',
                attrs: {},
                children: []
              }];
              for (var _j = 0; _j < item.children.length; _j++) {
                item.children[_j].attrs.style = item.children[_j].attrs.style.replace(/grid-[^;]+;*/g, '');
                if (item.children[_j].r !== children.length) {
                  children.push({
                    name: 'tr',
                    attrs: {},
                    children: [item.children[_j]]
                  });
                } else {
                  children[children.length - 1].children.push(item.children[_j]);
                }
              }
              item.children = children;
            }
          }
          html += '<' + item.name;
          for (var attr in item.attrs) {
            var val = item.attrs[attr];
            if (!val) continue;
            if (val === 'T' || val === true) {
              // bool 型省略值
              html += ' ' + attr;
              continue;
            } else if (item.name[0] === 't' && attr === 'style' && table) {
              // 取消为了显示 table 添加的 style
              val = val.replace(/;*display:table[^;]*/, '');
              if (table.border) {
                val = val.replace(/border[^;]+;*/g, function ($) {
                  return $.includes('collapse') ? $ : '';
                });
              }
              if (table.cellpadding) {
                val = val.replace(/padding[^;]+;*/g, '');
              }
              if (!val) continue;
            }
            html += ' ' + attr + '="' + val.replace(/"/g, '&quot;') + '"';
          }
          html += '>';
          if (item.children) {
            traversal(item.children, table);
            html += '</' + item.name + '>';
          }
        }
      }
    })(vm.nodes);

    // 其他插件处理
    for (var i = vm.plugins.length; i--;) {
      if (vm.plugins[i].onGetContent) {
        html = vm.plugins[i].onGetContent(html) || html;
      }
    }
    return html;
  };
}
Editable.prototype.onUpdate = function (content, config) {
  var _this2 = this;
  if (this.vm.editable) {
    this.vm._maskTap();
    config.entities.amp = '&';
    if (!this.inserting) {
      this.vm._edit = undefined;
      if (!content) {
        setTimeout(function () {
          _this2.vm.$set(_this2.vm, 'nodes', [{
            name: 'p',
            attrs: {},
            children: [{
              type: 'text',
              text: ''
            }]
          }]);
        }, 0);
      }
    }
  }
};
Editable.prototype.onParse = function (node) {
  // 空白单元格可编辑
  if (this.vm.editable && (node.name === 'td' || node.name === 'th') && !this.vm.getText(node.children)) {
    node.children.push({
      type: 'text',
      text: ''
    });
  }
};
var _default = Editable;
exports.default = _default;

/***/ }),
/* 210 */
/*!*****************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/components/mp-html/editable/config.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// 以下项目可以删减或更换顺序，但不能添加或更改名字
var _default = {
  // 普通标签的菜单项
  node: ['大小', '斜体', '粗体', '下划线', '居中', '缩进', '上移', '下移', '删除'],
  // 图片的菜单项
  img: ['换图', '宽度', '超链接', '预览图', '禁用预览', '上移', '下移', '删除'],
  // 链接的菜单项
  link: ['更换链接', '上移', '下移', '删除'],
  // 音视频的菜单项
  media: ['封面', '循环', '自动播放', '上移', '下移', '删除']
};
exports.default = _default;

/***/ }),
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */
/*!***************************************************************************************************************************************!*\
  !*** E:/uniapp/SuperBot-ChatGPTApp-super-java17-3.0/Super003/uni_modules/uni-transition/components/uni-transition/createAnimation.js ***!
  \***************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimation = createAnimation;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// const defaultOption = {
// 	duration: 300,
// 	timingFunction: 'linear',
// 	delay: 0,
// 	transformOrigin: '50% 50% 0'
// }
var MPAnimation = /*#__PURE__*/function () {
  function MPAnimation(options, _this) {
    (0, _classCallCheck2.default)(this, MPAnimation);
    this.options = options;
    this.animation = uni.createAnimation(options);
    this.currentStepAnimates = {};
    this.next = 0;
    this.$ = _this;
  }
  (0, _createClass2.default)(MPAnimation, [{
    key: "_nvuePushAnimates",
    value: function _nvuePushAnimates(type, args) {
      var aniObj = this.currentStepAnimates[this.next];
      var styles = {};
      if (!aniObj) {
        styles = {
          styles: {},
          config: {}
        };
      } else {
        styles = aniObj;
      }
      if (animateTypes1.includes(type)) {
        if (!styles.styles.transform) {
          styles.styles.transform = '';
        }
        var unit = '';
        if (type === 'rotate') {
          unit = 'deg';
        }
        styles.styles.transform += "".concat(type, "(").concat(args + unit, ") ");
      } else {
        styles.styles[type] = "".concat(args);
      }
      this.currentStepAnimates[this.next] = styles;
    }
  }, {
    key: "_animateRun",
    value: function _animateRun() {
      var styles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var ref = this.$.$refs['ani'].ref;
      if (!ref) return;
      return new Promise(function (resolve, reject) {
        nvueAnimation.transition(ref, _objectSpread({
          styles: styles
        }, config), function (res) {
          resolve();
        });
      });
    }
  }, {
    key: "_nvueNextAnimate",
    value: function _nvueNextAnimate(animates) {
      var _this2 = this;
      var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var fn = arguments.length > 2 ? arguments[2] : undefined;
      var obj = animates[step];
      if (obj) {
        var styles = obj.styles,
          config = obj.config;
        this._animateRun(styles, config).then(function () {
          step += 1;
          _this2._nvueNextAnimate(animates, step, fn);
        });
      } else {
        this.currentStepAnimates = {};
        typeof fn === 'function' && fn();
        this.isEnd = true;
      }
    }
  }, {
    key: "step",
    value: function step() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.animation.step(config);
      return this;
    }
  }, {
    key: "run",
    value: function run(fn) {
      this.$.animationData = this.animation.export();
      this.$.timer = setTimeout(function () {
        typeof fn === 'function' && fn();
      }, this.$.durationTime);
    }
  }]);
  return MPAnimation;
}();
var animateTypes1 = ['matrix', 'matrix3d', 'rotate', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scale3d', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'translate', 'translate3d', 'translateX', 'translateY', 'translateZ'];
var animateTypes2 = ['opacity', 'backgroundColor'];
var animateTypes3 = ['width', 'height', 'left', 'right', 'top', 'bottom'];
animateTypes1.concat(animateTypes2, animateTypes3).forEach(function (type) {
  MPAnimation.prototype[type] = function () {
    var _this$animation;
    (_this$animation = this.animation)[type].apply(_this$animation, arguments);
    return this;
  };
});
function createAnimation(option, _this) {
  if (!_this) return;
  clearTimeout(_this.timer);
  return new MPAnimation(option, _this);
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map