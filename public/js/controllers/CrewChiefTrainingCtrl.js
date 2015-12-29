var ctrl_name = 'CrewChiefTrainingCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function ($scope) {
    $scope.pageHeader = 'Crew Chief Training';
    $scope.columns = false;
    $scope.sections = [
        {
            header: 'Crew Chief Training',
            internal_title: 'CC Training',
            body: 'The Crew Chief (&ldquo;CC&rdquo;) is operationally in charge of the duty crew. They are responsible ' +
            'for supervising the crew and providing proper patient care. A Probationary Crew Chief is one who may act as' +
            ' the Crew Chief if a Crew Chief Trainer is on the crew. A &ldquo;full&rdquo; Crew Chief can complete a crew' +
            ' and manages patient care during a call. A Crew Chief Trainer may supervise Probationary Crew Chiefs during' +
            ' calls, and provide training and classes. The following training requirements must be completed:'
        },
        {
            header: 'Probationary Crew Chief',
            internal_title: 'Probie CC',
            body: 'To be a probationary Crew Chief a member must satisfy the following requirements:' + '\n' +
            '* Be an Attendant\n' +
            '* Hold valid certification as Emergency Medical Technician – Basic or above in New York\n' +
            '* Complete the online NIMS IS-100, IS-200, IS-700 and IS-800 courses\n' +
            '* Take and pass the Crew Chief class and written exam with an 80% or higher \n' +
            '* Complete PCR writing class\n' +
            '* Complete the Crew Chief checklist\n' +
            '* Pass a Crew Chief practical, and submit an evaluation\n' +
            '* Complete a minimum of two (2) real calls with a Crew Chief Trainer in the patient compartment and' +
            'receive a passing evaluation for both\n' +
            '* Request and receive approval by the promotional board for promotion'


        },
        {
            header: 'Crew Chief',
            internal_title: 'Full CC',
            body: 'To be a Crew Chief a member must satisfy the following requirements:' + '\n' +
            '* Be a Probationary Crew Chief\n' +
            '* Crew Chief at least two (2) calls, one of which must be a transport, and receive a passing evaluation\n' +
            '* Teach at least three (3) Attendant Checklist items to a trainee under the supervision of a Crew Chief\n' +
            '* Student teach 1 training drill, and submit an evaluation \n' +
            '* Request and receive approval by the promotional board for promotion'

        },

        {
            header: 'Crew Chief Trainer',
            internal_title: 'CC-T',
            body: 'To be a Crew Chief Trainer a member must satisfy the following requirements:' + '\n' +
            '* Complete at least ten (10) shifts as a Crew Chief or have been a CC for at least three (3) months while in service\n' +
            '* Crew Chief three (3) emergency or non- emergency calls\n' +
            '* Teach at least three (3) Crew Chief Checklist items to a trainee under the supervision of a Crew Chief Trainer\n' +
            '* Teach a training scenario or Crew Chief class to the membership under the supervision of a Crew Chief trainer \n' +
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
            header: 'Crew Chief Forms',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigX1lNRXp1LV9zNzQ#list" width="100%" height="300" frameborder="0"></iframe></div>'
        }

    ];
}]);