angular.module('CoverageCtrl', []).controller('CoverageCtrl', ['$scope', function($scope) {
    $scope.showModal = {
        tier1: false,
        tier2: false,
        tier3: false
    };
    $scope.toggleModal = function(id){
        $scope.showModal["tier" + id] = !$scope.showModal["tier" + id];
    };
}]);