angular.module('CopyCtrl', []).controller('CopyCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Copyright Information';
    $scope.sections = [
        {
            header: 'Images',
            internal_title: 'Images',
            body: 'All images on this site are either the property of RPI Ambulance or used with the explicit permission' +
            'of their owner. If you would like to use one of our photos or have comments regarding them. please reach ' +
            'out to use using the contact us page and we will get back to you as soon as we can. No real patients are ' +
            'pictured in any of the images on our site.'
        },

        {
            header: 'Media Release',
            internal_title: 'Media Release',
            body: '[something about media release policy here]'
        },

        {
            header: 'Site',
            internal_title: 'Site copy',
            body: 'This website was a project completed the RPI Web Technologies Group working alongside with members of' +
            'RPI Ambulance to make sure all needs wer met. This site was released under an open source license. Links to' +
            'the GitHub Repository can be found in the lower menu at the bottom of this page. If  you have any ' +
            'questions please feel free to reach out to the development team or our webmaster.'
        }

        ];
}]);