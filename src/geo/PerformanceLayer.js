/*
 *  PerformanceLayer.js     Optimized Layer to handle huge number of features
 */

'use strict';

C.Geo.PerformanceLayer = C.Utils.Inherit(function (base, options) {

    base(options);

    var self = this;

    this._dirty = false;

    this._renderingTexture = new PIXI.RenderTexture(C.Helpers.renderer,
                                                    C.Helpers.viewport._width,
                                                    C.Helpers.viewport._height);

    this._root = new C.Geo.Layer();
    this._root.on('dirty', function () {
        C.Helpers.customRenderer.layerChange.call(C.Helpers.customRenderer,
                                                  C.Geo.Layer.EventType.UPDATED, self._root);
        self._root._dirty = false;
        self.render();
    });
    this._root.on('featureChange', function (eventType, feature, layer) {
        C.Helpers.customRenderer.featureChange.call(C.Helpers.customRenderer,
                                                    eventType, feature, layer);
        self._dirty = true;
    });

    this._root.on('layerChange', function (eventType, layer) {
        C.Helpers.customRenderer.layerChange.call(C.Helpers.customRenderer, eventType, layer);
        self.render();
    });

    C.Helpers.customRenderer.layerChange(C.Geo.Layer.EventType.ADDED, this._root);
    this._root.__added();
    this.render();

    this._sprite = new C.Geo.Feature.Image({
        location: new C.Geometry.LatLng(0, 0),
        width: C.Helpers.viewport._width,
        height: C.Helpers.viewport._height,
        offset: new C.Geometry.Vector2(-C.Helpers.viewport._width/2, -C.Helpers.viewport._height/2)
    });
    this._sprite.on('mousedown', function (f, evt) {
        C.Helpers.renderer.plugins.interaction.processInteractive(evt.data.global, self._root.__graphics, C.Helpers.renderer.plugins.interaction.processMouseDown, true);
    });
    this._sprite.on('mouseup', function (f, evt) {
        C.Helpers.renderer.plugins.interaction.processInteractive(evt.data.global, self._root.__graphics, C.Helpers.renderer.plugins.interaction.processMouseUp, true);
    });
    C.Geo.Layer.prototype.add.call(this, this._sprite);

    this._frame = this.frame.bind(this);
    this._moved = this.moved.bind(this);
    this._vmove = this.vmove.bind(this);
    this._resize = this.resize.bind(this);

    this.on('added', this._added.bind(this));
    this.on('removed', this._removed.bind(this));

}, C.Geo.Layer, 'C.Geo.PerformanceLayer');

C.Geo.PerformanceLayer_ctr = function (args) {
    return C.Geo.PerformanceLayer.apply(this, args);
};
C.Geo.PerformanceLayer_ctr.prototype = C.Geo.PerformanceLayer.prototype;
C.Geo.PerformanceLayer_new_ctr = function () {
    return new C.Geo.PerformanceLayer_ctr(arguments);
};

C.Geo.PerformanceLayer.prototype._added = function () {
    this._sprite.__graphics.texture = this._renderingTexture;
    C.System.Events.on('frame', this._frame);
    C.Helpers.viewport.on('moved', this._moved);
    C.Helpers.viewport.on('move', this._vmove);
    C.Helpers.viewport.on('resized', this._resize);
};

C.Geo.PerformanceLayer.prototype._removed = function () {
    C.System.Events.off('frame', this._frame);
    C.Helpers.viewport.off('moved', this._moved);
    C.Helpers.viewport.off('move', this._vmove);
    C.Helpers.viewport.off('resized', this._resize);
};

C.Geo.PerformanceLayer.prototype.render = function () {
    this._renderAt = C.Helpers.viewport._resolution;
    this._renderingTexture.render(this._root.__graphics, null, true);
    if (this._sprite) {
        var width = C.Helpers.viewport._width;
        var height = C.Helpers.viewport._height;
        this._sprite.width(width);
        this._sprite.height(height);
        this._sprite.offset(new C.Geometry.Vector2(-width/2, -height/2));
    }
};

C.Geo.PerformanceLayer.prototype.resize = function () {
    this._renderingTexture.resize(C.Helpers.viewport._width,
                                  C.Helpers.viewport._height,
                                 true);
    this.render();
};

C.Geo.PerformanceLayer.prototype.vmove = function () {
    if (C.Helpers.viewport._zoomDirection == C.System.Viewport.zoomDirection.NONE) {
        return;
    }
    var resolution = C.Helpers.viewport._resolution;
    var width = (this._renderAt / resolution) * C.Helpers.viewport._width;
    var height = (this._renderAt / resolution) * C.Helpers.viewport._height;
    this._sprite.width(width);
    this._sprite.height(height);
    this._sprite.offset(new C.Geometry.Vector2(-width/2, -height/2));
};

C.Geo.PerformanceLayer.prototype.moved = function () {
    this._sprite.location(new C.Geometry.Point(C.Helpers.viewport._origin.X,
                                               C.Helpers.viewport._origin.Y, 0,
                                               C.Helpers.ProjectionsHelper.EPSG3857));
    C.Helpers.customRenderer.layerUpdatePositions.call(C.Helpers.customRenderer,
                                                       this._root,
                                                       C.System.Viewport.zoomDirection.IN);
    this.render();
};

C.Geo.PerformanceLayer.prototype.frame = function () {
    if (!this._dirty) { return; }
    this.render();
    this._dirty = false;
};

C.Geo.PerformanceLayer.prototype.addLayer = C.Geo.PerformanceLayer.prototype.addFeature = C.Geo.PerformanceLayer.prototype.add = function () {
    return this._root.add.apply(this._root, arguments);
};

C.Geo.PerformanceLayer.prototype.removeLayer = C.Geo.PerformanceLayer.prototype.removeFeature = C.Geo.PerformanceLayer.prototype.remove = function () {
    return this._root.remove.apply(this._root, arguments);
};

C.Geo.PerformanceLayer.prototype.moveLayer = C.Geo.PerformanceLayer.prototype.moveFeature = C.Geo.PerformanceLayer.prototype.move = function () {
    return this._root.move.apply(this._root, arguments);
};

C.Geo.PerformanceLayer.prototype.clearLayer = function () {
    return this._root.clearLayer.apply(this._root, arguments);
};

C.Geo.PerformanceLayer.prototype.getBounds = function () {
    return this._root.getBounds.apply(this._root, arguments);
};

C.Geo.PerformanceLayer.prototype.opacity = function () {
    return this._root.opacity.apply(this._root, arguments);
};

C.Geo.PerformanceLayer.prototype.count = function () {
    return this._root.count.apply(this._root, arguments);
};
