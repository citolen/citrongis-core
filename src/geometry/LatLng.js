/*
 *  C.Geometry.LatLng   //TODO description
 */

'use strict';

C.Geometry.LatLng = C.Utils.Inherit(function (base, y, x) {

    base(x, y, undefined, C.Helpers.ProjectionsHelper.WGS84);

}, C.Geometry.Point, 'C.Geometry.LatLng');
