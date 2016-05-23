angular.module('MemberListCtrl', []).controller('MemberListCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.getMembers = function () {
        $http({
            method: 'POST',
            url: '.member_table.php',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).success(function (req, res) {
            console.log("This is weird.");


        });
    };
    
    
}]);