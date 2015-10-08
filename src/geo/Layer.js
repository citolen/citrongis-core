/*
 *  C.Geo.Layer //TODO description
 */

'use strict';

C.Geo.Layer = C.Utils.Inherit(function (base, options) {
    base();

    options = options || {};

    this._opacity =             options.opacity || 1.0;
    this._features =            [];
    this._dirty =               false;
    this._featureDirty =        FeatureDirty.bind(this);
    this._layerDirty =          LayerDirty.bind(this);
    this._layerFeatureChange =  LayerFeatureChange.bind(this);
    this._notifyFeatureChange = this.notifyFeatureChange.bind(this);
    this._metadata =            {};
    this._mask =                0;
    this._parent;
}, EventEmitter, 'C.Geo.Layer');

/*
 *  Constructor
 */
C.Geo.Layer_ctr = function (args) {
    return C.Geo.Layer.apply(this, args);
};
C.Geo.Layer_ctr.prototype = C.Geo.Layer.prototype;
C.Geo.Layer_new_ctr = function () {
    return new C.Geo.Layer_ctr(arguments);
};

C.Geo.Layer.Mask = {
    OPACITY: 1
};

C.Geo.Layer.EventType = {
    ADDED: 0,
    REMOVED: 1,
    UPDATED: 2,
    MOVED: 3
};

C.Geo.Layer.prototype.set = function (key, value) {
    this._metadata[key] = value;
    return value;
};

C.Geo.Layer.prototype.get = function (key) {
    if (key in this._metadata) {
        return this._metadata[key];
    }
    return null;
};

C.Geo.Layer.prototype.__added = function () {
    this.emit('added', this);
};

C.Geo.Layer.prototype.__removed = function () {
    this.emit('removed', this);
};

C.Geo.Layer.prototype.count = function () {
    return this._features.length;
};

C.Geo.Layer.prototype.addTo = function (container) {
    return container.add(this);
};

C.Geo.Layer.prototype.add = function (feature) {
    if (feature === undefined ||
        (feature instanceof C.Geo.Feature.Feature !== true &&
         feature instanceof C.Geo.Layer !== true) ||
        this._features.indexOf(feature) !== -1) {
        return false;
    }

    this._features.push(feature);

    if (feature instanceof C.Geo.Feature.Feature) {
        feature.on('dirty', this._featureDirty);
        this.notifyFeatureChange(C.Geo.Feature.Feature.EventType.ADDED, feature);
        this.emit('featureAdded', feature);
    } else {
        feature._parent = this; //TODO if parent already set remove it
        feature.on('dirty', this._layerDirty);
        feature.on('featureChange', this._layerFeatureChange);
        feature.on('layerChange', this._notifyFeatureChange);
        this.notifyLayerChange(C.Geo.Layer.EventType.ADDED, feature);
        this.emit('layerAdded', feature);
        feature.__added();
    }
    return true;
};

// Alias
C.Geo.Layer.prototype.addLayer = C.Geo.Layer.prototype.addFeature = C.Geo.Layer.prototype.add;

C.Geo.Layer.prototype.remove = function (feature) {
    var idx;
    if (feature === undefined ||
        (feature instanceof C.Geo.Feature.Feature !== true &&
         feature instanceof C.Geo.Layer !== true) ||
        (idx=this._features.indexOf(feature)) === -1) {
        return false;
    }

    this._features.splice(idx, 1);

    if (feature instanceof C.Geo.Feature.Feature) {
        feature.off('dirty', this._featureDirty);
        this.notifyFeatureChange(C.Geo.Feature.Feature.EventType.REMOVED, feature);
        this.emit('featureRemoved', feature);
    } else {
        feature.off('dirty', this._layerDirty);
        feature.off('featureChange', this._layerFeatureChange);
        feature.off('layerChange', this._notifyFeatureChange);
        this.notifyLayerChange(C.Geo.Layer.EventType.REMOVED, feature);
        this.emit('layerRemoved', feature);
        feature.__removed();
    }
    return true;
};

// Alias
C.Geo.Layer.prototype.removeLayer = C.Geo.Layer.prototype.removeFeature = C.Geo.Layer.prototype.remove;

C.Geo.Layer.prototype.move = function (feature, toIdx) {
    var idx;
    if (feature === undefined ||
        (idx=this._features.indexOf(feature)) === -1 ||
        toIdx === idx ||
        toIdx < 0 ||
        toIdx >= this._features.length) {
        return false;
    }

    this._features.splice(idx, 1);
    this._features.splice(toIdx, 0, feature);

    var eventData = {feature: feature, idx: idx, toIdx: toIdx};
    this.notifyFeatureChange(C.Geo.Layer.EventType.MOVED, eventData);
    this.emit('featureMoved', eventData);
};

// Alias
C.Geo.Layer.prototype.moveLayer = C.Geo.Layer.prototype.moveFeature = C.Geo.Layer.prototype.move;

C.Geo.Layer.prototype.notifyLayerChange = function (eventType, layer) {
    this.emit('layerChange', eventType, layer);
};

C.Geo.Layer.prototype.notifyFeatureChange = function (eventType, feature) {
    this.emit('featureChange', eventType, feature, this);
};

C.Geo.Layer.prototype.clearLayer = function () {
    for (var j = this._features.length; j > 0; --j) {
        this.remove(this._features[0]);
    }
};

C.Geo.Layer.prototype.opacity = function (opacity) {
    if (opacity === undefined || this._opacity === opacity) {
        return this._opacity;
    }

    this._mask |= C.Geo.Layer.Mask.OPACITY;
    this._opacity = opacity;
    this.emit('opacity', opacity);
    this.makeDirty();
    return this._opacity;
};

C.Geo.Layer.prototype.makeDirty = function () {
    this._dirty = true;
    this.emit('dirty', this);
};

function FeatureDirty(feature) {
    this.notifyFeatureChange(C.Geo.Feature.Feature.EventType.UPDATED, feature);
}

function LayerDirty(layer) {
    this.notifyLayerChange(C.Geo.Layer.EventType.UPDATED, layer);
    layer._dirty = false;
}

function LayerFeatureChange(eventType, feature, layer) {
    this.emit('featureChange', eventType, feature, layer);
};
