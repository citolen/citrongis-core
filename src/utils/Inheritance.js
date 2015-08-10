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
            var self = this;
            var baseInit = false;
            var base = function () {
                baseInit = true;
                classToInherit.apply(self, arguments);
            };
            var args = [base].concat(Array.prototype.slice.call(arguments));
            constructor.apply(this, args);
            if (!baseInit) {
                classToInherit.apply(this, arguments);
            }
        };
    } else {
        _ = eval(name + ' = function () {\
var self = this;\
var baseInit = false;\
var base = function () {\
baseInit = true;\
classToInherit.apply(self, arguments);\
};\
var args = [base].concat(Array.prototype.slice.call(arguments));\
constructor.apply(this, args);\
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
