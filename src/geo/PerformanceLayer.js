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

    this._quadtree = new C.Utils.QuadTree({
        bl_x: -20037508.342789,
        bl_y: -20037508.342789,
        tr_x: 20037508.342789,
        tr_y: 20037508.342789,
        crs: C.Helpers.ProjectionsHelper.EPSG3857,
        maxObj: 10,
        maxDepth: 18
    });

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
    function processEvent(evt, fct) {
        var screenPosition = evt.getScreenPosition();
        var worldPt = C.Helpers.viewport.screenToWorld(screenPosition.X, screenPosition.Y);
        var r = C.Helpers.viewport._resolution * 5;
        worldPt.X -= r;
        worldPt.Y -= r;
        var bounds = new C.Geometry.Bounds(worldPt, new C.Geometry.Vector2(worldPt.X + 2*r, worldPt.Y + 2*r), C.Helpers.viewport._schema._crs);

        var containerToRender = self._quadtree.select(bounds);
        for (var i = 0; i < containerToRender.length; ++i) {
            C.Helpers.renderer.plugins.interaction.processInteractive({
                x: screenPosition.X,
                y: screenPosition.Y
            }, containerToRender[i], fct, true);
        }
    }
    this._sprite.on('mousedown', function (f, evt) {
        processEvent(evt, C.Helpers.renderer.plugins.interaction.processMouseDown);
    });
    this._sprite.on('mousemove', function (f, evt) {
        if (self._aFrameID != undefined) {
            self.cancelDefered();
        }
        processEvent(evt, C.Helpers.renderer.plugins.interaction.processMouseMove);
    });
    this._sprite.on('mouseup', function (f, evt) {
        processEvent(evt, C.Helpers.renderer.plugins.interaction.processMouseUp);
    });
    C.Geo.Layer.prototype.add.call(this, this._sprite);

    this._frame = this.frame.bind(this);
    this._moved = this.moved.bind(this);
    this._vmove = this.vmove.bind(this);
    this._resize = this.resize.bind(this);
    this._deferedRendering = this.deferedRendering.bind(this);
    this._deferedInvalidateAndRendering = this.deferedInvalidateAndRendering.bind(this);

    this.on('added', this._added.bind(this));
    this.on('removed', this._removed.bind(this));

    this._renderDirty = false;

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

C.Geo.PerformanceLayer.prototype.deferedRendering = function () {
    var startTime = Date.now();
    while (this._toRender.length > 0) {
        var toRender = this._toRender.splice(0, 1);
        this._renderingTexture.render(toRender[0], null);
        if (Date.now() - startTime > 20) {
            this._aFrameID = requestAnimationFrame(this._deferedRendering);
            return;
        }
    }
    this._aFrameID = undefined;
};

C.Geo.PerformanceLayer.prototype.render = function () {
    if (this._aFrameID != undefined) {
        this.cancelDefered();
    }
    this._renderAt = C.Helpers.viewport._resolution;
    var bounds = C.Helpers.viewport.getBounds();
    this._toRender = this._quadtree.select(bounds);
    var startTime = Date.now();
    var i = 0;
    while (this._toRender.length > 0) {
        var toRender = this._toRender.splice(0, 1);
        this._renderingTexture.render(toRender[0], null, i++ == 0);
        if (Date.now() - startTime > 20) {
            this._aFrameID = requestAnimationFrame(this._deferedRendering);
            break;
        }
    }

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
    if (this._aFrameID != undefined) {
        this.cancelDefered();
    }
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

C.Geo.PerformanceLayer.prototype.deferedInvalidateAndRendering = function () {
    var startTime = Date.now();
    while (this._toInvalidateAndRender.length > 0) {
        var toInvalidateAndRender = this._toInvalidateAndRender.splice(0, 1);
        C.Helpers.customRenderer.layerUpdatePositions.call(C.Helpers.customRenderer,
                                                           toInvalidateAndRender[0].objects,
                                                           C.System.Viewport.zoomDirection.IN);
        this._renderingTexture.render(toInvalidateAndRender[0].container, null);
        if (Date.now() - startTime > 20) {
            this._aFrameID = requestAnimationFrame(this._deferedInvalidateAndRendering);
            return;
        }
    }
    this._aFrameID = undefined;
};

C.Geo.PerformanceLayer.prototype.cancelDefered = function () {
    cancelAnimationFrame(this._aFrameID);
    this._aFrameID = undefined;
};

C.Geo.PerformanceLayer.prototype.moved = function () {
    if (this._aFrameID != undefined) {
        this.cancelDefered();
    }

    this._sprite.location(new C.Geometry.Point(C.Helpers.viewport._origin.X,
                                               C.Helpers.viewport._origin.Y, 0,
                                               C.Helpers.ProjectionsHelper.EPSG3857));
    var bounds = C.Helpers.viewport.getBounds();
    this._toInvalidateAndRender = this._quadtree.selectObject(bounds);
    this._renderAt = C.Helpers.viewport._resolution;
    var startTime = Date.now();
    var i = 0;
    while (this._toInvalidateAndRender.length > 0) {
        var toInvalidateAndRender = this._toInvalidateAndRender.splice(0, 1);
        C.Helpers.customRenderer.layerUpdatePositions.call(C.Helpers.customRenderer,
                                                           toInvalidateAndRender[0].objects,
                                                           C.System.Viewport.zoomDirection.IN);
        this._renderingTexture.render(toInvalidateAndRender[0].container, null, i++ == 0);
        if (Date.now() - startTime > 20) {
            this._aFrameID = requestAnimationFrame(this._deferedInvalidateAndRendering);
            break;
        }
    }

    if (this._sprite) {
        var width = C.Helpers.viewport._width;
        var height = C.Helpers.viewport._height;
        this._sprite.width(width);
        this._sprite.height(height);
        this._sprite.offset(new C.Geometry.Vector2(-width/2, -height/2));
    }
    //    C.Helpers.customRenderer.layerUpdatePositions.call(C.Helpers.customRenderer,
    //                                                       objects,
    //                                                       C.System.Viewport.zoomDirection.IN);
    //    this.render();
};

C.Geo.PerformanceLayer.prototype.frame = function () {
    if (!this._dirty) { return; }
    this.render();
    this._dirty = false;
};

C.Geo.PerformanceLayer.prototype.addLayer = C.Geo.PerformanceLayer.prototype.addFeature = C.Geo.PerformanceLayer.prototype.add = function (f) {
    this._root.add.apply(this._root, arguments);
    this._quadtree.insert(f);
    return;
};

C.Geo.PerformanceLayer.prototype.removeLayer = C.Geo.PerformanceLayer.prototype.removeFeature = C.Geo.PerformanceLayer.prototype.remove = function () {
    this._quadtree.remove(f);
    return this._root.remove.apply(this._root, arguments);
};

C.Geo.PerformanceLayer.prototype.moveLayer = C.Geo.PerformanceLayer.prototype.moveFeature = C.Geo.PerformanceLayer.prototype.move = function () {
    return this._root.move.apply(this._root, arguments);
};

C.Geo.PerformanceLayer.prototype.clearLayer = function () {
    this._quadtree.clear();
    this._root.clearLayer.apply(this._root, arguments);
    this.render();
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
