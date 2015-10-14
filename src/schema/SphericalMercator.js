/*
 *  C.Schema.SphericalMercator //TODO description
 */

'use strict';

C.Schema.SphericalMercator = C.Utils.Inherit(function (base) {
    base({
        name: 'SphericalMercator',
        crs: C.Helpers.ProjectionsHelper.EPSG3857,
        originX: -20037508.342789,
        originY: -20037508.342789,
        extent: new C.Geometry.Extent(-20037508.342789,
                                      -20037508.342789,
                                      20037508.342789,
                                      20037508.342789),
        resolutions: [156543.033900000, 78271.516950000, 39135.758475000, 19567.879237500,
                      9783.939618750, 4891.969809375, 2445.984904688, 1222.992452344,
                      611.496226172, 305.748113086, 152.874056543, 76.437028271,
                      38.218514136, 19.109257068, 9.554628534, 4.777314267,
                      2.388657133, 1.194328567, 0.597164283]
    });

}, C.Schema.SchemaBase, 'C.Schema.SphericalMercator');

C.Schema.SphericalMercator.prototype.translate = function (viewport, tx, ty) {
    if (!C.Utils.Comparison.Equals(viewport._rotation, 0)) { // Rotate translation
        var cosAngle = Math.cos(viewport._rotation);
        var sinAngle = Math.sin(viewport._rotation);

        var tmp = tx;
        tx = tx * cosAngle - ty * sinAngle;
        ty = tmp * sinAngle + ty * cosAngle;
    }

    var mx = viewport._resolution * tx; // m/px * px -> m
    var my = viewport._resolution * ty; // m/px * px -> m, inverted Y

    viewport._origin.X -= mx;
    viewport._origin.Y += my;
};

C.Schema.SphericalMercator.prototype.rotate = function (viewport, angle) {
    var pid = 2*Math.PI;
    viewport._rotation = (viewport._rotation + (angle * Math.PI / 180) + pid) % pid;
};

C.Schema.SphericalMercator.prototype.update = function (viewport) {
    // combine origin, screen size, resolution

    var halfScreenMX = (viewport._resolution * viewport._width) / 2; // screen width in m
    var halfScreenMY = (viewport._resolution * viewport._height) / 2; // screen height in m;

    if (!C.Utils.Comparison.Equals(viewport._rotation, 0)) {
        var cosAngle = Math.cos(-viewport._rotation);
        var sinAngle = Math.sin(-viewport._rotation);

        var CosX = halfScreenMX * cosAngle;
        var SinX = halfScreenMX * sinAngle;
        var CosY = halfScreenMY * cosAngle;
        var SinY = halfScreenMY * sinAngle;

        viewport._bbox._bottomLeft.X = (-CosX) + SinY + viewport._origin.X;//*Signe simplification
        viewport._bbox._bottomLeft.Y = (-SinX) - CosY + viewport._origin.Y;//*Signe simplification

        viewport._bbox._topLeft.X = (-CosX) - SinY + viewport._origin.X;
        viewport._bbox._topLeft.Y = (-SinX) + CosY + viewport._origin.Y;

        viewport._bbox._topRight.X = CosX - SinY + viewport._origin.X;
        viewport._bbox._topRight.Y = SinX + CosY + viewport._origin.Y;

        viewport._bbox._bottomRight.X = CosX + SinY + viewport._origin.X;
        viewport._bbox._bottomRight.Y = SinX - CosY + viewport._origin.Y;
    } else {
        viewport._bbox._bottomLeft.X = viewport._origin.X - halfScreenMX;
        viewport._bbox._bottomLeft.Y = viewport._origin.Y - halfScreenMY;

        viewport._bbox._topLeft.X = viewport._origin.X - halfScreenMX;
        viewport._bbox._topLeft.Y = viewport._origin.Y + halfScreenMY;

        viewport._bbox._topRight.X = viewport._origin.X + halfScreenMX;
        viewport._bbox._topRight.Y = viewport._origin.Y + halfScreenMY;

        viewport._bbox._bottomRight.X = viewport._origin.X + halfScreenMX;
        viewport._bbox._bottomRight.Y = viewport._origin.Y - halfScreenMY;
    }
};

C.Schema.SphericalMercator.prototype.screenToWorld = function (viewport, px, py) {
    var dx = -(viewport._width / 2 - px);
    var dy = (viewport._height / 2 - py);
    dx *= viewport._resolution; // to meter
    dy *= viewport._resolution; // to meter;

    if (!C.Utils.Comparison.Equals(viewport._rotation, 0)) {
        var cosAngle = Math.cos(-viewport._rotation);
        var sinAngle = Math.sin(-viewport._rotation);

        var tmp = dx;
        dx = dx * cosAngle - dy * sinAngle;
        dy = tmp * sinAngle + dy * cosAngle;
    }

    dx += viewport._origin.X; // replace relative to origin
    dy += viewport._origin.Y; // replace relative to origin
    return (new C.Geometry.Vector2(dx, dy));
};

C.Schema.SphericalMercator.prototype.worldToScreen = function (viewport, wx, wy) {
    var dx = wx - viewport._origin.X;
    var dy = -(wy - viewport._origin.Y);

    if (!C.Utils.Comparison.Equals(viewport._rotation, 0)) {
        var cosAngle = Math.cos(-viewport._rotation);
        var sinAngle = Math.sin(-viewport._rotation);

        var tmp = dx;
        dx = dx * cosAngle - dy * sinAngle;
        dy = tmp * sinAngle + dy * cosAngle;
    }

    dx /= viewport._resolution; // to pixel
    dy /= viewport._resolution;
    dx += viewport._width / 2;
    dy += viewport._height / 2;
    return (new C.Geometry.Vector2(dx, dy));
};
