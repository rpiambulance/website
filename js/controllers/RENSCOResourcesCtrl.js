var ctrl_name = 'RENSCOResourcesCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {
    $scope.pageHeader = 'Rensselaer County Resources';
    $scope.sections = [
        {
            header: '',
            internal_title: 'Links',
            body: '* [Rensselaer County Radio Committee](https://www.rensco.com/428/Radio-Committee)' +
            ' - Homepage of the Rensselaer County Radio Committee, a group which advises the management of the County\'s Emergency Communications System.\n' +

            '* [Rensselaer County Ambulance and Rescue Association](http://www.rc-ara.org/) - Homepage of the New York ' +
            'State Department of Health Bureau of EMS. There is a lot of good information and documentation on the ' +
            'EMS system as whole in New York State.\n' +

            '* [REMO EMS Protocols](https://www.remo-ems.com/emergency-medical-services/protocols/) - Regional EMS protocols. (ALS and BLS)'
        },

        {
            header: 'RENSCO Documents',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=1bjA0G_YGtOk7nXWEXYhgckU-jtHetfKD#list" width="100%" height="400" frameborder="0"></iframe></div>'
        }

    ];
}]);
