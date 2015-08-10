/*
 *  C.Utils.Comparison  //TODO description
 */

'use strict';

C.Utils.Comparison.kEpsilon = 1E-5;

C.Utils.Comparison.Equals = function (a, b) {
    return (Math.abs(a - b) < C.Utils.Comparison.kEpsilon);
};
