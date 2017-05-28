angular.module('MediaCtrl', []).controller('MediaCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Media';
    $scope.sections = [
        {
            header: 'FR-59 on the ice at the Houston Field House in October 2015',
            internal_title: 'FR-59 at EMPAC Image',
            type: 'img',
            img: 'img/fr-59-ice.jpg',
            width: '75%',
            alt: 'FR-59 and EMPAC in February of 2015',
            centered: true
        },

        {
            header: '5939 and A-39 in Spring of 2007',
            internal_title: 'Image: 5939 and A-39 in Spring of 2007',
            type: 'img',
            img: 'img/A39-5939.jpg',
            width: '75%',
            alt: '5939 and A-39 in Spring 2007',
            centered: true
        }

    ];
}]);