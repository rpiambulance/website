
angular.module('GamesEventsCtrl', ['mwl.calendar', 'ui.bootstrap']).controller('GamesEventsCtrl', ['$scope', '$http', function($scope, $http) {


}]);

angular.module('KitchenSinkCtrl', ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']).controller('KitchenSinkCtrl', ['moment', 'calendarConfig', '$http', '$scope', function(moment, calendarConfig, $http, $scope) {
  // TO the next developer: good luck. You're probably screwed. God bless
  var vm = this;
  vm.calendarView = 'month';
  vm.viewDate = new Date();

  $http({
      method: 'POST',
      url: 'events_calendar.php',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
  }).then(function (response) {
      var games = response.data;
       console.log(games)

       //These variables MUST be set as a minimum for the calendar to work

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

       vm.events = []

      games.forEach(function (elem) {

          var sdt= elem.date.split("-");
          var nsdt = sdt[0]+"/"+sdt[1]+"/"+sdt[2] + ' ' + elem.start;
          var nedt = sdt[0]+"/"+sdt[1]+"/"+sdt[2] + ' ' + elem.end;
          nsdt = new Date(nsdt);
          nedt = new Date(nedt);

          var temp = {
            title: elem.description + ' &mdash; ' + elem.location,
            startsAt: nsdt,
            endsAt: nedt,
            draggable: false,
            resizable: false,
            actions: actions
          }
          vm.events.push(temp);
      });

      console.log(vm.events);

      //  vm.events = [
      //    {
      //      title: 'An event',
      //      color: calendarConfig.colorTypes.warning,
      //      startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
      //      endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
      //      draggable: true,
      //      resizable: true,
      //      actions: actions
      //    }, {
      //      title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
      //      color: calendarConfig.colorTypes.info,
      //      startsAt: moment().subtract(1, 'day').toDate(),
      //      endsAt: moment().add(5, 'days').toDate(),
      //      draggable: true,
      //      resizable: true,
      //      actions: actions
      //    }, {
      //      title: 'This is a really long event title that occurs on every year',
      //      color: calendarConfig.colorTypes.important,
      //      startsAt: moment().startOf('day').add(7, 'hours').toDate(),
      //      endsAt: moment().startOf('day').add(19, 'hours').toDate(),
      //      recursOn: 'year',
      //      draggable: true,
      //      resizable: true,
      //      actions: actions
      //    }
      //  ];

       vm.cellIsOpen = true;

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
