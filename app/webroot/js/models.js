
var FormDataException = function(field, message) {
    this.field = field;
    this.message = message;
    this.toString = function() {
        return this.field + ': ' + this.message;
    };
};

var Form = Backbone.Model.extend({
    urlRoot : '/cforms/api',

    defaults : {
        id : null,
        firstName   : '',
        lastName    : '',
        phone       : '',
        occupations : [],
        hasCard     : false,
        cardNumber  : '',
        persons     : [],
        courses     : [],
        resources   : []
    },

    validate : function() {
        return(this.checkRequiredFields() && this.validatePersons() && this.validateCourses());
    },

    checkRequiredFields : function() {
        var requiredFields = ['firstName', 'lastName', 'phone'];
        if(this.attributes.hasCard)
        {
            requiredFields.push('cardNumber');
        }

        for(var i = 0; i < requiredFields.length; i++)
        {
            if(!this.attributes[requiredFields[i]])
            {
                throw new FormDataException(requiredFields[i], 'field cannot be empty');
                return false;
            }
        }

        return true;
    },

    validatePersons : function() {
        var persons = this.attributes.persons;
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

    validateCourses : function() {
        var courses = this.attributes.courses;

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

        this.get('persons').forEach(function(person) {
            if(person.age > 12)
            {
                price += 200;
            }
        });

        var resources = this.get('resources');
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
