angular.module('MyTrainingCtrl', []).controller('MyTrainingCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.tabs = [
        {
            title: 'Attendant',
            url: 'att.tpl.html'
        },
        {
            title: 'Driver',
            url: 'driver.tpl.html'
        },
        {
            title: 'Crew Chief',
            url: 'cc.tpl.html'
        },
        {
            title: 'FR Crew Chief',
            url: 'frcc.tpl.html'
        },
        {
            title: 'EES',
            url: 'ees.tpl.html'
        }];

    $scope.currentTab = 'att.tpl.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }

    $scope.isActiveTab = function (tabUrl) {
        return tabUrl == $scope.currentTab;
    }


}]);