/*
 *  Bounds  //TODO add description
 */

'use strict';

C.Geometry.Bounds = function (bottomLeft, topRight) {

    this._bottomLeft;
    this._topRight;
    this._crs;

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

C.Geometry.Bounds.prototype.getCenter = function () {
    if (!this._bottomLeft || !this._topRight) {
        return new C.Geometry.Vector2(0,0);
    }
    return new C.Geometry.Vector2(
        (this._bottomLeft.X + this._topRight.X) / 2,
        (this._bottomLeft.Y + this._topRight.Y) / 2);
};

C.Geometry.Bounds.prototype.intersect = function (bounds) {

    var bottomLeft = this._bottomLeft;
    var topRight = this._topRight;

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
