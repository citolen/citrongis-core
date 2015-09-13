/*
 *  C.Extension.Extension //TODO description
 */

'use strict';

C.Extension.AR_STRINGS_LOCALIZATION = 'strings.json';
C.Extension.AR_PACKAGE = 'package.json';

C.Extension.Extension = function (handler, layerManager, callback) {

    var self = this;

    this._resources = new C.Extension.ExtensionResources(handler, function (err) {

        if (err) { return callback(err); }

        self._resources.file(C.Extension.AR_STRINGS_LOCALIZATION, function (err, strings_handle) {
            var localization = {};
            if (strings_handle) {
                localization = JSON.parse(strings_handle.asText());
            }
            self._module = new C.Extension.Module(self, localization, layerManager);

            self._resources.file(C.Extension.AR_PACKAGE, function (err, package_handle) {
                self._package = JSON.parse(package_handle.asText());

                callback(null, self);
            });
        });
    });
};

//C.Extension.Extension.prototype.loadLocalization = function () {
//
//    var localization;
//    if (this.handle.file(C.Extension.AR_STRINGS_LOCALIZATION)) {
//        try {
//            localization = JSON.parse(this.handle.file(C.Extension.AR_STRINGS_LOCALIZATION).asText());
//        } catch (e) {
//            localization = {};
//        }
//    } else {
//        localization = {};
//    }
//
//
//};

//TODO put strings in global file
C.Extension.Extension.prototype.run = function () {
    var start_script = this._package.main || 'src/main.js';
    var self = this;

    this._resources.file(start_script, function (err) {
        if (err) {
            return false;
        }

        self.setupEnvironment();

        C.Extension.Require.call(self, start_script);
    });
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
