angular.module('OfficersCtrl', []).controller('OfficersCtrl', ['$scope', '$sce', function ($scope, $sce) {
    $scope.pageHeader = 'Officer Board';
    $scope.sections = [
        {
            header: '',
            internal_title: 'Officers Description',
            body: 'The officers of RPI Ambulance are elected each year at the first general meeting in March. The ' +
            'officers perform day to day and long term operational and administrative tasks. In 2009, the RPI Ambulance ' +
            'Constitution was changed to reduce the officer board from 8 officers to 5 consolidating "non-steering" ' +
            'positions into more important roles. This allows for a smaller, more efficient officer board and the ' +
            'opportunity for more members to become involved with non-elected coordinator positions.'
        },


        {
            header: 'Officer Board',
            internal_title: 'O-Board Photo',
            type: 'img',
            img: 'img/O-Board.jpg',
            width: '75%',
            alt: 'Photo of the office board',
            centered: true
        },

        {
            header: 'Current Officer Board',
            internal_title: 'Current Officer Board',
            body: 'Line Side: \n' +
            '* Captain: Jacob Steingart \n' +
            '* First Lieutenant: Thomas Celuzza \n' +
            '* Second Lieutenant: Sean Lim \n' +
            '\nCivil Side:\n' +
            '* President: Felicia Walbridge \n' +
            '* Vice President: Alex Mattoni'
        },

        {
            header: 'Officer Board 2022-2023',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '* Captain: Everest Orloff \n' +
            '* First Lieutenant: Dianna Stuzhuk \n' +
            '* Second Lieutenant: Jacob Steingart \n' +
            '\nCivil Side:\n' +
            '* President: Tom Zelley\n' +
            '* Vice President: Francisco Alicandri'
        },
        
        {
            header: 'Officer Board 2021-2022',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '* Captain: Everest Orloff \n' +
            '* First Lieutenant: Dianna Stuzhuk \n' +
            '* Second Lieutenant: Jacob Steingart \n' +
            '\nCivil Side:\n' +
            '* President: Sandhya Vellayappan\n' +
            '* Vice President: Cammy Vanek'
        },

        {
            header: 'Officer Board Spring 2021',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '* Captain: Everest Orloff \n' +
            '* First Lieutenant: Martin Smith \n' +
            '* Second Lieutenant: Dianna Stuzhuk \n' +
            '\nCivil Side:\n' +
            '* President: Nathan Buckley\n' +
            '* Vice President: Sandhya Vellayappan'
        },
        
        {
            header: 'Officer Board Fall 2020',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '* Captain: Logan Ramos \n' +
            '* First Lieutenant: Martin Smith \n' +
            '* Second Lieutenant: Everest Orloff \n' +
            '\nCivil Side:\n' +
            '* President: Nathan Buckley\n' +
            '* Vice President: Sandhya Vellayappan'
        },
                
        {
            header: 'Officer Board 2019-2020',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '* Captain: Caleb Woodson \n' +
            '* First Lieutenant: Nathaniel Foye \n' +
            '* Second Lieutenant: Martin Smith \n' +
            '\nCivil Side:\n' +
            '* President: Yaseen Mahmoud\n' +
            '* Vice President: Nathan Buckley'
        },
        
        {
            header: 'Officer Board Spring 2019',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '* Captain: Quazi Hossain \n' +
            '* First Lieutenant: John Jacangelo \n' +
            '* Second Lieutenant: Logan Ramos \n' +
            '\nCivil Side:\n' +
            '* President: Mary Clare Crochiere\n' +
            '* Vice President: Ingrid Oprea'
        },

        {
            header: 'Officer Board Fall 2018',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '* Captain: David Wolmark \n' +
            '* First Lieutenant: John Jacangelo \n' +
            '* Second Lieutenant: Logan Ramos \n' +
            '\nCivil Side:\n' +
            '* President: Mary Clare Crochiere\n' +
            '* Vice President: Ingrid Oprea'
        },

        {
            header: 'Officer Board 2017-2018',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '* Captain: Harrison Leinweber \n' +
            '* First Lieutenant: David Sparkman \n' +
            '* Second Lieutenant: Sean Waclawik \n' +
            '\nCivil Side:\n' +
            '* President: Ciera Williams\n' +
            '* Vice President: Justina Thompson'
        },

        {
            header: 'Officer Board 2016-2017',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '* Captain: Joshua Correira \n' +
            '* First Lieutenant: Harrison Leinweber \n' +
            '* Second Lieutenant: Jody Ostrander \n' +
            '\nCivil Side:\n' +
            '* President: Zackery White\n' +
            '* Vice President: Mary Clare Crochiere'
        },

        {
            header: 'Officer Board 2015-2016',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '* Captain: Tom Manzini \n' +
            '* First Lieutenant: Brittany Rupp \n' +
            '* Second Lieutenant: Harrison Leinweber \n' +
            '\nCivil Side:\n' +
            '* President: Ciera Williams\n' +
            '* Vice President: Rebecca Martin'
        },

        {
            header: 'Officer Board Spring 2015',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '* Captain: Tom Manzini \n' +
            '* First Lieutenant: Jordan Williams\n' +
            '* Second Lieutenant: Brittany Rupp\n' +
            '\nCivil Side:\n' +
            '* President: Alexander Benzell\n' +
            '* Vice President: Rebecca Martin'
        },

        {
            header: 'Officer Board Fall 2014',
            internal_title: 'Past Officer Boards',
            body: 'Line Side: \n' +
            '* Captain: Breanna Bernardi \n' +
            '* First Lieutenant: Drew Kopicki\n' +
            '* Second Lieutenant: Jordan Williams\n' +
            '\nCivil Side:\n' +
            '* President: Alli Morgan\n' +
            '* Vice President: Elise Romberger'
        }


    ];
}]);
