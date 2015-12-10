/*
 *  C.Utils.Extends //TODO description
 */

'use strict';

C.Utils.Extends = function (dest) {
    var i, j, len, src;

    for (j = 1, len = arguments.length; j < len; ++j) {
        src = arguments[j];
        for (i in src) {
            dest[i] = src[i];
        }
    }
    return dest;
};

C.Utils.Inherit = function (constructor, classToInherit, name) {
    var _;
    if (name === undefined) {
        _ = function () {
            var args1 = new Array(arguments.length);
            for (var i = 0, l = arguments.length; i < l; ++i) {
                args1[i] = arguments[i];
            }
            var self = this;
            var baseInit = false;
            var base = function () {
                baseInit = true;
                classToInherit.apply(self, arguments);
            };
            args1 = [base].concat(args1);
            constructor.apply(this, args1);
            if (!baseInit) {
                classToInherit.apply(this, arguments);
            }
        };
    } else {
        _ = eval(name + ' = function () {\
var args1 = new Array(arguments.length);\
for (var i = 0, l = arguments.length; i < l; ++i) {\
args1[i] = arguments[i];\
}\
var self = this;\
var baseInit = false;\
var base = function () {\
baseInit = true;\
classToInherit.apply(self, arguments);\
};\
args1 = [base].concat(args1);\
constructor.apply(this, args1);\
if (!baseInit) {\
classToInherit.apply(this, arguments);\
}};');
    }
    var o = Object.create(classToInherit.prototype);
    C.Utils.Extends(o, constructor.prototype);
    _.prototype = o;
    _.prototype.constructor = _;
    return (_);
};
