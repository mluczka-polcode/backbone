var FormListView = Backbone.View.extend({
    initialize : function () {
        this.template = _.template(templates.listTemplate);
        this.render();
    },

    render : function (eventName) {
        $(this.el).html(this.template({
            forms : this.model.models
        }));

        return this;
    }
});

var FormView = Backbone.View.extend({
    personCounter : 0,
    MAX_PERSONS_COUNT : 15,
    multiFields : ['occupations', 'persons', 'courses', 'resources'],

    events : {
        'click #addPerson' : 'addPerson',
        'submit' : 'saveForm',
    },

    initialize : function () {
        this.template = _.template(templates.formTemplate);

        _.bindAll(this, 'renderForm', 'renderPersons', 'renderDetails', 'addPerson', 'saveForm', 'validateForm', 'updateModel', 'showValidationError');

        this.personCollection = new PersonCollection();

        var persons = this.model.attributes.persons;
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

    renderForm : function (eventName) {
        $(this.el).html(this.template({
            occupations : ['developer', 'entrepreneur', 'student'],
            daysCount : 3,
            coursesCount : 3,
            resources : ['drawer', 'calculator', 'computer', 'projector', 'gadget'],
            data : this.model.attributes
        }));

        _.defer(function(view) {
            view.renderPersons();
        }, this);

        return this;
    },

    renderPersons : function() {
        $('#additionalPersons', this.el).html('');

        _(this.personCollection.models).each(function(person) {
            var view = new PersonView({
                model : person,
                template : _.template(templates.personTemplate)
            });

            $('#additionalPersons').append(view.render().el);
        }, this);
    },

    renderDetails : function() {
        $(this.el).html(_.template(templates.detailsTemplate, {
            id : this.model.id,
            data : this.model.attributes,
            price : this.model.calculatePrice()
        }));

        return this;
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

    saveForm : function () {
        if(!this.validateForm())
        {
            return false;
        }

        var data = this.model.attributes;
        for(var i = 0; i < this.multiFields.length; i++)
        {
            data[this.multiFields[i]] = JSON.stringify(data[this.multiFields[i]]);
        }

        var self = this;
        Backbone.ajax({
            dataType : 'json',
            url : 'http://conference.local/cforms/api',
            method : 'post',
            data : data,
            success : function(val) {
                app.navigate('form/view/' + val.id, {trigger: true});
            },
            error : function (xhr, ajaxOptions, thrownError) {
                alert('Error code ' + xhr.status + '\n' + thrownError);
            }
        });

        return false;
    },

    validateForm : function() {
        try {
            this.updateModel();
            this.model.validate();
        } catch(e) {
            this.showValidationError(e);
            return false;
        }

        return true;
    },

    updateModel : function() {
        var formData = $('#conferenceForm').serializeJSON();
        formData.hasCard = $('#f_hasCard').prop('checked');
        formData.cardNumber = formData.hasCard ? $('#f_cardNumber').val() : '';
        for(var i = 0; i < this.multiFields.length; i++)
        {
            if(!formData[this.multiFields[i]])
            {
                formData[this.multiFields[i]] = [];
            }
        }
        this.model.set(formData);
    },

    showValidationError : function(e) {
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
    }
});

var PersonView = Backbone.View.extend({
    tagName : 'fieldset',

    events : {
        'click .removePerson' : 'remove',
        'change input'        : 'update'
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
