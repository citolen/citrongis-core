/*
 *  C.Geo.Feature.Text //TODO description
 */

'use strict';

/**
 * Creates a georeferenced Text
 *
 * @class Text
 * @namespace C
 * @extends C.Feature
 * @constructor
 * @param {Object} options Data
 * @param {C.Point} options.location Coordinates.
 * @param {String} [options.text] Text.
 * @param {Number} [options.fill] fill in hexa.
 * @param {C.TextAlign} [options.align] Text alignment.
 * @param {String} [options.font] Font string.
 * @param {Array(Number)} [options.anchor] Anchor of the text.
 * @param {Number} [options.opacity] Opacity of the Circle.
 * @param {Object} [options.metadata] Dictionary of metadata.
 * @example
 *      var text = C.Text({
 *          location: C.LatLng(0,0),
 *          text: '0',
 *          font: '15px Arial',
 *          anchor: [0.5, 0.5],
 *          fill: 0xFFFFFF
 *      });
 */
C.Geo.Feature.Text = C.Utils.Inherit(function (base, options) {
    base(C.Geo.Feature.Feature.FeatureType.TEXT, options);

    if (options === undefined || options.location == undefined) {
        throw 'Invalid Argument';
    }

    this._location = options.location;

    this._text = options.text;

    this._fill = options.fill;

    this._align = options.align;

    this._font = options.font;

    this._anchor = options.anchor || [0,0];

}, C.Geo.Feature.Feature, 'C.Geo.Feature.Text');

/*
 *  Constructor
 */
C.Geo.Feature.Text_ctr = function (args) {
    return C.Geo.Feature.Text.apply(this, args);
};
C.Geo.Feature.Text_ctr.prototype = C.Geo.Feature.Text.prototype;
C.Geo.Feature.Text_new_ctr = function () {
    return new C.Geo.Feature.Text_ctr(arguments);
};

C.Geo.Feature.Text.MaskIndex = {
    TEXT: 2,
    FILL: 4,
    ALIGN: 8,
    FONT: 16,
    ANCHOR: 32,
    LOCATION: 64
};

/**
 * Enum TextAlign.
 * C.TextAlign.LEFT
 * C.TextAlign.CENTER
 * C.TextAlign.RIGHT
 *
 * @class TextAlign
 * @namespace C
 * @static
 * @public

 */
/**
 * Align left
 * @property LEFT
 * @type Enum
 */
/**
 * Align center
 * @property CENTER
 * @type Enum
 */
/**
 * Align right
 * @property RIGHT
 * @type Enum
 */
C.Geo.Feature.Text.TextAlign = {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right'
};
/**
 * @class Text
 * @namespace C
 */

/**
 * Returns the current anchor or sets a new one if an argument is given.
 *
 * @method anchor
 * @public
 * @param {Array(Number)} [anchor] New anchor.
 * @return {Array(Number)} Current or new anchor.
 */
C.Geo.Feature.Text.prototype.anchor = function (anchor) {
    if (anchor === undefined || this._anchor === anchor || anchor.constructor !== Array || anchor.length != 2) {
        return this._anchor;
    }

    this._anchor = anchor;
    this._mask |= C.Geo.Feature.Text.MaskIndex.ANCHOR;
    this.emit('anchorChanged', anchor);
    this.makeDirty();
    return this._anchor;
};

/**
 * Returns the current text or sets a new one if an argument is given.
 *
 * @method text
 * @public
 * @param {String} [text] New text.
 * @return {String} Current or new text.
 */
C.Geo.Feature.Text.prototype.text = function (text) {
    if (text === undefined || this._text === text) {
        return this._text;
    }

    this._text = text;
    this._mask |= C.Geo.Feature.Text.MaskIndex.TEXT;
    this.emit('textChanged', text);
    this.makeDirty();
    return this._text;
};

/**
 * Returns the current fill or sets a new one if an argument is given.
 *
 * @method fill
 * @public
 * @param {Number} [fill] New fill.
 * @return {Number} Current or new fill.
 */
C.Geo.Feature.Text.prototype.fill = function (fill) {
    if (fill === undefined || this._fill === fill) {
        return this._fill;
    }

    this._fill = fill;
    this._mask |= C.Geo.Feature.Text.MaskIndex.FILL;
    this.emit('fillChanged', fill);
    this.makeDirty();
    return this._fill;
};

/**
 * Returns the current text align or sets a new one if an argument is given.
 *
 * @method align
 * @public
 * @param {C.TextAlign} [align] New text align.
 * @return {C.TextAlign} Current or new text align.
 */
C.Geo.Feature.Text.prototype.align = function (align) {
    if (align === undefined || this._align === align) {
        return this._align;
    }

    this._align = align;
    this._mask |= C.Geo.Feature.Text.MaskIndex.ALIGN;
    this.emit('alignChanged', align);
    this.makeDirty();
    return this._align;
};

/**
 * Returns the current font or sets a new one if an argument is given.
 *
 * @method font
 * @public
 * @param {Number} [font] New font.
 * @return {Number} Current or new font.
 */
C.Geo.Feature.Text.prototype.font = function (font) {
    if (font === undefined || this._font === font) {
        return this._font;
    }

    this._font = font;
    this._mask |= C.Geo.Feature.Text.MaskIndex.font;
    this.emit('fontChanged', font);
    this.makeDirty();
    return this._font;
};

/**
 * Returns the current location or sets a new one if an argument is given.
 *
 * @method location
 * @public
 * @param {C.Point} [location] New coordinates of the Circle.
 * @return {C.Point} Current or new location.
 */
C.Geo.Feature.Text.prototype.location = function (location) {
    if (location === undefined) {
        return this._location;
    }

    this._location = location;
    this._mask |= C.Geo.Feature.Text.MaskIndex.LOCATION;
    this.emit('locationChanged', location);
    this.makeDirty();
    return this._location;
};

/**
 * Returns the bounds of the circle.
 *
 * @method getBounds
 * @public
 * @return {C.Bounds} Bounds of the circle.
 */
C.Geo.Feature.Text.prototype.getBounds = function () {
    return new C.Geometry.Bounds(this._location);
};
