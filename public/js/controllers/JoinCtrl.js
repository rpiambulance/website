angular.module('JoinTheTeamCtrl', []).controller('JoinTheTeamCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Join the team!';
    $scope.columns = true;

    $scope.sections = [
        {
            header: 'How do I join?',
            body: 'If you are an active RPI student...'
        },
        {
            header: 'Are the any requirements to join?',
            body: 'None at all!'
        },

        {
            header: 'I\'m not an RPI student. Can I still join?',
            body: 'Bla bla bla something something content'
        }

    ];
}]);