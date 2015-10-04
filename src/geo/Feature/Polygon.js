/*
 *  C.Geo.Feature.Polygon   //TODO description
 */

'use strict';

C.Geo.Feature.Polygon = C.Utils.Inherit(function (base, options) {
    base(C.Geo.Feature.Feature.FeatureType.POLYGON, options);

    if (options === undefined || options.locations === undefined) {
        throw 'Invalid Arguments';
    }

    this._locations = options.locations;
    this._locationChanged = true;

    this._fillColor = options.fillColor || 0xffffff;

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

C.Geo.Feature.Polygon.prototype.fillColor = function (fillColor) {
    if (fillColor == undefined || this._fillColor === fillColor) {
        return this._fillColor;
    }

    this._fillColor = fillColor;
    this.emit('fillColorChanged', fillColor);
    this.makeDirty();
    return this._fillColor;
};

C.Geo.Feature.Polygon.prototype.outlineColor = function (outlineColor) {
    if (outlineColor == undefined || this._outlineColor === outlineColor) {
        return this._outlineColor;
    }

    this._outlineColor = outlineColor;
    this.emit('outlineColorChanged', outlineColor);
    this.makeDirty();
    return this._outlineColor;
};

C.Geo.Feature.Polygon.prototype.outlineWidth = function (outlineWidth) {
    if (outlineWidth == undefined || this._outlineWidth === outlineWidth) {
        return this._outlineWidth;
    }

    this._outlineWidth = outlineWidth;
    this.emit('outlineWidthChanged', outlineWidth);
    this.makeDirty();
    return this._outlineWidth;
};
