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
                $('#forms-content').html(new FormView({model : form}).renderForm().el);
            }
        });
    },

    viewForm : function (id) {
        var form = new Form({id: id});
        form.fetch({
            success: function() {
                $('#forms-content').html(new FormView({model : form}).renderDetails().el);
            }
        });
    },

	addForm : function() {
        var form = new Form();
        $('#forms-content').html(new FormView({model : form}).renderForm().el);
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
        text: 'external/text',
        templates : '/templates'
    }
});

require(
    ['text!templates/list.tpl', 'text!templates/edit.tpl', 'text!templates/view.tpl', 'text!templates/person.tpl'],
    function(listTemplate, formTemplate, detailsTemplate, personTemplate) {
        templates = {
            listTemplate    : listTemplate,
            formTemplate    : formTemplate,
            detailsTemplate : detailsTemplate,
            personTemplate  : personTemplate
        };

        Backbone.history.start();
    }
)();
