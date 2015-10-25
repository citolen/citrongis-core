/*
 *  C.Geo.Layer //TODO description
 */

'use strict';

/**
 * Creates a layer
 *
 * @class Layer
 * @namespace C
 * @extends EventEmitter
 * @constructor
 * @param {Object} [options] Data
 * @param {String} [options.name] Layer name.
 * @param {Number} [options.opacity] Layer opacity.
 * @param {Object} [options.metadata] Dictionary of metadata.
 * @example
 *      var layer = C.Layer({
 *          name: 'my_data_layer'
 *      });
 */
C.Geo.Layer = C.Utils.Inherit(function (base, options) {
    base();

    options = options || {};

    this._name =                options.name;
    this._opacity =             options.opacity || 1.0;
    this._features =            [];
    this._dirty =               false;
    this._featureDirty =        FeatureDirty.bind(this);
    this._layerDirty =          LayerDirty.bind(this);
    this._layerFeatureChange =  LayerFeatureChange.bind(this);
    this._notifyFeatureChange = this.notifyFeatureChange.bind(this);
    this._notifyLayerChange =   this.notifyLayerChange.bind(this);
    this._metadata =            {};
    this._mask =                0;
    this._parent;
    this._needsToBeAdd =        [];
    this._needsToBeRemove =     [];
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

/**
 * Set a metadata
 *
 * @method set
 * @public
 * @param {Object} key Key link to value.
 * @param {Object} value Value to store.
 * @return {Object} Added value.
 */
C.Geo.Layer.prototype.set = function (key, value) {
    this._metadata[key] = value;
    return value;
};

/**
 * Get a metadata
 *
 * @method get
 * @public
 * @param {Object} key Key link to value.
 * @return {Object} Key value or null if not found.
 */
C.Geo.Layer.prototype.get = function (key) {
    if (key in this._metadata) {
        return this._metadata[key];
    }
    return null;
};

C.Geo.Layer.prototype.__added = function () {
    for (var i = 0; i < this._features.length; ++i) {
        var feature = this._features[i];
        if (feature instanceof C.Geo.Feature.Feature) {
            this.notifyFeatureChange(C.Geo.Feature.Feature.EventType.ADDED, feature);
        }
        feature.__added();
    }
    for (var i = 0; i < this._needsToBeRemove.length; ++i) {
        var feature = this._needsToBeRemove[i];
        if (feature instanceof C.Geo.Layer) {
            this.notifyLayerChange(C.Geo.Layer.EventType.REMOVED, feature);
        } else {
            this.notifyFeatureChange(C.Geo.Feature.Feature.EventType.REMOVED, feature);
        }
        feature.__removed();
    }
    this._needsToBeRemove = [];
    for (var i = 0; i < this._needsToBeAdd.length; ++i) {
        var feature = this._needsToBeAdd[i];
        if (feature instanceof C.Geo.Layer) {
            this.notifyLayerChange(C.Geo.Layer.EventType.ADDED, feature);
        } else {
            this.notifyFeatureChange(C.Geo.Feature.Feature.EventType.ADDED, feature);
        }
        feature.__added();
        this._features.push(feature);
    }
    this._needsToBeAdd = [];
    this.emit('added', this);
};

C.Geo.Layer.prototype.__removed = function () {
    for (var i = 0; i < this._features.length; ++i) {
        var feature = this._features[i];
//        if (feature instanceof C.Geo.Layer) {
            feature.__removed();
//        }
    }
    this.emit('removed', this);
};

/**
 * Features count
 *
 * @method count
 * @public
 * @return {Number} Features count.
 */
C.Geo.Layer.prototype.count = function () {
    return this._features.length;
};

/**
 * Add this to a layer
 *
 * @method addTo
 * @public
 * @param {C.Layer} container Layer to add yourself to.
 * @return {Boolean} True is succesfully added.
 */
C.Geo.Layer.prototype.addTo = function (container) {
    return container.add(this);
};

/**
 * Add a feature/layer to this layer
 *
 * @method add
 * @public
 * @param {C.Feature,C.Layer} feature feature/layer to add.
 * @return {Boolean} True is succesfully added.
 */
C.Geo.Layer.prototype.add = function (feature) {
    if (feature === undefined ||
        (feature instanceof C.Geo.Feature.Feature !== true &&
         feature instanceof C.Geo.Layer !== true) ||
        this._features.indexOf(feature) !== -1 ||
        this._needsToBeAdd.indexOf(feature) !== -1) {
        return false;
    }

    var idx;
    if ((idx = this._needsToBeRemove.indexOf(feature)) !== -1) {
        this._needsToBeRemove.splice(idx, 1);
    }

    if (feature instanceof C.Geo.Feature.Feature) {
        feature.on('dirty', this._featureDirty);
        feature._wasHandled = false;
        this.notifyFeatureChange(C.Geo.Feature.Feature.EventType.ADDED, feature);
        if (!feature._wasHandled) {
            this._needsToBeAdd.push(feature);
        } else {
            this._features.push(feature);
            feature.__added();
        }
        delete feature._wasHandled;
        this.emit('featureAdded', feature);
    } else {
        feature._parent = this; //TODO if parent already set remove it
        feature.on('dirty', this._layerDirty);
        feature.on('featureChange', this._layerFeatureChange);
        feature.on('layerChange', this._notifyLayerChange);
        feature._wasHandled = false;
        this.notifyLayerChange(C.Geo.Layer.EventType.ADDED, feature);
        if (!feature._wasHandled) {
            this._needsToBeAdd.push(feature);
        } else {
            this._features.push(feature);
            feature.__added();
        }
        delete feature._wasHandled;
        this.emit('layerAdded', feature);
    }
    return true;
};
// Alias
/**
 * Add a feature to this layer
 *
 * @method addFeature
 * @public
 * @param {C.Feature} feature feature to add.
 * @return {Boolean} True is succesfully added.
 */
/**
 * Add a layer to this layer
 *
 * @method addLayer
 * @public
 * @param {C.Layer} layer layer to add.
 * @return {Boolean} True is succesfully added.
 */
C.Geo.Layer.prototype.addLayer = C.Geo.Layer.prototype.addFeature = C.Geo.Layer.prototype.add;

/**
 * Remove a feature/layer to this layer
 *
 * @method remove
 * @public
 * @param {C.Feature,C.Layer} feature feature/layer to remove.
 * @return {Boolean} True is succesfully removed.
 */
C.Geo.Layer.prototype.remove = function (feature) {
    if (feature === undefined ||
        (feature instanceof C.Geo.Feature.Feature !== true &&
         feature instanceof C.Geo.Layer !== true) ||
        this._needsToBeRemove.indexOf(feature) !== -1) {
        return false;
    }

    var idx = this._features.indexOf(feature);
    var idx_ = this._needsToBeAdd.indexOf(feature);

    if (idx === -1 && idx_ === -1) { return false; }

    if (idx !== -1) { this._features.splice(idx, 1); }
    if (idx_ !== -1) { this._needsToBeAdd.splice(idx_, 1); }

    if (feature instanceof C.Geo.Feature.Feature) {
        feature.off('dirty', this._featureDirty);
        feature._wasHandled = false;
        this.notifyFeatureChange(C.Geo.Feature.Feature.EventType.REMOVED, feature);
        if (idx !== -1 && !feature._wasHandled) {
            this._needsToBeRemove.push(feature);
        } else {
            feature.__removed();
        }
        delete feature._wasHandled;
        this.emit('featureRemoved', feature);
    } else {
        feature.off('dirty', this._layerDirty);
        feature.off('featureChange', this._layerFeatureChange);
        feature.off('layerChange', this._notifyLayerChange);
        feature._wasHandled = false;
        this.notifyLayerChange(C.Geo.Layer.EventType.REMOVED, feature);
        if (idx !== -1 && !feature._wasHandled) {
            this._needsToBeRemove.push(feature);
        } else {
            feature.__removed();
        }
        delete feature._wasHandled;
        this.emit('layerRemoved', feature);
    }
    return true;
};
// Alias
/**
 * Remove a feature to this layer
 *
 * @method removeFeature
 * @public
 * @param {C.Feature} feature feature to remove.
 * @return {Boolean} True is succesfully removed.
 */
/**
 * Remove a layer to this layer
 *
 * @method removeLayer
 * @public
 * @param {C.Layer} layer layer to remove.
 * @return {Boolean} True is succesfully removed.
 */
C.Geo.Layer.prototype.removeLayer = C.Geo.Layer.prototype.removeFeature = C.Geo.Layer.prototype.remove;

/**
 * Move a feature/layer inside this layer
 *
 * @method move
 * @public
 * @param {C.Feature,C.Layer} feature feature/layer to move.
 * @param {Number} toIdx index where feature should move to.
 * @return {Boolean} True is succesfully moved.
 */
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
/**
 * Move a feature
 *
 * @method moveFeature
 * @public
 * @param {C.Feature} feature feature to move.
 * @param {Number} toIdx index where feature should move to.
 * @return {Boolean} True is succesfully removed.
 */
/**
 * Move a layer
 *
 * @method moveLayer
 * @public
 * @param {C.Layer} layer layer to move.
 * @param {Number} toIdx index where feature should move to.
 * @return {Boolean} True is succesfully moved.
 */
C.Geo.Layer.prototype.moveLayer = C.Geo.Layer.prototype.moveFeature = C.Geo.Layer.prototype.move;

C.Geo.Layer.prototype.notifyLayerChange = function (eventType, layer) {
    this.emit('layerChange', eventType, layer);
};

C.Geo.Layer.prototype.notifyFeatureChange = function (eventType, feature) {
    this.emit('featureChange', eventType, feature, this);
};

/**
 * Remove everything from the layer.
 *
 * @method clearLayer
 * @public
 */
C.Geo.Layer.prototype.clearLayer = function () {
    if (this._needsToBeAdd.length > 0) {
        console.log('jolie merde');
    }
    for (var j = this._features.length; j > 0; --j) {
        C.Geo.Layer.prototype.remove.call(this, this._features[0]);
    }
};

/**
 * Returns the bounds of the layer.
 *
 * @method getBounds
 * @public
 * @return {C.Bounds} Bounds of the layer.
 */
C.Geo.Layer.prototype.getBounds = function () {

    var bounds = new C.Geometry.Bounds();

    for (var i = 0; i < this._features.length; ++i) {
        var feature = this._features[i];
        if (feature.getBounds) {
            bounds.extend(feature.getBounds());
        }
    }
    return bounds;
};

/**
 * Get/Set opacity
 *
 * @method opacity
 * @public
 * @param {Object} [opacity] New opacity.
 * @return {Object} Current or new opacity.
 */
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
