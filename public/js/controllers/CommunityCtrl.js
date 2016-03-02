angular.module('CommunityCtrl', []).controller('CommunityCtrl', ['$scope', function ($scope) {
    $scope.pageHeader = 'Community Outreach';
    $scope.sections = [
        {
            header: 'Our Commitment',
            internal_title: 'Text',
            body: 'RPI Ambulance is dedicated to educating and serving the community, and encourages greater knowledge' +
            ' of emergency medicine and other health and safety resources. RPI Ambulance has held training events with ' +
            'RPI\'s ROTC groups, Greek houses, and Residence Life, as well as off campus organizations, such as the Boy ' +
            'Scouts of America. If your organization is interested in hosting RPI Ambulance or collaborating in community' +
            ' outreach, please [contact us](#/contact).'
        },

        {
            header: 'ROTC First Aid Workshop',
            internal_title: 'ROTC Img',
            type: 'img',
            img: 'img/ROTC.jpg',
            width: '75%',
            alt: 'ROTC First Aid Photo',
            centered: true
        },

        {
            header: 'Empire Service Dogs',
            internal_title: 'Dogs Img',
            type: 'img',
            img: 'img/EmpireService.jpg',
            width: '75%',
            alt: 'Photo of empire service dogs with RPI Ambulance',
            centered: true
        },
        {
            header: 'Mohawk-Hudson Marathon',
            internal_title: 'Dogs Img',
            type: 'img',
            img: 'img/marathon.jpg',
            width: '75%',
            alt: 'Photo of RPI Ambulance EMTs at the marathon',
            centered: true
        },

        {
            header: 'National CPR Day',
            internal_title: 'CPR Img',
            type: 'img',
            img: 'img/CPR.jpg',
            width: '75%',
            alt: 'National CPR Day Photo',
            centered: true
        }
    ];
}]);