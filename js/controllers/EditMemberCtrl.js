angular.module('EditMemberCtrl', []).controller('EditMemberCtrl', ['$scope', '$http', '$location', '$routeParams', '$q', function($scope, $http, $location, $routeParams, $q) {
    $scope.searchFilter = "";

    $scope.areChangesPending= false;

    $scope.trainingFields = [
        { field: 'nims100',     label: 'NIMS-100'    },
        { field: 'nims200',     label: 'NIMS-200'    },
        { field: 'nims700',     label: 'NIMS-700'    },
        { field: 'nims800',     label: 'NIMS-800'    },
        { field: 'ics5',        label: 'ICS-0005'    },
        { field: 'atropine',    label: 'Atropine'    },
        { field: 'albuterol',   label: 'Albuterol'   },
        { field: 'epiniperine', label: 'Epinephrine' },
        { field: 'glucometry',  label: 'Glucometry'  },
    ];

    $scope.crewPositions = [
        { field: 'attendant',       label: 'Attendant'               },
        { field: 'crewchief',       label: 'Crew-Chief'              },
        { field: 'cctrainer',       label: 'Crew-Chief Trainer'      },
        { field: 'driver',          label: 'Driver'                  },
        { field: 'drivertrainer',   label: 'Driver Trainer'          },
        { field: 'dutysup',         label: 'Duty Supervisor'         },
        { field: 'ees',             label: 'Event EMS Supervisor'    },
        { field: 'firstresponsecc', label: 'FR-59 Crew Chief'        },
        { field: 'backupcc',        label: 'Probationary Crew Chief' },
        { field: 'backupdriver',    label: 'Probationary Driver'     }
    ];

    $scope.stateCodes = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
        'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
        'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
        'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
        'WI', 'WY'
    ];

    $scope.months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];

    $scope.positions = [
        { field: 'captain',        label: 'Captain'                  },
        { field: 'firstlt',        label: 'First Lt'                 },
        { field: 'secondlt',       label: 'Second Lt'                },
        { field: 'pres',           label: 'President'                },
        { field: 'vicepres',       label: 'Vice President'           },
        { field: 'schedco',        label: 'Scheduling Coordinator'   },
        { field: 'radioco',        label: 'Radio Coordinator'        },
        { field: 'traincommchair', label: 'Training Committee Chair' },
        { field: 'cprco',          label: 'CPR Coordinator'          },
        { field: 'aedco',          label: 'AED Coordinator'          },
        { field: 'webmaster',      label: 'Webmaster'                }
    ];

    $scope.yesNoQuestions = [
        // { field: '', label: 'Can create games/events?', yes: 'Yes', no: 'No' },
        // { field: '', label: 'Can manage content?', yes: 'Yes', no: 'No' },
        { field: 'admin',          label: 'Is a full admin?', yes: 'Yes',            no: 'No'             },
        { field: 'access_revoked', label: 'Website Access',   yes: 'Access Revoked', no: 'Access Granted' },
        { field: 'active',         label: 'Member Status',    yes: 'Active',         no: 'Inactive'       }
    ];

    var NUMBERS = [
        'rin', 'radionum', 'emt_num'
    ];

    var DATES = [
        'dob', 'emt_exp', 'cpr_exp'
    ];

    $scope.chooseMember = function (member) {
        $location.path('/edit-member/' + member.id);
    };

    $scope.clearSelected = function (member) {
        $location.path('/edit-member');
    };

    $scope.save = function () {
        if($scope.selectedMember.position === 'webmaster') {
            $scope.selectedMember.admin = '1';
            $scope.selectedMember.captain = '0';
        } else if($scope.selectedMember.position) {
            $scope.selectedMember[$scope.selectedMember.position] = '1';
        }

        $http({
            method: 'POST',
            url: 'member_table.php',
            data: $scope.selectedMember,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).then(function (response) {

        });

        // TODO: Save the stuff here
    };

    $scope.feelingLucky = function () {
        $scope.chooseMember($scope.members[Math.floor(Math.random() * $scope.members.length)]);
    };

    function loadData () {
        if($routeParams.memberId) {
            $http.get('member_table.php?member_id=' + $routeParams.memberId).then(function (response) {
                $scope.selectedMember = response.data[0];
                memberPostProcessing($scope.selectedMember);
            });
        } else {
            $http.get('member_table.php?include_inactive').then(function (response) {
                $scope.members = response.data;
                memberlistPostProcessing();
            });
        }
    }
    loadData();

    function memberlistPostProcessing () {
        for (var i = 0; i < $scope.members.length; i++) {
            $scope.members[i] = memberPostProcessing($scope.members[i]);
        }
    }

    function memberPostProcessing (member) {
        for(var j = 0; j < DATES.length; j++) {
            member[DATES[j]] = new Date(member[DATES[j]]);
        }

        for(var j = 0; j < NUMBERS.length; j++) {
            member[NUMBERS[j]] = parseInt(member[NUMBERS[j]]);
        }

        if(member.emt_level === '') {
            member.emt_level = 'Not an EMT';
        }

        if(!member.access_revoked) {
            member.access_revoked = 0;
        }

        if(member.admin == 1 && member.captain == 0) {
            member.webmaster = '1';
        }

        for (var j = 0; j < $scope.positions.length; j++) {
            if(member[$scope.positions[j].field] == 1) {
                member.position = $scope.positions[j].field;
                break;
            }
        }

        return member;
    }

    $scope.changeMade = function() {
        $scope.areChangesPending = true;
        console.log("change!")
    }


    $scope.save = function () {
        if(!$scope.areChangesPending) {
            return;
        }

        var data = 'data=' + JSON.stringify($scope.selectedMember) + '&session_id=' + $scope.getSessionIDCookie();

        $http({
            method: 'POST',
            url: '.edit_member.php',
            data: data, // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).then(function (data) {
            console.log(data);
            if (!data.success) {
                console.log("it failed!");
                $scope.submission = true; //shows the error message
                $scope.showError= true;
            } else {
                console.log("it succeeded!");

                $scope.areChangesPending = false;

                $scope.successName = $scope.formData.first_name + ' ' + $scope.formData.last_name;
                $scope.showContactSuccess = true;
                // if successful, bind success message to message
                $scope.submissionMessage = data.messageSuccess;
                $scope.submission = true; //shows the success message
            }
        });
    };

}]);
