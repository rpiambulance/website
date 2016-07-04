angular.module('AuthService', []).service('AuthService', ['$http', '$q', '$cookies', '$location', function ($http, $q, $cookies, $location) {
    var SESSION_ID_COOKIE = '__RPIA_SESSION_ID';

    this.login = function (formData) {
        $http({
            method: 'POST',
            url: '.login.php',
            data: formData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            if (!data.success) {
                console.log("it failed!");
                console.log(data);
            } else {
                $cookies.put(SESSION_ID_COOKIE, data.session_id);
                $location.path('/night-crews');
            }
        });
    };

    this.logout = function () {
        var sessionId = $cookies.get(SESSION_ID_COOKIE);

        $http.get('.logout.php?session_id=' + sessionId).then(function (response) {
            console.log(response.data);
            $cookies.remove(SESSION_ID_COOKIE);
            $location.path('/login');
        }, function (error) {
            console.log(error);
        });
    };

    this.getUsername = function () {
        var sessionId = $cookies.get(SESSION_ID_COOKIE);

        var deferred = $q.defer();

        $http.get('.get_session_info.php?session_id=' + sessionId + '&key=username').then(function (response) {
            deferred.resolve(response.data.username);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    this.isLoggedIn = function () {
        var sessionId = $cookies.get(SESSION_ID_COOKIE);

        var deferred = $q.defer();

        $http.get('.get_session_info.php?session_id=' + sessionId + '&key=username').then(function (response) {
            if(response.data.username !== undefined) {
                deferred.resolve(true);
            } else {
                deferred.resolve(false);
            }
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.isAdmin = function () {
        var sessionId = $cookies.get(SESSION_ID_COOKIE);

        var deferred = $q.defer();

        $http.get('.get_if_admin.php?session_id=' + sessionId).then(function (response) {
            deferred.resolve(response.data);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };
}]);
