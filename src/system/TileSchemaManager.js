/*
 * C.System.TileSchemaManager   //TODO description
 */

'use strict';

C.System.TileSchemaManager = function () {

    this.schemas = {};

    var self = this;
    C.Utils.Event.once('initialized', function () {
        self.init();
    });
};

C.System.TileSchemaManager.prototype.init = function () {

    for (var schema in C.Layer.Tile.Schema) {

        console.log('register', schema);
        this.register(C.Layer.Tile.Schema[schema], schema);
    }

    C.Helpers.viewport.on('move', this.update.bind(this));
};

C.System.TileSchemaManager.prototype.register = function (schema, name) {

    if (!schema || !name) { return; }
    if (name in this.schemas) { return; }

    var self = this;
    var sch = {
        schema: schema,
        registered: 0
    };
    this.schemas[name] = sch;

    schema.on('register', function () {
        ++self.schemas[name].registered;
        if (self.schemas[name].registered == 1) {
            schema.computeTiles(C.Helpers.viewport);
        }
    });
    schema.on('unregister', function () {
        --self.schemas[name].registered;
        if (self.schemas[name].registered < 0) {
            self.schemas[name].registered = 0;
        }
    });

    schema.computeTiles(C.Helpers.viewport);
};

C.System.TileSchemaManager.prototype.update = function (viewport) {
    for (var schema in this.schemas) {

        var sch = this.schemas[schema];

        if (sch.registered <= 0) continue;

        sch.schema.computeTiles(viewport);
    }
};


C.System.TileSchemaManager = new C.System.TileSchemaManager();
