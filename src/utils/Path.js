/*
 *  C.Utils.Path    //TODO description
 */

'use strict';

C.Utils.Path.normalize = function (path) {
    var BLANK = '';
    var SLASH = '/';
    var DOT = '.';
    var DOTS = DOT.concat(DOT);
    var SCHEME = '://';


    if (!path || path === SLASH) {
        return SLASH;
    }

    var prependSlash = (path.charAt(0) == SLASH || path.charAt(0) == DOT);
    var target = [];
    var src;
    var scheme;
    var parts;
    var token;

    if (path.indexOf(SCHEME) > 0) {
        parts = path.split(SCHEME);
        scheme = parts[0];
        src = parts[1].split(SLASH);
    } else {
        src = path.split(SLASH);
    }

    for (var i = 0; i < src.length; ++i) {

        token = src[i];

        if (token === DOTS) {
            target.pop();
        } else if (token !== BLANK && token !== DOT) {
            target.push(token);
        }
    }

    var result = target.join(SLASH).replace(/[\/]{2,}/g, SLASH);

    return (scheme ? scheme + SCHEME : '') + (prependSlash ? SLASH : BLANK) + result;
};

C.Utils.Path.getType = function (path) {

    if (path.indexOf('http') != -1) {
        return 0;
    }
    return 1;
};

C.Utils.Path.getExtension = function (path) {
    return path.split('.').pop();
};
