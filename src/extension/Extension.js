/*
 *  C.Extension.Extension //TODO description
 */

'use strict';

C.Extension.AR_STRINGS_LOCALIZATION = 'strings.json';
C.Extension.AR_PACKAGE = 'package.json';

C.Extension.Extension = function (handle, layerManager) {

    if (!handle || !handle.file(C.Extension.AR_PACKAGE)) {
        return (null);
    }
    this.handle = handle;

    var localization;
    if (this.handle.file(C.Extension.AR_STRINGS_LOCALIZATION)) {
        try {
            localization = JSON.parse(this.handle.file(C.Extension.AR_STRINGS_LOCALIZATION).asText());
        } catch (e) {
            localization = {};
        }
    } else {
        localization = {};
    }

    this.module = new C.Extension.Module(this, localization, layerManager);

    this.package = JSON.parse(this.handle.file(C.Extension.AR_PACKAGE).asText());
};

//TODO put strings in global file
C.Extension.Extension.prototype.run = function () {
    var start_script = this.package.main || 'src/main.js';

    if (!this.handle.file(start_script)) {
        return (false);
    }

    this.setupEnvironment();

    C.Extension.Require.call(this, start_script);
};

C.Extension.Extension.prototype.setupEnvironment = function () {
    this.currentPath = "";
    this.module.global.strings = this.module.strings;
    this.module.global.trigger = C.Extension.UI.Trigger.bind(this);
    this.module.global.sendMessage = C.Extension.Manager.sendMessage.bind(this);
};

//TODO make plateform independent
C.Extension.Extension.init = function (rootDiv) {
    var container = document.createElement('div');
    container.className = 'extensions-container';
    rootDiv.appendChild(container);
    return container;
};
