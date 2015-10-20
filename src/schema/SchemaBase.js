/*
 *  C.Schema.SchemaBase //TODO description
 */

'use strict';

C.Schema.SchemaBase = function (options) {
    options = options || {};

    this._name = options.name;

    this._crs = options.crs; // Like Espg

    this._originX = options.originX;

    this._originY = options.originY; //

    this._extent = options.extent; // Extent (boundaries)

    this._resolutions = options.resolutions;
};

C.Schema.SchemaBase.prototype.translate = function (viewport, tx, ty) {
    throw 'To Implement';
};

C.Schema.SchemaBase.prototype.rotate = function (viewport, angle) {
    throw 'To Implement';
};

C.Schema.SchemaBase.prototype.update = function (viewport) {
    throw 'To Implement';
};

C.Schema.SchemaBase.prototype.screenToWorld = function (viewport, px, py) {
    throw 'To Implement';
};

C.Schema.SchemaBase.prototype.worldToScreen = function (viewport, wx, wy) {
    throw 'To Implement';
};
