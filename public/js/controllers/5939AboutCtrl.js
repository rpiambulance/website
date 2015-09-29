angular.module('5939AboutCtrl', []).controller('5939AboutCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'About 5939';
    $scope.sections = [
        {
            header: '',
            internal_title: 'About Text',
            body: 'RPI Ambulance operates a 2006 AEV Trauma Hawk XL Type II ambulance mounted on a Ford E-350 ' +
            'chassis. This vehicle was placed in service in the Spring of 2007. The county vehicle identifier is ' +
            '5939, however the ambulance was formerly known as A-39 and continues to hold this call sign within the ' +
            'agency. 5939 is the fifth van ambulance operated by RPI Ambulance. The first was placed in service in 1983.'
        },
        {
            header: 'A-39 and 5939 in Spring 2007',
            internal_title: 'Image: A-39 and 5939 in Spring 2007',
            body: '![A-39 and 5939 in Spring 2007](img/5939-2011.jpg =75%x*)',
            centered: true
        },
        {
            header: '5939 in May 2011',
            internal_title: 'Image: 5939 in May 2011',
            body: '![5939 in May 2011](img/A39-5939.jpg =75%x*)',
            centered: true
        },
        {
            header: 'Past Ambulances',
            body: 'In Spring 2007, 5939 was delivered to replace the aging A-39. A-39 had proudly served the agency ' +
            'for 10 years before being retired. The agency has also operated several other ambulances, the first of ' +
            'which is rumored to have been given to RPI Ambulance when members saved a member of the faculty from ' +
            'choking in one of the dining halls.'
        }
    ];
}]);