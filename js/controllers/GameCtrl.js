var ctrl_name = 'GameCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', '$http', '$httpParamSerializerJQLike', '$location', '$route', '$routeParams', 'AuthService', 'moment', function ($scope, $http, $httpParamSerializerJQLike, $location, $route, $routeParams, AuthService, moment) {
    $scope.calendarView = $location.search()['calendarView'] || 'month';

    $scope.load = function () {
        $scope.loaded = false;
        AuthService.isAdmin().then(function (response) {
            $scope.admin = response.admin === '1';
        });

        $scope.positions = [];
        $scope.filtered = {};

        $http({
            method: 'POST',
            url: '.get_game_info.php',
            data: "session_id=" + AuthService.getSessionId() + "&game_id=" + $routeParams.gameId,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            if (!response.data.success) {
                console.log("it failed!");
                console.log(response.data);
                $location.url('/games-events');
            } else {
                console.log(response.data);
                $scope.attendees = response.data.attendees;
                $scope.game = response.data.game;
                $scope.alreadySignedUp = response.data.alreadySignedUp;
                $scope.eligiblePositions = response.data.eligiblePositions;
                $scope.currentPosition = response.data.currentPosition;
                // Related to the email modal
                $scope.showModal = false;
                $scope.formData = {
                    additionalinfo: ''
                };

                $scope.game.startObj = moment(`${$scope.game.date} ${$scope.game.start}`).toDate();
                $scope.game.endObj = moment(`${$scope.game.date} ${$scope.game.end}`).toDate();

                $scope.positions = [
                    { title: 'Crew Chief', value: 'cc', attendees: []},
                    { title: 'Driver', value: 'driver', attendees: []},
                    { title: 'Attendant', value: 'attendant', attendees: []},
                    { title: 'Observer', value: 'observer', attendees: []}
                ];

                if ($scope.game.ees === '1') {
                    $scope.positions.unshift({ title: 'EES', value: 'ees', attendees: []});
                }
                $scope.attendees.forEach((a) => {
                    switch(a.position) {
                        case $scope.positions[0].value:
                            $scope.positions[0].attendees.push(a);
                            break;
                        case $scope.positions[1].value:
                            $scope.positions[1].attendees.push(a);
                            break;
                        case $scope.positions[2].value:
                            $scope.positions[2].attendees.push(a);
                            break;
                        case $scope.positions[3].value:
                            $scope.positions[3].attendees.push(a);
                            break;
                        case $scope.positions[4].value:
                            $scope.positions[4].attendees.push(a);
                            break;
                    }
                });
                $scope.loaded = true;
            }
        });
    };
    $scope.load();

    $scope.signup = function (position) {
        if ($scope.alreadySignedUp && $scope.currentPosition === position) {
            return;
        }

        $http({
            method: 'POST',
            url: '.signup_game.php',
            data: 'session_id=' + AuthService.getSessionId() + '&game_id=' + $routeParams.gameId + '&position=' + position,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            console.log(response.data);
            $route.reload();
        })
    };

    $scope.drop = function () {
        if (!$scope.alreadySignedUp) {
            return;
        }

        $http({
            method: 'POST',
            url: '.drop_game.php',
            data: 'session_id=' + AuthService.getSessionId() + '&game_id=' + $routeParams.gameId,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            console.log(response);
            $route.reload();
        });
    };

    $scope.dropMember = function (memberid) {
        if (!$scope.admin) {
            return;
        }

        $http({
            method: 'POST',
            url: '.drop_game_other_member.php',
            data: 'session_id=' + AuthService.getSessionId() + '&game_id=' + $routeParams.gameId + '&member_id=' + memberid,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            console.log(response.data);
            $route.reload();
        });
    };

    $scope.deleteGame = function () {
        if (!$scope.admin) {
            return;
        }
        sweetAlert({
            title: "Are you sure?",
            text: "This action will permanently delete the game " + $scope.game.description + ". Do you want to proceed?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#c52d2f",
            confirmButtonText: "Delete",
            closeOnConfirm: false
        }, function () {
            $http({
                method: 'POST',
                url: '.delete_game.php',
                data: 'session_id=' + AuthService.getSessionId() + '&game_id=' + $routeParams.gameId,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                sweetAlert("Deleted!", "The game " + $scope.game.description + " has been deleted.", "success");
                $location.url('/games-events');
            });
        });
    }

    $scope.editGame = function () {
        if (!$scope.admin) {
            return;
        }
        $location.url('/edit/game/' + $routeParams.gameId);
    }

    $scope.displayModal = () => {
        $scope.showModal = true;
    }

    $scope.sendEmail = () => {
        $scope.showModal = false;
        if (!$scope.admin) {
            return;
        }
        let body = `Thank you for signing up for ${$scope.game.description} with RPI Ambulance. The event is ${$scope.game.date} at ${$scope.game.start} hours. Please meet at the garage 5 minutes prior to ensure a prompt departure.\n\n`;
        body += 'Attendance is as follows:\n';
        $scope.positions.forEach((p) => {
            if (p.attendees.length != 0) {
                const title_text = p.attendees.length == 1 ? p.title : p.title + 's';
                body += `${title_text}: ${p.attendees[0].ambulance_name}`;
                for (let i = 1; i < p.attendees.length; i++) {
                    body += `, ${p.attendees[i].ambulance_name}`;
                }
                body += '\n';
            }
        });
        body += `\nAdditional Info:\n${$scope.formData.additionalinfo}`;
        body += '\n\nIf you have any questions, you can reach out to secondlt@rpiambulance.com. Thanks!\n\n';
        const emailData = {
            subject: `${$scope.game.description}`,
            to: $scope.attendees.map(a => a.email),
            body: body,
            sessionId: AuthService.getSessionId()
        };
        $http({
            method: 'POST',
            url: '.mailer.php',
            data: $httpParamSerializerJQLike(emailData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            if (response.data.success) {
                sweetAlert("Email sent!", "Your event email has been successfully sent!", "success");
                $location.url('/games-events');
            } else {
                sweetAlert("Failed to send email!", "Oops it appears your email couldn't send. Please try again.", "error");
            }

        });
    }

}]);
