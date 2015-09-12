angular.module('MainCtrl', []).controller('MainCtrl', ['$scope', '$route', function($scope, $route) {
    $scope.navbar = [
        {page: 'home', title: 'Home', isDropdown: false},
        {page: '', title: 'About Us', isDropdown: true, dividersAfter: [2,4], dropdownOptions: [
            {page: 'rpia-about', title: 'About RPI Ambulance'},
            {page: 'faq', title: 'FAQs'},
            {page: 'officers', title: 'Officers'},
            {page: '5939-about', title: 'Ambulance'},
            {page: 'fr59-about', title: 'First Response'},
            {page: 'media', title: 'Media'}
        ]},
        {page: '', title: 'Resources', isDropdown: true, dividersAfter: [], dropdownOptions: [
            {page: 'communications', title: 'Communications'},
            {page: 'minutes', title: 'Meeting Minutes'},
            {page: 'mutual-aid', title: 'Mutual Aid'},
            {page: 'radio-callsigns', title: 'Radio Callsigns'},
            {page: 'emt-reciprocity', title: 'EMT Reciprocity'},
            {page: 'constitution', title: 'Constitution'},
            {page: 'sop', title: 'SOPs'},
            {page: 'text-message-dispatch', title: 'Text Message Dispatch'},
            {page: 'rensco-resources', title: 'RENSCO Resources'},
            {page: 'doh-resources', title: 'DOH Resources'},
            {page: 'misc-forms', title: 'Miscellaneous Forms'}
        ]},
        {page: '', title: 'Training', isDropdown: true, dividersAfter: [], dropdownOptions: [
            {page: 'new-members-training', title: 'New Members'},
            {page: 'cpr-certification', title: 'CPR Certification'},
            {page: 'attendant-training', title: 'Attendant'},
            {page: 'driver-training', title: 'Driver'},
            {page: 'crew-chief-training', title: 'Crew Chief'},
            {page: 'supervisor-training', title: 'Supervisor'},
            {page: 'in-service-training', title: 'In-Service Training'}
        ]},
        {page: 'coverage', title: 'Request Coverage', isDropdown: false},
        {page: 'login', title: 'Members', isDropdown: false},
        {page: 'contact', title: 'Contact Us', isDropdown: false}
    ];

    $scope.isActive = function(nav) {
        if(nav.isDropdown) {
            var isActive = false;
            nav.dropdownOptions.forEach(function(elem) {
                if($route.current.activeTab == elem.page) {
                    isActive = true;
                }
            });
            return isActive;
        } else {
            return $route.current.activeTab == nav.page;
        }

    }
}]);