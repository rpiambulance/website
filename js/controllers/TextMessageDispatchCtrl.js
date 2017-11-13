var ctrl_name = 'TextMessageDispatchCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function ($scope) {
    $scope.pageHeader = 'Text Message Dispatch';
    $scope.columns = false;
    $scope.sections = [
        {
            header: 'Purpose of Texting',
            internal_title: 'Purpose of Texting',
            body: 'Due to the high cost and low availability of radios, many new members who are in training and have ' +
            'difficulty getting ride time need other means of receiving dispatches for day calls. This has been ' +
            'implemented with text message dispatches'
        },
        {
            header: 'Text Message Dispatch List',
            internal_title: 'TMD List',
            body: 'RENSCO sends text message dispatches to participating agencies once a radio dispatch has been made. ' +
            'RPIA has these messages sent to the duty phone, a phone at the desk of RPI DPS, and an email - ' +
            'RPIAMB-TMD-L@lists.rpi.edu. This email is a list that is edited via RPI LISTPROC. This is done so members' +
            ' can be added to and removed from the list immediately as required, without having to wait for county to ' +
            'process such requests. Also, at a glance, the list of recipients for the text message dispatch are ' +
            'available. RPIAMB-TMD-L@lists.rpi.edu is configured so only admins can email the list – currently the ' +
            'Captain, President, renscobps@gmail.com and renscobps1@gmail.com. The emails the county uses to send text' +
            ' message dispatches, are also listed as owners so they may email the list. It is also configured so only ' +
            'admins can add or remove people from the list Sending dispatches through this list do produce a noticeable' +
            ' delay. However, the utility of being able to modify the list in real time has outweighed this cost. Also,' +
            ' personnel who rely on text message dispatches are traditionally not able to serve as a CC or a Driver, and' +
            ' as such a delay in their response will not equate to a delay in ambulance response.'


        },
        {
            header: 'Agreement',
            internal_title: 'Agreement',
            body: 'All users who participate in text message dispatches are agreeing to conform to the following rules:' +
            ' RPI Ambulance is offering a text message dispatch service to its members to increase training ' +
            'opportunities and ride time. Those who opt-in to this program will be notified via text message for every ' +
            'call that RPIA receives, days, nights, and weekends.' + '\n' +
            '* You are responsible for all text messaging fees and charges to your bill from your provider\n' +
            '* You can opt-out of this program once you have opted-in by sending an email to rpia@union.rpi.edu. ' +
            'Processing for this request can take several days. You may be required to provide follow-up to ensure your ' +
            'removal from the list. Your text message dispatch service will be terminated when RPI Ambulance goes out of' +
            ' service for summer break.\n' +
            '* If you choose to respond, report to the garage. You may be canceled at the Crew Chief\'s discretion. If ' +
            'no crew responds, or the ambulance is gone, resume your normal daily activities. Do not report to the scene' +
            ' as a member of RPI Ambulance.\n' +
            '* Do not respond to night calls (1800-0600) when you are not on crew \n' +
            '* This service is not reliable enough to be used while on a duty crew. If you are on a night crew or in ' +
            'some other way required to respond by a duty to act, you must have a radio with you at all times \n' +
            '* These rules may change at any time. Changes will be emailed to the ambulance mailing list'

        }

    ];
}]);
