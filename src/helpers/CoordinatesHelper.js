/*
 *  C.Helpers.CoordinatesHelper //TODO description
 */

'use strict';

/**
 * Coordinates Helper
 *
 * @class CoordinatesHelper
 * @namespace C
 */

/**
 * Transform a point to another CRS
 *
 * @method TransformTo
 * @public
 * @param {C.Point} point Point to convert.
 * @param {Proj4} to CRS.
 * @return {C.Point} New point.
 */
C.Helpers.CoordinatesHelper.TransformTo = function (point, to) {
    if (point.CRS == to) {
        return (new C.Geometry.Point(point.X, point.Y, point.Z, point.CRS));
    }

    var tmp = proj4(point.CRS, to, [point.X, point.Y]);
    return (new C.Geometry.Point(tmp[0], tmp[1], point.Z, C.Helpers.CoordinatesHelper._checkProj(to)));
};

/**
 * Transform a vector2 from a CRS to another CRS
 *
 * @method TransformVector2D
 * @public
 * @param {C.Vecotr2} point Point to convert.
 * @param {Proj4} from CRS.
  * @param {Proj4} to CRS.
 * @return {C.Vector2} New point.
 */
C.Helpers.CoordinatesHelper.TransformVector2D = function (point, from, to) {
    var tmp = proj4(from, to, [point.X, point.Y]);
    return new C.Geometry.Vector2(tmp[0], tmp[1]);
};

C.Helpers.CoordinatesHelper._checkProj = function (item) {
    if (item === undefined) {
        return (item);
    } else if (item instanceof proj4.Proj) {
        return (item);
    } else if (item.oProj) {
        return (item.oProj);
    }
    return (new proj4.Proj(item));
};
