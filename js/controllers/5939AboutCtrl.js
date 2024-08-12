angular.module('5939AboutCtrl', []).controller('5939AboutCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'About 5939';
    $scope.sections = [
        {
            header: '',
            internal_title: 'About Text',
            body: 'RPI Ambulance operates a 2024 AEV Trauma Hawk Type III ambulance mounted on a Ford E-350 ' +
            'chassis. This vehicle was placed in service in August of 2024. The county vehicle identifier is ' +
            '5939. 5939 is the second box ambulance operated by RPI Ambulance, with the last being from the mid 1980s.'
        },
        {
            header: '5939 in August 2024',
            internal_title: '5939 in August 2024',
            type: 'img',
            img: 'img/5939-2024.jpg',
            width: '75%',
            alt: '5939 in front of the Mueller Center',
            centered: true
        },
        {
            header: 'Past Ambulances',
            body: 'In the summer of 2024, a new 5939 was delivered to replace the aging 5939, which had served the agency for ' +
            '17 years since its delivery in 2007. It replaced ambulance A-39, its predecessor which was also a type II van ' +
            'style ambulance. A-39 had proudly served the agency ' +
            'for 10 years before being retired. The agency has also operated several other ambulances, the first of ' +
            'which is rumored to have been given to RPI Ambulance when members saved a member of the faculty from ' +
            'choking in one of the dining halls.'
        }
    ];
}]);