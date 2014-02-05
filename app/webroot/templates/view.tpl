<div id="formResult">
    <div>
        <h3>Personal data</h3>
        <table>
            <tr><th>First name</th><td><%- data.firstName %></td></tr>
            <tr><th>Last name</th><td><%- data.lastName %></td></tr>
            <tr><th>Phone number</th><td><%- data.phone %></td></tr>
            <% if(data.occupations && data.occupations.length) { %>
                <tr><th>Occupation</th><td><%- data.occupations.join(', ') %></td></tr>
            <% } %>
            <% if(data.cardNumber) { %>
                <tr><th>Card number</th><td><%- data.cardNumber %></td></tr>
            <% } %>
        </table>
        <br />
    </div>

    <% if(data.persons) { %>
        <div>
            <h3>Additional persons</h3>
            <dl>
                <% for(var i = 0; i < data.persons.length; i++) { %>
                    <% var person = data.persons[i]; %>
                    <dt>#<%- i + 1 %></dt>
                    <dd>
                        <dl>
                            <dt>First name</dt><dd><%- person.firstName %></dd>
                            <dt>Last name</dt><dd><%- person.lastName %></dd>
                            <dt>Age</dt><dd><%- person.age %> years</dd>
                        </dl>
                    </dd>
                <% } %>
            </dl>
            <br />
        </div>
    <% } %>

    <div>
        <h3>Courses</h3>
        <table>
            <tr>
                <th>&nbsp;</th>
                <% for(var i = 0; i < config.coursesCount; i++) { %>
                    <th>course #<%= i + 1 %></th>
                <% } %>
            </tr>
            <% for(var i = 1; i < data.courses.length; i++) { %>
                <tr>
                    <th>day #<%= i + 1 %></th>
                    <% for(var j = 0; j < data.courses[i].length; j++) { %>
                        <th>
                            <%- config.courses[i][j] %><br />
                            <%- data.courses && data.courses[i] ? data.courses[i][j] : '' %>
                        </th>
                    <% } %>
                </tr>
            <% } %>
        </table>
        <br />
    </div>

    <% if(data.resources) { %>
        <div>
            <h3>Additional resources</h3>
            <dl>
                <% Object.keys(data.resources).forEach(function(key) { %>
                    <dt><%- key %></dt>
                    <dd><%- data.resources[key] %></dd>
                <% }); %>
            </dl>
            <br />
        </div>
    <% } %>

    <div>
        <h3>Price: $<%- price %></h3>
    </div>

    <a href="#/form/edit/<%- id %>">edit form</a> | <a href="#">back to list</a>
</div>
