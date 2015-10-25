/*
 *  Bounds  //TODO add description
 */

'use strict';

/**
 * Creates bounds
 *
 * @class Bounds
 * @namespace C
 * @constructor
 * @param {C.Vector2} [bottomLeft] BottomLeft coordinates.
 * @param {C.Vector2} [topRight] TopRight coordinates.
 * @param {Proj4} [crs] Coordinates Reference System.
 */
C.Geometry.Bounds = function (bottomLeft, topRight, crs) {

    this._bottomLeft;
    this._topRight;
    this._crs = crs;

    if (bottomLeft) {
        this.extend(bottomLeft);
    }
    if (topRight) {
        this.extend(topRight);
    }
};

/*
 *  Constructor
 */
C.Geometry.Bounds_ctr = function (args) {
    return C.Geometry.Bounds.apply(this, args);
};
C.Geometry.Bounds_ctr.prototype = C.Geometry.Bounds.prototype;
C.Geometry.Bounds_new_ctr = function () {
    return new C.Geometry.Bounds_ctr(arguments);
};

/**
 * Extend the bounds with a C.Point or C.Bounds
 *
 * @method extend
 * @public
 * @param {C.Point,C.Bounds} bounds New coordinates.
 */
C.Geometry.Bounds.prototype.extend = function (bounds) {
    if (bounds instanceof C.Geometry.Point || bounds instanceof C.Geometry.Vector2) {
        if (!this._bottomLeft || !this._topRight) {
            this._bottomLeft = new C.Geometry.Vector2(bounds.X, bounds.Y);
            this._topRight = new C.Geometry.Vector2(bounds.X, bounds.Y);
        } else {
            this._bottomLeft.X = Math.min(this._bottomLeft.X, bounds.X);
            this._bottomLeft.Y = Math.min(this._bottomLeft.Y, bounds.Y);
            this._topRight.X = Math.max(this._topRight.X, bounds.X);
            this._topRight.Y = Math.max(this._topRight.Y, bounds.Y);
        }
        if (!this._crs && bounds.CRS) {
            this._crs = bounds.CRS;
        }
    } else if (bounds instanceof C.Geometry.Bounds) {
        if (!bounds._bottomLeft || !bounds._topRight) {
            return;
        }
        if (!this._bottomLeft || !this._topRight) {
            this._bottomLeft =  new C.Geometry.Vector2(bounds._bottomLeft.X,
                                                       bounds._bottomLeft.Y);
            this._topRight =    new C.Geometry.Vector2(bounds._topRight.X,
                                                       bounds._topRight.Y);
        } else {
            this._bottomLeft.X =    Math.min(this._bottomLeft.X, bounds._bottomLeft.X);
            this._bottomLeft.Y =    Math.min(this._bottomLeft.Y, bounds._bottomLeft.Y);
            this._topRight.X =      Math.max(this._topRight.X, bounds._topRight.X);
            this._topRight.Y =      Math.max(this._topRight.Y, bounds._topRight.Y);
        }
        if (!this._crs && bounds._crs) {
            this._crs = bounds._crs;
        }
    }
};

/**
 * Returns new bounds converted to the correct crs
 *
 * @method extend
 * @public
 * @param {Proj4} crsDest CRS to transform to.
 */
C.Geometry.Bounds.prototype.transformTo = function (crsDest) {
    if (!this._bottomLeft || !this._topRight) { return undefined; }

    var bottomLeft = C.Helpers.CoordinatesHelper.TransformVector2D(this._bottomLeft,
                                                                   this._crs, crsDest);
    var topRight = C.Helpers.CoordinatesHelper.TransformVector2D(this._topRight,
                                                                 this._crs, crsDest);

    return new C.Geometry.Bounds(bottomLeft, topRight, crsDest);
};

/**
 * Returns the center of the bounds
 *
 * @method getCenter
 * @public
 * @return {C.Vector2} Current or new location.
 */
C.Geometry.Bounds.prototype.getCenter = function () {
    if (!this._bottomLeft || !this._topRight) {
        return new C.Geometry.Vector2(0,0);
    }
    return new C.Geometry.Vector2(
        (this._bottomLeft.X + this._topRight.X) / 2,
        (this._bottomLeft.Y + this._topRight.Y) / 2);
};

/**
 * Clamp bounds to an extent
 *
 * @method clamp
 * @public
 * @param {C.Extent} extent Extent to clamp to.
 */
C.Geometry.Bounds.prototype.clamp = function (extent) {
    if (this._bottomLeft.X < extent._minX) { this._bottomLeft.X = extent._minX; }
    if (this._bottomLeft.X > extent._maxX) { this._bottomLeft.X = extent._maxX; }
    if (this._topRight.X < extent._minX) { this._topRight.X = extent._minX; }
    if (this._topRight.X > extent._maxX) { this._topRight.X = extent._maxX; }
    if (this._bottomLeft.Y < extent._minY) { this._bottomLeft.Y = extent._minY; }
    if (this._bottomLeft.Y > extent._maxY) { this._bottomLeft.Y = extent._maxY; }
    if (this._topRight.Y < extent._minY) { this._topRight.Y = extent._minY; }
    if (this._topRight.Y > extent._maxY) { this._topRight.Y = extent._maxY; }
};

/**
 * Check if bounds intersect
 *
 * @method intersect
 * @public
 * @param {C.Bounds} bounds Bounds to intersect to.
 * @return {Boolean} True if it intersects, false otherwise.
 */
C.Geometry.Bounds.prototype.intersect = function (bounds) {

    var bottomLeft = this._bottomLeft;
    var topRight = this._topRight;

    if (!bounds._bottomLeft || !bounds._topRight) {
        return false;
    }

    if (bounds._crs != this._crs) {
        bottomLeft = C.Helpers.CoordinatesHelper.TransformVector2D(bottomLeft,
                                                                   this._crs, bounds._crs);
        topRight = C.Helpers.CoordinatesHelper.TransformVector2D(topRight,
                                                                 this._crs, bounds._crs);
    }

    if (bounds._bottomLeft.X > topRight.X || bottomLeft.X > bounds._topRight.X) {
        return false;
    }
    if (bounds._topRight.Y < bottomLeft.Y || topRight.Y < bounds._bottomLeft.Y) {
        return false;
    }
    return true;
};
