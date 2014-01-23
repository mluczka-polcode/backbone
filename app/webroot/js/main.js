
var FormDataException = function(field, message) {
    this.field = field;
    this.message = message;
    this.toString = function() {
        return this.field + ': ' + this.message;
    };
};

// models

var Form = Backbone.Model.extend({
    urlRoot : '/cforms/api',

    defaults : {
        id : null,
        name : '',
        data : {
            firstName   : '',
            lastName    : '',
            phone       : '',
            occupations : [],
            hasCard     : 0,
            cardNumber  : '',
            persons     : [],
            courses     : [],
            resources   : []
        },
    },

    validate : function() {
        var data = this.attributes.data;
        return(this.checkRequiredFields(data) && this.validatePersons(data.persons) && this.validateCourses(data.courses));
    },

    checkRequiredFields : function(data) {
        var requiredFields = ['firstName', 'lastName', 'phone'];
        if(data.hasCard)
        {
            requiredFields.push('cardNumber');
        }

        for(var i = 0; i < requiredFields.length; i++)
        {
            if(!data[requiredFields[i]])
            {
                throw new FormDataException(requiredFields[i], 'field cannot be empty');
                return false;
            }
        }

        return true;
    },

    validatePersons : function(persons) {
        if(!persons || !persons.length)
        {
            return true;
        }

        var requiredFields = ['firstName', 'lastName', 'age'];
        for(var i = 0; i < persons.length; i++)
        {
            for(var j = 0; j < requiredFields.length; j++)
            {
                if(!persons[i][requiredFields[j]])
                {
                    throw new FormDataException('person_' + i + '_' + requiredFields[i], 'field cannot be empty');
                }
            }
        }

        return true;
    },

    validateCourses : function(courses) {
        for(var i = 0; i < courses.length; i++)
        {
            var allEmpty = true;
            var allFilled = true;
            var allDistinct = true;
            var priorities = [];

            for(var j = 0; j < courses[i].length; j++)
            {
                var priority = courses[i][j];

                if(priority == 0)
                {
                    allFilled = false;
                }
                else
                {
                    allEmpty = false;

                    if(priorities.indexOf(priority) != -1)
                    {
                        allDistinct = false;
                    }
                }

                if(!allEmpty && (!allFilled || !allDistinct))
                {
                    message = 'Invalid course priorities for day #' + (i + 1) + '.\n';
                    message += 'Courses\' priorities for any given day have to be either all empty or unique.';
                    throw new FormDataException('course_' + i + '_' + j, message);
                    return false;
                }

                priorities.push(priority);
            }
        }

        return true;
    },

    calculatePrice : function() {
        var price = 0;

        this.get('data').persons.forEach(function(person) {
            if(person.age > 12)
            {
                price += 200;
            }
        });

        var resources = this.get('data').resources;
        Object.keys(resources).forEach(function(key) {
            price += 10 * resources[key];
        });

        return price;
    }
});

var FormCollection = Backbone.Collection.extend({
    model : Form,
    url : '/cforms/api'
});

var Person = Backbone.Model.extend({
    defaults: {
        id        : null,
        firstName : '',
        lastName  : '',
        age       : ''
    }
});

var PersonCollection = Backbone.Collection.extend({
    model : Person
});

// views

var FormListView = Backbone.View.extend({
    tagName : 'ul',

    initialize : function () {
        var self = this;

        this.model.bind('reset', this.render, this);
        this.model.bind('add', function (form) {
            $(self.el).append(new FormListItemView({model:form}).render().el);
        });

        this.render();
    },

    render : function (eventName) {
        _.each(this.model.models, function (form) {
            $(this.el).append(new FormListItemView({model:form}).render().el);
        }, this);

        $(this.el).append('<br /><a href="#/form/add">sign up to conference</a>');

        return this;
    }
});

