/*
 *  C.Geo.Feature.Polygon   //TODO description
 */

'use strict';

/**
 * Creates a georeferenced Polygon
 *
 * @class Polygon
 * @namespace C
 * @extends C.Feature
 * @constructor
 * @param {Object} options Data
 * @param {Array(C.Point)} options.locations Coordinates.
 * @param {Number} [options.width] Width in pixel.
 * @param {Number} [options.color] Color in hexa.
 * @param {Number} [options.outlineColor] Outline Color in hexa.
 * @param {Number} [options.outlineWidth] Outline Width in pixel.
 * @param {Number} [options.opacity] Opacity of the Circle.
 * @param {Object} [options.metadata] Dictionary of metadata.
 * @example
 *      var polygon = C.Polygon({
 *          locations: [C.LatLng(48, 2), C.LatLng(42, 2), C.LatLng(45, 6)],
 *          color: 0xBF4E6C,
 *          outlineColor: 0xff0000,
 *          outlineWidth: 5
 *      });
 */
C.Geo.Feature.Polygon = C.Utils.Inherit(function (base, options) {
    base(C.Geo.Feature.Feature.FeatureType.POLYGON, options);

    if (options === undefined || options.locations === undefined) {
        throw 'Invalid Arguments';
    }

    this._locations = options.locations;
    this._locationChanged = true;

    this._color = options.color || 0xffffff;

    this._outlineColor = options.outlineColor || 0;

    this._outlineWidth = options.outlineWidth || 0;

}, C.Geo.Feature.Feature, 'C.Geo.Feature.Polygon');

/*
 *  Constructor
 */
C.Geo.Feature.Polygon_ctr = function (args) {
    return C.Geo.Feature.Polygon.apply(this, args);
};
C.Geo.Feature.Polygon_ctr.prototype = C.Geo.Feature.Polygon.prototype;
C.Geo.Feature.Polygon_new_ctr = function () {
    return new C.Geo.Feature.Polygon_ctr(arguments);
};

/**
 * Returns the current locations or sets a new one if an argument is given.
 *
 * @method locations
 * @public
 * @param {Array(C.Point)} [locations] New coordinates.
 * @return {Array(C.Point)} Current or new location.
 */
C.Geo.Feature.Polygon.prototype.locations = function (locations) {
    if (locations == undefined || locations.constructor != Array) {
        return this._locations;
    }

    this._locations = locations;
    this._locationChanged = true;
    this.emit('locationsChanged', locations);
    this.makeDirty();
    return this._locations;
};

/**
 * Returns the current location or set a new one if an argument is given at a specific index.
 *
 * @method locationAt
 * @public
 * @param {Number} idx Index.
 * @param {C.Point} [location] New coordinates.
 * @return {C.Point} Current or new location.
 */
C.Geo.Feature.Polygon.prototype.locationAt = function (idx, location) {
    if (idx === undefined) {
        return (null);
    }
    if (idx !== undefined && location === undefined) {
        return this._locations[idx];
    }

    this._locations[idx] = location;
    this._locationChanged = true;
    this.emit('locationChanged', {idx: idx, location: location});
    this.makeDirty();
    return (location);
};

/**
 * Returns the current color or sets a new one if an argument is given.
 *
 * @method color
 * @public
 * @param {Number} [color] New color.
 * @return {Number} Current or new color.
 */
C.Geo.Feature.Polygon.prototype.color = function (color) {
    if (color == undefined || this._color === color) {
        return this._color;
    }

    this._color = color;
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
C.Geo.Feature.Polygon.prototype.outlineColor = function (outlineColor) {
    if (outlineColor == undefined || this._outlineColor === outlineColor) {
        return this._outlineColor;
    }

    this._outlineColor = outlineColor;
    this.emit('outlineColorChanged', outlineColor);
    this.makeDirty();
    return this._outlineColor;
};

/**
 * Returns the current outline width or sets a new one if an argument is given.
 *
 * @method outlineWidth
 * @public
 * @param {Number} [outlineWidth] New outline width.
 * @return {Number} Current or new outline width.
 */
C.Geo.Feature.Polygon.prototype.outlineWidth = function (outlineWidth) {
    if (outlineWidth == undefined || this._outlineWidth === outlineWidth) {
        return this._outlineWidth;
    }

    this._outlineWidth = outlineWidth;
    this.emit('outlineWidthChanged', outlineWidth);
    this.makeDirty();
    return this._outlineWidth;
};

/**
 * Returns the bounds of the polygon.
 *
 * @method getBounds
 * @public
 * @return {C.Bounds} Bounds of the polygon.
 */
C.Geo.Feature.Polygon.prototype.getBounds = function () {
    var bounds = new C.Geometry.Bounds();
    for (var i = 0; i < this._locations.length; ++i) {
        bounds.extend(this._locations[i]);
    }
    return bounds;
};
