/*
 *  C.System.Events //TODO description
 */

'use strict';

//TODO make an interface out of it so that each plateform can use their own events

C.System.Events = new (C.Utils.Inherit(function () {

    this._isDown = false;
    this._hasMoved= false;
    this._lastX= undefined;
    this._lastY= undefined;
    this._movedTimer= undefined;
    this._movedTimeout= 500;
    this._wheel= 0;
    this._wheelTrigger= 100;
    this._resolutionTarget= 0;
    this._resolutionStep= 0;
    this._wheeldX= 0;
    this._wheeldY= 0;
    this._zoomAnimation= undefined;
    this._zoomStep= 20;
    this._zoomStepDuration= 25;

}, EventEmitter, 'C.System.Events'))();

C.System.Events.attach = function (citronGIS) {
    //TODO debug
    //console.log('setup event');

    this._citronGIS = citronGIS;

    $(this._citronGIS._renderer.view).mousedown(C.System.Events.stageDown.bind(this));
    $(window).mouseup(C.System.Events.stageUp.bind(this));
    $(document).mousemove(C.System.Events.stageMove.bind(this));

    this._citronGIS._renderer.view.addEventListener('touchstart', C.System.Events.stageDown.bind(this));
    document.addEventListener('touchmove',C.System.Events.stageMove.bind(this));
    window.addEventListener('touchend', C.System.Events.stageUp.bind(this));

    $(window).keydown(C.System.Events.keyDown.bind(this));

    this._citronGIS._viewport.on('move', C.System.Events.internalUpdate.bind(this));

    this._citronGIS._renderer.view.addEventListener('wheel', C.System.Events.wheel.bind(this));
};

C.System.Events.animateZoom = function () {
    var target = this._citronGIS._viewport._resolution + this._resolutionStep;

    this._citronGIS._viewport.translate(-this._wheeldX, -this._wheeldY, true);
    this._citronGIS._viewport.zoom(target, true);
    this._citronGIS._viewport.translate(this._wheeldX, this._wheeldY);

    if (this._resolutionStep < 0 && target > this._resolutionTarget) {
        this._zoomAnimation = setTimeout(C.System.Events.animateZoom.bind(this), this._zoomStepDuration);
    } else if (this._resolutionStep > 0 && target < this._resolutionTarget) {
        this._zoomAnimation = setTimeout(C.System.Events.animateZoom.bind(this), this._zoomStepDuration);
    } else {
        this._zoomAnimation = undefined;
        this._citronGIS._viewport.translate(-this._wheeldX, -this._wheeldY, true);
        this._citronGIS._viewport.zoom(this._resolutionTarget, true);
        this._citronGIS._viewport.translate(this._wheeldX, this._wheeldY);
    }

};

C.System.Events.wheel = function (evt) {
    this._wheel += evt.deltaY;
    if (this._wheel <= -this._wheelTrigger) {
        this._wheel = 0;
        var zoomLevel;
        if (!this._zoomAnimation) {
            zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
        } else {
            zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._resolutionTarget);
        }

        if (zoomLevel + 1 < C.Helpers.ResolutionHelper.Resolutions.length) {
            zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel + 1];

            if (zoomLevel == this._resolutionTarget) {
                return;
            }

            var dx = evt.offsetX - this._citronGIS._viewport._width / 2;
            var dy = evt.offsetY - this._citronGIS._viewport._height / 2;

            this._wheeldX = dx;
            this._wheeldY = dy;

            this._resolutionTarget = zoomLevel;
            this._resolutionStep = (this._resolutionTarget - this._citronGIS._viewport._resolution) / this._zoomStep;

            clearTimeout(this._zoomAnimation);
            setTimeout(C.System.Events.animateZoom.bind(this), this._zoomStepDuration);
        }
    } else if (this._wheel >= this._wheelTrigger) {
        this._wheel = 0;
        var zoomLevel;
        if (!this._zoomAnimation) {
            zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
        } else {
            zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._resolutionTarget);
        }

        if (zoomLevel - 1 >= 0) {
            zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel - 1];


            if (zoomLevel == this._resolutionTarget) {
                return;
            }

            var dx = evt.offsetX - this._citronGIS._viewport._width / 2;
            var dy = evt.offsetY - this._citronGIS._viewport._height / 2;

            this._wheeldX = dx;
            this._wheeldY = dy;

            this._resolutionTarget = zoomLevel;
            this._resolutionStep = (this._resolutionTarget - this._citronGIS._viewport._resolution) / this._zoomStep;

            clearTimeout(this._zoomAnimation);
            setTimeout(C.System.Events.animateZoom.bind(this), this._zoomStepDuration);
        }
    }
};

C.System.Events.keyDown = function (evt) {
    if (evt.keyCode == 106) {
        this._citronGIS._viewport.rotate(-5);
    }
    if (evt.keyCode == 111) {
        this._citronGIS._viewport.rotate(5);
    }
    if (evt.keyCode == 107) {
        /*var zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
        zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel + 2]*1*/

        var zoomLevel = this._citronGIS._viewport._resolution * 0.9;
        if (zoomLevel !== undefined) {
            this._citronGIS._viewport.zoom(zoomLevel);
        }
    }
    if (evt.keyCode == 109) {
        /*var zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
        zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel - 1] * 0.85;*/

        var zoomLevel = this._citronGIS._viewport._resolution * 1.1;
        if (zoomLevel > C.Helpers.ResolutionHelper.Resolutions[0])
            zoomLevel = C.Helpers.ResolutionHelper.Resolutions[0];

        if (zoomLevel !== undefined) {
            this._citronGIS._viewport.zoom(zoomLevel);
        }
    }
};

C.System.Events.stageDown = function (evt) {
    this.emit('mouseDown', evt);
    this._isDown = true;
    this._hasMoved = false;
    this._lastX = evt.clientX || evt.touches[0].pageX;
    this._lastY = evt.clientY || evt.touches[0].pageY;
};

C.System.Events.stageUp = function (evt) {
    this.emit('mouseUp', evt);

    this._isDown = false;
    if (!this._hasMoved) {
        this.emit('mapClicked', evt);
    }
};

C.System.Events.stageMove = function (evt) {
    this.emit('mouseMove', evt);
    if (!this._isDown) return;

    var x = evt.clientX || evt.touches[0].pageX;
    var y = evt.clientY || evt.touches[0].pageY;

    var dx = x - this._lastX;
    var dy = y - this._lastY;

    if (dx === 0 && dy === 0) return;

    this._citronGIS._viewport.translate(dx, dy);

    this._lastX = x;
    this._lastY = y;
    this._hasMoved = true;
};

C.System.Events.internalUpdate = function () {
    this._citronGIS._customRenderer.updatePositions();
    this._citronGIS._viewport._zoomDirection = C.System.Viewport.zoomDirection.NONE;
};
