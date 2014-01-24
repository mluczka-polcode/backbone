var OccupationView = Backbone.View.extend({
    tagName :  "li",

    events : {
        'click .deleteOccupation' : 'delete',
    },

    initialize : function() {
        this.template = _.template(templates.occupationTemplate);

        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render : function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    delete : function() {
        this.model.destroy();
        return false;
    },
});

var ResourceView = Backbone.View.extend({
    tagName :  "li",

    events : {
        'click .deleteResource' : 'delete',
    },

    initialize : function() {
        this.template = _.template(templates.resourceTemplate);

        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render : function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    delete : function() {
        this.model.destroy();
        return false;
    },
});

var FormView = Backbone.View.extend({
    events : {
        'click #addOccupation' : 'addOccupation',
        'click #addResource' : 'addResource',
        'submit' : 'saveForm',

        'click .test' : 'render',
    },

    el : $('#mainContainer'),

    initialize : function () {
        this.template = _.template(templates.adminTemplate);
        _.bindAll(this, 'render', 'addOccupation', 'appendOccupation', 'appendAllOccupations',  'save');

        this.occupationCollection = new OccupationCollection();

        this.listenTo(this.occupationCollection, 'add',   this.appendOccupation);
        this.listenTo(this.occupationCollection, 'reset', this.appendAllOccupations);

        this.occupationCollection.fetch();

        this.resourceCollection = new ResourceCollection();

        this.listenTo(this.resourceCollection, 'add',   this.appendResource);
        this.listenTo(this.resourceCollection, 'reset', this.appendAllResources);

        this.resourceCollection.fetch();
    },

    render : function (eventName) {
        console.info('render');
        $(this.el).html(this.template());
        return this;
    },

    addOccupation : function() {
        this.occupationCollection.add(new Occupation());
        return false;
    },

    appendOccupation : function(occupation) {
      var view = new OccupationView({model: occupation});
      $('#occupationsContainer', this.el).append(view.render().el);
    },

    appendAllOccupations : function() {
      this.occupationCollection.each(this.appendOccupation, this);
    },

    addResource : function() {
        this.resourceCollection.add(new Resource());
        return false;
    },

    appendResource : function(resource) {
      var view = new ResourceView({model: resource});
      $('#resourcesContainer', this.el).append(view.render().el);
    },

    appendAllResources : function() {
      this.resourceCollection.each(this.appendResource, this);
    },

    save : function () {
        if(!this.validate())
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

    validate : function() {
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
