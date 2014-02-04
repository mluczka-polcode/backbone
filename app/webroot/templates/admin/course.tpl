name: <input type="text" name="courses[<%- id %>][name]" value="<%- name %>" />&nbsp;

day: <select class="day" name="courses[<%- id %>][day]">
    <option value="1"<%= day == 1 ? ' selected="selected"' : '' %>>1</option>
    <option value="2"<%= day == 2 ? ' selected="selected"' : '' %>>2</option>
    <option value="3"<%= day == 3 ? ' selected="selected"' : '' %>>3</option>
</select>&nbsp;

number: <select class="number" name="courses[<%- id %>][number]">
    <option value="1"<%= number == 1 ? ' selected="selected"' : '' %>>1</option>
    <option value="2"<%= number == 2 ? ' selected="selected"' : '' %>>2</option>
    <option value="3"<%= number == 3 ? ' selected="selected"' : '' %>>3</option>
</select>&nbsp;

<span class="button delete">delete</span>
