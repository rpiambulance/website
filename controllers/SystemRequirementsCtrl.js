angular.module('SystemRequirementsCtrl', []).controller('SystemRequirementsCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'System Requirements';
    $scope.sections = [
        {
            header: 'Browsers',
            internal_title: 'Browsers',
            body: 'This page is designed to work with all major current browsers. This includes Google Chrome, Apple ' +
            'Safari, and Mozilla Firefox. We recommend you use one of these three browsers for the page to work as ' +
            'intended. Some of the features of the page will not function properly if you are using Internet Explorer.'
        },

        {
            header: 'Mobile Support',
            internal_title: 'Mobile Support',
            body: 'All types of mobile devices should be able to access and use this site using a modern and up-to-date ' +
            'internet browser. If you experience any difficulty accessing a page, please contact the webmaster as soon as ' +
            'possible and we will try our best to get the problem resolved. In addition, this page has be equipped with ' +
            'different sizes and types of favicons allowing you to add it to your home screen with the correct icon.'
        }

    ];
}]);