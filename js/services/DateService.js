angular.module('DateService', []).service('DateService', function () {
    this.formatViewDate = function(viewDate) {
        return viewDate.getFullYear() + "-" + (viewDate.getMonth() + 1) + "-" + viewDate.getDate();
    };
});