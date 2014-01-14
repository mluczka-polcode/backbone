$(function() {
    var MAX_PERSONS_COUNT = 15;

    // Overrides persistence storage with dummy function. This enables use of `Model.destroy()` without raising an error.
    Backbone.sync = function(method, model, callback) {
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
        model : Person,

        initialize : function(){
            this.bind("add", function(){
                listView.render();
            })
        }
    });

    var PersonView = Backbone.View.extend({
        tagName : 'fieldset',

        template : _.template($('#personTemplate').html()),

        events : {
            'click .removePerson' : 'remove',
        },

        initialize : function() {
            _.bindAll(this, 'remove', 'render', 'unrender');

            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
        },

        remove : function() {
            this.model.destroy();
            $('#addPerson').show();
            return false;
        },

        render : function() {
            $(this.el).addClass('person').html(this.template({
                id : this.model.id
            }));

            return this;
        },

        unrender : function(){
            $(this.el).remove();
        }
    });

    var PersonListView = Backbone.View.extend({
        counter : 0,

        events : {
            'click #addPerson' : 'addPerson',
        },

        initialize : function() {
            _.bindAll(this, 'addPerson', 'render', 'append');

            this.collection = new PersonList();
        },

        addPerson : function() {
            var person = new Person();
            person.set({
                id: this.counter
            });
            this.collection.add(person);

            this.counter += 1;

            if(this.collection.length >= MAX_PERSONS_COUNT)
            {
                $('#addPerson').hide();
            }

            return false;
        },

        render : function() {
            var self = this;

            $('#additionalPersons').html('');

            _(this.collection.models).each(function(person) {
                self.append(person);
            }, this);
        },

        append : function(item) {
            var itemView = new PersonView({
                model: item
            });

            $('#additionalPersons').append(itemView.render().el);
        }
    });

    var FormView = Backbone.View.extend({
        data : {},

        events : {
            'change #f_hasCard' : 'switchCardNumberField',
            'submit' : 'submitForm',
            'click #showForm' : 'showForm'
        },

        initialize : function() {
            _.bindAll(this, 'renderForm', 'switchCardNumberField', 'submitForm', 'renderResult', 'showForm');
        },

        renderForm : function() {
            $('#conferenceForm').show();
            $('#formResult').hide();

            var coursesTemplate = _.template($('#coursesTemplate').html());
            $('#courses').html(coursesTemplate({
                daysCount : 3,
                coursesCount : 3
            }));

            var resourcesTemplate = _.template($('#resourcesTemplate').html());
            $('#additionalResources').html(resourcesTemplate({
                resources : ['drawer', 'calculator', 'computer', 'projector', 'gadget']
            }));
        },

        switchCardNumberField : function() {
            if($('#f_hasCard').prop('checked'))
            {
                $('#cardNumber').show();
                $('#f_cardNumber').attr('required', 'required');
            }
            else
            {
                $('#cardNumber').hide();
                $('#f_cardNumber').removeAttr('required');
            }
        },

        submitForm : function() {
            Backbone.ajax({
                dataType : 'json',
                url : 'http://localhost/backbone/index.php',
                method : 'post',
                data : $('#conferenceForm').serialize(),
                success : function(val) {
                    this.data = val;
                    router.navigate('result', {trigger: true});
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    alert('Error code ' + xhr.status + '\n' + thrownError);
                }
            });

            return false;
        },

        renderResult : function() {
            $('#conferenceForm').hide();
            $('#formResult').show();
        },

        showForm : function() {
            router.navigate('form', {trigger: true});
        }
    });

    var Router = Backbone.Router.extend({
        routes : {
            '' : "showForm",
            'form' : "showForm",
            'result' : "showResult",
        },

        showForm : function() {
            formView.renderForm();
        },

        showResult : function() {
            formView.renderResult();
        }
    });

    var listView = new PersonListView({
        el : '#additionalPersonsContainer'
    });

    var formView = new FormView({
        el : 'body'
    });

    var router = new Router;
    Backbone.history.start();
});
