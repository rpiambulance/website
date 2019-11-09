var ctrl_name = 'RENSCOResourcesCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {
    $scope.pageHeader = 'Rensselaer County Resources';
    $scope.sections = [
        {
            header: '',
            internal_title: 'Links',
            body: '* [Rensselaer County Communications Committee](http://sites.google.com/site/rensselaercountycommunications/)' +
            ' - Meeting minutes of the State EMS Council as prepared (humorously) by Mike McEvoy (EMS Coordinator for ' +
            'Saratoga County). Good to read these to know what is going on with EMS in the state. Our protocols and ' +
            'policies originate from the council.\n' +

            '* [Rensselaer County Ambulance and Rescue Association](http://www.rc-ara.org/) - Homepage of the New York ' +
            'State Department of Health Bureau of EMS. There is a lot of good information and documentation on the ' +
            'EMS system as whole in New York State.\n' +

            '* [REMO EMS Protocols](http://www.remo-ems.com/remo/protocols.php) - Regional EMS protocols. (ALS and BLS)'
        },

        {
            header: 'RENSCO Documents',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigTTVhTGhqWHdnV1E#list" width="100%" height="400" frameborder="0"></iframe></div>'
        }

    ];
}]);