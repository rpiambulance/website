
angular.module('GamesEventsCtrl', ['mwl.calendar', 'ui.bootstrap']).controller('GamesEventsCtrl', ['$scope', '$http', function($scope, $http) {


}]);

angular.module('KitchenSinkCtrl', ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']).controller('KitchenSinkCtrl', ['moment', 'calendarConfig', '$http', '$scope', function(moment, calendarConfig, $http, $scope) {
  // TO the next developer: good luck. You're probably screwed. God bless
  var vm = this;
  vm.calendarView = 'month';
  vm.viewDate = new Date();
  vm.events = []

  var actions = [{
    label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
    onClick: function(args) {
      sweetAlert('Edited', JSON.stringify(event), 'success');
      // alert.show('Edited', args.calendarEvent);
    }
  }, {
    label: '<i class=\'glyphicon glyphicon-remove\'></i>',
    onClick: function(args) {
      sweetAlert('Deleted', JSON.stringify(event), 'succcess');
      // alert.show('Deleted', args.calendarEvent);
    }
  }];

  $http({
      method: 'POST',
      url: 'events_calendar.php',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
  }).then(function (response) {
      var events = response.data;

      events.forEach(function (elem) {

          var sdt= elem.date.split("-");
          var nsdt = sdt[0]+"/"+sdt[1]+"/"+sdt[2] + ' ' + elem.start;
          var nedt = sdt[0]+"/"+sdt[1]+"/"+sdt[2] + ' ' + elem.end;
          nsdt = new Date(nsdt);
          nedt = new Date(nedt);
          var game = false;
          if (elem.limit == 0 || elem.limit == -1) {
            game = calendarConfig.colorTypes.success;
          }
          else{
            game = calendarConfig.colorTypes.warning;
          }

          var temp = {
            title: elem.description + ' &mdash; ' + elem.location,
            startsAt: nsdt,
            endsAt: nedt,
            draggable: false,
            resizable: false,
            actions: actions,
            color: game
          }
          vm.events.push(temp);
      });

  });


  $http({
      method: 'POST',
      url: 'games_calendar.php',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
  }).then(function (response) {
      var games = response.data;
       console.log(games)

      games.forEach(function (elem) {

          var sdt= elem.date.split("-");
          var nsdt = sdt[0]+"/"+sdt[1]+"/"+sdt[2] + ' ' + elem.start;
          var nedt = sdt[0]+"/"+sdt[1]+"/"+sdt[2] + ' ' + elem.end;
          nsdt = new Date(nsdt);
          nedt = new Date(nedt);
          var game = false;
          if (elem.ees == 1) {
            game = calendarConfig.colorTypes.important;
          }
          else{
            game = calendarConfig.colorTypes.info;
          }

          var temp = {
            title: elem.description + ' &mdash; ' + elem.location,
            startsAt: nsdt,
            endsAt: nedt,
            draggable: false,
            resizable: false,
            actions: actions,
            color: game
          }
          vm.events.push(temp);
      });

      console.log(vm.events);


       vm.cellIsOpen = false;

       vm.addEvent = function() {
         vm.events.push({
           title: 'New event',
           startsAt: moment().startOf('day').toDate(),
           endsAt: moment().endOf('day').toDate(),
           color: calendarConfig.colorTypes.important,
           draggable: true,
           resizable: true
         });
       };

       vm.eventClicked = function(event) {
         sweetAlert('Clicked', JSON.stringify(event), 'info');
         //alert.show('Clicked', event);
       };

       vm.eventEdited = function(event) {
         sweetAlert('Edited', JSON.stringify(event), 'success');
         //alert.show('Edited', event);
       };

       vm.eventDeleted = function(event) {
         sweetAlert('Deleted', JSON.stringify(event), 'success');
         //alert.show('Deleted', event);
       };

       vm.eventTimesChanged = function(event) {
         sweetAlert('Dropped or resized', JSON.stringify(event), 'success');
         //alert.show('Dropped or resized', event);
       };

       vm.toggle = function($event, field, event) {
         $event.preventDefault();
         $event.stopPropagation();
         event[field] = !event[field];
       };

       vm.timespanClicked = function(date, cell) {

         if (vm.calendarView === 'month') {
           if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
             vm.cellIsOpen = false;
           } else {
             vm.cellIsOpen = true;
             vm.viewDate = date;
           }
         } else if (vm.calendarView === 'year') {
           if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
             vm.cellIsOpen = false;
           } else {
             vm.cellIsOpen = true;
             vm.viewDate = date;
           }
         }

       };


  });



}]);
