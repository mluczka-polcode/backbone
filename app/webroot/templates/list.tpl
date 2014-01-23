<ul>
    <% for(var i = 0; i < forms.length; i++) { %>
        <% var form = forms[i].attributes %>
        <li>
            <%- form.firstName %> <%- form.lastName %>
            <a href="#form/view/<%- form.id %>">[view]</a>
            <a href="#form/edit/<%- form.id %>">[edit]</a>
            <a href="#form/delete/<%- form.id %>">[delete]</a>
        </li>
    <% }; %>
</ul>
<br />
<a href="#/form/add">sign up to conference</a>
