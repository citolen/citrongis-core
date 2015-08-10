/*
 *  C.Geometry.BoundingBox  //TODO description
 */

'use strict';

C.Geometry.BoundingBox = function (bottomLeft, topLeft, topRight, bottomRight) {
    this._bottomLeft = bottomLeft || new C.Geometry.Vector2();

    this._topLeft = topLeft || new C.Geometry.Vector2();

    this._topRight = topRight || new C.Geometry.Vector2();

    this._bottomRight = bottomRight || new C.Geometry.Vector2();
};

C.Geometry.BoundingBox.prototype.toString = function () {
    return ("{ BottomLeft:" + this._bottomLeft + ", TopLeft:" + this._topLeft + ", TopRight:" + this._topRight + ", BottomRight:" + this._bottomRight + "}");
};

C.Geometry.BoundingBox.prototype.Equals = function (b) {
    if (this._bottomLeft.Equals(b._bottomLeft) &&
            this._bottomRight.Equals(b._bottomRight) &&
            this._topLeft.Equals(b._topLeft) &&
            this._topRight.Equals(b._topRight)) {
        return (true);
    }
    return (false);
};

C.Geometry.BoundingBox.prototype.minX = function () {
    return (Math.min(this._bottomLeft.X, Math.min(this._topLeft.X, Math.min(this._topRight.X, this._bottomRight.X))));
};

C.Geometry.BoundingBox.prototype.maxX = function () {
    return (Math.max(this._bottomLeft.X, Math.max(this._topLeft.X, Math.max(this._topRight.X, this._bottomRight.X))));
};

C.Geometry.BoundingBox.prototype.minY = function () {
    return (Math.min(this._bottomLeft.Y, Math.min(this._topLeft.Y, Math.min(this._topRight.Y, this._bottomRight.Y))));
};

C.Geometry.BoundingBox.prototype.maxY = function () {
    return (Math.max(this._bottomLeft.Y, Math.max(this._topLeft.Y, Math.max(this._topRight.Y, this._bottomRight.Y))));
};

C.Geometry.BoundingBox.prototype.Center = function () {
    var x = (this._bottomLeft.X + this._bottomRight.X + this._topLeft.X + this._topRight.X) / 4.0,
        y = (this._bottomLeft.Y + this._bottomRight.Y + this._topLeft.Y + this._topRight.Y) / 4.0;
    return (new C.Geometry.Vector2(x, y));
};

C.Geometry.BoundingBox.prototype.Intersect = function (o) {
    if (o instanceof C.Geometry.BoundingBox) {
        if (C.Utils.Intersection.IsPointInsideRectangle(this._topLeft, this._topRight, this._bottomRight, this._bottomLeft, o._topLeft) ||
                C.Utils.Intersection.IsPointInsideRectangle(this._topLeft, this._topRight, this._bottomRight, this._bottomLeft, o._topRight) ||
                C.Utils.Intersection.IsPointInsideRectangle(this._topLeft, this._topRight, this._bottomRight, this._bottomLeft, o._bottomRight) ||
                C.Utils.Intersection.IsPointInsideRectangle(this._topLeft, this._topRight, this._bottomRight, this._bottomLeft, o._bottomLeft)) {
            return (true);
        }
        return (false);
    } else {
        return (C.Utils.Intersection.IsPointInsideRectangle(this._topLeft, this._topRight, this._bottomRight, this._bottomLeft, o));
    }
};
