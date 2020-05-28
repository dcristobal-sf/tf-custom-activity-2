define([
    'js/postmonger'
], function(
    Postmonger
) {
    'use strict';
    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [
        {"label": "Configure Database", "key": "step0"},
        {"label": "Select Table", "key": "step1"},
        {"label": "Select Customer Key", "key": "step2"},
        {"label": "Define Condition", "key": "step3"}
    ];
    var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    /**
    * ----------[ METHOD BINDINGS ]----------
    **/

    // initialization of the activyt
    connection.on('initActivity', initialize);

    // processing sequential wizard page moves
    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);

    // processing jump to a specific part of the wizard interface
    connection.on('gotoStep', onGotoStep);

    /**
    * Method        :       onRender
    * Description   :       Entry point for Journeby Builder request, informing JB the activity
    *                        is ready for processing.
    **/
    function onRender() {
        // informs JB the custom activity is ready
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    /**
    * Method        :       initialize
    * Description   :       Processes the stored payload from journey builder, initializing the configuration
    *                        form with known values
    * Arguments
    * =================================================================
    *
    *   data        :       JSON payload sent from Journey Builder in the same form as config.json
    **/
    function initialize (data) {
        // if data is provided, set the global payload object
        if (data) {
            payload = data;
        }
        // determine of the current request already has execute arguments
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        // initialize the inArguments if they are not already passed
        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};
        // proces each in argument, setting the campaign form field with the value
        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                switch (key) {
                    case key:
                        $('#' + key).val(val);
                }
            });
        });

    }

    function onGetTokens (tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
    }

    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
    }

    function onClickedNext () {
        if (currentStep.key === 'step3') {
            save();
        } else {
            connection.trigger('nextStep');
        }
    }

    function onClickedBack () {
        connection.trigger('prevStep');
    }

    function onGotoStep (step) {
        showStep(step);
        connection.trigger('ready');
    }

    function showStep(step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex - 1];
        }
        currentStep = step;

        $('.step').hide();

        switch (currentStep.key) {
            case 'step0':
              $('#step0').show();
              connection.trigger('updateButton', {
                  button: 'next',
                  enabled: true
              });
              connection.trigger('updateButton', {
                  button: 'back',
                  visible: false
              });
              break;
            case 'step1':
                $('#step1').show();
                /* Add first one */
                var dropdown = document.getElementById('source');

                  $.ajax({url: 'https://custom-activity-eapi.uk-e1.cloudhub.io/api/database/tables?username=smoreno&password=smoreno2019&host=oracle.shared.demos.mulesoft.com&port=1521&instance=XE',   // request url
                    headers: {'Accept': 'application/json'},
                    success: function (data, status, xhr) {// success callback function
                        dropdown.innerHTML ="";
                        $.each(data, function() {
                          var opt = document.createElement('option');
                          opt.setAttribute('value',this);
                          opt.innerHTML = this;
                          dropdown.append(opt);
                            });
                          },
                    error: function(){console.log("Error")},
                    timeout: 10000
                  });

                connection.trigger('updateButton', {
                    button: 'next',
                    enabled: true
                });
                connection.trigger('updateButton', {
                    button: 'back',
                    visible: true
                });
                break;
            case 'step2':
                $('#step2').show();

                /* Add second one */
                var dropdown = document.getElementById('customerKey');

                //if(dropdown.childElementCount == 1){

                  var table = document.getElementById('source');
                  var url = 'https://custom-activity-eapi.uk-e1.cloudhub.io/api/database/tables/XXXXXXX/columns?username=smoreno&password=smoreno2019&host=oracle.shared.demos.mulesoft.com&port=1521&instance=XE'
                  url = url.replace('XXXXXXX',table.value);

                  $.ajax({url: url,   // request url
                    headers: {'Accept': 'application/json'},
                    success: function (data, status, xhr) {// success callback function
                      dropdown.innerHTML = "";
                        $.each(data, function() {
                          var opt = document.createElement('option');
                          opt.setAttribute('value',this);
                          opt.innerHTML = this;
                          dropdown.append(opt);
                            });
                          },
                    error: function(){console.log("Error")},
                    timeout: 10000
                  });
                //}

                connection.trigger('updateButton', {
                    button: 'back',
                    visible: true
                });
                connection.trigger('updateButton', {
                    button: 'next',
                    text: 'next',
                    visible: true
                });
                break;
            case 'step3':
                $('#step3').show();

                /* Add third one */
                var field1 = document.getElementById('field1');
                var field2 = document.getElementById('field2');
                var field3 = document.getElementById('field3');
                var field4 = document.getElementById('field4');
                var field5 = document.getElementById('field5');


                  var table = document.getElementById('source');
                  var url = 'https://custom-activity-eapi.uk-e1.cloudhub.io/api/database/tables/XXXXXXX/columns?username=smoreno&password=smoreno2019&host=oracle.shared.demos.mulesoft.com&port=1521&instance=XE'
                  url = url.replace('XXXXXXX',table.value);

                  $.ajax({url: url,   // request url
                    headers: {'Accept': 'application/json'},
                    success: function (data, status, xhr) {// success callback function
                      field1.innerHTML = "";
                      field2.innerHTML = "";
                      field3.innerHTML = "";
                      field4.innerHTML = "";
                      field5.innerHTML = "";
                      $.each(data, function() {
                        field1.add(new Option(this,this));
                        field2.add(new Option(this,this));
                        field3.add(new Option(this,this));
                        field4.add(new Option(this,this));
                        field5.add(new Option(this,this));
                          }
                        );
                    },
                    error: function(){console.log("Error")},
                    timeout: 10000
                  });

                connection.trigger('updateButton', {
                    button: 'back',
                    visible: true
                });
                connection.trigger('updateButton', {
                    button: 'next',
                    text: 'done',
                    visible: true
                });
                break;
        }
    }

    function save() {
        //var activityTypeCode = $('#activityTypeCode').val();
        //var channel = $('#channel').val();
        //var offerCode = $('#dynamicPropositionCode').val();
        //var propositionCode = $('#propositionCode').val();

        //payload.name = "Record Activity (" + activityTypeCode + ")";
        //payload['arguments'].execute.inArguments = [
        //    {"activityTypeCode": activityTypeCode},
        //    {"dynamicPropositionCode": offerCode},
        //    {"propositionCode": propositionCode},
        //    {"channel": channel}
        //];

        var source = $('#source').val();
        var customerKey = $('#customerKey').val();
        var field1 = $('#field1').val();
        var condition1 = $('#condition1').val();
        var value1 = $('#value1').val();
        var field2 = $('#field2').val();
        var condition2 = $('#condition2').val();
        var value2 = $('#value2').val();
        var field3 = $('#field3').val();
        var condition3 = $('#condition3').val();
        var value3 = $('#value3').val();
        var field4 = $('#field4').val();
        var condition4 = $('#condition4').val();
        var value4 = $('#value4').val();
        var field5 = $('#field5').val();
        var condition5 = $('#condition5').val();
        var value5 = $('#value5').val();

        payload.name = "External DB";
        /*payload['arguments'].execute.inArguments = [
            {"source": source},
            {"customerKey": customerKey},
            {"field1": field1},
            {"condition1": condition1},
            {"value1": value1},
            {"field2": field2},
            {"condition2": condition2},
            {"value2": value2},
            {"field3": field3},
            {"condition3": condition3},
            {"value3": value3},
            {"field4": field4},
            {"condition4": condition4},
            {"value4": value4},
            {"field5": field5},
            {"condition5": condition5},
            {"value5": value5}
        ];*/
        payload['arguments'].execute.inArguments.push({"source": source});
        payload['arguments'].execute.inArguments.push({"customerKey": customerKey});
        payload['arguments'].execute.inArguments.push({"field1": field1});
        payload['arguments'].execute.inArguments.push({"condition1": condition1});
        payload['arguments'].execute.inArguments.push({"value1": value1});
        payload['arguments'].execute.inArguments.push({"field2": field2});
        payload['arguments'].execute.inArguments.push({"condition2": condition2});
        payload['arguments'].execute.inArguments.push({"value2": value2});
        payload['arguments'].execute.inArguments.push({"field3": field3});
        payload['arguments'].execute.inArguments.push({"condition3": condition3});
        payload['arguments'].execute.inArguments.push({"value3": value3});
        payload['arguments'].execute.inArguments.push({"field4": field4});
        payload['arguments'].execute.inArguments.push({"condition4": condition4});
        payload['arguments'].execute.inArguments.push({"value4": value4});
        payload['arguments'].execute.inArguments.push({"field5": field5});
        payload['arguments'].execute.inArguments.push({"condition5": condition5});
        payload['arguments'].execute.inArguments.push({"value5": value5});

        payload['metaData'].isConfigured = true;

        connection.trigger('updateActivity', payload);
    }
});
