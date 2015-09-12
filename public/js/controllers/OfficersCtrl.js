angular.module('OfficersCtrl', []).controller('OfficersCtrl', ['$scope', '$sce', function($scope, $sce) {
    $scope.pageHeader = $sce.trustAsHtml('Officer Board');
    $scope.officersDesc = $sce.trustAsHtml('The officers of RPI Ambulance are elected at the first general body meeting of November. The ' +
        'officers perform day to day and long term operational and administrative tasks. In 2009 the RPI Ambulance ' +
        'Constitution was changed to reduce the officer board from 8 officers to 5 consolidating "non-steering" ' +
        'positions into more important roles. This will allow for a smaller, more efficient officer board and the ' +
        'opportunity for more members to become involved with non-elected coordinator positions.');
}]);