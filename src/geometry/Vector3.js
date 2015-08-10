/*
 *  C.Geometry.Vector3  //TODO description
 */

'use strict';

C.Geometry.Vector3 = function (x, y, z) {
    this.X = x || 0.0;

    this.Y = y || 0.0;

    this.Z = z || 0.0;
};

C.Geometry.Vector3.prototype.Distance = function (vb) {
    return (Math.sqrt(Math.pow(this.X - vb.X, 2) +
                      Math.pow(this.Y - vb.Y, 2) +
                      Math.pow(this.Z - vb.Z, 2)));
};

C.Geometry.Vector3.prototype.Equals = function (vb) {
    if (C.Utils.Comparison.Equals(this.X, vb.X) &&
            C.Utils.Comparison.Equals(this.Y, vb.Y) &&
            C.Utils.Comparison.Equals(this.Z, vb.Z)) {
        return (true);
    }
    return (false);
};

C.Geometry.Vector3.prototype.DotProduct = function (vb) {
    return (this.X * vb.X + this.Y * vb.Y + this.Z * vb.Z);
};

C.Geometry.Vector3.prototype.Cross = function (vb) {
    return (new C.Geometry.Vector3(
        (this.Y * vb.Z) - (this.Z * vb.Y),
        (this.Z * vb.X) - (this.X * vb.Z),
        (this.X * vb.Y) - (this.Y * vb.X)
    ));
};

C.Geometry.Vector3.prototype.toString = function () {
    return ("{ x:" + this.X + ", y:" + this.Y + ", z:" + this.Z + "}");
};

C.Geometry.Vector3.Distance = function (va, vb) {
    return (va.Distance(vb));
};

C.Geometry.Vector3.Equals = function (va, vb) {
    return (va.Equals(vb));
};

C.Geometry.Vector3.DotProduct = function (va, vb) {
    return (va.DotProduct(vb));
};

C.Geometry.Vector3.prototype.Cross = function (va, vb) {
    return (new C.Geometry.Vector3(
        (va.Y * vb.Z) - (va.Z * vb.Y),
        (va.Z * vb.X) - (va.X * vb.Z),
        (va.X * vb.Y) - (va.Y * vb.X)
    ));
};
