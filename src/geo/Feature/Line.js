/*
 *  C.Geo.Feature.Line  //TODO description
 */

'use strict';

C.Geo.Feature.Line = C.Utils.Inherit(function (base, options) {
    base(C.Geo.Feature.Feature.FeatureType.LINE, options);

    if (options === undefined || options.locations === undefined) {
        throw 'Invalid Arguments';
    }

    this._locations = options.locations;
    this._locationChanged = true;

    this._lineWidth = options.lineWidth || 1;

    this._lineColor = options.lineColor || '#000000';

}, C.Geo.Feature.Feature, 'C.Geo.Feature.Line');

C.Geo.Feature.Line.prototype.locations = function (locations) {
    if (locations === undefined || typeof locations !== 'Array') {
        return this._locations;
    }

    this._locations = locations;
    this._locationChanged = true;
    this.emit('locationsChanged', locations);
    this.makeDirty();
    return this._locations;
};

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

C.Geo.Feature.Line.prototype.lineWidth = function (lineWidth) {
    if (lineWidth === undefined || typeof lineWidth !== 'Number' || this._lineWidth === lineWidth) {
        return this._lineWidth;
    }

    this._lineWidth = lineWidth;
    this.emit('lineWidthChanged', lineWidth);
    this.makeDirty();
    return this._lineWidth;
};

C.Geo.Feature.Line.prototype.lineColor = function (lineColor) {
    if (lineColor === undefined || typeof lineColor !== 'Array' || this._lineColor === lineColor) {
        return this._lineColor;
    }

    this._lineColor = lineColor;
    this.emit('lineColorChanged', lineColor);
    this.makeDirty();
    return this._lineColor;
};
