angular.module('JoinTheTeamCtrl', []).controller('JoinTheTeamCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Join the team!';
    $scope.columns = true;

    $scope.sections = [
        {
            header: 'How do I join?',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigTHRGVWdlaW05OWM#list" width="100%" height="400" frameborder="0"></iframe>'
        },
        {
            header: 'Are the any requirements to join?',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigRl9naUlZWVR0eEE#list" width="100%" height="400" frameborder="0"></iframe>'
        },

        {
            header: 'I\'m not an RPI student. Can I still join?',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigRl9naUlZWVR0eEE#list" width="100%" height="400" frameborder="0"></iframe>'
        }

    ];
}]);