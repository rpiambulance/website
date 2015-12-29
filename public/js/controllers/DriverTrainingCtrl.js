var ctrl_name = 'DriverTrainingCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function ($scope) {
    $scope.pageHeader = 'Driver Training';
    $scope.columns = false;
    $scope.sections = [
        {
            header: 'Driver Training',
            internal_title: 'Driver Training',
            body: 'The Driver is in charge of the safe operation of the Ambulance and the safe transportation of the ' +
            'crew and patient on calls. Attendants may train to become a Driver under the supervision of a qualified ' +
            'Driver Trainer. The following are the minimum promotional requirements for a Driver:'
        },

        {
            header: 'Probationary Driver',
            internal_title: 'Probie Driver',
            body: 'To be a probationary Driver a member must satisfy the following requirements:' + '\n' +
            '* Be an Attendant\n' +
            '* Hold a Valid NYS Class D Drivers License or equivalent for a minimum of six (6) months\n' +
            '* Attend and pass the written exam for the RPI Ambulance Driver Training Class\n' +
            '* Hold a CEVO, EVOC or RPI Ambulance EVDD Certification \n' +
            '* Complete the Driver Checklist\n' +
            '* Complete the online NIMS IS-100, IS-200, IS-700 and IS-800 courses\n' +
            '* Complete and submit copy of an Ambulance Vehicle Checklist\n' +
            '* Complete at least five (5) hours of behind the wheel training under the supervision of a Driver Trainer\n' +
            '* Drive a minimum of two (2) Priority-II calls and receive passing evaluations from a trainer. A driver' +
            'trainer must accompany the trainee in the driver compartment during these calls\n' +
            '* Drive a minimum of one (1) Priority-I call and receive passing evaluations from a trainer. A driver\n' +
            'trainer must accompany the trainee in the driver compartment during this call' +
            '* Drive to each Albany area hospital with a driver trainer to become familiar with routes to these less' +
            'common destinations\n' +
            '* Pass the Driver Practical Exam administered by a Driver Trainer\n' +
            '* Request and receive approval by the promotional board for promotion'


        },
        {
            header: 'Driver',
            internal_title: 'Full Driver',
            body: 'To be a Driver a member must satisfy the following requirements:' + '\n' +
            '* Be a Probationary Driver\n' +
            '* Drive two (2) calls as a probationary Driver and receive passing evaluations from a Trainer\n' +
            '* Request and receive approval by the promotional board for promotion'

        },

        {
            header: 'Driver Trainer',
            internal_title: 'D-T',
            body: 'To be a Driver Trainer a member must satisfy the following requirements:' + '\n' +
            '* Complete at least ten (10) shifts as a Driver or have been a Driver for at least three (3) months while in service\n' +
            '* Drive three (3) EMS calls, at least one (1) of which is Priority-I. Priority requirement may be waived at the discretion of the Training Committee\n' +
            '* Teach a driver related course or drill under the supervision of a Driver Trainer\n' +
            '* Teach at least three (3) Driver Checklist items to a trainee under the supervision of a Driver Trainer \n' +
            '* Conduct at least one (1) vehicle training session with a trainee under the supervision of a Driver Trainer\n' +
            '* Request and receive approval by the promotional board for promotion'

        },

        {
            header: 'National Incident Management Courses',
            internal_title: 'NIMS Links',
            body: '* [NIMS-IS-100b](http://training.fema.gov/is/courseoverview.aspx?code=IS-100.b)\n' +
            '* [NIMS-IS-200b](http://training.fema.gov/is/courseoverview.aspx?code=IS-200.b)\n' +
            '* [NIMS-IS-700a](https://training.fema.gov/is/courseoverview.aspx?code=IS-700.a)\n' +
            '* [NIMS-IS-800b](http://training.fema.gov/is/courseoverview.aspx?code=IS-800.b)\n'

        },

        {
            header: 'Driver Forms',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigLUtvOWhsSDI1YkE#list" width="100%" height="300" frameborder="0"></iframe></div>'
        }

    ];
}]);