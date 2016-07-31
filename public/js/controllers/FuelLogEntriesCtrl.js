angular.module('FuelLogEntriesCtrl', []).controller('FuelLogEntriesCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.fuelLog = [];
    $scope.page = 1;

    $scope.vehicleOptions = ['Both', 'FR-59', '5939'];
    $scope.vehicle = $scope.vehicleOptions[0];
    $scope.pages = [];
    $scope.showModal = false;

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
}]);
