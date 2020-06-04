(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-property"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.hooking = void 0;

var color_1 = require("../lib/color");

var hooking;

(function (hooking) {
  function hook_class_methods(clazz, trace_flag) {
    var clazzInstance = Java.use(clazz);
    var throwable = Java.use("java.lang.Throwable");
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
        console.log("Hooking ".concat(color_1.colors.green(clazz), ".").concat(color_1.colors.greenBright(method), "(").concat(color_1.colors.red(calleeArgTypes.join(", ")), ")")); // replace the implementation of this method
        // tslint:disable-next-line:only-arrow-functions

        m.implementation = function () {
          console.log("Called ".concat(color_1.colors.green(clazz), ".").concat(color_1.colors.greenBright(m.methodName), "(").concat(color_1.colors.red(calleeArgTypes.join(", ")), ")")); // if (trace_flag) {
          //   console.log("\t" + throwable.$new().getStackTrace().map((trace_element:any) => trace_element.toString() + "\n\t").join(""))
          // }

          var ts = new Date().getTime();
          var report = {};
          report['timestamp'] = ts;
          report['callee'] = clazz + '.' + m.methodName;
          report['argTypes'] = calleeArgTypes.join(", ");

          if (trace_flag) {
            report['backtrace'] = throwable.$new().getStackTrace().map(function (trace_element) {
              return trace_element.toString() + "\n\t";
            }).join("");
          }

          send((0, _stringify["default"])(report, null)); // actually run the intended method

          return m.apply(this, arguments);
        };
      });
    });
  }

  hooking.hook_class_methods = hook_class_methods;

  function hook_target_methods(clazz, method_name, trace_flag) {
    var clazzInstance = Java.use(clazz);
    var throwable = Java.use("java.lang.Throwable");
    var uniqueMethods = clazzInstance["class"].getDeclaredMethods().map(function (method) {
      var m = method.toGenericString();

      while (m.includes("<")) {
        m = m.replace(/<.*?>/g, "");
      }

      if (m.indexOf(" throws ") !== -1) {
        m = m.substring(0, m.indexOf(" throws "));
      }

      m = m.slice(m.lastIndexOf(" "));
      m = m.replace(" ".concat(clazz, "."), "");
      return m.split("(")[0];
    }).filter(function (value, index, self) {
      return self.indexOf(value) === index;
    });
    uniqueMethods.forEach(function (method) {
      if (method == method_name) {
        clazzInstance[method].overloads.forEach(function (m) {
          // get the argument types for this overload
          var calleeArgTypes = m.argumentTypes.map(function (arg) {
            return arg.className;
          });
          console.log("Hooking ".concat(color_1.colors.green(clazz), ".").concat(color_1.colors.greenBright(method), "(").concat(color_1.colors.red(calleeArgTypes.join(", ")), ")"));

          m.implementation = function () {
            console.log("Called ".concat(color_1.colors.green(clazz), ".").concat(color_1.colors.greenBright(m.methodName), "(").concat(color_1.colors.red(calleeArgTypes.join(", ")), ")"));
            var ts = new Date().getTime();
            var report = {};
            report['timestamp'] = ts;
            report['callee'] = clazz + '.' + m.methodName;
            report['argTypes'] = calleeArgTypes.join(", ");

            if (trace_flag) {
              report['backtrace'] = throwable.$new().getStackTrace().map(function (trace_element) {
                return trace_element.toString() + "\n\t";
              }).join("");
            }

            send((0, _stringify["default"])(report, null)); // actually run the intended method

            return m.apply(this, arguments);
          };
        });
      }
    });
  }

  hooking.hook_target_methods = hook_target_methods;
})(hooking = exports.hooking || (exports.hooking = {}));

},{"../lib/color":4,"@babel/runtime-corejs2/core-js/json/stringify":5,"@babel/runtime-corejs2/core-js/object/define-property":6,"@babel/runtime-corejs2/helpers/interopRequireDefault":7}],2:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-property"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});

var scenario_1 = require("./scenario");

Java.perform(function () {
  if (Java.available) {
    console.log('[+] JVM load success'); // locationReleatedHook(true);

    scenario_1.cameraReleatedHook(false);
    scenario_1.audioReleatedHook(false);
    scenario_1.life_cycle_hook(false);
  }
});

},{"./scenario":3,"@babel/runtime-corejs2/core-js/object/define-property":6,"@babel/runtime-corejs2/helpers/interopRequireDefault":7}],3:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-property"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.life_cycle_hook = exports.audioReleatedHook = exports.locationReleatedHook = exports.cameraReleatedHook = void 0;

var hook_1 = require("./hook");

function cameraReleatedHook(trace_flag) {
  var target_classes;
  target_classes = ['android.hardware.Camera', 'android.hardware.camera2.CameraManager', 'android.hardware.camera2.CaptureResult', 'android.hardware.camera2.CaptureRequest', 'android.hardware.camera2.impl.CameraDeviceImpl'];
  target_classes.forEach(function (clazz) {
    hook_1.hooking.hook_class_methods(clazz, trace_flag);
  });
}

