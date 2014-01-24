var AppRouter = Backbone.Router.extend({
    routes : {
        '' : 'settings',
    },

	settings : function(page) {
        new FormView({model : new Form()}).render()
    }
});

var app = new AppRouter;

var templates = {};

requirejs.config({
    baseUrl : '/js',
    urlArgs : 'ts=' + new Date().getTime(),
    paths : {
        text : 'external/text',
        templates : '/templates'
    }
});

require(
    ['text!templates/admin/main.tpl', 'text!templates/admin/occupation.tpl', 'text!templates/admin/resource.tpl'],
    function(adminTemplate, occupationTemplate, resourceTemplate) {
        templates = {
            adminTemplate      : adminTemplate,
            occupationTemplate : occupationTemplate,
            resourceTemplate   : resourceTemplate
        };

        Backbone.history.start();
    }
)();
