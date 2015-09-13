angular.module('RadioCallsignsCtrl', []).controller('RadioCallsignsCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Radio Identifiers';
    $scope.leftSections = [
        {
            sectionHeader: 'Intra-agency Use',
            paragraphs: [
                'RPI frequencies and identifier series are as follows:'
            ],
            list: [
                '100-199: RPI DPS vehicles',
                '200-299: RPI DPS officers',
                '300-399: RPI DPS sergeants',
                '400-499: Unused',
                '500-699 RPI Parking and Transportation',
                '700-799: RPI DPS lieutenants',
                '801 and 802: RPI DPS chiefs',
                '900-999: RPI Ambulance'
            ],
            listClass: 'comm-list',
            numParagraphsBeforeList: -1
        },
        {
            sectionHeader: '900 Range: RPI Ambulance',
            paragraphs: [
                'Currently, crew chiefs, drivers, or members in active training are given a 900 number between ' +
                '921 and 989. Once these numbers are assigned, they stay with the member until graduation. The ' +
                'numbers 992 and 993 are reserved for on-duty observers/attendants without their unique 900 number. ' +
                '901 through 909 are used to identify crews during special events. Numbers between 910 and 919 are ' +
                'specialty units, such as ALS, who may be present at an event.',

                'Here\'s a breakdown of 900 numbers:',

                'Note: 911, 939, and 959 are restricted and not used.'
            ],
            list: [
                '900: Used by event command',
                '901&ndash;908: Event identifiers according to SOPs',
                '909&ndash;919: Specialty units at events at the discretion of the captain',
                '921&ndash;989: Member identifiers',
                '992&ndash;993: On-duty attendants',
                '994&ndash;999; Assigned at the discretion of the captain'
            ],
            listClass: 'comm-list',
            numParagraphsBeforeList: 2
        }
    ];

    $scope.rightSections = [
        {
            sectionHeader: 'Inter-agency Use',
            paragraphs: [
                'On any other frequency, RPIA personnel are to identify themselves as:',

                'These designations are used to be in compliance with standards of dispatch and the rest of ' +
                'Rensselaer County.',

                'Every fire and ambulance station in the county has a two-digit station identifier ' +
                '(RPI Ambulance is Station 59), and each unit a 4-digit identifier consisting of the station and unit ' +
                'number, e.g. 5939. (Ambulance 39, or A-39, was the past identifier for the ambulance.)'
            ],
            list: [
                '&ldquo;5939,&rdquo; when representing the ambulance as a crew,',

                '&ldquo;RPI Ambulance car x&rdquo;, if they have a car number, or',

                '&ldquo;RPI driver xx&rdquo; or &ldquo;RPI EMT xx&rdquo; (where &ldquo;xx&rdquo; corresponds to ' +
                'last two numbers of their 900 number)'
            ],
            numParagraphsBeforeList: 1
        },
        {
            sectionHeader: 'History',
            paragraphs: [
                'According to John Crawford, between an indeterminate date and circa 2004, RPIA used 900 ' +
                'numbers. At that time, RPIA relied on Nextel phones and text message dispatches. Due to an ' +
                'unacceptably long response time, RPIA switched to the use of Motorola HT750s which could be used to ' +
                'receive county dispatches.',

                'Rensselaer County interfaces with many agencies and only recognizes vehicle identifiers, e.g. 5939, ' +
                'car numbers, or driver/EMT numbers. Because the county would not recognize the 900 identifier, the ' +
                'use of this system was discontinued and all members were issued car numbers. Car numbers were issued ' +
                'every year, starting at one and counting up sequentially. Line side officers, then civil side ' +
                'officers were issued car numbers, and the rest issued by seniority. In the fall of 2009, then-captain ' +
                'Peter Ragone ordered the re-use of the 9xx identifier within the agency. This was done for three reasons:'
            ],
            list: [
                'There was the potential for confusion when operating with Public Safety or other school entities.',

                'Car numbers are only given to line officers in other agencies, and RPI having upwards of 20 cars ' +
                'appeared unprofessional.',

                'Car numbers were reissued every year and required members to re-learn identifiers. Constant 900 ' +
                'numbers would reduce this confusion.'
            ],
            numParagraphsBeforeList: -1
        }
    ];
}]);