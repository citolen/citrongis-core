/*
 *  C.Geo.Layer //TODO description
 */

'use strict';

C.Geo.Layer = C.Utils.Inherit(function (base, options) {
    if (options === undefined) {
        throw 'Invalid Argument';
    }

    base();

    /* Displayed name, if none not displayed */
    this._name = options.name;

    /* Layer enable */
    this._enabled = options.enabled || true;

    /* Index of the layer in the assigned group */
    this._zIndex = options.zIndex || 0;

    /* Displayed opacity, applied to all features */
    this._opacity = options.opacity || 1.0;

    /* Extension owning the layer */
    this._owner = undefined;

    /* Group in which the layer is */
    this._group = undefined;

    /* All the features */
    this._features = [];

    /* Redraw when dirty */
    this._dirty = false;

    /* Layer's minimum zoom */
    this._minZoom = options.minZoom;

    /* Layer's maximum zoom */
    this._maxZoom = options.maxZoom;

    this._featureDirty = FeatureDirty.bind(this);

    this._mask = 0;

}, EventEmitter, 'C.Geo.Layer');

C.Geo.Layer.Mask = {
    OPACITY: 1
};

C.Geo.Layer.EventType = {
    ADDED: 0,
    REMOVED: 1,
    UPDATED: 2,
    MOVED: 3
};

C.Geo.Layer.prototype.__added = function () {
    this.emit('added', this);
};

C.Geo.Layer.prototype.__removed = function () {
    this.emit('removed', this);
};

C.Geo.Layer.prototype.addFeature = function (feature) {
    if (feature === undefined ||
        feature instanceof C.Geo.Feature.Feature !== true ||
        this._features.indexOf(feature) !== -1) {
        return false;
    }

    this._features.push(feature);

    feature.on('dirty', this._featureDirty);

    this.notifyFeatureChange(C.Geo.Feature.Feature.EventType.ADDED, feature);
    this.emit('featureAdded', feature);
    return true;
};

C.Geo.Layer.prototype.removeFeature = function (feature) {
    var idx;
    if (feature === undefined ||
        feature instanceof C.Geo.Feature.Feature !== true ||
        (idx=this._features.indexOf(feature)) === -1) {
        return false;
    }

    this._features.splice(idx, 1);

    feature.off('dirty', this._featureDirty);

    this.notifyFeatureChange(C.Geo.Feature.Feature.EventType.REMOVED, feature);
    this.emit('featureRemoved', feature);
    return true;
};

C.Geo.Layer.prototype.clearLayer = function () {
    for (var j = this._features.length; j > 0; --j) {
        this.removeFeature(this._features[0]);
    }
};

function FeatureDirty(feature) {
    this.notifyFeatureChange(C.Geo.Feature.Feature.EventType.UPDATED, feature);
}

C.Geo.Layer.prototype.notifyFeatureChange = function (eventType, feature) {
    this.emit('featureChange', eventType, feature, this);
};

C.Geo.Layer.prototype.name = function (name) {
    if (name === undefined || this._name === name) {
        return this._name;
    }

    this._name = name;
    this.emit('nameChanged', name);
    return this._name;
};

C.Geo.Layer.prototype.enabled = function (enabled) {
    if (enabled == undefined || this._enabled === enabled) {
        return this._enabled;
    }

    this._enabled = enabled;
    this.emit('enabledChanged', enabled);
    return this._enabled;
};

C.Geo.Layer.prototype.zIndex = function (zIndex) {
    if (zIndex === undefined || this._zIndex === zIndex) {
        return this._zIndex;
    }

    this._zIndex = zIndex;
    this.emit('zIndexChanged', zIndex);
    return this._zIndex;
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
