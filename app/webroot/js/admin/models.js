var Occupation = Backbone.Model.extend({
    urlRoot : '/admin/occupation',

    defaults : {
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

    defaults : {
        id   : null,
        name : '',
    }
});

var ResourceCollection = Backbone.Collection.extend({
    url : '/admin/resource',
    model : Resource
});

var Course = Backbone.Model.extend({
    urlRoot : '/admin/course',

    defaults : {
        id     : null,
        name   : '',
        day    : '',
        number : ''
    }
});

var CourseCollection = Backbone.Collection.extend({
    url : '/admin/course',
    model : Course
});
