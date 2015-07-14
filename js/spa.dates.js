/*
 * spa.dates.js
 * Dates feature module for OSCON Demo
 * Brian Capouch 
*/

spa.dates = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      main_html : String()
      + ' <h4>Date Calculation Region</h4>'
      + ' <input type="button" class="btn btn-default" value="Show Cemetery View" id="toggleButton" />'
      + ' <section id="genericDate"></section>'
      + ' <section id="cemeteryDate"></section>'
      ,

      generic_html: String()
      +'<h3>Generic Date View</h3>'
      +'<div class="row">'
         +'<div class="form-group col-md-2 col-xs-5">'
            +'<label class="control-label" for="startDate">Start</label>'

            +'<input class="form-control" type="date" id="startDate" />'
            +'<br/>'
            +'<label class="control-label" for="finishDate">End <b>(Date of interest)</b></label>'
            +'<input class="form-control" type="date" class="finishDate" />'
         +'</div>'
         +'<div class="form-group col-md-2 col-xs-7">'
            +'<label class="control-label" for="years">Years </label>'
            +'<input class="form-control" type="number" maxlength="3" class="years" />'
            +'<br/>'
            +'<label class="control-label" for="months">Months</label>'
            +'<input class="form-control" type="number" maxlength="2" class="months" />'
            +'<br/>'
            +'<div class="form-group col-md-13 col-xs-13">'

               +'<label class="control-label" for="days">Days </label>'
               +'<input class="form-control" type="number" maxlength="2" class="days" />'
              
               +'<label class="radio-inline" for="radio1">'
                  +'<input class="radio" type="radio" name="radio" value="add">Add'
               +'</label>'
               +'<label class="radio-inline" for="radio2">'
                  +'<input class="radio" type="radio" name="radio" value="sub" checked>Subtract'
               +'</label>'
               
            +'</div>'
         +'</div>'
         +'<br/>'
      +'</div>'
     
         +'<input type="button" value="Calc" class="btn btn-success btn-lg" id="calcButton" />'
         +'<input type="button" value="Clear" class="btn btn-danger btn-lg" id="clearButton" />'
         +'<aside class="output">Target:</aside>'
      
      ,

      cemetery_html: String()
      + '<h3>Cemetery Date View</h3>'
      + ' <p><label for="finishDate">Death Date</label>'
      + ' <input type="date" class="finishDate" />'
      + ' <p><label for="years">Years </label>'
      + ' <input type="number" maxlength="3" class="years" /><br>'
      + ' <label for="months">Months</label>'
      + ' <input type="number" maxlength="2" class="months" /><br>'
      + ' <label for="days">Days  </label>'
      + ' <input type="number" maxlength="2" class="days" />'
      + ' <input type="radio" name="cem_opcode" class = "add" value="sub" checked> Subtract'
      + ' <input type="radio" name="cem_opcode" class= "add" value="add">Add'
      + ' <br><input type="button" value="Calc" class="calcButton" />'
      + ' <input type="button" value="Clear" class="clearButton" />'
      + ' <aside class="output">Target:</aside>'
      },

    stateMap = {
      $container  : undefined,
    },
    jqueryMap = {},

    // Saves nasty parameter clog
    timespanMap = {
      years: undefined,
      months: undefined,
      days: undefined
    },

    // Local variables, both data and functions
    initModule, copyAnchorMap, setJqueryMap, setClicks,
    calcStartYear, postSection, operation, doDateCalc,
    generic, cemetery, genericView, buttonText,
    swapSection, dateSpan;
  //----------------- END MODULE SCOPE VARIABLES ---------------

 //------------------- BEGIN UTILITY METHODS ------------------

  // Begin method /doDateCalc/
  doDateCalc = function(startDate, operation) {
    // Mutate moment startDate by adding/subtracting timespan
    if (operation === 'add') 
      startDate.add(timespanMap.years, 'years').add(timespanMap.months,'months').add(timespanMap.days, 'days');
    else
      startDate.subtract(timespanMap.years, 'years').subtract(timespanMap.months, 'months').subtract(timespanMap.days, 'days');
    };

  // Begin method /dateSpan/
  dateSpan = function() {
    // Get dates from the input widgets
    var earlier = moment(jqueryMap.$container.find('#startDate').val()),
      later = moment(jqueryMap.$container.find('.finishDate').val()),

      // Calculate duration
      duration = (moment.duration(later.diff(earlier)).format("Y M D")),
      // Use regex to extract years, months, and days
      matchString = /(\d+) (\d+) (\d+)/,
      match = matchString.exec(duration);

      // Put them into input/display widgets
      jqueryMap.$generic.find('.years').val(match[1]);
      jqueryMap.$generic.find('.months').val(match[2]);
      jqueryMap.$generic.find('.days').val(match[3]);
  } // end /dateSpan

  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------

  // Begin method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;

    // Set initial jQuery map values
    jqueryMap = {
      $container     : $container,
      $generic	     : $container.find('#genericDate'),
      $cemetery      : $container.find('#cemeteryDate'),
      $toggle        : $container.find('#toggleButton'),

      // We need one of each of these per view container
      $genCalcButton : $container.find('#genericDate').find('.calcButton'),
      $cemCalcButton : $container.find('#cemeteryDate').find('.calcButton'),
      $genDays       : $container.find('#genericDate').find('.days'),
      $cemDays       : $container.find('#cemeteryDate').find('.days'),
      $genClear      : $container.find('#genericDate').find('.clearButton'),
      $cemClear      : $container.find('#cemeteryDate').find('.clearButton')
    };
  }; // end setJqueryMap

  // Begin method /swapSection/
  swapSection = function() {
      if ( genericView )  {
        jqueryMap.$cemetery.hide();
        jqueryMap.$generic.show();
      } else {
       jqueryMap.$generic.hide();
       jqueryMap.$cemetery.show();
     } 
    } // end swapSection 

  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------

  // Begin event handler /updateForm/
  function updateForm(container, operation) {
    var inputDate = $(container.find('.finishDate')).val(),
    // create moment objects
    finish = moment(inputDate),
    // The start object begins the same as the finish
    start = moment(finish);

    // Read the change values from widgets
    timespanMap.years = $(container.find('.years')).val();
    timespanMap.months = $(container.find('.months')).val();
    timespanMap.days = $(container.find('.days')).val();


    // Add or subtract according to opcode value (add/sub)
    doDateCalc(start, operation);
    // Write it to output
    $(container.find('.output')).html('Target: ' + start.format("dddd, MMMM Do YYYY"));
  } // end updateForm

  //-------------------- END EVENT HANDLERS --------------------

  //------------------- BEGIN PUBLIC METHODS -------------------

  // Begin Public method /initModule/
  initModule = function ( $container ) {
    // load HTML and map jQuery collections SILENTLY!
    // Start out in generic view
    stateMap.$container = $container;
    $container.hide();

    // Load up all the HTML
    $container.html( configMap.main_html );
    $container.find('#cemeteryDate').html( configMap.cemetery_html );
    $container.find('#genericDate').html( configMap.generic_html );
    
    // Set collection references
    setJqueryMap();

    // Start with the generic view
    genericView = true;
    jqueryMap.$cemetery.hide();

    // Event handlers
    // First: view container specific handlers

    // Click handler for Calc buttons
    jqueryMap.$genCalcButton.click(function() {
      // In genericDate view, Calc button has two functions
      if ($container.find('#startDate').val() && $container.find('.finishDate').val())
        // Figure distance between two dates
        dateSpan();
      else
        // Add to or subtract from a date
        // Parameters are view container and operation code
        updateForm(jqueryMap.$generic, $('input[name=gen_opcode]:checked').val());
    });

    jqueryMap.$cemCalcButton.click(function() {
      updateForm(jqueryMap.$cemetery, $('input[name=cem_opcode]:checked').val());
    }); // end handlers for Calc buttons

    // Handlers when user hits enter in "Days" widget
    jqueryMap.$genDays.keypress(function(e) {
      // 13 = Return (Enter) key
      if(e.which == 13) {
        updateForm(jqueryMap.$generic, $('input[name=gen_opcode]:checked').val());
      }
    }); 

    jqueryMap.$cemDays.keypress(function(e) {
      // 13 = Return (Enter) key
      if(e.which == 13) {
        updateForm(jqueryMap.$cemetery, $('input[name=cem_opcode]:checked').val());

      }
    }); // End handlers for enter key pressed


    // Clear input fields on clear button click
    jqueryMap.$genClear.click(function() {
      $('.finishDate').val('');
      $('#startDate').val('');
      $('.years').val('');
      $('.months').val('');
      $('.days').val('');
      // Also need to reset to subtract at this point
    });

    jqueryMap.$cemClear.click(function() {
      $('.finishDate').val('');
      $('.years').val('');
      $('.months').val('');
      $('.days').val('');
      // Also need to reset to subtract at this point
    }); // End handlers for Clear button pressed

    // Begin handler for view toggle button
    jqueryMap.$toggle.click(function() {
      // Fix up button label
      genericView = (genericView === true)?false:true;
      buttonText = (genericView === true)?'Show Cemetery View':'Show Generic View';
      jqueryMap.$toggle.prop('value', buttonText);

      //Swap actual section contents
      swapSection();
    }); // End handler for view toggle button


    // Test moment library functions by showing my age
    var now = moment(),
      startday = moment('1951-02-20');
    jqueryMap.$container.append('<br>Date now: ' 
      + now.format("dddd, MMMM Do YYYY"));
 } // End public method /initModule

  // Begin method /postSection/
  // Normal entry point - Just render container contents
  postSection = function() {
    // For now, all this does is re-display contents of section
    if (genericView) {
      jqueryMap.$cemetery.hide();
      jqueryMap.$generic.show();
    } else {
      jqueryMap.$generic.hide();
      jqueryMap.$cemetery.show();
    }
  jqueryMap.$container.show();
  } // end postSectionhttp://localhost:8000/dates

  return { initModule : initModule, 
           postSection : postSection
    };
  //------------------- END PUBLIC METHODS ---------------------
}());
