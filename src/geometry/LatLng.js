/*
 *  C.Geometry.LatLng   //TODO description
 */

'use strict';

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
