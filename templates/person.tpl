<label for="f_<%= data.id %>_firstName">First name</label>
<input type="text" class="person-firstName" id="f_person_<%= data.id %>_firstName" name="persons[<%= data.id %>][firstName]" value="<%- data.get('firstName') %>" required="required" placeholder="First name" />

<label for="f_<%= data.id %>_lastName">Last name</label>
<input type="text" class="person-lastName" id="f_person_<%= data.id %>_lastName" name="persons[<%= data.id %>][lastName]" value="<%- data.get('lastName') %>" required="required" placeholder="Last name" />

<label for="f_<%= data.id %>_age">Age</label>
<input type="text" class="person-age" id="f_person_<%= data.id %>_age" name="persons[<%= data.id %>][age]" value="<%- data.get('age') %>" required="required" placeholder="Age" />

<button class="removePerson">remove this person</button>
