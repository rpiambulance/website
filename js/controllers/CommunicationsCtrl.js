angular.module('CommunicationsCtrl', []).controller('CommunicationsCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Communications';
    $scope.pageSubHeader = 'Inter- and Intra-agency communications resources';

    $scope.columns = true;

    $scope.sections = [
        {
            internal_title: 'Introduction',
            header: 'Introduction to RPIA radio communications',
            body: 'RPI Ambulance has numerous parts to its communication system. As we are officially a county agency, we get ' +
            'dispatched as such. This means that if a call comes in to the RPI Department of Public Safety, they contact ' +
            'Rensselaer County to send us to the scene.' +
            '\n\n' +
            'We also utilize our own radio system for use by day and night crews, as well as events and standby coverage.' +
            '\n\n' +
            'To contact others, call their identifier, then yours. Wait for them to respond, and then proceed with your message.'
        },
        {
            internal_title: 'The 800',
            header: 'The "800"',
            body: 'Dispatch and some other emergency services such as ALS intercepts are contacted via the &ldquo;800&rdquo;, ' +
            'called that because it uses frequencies in the 800 MHz range. There is one mobile unit in the ambulance,' +
            'and three portables&mdash;one at the office, one in the ambulance, and one in the first response vehicle.' +
            '\n\n' +
            'The 800 system is broken up in to channels or talk groups based on function and geography. The numbering ' +
            'format is &ldquo;system&rdquo; followed by &ldquo;group,&rdquo; i.e. the &ldquo;alert&rdquo; channel is ' +
            'system 1, group 15.' +
            '\n\n' +
            'The important channels are as follows:\n' +
            '* 1-1: Dispatch <span class="comm-list">Communication with EMS dispatcher</span>' + '\n' +
            '* 1-2: Amb to amb <span class="comm-list">Ambulance to ambulance communication; used to directly contact another unit, such ' +
                'as an ALS intercept</span>' + '\n' +
            '* 1-3, 1-4, and 1-5: EMS ops <span class="comm-list">Used for MCIs and other multiple-agency events</span>' + '\n' +
            '* 1-15: Alert <span class="comm-list">Dispatch channel for other agencies (RPIA is dispatched on its own system)</span>' + '\n' +
            '<span class="comm-list-other">Although it is possible, do not transmit on this channel</span>' +
            '\n\n' +
            'The system relies on a series of repeater towers to transmit messages. Your transmission is picked ' +
            'up by the nearest tower, and then relayed to the appropriate party. If there is no available tower, ' +
            'you may receive a text error or an error tone on the radio. Try retransmitting, and then try turning ' +
            'off the radio and turning it back on again if that doesn&rsquo;t work.' +
            '\n\n' +
            'If you hit the red emergency activation button on any 800 unit, the unit will automatically switch over ' +
            'to system 10, and you receive a dedicated communications line to dispatch; all other communications are ' +
            'blocked out. Power off the unit to clear the emergency activation, and contact the dispatcher (over the ' +
            'air or land-line preferable) to inform them of any &ldquo;accidental trips&rdquo;.'
        },
        {
            internal_title: 'VHF System',
            header: 'The RPI Ambulance VHF system',
            body:
                'Most communication is done over RPIA Ops (channel 1) using agency portables, mobiles, or base ' +
                'stations. Dispatches can be recieved on channel 4 or 5 or by activating the scan feature on channels 1 or 3.'+
                ' A breakdown of the channels is listed below.' + '\n' +
                '* Channel 1: RPIA Ops (repeated channel suitible for normal day to day operations)\n' +
                '* Channel 2: RPIA Tac 1 (Talkaround channel compatible with Ops used when outside of the range of the repeater)\n' +
                '* Channel 3: RPIA Tac 2 (Talkaround channel usually used for events)\n' +
                '* Channel 4: RPIA Dispatch (activates upon receiving tones from county)\n' +
                '* Channel 5: County Dispatches\n' +
                '* Channel 6: Individual Pageing (for supervisors and officers)\n' +
                '* Channel 7: EMS 400 (155.400 MHz: hospital radio frequency for Troy and Schenectady hospitals)\n' +
                '* Channel 8: EMS 715 (155.715 MHz: statewide, inter-agency operations frequency: all emergency ' +
                'units equipped to use this channel)\n' +
                '* Channel 9: Weather\n' +
                'If you seek more information contact the radio coordinator.'
        },
        {
            internal_title: 'HEAR',
            header: 'H.E.A.R. (Hospital Emergency and Administrative Radio)',
            body:
                'The patient compartment of the ambulance has a radio used to contact hospitals prior to ' +
                'arrival. EMS 340 (used for Albany hospitals) and EMS 400 (used for all other Capital District ' +
                'hospitals) utilize a code to open the frequency at the hospital to allow communication. Crew chiefs ' +
                'and drivers are trained in the usage of this radio and the appropriate hospital radio codes.'
        },
        {
            header: 'Radio Documentation',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://drive.google.com/embeddedfolderview?id=0BzoMrS_ZZPigOTlJZlRSVlJvblU#list" width="600" height="100%" frameborder="0"></iframe></div>'
        }
    ];
}]);
