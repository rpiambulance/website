var ctrl_name = 'NewMembersTrainingCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {
    $scope.pageHeader = 'New Member Training';
    $scope.sections = [
        {
            header: '',
            internal_title: 'Text',
            body: 'Members that are new to RPI Ambulance start out as observers. Observers do not take part in patient ' +
            'care, and are only there to observe and learn about the operations and the equipment on the ambulance. ' +
            'he goal of all observers is to be promoted to Attendant. All New Members must go through a mandatory ' +
            'OSHA (Occupational Safety and Health Administration) safety training, a HIPAA (Health Insurance ' +
            'Portability and Accountability Act) patient confidentiality training and and RPI Ambulance Orientation Class.'
        }
    ];
}]);