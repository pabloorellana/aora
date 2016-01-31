'use strict';

var mongoose = {};

var Schema = function () {

    function Model (properties) {
        var self = this;

        if(properties) {
            Object.keys(properties).forEach(function (key) {
                self[key] = properties[key];
            });
        }
        this.save = function () {};
        this.increment = function () {};
        this.remove = function () {};
    }

    Model.statics = {};
    Model.methods = {};
    Model.static = function () {};
    Model.method = function () {};
    Model.pre = function () {};

    Model.path = function () {
        return {
            validate: function () {},
        };
    };

    Model.virtual = function () {
        function SetterGetter() {
            return {
                set: function () {
                    return new SetterGetter();
                },
                get: function () {
                    return new SetterGetter();
                }
            };
        }
        return new SetterGetter();
    };

    Model.aggregate = function () {};
    Model.count = function () {};
    Model.create = function () {};
    Model.distinct = function () {};
    Model.ensureIndexes = function () {};
    Model.find = function () {};
    Model.findById = function () {};
    Model.findByIdAndRemove = function () {};
    Model.findByIdAndUpdate = function () {};
    Model.findOne = function () {};
    Model.findOneAndRemove = function () {};
    Model.findOneAndUpdate = function () {};
    Model.geoNear = function () {};
    Model.geoSearch = function () {};
    Model.index = function () {};
    Model.mapReduce = function () {};
    Model.plugin = function () {};
    Model.populate = function () {};
    Model.remove = function () {};
    Model.set = function () {};
    Model.update = function () {};
    Model.where = function () {};

    return Model;
};

// compiled models are stored in models_
// and may be retrieved by name.
var models_ = {};
function createModelFromSchema (name, Type) {
    if (Type) {
        if (Type.statics) {
            Object.keys(Type.statics).forEach(function (key) {
                Type[key] = Type.statics[key];
            });
        }
        if (Type.methods) {
            Object.keys(Type.methods).forEach(function (key) {
                Type.prototype[key] = Type.methods[key];
            });
        }
        models_[name] = Type;
    }
    return models_[name];
}

mongoose.Schema = Schema;
mongoose.Schema.Types = { ObjectId: '' };
mongoose.model = createModelFromSchema;
mongoose.connect = function () {};

module.exports = mongoose;