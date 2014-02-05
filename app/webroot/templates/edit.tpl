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
            <% for(var i = 0; i < config.occupations.length; i++) { %>
                <option value="<%- config.occupations[i] %>"<%= data.occupations && data.occupations.indexOf(config.occupations[i]) > -1 ? ' selected="selected"' : '' %>>
                    <%- config.occupations[i] %>
                </option>
            <% } %>
        </select>
        <br />

        <input type="checkbox" id="f_hasCard" name="hasCard" value="1" <%= data.cardNumber ? 'checked="checked"' : '' %> />
        <label for="f_hasCard">I have habitual client card</label>

        <div id="cardNumber" <%= data.cardNumber ? '' : 'style="display:none;"' %>>
            <label for="f_cardNumber">Card number</label>
            <input type="text" id="f_cardNumber" name="cardNumber" value="<%- data.cardNumber %>" placeholder="Card number" />
        </div>
    </fieldset>

    <fieldset id="additionalPersonsContainer">
        <legend>Additional persons</legend>

        <div id="additionalPersons"></div>

        <span class="button" id="addPerson">add person</span>
    </fieldset>

    <fieldset id="courses">
        <legend>Courses</legend>

        <% var days = Object.keys(config.courses) %>
        <% for(var i = 0; i < days.length; i++) { %>
            <fieldset>
                <% var day = days[i] %>
                <legend>day #<%- day %></legend>

                <table>
                <% for(var j = 0; j < config.courses[day].length; j++) { %>
                    <% var value = data.courses && data.courses[day] ? data.courses[day][j] : 0; %>
                    <% var input_id = 'f_course_' + day + '_' + j; %>
                    <tr>
                        <td><label for="<%- input_id %>"><%- config.courses[day][j] %></label></td>
                        <td><input type="number" id="<%- input_id %>" name="courses[<%- day %>][<%- j %>]" value="<%- value %>" min="0" max="<%- config.courses[day].length %>" placeholder="1-<%- config.courses[day].length %>" /></td>
                    </tr>
                <% } %>
                </table>
            </fieldset>
        <% } %>
    </fieldset>

    <fieldset id="additionalResources">
        <legend>Additional resources</legend>

        <% config.resources.forEach(function(res) { %>
            <input type="number" id="f_ar_<%- res %>" name="resources[<%- res %>]" value="<%- data.resources ? data.resources[res] : 0 %>" min="0" placeholder="0" />
            <label for="f_ar_<%- res %>"><%- res %>(s)</label>
            <br />
        <% }); %>
    </fieldset>

    <fieldset class="submit">
        <span class="button" id="register">register</span>
        <a href="#">back to list</a>
    </fieldset>
</form>

<script type="text/javascript">
    $('#f_hasCard').click(function() {
        if($('#f_hasCard').prop('checked'))
        {
            $('#cardNumber').show();
            $('#f_cardNumber').attr('required', 'required');
        }
        else
        {
            $('#cardNumber').hide();
            $('#f_cardNumber').removeAttr('required');
        }
    });
</script>
