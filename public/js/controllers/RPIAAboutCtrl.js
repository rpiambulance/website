angular.module('RPIAAboutCtrl', []).controller('RPIAAboutCtrl', ['$scope', '$sce', function($scope, $sce) {
    $scope.pageHeader = $sce.trustAsHtml('About RPI Ambulance');
    $scope.aboutText = $sce.trustAsHtml('RPI Ambulance is a student run and operated Basic Life Support (BLS) transporting ambulance ' +
    'agency that serves the RPI campus and surrounding communities. We respond to approximately 150 to 200 calls ' +
    'and provide first aid coverage to about 25 special events every academic year. All students of RPI are eligible ' +
    'to join RPI Ambulance, no previous experience is necessary. Members can train to become drivers, crew chiefs or ' +
    'just come to help out!');

    $scope.historyHeader = $sce.trustAsHtml('Our History');
    $scope.historyText = $sce.trustAsHtml('RPI Ambulance was founded in [YEAR] as the first EMS agency in Troy and the surrounding ' +
    'area. Today, RPIA serves the RPI campus as well as some of the surrounding towns. We mainly respond to ' +
    'on-campus calls, but also recieve mutual aid calls to Brunswick, North Greenbush (including Wynantskill and ' +
    'Defreestville), and Poestenkill.');
}]);