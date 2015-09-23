/*
 *  C.Layer.Tile.TileLayer  //TODO description
 */

'use strict';

C.Layer.Tile.TileLayer = C.Utils.Inherit(function (base, options) {

    base(options);

    // TileSource
    this._source = options.source;

    // TileSchema
    this._schema = options.schema;

    // Tiles in viewport
    this._tileInView = {};

    // Tiles substituing
    this._substitution = {};

    // Tile loading
    this._loading = {};

    // Tile cache
    this._cache = new LRUCache({
        max: 200,
        dispose: function (k, v) {
            if (v.feature.__graphics) {
                v.feature.__graphics.texture.baseTexture.destroy();
            }
        }
    });

    // Loading queue
    this._queue = async.queue(this.loadTile.bind(this), 5);

    // Tiles anchor
    this._anchor = 0.5;

    // Init point, layer has been added
    this.on('added', this.init.bind(this));
    this.on('removed', this.destroy.bind(this));

    this._addedTiles = this.addedTile.bind(this);
    this._removedTiles = this.removedTile.bind(this);
    this._resolutionChange = this.resolutionChange.bind(this);
    this._rotationChange = this.rotationChange.bind(this);

}, C.Geo.Layer, 'C.Layer.Tile.TileLayer');

C.Layer.Tile.TileLayer.prototype.init = function () {
    // Schema events
    this._schema.on('addedTiles', this._addedTiles);
    this._schema.on('removedTiles', this._removedTiles);

    // Viewport Events
    C.Helpers.viewport.on('resolutionChange', this._resolutionChange);
    C.Helpers.viewport.on('rotationChange', this._rotationChange);

    this._schema.register();
    this.addedTile.call(this, this._schema.getCurrentTiles(), C.Helpers.viewport);
};

C.Layer.Tile.TileLayer.prototype.destroy = function () {
    // Schema events
    this._schema.off('addedTiles', this._addedTiles);
    this._schema.off('removedTiles', this._removedTiles);

    // Viewport Events
    C.Helpers.viewport.off('resolutionChange', this._resolutionChange);
    C.Helpers.viewport.off('rotationChange', this._rotationChange);

    this._schema.unregister();

    this.removedTile(this._tileInView, C.Helpers.viewport);
    this._tileInView = {};
    this._substitution = {};
};

C.Layer.Tile.TileLayer.prototype.getTileSize = function () {
    return (this._schema._resolution / C.Helpers.viewport._resolution * this._schema._tileWidth);
};

C.Layer.Tile.TileLayer.prototype.rotationChange = function (viewport) {
    // update all the tile currently in view
    for (var key in this._tileInView) {
        var obj = this._tileInView[key];
        obj.feature.rotation(-viewport._rotation);
        if (C.Utils.Comparison.Equals(viewport._rotation, 0)) {
            obj.feature.scaleMode(C.Geo.Feature.Image.ScaleMode.NEAREST);
        } else {
            obj.feature.scaleMode(C.Geo.Feature.Image.ScaleMode.DEFAULT);
        }
    }

    // update all the substitution tiles
    for (var key in this._substitution) {
        var objs = this._substitution[key].tiles;

        for (var i = 0,j = objs.length; i < j; ++i) {
            var obj = objs[i];
            obj.feature.rotation(-viewport._rotation);
            obj.feature.scaleMode(C.Geo.Feature.Image.ScaleMode.DEFAULT);
        }
    }
};

