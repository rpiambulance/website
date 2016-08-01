angular.module('FuelLogEntriesCtrl', []).controller('FuelLogEntriesCtrl', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService) {
    $scope.fuelLog = [];
    $scope.page = 1;

    $scope.vehicleOptions = ['Both', 'FR-59', '5939'];
    $scope.vehicle = $scope.vehicleOptions[0];
    $scope.pages = [];
    $scope.showModal = false;


    AuthService.getUserMetadata().then(function (data) {
        console.log(data);
        $scope.username = data.username;
        $scope.crewchief = data.crewchief == 1;
        $scope.cctrainer = data.cctrainer == 1;
        $scope.backupcc = data.backupcc == 1;
        $scope.driver = data.driver == 1;
        $scope.drivertrainer = data.drivertrainer == 1;

    }, function (error) { console.log(error); });


    function load() {
        var url = '.fuel_log_entries.php?page=' + $scope.page;

        if($scope.vehicle !== 'Both') {
            url += '&vehicle=' + $scope.vehicle;
        }

        $http.get(url).then(function (response) {
            $scope.fuelLog    = response.data.results;
            $scope.totalPages = response.data.totalPages;
            $scope.count      = response.data.count;
            $scope.pages      = [];

            for(var i = 1; i <= $scope.totalPages; i++) {
                $scope.pages.push(i);
            }
        });
    }
    load();

    $scope.changePage = function (p) {
        $scope.page = p;

        load();
    };

    $scope.changeVehicle = function (v) {
        $scope.vehicle = v;
        $scope.page = 1;

        load();
    }

    $scope.displayModal = function () {
        $scope.showModal = true;
    }


    //ADDED FUNCTIONS


    $scope.formData = {
        name: "",
        date: $scope.getDatetime,
        qty: "",
        mileage: "",
        vehicle: ""
    };

    var autocompleteValidate = function () {
        var corrected = {};
        for (var d in $scope.formData) {
            if($scope.formData.hasOwnProperty(d)) {
                if(document.getElementById(d).value !== $scope.formData[d]) {
                    corrected[d] = document.getElementById(d).value;
                } else {
                    corrected[d] = $scope.formData[d];
                }
            }
        }
        return corrected;
    };

    $scope.clearForm = function () {
        for (var d in $scope.formData) {
            if ($scope.formData.hasOwnProperty(d))
                $scope.formData[d] = "";
        }
    };

    $scope.vehicle = {
        Amb: false,
        FR59: false
    };


    $scope.getDatetime = new Date();



    $scope.submitForm = function () {
        if(!document.getElementById("g-recaptcha-response")) {
            return;
        }

        $scope.formData["g-recaptcha-response"] = document.getElementById("g-recaptcha-response").value;

        if ($scope.vehicle["Amb"] == true) {
            $scope.formData["vehicle"]= "5939"
        }
        else if ($scope.vehicle["FR59"] == true) {
            $scope.formData["vehicle"]= "FR-59"
        }

        $http({
            method: 'POST',
            url: '.fuel.php',
            data: $scope.formData, // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).success(function (data) {
            if (!data.success) {
                console.log("it failed!");
                // if not successful, bind errors to error variables

                $scope.submission = true; //shows the error message
            } else {
                $scope.showContactSuccess = true;
                // if successful, bind success message to message
                $scope.submissionMessage = data.messageSuccess;
                $scope.formData = {}; // form fields are emptied with this line
                $scope.submission = true; //shows the success message
            }
        });
    };



}]);
