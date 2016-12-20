angular.module('MyTrainingCtrl', []).controller('MyTrainingCtrl', ['$scope', '$http', function ($scope, $http) {

    sweetAlert("Hi There!", "This feature is just an example. Your actual training records are currently not stored here. We'll let you know once this feature exists.", "warning");


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

    $scope.testalert = function(){
    }

}]);
