$(function() {
    Backbone.sync = function(method, model, callback) {
// console.info(method);
// console.info(model);
// console.info(success);
// console.info(error);
        callback.success();
    };

    var Person = Backbone.Model.extend({
        defaults: {
            id        : null,
            firstName : '',
            lastName  : '',
            age       : 0
        }
    });

    var PersonList = Backbone.Collection.extend({
        model: Person,

        initialize: function(){
            this.bind("add", function(){
                view.render();
            })
        }
    });

    var PersonView = Backbone.View.extend({
        template: _.template($('#personTemplate').html()),

        events: {
            'click .removePerson' : 'remove',
        },

        initialize: function() {
            _.bindAll(this, 'remove', 'render', 'unrender');

            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
        },

        remove: function() {
            this.model.destroy();
        },

        render: function() {
            $(this.el).html(this.template({
                id : this.model.id
            }));
            return this;
        },

        unrender: function(){
            $(this.el).remove();
        }
    });

    var PersonListView = Backbone.View.extend({
        counter : 0,

        template: _.template($('#personTemplate').html()),

        events: {
            'click #addPerson' : 'addPerson',
        },

        initialize: function() {
            _.bindAll(this, 'render', 'addPerson', 'append');
            this.collection = new PersonList();
        },

        addPerson: function() {
            var person = new Person();
            person.set({
                id: this.counter
            });
            this.collection.add(person);

            this.counter += 1;
        },

        render: function() {
            var self = this;
            $('#additionalPersons', this.el).html('');
            _(this.collection.models).each(function(person) {
                self.append(person);
            }, this);
        },

        append: function(item) {
            var itemView = new PersonView({
                model: item
            });
            $('#additionalPersons', this.el).append(itemView.render().el);
        }
    });

    var view = new PersonListView({el: 'body'});
});
