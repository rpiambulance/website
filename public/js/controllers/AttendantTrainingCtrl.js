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
            '<iframe frameborder="0" class="embed-responsive-item" style="width: 100% !important; height: 100% !important;"' +
            'src="https://drive.google.com/embeddedfolderview?id=0B3mvXB0aR4DiejdzdG1TQlI1QWc#list"></iframe></div>'
        }

    ];
}]);