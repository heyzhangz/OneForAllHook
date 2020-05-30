(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-property"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});

var color_1 = require("../lib/color");

function hook_class_methods(clazz) {
  var clazzInstance = Java.use(clazz);
  var uniqueMethods = clazzInstance["class"].getDeclaredMethods().map(function (method) {
    // perform a cleanup of the method. An example after toGenericString() would be:
    // public void android.widget.ScrollView.draw(android.graphics.Canvas) throws Exception
    // public final rx.c.b<java.lang.Throwable> com.apple.android.music.icloud.a.a(rx.c.b<java.lang.Throwable>)
    var m = method.toGenericString(); // Remove generics from the method

    while (m.includes("<")) {
      m = m.replace(/<.*?>/g, "");
    } // remove any "Throws" the method may have


    if (m.indexOf(" throws ") !== -1) {
      m = m.substring(0, m.indexOf(" throws "));
    } // remove scope and return type declarations (aka: first two words)
    // remove the class name
    // remove the signature and return


    m = m.slice(m.lastIndexOf(" "));
    m = m.replace(" ".concat(clazz, "."), "");
    return m.split("(")[0];
  }).filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
  uniqueMethods.forEach(function (method) {
    clazzInstance[method].overloads.forEach(function (m) {
      // get the argument types for this overload
      var calleeArgTypes = m.argumentTypes.map(function (arg) {
        return arg.className;
      });
      send("Hooking ".concat(color_1.colors.green(clazz), ".").concat(color_1.colors.greenBright(method), "(").concat(color_1.colors.red(calleeArgTypes.join(", ")), ")")); // replace the implementation of this method
      // tslint:disable-next-line:only-arrow-functions

      m.implementation = function () {
        send("Called ".concat(color_1.colors.green(clazz), ".").concat(color_1.colors.greenBright(m.methodName), "(").concat(color_1.colors.red(calleeArgTypes.join(", ")), ")")); // actually run the intended method

        return m.apply(this, arguments);
      };
    });
  });
}

Java.perform(function () {
  if (Java.available) {
    console.log('[+] JVM load success');
    var target_class_name = 'android.location.LocationManager';
    hook_class_methods(target_class_name);
  }
});

},{"../lib/color":2,"@babel/runtime-corejs2/core-js/object/define-property":3,"@babel/runtime-corejs2/helpers/interopRequireDefault":4}],2:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-property"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.colors = void 0;
var colors;

