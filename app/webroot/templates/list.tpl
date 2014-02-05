<h2>Submitted forms</h2>

<table border="1">
    <tr>
        <th>submitted by</th>
        <th colspan="2" style="text-align: center;">action</th>
    </tr>
    <% for(var i = 0; i < forms.length; i++) { %>
        <% var form = forms[i].attributes %>
        <tr>
            <td><%- form.firstName %> <%- form.lastName %></td>
            <td><a class="button" href="#form/view/<%- form.id %>">view</a></td>
            <td><a class="button" href="#form/edit/<%- form.id %>">edit</a></td>
        </tr>
    <% }; %>
</table>
<br />
<a class="button" href="#/form/add">sign up to conference</a>
