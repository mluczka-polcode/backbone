<ul>
    <% $.each(forms, function(key, value) { %>
        <li><a href="form/<%- key %>"><%- key %>: <%- value %></a></li>
    <% }); %>
</ul>