/*
 *  C.Renderer.RendererBase //TODO description
 */

'use strict';

C.Renderer.RendererBase = function (citronGIS) {
    if (!citronGIS) {
        return;
    }

    this._layerManager = citronGIS._layerManager;

    this._stage = citronGIS._rendererStage;

    this._viewport = citronGIS._viewport;

    this._layerManager.on('featureChange', this.featureChange.bind(this));

    this._layerManager.on('layerChange', this.layerChange.bind(this));

    this._layerManager.on('groupChange', this.groupChange.bind(this));
};

C.Renderer.RendererBase.prototype.featureChange = function (eventType, feature, layer) {
    throw 'ToImplement';
};

C.Renderer.RendererBase.prototype.layerChange = function (eventType, layer) {
    throw 'ToImplement';
};

C.Renderer.RendererBase.prototype.groupChange = function (eventType, group) {
    throw 'ToImplement';
};

C.Renderer.RendererBase.prototype.updatePositions = function () {
    throw 'ToImplement';
};

C.Renderer.RendererBase.prototype.renderFrame = function () {
    throw 'ToImplement';
};
