angular.module('MainCtrl', []).controller('MainCtrl', ['$rootScope', '$scope', '$route', '$location', '$cookies', 'EditablePageService', 'AuthService', function ($rootScope, $scope, $route, $location, $cookies, EditablePageService, AuthService) {
    // TODO: IMPLEMENT AUTHENTICATION, REMOVE DEFAULT VALUE OF TRUE
    $scope.loggedIn = false;
    $scope.username = '';

    AuthService.getUserMetadata().then(function (data) {
        if(data != '0') {
            $scope.user = data.first_name;
        }
    }, function (error) { console.log(error); });

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

    $scope.createFormData = function (json) {
        var formData = new FormData();

        for ( var key in json ) {
            formData.append(key, json[key]);
        }

        return formData;
    };


    /**
     * Contains the data to dynamically populate the navigation bar
     * @type {*[]}
     */
    $scope.publicNavbar = [
        {page: 'home', title: 'Home', isDropdown: false},
        {
            page: '', title: 'About Us', isDropdown: true, dividersAfter: [2, 4], dropdownOptions: [
            {page: 'rpia-about', title: 'About RPI Ambulance'},
            {page: 'faq', title: 'FAQs'},
            {page: 'officers', title: 'Officers'},
            {page: '5939-about', title: 'Ambulance'},
            {page: 'fr59-about', title: 'First Response'},
            {page: 'media', title: 'Media'},
            {page: 'nominations', title: 'Nominations'}
        ]
        },
        {page: 'join', title: 'Join Us', isDropdown: false},
        {
            page: '', title: 'Outreach', isDropdown: true, dividersAfter: [], dropdownOptions: [
            {page: 'new-members-training', title: 'New Members'},
            {page: 'cpr-certification', title: 'CPR Certification'},
            {page: 'community', title: 'Community Outreach'}
        ]
        },
        {page: 'coverage', title: 'Request Coverage', isDropdown: false},
        {
            page: 'login',
            title: 'Members',
            isDropdown: false,
            customLink: false ,link: 'index.php?page=members'
        },
        {page: 'contact', title: 'Contact Us', isDropdown: false}

    ];

    $scope.memberNavbar = [
        {page: 'home', title: 'Home', isDropdown: false},
        {
            page: '', title: 'Scheduling', isDropdown: true, dividersAfter: [2, 4], dropdownOptions: [
            {page: 'night-crews', title: 'Night Crews'},
            {page: 'games-events', title: 'Games & Events'}
        ]
        },
        {
            page: '', title: 'Tools', isDropdown: true, dividersAfter: [], dropdownOptions: [
            {page: 'member-list', title: 'Member List'},
            {page: 'fuel-log', title: 'Fuel Log'},
            {page: 'stocking-issue', title: 'Stocking'},
            {page: 'expirations', title: 'Expiring Items'},
            {page: 'announcements', title: 'Announcements'}
        ]
        },

        {
            page: '', title: 'Training', isDropdown: true, dividersAfter: [], dropdownOptions: [
            {page: 'attendant-training', title: 'Attendant'},
            {page: 'driver-training', title: 'Driver'},
            {page: 'crew-chief-training', title: 'Crew Chief'},
            {page: 'supervisor-training', title: 'Supervisor'},
            {page: 'in-service-training', title: 'In-Services'}
        ]
        },
        {
            page: '', title: 'Resources', isDropdown: true, dividersAfter: [], dropdownOptions: [
            {page: 'communications', title: 'Communications'},
            {page: 'emt-reciprocity', title: 'Reciprocity'},
            {page: 'minutes', title: 'Meeting Minutes'},
            {page: 'misc-forms', title: 'Misc Forms'},
            {page: 'mutual-aid', title: 'Mutual Aid'},
            {page: 'radio-callsigns', title: 'Radio Callsigns'},
            {page: 'rensco-resources', title: 'RENSCO Resources'},
            {page: 'sop', title: 'SOPs'},
            {page: 'doh-resources', title: 'DOH Resources'},
            {page: 'text-message-dispatch', title: 'Text Message Dispatch'}
        ]
        },

        //{
        //    page: '', title: 'Manage Content', isDropdown: true, dividersAfter: [], dropdownOptions: [
        //        {page: 'add', title: 'New Members'},
        //        {page: 'new-members-training', title: 'New Members'},
        //        {page: 'new-members-training', title: 'New Members'}
        //    ]
        //},
        {
            page: '', title: 'Admin', isDropdown: true, dividersAfter: [], dropdownOptions: [
            {page: 'modify-schedule', title: 'Modify Schedule'},
            {page: 'edit-default', title: 'Edit Default Schedule'},
            {page: 'add-event', title: 'Add Game or Event'},
            {page: 'add-member', title: 'Add Member'},
            {page: 'edit-member', title: 'Edit Member'}
        ]
        },

        {
            page: '', title: 'Account', isDropdown: true, dividersAfter: [], dropdownOptions: [
            {page: 'my-settings', title: 'My Settings'},
            {page: 'my-training', title: 'My Training'},
            {page: 'logout', title: 'Log Out'}
        ]
        }
    ];

    var chooseAppropriateMenu = function () {
        var currentPage = $location.url();
        var isMemberPage = false;

        if(currentPage.split('/')[1] == 'edit-member') {
            return true;
        } else if (currentPage.split('/')[1] === "event" || currentPage.split('/')[1] === "game") {
            return true;
        }

        for (var i = 0; i < $scope.memberNavbar.length; i++) {
            if ($scope.memberNavbar[i].isDropdown) {
                for (var j = 0; j < $scope.memberNavbar[i].dropdownOptions.length; j++) {
                    if ("/" + $scope.memberNavbar[i].dropdownOptions[j].page === currentPage && currentPage !== "/home") {
                        return true;
                    }
                }
            } else if ("/" + $scope.memberNavbar[i].page === currentPage && currentPage !== "/home") {
                return true;
            }
        }

        return false;
    };

    $scope.navbar = chooseAppropriateMenu() ? $scope.memberNavbar : $scope.publicNavbar;
    $scope.$on('$locationChangeStart', function () {
        $scope.navbar = chooseAppropriateMenu() ? $scope.memberNavbar : $scope.publicNavbar;
    });

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

    $scope.getSessionIDCookie = function () {
        return $cookies.get('__RPIA_SESSION_ID');
    }
}]);
