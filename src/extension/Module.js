/*
 *  C.Extension.Module //TODO description
 */

'use strict';

C.Extension.Module = function (context, strings, layerManager) {

    this._context = context;

    this.exports = {};

    this.strings = strings;

    this.global = {};

    this.ui = new C.Extension.UI.UI(this._context);

    this._rootLayer = C.Geo.Layer_new_ctr();

    this._layerManager = layerManager;

//    this.layerHelper = new C.Extension.LayerHelper(layerManager, this._context);
};

C.Extension.Module.prototype.addLayerToMap = function () {
    this._layerManager.addLayer(this._rootLayer);
};
