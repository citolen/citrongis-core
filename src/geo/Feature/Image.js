/*
 *  C.Geo.Feature.Image //TODO description
 */

'use strict';

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
    return new C.Geo.Feature.Image_ctr(arguments);
};

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

C.Geo.Feature.Image.prototype.source = function (source) {
    if (source === undefined || this._source === source) {
        return this._source;
    }

    this._source = source;
    this.load();
    return this._source;
};

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
