/*
 *  C.Extension.LayerGroup
 */

'use strict';

C.Extension.LayerGroup = C.Utils.Inherit(function (base, options) {

    base();

    if (options === undefined || options.owner === undefined) {
        throw 'Invalid Argument';
    }

    this._name = options.name;

    this._owner = options.owner;

    this._layers = [];

    this._layerDirty = LayerDirty.bind(this);

    this._layerFeatureChange = LayerFeatureChange.bind(this);

}, EventEmitter, 'C.Extension.LayerGroup');

C.Extension.LayerGroup.EventType = {
    ADDED: 0,
    REMOVED: 1,
    MOVED: 2
};

C.Extension.LayerGroup.prototype.layers = function () {
    var result = [];
    for (var i = 0; i < this._layers.length; ++i) {
        var l = this._layers[i];
        result.push({
            name: l.name(),
            layer: l,
            idx: i
        });
    }
    return (result);
};

C.Extension.LayerGroup.prototype.addLayer = function (layer) {
    if (layer === undefined || this._layers.indexOf(layer) !== -1) {
        return false;
    }

    layer._owner = this._owner;
    layer._group = this;

    this._layers.push(layer);

    layer.on('dirty', this._layerDirty);
    layer.on('featureChange', this._layerFeatureChange);

    this.notifyLayerChange(C.Geo.Layer.EventType.ADDED, layer);
    this.emit('layerAdded', layer);
    layer.__added();
    return true;
};

C.Extension.LayerGroup.prototype.removeLayer = function (layer) {
    var idx;
    if (layer === undefined || (idx=this._layers.indexOf(layer)) === -1) {
        return false;
    }

    this._layers.splice(idx, 1);

    layer.off('dirty', this._layerDirty);
    layer.off('featureChange', this._layerFeatureChange);

    this.notifyLayerChange(C.Geo.Layer.EventType.REMOVED, layer);
    this.emit('layerRemoved', layer);

    layer.__removed();

    return true;
};

C.Extension.LayerGroup.prototype.moveLayer = function (layer, toIdx) {
    var idx;
    if (layer === undefined ||
        (idx=this._layers.indexOf(layer)) === -1 ||
        toIdx === idx ||
        toIdx < 0 ||
        toIdx >= this._layers.length) {
        return false;
    }

    this._layers.splice(idx, 1);
    this._layers.splice(toIdx, 0, layer);

    this.notifyLayerChange(C.Geo.Layer.EventType.MOVED, layer);
    this.emit('layerMoved', {layer: layer, idx: toIdx});

    return true;
};

function LayerFeatureChange(eventType, feature, layer) {
    this.emit('featureChange', eventType, feature, layer);
};

C.Extension.LayerGroup.prototype.notifyLayerChange = function (eventType, layer) {
    this.emit('layerChange', eventType, layer);
};

function LayerDirty(layer) {
    this.notifyLayerChange(C.Geo.Layer.EventType.UPDATED, layer);
    layer._dirty = false;
}
