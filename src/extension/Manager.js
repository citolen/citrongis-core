/*
 *  C.Extension.Manager //TODO description
 */

'use strict';

C.Extension.Manager = new (C.Utils.Inherit(function (base) {
    base();

    this._extensions = {};

}, EventEmitter))();


C.Extension.Manager.register = function (extension) {
    if (!extension || !extension.handle || !extension.package || !extension.package.name || extension.package.name in this._extensions) {
        return;
    }

    this._extensions[extension.package.name] = extension;
};

C.Extension.Manager.unregister = function (extension) {
    if (!extension || !extension.handle || !extension.package || !extension.package.name || !(extension.package.name in this._extensions)) return;

    this._extensions.splice(this.Extensions.indexOf(extension.package.name), 1);
};

C.Extension.Manager.get = function (extension_name) {
    return (this._extensions[extension_name]);
};

C.Extension.Manager.bridge = function (extension_name, id) {

    'use strict';

    var e = this.get(extension_name);
    if (!e) return;
    e.module.ui.bridge(id);
};

C.Extension.Manager.sendMessage = function (destName) {
    if (destName === undefined) {
        return (false);
    }

    var extension = C.Extension.Manager.get(destName);

    if (!extension || typeof extension.module.global.onmessage !== 'function') {
        return (false);
    }

    var info = {
        from: this.package.name
    };

    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(info);

    extension.module.global.onmessage.apply(extension.module.global, args);

    return (true);
};
