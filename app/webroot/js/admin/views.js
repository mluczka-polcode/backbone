var CommonView = Backbone.View.extend({
    events : {
        'click .delete' : 'delete',
        'change input[type=text]' : 'update',
    },

    initialize : function(options) {
        this.template = _.template(options.template);
    },

    render : function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    update : function() {
        this.model.set('name', $('input[type=text]', this.el).val());
        this.model.save();
    },

    delete : function(e) {
        e.preventDefault();

        if(!this.model.isNew() && !confirm('Are you sure?'))
        {
            return;
        }

        var self = this;
        this.model.destroy({success:function(){
            $(self.el).remove();
        }});
    },
});

var CoursesView = CommonView.extend({
    events : {
        'click .delete' : 'delete',
        'change input[type=text]' : 'update',
        'change select' : 'update'
    },
    update : function() {
        this.model.set('name', $('input[type=text]', this.el).val());
        this.model.set('day', $('select.day', this.el).val());
        this.model.save();
    }
});

var FormView = Backbone.View.extend({
    events : {
        'click #addResource' : 'addResource'
    },

    el : $('#mainContainer'),

    initialize : function () {
        this.template = _.template(templates.adminTemplate);
        _.bindAll(this, 'render', 'append');

        var self = this;

        // occupations
        this.occupationCollection = new OccupationCollection();
        this.delegateEvents(_.extend(this.events, {
            'click #addOccupation' : function() { self.occupationCollection.add({}); },
        }));
        this.listenTo(this.occupationCollection, 'add', function(item) {
            self.append('occupationsContainer', item, templates.occupationTemplate);
        });
        this.occupationCollection.fetch();

        // resources
        this.resourceCollection = new ResourceCollection();
        this.delegateEvents(_.extend(this.events, {
            'click #addResource' : function() { self.resourceCollection.add({}); },
        }));
        this.listenTo(this.resourceCollection, 'add', function(item) {
            self.append('resourcesContainer', item, templates.resourceTemplate);
        });
        this.resourceCollection.fetch();

        // courses
        this.courseCollection = new CourseCollection();
        this.delegateEvents(_.extend(this.events, {
            'click #addCourse' : function() { self.courseCollection.add({}); },
        }));
        this.listenTo(this.courseCollection, 'add', function(item) {
            self.append('coursesContainer', item, templates.courseTemplate, CoursesView);
        });
        this.courseCollection.fetch();
    },

    render : function (eventName) {
        $(this.el).html(this.template());
        return this;
    },

    append : function(id, item, template, viewClass) {
        if(!viewClass)
        {
            viewClass = CommonView;
        }
        var view = new viewClass({
            model    : item,
            template : template
        });
        $('#' + id, this.el).append(view.render().el);
    }

});
