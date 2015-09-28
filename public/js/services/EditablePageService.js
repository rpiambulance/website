angular.module('EditablePageService', []).service('EditablePageService', ['$http', function($http) {
    this.verifyPermissions = function(previousEditMode, isLoggedIn, userId) {
        // TODO: ENSURE USER HAS PERMISSION TO EDIT BEFORE ENABLING EDIT
        if(isLoggedIn && !previousEditMode) {
            // Enable only if it's currently disabled and the user has the permissions
            return true;
        }

        // In no other case should edit mode be returning true (enabling edit)
        return false;
    };

    this.saveChanges = function(header, sections) {
        // TODO: CONTACT SERVER AND POST THE CHANGES USING $HTTP

        // Return false to disable edit mode
        return false;
    };

    this.processMarkdown = function() {

    };
}]);