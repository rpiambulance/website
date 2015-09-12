angular.module('CommunicationsCtrl', []).controller('CommunicationsCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Communications';
    $scope.pageSubHeader = 'Inter&dash; and Intra&dash;agency communications resources';
    $scope.sections = [
        {
            sectionHeader: 'Introduction to RPIA radio communications',
            paragraphs: [
                'RPI Ambulance has numerous parts to its communication system. As we are officially a county agency, we get ' +
                'dispatched as such. This means that if a call comes in to the RPI Department of Public Safety, they contact ' +
                'Rensselaer County to send us to the scene.',

                'We also utilize our own radio system for use by day and night crews, as well as events and standby coverage.',

                'To contact others, call their identifier, then yours. Wait for them to respond, and then proceed with your message.'
            ],
            list: []
        },
        {
            sectionHeader: 'The &ldquo;800&rdquo;',
            paragraphs: [
                'Dispatch and some other emergency services such as ALS intercepts are contacted via the &ldquo;800&rdquo;, ' +
                'called that because it uses frequencies in the 800 MHz range. There is one mobile unit in the ambulance,' +
                'and three portables&mdash;one at the office, one in the ambulance, and one in the first response vehicle.',

                'The 800 system is broken up in to channels or talk groups based on function and geography. The numbering ' +
                'format is &ldquo;system&rdquo; followed by &ldquo;group,&rdquo; i.e. the &ldquo;alert&rdquo; channel is ' +
                'system 1, group 15.',

                'The important channels are as follows:',

                'The system relies on a series of repeater towers to transmit messages. Your transmission is picked ' +
                'up by the nearest tower, and then relayed to the appropriate party. If there is no available tower, ' +
                'you may receive a text error or an error tone on the radio. Try retransmitting, and then try turning ' +
                'off the radio and turning it back on again if that doesn&rsquo;t work.',

                'If you hit the red emergency activation button on any 800 unit, the unit will automatically switch over ' +
                'to system 10, and you receive a dedicated communications line to dispatch; all other communications are ' +
                'blocked out. Power off the unit to clear the emergency activation, and contact the dispatcher (over the ' +
                'air or landline preferable) to inform them of any &ldquo;accidental trips&rdquo;.'
            ],
            list: [
                '1-1: Dispatch <span>Communication with EMS dispatcher</span>',

                '1-2: Amb to amb <span>Ambulance to ambulance communication; used to directly contact another unit, such ' +
                'as an ALS intercept</span>',

                '1-3, 1-4, and 1-5: EMS ops <span>Used for MCIs and other multiple-agency events</span>',

                '1-15: Alert <span>Dispatch channel for other agencies (RPIA is dispatched on its own system)</span> ' +
                '<span class="other">Although it is possible, do not transmit on this channel</span>'
            ],
            listClass: 'comm-list',
            numParagraphsBeforeList: 3
        },
        {
            sectionHeader: 'The RPI Ambulance VHF system',
            paragraphs: [
                'Most communication is done over the main RPIA channel using agency portables, mobiles, or base ' +
                'stations. Dispatches are also sent over the frequency; Rensselaer County Public Safety uses a radio ' +
                'link on an old Troy Fire frequency (460.2875 MHz) that gets retransmitted on our frequency from a ' +
                'transmitter on Walker Laboratory.'
            ],
            list: [
                'Channel 1: RPI Ambulance (155.220 MHz)',

                'Channel 2: RPIA alert (exactly like channel 1, but only activates upon pager tones)',

                'Channel 3: RPI Parking and Transportation',

                'Channel 4: Houston Field House operations',

                'Channel 5: RPI Department of Public Safety (expired license)',

                'Channel 6: BLS 340 (155.340 MHz: hospital radio frequency for Albany hospitals)',

                'Channel 7: BLS 400 (155.400 MHz: hospital radio frequency for Troy and Schenectady hospitals)',

                'Channel 8: EMS 715 (155.715 MHz: statewide, inter-agency operations frequency: all emergency ' +
                'units equipped to use this channel)',

                'Channel 9: Empire Ambulance dispatch',

                'Channel 10: Mohawk Ambulance dispatch',

                'Channel 11: Weather'
            ]
        },
        {
            sectionHeader: 'H.E.A.R. (Hospital Emergency and Administrative Radio)',
            paragraphs: [
                'The patient compartment of the ambulance has a radio used to contact hospitals prior to ' +
                'arrival. BLS 340 (used for Albany hospitals) and BLS 400 (used for all other Capital District ' +
                'hospitals) utilize an code to open the frequency at the hospital to allow communication. Crew chiefs ' +
                'are trained in the usage of this radio and the appropriate hospital radio codes.'
            ]
        },
        {
            sectionHeader: 'Radio-specific Information',
            paragraphs: [
                // NOTE: All urls should be relative to the public/ directory, NOT public/js/controllers/.
                '<a href="/uploads/Office%20Radio%20Instructions%20%28Kenwood%20TK-780H%29.pdf">' +
                'Houston Field House Radio Instructions (Kenwood TK-780H)' +
                '</a>'
            ]

        }
    ];
}]);