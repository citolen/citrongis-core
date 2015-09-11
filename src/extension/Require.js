/*
 *  C.Extension.Require //TODO description
 */

'use strict';

function handleJavascript (context, handle, callback) {
    eval('(function (E, require) {\
' + handle.asText() + '\
}).call(context._module.global, context._module, C.Extension.Require.bind(context));');
    callback(null);
};

function handleDefault (context, handle, callback) {
    callback(null, handle.asText());
}

function handleExtensionType (context, handle, extension, callback) {
    switch (extension) {
        case 'js':
            handleJavascript(context, handle, callback);
            break;
        default:
            handleDefault(context, handle, callback);
            break;
    }
};

C.Extension.Require = function (path, callback) {
    //TODO debug
    //console.log('[require]', path, 'from', this.currentPath);

    if (!callback) { callback = function(){}; }

    var self = this;
    var pathType = C.Utils.Path.getType(path);
    switch (pathType) {
        case 0: //web
            break;
        case 1: //relative to app

            this._resources.file(path, function (err, handle) {
                if (err) {
                    return callback(err);
                }

                handleExtensionType(self, handle, C.Utils.Path.getExtension(path), callback);
            });
            break;
    }

    //    if (this.handle && this.module && this.package) {
    //        var filepath = path;
    //
    //        if (!this.handle.file(filepath) && this.currentPath.lastIndexOf('/') !== -1) {
    //            filepath = C.Utils.Path.normalize(this.currentPath.substr(0, this.currentPath.lastIndexOf('/')) + '/' + filepath);
    //        }
    //
    //        if (!this.handle.file(filepath)) {
    //            return (undefined);
    //        }
    //
    //        if (this.handle.file(filepath)) {
    //
    //            var content = this.handle.file(filepath).asText();
    //            var context = C.Utils.Context.copy(this, filepath);
    //            var fileExtension = path.split('.').pop();
    //
    //            if (fileExtension === 'js') {
    //                eval('(function (module, require) {\
    //                    ' + content + '\
    //                    }).call(context.module.global, context.module, C.Extension.Require.bind(context));');
    //            }
    //
    //            return (content);
    //        }
    //    } else {
    //
    //    }
    //    return (undefined);
};
