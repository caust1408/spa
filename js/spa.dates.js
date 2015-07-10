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
 +'<h4>Date Calculation Region</h4>'
   +'<div class="row">'
      +'<div class="form-group col-sm-3">'
         +'<label for="finishDate" class="control-label">Finish Date</label>'
         +'<input class="form-control" type="date" name="finishDate" id="finishDate" />'
      +'</div>'
      +'<div class="form-group col-sm-3">'
         +'<label for="years" class="control-label">Years </label>'
         +'<input class="form-control" type="number" maxlength="3" name ="years" id="years" />'
      +'</div>'
      +'<div class="form-group col-sm-3">'
         +'<label for="months" class="control-label">Months</label>'
         +'<input class="form-control" type="number" maxlength="2" name="months" id="months" />'
      +'</div>'
      +'<div class="form-group col-sm-3">'
         +'<label for="days" class="control-label">Days </label>'
         +'<input class="form-control" type="number" maxlength="2" name="days" id="days" />'
      +'</div>'
   +'</div>'
   +'<input class="btn btn-success btn-md" type="button" value="Calc" id="calcButton" />'
   +'<input class="btn btn-danger btn-md" type="button" value="Clear" id="clearButton" />'
   +'<aside id="output">Target</aside>'
    },
    stateMap = {
      $container  : undefined,
    },
    jqueryMap = {},

    // Local variables, both data and functions
    initModule, copyAnchorMap, setJqueryMap, setClicks,
    calcStartYear, postSection, operation;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;

    // Set initial jQuery map values
    jqueryMap = {
      $container  :  $container,
      $calcButton :  $container.find('#calcButton'),
      $days       :  $container.find('#days'),
      $clear      :  $container.find('#clearButton')
    };
  };
  // End DOM method /setJqueryMap/

  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  //-------------------- END EVENT HANDLERS --------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin Public method /initModule/
  // Example   : spa.dates.initModule( $('#app_div_id') );
  // Purpose   :
  //   Sets up data calculations
  // Arguments :
  //   * $container (example: $('#app_div_id')).
  //     A jQuery collection that should represent 
  //     a single DOM container
  // Action    :
  //   Populates $container with the shell of the UI
  //   and then configures and initializes feature modules.
  //   The Shell is also responsible for browser-wide issues
  //   such as URI anchor and cookie management
  // Returns   : none 
  // Throws    : none
  initModule = function ( $container ) {
    // load HTML and map jQuery collections
    stateMap.$container = $container;
    $container.hide();
    $container.html( configMap.main_html );
    setJqueryMap();

    // Click handler for Calc button
    jqueryMap.$calcButton.click(function() {
      // store the date input by user
      var inputDate = $('#finishDate').val(),

        // Read the change values from widgets
        elapsedYears = $('#years').val(),
        elapsedMonths = $('#months').val(),
        elapsedDays = $('#days').val(),

        // create moment objects
        finish = moment(inputDate),
        // The start object begins the same as the finish
        start = moment(finish);
      
              // Which operation--add or subtract?
        // Note: fix by putting into jqueryMap if we can
        operation =  $('input[name=opcode]:checked').val();
        // Is this the best way to do it?
        if (operation === 'add') {
          elapsedYears = -(elapsedYears);
          elapsedMonths = -(elapsedMonths);
          elapsedDays = -(elapsedDays);
          }

        // Subtract each piece from the finish time to mutate the start
        start.subtract(elapsedYears, 'years').subtract(elapsedMonths, 'months').subtract(elapsedDays, 'days'); 
      // Write it to output
      $('#output').html('Birth: ' + start.format("dddd, MMMM Do YYYY") );
      });

      // Fix below!  It duplicates the above logic 100% 
      //   except for the event name 
    // Handler when user hits enter in "Days" widget
    jqueryMap.$days.keypress(function(e) {
      // 13 = Return (Enter) key
      if(e.which == 13) {
        // This logic is identical to click handler above!
        var inputDate = $('#finishDate').val(),
        elapsedYears = $('#years').val(),
        elapsedMonths = $('#months').val(),
        elapsedDays = $('#days').val(),
        finish = moment(inputDate),
        start = moment(finish);
        
                // Which operation--add or subtract?
        // Note: fix by putting into jqueryMap if we can
        operation =  $('input[name=opcode]:checked').val();

        // Is this the best way to do it?
        if (operation === 'add') {
          elapsedYears = -(elapsedYears);
          elapsedMonths = -(elapsedMonths);
          elapsedDays = -(elapsedDays);
          }

        start.subtract(elapsedYears, 'years').subtract(elapsedMonths, 'months').subtract(elapsedDays, 'days');
      $('#output').html('Birth: ' + start.format("dddd, MMMM Do YYYY"));
      }
      }); 

    // Clear input fields on clear button click
    jqueryMap.$clear.click(function() {
      $('#finishDate').val('');
      $('#years').val('');
      $('#months').val('');
      $('#days').val('');
      });

    // Test moment library functions by showing my age
    var now = moment(),
      startday = moment('1951-02-20');
    jqueryMap.$container.append('<br>Date now: ' 
      + now.format("dddd, MMMM Do YYYY") 
      + '<br>Capouch\'s precise age: ' + moment.duration(now.diff(startday)).format());

 } 
 
 postSection = function() {
  // For now, all this does is re-display contents of section    
  jqueryMap.$container.show();
  }

  return { initModule : initModule, 
	   postSection : postSection
         };
  //------------------- END PUBLIC METHODS ---------------------
}());
