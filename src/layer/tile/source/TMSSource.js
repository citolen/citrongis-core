/*
 *  C.Layer.Tile.Source.TMSSource //TODO description
 */

/**
 * Creates a TMS source. using variable {x},{y},{z} and optionally {server}. Take a look at the example.
 *
 * @class TMSSource
 * @namespace C
 * @extends C.TileSource
 * @constructor
 * @param {Object} options Data
 * @param {String} options.url Url.
 * @param {Array(String)} [options.schema] Servers.
 * @example
 *          var source = C.TMSSource({
 *              url: 'http://{server}.tile.openstreetmap.org/{z}/{x}/{y}.png',
 *              server: ['a', 'b', 'c']
 *          });
 */
C.Layer.Tile.Source.TMSSource = C.Utils.Inherit(function (base, options) {

    // eg: {server}.example.org/{x}/{y}/{z}.png
    this._sourceUrl = options.url;

    // eg: [a, b, c]
    this._sourceServer = options.server;

    this._serverIdx = 0;

}, C.Layer.Tile.Source.TileSource, 'C.Layer.Tile.Source.TMSSource');

/*
 *  Constructor
 */
C.Layer.Tile.Source.TMSSource_ctr = function (args) {
    return C.Layer.Tile.Source.TMSSource.apply(this, args);
};
C.Layer.Tile.Source.TMSSource_ctr.prototype = C.Layer.Tile.Source.TMSSource.prototype;
C.Layer.Tile.Source.TMSSource_new_ctr = function () {
    return new C.Layer.Tile.Source.TMSSource_ctr(arguments);
};

C.Layer.Tile.Source.TMSSource.prototype.tileIndexToUrl = function (tileIndex) {
    var url =   this._sourceUrl.replace('{x}', tileIndex._x);
    url =       url.replace('{y}', tileIndex._y);
    url =       url.replace('{z}', tileIndex._z);

    if (this._sourceServer) {
        url = url.replace('{server}', this._sourceServer[this._serverIdx]);
        this._serverIdx = (this._serverIdx + 1) % this._sourceServer.length;
    }
    return (url);
};