var FormListItemView = Backbone.View.extend({
    tagName : 'li',

    initialize : function () {
        this.template = _.template('<%= name %> <a href="#form/view/<%= id %>">[view]</a> <a href="#form/edit/<%= id %>">[edit]</a> <a href="#form/delete/<%= id %>">[delete]</a>');
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.close, this);
    },

    render : function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

var FormView = Backbone.View.extend({
    personCounter : 0,
    MAX_PERSONS_COUNT : 15,

    events : {
        'change #f_hasCard' : 'switchCardNumberField',
        'click #addPerson' : 'addPerson',
        'submit' : 'saveForm',
        'click .submit' : 'saveForm'
    },

    initialize : function () {
        this.template = _.template(templates.formTemplate);

        _.bindAll(this, 'render', 'renderPersons', 'renderResult', 'switchCardNumberField', 'addPerson', 'change', 'saveForm', 'validateForm');

        this.personCollection = new PersonCollection();

        var persons = this.model.attributes.data.persons;
        if(persons)
        {
            var self = this;

            _(persons).each(function(item) {
                item.id = self.personCounter;
                self.personCollection.add(new Person(item));
                self.personCounter += 1;
            });
        }
    },

    render : function (eventName) {
        $(this.el).html(this.template({
            occupations : ['developer', 'entrepreneur', 'student'],
            daysCount : 3,
            coursesCount : 3,
            resources : ['drawer', 'calculator', 'computer', 'projector', 'gadget'],
            data : this.model.attributes.data
        }));

        _.defer(function(view) {
            view.renderPersons();
        }, this);

        return this;
    },

    renderPersons : function() {
        $('#additionalPersons').html('');

        _(this.personCollection.models).each(function(person) {
            var view = new PersonView({
                model : person,
                template : _.template(templates.personTemplate)
            });

            $('#additionalPersons').append(view.render().el);
        }, this);
    },

    renderResult : function() {
        $(this.el).html(_.template(templates.resultTemplate, {
            id : this.model.id,
            data : this.model.attributes.data,
            price : this.model.calculatePrice()
        }));

        return this;
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

    addPerson : function() {
        this.personCollection.add(new Person({
            id: this.personCounter
        }));

        this.personCounter += 1;

        if(this.personCollection.length >= this.MAX_PERSONS_COUNT)
        {
            $('#addPerson').hide();
        }

        this.renderPersons();

        return false;
    },

    change : function (event) {
        var target = event.target;
        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
    },

    saveForm : function () {
        if(!this.validateForm())
        {
            return false;
        }

        var self = this;
        Backbone.ajax({
            dataType : 'json',
            url : 'http://conference.local/cforms/api',
            method : 'post',
            data : {
                id : this.model.id,
                data : JSON.stringify(this.model.attributes.data)
            },
            success : function(val) {
                console.info('success');
                self.model.id = val.id;
                app.navigate('form/view/' + self.model.id, {trigger: true});
            },
            error : function (xhr, ajaxOptions, thrownError) {
                alert('Error code ' + xhr.status + '\n' + thrownError);
            }
        });

        return false;
    },

    validateForm : function() {
        try
        {
            this.model.set({
                data : $('#conferenceForm').serializeJSON(),
            });
            this.model.validate();
        }
        catch(e)
        {
            var field = $('input#f_' + e.field);
            if(field && field[0])
            {
                field[0].focus();

                var label = $('label[for="' + field[0].id + '"]');
                if(label && label[0])
                {
                    e.field = label[0].innerText;
                }
            }

            alert(e.toString());
            return false;
        }

        return true;
    }
});

var PersonView = Backbone.View.extend({
    tagName : 'fieldset',

    events : {
        'click .removePerson' : 'remove',
        'change input' : 'update'
    },

    initialize : function(options) {
        this.template = options.template;

        _.bindAll(this, 'update', 'remove', 'render', 'unrender');

        this.model.bind('change', this.render);
        this.model.bind('remove', this.unrender);
    },

    update : function() {
        this.model.set({
            'firstName' : $('.person-firstName', this.el).val(),
            'lastName'  : $('.person-lastName', this.el).val(),
            'age'       : $('.person-age', this.el).val()
        });
    },

    remove : function() {
        this.model.collection.remove(this.model);
        $('#addPerson').show();
        return false;
    },

    render : function() {
        $(this.el).addClass('person').html(this.template({
            data : this.model
        }));

        return this;
    },

    unrender : function(){
        $(this.el).remove();
    }
});

// router

var AppRouter = Backbone.Router.extend({
    routes : {
        ''                : 'list',
        'form/add'        : 'addForm',
        'form/edit/:id'   : 'editForm',
        'form/view/:id'   : 'viewForm',
        'form/delete/:id' : 'deleteForm'
    },

	list : function(page) {
        var formList = new FormCollection();

        formList.fetch({
            success: function() {
                $('#forms-content').html(new FormListView({model : formList}).el);
            }
        });
    },

    editForm : function (id) {
        var form = new Form({id: id});
        form.fetch({
            success: function() {
                $('#forms-content').html(new FormView({model : form}).render().el);
            }
        });
    },

    viewForm : function (id) {
        var form = new Form({id: id});
        form.fetch({
            success: function() {
                $('#forms-content').html(new FormView({model : form}).renderResult().el);
            }
        });
    },

	addForm : function() {
        var form = new Form();
        $('#forms-content').html(new FormView({model : form}).render().el);
    },

    deleteForm : function(id) {
        var form = new Form({id: id});
        form.destroy({
            success : function () {
                alert('Form deleted successfully');
                window.history.back();
            }
        });
    }
});

var app = new AppRouter;
var templates = {};

requirejs.config({
    baseUrl: '/js',
    urlArgs: 'ts=' + new Date().getTime(),
    paths: {
        templates: '/templates'
    }
});

require(
    ['text!templates/list.tpl', 'text!templates/form.tpl', 'text!templates/result.tpl', 'text!templates/person.tpl'],
    function(listTemplate, formTemplate, resultTemplate, personTemplate) {
        templates = {
            listTemplate : listTemplate,
            formTemplate : formTemplate,
            resultTemplate : resultTemplate,
            personTemplate : personTemplate
        };
        Backbone.history.start();
    }
)();