exports.cameraReleatedHook = cameraReleatedHook;

function locationReleatedHook(trace_flag) {
  var target_classes;
  target_classes = ['android.location.LocationManager', 'android.telephony.TelephonyManager', 'android.location.LocationManager$GnssStatusListenerTransport$1', 'android.location.LocationManager$GnssStatusListenerTransport$GnssHandler'];
  target_classes.forEach(function (clazz) {
    hook_1.hooking.hook_class_methods(clazz, trace_flag);
  });
}

exports.locationReleatedHook = locationReleatedHook;

function audioReleatedHook(trace_flag) {
  var target_classes;
  target_classes = ['android.media.MediaPlayer', 'android.media.AudioTrack', 'android.media.PlayerBase', 'android.speech.tts.TextToSpeech'];
  target_classes.forEach(function (clazz) {
    hook_1.hooking.hook_class_methods(clazz, trace_flag);
  });
}

exports.audioReleatedHook = audioReleatedHook;

function life_cycle_hook(trace_flag) {
  var target_classes;
  target_classes = ['android.app.Activity', 'android.app.Service'];
  target_classes.forEach(function (clazz) {
    hook_1.hooking.hook_target_methods(clazz, 'onCreate', trace_flag); // h.hook_class_methods(clazz, false);
  });
}

exports.life_cycle_hook = life_cycle_hook;

},{"./hook":1,"@babel/runtime-corejs2/core-js/object/define-property":6,"@babel/runtime-corejs2/helpers/interopRequireDefault":7}],4:[function(require,module,exports){
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

},{"@babel/runtime-corejs2/core-js/object/define-property":6,"@babel/runtime-corejs2/helpers/interopRequireDefault":7}],5:[function(require,module,exports){
module.exports = require("core-js/library/fn/json/stringify");
},{"core-js/library/fn/json/stringify":8}],6:[function(require,module,exports){
module.exports = require("core-js/library/fn/object/define-property");
},{"core-js/library/fn/object/define-property":9}],7:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],8:[function(require,module,exports){
var core = require('../../modules/_core');
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};

},{"../../modules/_core":12}],9:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/_core":12,"../../modules/es6.object.define-property":26}],10:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],11:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":22}],12:[function(require,module,exports){
var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],13:[function(require,module,exports){
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

},{"./_a-function":10}],14:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":17}],15:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":18,"./_is-object":22}],16:[function(require,module,exports){
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

},{"./_core":12,"./_ctx":13,"./_global":18,"./_has":19,"./_hide":20}],17:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],18:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],19:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],20:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":14,"./_object-dp":23,"./_property-desc":24}],21:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":14,"./_dom-create":15,"./_fails":17}],22:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],23:[function(require,module,exports){
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

},{"./_an-object":11,"./_descriptors":14,"./_ie8-dom-define":21,"./_to-primitive":25}],24:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],25:[function(require,module,exports){
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

},{"./_is-object":22}],26:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":14,"./_export":16,"./_object-dp":23}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZ2VudC9ob29rLnRzIiwiYWdlbnQvaW5kZXgudHMiLCJhZ2VudC9zY2VuYXJpby50cyIsImxpYi9jb2xvci50cyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS1jb3JlanMyL2NvcmUtanMvanNvbi9zdHJpbmdpZnkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUtY29yZWpzMi9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUtY29yZWpzMi9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vanNvbi9zdHJpbmdpZnkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2EtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0FBLElBQUEsT0FBQSxHQUFBLE9BQUEsQ0FBQSxjQUFBLENBQUE7O0FBRUEsSUFBaUIsT0FBakI7O0FBQUEsQ0FBQSxVQUFpQixPQUFqQixFQUF3QjtBQUNwQixXQUFnQixrQkFBaEIsQ0FBbUMsS0FBbkMsRUFBa0QsVUFBbEQsRUFBcUU7QUFDakUsUUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQXBCO0FBQ0EsUUFBTSxTQUFTLEdBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxxQkFBVCxDQUE3QjtBQUNBLFFBQU0sYUFBYSxHQUFhLGFBQWEsU0FBYixDQUFvQixrQkFBcEIsR0FBeUMsR0FBekMsQ0FBNkMsVUFBQyxNQUFELEVBQWlCO0FBQzFGO0FBQ0E7QUFDQTtBQUNJLFVBQUksQ0FBQyxHQUFXLE1BQU0sQ0FBQyxlQUFQLEVBQWhCLENBSnNGLENBSzFGOztBQUNBLGFBQU8sQ0FBQyxDQUFD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akI7QUFBQTs7QUFDbkIsTUFBQSxNQUFBLENBQUEsR0FBQSxPQUFBLE1BQUEsRUFBTyxHQUFQLENBQUE7QUFDRDtBQUNGLEdBSlk7QUFLZCxDQXBDRCxFQUFpQixNQUFNLEdBQU4sT0FBQSxDQUFBLE1BQUEsS0FBQSxPQUFBLENBQUEsTUFBQSxHQUFNLEVBQU4sQ0FBakI7OztBQ0FBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiJ9
