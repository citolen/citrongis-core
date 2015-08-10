/*
 *  C.Utils.Object  //TODO description
 */

C.Utils.Object.copy = function (obj) {
    var copy = {};
    var i;

    for (i in obj) {
        copy[i] = obj[i];
    }
    return (copy);
};
