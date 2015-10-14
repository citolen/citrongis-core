/*
 *  C.Geo.Feature.Circle //TODO description
 */

'use strict';

C.Geo.Feature.Circle = C.Utils.Inherit(function (base, options) {
    base(C.Geo.Feature.Feature.FeatureType.CIRCLE, options);

    if (options === undefined || options.location == undefined) {
        throw 'Invalid Argument';
    }

    this._location = options.location;

    this._locationChanged = false;

    this._radius = options.radius || 1;

    this._backgroundColor = options.backgroundColor || '#000000';

    this._outlineColor = options.outlineColor || '#ffffff';

    this._outlineWidth = options.outlineWidth || 0;

}, C.Geo.Feature.Feature, 'C.Geo.Feature.Circle');

/*
 *  Constructor
 */
C.Geo.Feature.Circle_ctr = function (args) {
    return C.Geo.Feature.Circle.apply(this, args);
};
C.Geo.Feature.Circle_ctr.prototype = C.Geo.Feature.Circle.prototype;
C.Geo.Feature.Circle_new_ctr = function () {
    return new C.Geo.Feature.Circle_ctr(arguments);
};

C.Geo.Feature.Circle.MaskIndex = {
    LOCATION: 2,
    RADIUS: 4,
    BACKGROUNDCOLOR: 8,
    OUTLINECOLOR: 16,
    OUTLINEWIDTH: 32
};

C.Geo.Feature.Circle.prototype.location = function (location) {
    if (location === undefined || location instanceof C.Geometry.Point === false) {
        return this._location;
    }

    this._location = location;
    this._locationChanged = true;
    this._mask |= C.Geo.Feature.Circle.MaskIndex.LOCATION;
    this.emit('locationChanged', location);
    this.makeDirty();
    return this._location;
};

C.Geo.Feature.Circle.prototype.radius = function (radius) {
    if (radius === undefined || (typeof radius !== 'Number' && typeof radius !== 'Object') || this._radius == radius) {
        return this._radius;
    }

    this._radius = radius;
    this._mask |= C.Geo.Feature.Circle.MaskIndex.RADIUS;
    this.emit('radiusChanged', radius);
    this.makeDirty();
    return this._radius;
};

C.Geo.Feature.Circle.prototype.backgroundColor = function (backgroundColor) {
    if (backgroundColor === undefined || this._backgroundColor == backgroundColor) {
        return this._backgroundColor;
    }

    this._backgroundColor = backgroundColor;
    this._mask |= C.Geo.Feature.Circle.MaskIndex.BACKGROUNDCOLOR;
    this.emit('backgroundColorChanged', backgroundColor);
    this.makeDirty();
    return this._backgroundColor;
};

C.Geo.Feature.Circle.prototype.outlineColor = function (outlineColor) {
    if (outlineColor === undefined || this._outlineColor == outlineColor) {
        return this._outlineColor;
    }

    this._outlineColor = outlineColor;
    this._mask |= C.Geo.Feature.Circle.MaskIndex.OUTLINECOLOR;
    this.emit('outlineColorChanged', outlineColor);
    this.makeDirty();
    return this._outlineColor;
};

C.Geo.Feature.Circle.prototype.outlineWidth = function (outlineWidth) {
    if (outlineWidth === undefined || this._outlineWidth == outlineWidth) {
        return this._outlineWidth;
    }

    this._outlineWidth = outlineWidth;
    this._mask |= C.Geo.Feature.Circle.MaskIndex.OUTLINEWIDTH;
    this.emit('outlineWidthChanged', outlineWidth);
    this.makeDirty();
    return this._outlineWidth;
};

C.Geo.Feature.Circle.prototype.getBounds = function () {
    return new C.Geometry.Bounds(this._location);
};
