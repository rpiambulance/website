angular.module('MainCtrl', []).controller('MainCtrl', ['$rootScope', '$scope', '$route', '$location', 'EditablePageService', function ($rootScope, $scope, $route, $location, EditablePageService) {
    // TODO: IMPLEMENT AUTHENTICATION, REMOVE DEFAULT VALUE OF TRUE
    $scope.loggedIn = false;
    $scope.username = '';

    $rootScope.$on("$routeChangeSuccess", function (currentRoute, previousRoute) {
        //Change page title, based on Route information
        $rootScope.title = $route.current.title;
    });

    // === NECESSARY CODE FOR EDITING THE PAGE ================================
    $scope.editMode = false;
    $scope.toggleEdit = function () {
        $scope.editMode = EditablePageService.verifyPermissions($scope.editMode, $scope.loggedIn, $scope.username)
    };
    $scope.ensureEditDisabled = function () {
        $scope.editMode = false;
    };
    $scope.cancelEdits = function () {
        // TODO: Implement EditablePageService here, getting the previous set of data and replacing the deleted data
        $scope.editMode = false;
    };
    $scope.saveEdits = function () {
        $scope.editMode = EditablePageService.saveChanges($scope.pageHeader, $scope.sections);
    };
    // ========================================================================


    /**
     * Contains the data to dynamically populate the navigation bar
     * @type {*[]}
     */
    $scope.navbar = [
        {page: 'home', title: 'Home', isDropdown: false},
        {
            page: '', title: 'About Us', isDropdown: true, dividersAfter: [2, 4], dropdownOptions: [
            {page: 'rpia-about', title: 'About RPI Ambulance'},
            {page: 'faq', title: 'FAQs'},
            {page: 'officers', title: 'Officers'},
            {page: '5939-about', title: 'Ambulance'},
            {page: 'fr59-about', title: 'First Response'},
            {page: 'media', title: 'Media'}
        ]
        },
        {page: 'join', title: 'Join Us', isDropdown: false},
        {
            page: '', title: 'Training', isDropdown: true, dividersAfter: [], dropdownOptions: [
            {page: 'new-members-training', title: 'New Members'},
            {page: 'cpr-certification', title: 'CPR Certification'},
            {page: 'attendant-training', title: 'Attendant'},
            {page: 'driver-training', title: 'Driver'},
            {page: 'crew-chief-training', title: 'Crew Chief'},
            {page: 'supervisor-training', title: 'Supervisor'},
            {page: 'in-service-training', title: 'In-Service Training'}
        ]
        },
        {page: 'coverage', title: 'Request Coverage', isDropdown: false},
        {page: 'login', title: 'Members', isDropdown: false, customLink: true, link: 'index.php?page=members'},
        {page: 'contact', title: 'Contact Us', isDropdown: false}

    ];

    /**
     * Determines whether a nav item should highlight as active
     * @param nav
     * @returns {boolean}
     */
    $scope.isActive = function (nav) {
        if (nav.isDropdown) {
            var isActive = false;
            nav.dropdownOptions.forEach(function (elem) {
                if ($route.current !== undefined && $route.current.activeTab == elem.page) {
                    isActive = true;
                }
            });
            return isActive;
        } else {
            return $route.current !== undefined && $route.current.activeTab == nav.page;
        }
    };

    /**
     * Determines when to add a divider within a dropdown list, based on the defined array
     * inside the nav object.
     * @param nav
     * @param index
     * @returns {boolean}
     */
    $scope.showDivider = function (nav, index) {
        if (nav.isDropdown && nav.dividersAfter.indexOf(+index) > -1) {
            return true;
        }
    };
}]);
