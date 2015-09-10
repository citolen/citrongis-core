/*
 *  C.Layer.Tile.TileSchema //TODO description
 */

'use strict';

C.Layer.Tile.yAxis = {
    NORMAL: 0,
    INVERTED: 1
};

C.Layer.Tile.TileSchema = C.Utils.Inherit(function (base, option) {
    this._extent = option.extent;

    this._tileWidth = option.tileWidth;

    this._tileHeight = option.tileHeight;

    this._resolutions = option.resolutions;

    this._yAxis = option.yAxis;

    this._originX = option.originX;

    this._originY = option.originY;

    this._bounds = [];

    this._resolution = 0;

    this.calculateBounds();

    /*
    **  Tile hashmap
    */
    this._unchangedTiles = {};
    this._removedTiles = {};
    this._addedTiles = {};

}, EventEmitter, 'C.Layer.Tile.TileSchema');

C.Layer.Tile.TileSchema.prototype.register = function () {
    this._unchangedTiles = {};
    this.emit('register');
};

C.Layer.Tile.TileSchema.prototype.unregister = function () {
    this.emit('unregister');
};

C.Layer.Tile.TileSchema.prototype.tileToWorld = function (tileIndex, resolutionId) {
    throw 'Not implemented';
};

C.Layer.Tile.TileSchema.prototype.worldToTile = function (world, resolutionId) {
    throw 'Not implemented';
};

C.Layer.Tile.TileSchema.prototype.calculateBounds = function () {
    for (var i = 0; i < this._resolutions.length; ++i) {
        this._bounds[i] = 1 << i;
    }
};

C.Layer.Tile.TileSchema.prototype.getZoomLevel = function (resolution) {
    for (var i = 0; i < this._resolutions.length; ++i) {
        var res = this._resolutions[i];
        if (resolution > res && !C.Utils.Comparison.Equals(resolution, res)) {
            i = (i > 0) ? (i - 1) : (0);
            return (i);
        }
    }
    return (this._resolutions.length - 1);
};

C.Layer.Tile.TileSchema.prototype.fitToBounds = function (point, bound, floor) {
    if (floor) {
        point._x = Math.floor(point._x);
        point._y = Math.floor(point._y);
    }
    if (point._x < 0)
        point._x = 0;
    if (point._y < 0)
        point._y = 0;
    if (point._x > bound)
        point._x = bound;
    if (point._y > bound)
        point._y = bound;
};

C.Layer.Tile.TileSchema.prototype._mergeTiles = function () {
    for (var key in this._addedTiles) {
        this._unchangedTiles[key] = this._addedTiles[key];
    }
};

C.Layer.Tile.TileSchema.prototype.getCurrentTiles = function () {
    var result = {};

    for (var key in this._unchangedTiles) {
        result[key] = this._unchangedTiles[key];
    }
    for (var key in this._addedTiles) {
        result[key] = this._addedTiles[key];
    }
    return (result);
};

C.Layer.Tile.TileSchema.prototype.isTileInView = function (tileIndex) {
    if (tileIndex._BId in this._unchangedTiles)
        return (true);
    if (tileIndex._BId in this._addedTiles)
        return (true);
    return (false);
};

C.Layer.Tile.TileSchema.prototype.tileToPoly = function (tile, resolution, size, rotation) {
    //TODO: use yAxis

    var x = Math.floor(tile._x);
    var y = Math.floor(tile._y);

    var tcenter = this.tileToWorld(new C.Layer.Tile.TileIndex(x + 0.5, y + 0.5, tile._z, tile._BId), resolution, size);
    var half = (size / 2) * resolution;
    var topLeft = new C.Geometry.Vector2(tcenter.X - half, tcenter.Y + half);
    var topRight = new C.Geometry.Vector2(tcenter.X + half, tcenter.Y + half);
    var bottomLeft = new C.Geometry.Vector2(tcenter.X - half, tcenter.Y - half);
    var bottomRight = new C.Geometry.Vector2(tcenter.X + half, tcenter.Y - half);

    return ([
        [topLeft.X, topLeft.Y],
        [topRight.X, topRight.Y],
        [bottomRight.X, bottomRight.Y],
        [bottomLeft.X, bottomLeft.Y]
    ]);
};

