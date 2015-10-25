/*
 *  BoundedLayer.js //TODO description
 */

'use strict';

/**
 * Creates a Bounded layer. Same as a C.Layer but only feature in the viewport are added to the map.
 *
 * @class BoundedLayer
 * @namespace C
 * @extend C.Layer
 * @constructor
 * @example
 *      var bLayer = C.BoundedLayer();
 *      bLayer.add(feature);
 */
C.Geo.BoundedLayer = C.Utils.Inherit(function (base, options) {
    options = options || {};
    base(options);

    this._insideFeature = [];
    this._outsideFeature = [];

    this._refresh = this.refresh.bind(this);

}, C.Geo.Layer, 'C.Geo.BoundedLayer');

/*
 *  Constructor
 */
C.Geo.BoundedLayer_ctr = function (args) {
    return C.Geo.BoundedLayer.apply(this, args);
};
C.Geo.BoundedLayer_ctr.prototype = C.Geo.BoundedLayer.prototype;
C.Geo.BoundedLayer_new_ctr = function () {
    return new C.Geo.BoundedLayer_ctr(arguments);
};

C.Geo.BoundedLayer.prototype.__added = function () {
    C.Helpers.viewport.on('moved', this._refresh);
    C.Geo.Layer.prototype.__added.apply(this, arguments);
    this.refresh(C.Helpers.viewport);
};

C.Geo.BoundedLayer.prototype.__removed = function () {
    C.Helpers.viewport.off('moved', this._refresh);
    C.Geo.Layer.prototype.__removed.apply(this, arguments);
};

C.Geo.BoundedLayer.prototype.refresh = function (viewport) {
    var new_inside = [];
    var new_outside = [];
    var viewportBounds = viewport.getBounds();
    for (var i = 0; i < this._insideFeature.length; ++i) {
        var feature = this._insideFeature[i];
        if (!viewportBounds.intersect(feature.getBounds())) {
            C.Geo.Layer.prototype.remove.call(this, feature);
            new_outside.push(feature);
        } else {
            new_inside.push(feature);
        }
    }
    for (var i = 0; i < this._outsideFeature.length; ++i) {
        var feature = this._outsideFeature[i];
        if (viewportBounds.intersect(feature.getBounds())) {
            C.Geo.Layer.prototype.add.call(this, feature);
            new_inside.push(feature);
        } else {
            new_outside.push(feature);
        }
    }
    this._insideFeature = new_inside;
    this._outsideFeature = new_outside;
};

C.Geo.BoundedLayer.prototype.remove = function (feature) {

    var idx = this._insideFeature.indexOf(feature);
    var idx_ = this._outsideFeature.indexOf(feature);

    if (idx !== -1) { this._insideFeature.splice(idx, 1); }
    if (idx_ !== -1) { this._outsideFeature.splice(idx_, 1); }

    C.Geo.Layer.prototype.remove.call(this, feature);
};
C.Geo.BoundedLayer.prototype.removeLayer = C.Geo.BoundedLayer.prototype.removeFeature = C.Geo.BoundedLayer.prototype.remove;

C.Geo.BoundedLayer.prototype.add = function (feature) {

    var bounds = feature.getBounds();

    if (!bounds) { return false; }

    var viewportBounds = C.Helpers.viewport.getBounds();

    if (viewportBounds.intersect(bounds)) {
        C.Geo.Layer.prototype.add.call(this, feature);
        this._insideFeature.push(feature);
    } else {
        this._outsideFeature.push(feature);
    }
};

C.Geo.BoundedLayer.prototype.addLayer = C.Geo.BoundedLayer.prototype.addFeature = C.Geo.BoundedLayer.prototype.add;