C.Layer.Tile.TileLayer.prototype.resolutionChange = function () {
    var rsize = this.getTileSize();

    // update all the tile currently in view
    for (var key in this._tileInView) {
        var obj = this._tileInView[key];

        obj.feature.width(rsize);
        obj.feature.height(rsize);
        var location = this._schema.tileToWorld(obj.tile, C.Helpers.viewport._resolution, rsize, this._anchor);
        obj.feature.location(new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs));
        if (C.Utils.Comparison.Equals(rsize, 256) && C.Utils.Comparison.Equals(C.Helpers.viewport._rotation, 0))
            obj.feature.scaleMode(C.Geo.Feature.Image.ScaleMode.NEAREST);
        else
            obj.feature.scaleMode(C.Geo.Feature.Image.ScaleMode.DEFAULT);
    }

    // update all the substitution tiles
    for (var key in this._substitution) {
        var objs = this._substitution[key].tiles;

        for (var i = 0,j = objs.length; i < j; ++i) {
            var obj = objs[i];
            var trsize = rsize;
            if (obj.level != undefined) {
                trsize = rsize / (1 << obj.level);
            }
            obj.feature.width(trsize);
            obj.feature.height(trsize);
            var location = this._schema.tileToWorld(obj.tile, C.Helpers.viewport._resolution, trsize, this._anchor);
            obj.feature.location(new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs));
        }
    }
};

C.Layer.Tile.TileLayer.prototype.loadTile = function (tile, callback) {
    var key = tile._BId;
    delete this._loading[key]; // delete from loading list

    if (!this._schema.isTileInView(tile)) { // if not in view anymore no need to load it
        return callback(true);
    }

    var url = this._source.tileIndexToUrl(tile);
    var rsize = this.getTileSize();

    var location = this._schema.tileToWorld(tile, C.Helpers.viewport._resolution, rsize, this._anchor);
    location = new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs);

    var feature = new C.Geo.Feature.Image({
        location: location,
        width: rsize,
        height: rsize,
        anchorX: this._anchor,
        anchorY: this._anchor,
        source: url,
        scaleMode: (C.Utils.Comparison.Equals(C.Helpers.viewport._rotation, 0)) ? C.Geo.Feature.Image.ScaleMode.NEAREST : C.Geo.Feature.Image.ScaleMode.DEFAULT
    });

    this.addFeature(feature);
    this._tileInView[key] = {
        feature: feature,
        tile: tile
    };

    // image was loaded
    feature.on('loaded', (function (key) {
        if (!(key in this._tileInView)) { // not in view anymore, nothing to do, was already handled
            callback(true);
            return;
        }

        this._cache.set(key, this._tileInView[key]);
        feature.rotation(-C.Helpers.viewport._rotation);
        this.tileLoaded.call(this, key);
        callback();
    }).bind(this, key));

    // image couldn't be loaded successfully
    feature.on('error', (function (key) {
        if (key in this._tileInView) {
            var o = this._tileInView[key];
            if (o.opacity_animation) {
                clearTimeout(o.opacity_animation);
            }
            this.removeFeature(o.feature);
        }
        callback(true);
    }).bind(this, key));

    feature.load();
};

C.Layer.Tile.TileLayer.prototype.tileLoaded = function (key, noanim) {

    if (noanim)return;

    var self = this;

    var o = this._tileInView[key];
    o.feature.opacity(0);

    (function f() {
        var opacity = o.feature.opacity() + 0.1;
        o.feature.opacity(opacity);

        if (opacity < 1)
            o.opacity_animation = setTimeout(f, 25);
        else {
            o.feature.opacity(1);
            delete o.opacity_animation;
            self.deleteSubstitute(key);
        }
    })();
};

C.Layer.Tile.TileLayer.prototype.addedTile = function (addedTiles, viewport) {
    var self = this;
    var rsize = this.getTileSize();

    for (var key in addedTiles) {
        var tile = addedTiles[key];

        var item = this._cache.get(key);

        if (item) { // Tile was already in cache
            this._tileInView[key] = item;
            item.feature.width(rsize);
            item.feature.height(rsize);
            item.feature.rotation(-viewport._rotation);
            item.feature.scaleMode((C.Utils.Comparison.Equals(viewport._rotation, 0)) ? C.Geo.Feature.Image.ScaleMode.NEAREST : C.Geo.Feature.Image.ScaleMode.DEFAULT);
            var location = this._schema.tileToWorld(item.tile, C.Helpers.viewport._resolution, rsize, this._anchor);
            item.feature.location(new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs));
            item.feature.opacity(1);
            this.addFeature(item.feature);
            continue;

        } else if (!(key in this._loading)) { // Add the tile to the loading queue
            this._loading[key] = true;
            this._queue.push(tile);
        }

        if (!(key in this._substitution)) { // create substitution to cover the missing tile
            this.createSubstitute(tile, viewport._zoomDirection);
        }
    }
};

