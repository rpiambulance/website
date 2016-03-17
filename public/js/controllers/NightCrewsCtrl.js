angular.module('NightCrewsCtrl', []).controller('NightCrewsCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.number= 7;
    $scope.getNumber = function(num) {
        return new Array(num);
    };

    getProject();

    function getProject(){
        console.log("GET");
        $http.post('.crews.php').success(function(data){
            console.log("Here");

            $scope.projects = data; //the data are stored in projects

        })}


}]);