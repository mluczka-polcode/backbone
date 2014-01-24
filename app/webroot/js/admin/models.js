var Form = Backbone.Model.extend({
    defaults : {
        id : null,
    },

    validate : function() {
        return true;
    }
});

var Occupation = Backbone.Model.extend({
    urlRoot : '/admin/occupation',

    defaults: {
        id   : null,
        name : '',
    }
});

var OccupationCollection = Backbone.Collection.extend({
    url : '/admin/occupation',
    model : Occupation
});

var Resource = Backbone.Model.extend({
    urlRoot : '/admin/resource',

    defaults: {
        id   : null,
        name : '',
    }
});

var ResourceCollection = Backbone.Collection.extend({
    url : '/admin/resource',
    model : Resource
});