C.Layer.Tile.TileLayer.prototype.createSubstitute = function (tile, zoomDirection) {
    var trsize = this.getTileSize();

    if (zoomDirection == C.System.Viewport.zoomDirection.OUT) {
        var self = this;
        var substituteTiles = [];
        var coverage = (function explore(tile, level) {

            var children = tile.levelDown();
            var cover = 0;
            for (var i = 0; i < 4; ++i) {
                var child = children[i];
                var childObj = self._cache.get(child._BId);

                if (childObj) {
                    substituteTiles.push({
                        tile: child,
                        origin: childObj,
                        level: level
                    });
                    ++cover;
                } else if (child._z < self._schema._resolutions.length && level < 3) {
                    if (explore(child, level + 1) != 4)
                        return 0;
                }
            }
            return cover;
        })(tile, 1);

        if (coverage == 4) {

            var tiles = [];
            for (var i = 0, j = substituteTiles.length; i < j; ++ i) {
                var substitute = substituteTiles[i];

                var img = substitute.origin.feature.copy();
                var rsize = trsize / (1 << substitute.level);

                var location = this._schema.tileToWorld(substitute.tile, C.Helpers.viewport._resolution, rsize, this._anchor);
                img._location = new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs);
                img._width = rsize;
                img._height = rsize;
                img._scaleMode = C.Geo.Feature.Image.ScaleMode.DEFAULT;
                img._rotation = -C.Helpers.viewport._rotation;
                tiles.push({
                    feature: img,
                    tile: substitute.tile,
                    level: substitute.level
                });
                this.addFeature(img);
            }

            this._substitution[tile._BId] = {
                tiles: tiles
            };

            return;
        }
    }

    var current = tile;
    while (current._z > 0) {
        var parent = current.levelUp();

        var parentObj = this._cache.get(parent._BId);
        if (parentObj) {
            var position = parent.positionInTile(tile);
            var size = this._schema._tileWidth / position.pZ;

            var tmp = parentObj.feature.crop(new C.Geometry.Rectangle(position.x * this._schema._tileWidth, position.y * this._schema._tileHeight, size, size));


            var location = this._schema.tileToWorld(tile, C.Helpers.viewport._resolution, trsize, this._anchor);
            tmp._location = new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs);
            tmp._width = trsize;
            tmp._height = trsize;
            tmp._scaleMode = C.Geo.Feature.Image.ScaleMode.DEFAULT;
            tmp._rotation = -C.Helpers.viewport._rotation;
            this.addFeature(tmp);

            this._substitution[tile._BId] = {
                tiles: [{
                    feature: tmp,
                    tile: tile
                }]
            };
            break;
        }

        current = parent;
    }
};

C.Layer.Tile.TileLayer.prototype.deleteSubstitute = function (key) {
    if (!(key in this._substitution)) {
        return;
    }
    var o = this._substitution[key];
    for (var i = 0, j = o.tiles.length; i < j; ++i) {
        this.removeFeature(o.tiles[i].feature);
    }
    delete this._substitution[key];
};

C.Layer.Tile.TileLayer.prototype.removedTile = function (removedTiles, viewport) {
    for (var key in removedTiles) {
        this.deleteSubstitute(key);
        if (key in this._tileInView) {
            var o = this._tileInView[key];
            if (o.opacity_animation) {
                clearTimeout(o.opacity_animation);
            }
            this.removeFeature(o.feature);
            delete this._tileInView[key];
        }
    }
};