(function (colors) {
  var base = "\x1B[%dm";
  var reset = "\x1B[39m";

  colors.black = function (message) {
    return colors.ansify(30, message);
  };

  colors.blue = function (message) {
    return colors.ansify(34, message);
  };

  colors.cyan = function (message) {
    return colors.ansify(36, message);
  };

  colors.green = function (message) {
    return colors.ansify(32, message);
  };

  colors.magenta = function (message) {
    return colors.ansify(35, message);
  };

  colors.red = function (message) {
    return colors.ansify(31, message);
  };

  colors.white = function (message) {
    return colors.ansify(37, message);
  };

  colors.yellow = function (message) {
    return colors.ansify(33, message);
  };

  colors.blackBright = function (message) {
    return colors.ansify(90, message);
  };

  colors.redBright = function (message) {
    return colors.ansify(91, message);
  };

  colors.greenBright = function (message) {
    return colors.ansify(92, message);
  };

  colors.yellowBright = function (message) {
    return colors.ansify(93, message);
  };

  colors.blueBright = function (message) {
    return colors.ansify(94, message);
  };

  colors.cyanBright = function (message) {
    return colors.ansify(96, message);
  };

  colors.whiteBright = function (message) {
    return colors.ansify(97, message);
  }; // return an ansified string


  colors.ansify = function (color) {
    for (var _len = arguments.length, msg = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      msg[_key - 1] = arguments[_key];
    }

    return base.replace("%d", color.toString()) + msg.join("") + reset;
  }; // tslint:disable-next-line:no-eval


  colors.clog = function (color) {
    for (var _len2 = arguments.length, msg = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      msg[_key2 - 1] = arguments[_key2];
    }

    return eval("console").log(colors.ansify.apply(colors, [color].concat(msg)));
  }; // tslint:disable-next-line:no-eval


  colors.log = function () {
    for (var _len3 = arguments.length, msg = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      msg[_key3] = arguments[_key3];
    }

    return eval("console").log(msg.join(""));
  }; // log based on a quiet flag


  colors.qlog = function (quiet) {
    if (quiet === false) {
      for (var _len4 = arguments.length, msg = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        msg[_key4 - 1] = arguments[_key4];
      }

      colors.log.apply(colors, msg);
    }
  };
})(colors = exports.colors || (exports.colors = {}));

},{"@babel/runtime-corejs2/core-js/object/define-property":3,"@babel/runtime-corejs2/helpers/interopRequireDefault":4}],3:[function(require,module,exports){
module.exports = require("core-js/library/fn/object/define-property");
},{"core-js/library/fn/object/define-property":5}],4:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],5:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/_core":8,"../../modules/es6.object.define-property":22}],6:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],7:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":18}],8:[function(require,module,exports){
var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],9:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":6}],10:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":13}],11:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":14,"./_is-object":18}],12:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":8,"./_ctx":9,"./_global":14,"./_has":15,"./_hide":16}],13:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],14:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],15:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],16:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":10,"./_object-dp":19,"./_property-desc":20}],17:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":10,"./_dom-create":11,"./_fails":13}],18:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],19:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":7,"./_descriptors":10,"./_ie8-dom-define":17,"./_to-primitive":21}],20:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],21:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":18}],22:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":10,"./_export":12,"./_object-dp":19}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZ2VudC9pbmRleC50cyIsImxpYi9jb2xvci50cyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS1jb3JlanMyL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS1jb3JlanMyL2hlbHBlcnMvaW50ZXJvcFJlcXVpcmVEZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUNBQSxJQUFBLE9BQUEsR0FBQSxPQUFBLENBQUEsY0FBQSxDQUFBOztBQUNBLFNBQVMsa0JBQVQsQ0FBNEIsS0FBNUIsRUFBeUM7QUFDeEMsTUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQXBCO0FBQ0EsTUFBTSxhQUFhLEdBQWEsYUFBYSxTQUFiLENBQW9CLGtCQUFwQixHQUF5QyxHQUF6QyxDQUE2QyxVQUFDLE1BQUQsRUFBaUI7QUFDdkY7QUFDQTtBQUNBO0FBQ0YsUUFBSSxDQUFDLEdBQVcsTUFBTSxDQUFDLGVBQVAsRUFBaEIsQ0FKeUYsQ0FLdkY7O0FBQ0EsV0FBTyxDQUFDLENBQUMsUUFBRixDQUFXLEdBQVgsQ0FBUCxFQUF3QjtBQUFFLE1BQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFGLENBQVUsUUFBVixFQUFvQixFQUFwQixDQUFKO0FBQThCLEtBTitCLENBUXZGOzs7QUFDQSxRQUFJLENBQUMsQ0FBQyxPQUFGLENBQVUsVUFBVixNQUEwQixDQUFDLENBQS9CLEVBQWtDO0FBQUUsTUFBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQUYsQ0FBWSxDQUFaLEVBQWUsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxVQUFWLENBQWYsQ0FBSjtBQUE0QyxLQVRPLENBV3ZG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QWQsRUFBcUI7QUFBQSx5Q0FEaUIsR0FDakI7QUFEaUIsUUFBQSxHQUNqQjtBQUFBOztBQUNuQixNQUFBLE1BQUEsQ0FBQSxHQUFBLE9BQUEsTUFBQSxFQUFPLEdBQVAsQ0FBQTtBQUNEO0FBQ0YsR0FKWTtBQUtkLENBcENELEVBQWlCLE1BQU0sR0FBTixPQUFBLENBQUEsTUFBQSxLQUFBLE9BQUEsQ0FBQSxNQUFBLEdBQU0sRUFBTixDQUFqQjs7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIifQ==
