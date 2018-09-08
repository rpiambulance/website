angular.module('GamesEventsCtrl', ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']).controller('GamesEventsCtrl', ['moment', 'calendarConfig', '$http', '$scope', 'AuthService', 'DateService', '$q', '$location', '$window', function(moment, calendarConfig, $http, $scope, AuthService, DateService, $q, $location, $window) {
    // TO the next developer: good luck. You're probably screwed. God bless
    AuthService.isAdmin().then(function (response) {
        $scope.admin = response.admin === '1';
    });

    // Set an initial value so that if we go to /#/
    $scope.initialView = false;
    $scope.initialDate = false;
    $scope.calendarView = $location.search()['calendarView'] || 'month';

    if ($location.search()['viewDate']) {
        $scope.viewDate = new Date($location.search()['viewDate']);
    }
    else {
        $scope.viewDate = new Date();
    }
    $scope.events = [];

    var hold = AuthService.isAdmin();

    var actions = [];

    $scope.$watch('viewDate', function() {
        if ($scope.initialDate && $location.search()['viewDate'] !== DateService.formatViewDate($scope.viewDate)) {
            $location.search('viewDate', DateService.formatViewDate($scope.viewDate));
            $window.history.pushState(null, 'any', $location.absUrl());
        }
        $scope.previousDate = $scope.viewDate;
        $scope.initialDate = true;
    });

    $scope.$watch('calendarView', function() {
        if ($scope.initialView && $location.search()['calendarView'] !== $scope.calendarView) {
            $location.search('calendarView', $scope.calendarView);
            $window.history.pushState(null, 'any', $location.absUrl());
        }
        $scope.initialView = true;
    });

    // This implements the ability to manually go to a viewDate/calendarView and have that
    // update the page while having the reloadOnSearch be false. This detects any
    // change in the route/URL of the page you're detecting, whether done by the user
    // manually or via updating the $location.search() variable, and discards the
    // trigger done by the latter as it'll match the scored values in the $scope unlike
    // the former
    $scope.$on('$routeUpdate', function() {
        if ($location.search()['viewDate']) {
            var viewDate = $location.search()['viewDate'].split('-');
            if (Number.parseInt(viewDate[0]) !== $scope.viewDate.getFullYear()) {
                $scope.viewDate = new Date($location.search()['viewDate']);
            }
            else if ((Number.parseInt(viewDate[0])-1) !== $scope.viewDate.getMonth()) {
                $scope.viewDate = new Date($location.search()['viewDate']);
            }
            else if (Number.parseInt(viewDate[2]) !== $scope.viewDate.getDate()) {
                $scope.viewDate = new Date($location.search()['viewDate']);
            }
        }
        if ($location.search()['calendarView'] && $scope.calendarView !== $location.search()['calendarView']) {
            $scope.calendarView = $location.search()['calendarView'];
        }
    });

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
                dbId: elem.id,
                title: elem.description + ' &mdash; ' + elem.location,
                startsAt: nsdt,
                endsAt: nedt,
                draggable: false,
                resizable: false,
                actions: actions,
                color: game
            }
            $scope.events.push(temp);
        });
    });

    $http({
        method: 'POST',
        url: 'games_calendar.php',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
    }).then(function (response) {
        var games = response.data;

        games.forEach(function (elem) {
            var sdt= elem.date.split("-");
            var nsdt = sdt[0]+"/"+sdt[1]+"/"+sdt[2] + ' ' + elem.start;
            var nedt = sdt[0]+"/"+sdt[1]+"/"+sdt[2] + ' ' + elem.end;
            nsdt = new Date(nsdt);
            nedt = new Date(nedt);
            var game = false;
            if (elem.ees == 1) {
                game = calendarConfig.colorTypes.important;
            } else{
                game = calendarConfig.colorTypes.info;
            }

            var temp = {
                dbId: elem.id,
                title: elem.description + ' &mdash; ' + elem.location,
                startsAt: nsdt,
                endsAt: nedt,
                draggable: false,
                resizable: false,
                actions: actions,
                color: game
            }
            $scope.events.push(temp);
        });

        $scope.cellIsOpen = false;

        $scope.addEvent = function() {
            $scope.events.push({
                title: 'New event',
                startsAt: moment().startOf('day').toDate(),
                endsAt: moment().endOf('day').toDate(),
                color: calendarConfig.colorTypes.important,
                draggable: true,
                resizable: true
            });
        };

        $scope.eventClicked = function(event) {
            var url = '/';
            if (event.color.primary == '#ad2121' || event.color.primary == '#1e90ff') {
                url += 'game/';
            }
            else {
                url += 'event/';
            }
            $location.url(url + event.dbId + '?calendarView=' + $scope.calendarView);
        };

        $scope.eventEdited = function(event) {
          if (event.color.primary == '#ad2121' || event.color.primary == '#1e90ff') {
              $location.url("/add-event/" + event.dbId);
          } else {
              $location.url("/event-event/" + event.dbId);
          }
        };

        $scope.eventDeleted = function(event) {
            sweetAlert('Deleted', 'success');
            //alert.show('Deleted', event);
        };

        $scope.eventTimesChanged = function(event) {
            sweetAlert('Dropped or resized', JSON.stringify(event), 'success');
            //alert.show('Dropped or resized', event);
        };

        $scope.toggle = function($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();
            event[field] = !event[field];
        };

        $scope.timespanClicked = function(date, cell) {
            if ($scope.calendarView === 'month') {
                if (($scope.cellIsOpen && moment(date).startOf('day').isSame(moment($scope.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
                    $scope.cellIsOpen = false;
                } else {
                    $scope.cellIsOpen = true;
                    $scope.viewDate = date;
                }
            } else if ($scope.calendarView === 'year') {
                if (($scope.cellIsOpen && moment(date).startOf('month').isSame(moment($scope.viewDate).startOf('month'))) || cell.events.length === 0) {
                    $scope.cellIsOpen = false;
                } else {
                    $scope.cellIsOpen = true;
                    $scope.viewDate = date;
                }
            }
        };

        $scope.onEventTimesChanged = function (calendarEvent, calendarNewEventStart, calendarNewEventEnd) {
            $scope.eventTimesChanged(calendarEvent);
            calendarEvent.startsAt = calendarNewEventStart;
            calendarEvent.endsAt = calendarNewEventEnd
        }
    });
}]);
