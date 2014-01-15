<label for="f_<%= data.id %>_firstName">First name</label>
<input type="text" class="person-firstName" name="persons[<%= data.id %>][firstName]" value="<%- data.get('firstName') %>" placeholder="First name" />

<label for="f_<%= data.id %>_lastName">Last name</label>
<input type="text" class="person-lastName" name="persons[<%= data.id %>][lastName]" value="<%- data.get('lastName') %>" placeholder="Last name" />

<label for="f_<%= data.id %>_age">Age</label>
<input type="text" class="person-age" name="persons[<%= data.id %>][age]" value="<%- data.get('age') %>" placeholder="Age" />

<button class="removePerson">remove this person</button>
