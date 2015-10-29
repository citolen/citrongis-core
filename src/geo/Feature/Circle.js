/*
 *  C.Geo.Feature.Circle //TODO description
 */

'use strict';

/**
 * Creates a georeferenced Circle
 *
 * @class Circle
 * @namespace C
 * @extends C.Feature
 * @constructor
 * @param {Object} options Data
 * @param {C.Point} options.location Coordinates.
 * @param {Number} [options.radius] Radius in pixel.
 * @param {Number} [options.color] Color in hexa.
 * @param {Number} [options.outlineColor] Outline Color in hexa.
 * @param {Number} [options.outlineWidth] Outline Width in pixel.
 * @param {Number} [options.opacity] Opacity of the Circle.
 * @param {Object} [options.metadata] Dictionary of metadata.
 * @example
 *      var circle = C.Circle({
 *          location: C.LatLng(0, 0),
 *          radius: 10,
 *          color: 0x000000,
 *          outlineColor: 0xff,
 *          outlineWidth: 3
 *      });
 */
C.Geo.Feature.Circle = C.Utils.Inherit(function (base, options) {
    base(C.Geo.Feature.Feature.FeatureType.CIRCLE, options);

    if (options === undefined || options.location == undefined) {
        throw 'Invalid Argument';
    }

    this._location = options.location;

    this._locationChanged = false;

    this._radius = options.radius || 1;

    this._color = options.color || 0x000000;

    this._outlineColor = options.outlineColor || 0xffffff;

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
    COLOR: 8,
    OUTLINECOLOR: 16,
    OUTLINEWIDTH: 32
};

/**
 * Returns the current location or sets a new one if an argument is given.
 *
 * @method location
 * @public
 * @param {C.Point} [location] New coordinates of the Circle.
 * @return {C.Point} Current or new location.
 */
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

/**
 * Returns the current radius or sets a new one if an argument is given.
 *
 * @method radius
 * @public
 * @param {Number} [radius] New radius of the Circle.
 * @return {Number} Current or new radius.
 */
C.Geo.Feature.Circle.prototype.radius = function (radius) {
    if (radius === undefined || (typeof radius !== 'number') || this._radius == radius) {
        return this._radius;
    }

    this._radius = radius;
    this._mask |= C.Geo.Feature.Circle.MaskIndex.RADIUS;
    this.emit('radiusChanged', radius);
    this.makeDirty();
    return this._radius;
};

/**
 * Returns the current color or sets a new one if an argument is given.
 *
 * @method color
 * @public
 * @param {Number} [color] New color of the Circle.
 * @return {Number} Current or new color.
 */
C.Geo.Feature.Circle.prototype.color = function (color) {
    if (color === undefined || this._color == color) {
        return this._color;
    }

    this._color = color;
    this._mask |= C.Geo.Feature.Circle.MaskIndex.COLOR;
    this.emit('colorChanged', color);
    this.makeDirty();
    return this._color;
};

/**
 * Returns the current outline color or sets a new one if an argument is given.
 *
 * @method outlineColor
 * @public
 * @param {Number} [outlineColor] New outline color.
 * @return {Number} Current or new outline color.
 */
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

/**
 * Returns the current outline width or sets a new one if an argument is given.
 *
 * @method outlineWidth
 * @public
 * @param {Number} [outlineWidth] New radius of the outline width.
 * @return {Number} Current or new outline width.
 */
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

/**
 * Returns the bounds of the circle.
 *
 * @method getBounds
 * @public
 * @return {C.Bounds} Bounds of the circle.
 */
C.Geo.Feature.Circle.prototype.getBounds = function () {
    return new C.Geometry.Bounds(this._location);
};
