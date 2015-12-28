angular.module('OfficersCtrl', []).controller('OfficersCtrl', ['$scope', '$sce', function ($scope, $sce) {
    $scope.pageHeader = 'Officer Board';
    $scope.sections = [
        {
            header: '',
            internal_title: 'Officers Description',
            body: 'The officers of RPI Ambulance are elected at the first general body meeting of November. The ' +
            'officers perform day to day and long term operational and administrative tasks. In 2009 the RPI Ambulance ' +
            'Constitution was changed to reduce the officer board from 8 officers to 5 consolidating "non-steering" ' +
            'positions into more important roles. This will allow for a smaller, more efficient officer board and the ' +
            'opportunity for more members to become involved with non-elected coordinator positions.'
        },

        {
            header: 'Officer Board 2015-2016',
            internal_title: 'O-Board Photo',
            type: 'img',
            img: 'img/O-Board',
            width: '75%',
            alt: 'Photo of the office board',
            centered: true
        },

        {
            header: 'Officer Board Spring 2015',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '*Captain: Tom Manzini ' +
            '*First Lieutenant: Jordan Williams\n' +
            '*Second Lieutenant: Brittany Rupp' +
            'Civil Side:\n' +
            '*Vice President: Rebecca Martin' +
            '*President: Alexander Benzell'
        },

        {
            header: 'Officer Board Fall 2014',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '*Captain: Breanna Bernardi ' +
            '*First Lieutenant: Drew Kopicki\n' +
            '*Second Lieutenant: Jordan Williams' +
            'Civil Side:\n' +
            '*Vice President: Elise Romberger' +
            '*President: Alli Morgan'
        }


    ];
}]);