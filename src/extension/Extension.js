/*
 *  C.Extension.Extension //TODO description
 */

'use strict';

C.Extension.AR_STRINGS_LOCALIZATION = 'strings.json';
C.Extension.AR_PACKAGE = 'package.json';

C.Extension.Extension = C.Utils.Inherit(function (base, handler, map, callback) {

    base();

    var self = this;
    self._map = map;
    this._resources = new C.Extension.ExtensionResources(handler, function (err, resources) {

        if (err) { return callback(err); }

        self._resources = resources;

        self._resources.file(C.Extension.AR_STRINGS_LOCALIZATION, function (err, strings_handle) {
            var localization = {};
            if (strings_handle) {
                localization = JSON.parse(strings_handle.asText());
            }
            self._module = new C.Extension.Module(self, localization, self._map._layerManager);

            self._resources.file(C.Extension.AR_PACKAGE, function (err, package_handle) {
                self._package = JSON.parse(package_handle.asText());
                self._storage = new C.Extension.Storage({package_name: self._package.name});
                callback(null, self);
            });
        });
    });
}, EventEmitter, 'C.Extension.Extension');

C.Extension.Extension_ctr = function (handler, callback) {
    new C.Extension.Extension(handler, this._map, function (err, extension) {
        if (err) {
            return callback(err);
        }

        C.Extension.Manager.register(extension);

        extension._module.ui.on('display', function (element, nowindow) {

            element.style.top = '30%';
            element.style.left = '15%';
            extension._map._extDiv.appendChild(element);

            if (!nowindow) {
                $(element).draggable({
                    containment: "#citrongis",
                    scroll: false,
                    handle: '.citrongisextension-header'
                });
            }
        });

        extension._module.ui.on('destroy', function (element) {

            extension._map._extDiv.removeChild(element);

        });

        extension.run(function (err) {
            callback(err, extension);
        });
    });
};

//TODO put strings in global file
C.Extension.Extension.prototype.run = function (callback) {
    var start_script = this._package.main || 'src/main.js';
    var self = this;

    this._resources.file(start_script, function (err) {
        if (err) {
            return false;
        }

        self.setupEnvironment();

        self._module.addLayerToMap();

        C.Extension.Require.call(self, start_script, function (err) {
            if (err) {
                callback(err);
                return self.emit('stopped', self);
            }
            self.emit('started', self);
            callback();
        });
    });
};

C.Extension.Extension.prototype.destroy = function () {

    if (this._destroyed) { return; }
    this._destroyed = true;
    this._module.removeLayerFromMap();
    this._module.ui.destroy();
    C.UI.PopupManager.clearFromContext(this);
    this.emit('stopped', this);
};

C.Extension.Extension.prototype.setupEnvironment = function () {
    this.currentPath = "";
    this._module.global.strings = this._module.strings;
    this._module.global.trigger = C.Extension.UI.Trigger.bind(this);
    this._module.global.sendMessage = C.Extension.Manager.sendMessage.bind(this);
};

//TODO make plateform independent
C.Extension.Extension.init = function (rootDiv) {
    var container = document.createElement('div');
    container.className = 'extensions-container';
    rootDiv.appendChild(container);
    return container;
};
