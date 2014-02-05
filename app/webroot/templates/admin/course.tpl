<label for="f_courses_<%- id %>_name">name:</label>
<input type="text" id="f_courses_<%- id %>_name" name="courses[<%- id %>][name]" value="<%- name %>" />

<label for="f_courses_<%- id %>_day">day:</label>
<select class="day" id="f_courses_<%- id %>_day" name="courses[<%- id %>][day]">
    <option value="1"<%= day == 1 ? ' selected="selected"' : '' %>>1</option>
    <option value="2"<%= day == 2 ? ' selected="selected"' : '' %>>2</option>
    <option value="3"<%= day == 3 ? ' selected="selected"' : '' %>>3</option>
</select>&nbsp;

<span class="button delete">delete</span>
