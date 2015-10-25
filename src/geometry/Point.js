/*
 *  C.Geometry.Point    //TODO description
 */

'use strict';

/**
 * Creates a georeferenced Point (not a representable feature)
 *
 * @class Point
 * @namespace C
 * @constructor
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [z]
 * @param {Proj4} [crs]
 * @example
 *      var point = C.Point(48, 3, 0, C.ProjectionsHelper.WGS84);
 */
C.Geometry.Point = function (x, y, z, crs) {

    this.X = x || 0.0;

    this.Y = y || 0.0;

    this.Z = z || 0.0;

    this.CRS = C.Helpers.CoordinatesHelper._checkProj(crs);
};

/*
 *  Constructor
 */
C.Geometry.Point_ctr = function (args) {
    return C.Geometry.Point.apply(this, args);
};
C.Geometry.Point_ctr.prototype = C.Geometry.Point.prototype;
C.Geometry.Point_new_ctr = function () {
    return new C.Geometry.Point_ctr(arguments);
};

C.Geometry.Point.prototype.toString = function () {
    return ("{ x: " + this.X + ", y: " + this.Y + ", z: " + this.Z + ", CRS: " + (this.CRS.name || this.CRS.title || this.CRS) + "}");
};

/**
 * Make a copy of this point
 *
 * @method copy
 * @public
 * @return {C.Point} Copy
 */
C.Geometry.Point.prototype.copy = function () {
    return new C.Geometry.Point(this.X, this.Y, this.Z, this.CRS);
};

/**
 * Transform this point to another projection
 *
 * @method TransformTo
 * @public
 * @param {Proj4} to Projection to transform to.
 * @return {C.Point} this
 */
C.Geometry.Point.prototype.TransformTo = function (to) {
    var tmp = C.Helpers.CoordinatesHelper.TransformTo(this, to);
    this.X = tmp.X;
    this.Y = tmp.Y;
    this.Z = tmp.Z;
    this.CRS = tmp.CRS;
    return (this);
};
