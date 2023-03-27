var ctrl_name = 'SupervisorTrainingCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function ($scope) {
    $scope.pageHeader = 'Supervisor Training';
    $scope.columns = false;
    $scope.sections = [
        {
            header: 'Event EMS Supervisor (EES)',
            internal_title: 'EES',
            body: 'Event EMS Supervisors (EES) are full crew chiefs who have been specially trained to supervise RPI ' +
            'Ambulance operations at special events and functions. The EES-in charge (Radio Callsign: Unit 900) acts as' +
            ' a in-house dispatcher and medical supervisor.'
        },

        {
            header: 'EES Forms',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe frameborder="0" class="embed-responsive-item" style="width: 100% !important; height: 100% !important;"' +
            'src="https://drive.google.com/embeddedfolderview?id=129pMoSn3zeKSVQVyxQKE3KePRgzkjnWn#list"></iframe></div>'
        },

        {
            header: 'Duty Supervisor',
            internal_title: 'Duty Supervisor',
            body: 'The Duty Supervisor is on call 24 hours a day to handle any emergencies, incidents, or other issues ' +
            'that must be handled promptly, or to assist crews or members as needed. Duty Supervisors are the most ' +
            'highly credentialed members in the agency. The on-duty supervisor carries a dedicated cell phone (providing' +
            ' members, DPS, other entities a way to always reach a knowledgeable person via phone – the cell phone is ' +
            'always able to be answered, and the number will not change with changes in supervisors, unlike changes in ' +
            'officers will). The supervisor also carries an RPIA portable and a portable 800, in order to be able to ' +
            'monitor and contact the duty crew or the county via radio, if necessary. The Supervisor is Car 4.'


        },
        {
            header: 'Duty Supervisor Requirements',
            internal_title: 'DS Requirements',
            body: 'To be a Duty Supervisor a member must satisfy the following requirements:' + '\n' +
            '* Be a Crew Chief Trainer\n' +
            '* Be a Driver Trainer\n' +
            '* Be a First Response Crew Chief\n' +
            '* Be an EES\n' +
            '* Have a 70% or higher QI compliance rate\n' +
            '* Be evaluated and approved by the Promotional Board consisting of the Captain and other active Duty Supervisors'

        },

        {
            header: 'Current Duty Supervisors',
            internal_title: 'Current DS',
            body: '* Dan Bruce\n' +
            '* Everest Orloff\n' +
            '* Jacob Steingart (as captain)'

        }

    ];
}]);
