/*
 *  C.Extension.Require //TODO description
 */

'use strict';

C.Extension.Require = function (path) {
    //TODO debug
    //console.log('[require]', path, 'from', this.currentPath);

    if (this.handle && this.module && this.package) {
        var filepath = path;

        if (!this.handle.file(filepath) && this.currentPath.lastIndexOf('/') !== -1) {
            filepath = C.Utils.Path.normalize(this.currentPath.substr(0, this.currentPath.lastIndexOf('/')) + '/' + filepath);
        }

        if (!this.handle.file(filepath)) {
            return (undefined);
        }

        if (this.handle.file(filepath)) {

            var content = this.handle.file(filepath).asText();
            var context = C.Utils.Context.copy(this, filepath);
            var fileExtension = path.split('.').pop();

            if (fileExtension === 'js') {
                eval('(function (module, require) {\
                    ' + content + '\
                    }).call(context.module.global, context.module, C.Extension.Require.bind(context));');
            }

            return (content);
        }
    } else {

    }
    return (undefined);
};
