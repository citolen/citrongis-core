/*
 *  C.Geometry.Vector2  //TODO description
 */

'use strict';

C.Geometry.Vector2 = function (x, y) {
    this.X = x || 0.0;

    this.Y = y || 0.0;
};

/*
 *  Constructor
 */
C.Geometry.Vector2_ctr = function (args) {
    return C.Geometry.Vector2.apply(this, args);
};
C.Geometry.Vector2_ctr.prototype = C.Geometry.Vector2.prototype;
C.Geometry.Vector2_new_ctr = function () {
    return new C.Geometry.Vector2_ctr(arguments);
};

C.Geometry.Vector2.prototype.rotateAround = function (rotation, center) {
    var cosAngle = Math.cos(rotation);
    var sinAngle = Math.sin(rotation);

    var x = this.X - center.X;
    var y = this.Y - center.Y;
    var tmp = x;
    x = x * cosAngle - y * sinAngle;
    y = tmp * sinAngle + y * cosAngle;
    this.X = x + center.X;
    this.Y = y + center.Y;
};

C.Geometry.Vector2.prototype.Distance = function (vb) {
    return (Math.sqrt(Math.pow(this.X - vb.X, 2) +
                      Math.pow(this.Y - vb.Y, 2)));
};

C.Geometry.Vector2.prototype.Equals = function (vb) {
    if (C.Utils.Comparison.Equals(this.X, vb.X) && C.Utils.Comparison.Equals(this.Y, vb.Y)) {
        return (true);
    }
    return (false);
};

C.Geometry.Vector2.prototype.DotProduct = function (vb) {
    return (this.X * vb.X + this.Y * vb.Y);
};

C.Geometry.Vector2.prototype.toString = function () {
    return ("{ x:" + this.X + ", y:" + this.Y + " }");
};

C.Geometry.Vector2.Distance = function (va, vb) {
    return (va.Distance(vb));
};

C.Geometry.Vector2.Equals = function (va, vb) {
    return (va.Equals(vb));
};

C.Geometry.Vector2.DotProduct = function (va, vb) {
    return (va.DotProduct(vb));
};
