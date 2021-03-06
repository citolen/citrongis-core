/*
 *  C.Layer.Tile.Schema.SphericalMercator //TODO description
 */

'use strict';

/**
 * TileSchema
 *
 * @class TileSchema
 * @namespace C
 */
/**
 * SphericalMercatorRetina WGS84 512px maxzoom: 21
 * @property SphericalMercatorRetina
 * @type C.TileSchema
 * @example
 *      C.TileSchema.SphericalMercatorRetina
 */
C.Layer.Tile.Schema.SphericalMercatorRetina = C.Utils.Inherit(function (base) {
    base({

        extent: new C.Geometry.Extent(-20037508.342789,
                                      -20037508.342789,
                                      20037508.342789,
                                      20037508.342789),

        tileWidth:  512,
        tileHeight: 512,

        yAxis: C.Layer.Tile.yAxis.INVERTED,

        resolutions: [78271.516950000, 39135.758475000, 19567.879237500,
                      9783.939618750, 4891.969809375, 2445.984904688, 1222.992452344,
                      611.496226172, 305.748113086, 152.874056543, 76.437028271,
                      38.218514136, 19.109257068, 9.554628534, 4.777314267,
                      2.388657133, 1.194328567, 0.597164283, 0.29858214168548586, 0.14929107084274293, 0.07464553542137146],

        originX: -20037508.342789,
        originY: -20037508.342789
    });

}, C.Layer.Tile.TileSchema, 'C.Layer.Tile.Schema.SphericalMercatorRetina');

C.Layer.Tile.Schema.SphericalMercatorRetina.prototype.tileToWorld = function (tileIndex, resolution, size, anchor) {
    size = size || this._tileWidth;
    anchor = anchor || 0;
    var sizeInMeter = size * resolution;
    var worldX = this._extent._minX + (tileIndex._x + anchor) * sizeInMeter;
    var worldY = (tileIndex._y + anchor) * sizeInMeter
    if (this.yAxis == C.Layer.Tile.yAxis.NORMAL) {
        worldY = this._extent._minY + worldY;
    } else {
        worldY = this._extent._maxY - worldY;
    }
    return (new C.Geometry.Vector2(worldX, worldY));
};

C.Layer.Tile.Schema.SphericalMercatorRetina.prototype.worldToTile = function (world, resolution, size) {
    size = size || this._tileWidth;
    var sizeInPixel = resolution * size;
    var tileX = (world.X - this._extent._minX) / sizeInPixel;
    var tileY = world.Y;
    if (this._yAxis == C.Layer.Tile.yAxis.NORMAL)
        tileY = tileY - this._extent._minY;
    else
        tileY = this._extent._maxY - tileY;
    tileY = tileY / sizeInPixel;
    var tileZ = this.getZoomLevel(resolution);
    return (C.Layer.Tile.TileIndex.fromXYZ(tileX, tileY, tileZ));
};

C.Layer.Tile.Schema.SphericalMercatorRetina = new C.Layer.Tile.Schema.SphericalMercatorRetina();
