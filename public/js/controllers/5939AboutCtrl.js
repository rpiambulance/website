angular.module('5939AboutCtrl', []).controller('5939AboutCtrl', ['$scope', '$sce', function($scope, $sce) {
    $scope.pageHeader = $sce.trustAsHtml('About 5939');
    $scope.aboutText = $sce.trustAsHtml('RPI Ambulance operates a 2006 AEV Trauma Hawk XL Type II ambulance mounted on a Ford E-350 ' +
    'chassis. This vehicle was placed in service in the Spring of 2007. The county vehicle identifier is 5939, ' +
    'however the ambulance was formerly known as A-39 and continues to hold this call sign within the agency. 5939 ' +
    'is the fifth van ambulance operated by RPI Ambulance. The first was placed in service in 1983.');

    $scope.historyHeader = $sce.trustAsHtml('Past Ambulances');
    $scope.historyText = $sce.trustAsHtml('In Spring 2007, 5939 was delivered to replace the aging A-39. A-39 ' +
    'had proudly served the agency for 10 years before being retired. The agency has also operated several other ' +
    'ambulances, the first of which was a [INSERT DATA] that was given to RPI Ambulance when members saved a member of ' +
    'the faculty from choking in one of the dining halls.');
}]);