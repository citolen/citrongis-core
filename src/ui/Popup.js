/*
 *  C.UI.Popup  //TODO description
 */

'use strict';

/**
 * Creates a popup
 *
 * @class Popup
 * @namespace C
 * @constructor
 * @param {C.Feature} feature Feature linked to the popup
 * @param {Object} options Data
 * @param {String} options.content Popup content.
 * @param {Boolean} [options.auto] Open popup when added.
 * @example
 *      var popup = C.Popup(your_feature, {
 *          content: '<span>content</span>'
 *      });
 */
C.UI.Popup = function (feature, options) {
    options = options || {};

    this.feature = feature;
    this._initialized = false;
    this._content = options.content;
    this._opened = false;
    this._initializedCallback = options.initialized;

    this.dom = document.createElement('div');
    this.dom.className = 'popup-container';

    this._wrapper = document.createElement('div');
    this._wrapper.className = 'popup-wrapper';
    this._selector = $(this._wrapper);

    var tip = document.createElement('div');
    tip.className = 'popup-tip-container';
    tip.innerHTML = '<div class="popup-tip"></div>';

    var close = document.createElement('a');
    close.innerHTML = 'x';
    close.className = 'popup-close';
    close.href = '#';

    var self = this;
    close.addEventListener('click', function () {
        self.close();
    });

    this.dom.appendChild(this._wrapper);
    this.dom.appendChild(tip);
    this.dom.appendChild(close);

    if (options.auto) {
        this.open();
    }
};

/*
 *  Constructor
 */
C.UI.Popup_ctr = function (args) {
    return C.UI.Popup.apply(this, args);
};
C.UI.Popup_ctr.prototype = C.UI.Popup.prototype;
C.UI.Popup_new_ctr = function () {
    var obj = new C.UI.Popup_ctr(arguments);
    obj._context = this;
    return obj
};

C.UI.Popup.prototype.$ = function (selector) {
    return this._selector.find(selector);
};

/**
 * Open the popup
 *
 * @method open
 * @public
 * @param {Event} event Event from click event on feature.
 */
C.UI.Popup.prototype.open = function (event) {

    event = event.data.originalEvent;
    this._opened = true;
    if (!this._initialized) {
        this._initialized = true;
        var self = this;
        this._context._module.ui.renderTemplate(this._content, function (err, output) {
            if (err) {
                return;
            }
            self._wrapper.innerHTML = output;
            C.UI.PopupManager.register(self, event);
            if (self._initializedCallback) {
                self._initializedCallback(self);
            }
        });
    } else {
        C.UI.PopupManager.register(this, event);
    }
};

/**
 * Close the popup
 *
 * @method close
 * @public
 */
C.UI.Popup.prototype.close = function () {
    this._opened = false;
    C.UI.PopupManager.unregister(this);
};

C.UI.Popup.prototype.toggle = function (event) {
    if (this._opened) {
        this.close();
    } else {
        this.open(event);
    }
};
