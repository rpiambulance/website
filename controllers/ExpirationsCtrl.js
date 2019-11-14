angular.module('ExpirationsCtrl', []).controller('ExpirationsCtrl', ['$scope', '$http', '$q', 'AuthService', function($scope, $http, $q, AuthService) {
    $q.all([
        $http.get('.expired_certs.php?type=expired&session_id=' + AuthService.getSessionId()),
        $http.get('.expired_certs.php?type=expiring&session_id=' + AuthService.getSessionId())
    ]).then(function (responses) {
        $scope.expired = responses[0].data.cpr.concat(responses[0].data.emt.concat(responses[0].data.dl));
        $scope.expiring = responses[1].data.cpr.concat(responses[1].data.emt.concat(responses[1].data.dl));
    });
}]);
