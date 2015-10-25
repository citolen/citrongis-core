/*
 *  C.Geo.Feature.Image //TODO description
 */

'use strict';

/**
 * Creates a georeferenced Image
 *
 * @class Image
 * @namespace C
 * @extends C.Feature
 * @constructor
 * @param {Object} [options] Data
 * @param {C.Point} options.location Coordinates of the Image.
 * @param {String} [options.source] Relative or absolute link to a source image.
 * @param {Number} [options.width] Width in pixel of the Image.
 * @param {Number} [options.height] Height in pixel of the Image.
 * @param {Number} [options.anchorX] AnchorX [0->1] of the Image.
 * @param {Number} [options.anchorY] AnchorY [0->1] of the Image.
 * @param {Number} [options.rotation] Rotation of the Image.
 * @param {C.ImageScaleMode} [options.scaleMode] ScaleMode(filter) of the Image.
 * @param {Number} [options.opacity] Opacity of the Image.
 * @param {Object} [options.metadata] Dictionary of metadata.
 * @example
 *      var image = C.Image({
 *          location: C.LatLng(0, 0),
 *          source: 'http://...',
 *          width: 10,
 *          height: 10,
 *          anchorX: 0.5,
 *          anchorY: 1,
 *          rotation: 0,
 *          scaleMode: C.ImageScaleMode.DEFAULT
 *      });
 *      image.on('loaded', function (self) {...});
 *      image.on('error', function (self) {...});
 *      image.load();
 */
/**
 * Image successfully loaded
 * @event loaded
 * @param {C.Image} self
 */
/**
 * Image failed to load
 * @event error
 * @param {C.Image} self
 */
C.Geo.Feature.Image = C.Utils.Inherit(function (base, options) {
    base(C.Geo.Feature.Feature.FeatureType.IMAGE, options);

    if (options === undefined || options.location === undefined) {
        throw 'Invalid Argument';
    }

    this._location = options.location;

    this._source = options.source || undefined;

    this._width = options.width || 42;

    this._height = options.height || 42;

    this._anchorX = options.anchorX || 0;

    this._anchorY = options.anchorY || 0;

    this._rotation = options.rotation || 0;

    this._scaleMode = options.scaleMode || C.Geo.Feature.Image.ScaleMode.DEFAULT;

}, C.Geo.Feature.Feature, 'C.Geo.Feature.Image');

/*
 *  Constructor
 */
C.Geo.Feature.Image_ctr = function (args) {
    return C.Geo.Feature.Image.apply(this, args);
};
C.Geo.Feature.Image_ctr.prototype = C.Geo.Feature.Image.prototype;
C.Geo.Feature.Image_new_ctr = function () {
    var obj = new C.Geo.Feature.Image_ctr(arguments)
    obj._context = this
    return obj
};

/**
 * Enum scale modes.
 * C.ImageScaleMode.DEFAULT
 * C.ImageScaleMode.NEAREST
 *
 * @class ImageScaleMode
 * @namespace C
 * @static
 * @public

 */
/**
 * Nearest filter (use this if image is blurry)
 * @property NEAREST
 * @type Enum
 */
/**
 * Default filter
 * @property DEFAULT
 * @type Enum
 */
C.Geo.Feature.Image.ScaleMode = {
    DEFAULT: 0,
    NEAREST: 1
};

C.Geo.Feature.Image.MaskIndex = {
    LOCATION: 1,
    SOURCE: 2,
    WIDTH: 4,
    HEIGHT: 8,
    ANCHORX: 16,
    ANCHORY: 32,
    ROTATION: 64,
    SCALEMODE: 128
};

/**
 * @class Image
 * @namespace C
 */
/**
 * Returns the current location or sets a new one if an argument is given.
 *
 * @method location
 * @public
 * @param {C.Point} [location] New coordinates of the Image.
 * @return {C.Point} Current or new location.
 */
C.Geo.Feature.Image.prototype.location = function (location) {
    if (location === undefined) {
        return this._location;
    }

    this._location = location;
    this._mask |= C.Geo.Feature.Image.MaskIndex.LOCATION;
    this.emit('locationChanged', location);
    this.makeDirty();
    return this._location;
};

/**
 * Load the source.
 *
 * @method load
 * @public
 */
C.Geo.Feature.Image.prototype.load = function () {
    if (!this._source) {
        return;
    }

    C.Helpers.RendererHelper.Image.load(this);
};

