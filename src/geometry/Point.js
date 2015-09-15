/*
 *  C.Geometry.Point    //TODO description
 */

'use strict';

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

C.Geometry.Point.prototype.copy = function () {
    return new C.Geometry.Point(this.X, this.Y, this.Z, this.CRS);
};

C.Geometry.Point.prototype.TransformTo = function (to) {
    var tmp = C.Helpers.CoordinatesHelper.TransformTo(this, to);
    this.X = tmp.X;
    this.Y = tmp.Y;
    this.Z = tmp.Z;
    this.CRS = tmp.CRS;
    return (this);
};
