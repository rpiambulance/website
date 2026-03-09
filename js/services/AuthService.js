angular.module('AuthService', []).service('AuthService', ['$http', '$q', '$cookies', '$location', function ($http, $q, $cookies, $location) {
    var SESSION_ID_COOKIE = 'RPIA-SESSION';

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
                var date = new Date();
                date.setDate(date.getDate() + 5); //create date object 5 days from NOW
                $cookies.put(SESSION_ID_COOKIE, response.data.session_id, {expires: date}); //set cookie expiration to that dateie
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
            // console.log(response.data);
            $cookies.remove(SESSION_ID_COOKIE);
            $location.path('/login');
        }, function (error) {
            // console.log(error);
        });
    };

    this.getUsername = function () {
        var sessionId = $cookies.get(SESSION_ID_COOKIE);

        var deferred = $q.defer();

        if(!sessionId) {
            deferred.reject('No Session');
            // $location.url('/404')
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
            // $location.url('/404')
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
                var date = new Date();
                date.setDate(date.getDate() + 5); //create date object 5 days from NOW
                $cookies.put(SESSION_ID_COOKIE, sessionId, {expires: date}); //reset cookie expiration to that date
                deferred.resolve(true);
            } else {
                swal('Logged Out!', 'You have been automatically logged out. If you\'d like to keep using the members portion of the site, please log in again!', 'info');
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
            // $location.url('/404')
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
    };

    this.getOidcConfig = function () {
        return $http.get('.oidc_config.php');
    };

    this.startOidcLogin = function () {
        window.location.href = '.oidc_start.php';
    };

    this.startLegacyOidcLink = function () {
        window.location.href = '.oidc_start.php?link_legacy=1';
    };

    this.getLegacyOidcStatus = function () {
        var sessionId = $cookies.get(SESSION_ID_COOKIE);
        return $http.get('.oidc_legacy.php?session_id=' + encodeURIComponent(sessionId || ''));
    };

    this.createLegacyOidcAccount = function (payload) {
        var sessionId = $cookies.get(SESSION_ID_COOKIE);
        return $http({
            method: 'POST',
            url: '.oidc_legacy.php',
            data: 'action=create'
                + '&session_id=' + encodeURIComponent(sessionId || '')
                + '&username=' + encodeURIComponent(payload.username || '')
                + '&first_name=' + encodeURIComponent(payload.first_name || '')
                + '&last_name=' + encodeURIComponent(payload.last_name || '')
                + '&email=' + encodeURIComponent(payload.email || ''),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };

    this.getOidcChallenge = function (challengeId) {
        return $http.get('.oidc_account.php?challenge_id=' + encodeURIComponent(challengeId));
    };

    this.linkOidcAccount = function (payload) {
        return $http({
            method: 'POST',
            url: '.oidc_account.php',
            data: 'action=link&challenge_id=' + encodeURIComponent(payload.challenge_id)
                + '&username=' + encodeURIComponent(payload.username)
                + '&password=' + encodeURIComponent(payload.password),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };

    this.createOidcAccount = function (payload) {
        return $http({
            method: 'POST',
            url: '.oidc_account.php',
            data: 'action=create&challenge_id=' + encodeURIComponent(payload.challenge_id)
                + '&data=' + encodeURIComponent(JSON.stringify(payload.data)),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };
}]);