C.Layer.Tile.TileSchema.prototype.computeTiles = function (viewport) {
    if (!C.Utils.Comparison.Equals(viewport._rotation, 0)) { // Compute tile with rotation

        var resolution = viewport._resolution;
        var rotation = viewport._rotation;
        var zoom = this.getZoomLevel(resolution);
        this._resolution = this._resolutions[zoom];

        var size = this._resolution / resolution * this._tileWidth;
        var bound = this._bounds[zoom];

        var center = this.worldToTile(viewport._origin, resolution, size);
        center._x = Math.floor(center._x);
        center._y = Math.floor(center._y);

        var polyBox = [
            [ viewport._bbox._topLeft.X, viewport._bbox._topLeft.Y ],
            [ viewport._bbox._topRight.X, viewport._bbox._topRight.Y ],
            [ viewport._bbox._bottomRight.X, viewport._bbox._bottomRight.Y ],
            [ viewport._bbox._bottomLeft.X, viewport._bbox._bottomLeft.Y ]
        ];

        var self = this;

        var explored = {};
        var cost = 0;
        var tiles = {};
        this._mergeTiles();
        var addedTilesCount = 0;
        this._addedTiles = {};  // reset added tiles
        var removedTilesCount = 0;
        this._removedTiles = {}; // reset removed tiles

        (function rSearch(tile) {

            explored[tile._BId] = 1;

            var tilePoly = self.tileToPoly(tile, resolution, size, rotation);

            if (C.Helpers.IntersectionHelper.polygonContainsPolygon(polyBox, tilePoly)) {
                // tile is in bbox

                if (tile._x >= 0 && tile._x < bound && tile._y >= 0 && tile._y < bound) {
                    // this is a valid tile in view
                    tiles[tile._BId] = tile;
                    if (!(tile._BId in self._unchangedTiles)) { // this is a new tile
                        self._addedTiles[tile._BId] = tile;
                        ++addedTilesCount;
                    }
                }
                var x = Math.floor(tile._x);
                var y = Math.floor(tile._y);

                var neighbours = [
                    C.Layer.Tile.TileIndex.fromXYZ(x - 1, y     , tile._z),
                    C.Layer.Tile.TileIndex.fromXYZ(x + 1, y     , tile._z),
                    C.Layer.Tile.TileIndex.fromXYZ(x    , y - 1 , tile._z),
                    C.Layer.Tile.TileIndex.fromXYZ(x    , y + 1 , tile._z)
                ];

                for (var i = 0; i < 4; ++i) {
                    if (!(neighbours[i]._BId in explored))
                        rSearch(neighbours[i]);
                }
            }
        })(center);

        /** Compute removed tiles **/
        for (var key in this._unchangedTiles) {
            if (!(key in tiles)) { // this is a removed tile
                this._removedTiles[key] = this._unchangedTiles[key];
                delete this._unchangedTiles[key];
                ++removedTilesCount;
            }
        }

        if (removedTilesCount > 0) {
            this.emit('removedTiles', this._removedTiles, viewport);
        }
        if (addedTilesCount > 0) {
            this.emit('addedTiles', this._addedTiles, viewport);
        }

    } else {

        var zoom = this.getZoomLevel(viewport._resolution);
        this._resolution = this._resolutions[zoom];

        var size = this._resolution / viewport._resolution * this._tileWidth;

        var topLeft = this.worldToTile(viewport._bbox._topLeft, viewport._resolution, size);
        var topRight = this.worldToTile(viewport._bbox._topRight, viewport._resolution, size);
        var bottomRight = this.worldToTile(viewport._bbox._bottomRight, viewport._resolution, size);
        var bottomLeft = this.worldToTile(viewport._bbox._bottomLeft, viewport._resolution, size);

        var bound = this._bounds[zoom];

        this.fitToBounds(topLeft, bound, true);
        this.fitToBounds(topRight, bound);
        this.fitToBounds(bottomRight, bound);
        this.fitToBounds(bottomLeft, bound);



        var tiles = {};

        this._mergeTiles();
        var addedTilesCount = 0;
        this._addedTiles = {};  // reset added tiles
        var removedTilesCount = 0;
        this._removedTiles = {}; // reset removed tiles

        for (var y = topLeft._y; y < bottomLeft._y; ++y) {
            for (var x = topLeft._x; x < topRight._x; ++x) {
                var tile = C.Layer.Tile.TileIndex.fromXYZ(x, y, zoom);
                tiles[tile._BId] = tile;
                if (!(tile._BId in this._unchangedTiles)) { // this is a new tile
                    this._addedTiles[tile._BId] = tile;
                    ++addedTilesCount;
                }
            }
        }

        /** Compute removed tiles **/
        for (var key in this._unchangedTiles) {
            if (!(key in tiles)) { // this is a removed tile
                this._removedTiles[key] = this._unchangedTiles[key];
                delete this._unchangedTiles[key];
                ++removedTilesCount;
            }
        }

        if (removedTilesCount > 0) {
            this.emit('removedTiles', this._removedTiles, viewport);
        }
        if (addedTilesCount > 0) {
            this.emit('addedTiles', this._addedTiles, viewport);
        }
    }
};
