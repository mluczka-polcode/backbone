<form id="conferenceForm" action="#/save" method="post">

    <fieldset id="personalData">
        <legend>Personal data</legend>

        <label for="f_firstName">First name</label>
        <input type="text" id="f_firstName" name="firstName" value="<%- data.firstName %>" placeholder="First name" required="required" />
        <br />

        <label for="f_lastName">Last name</label>
        <input type="text" id="f_lastName" name="lastName" value="<%- data.lastName %>" placeholder="Last name" required="required" />
        <br />

        <label for="f_phone">Phone number</label>
        <input type="text" id="f_phone" name="phone" value="<%- data.phone %>" placeholder="Phone number" required="required" />
        <br />

        <label for="f_occupations">I am </label>
        <select id="f_occupations" name="occupations[]" multiple="multiple" size="3">
            <% for(var i = 0; i < occupations.length; i++) { %>
                <option value="<%- occupations[i] %>"<%= data.occupations.indexOf(occupations[i]) > -1 ? ' selected="selected"' : '' %>><%- occupations[i] %></option>
            <% } %>
        </select>
        <br />

        <input type="checkbox" id="f_hasCard" name="hasCard" value="1" <%= data.hasCard ? 'checked="checked"' : '' %> />
        <label for="f_hasCard">I have habitual client card</label>

        <div id="cardNumber" <%= data.hasCard ? '' : 'style="display:none;"' %>>
            <label for="f_cardNumber">Card number</label>
            <input type="text" id="f_cardNumber" name="cardNumber" value="" placeholder="Card number" />
        </div>
    </fieldset>

    <fieldset id="additionalPersonsContainer">
        <legend>Additional persons</legend>

        <div id="additionalPersons"></div>

        <button id="addPerson">add person</button>
    </fieldset>

    <fieldset id="courses">
        <legend>Courses</legend>

        <table>
            <tr>
                <th>&nbsp;</th>
                <% for(var i = 0; i < coursesCount; i++) { %>
                    <th>course #<%= i + 1 %></th>
                <% } %>
            </tr>
            <% for(var i = 0; i < daysCount; i++) { %>
                <tr class="courses-day" courses-day="<%- i %>">
                    <th>day #<%- i + 1 %></th>
                    <% for(var j = 0; j < coursesCount; j++) { %>
                        <td>
                            <% var value = data.courses && data.courses[i] ? data.courses[i][j] : ''; %>
                            <input type="number" id="f_course_<%= i %>_<%= j %>" name="courses[<%= i %>][<%= j %>]" value="<%- value %>" min="0" max="<%- coursesCount %>" placeholder="1-<%- coursesCount%>" />
                        </td>
                    <% } %>
                </tr>
            <% } %>
        </table>
    </fieldset>

    <fieldset id="additionalResources">
        <legend>Additional resources</legend>

        <% resources.forEach(function(res) { %>
            <input type="number" id="f_ar_<%= res %>" name="resources[<%= res %>]" value="<%- data.resources ? data.resources[res] : '' %>" min="0" placeholder="0" />
            <label for="f_ar_<%= res %>"><%= res %>(s)</label>
            <br />
        <% }); %>
    </fieldset>

    <fieldset class="submit">
        <input type="submit" id="f_submit" value="register" />
        <span class="submit">submit</span>
    </fieldset>
</form>
