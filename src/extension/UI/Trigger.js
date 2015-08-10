/*
 *  C.Extension.UI.Trigger //TODO description
 */

'use strict';

C.Extension.UI.Trigger = function (funct) {
    if (typeof funct == 'function') {

        var args = Array.prototype.slice.call(arguments, 1);
        if (args.length == 0)
            args = undefined;

        var _ = funct.bind(this.module.global, args);
        var id = this.module.ui.register(_);
        return ('C.Extension.Manager.Bridge(\'' + this.package.name + '\', ' + id + ');');

    }
};
