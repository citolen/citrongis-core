/*
 *  C.Geo.Feature.Line  //TODO description
 */

'use strict';

/**
 * Creates a georeferenced Line
 *
 * @class Line
 * @namespace C
 * @extends C.Feature
 * @constructor
 * @param {Object} options Data
 * @param {Array(C.Point)} options.locations Coordinates.
 * @param {Number} [options.width] Width in pixel.
 * @param {Number} [options.color] Color in hexa.
 * @param {Number} [options.opacity] Opacity of the Circle.
 * @param {Object} [options.metadata] Dictionary of metadata.
 * @example
 *      var line = C.Line({
 *          locations: [C.LatLng(48, 2), C.LatLng(42, 2)],
 *          color: 0xBF4E6C,
 *          width: 8
 *      });
 */
C.Geo.Feature.Line = C.Utils.Inherit(function (base, options) {
    base(C.Geo.Feature.Feature.FeatureType.LINE, options);

    if (options === undefined || options.locations === undefined) {
        throw 'Invalid Arguments';
    }

    this._locations = options.locations;
    this._locationChanged = true;

    this._width = options.width || 1;

    this._color = options.color || 0x000000;

}, C.Geo.Feature.Feature, 'C.Geo.Feature.Line');

/*
 *  Constructor
 */
C.Geo.Feature.Line_ctr = function (args) {
    return C.Geo.Feature.Line.apply(this, args);
};
C.Geo.Feature.Line_ctr.prototype = C.Geo.Feature.Line.prototype;
C.Geo.Feature.Line_new_ctr = function () {
    return new C.Geo.Feature.Line_ctr(arguments);
};

/**
 * Returns the current locations or sets a new one if an argument is given.
 *
 * @method locations
 * @public
 * @param {Array(C.Point)} [locations] New coordinates.
 * @return {Array(C.Point)} Current or new location.
 */
C.Geo.Feature.Line.prototype.locations = function (locations) {
    if (locations === undefined || locations.constructor !== Array) {
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
C.Geo.Feature.Line.prototype.locationAt = function (idx, location) {
    if (idx === undefined) {
        return (null);
    }
    if (idx !== undefined && location === undefined) {
        return this._locations[idx];
    }

    this._locations[idx] = location;
    this.emit('locationChanged', {idx: idx, location: location});
    this.makeDirty();
    return (location);
};

/**
 * Returns the current width or sets a new one if an argument is given.
 *
 * @method width
 * @public
 * @param {Number} [width] New width.
 * @return {Number} Current or new width.
 */
C.Geo.Feature.Line.prototype.width = function (width) {
    if (width === undefined || typeof width !== 'Number' || this._width === width) {
        return this._width;
    }

    this._width = width;
    this.emit('widthChanged', width);
    this.makeDirty();
    return this._width;
};

/**
 * Returns the current color or sets a new one if an argument is given.
 *
 * @method color
 * @public
 * @param {Number} [color] New color.
 * @return {Number} Current or new color.
 */
C.Geo.Feature.Line.prototype.color = function (color) {
    if (color === undefined || typeof color !== 'Array' || this._color === color) {
        return this._color;
    }

    this._color = color;
    this.emit('colorChanged', color);
    this.makeDirty();
    return this._color;
};

/**
 * Returns the bounds of the line.
 *
 * @method getBounds
 * @public
 * @return {C.Bounds} Bounds of the line.
 */
C.Geo.Feature.Line.prototype.getBounds = function () {
    var bounds = new C.Geometry.Bounds();
    for (var i = 0; i < this._locations.length; ++i) {
        bounds.extend(this._locations[i]);
    }
    return bounds;
};
