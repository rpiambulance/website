var ctrl_name = 'AttendantTrainingCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function ($scope) {
    $scope.pageHeader = 'Attendant Training';
    $scope.columns = false;
    $scope.sections = [
        {
            header: 'Attendant Training',
            internal_title: 'Attendant Training',
            body: 'The position of Attendant is the first goal of all new RPIA members. As an Attendant, members may' +
            'assist with patient care on calls. A short class is part of the requirement of Attendant training. The' +
            'goal of attendant training is to enable new members to assist the crew chief during calls. As such, you' +
            'will learn how to take vitals, use treatment equipment, and how to safely move a patient.'
        },

        {
            header: 'Attendant Forms',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigeUxtNG9ZdEZhM0E#list" width="800" height="600" frameborder="0"></iframe></div>'

        }

    ];
}]);