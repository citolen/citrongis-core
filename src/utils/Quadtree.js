/*
 *  Quadtree.js     Quadtree implementation for spatial optimization
 */
'use strict';

C.Utils.QuadTree = C.Utils.Inherit(function (base, options) {

    base();
    options = options || {};

    var bl_x = options.bl_x || 0;
    var bl_y = options.bl_y || 0;
    var tr_x = options.tr_x || 0;
    var tr_y = options.tr_y || 0;

    this._crs = options.crs;
    this._maxObj = options.maxObj || 10;
    this._maxDepth = options.maxDepth || 18;

    this._root = new QuadNode(bl_x, bl_y, tr_x, tr_y, this._maxObj, 0, this._maxDepth, this._crs);

}, EventEmitter, 'C.Utils.QuadTree');

C.Utils.QuadTree.prototype.insert = function () {
    this._root.insert.apply(this._root, arguments);
};

C.Utils.QuadTree.prototype.remove = function () {
    this._root.remove.apply(this._root, arguments);
};

C.Utils.QuadTree.prototype.clear = function () {
    var bl_x = this._root._bl_x;
    var bl_y = this._root._bl_y;
    var tr_x = this._root._tr_x;
    var tr_y = this._root._tr_y;
    delete this._root;
    this._root = new QuadNode(bl_x, bl_y, tr_x, tr_y, this._maxObj, 0, this._maxDepth, this._crs);
};

C.Utils.QuadTree.prototype.select = function (bounds) {
    if (bounds._crs != this._crs) {
        bounds = bounds.transformTo(this._crs);
    }
    return this._root._select(bounds);
};

C.Utils.QuadTree.prototype.selectObject = function (bounds) {
    if (bounds._crs != this._crs) {
        bounds = bounds.transformTo(this._crs);
    }
    return this._root._selectObject(bounds);
};

var QuadNode = function (bl_x, bl_y, tr_x, tr_y, maxObj, depth, maxDepth, crs, parent) {

    this._bl_x = bl_x;
    this._bl_y = bl_y;

    this._tr_x = tr_x;
    this._tr_y = tr_y;

    this._maxObj = maxObj;
    this._depth = depth;
    this._maxDepth = maxDepth;
    this._crs = crs;

    this._container = new PIXI.Container();
    this._objects = [];
    this._children = [];
    this._parent = parent;
};

var QuadPosition = {
    TOP_LEFT:       0,
    TOP_RIGHT:      1,
    BOTTOM_RIGHT:   2,
    BOTTOM_LEFT:    3
};

QuadNode.prototype._select = function (bounds) {
    var output = [this._container];
    if (this._children.length > 0) {
        for (var i = 0; i < 4; ++i) {
            if (this._children[i]._intersect(bounds)) {
                output = output.concat(this._children[i]._select(bounds));
            }
        }
    }
    return output;
};

QuadNode.prototype._selectObject = function (bounds) {
    var output = [{
        container: this._container,
        objects: this._objects.slice(0)
    }];
    if (this._children.length > 0) {
        for (var i = 0; i < 4; ++i) {
            if (this._children[i]._intersect(bounds)) {
                output = output.concat(this._children[i]._selectObject(bounds));
            }
        }
    }
    return output;
};

QuadNode.prototype._intersect = function (bounds) {
    return !(bounds._bottomLeft.X > this._tr_x ||
             bounds._topRight.X < this._bl_x ||
             bounds._topRight.Y < this._bl_y ||
             bounds._bottomLeft.Y > this._tr_y);
};

QuadNode.prototype._checkItFits = function (bounds) {
    if (bounds._bottomLeft.X < this._bl_x) { return false; }
    if (bounds._bottomLeft.Y < this._bl_y) { return false; }
    if (bounds._topRight.X > this._tr_x) { return false; }
    if (bounds._topRight.Y > this._tr_y) { return false; }
    return true;
};

QuadNode.prototype.getCoveragePosition = function (bounds) {

    var bl_x_h = this._bl_x + ((this._tr_x - this._bl_x) / 2.0);
    var bl_y_h = this._bl_y + ((this._tr_y - this._bl_y) / 2.0);

    if (bounds._bottomLeft.Y >= bl_y_h &&
        bounds._topRight.Y <= this._tr_y) {
        if (bounds._bottomLeft.X >= this._bl_x &&
            bounds._topRight.X <= bl_x_h) { return QuadPosition.TOP_LEFT; }
        if (bounds._bottomLeft.X >= bl_x_h &&
            bounds._topRight.X <= this._tr_x) { return QuadPosition.TOP_RIGHT; }
    }
    if (bounds._bottomLeft.Y >= this._bl_y &&
        bounds._topRight.Y <= bl_y_h) {
        if (bounds._bottomLeft.X >= this._bl_x &&
            bounds._topRight.X <= bl_x_h) { return QuadPosition.BOTTOM_LEFT; }
        if (bounds._bottomLeft.X >= bl_x_h &&
            bounds._topRight.X <= this._tr_x) { return QuadPosition.BOTTOM_RIGHT; }
    }
    return -1;
};

QuadNode.prototype._insertSelf = function (object, throwEvent) {
    //Insert to this node
    this._objects.push(object);
    this._container.addChild(object.__graphics);
    object.__quadnode = this;

    if (!throwEvent) {
        //        console.log('toto');
        //        this.emit('update', this);
    }
};

QuadNode.prototype._insert = function (bounds, object, throwEvent) {

    // Can be directly inserted
    if (this._objects.length < this._maxObj || this._depth == this._maxDepth) {
        return this._insertSelf(object, throwEvent);
    }

    if (this._children.length < 1) {
        this.divide();
    }
    var coverage = this.getCoveragePosition(bounds);
    if (coverage !== -1) {
        return this._children[coverage]._insert(bounds, object, throwEvent);
    }
    return this._insertSelf(object, throwEvent);
};

QuadNode.prototype.insert = function (object, throwEvent) {

    if (object.__quadnode) { return; }

    var bounds = object.getBounds();

    if (bounds._crs != this._crs) {
        bounds = bounds.transformTo(this._crs);
    }
    this._insert(bounds, object, throwEvent);
};

QuadNode.prototype.remove = function (object, throwEvent) {

    var idx = this._objects.indexOf(object);
    this._objects.splice(idx, 1);
    this._container.removeChild(object.__graphics);
};

QuadNode.prototype.divide = function () {

    var hWidth = (this._tr_x - this._bl_x)     / 2.0;
    var hHeight = (this._tr_y - this._bl_y)    / 2.0;

    this._children.push(
        new QuadNode(this._bl_x, this._bl_y + hHeight, this._bl_x + hWidth, this._tr_y,
                     this._maxObj, this._depth + 1, this._maxDepth, this._crs, this),
        new QuadNode(this._bl_x + hWidth, this._bl_y + hHeight, this._tr_x, this._tr_y,
                     this._maxObj, this._depth + 1, this._maxDepth, this._crs, this),
        new QuadNode(this._bl_x + hWidth, this._bl_y, this._tr_x, this._bl_y + hHeight,
                     this._maxObj, this._depth + 1, this._maxDepth, this._crs, this),
        new QuadNode(this._bl_x, this._bl_y, this._bl_x + hWidth, this._bl_y + hHeight,
                     this._maxObj, this._depth + 1, this._maxDepth, this._crs, this)
    );
};
