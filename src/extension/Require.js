/*
 *  C.Extension.Require //TODO description
 */

'use strict';

function handleJavascript (context, handle, callback) {

    var api = C.Extension.API(context);
    var argnames = '';
    var args = [];
    for (var api_key in api) {
        argnames += api_key + ',';
        args.push(api[api_key]);
    }
    argnames = argnames.substr(0, argnames.length-1);

    //context._module, C.Extension.Require.bind(context)

    eval('(function (' + argnames + ') {\
' + handle.asText() + '\
}).apply(context._module.global, args);');
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

            $.get(path, function (err) {
                //TODO handle other type
            }, "text").fail(function () {
                //TODO find a best way
                var oldWrite = document.write;
                document.write = function () {
                    var body = $(document.body);
                    body.append.apply(body, arguments);
                };

                $.getScript(path, function (err) {
                    document.write = oldWrite;
                    callback(err);
                });
            });

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
