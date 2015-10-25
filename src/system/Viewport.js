/*
 *  C.System.Viewport   //TODO description
 */

'use strict';

/**
 * Viewport, geographic area visible on screen
 *
 * @class Viewport
 * @namespace C
 * @extends EventEmitter
 * @static
 */
C.System.Viewport = C.Utils.Inherit(function (base, options) {
    base();

    options = options || {};

    this._width = options.width || 0; // px

    this._height = options.height || 0; // px

    this._resolution = options.resolution || 0; // resolution m/px

    this._schema = options.schema;

    this._origin = options.origin;

    this._rotation = options.rotation || 0;

    this._bbox = new C.Geometry.BoundingBox();

    this._zoomDirection = C.System.Viewport.zoomDirection.NONE;

    this._movedTimer;

    this._movedCallback = this._eventMoved.bind(this);

    this._mask = 0;

    this._lastZoomLevel = this.getZoomLevel();

    this._update();
}, EventEmitter, 'C.System.Viewport');

C.System.Viewport.zoomDirection = {
    IN: 0,
    OUT: 1,
    NONE: 2
};

C.System.Viewport.ActionMask = {
    TRANSLATE: 1,
    ROTATE: 2,
    ZOOM: 4,
    RESIZE: 8
};

/**
 * Returns the bounds of the view.
 *
 * @method getBounds
 * @public
 * @return {C.Bounds} Viewport's bounds.
 */
C.System.Viewport.prototype.getBounds = function () {
    var bounds = new C.Geometry.Bounds();
    bounds._crs = this._schema._crs;
    bounds.extend(this._bbox._bottomLeft);
    bounds.extend(this._bbox._bottomRight);
    bounds.extend(this._bbox._topLeft);
    bounds.extend(this._bbox._topRight);
    bounds.clamp(this._schema._extent);
    return bounds;
};

/**
 * Returns maximum schema zoom level
 *
 * @method getMaxZoomLevel
 * @public
 * @return {Number} max zoom level.
 */
C.System.Viewport.prototype.getMaxZoomLevel = function () {
    return this._schema._resolutions.length - 1;
};

/**
 * Returns current zoom level.
 *
 * @method getZoomLevel
 * @public
 * @return {Number} Current zoom level.
 */
C.System.Viewport.prototype.getZoomLevel = function () {
    for (var i = 0; i < this._schema._resolutions.length; ++i) {
        var res = this._schema._resolutions[i];
        if (this._resolution > res || C.Utils.Comparison.Equals(this._resolution, res)) {
            return (i);
        }
    }
    return (this._schema._resolutions.length - 1);
};

/**
 * Returns the resolution for a zoom level.
 *
 * @method getResolutionAtZoomLevel
 * @public
 * @param {Number} zoomLevel zoom level.
 * @return {Number} Resolution for the given zoom level.
 */
C.System.Viewport.prototype.getResolutionAtZoomLevel = function (zoomLevel) {
    return this._schema._resolutions[zoomLevel];
};

/**
 * Set the center of the map.
 *
 * @method setCenter
 * @public
 * @param {C.Point} center Coordinates.
 * @param {Boolean} [noEvent] If true no event will be thrown.
 */
C.System.Viewport.prototype.setCenter = function (center, noEvent) {
    this._origin.X = center.X;
    this._origin.Y = center.Y;
    this._mask |= C.System.Viewport.ActionMask.TRANSLATE;
    this._update(noEvent);
};

/**
 * Translate the viewport.
 *
 * @method translate
 * @public
 * @param {Number} tx X translation in pixel.
 * @param {Number} ty Y translation in pixel.
 * @param {Boolean} [noEvent] If true no event will be thrown.
 */
C.System.Viewport.prototype.translate = function (tx, ty, noEvent) {
    this._schema.translate(this, tx, ty);
    this._mask |= C.System.Viewport.ActionMask.TRANSLATE;
    this._update(noEvent);
};

/**
 * Rotate the viewport.
 *
 * @method rotate
 * @public
 * @param {Number} angle rotation angle.
 * @param {Boolean} [noEvent] If true no event will be thrown.
 */
C.System.Viewport.prototype.rotate = function (angle, noEvent) {
    this._schema.rotate(this, angle);
    this._mask |= C.System.Viewport.ActionMask.ROTATE;
    this._update(noEvent);
    this.emit('rotationChange', this);
};

/**
 * Zoom to a resolution.
 *
 * @method zoom
 * @public
 * @param {Number} resolution
 * @param {Boolean} [noEvent] If true no event will be thrown.
 */
C.System.Viewport.prototype.zoom = function (resolution, noEvent) {
    if (resolution < 0) { return; }

    if (resolution > this._resolution) {
        this._zoomDirection = C.System.Viewport.zoomDirection.OUT;
    }
    if (resolution < this._resolution) {
        this._zoomDirection = C.System.Viewport.zoomDirection.IN;
    }
    this._resolution = resolution;
    this._mask |= C.System.Viewport.ActionMask.ZOOM;
    this._update(noEvent);
    this.emit('resolutionChange', this);
    var zoomLevel = this.getZoomLevel();
    if (this._lastZoomLevel != zoomLevel) {
        this.emit('zoomChanged', this);
    }
    this._lastZoomLevel = zoomLevel;
};

C.System.Viewport.prototype.resize = function (newWidth, newHeight, noEvent) {
    this._width = newWidth;
    this._height = newHeight;
    this._mask |= C.System.Viewport.ActionMask.RESIZE;
    this._update(noEvent);
};

C.System.Viewport.prototype._update = function (noEvent) {
    this._schema.update(this);
    if (!noEvent) {
        this._eventMove();
    }
};

/**
 * Viewport got updated
 * @event move
 * @param {C.Viewport} self
 */
C.System.Viewport.prototype._eventMove = function () {
    if (this._movedTimer) {
        clearTimeout(this._movedTimer);
    }
    this._movedTimer = setTimeout(this._movedCallback, C.System.Events._movedTimeout);
    this.emit('move', this);
    this._mask = 0;
};

/**
 * Viewport got updated and wasn't moved for a certain amount of time
 * @event moved
 * @param {C.Viewport} self
 */
C.System.Viewport.prototype._eventMoved = function () {
    this.emit('moved', this);
};

/**
 * Convert screen coordinates to world.
 *
 * @method screenToWorld
 * @public
 * @param {Number} px X screen position.
 * @param {Number} py Y screen position.
 * @return {C.Vector2} World position.
 */
C.System.Viewport.prototype.screenToWorld = function (px, py) {
    return (this._schema.screenToWorld(this, px, py));
};

/**
 * Convert world to screen coordinates.
 *
 * @method worldToScreen
 * @public
 * @param {Number} wx X world position.
 * @param {Number} wy Y world position.
 * @return {C.Vector2} Screen position.
 */
C.System.Viewport.prototype.worldToScreen = function (wx, wy) {
    return (this._schema.worldToScreen(this, wx, wy));
};

