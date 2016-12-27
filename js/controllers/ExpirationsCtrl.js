angular.module('ExpirationsCtrl', []).controller('ExpirationsCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
    $q.all([
        $http.get('.expired_certs.php?type=expired'),
        $http.get('.expired_certs.php?type=expiring')
    ]).then(function (responses) {
        $scope.expired = responses[0].data.cpr.concat(responses[0].data.emt.concat(responses[0].data.dl));
        $scope.expiring = responses[1].data.cpr.concat(responses[1].data.emt.concat(responses[1].data.dl));
    });
}]);
