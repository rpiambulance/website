var ctrl_name = 'NominationsCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function ($scope) {
    $scope.pageHeader = 'Nominations';
    $scope.columns = true;

    $scope.sections = [

        {
            internal_title: 'Introduction',
            header: 'Nominations Process',
            body: 'The section of the site lists all the current nominations for the 2016-2017 RPI Ambulance Officer ' +
            'Board. All nominations are subject to change until elections begin. This page will be updated with the ' +
            'latest nomination results as announcements are made. Please continue to check this section of the site ' +
            'until final results are announced. If you have any questions please reach out to a member of the current ' +
            'officer board.'
        },

        {
            header: 'President',
            internal_title: 'Text',
            body: '* Zackery White\n' +
            '* Sean Waclawik\n' +
            '* Rebecca Martin\n' +
            '* Jody Ostrander\n' +
            '* Harrison Leinweber\n' +
            '* Josh Correira\n' +
            '* Alli Morgan'
        },

        {
            header: 'Captain',
            internal_title: 'Text',
            body: '* Zackery White\n' +
            '* Harrison Leinweber\n' +
            '* Josh Correira'
        },

        {
            header: 'First Lieutenant',
            internal_title: 'Text',
            body: '* Zackery White\n' +
            '* Harrison Leinweber\n' +
            '* Brittany Rupp\n'
        },

        {
            header: 'Second Lieutenant',
            internal_title: 'Text',
            body: '* Joshua Correira\n' +
            '* Brittany Rupp\n' +
            '* Jody Ostrander\n' +
            '* Sean Waclawik\n' +
            '* David Wolmark'
        },

        {
            header: 'Vice President',
            internal_title: 'Text',
            body: '* Rebecca Martin\n' +
            '* Jody Ostrander\n' +
            '* Aquiel Godeau\n' +
            '* Mary Clare Crochiere\n' +
            '* Sean Waclawik\n' +
            '* Erin Tuttle\n' +
            '* Emma Speaks\n' +
            '* Alli Morgan\n' +
            '* Joerene Aviles'
        }

    ];
}]);