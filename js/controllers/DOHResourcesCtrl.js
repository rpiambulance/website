var ctrl_name = 'DOHResourcesCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {
    $scope.pageHeader = 'New York State Department of Health Resources';
    $scope.sections = [
        {
            header: '',
            internal_title: 'Links',
            body: '* [Meeting Minutes of the State EMS Council (SEMSCO)](https://saratogaems.org/news-announcements/nys-ems-news/)' +
            ' - Meeting minutes of the State EMS Council as prepared (humorously) by Mike McEvoy (EMS Coordinator for ' +
            'Saratoga County). Good to read these to know what is going on with EMS in the state. Our protocols and ' +
            'policies originate from the council.\n' +

            '* [Bureau of EMS Homepage](http://www.health.ny.gov/nysdoh/ems/main.htm) - Homepage of the New York ' +
            'State Department of Health Bureau of EMS. There is a lot of good information and documentation on the ' +
            'EMS system as whole in New York State.\n' +

            '* [New York State BLS Protocols](http://www.health.ny.gov/nysdoh/ems/protocolsnew.htm) - Statewide Basic ' +
            'Life Support Protocols for all BLS and ALS providers.\n' +

            '* [Bureau of EMS Policy Statements and SEMAC Advisories](http://www.health.ny.gov/nysdoh/ems/policy/policy.htm)' +
            ' - The Bureau of EMS issues policy statements and advisories to address issues that arise within the EMS ' +
            'system and to clarify policies and assist EMS agencies with their smooth operation.\n' +

            '* [Public Health Law Article 30](http://www.health.ny.gov/nysdoh/ems/art30.htm) and ' +
            '[New York State Sanitary Code PART - 18](http://www.health.ny.gov/nysdoh/ems/part18.htm) - New York State ' +
            'laws regarding medical coverage for public events and large gatherings.\n' +

            '* [State Emergency Medical Services Code- Part 800](https://regs.health.ny.gov/volume-e-title-10/200443669/part-800-emergency-medical-services) - New ' +
            'York State laws regarding the qualifications of EMS providers and instructors as well as the requirements ' +
            'for ambulances and other support vehicles.\n' +

            '* [Regional Emergency Medical Organization (REMO)](http://www.remo-ems.com/) - REMO consists of the ' +
            'Regional Emergency Medical Services Council of the Hudson Mohawk Valleys (REMSCO), the Regional Medical ' +
            'Advisory Committee (REMAC) and the Regional EMS Program Agency, operating in a six county region in the ' +
            'State of New York.\n'
        }
    ];
}]);