C.Geo.Feature.Image.prototype.crop = function (crop) {
    return C.Helpers.RendererHelper.Image.crop(this, crop);
};

C.Geo.Feature.Image.prototype.copy = function () {
    return C.Helpers.RendererHelper.Image.copy(this);
};

/**
 * Changes and loads a new source or return the current source.
 *
 * @method source
 * @public
 * @param {String} [source] New source.
 * @return {String} Current or new source.
 */
C.Geo.Feature.Image.prototype.source = function (source) {
    if (source === undefined || this._source === source) {
        return this._source;
    }

    this._source = source;
    this.load();
    return this._source;
};

/**
 * Returns the current width or sets a new one if an argument is given.
 *
 * @method width
 * @public
 * @param {Number} [width] New width of the Image.
 * @return {Number} Current or new width.
 */
C.Geo.Feature.Image.prototype.width = function (width) {
    if (width === undefined || this._width === width) {
        return this._width;
    }

    this._width = width;
    this._mask |= C.Geo.Feature.Image.MaskIndex.WIDTH;
    this.emit('widthChanged', width);
    this.makeDirty();
    return this._width;
};

/**
 * Returns the current height or sets a new one if an argument is given.
 *
 * @method height
 * @public
 * @param {Number} [height] New height of the Image.
 * @return {Number} Current or new height.
 */
C.Geo.Feature.Image.prototype.height = function (height) {
    if (height === undefined || this._height === height) {
        return this._height;
    }

    this._height = height;
    this._mask |= C.Geo.Feature.Image.MaskIndex.HEIGHT;
    this.emit('heightChanged', height);
    this.makeDirty();
    return this._height;
};

/**
 * Returns the current anchorX or sets a new one if an argument is given.
 *
 * @method anchorX
 * @public
 * @param {Number} [anchorX] New anchorX of the Image.
 * @return {Number} Current or new anchorX.
 */
C.Geo.Feature.Image.prototype.anchorX = function (anchorX) {
    if (anchorX === undefined || this._anchorX === anchorX) {
        return this._anchorX;
    }

    this._anchorX = anchorX;
    this._mask |= C.Geo.Feature.Image.MaskIndex.ANCHORX;
    this.emit('anchorXChanged', anchorX);
    this.makeDirty();
    return this._anchorX;
};

/**
 * Returns the current anchorY or sets a new one if an argument is given.
 *
 * @method anchorY
 * @public
 * @param {Number} [anchorY] New anchorY of the Image.
 * @return {Number} Current or new anchorY.
 */
C.Geo.Feature.Image.prototype.anchorY = function (anchorY) {
    if (anchorY === undefined || this._anchorY === anchorY) {
        return this._anchorY;
    }

    this._anchorY = anchorY;
    this._mask |= C.Geo.Feature.Image.MaskIndex.ANCHORY;
    this.emit('anchorYChanged', anchorY);
    this.makeDirty();
    return this._anchorY;
};

/**
 * Returns the current rotation or sets a new one if an argument is given.
 *
 * @method rotation
 * @public
 * @param {Number} [rotation] New rotation of the Image.
 * @return {Number} Current or new rotation.
 */
C.Geo.Feature.Image.prototype.rotation = function (rotation) {
    if (rotation === undefined || this._rotation == rotation) {
        return this._rotation;
    }

    this._rotation = rotation;
    this._mask |= C.Geo.Feature.Image.MaskIndex.ROTATION;
    this.emit('rotationChanged', rotation);
    this.makeDirty();
    return this._rotation;
};

/**
 * Returns the current scaleMode or sets a new one if an argument is given.
 *
 * @method scaleMode
 * @public
 * @param {Number} [scaleMode] New scaleMode of the Image.
 * @return {Number} Current or new scaleMode.
 */
C.Geo.Feature.Image.prototype.scaleMode = function (scaleMode) {
    if (scaleMode === undefined || this._scaleMode == scaleMode) {
        return this._scaleMode;
    }

    this._scaleMode = scaleMode;
    this._mask |= C.Geo.Feature.Image.MaskIndex.SCALEMODE;
    this.emit('scaleModeChanged', scaleMode);
    this.makeDirty();
    return this._scaleMode;
};

/**
 * Returns the bounds of the image.
 *
 * @method getBounds
 * @public
 * @return {C.Bounds} Bounds of the image.
 */
C.Geo.Feature.Image.prototype.getBounds = function () {
    return new C.Geometry.Bounds(this._location);
};
