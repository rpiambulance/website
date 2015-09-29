angular.module('FR59AboutCtrl', []).controller('FR59AboutCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'About FR-59';
    $scope.sections = [
        {
            header: '',
            internal_title: 'About Text',
            body: 'First Response 59 is RPI Ambulance\'s first response vehicle. It is a 2007 Ford Explorer that was ' +
            'first placed in service with the agency in October of 2014. FR-59 is equipped to NYS Part 800.26 with a ' +
            'full complement of disposable medical supplies, splints, epinephrine, a glucometer and a foldable ' +
            'backboard. During night crews, it serves to transport the crew from our office to our garage where the ' +
            'ambulance is parked.'
        },
        {
            header: '',
            internal_title: 'FR-59 at EMPAC Image',
            body: '![FR-59 and EMPAC in February of 2015](img/fr-59.jpg =75%x*)' +'\n\n' +
            'FR-59 and EMPAC in February of 2015'
        },
        {
            header: 'History of FR-59',
            internal_title: 'History of FR-59',
            body: 'In 2011 discussion of acquiring a First Response type vehicle was brought up by the membership and ' +
            'supported by the RPI Administration. Initially the vehicle was to be a new SUV with hybrid engine ' +
            'technology to support RPI\'s Green Initiatives. However due to budget constraints and the fact that ' +
            'adding a new vehicle to the RPI Ambulance family would be a major change to the agency\'s operations, it ' +
            'was decided that a Subaru Forester would be converted to a full Emergency Ambulance Service Vehicle. ' +
            'The Forester was first placed in service in May of 2012.'
        },
        {
            header: '',
            internal_title: 'Old FR-59 Image',
            body: '![The old FR-59 at the RPI Houston Field House](img/fr-59-old.jpg =75%x*)' +'\n\n' +
            'The old FR-59 at the RPI Houston Field House'
        },
        {
            header: '',
            internal_title: 'Replacement',
            body: 'It unfortunately did not take long for the Forester to be plagued by various mechanical problems. ' +
            'So, in Spring of 2014, the agency began the search for a new first response vehicle. After testing several ' +
            'different options, it was decided that the 2007 Ford Explorer would be the newest addition to the RPIA fleet.'
        }
    ];
}]);