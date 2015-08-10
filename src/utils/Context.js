/*
 *  C.Utils.Context.copy    //TODO description
 */

C.Utils.Context.copy = function (oldContext, path) {
    var newContext = C.Utils.Object.copy(oldContext);
    newContext.currentPath = path;
    return (newContext);
};
