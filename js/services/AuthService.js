angular.module('AuthService', []).service('AuthService', ['$http', '$q', '$cookies', '$location', function ($http, $q, $cookies, $location) {
    var SESSION_ID_COOKIE = '__RPIA_SESSION_ID';

    this.login = function (formData) {
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: '.login.php',
            data: "json=" + JSON.stringify(formData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            if (!response.data || !response.data.success) {
                deferred.reject(response);
            } else {
                $cookies.put(SESSION_ID_COOKIE, response.data.session_id);
                deferred.resolve(response);
            }
        });

        return deferred.promise;
    };

    this.logout = function () {
        var sessionId = $cookies.get(SESSION_ID_COOKIE);
        if(!sessionId) {
            return;
        }

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

        if(!sessionId) {
            deferred.reject('No Session');
            return deferred.promise;
        }

        $http.get('.get_session_info.php?session_id=' + sessionId + '&key=username').then(function (response) {
            deferred.resolve(response.data.username);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.getUserMetadata = function () {
        var sessionId = $cookies.get(SESSION_ID_COOKIE);

        var deferred = $q.defer();

        if(!sessionId) {
            deferred.reject('No Session');
            return deferred.promise;
        }

        $http.get('.get_user_metadata.php?session_id=' + sessionId).then(function (response) {
            deferred.resolve(response.data);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.isLoggedIn = function () {
        var sessionId = $cookies.get(SESSION_ID_COOKIE);

        var deferred = $q.defer();

        if(!sessionId) {
            deferred.resolve(false);
            return deferred.promise;
        }

        $http.get('.get_session_info.php?session_id=' + sessionId + '&key=username').then(function (response) {
            if(response.data.username) {
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

        if(!sessionId) {
            deferred.reject('No Session');
            return deferred.promise;
        }

        $http.get('.get_if_admin.php?session_id=' + sessionId).then(function (response) {
            deferred.resolve(response.data);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.getSessionId = function () {
        return $cookies.get(SESSION_ID_COOKIE);
    }
}]);
