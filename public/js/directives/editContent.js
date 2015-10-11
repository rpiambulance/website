angular.module('editContent', []).directive('editContent', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/directives/editContent.html',
        controller: function ($scope) {
            $scope.sectionTypes = [
                {type: 'text', title: 'Text'},
                {type: 'img', title: 'Image'}
            ];

            $scope.addSection = function () {
                $scope.sections.push({header: '', body: '', internal_title: ''});
            };

            $scope.removeSection = function (index) {
                var confirmation_message = 'Are you sure you want to delete the section';
                if ($scope.sections[index].internal_title.length > 0) {
                    confirmation_message += ' entitled "' + $scope.sections[index].internal_title + '"?';
                } else {
                    confirmation_message += '?';
                }
                if (confirm(confirmation_message)) {
                    $scope.sections.splice(index, 1);
                }
            }
        }
    };
});