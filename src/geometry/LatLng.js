/*
 *  C.Geometry.LatLng   //TODO description
 */

'use strict';

/**
 * Creates a georeferenced Point using latitude, longitude coordinates
 *
 * @class LatLng
 * @namespace C
 * @extend C.Point
 * @constructor
 * @param {Number} [latitude]
 * @param {Number} [longitude]
 * @example
 *      var point = C.LatLng(48, 3);
 */
C.Geometry.LatLng = C.Utils.Inherit(function (base, y, x) {

    base(x, y, undefined, C.Helpers.ProjectionsHelper.WGS84);

}, C.Geometry.Point, 'C.Geometry.LatLng');

/*
 *  Constructor
 */
C.Geometry.LatLng_ctr = function (args) {
    return C.Geometry.LatLng.apply(this, args);
};
C.Geometry.LatLng_ctr.prototype = C.Geometry.LatLng.prototype;
C.Geometry.LatLng_new_ctr = function () {
    return new C.Geometry.LatLng_ctr(arguments);
};
