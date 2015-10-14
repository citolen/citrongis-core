/*
 *  C.Extension.LayerManager //TODO description
 */

'use strict';

C.Extension.LayerManager = C.Utils.Inherit(function (base) {

    'use strict';

    base();

    this._layers = [];
    this._layerDirty = LayerDirty.bind(this);
    this._layerFeatureChange = LayerFeatureChange.bind(this);
    this._layerChange = this.notifyLayerChange.bind(this);

}, EventEmitter, 'C.Extension.LayerManager');

C.Extension.LayerManager.prototype.addLayer = function (layer) {

    if (layer == undefined ||
        layer instanceof C.Geo.Layer !== true ||
        this._layers.indexOf(layer) !== -1) {
        return false;
    }

    layer._parent = 42;
    this._layers.push(layer);

    layer.on('dirty', this._layerDirty);
    layer.on('featureChange', this._layerFeatureChange);
    layer.on('layerChange', this._layerChange);

    this.notifyLayerChange(C.Geo.Layer.EventType.ADDED, layer);
    this.emit('layerAdded', layer);
    layer.__added();
    return true;
};

function LayerDirty(layer) {
    this.notifyLayerChange(C.Geo.Layer.EventType.UPDATED, layer);
    layer._dirty = false;
}

function LayerFeatureChange(eventType, feature, layer) {
    this.emit('featureChange', eventType, feature, layer);
};

C.Extension.LayerManager.prototype.notifyLayerChange = function (eventType, layer) {
    this.emit('layerChange', eventType, layer);
};
