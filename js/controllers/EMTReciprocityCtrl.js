var ctrl_name = 'EMTReciprocityCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {
    $scope.pageHeader = 'EMT Certification Reciprocity';
    $scope.columns = true;
    $scope.sections = [
        {
            header: '',
            internal_title: 'Reciprocity Note',
            body: 'This page is up-to-date as of September, 2010. If you have EMT-Basic training in another state, you ' +
            'may receive EMT Certification in New York through the [NYS EMS Reciprocity Process]' +
            '(http://www.health.state.ny.us/nysdoh/ems/certification/reciprocity.htm). This page is meant to walk you ' +
            'through the [Reciprocity Packet](http://www.health.state.ny.us/nysdoh/ems/pdf/reciprocity_packet.pdf) [PDF], ' +
            'linked on that page. This packet contains all the information you should need. This page is meant to ' +
            'summarize, not replace, the instructions found on pages 6 and 7 in that packet. Two items of note for RPI students:' + '\n\n' +
            '1. There is a $25.00 fee which cannot be paid with cash or a personal check. Instead, purchase a money ' +
            'order from the Post Office in the Game Room on the first floor of the Union.' + '\n' +
            '2. You must sign Form DOH-2178 "Verification of EMT Certification" in the presence of a licensed Notary ' +
            'Public. There are several here at RPI; a list of of these individuals is available [here]' +
            '(http://hr.rpi.edu/update.do?artcenterkey=409). Please be polite: call before you show up.'
        },
        {
            header: 'Eligibility',
            body: 'Determine whether or not you are eligible for reciprocity based on the requirements on pages 2-5. ' +
            'The following is a brief summary.\n\n' +
            '* You must be at least 18 years old, with valid EMS certification in another state.\n' +
            '* If you have **NREMT certification**, or you have been previously certified in New York: ' +
            'Please see the note on Page 3. You will need to take a NY Refresher Course. The EMT refresher course, ' +
            'like the full EMT course, is taught at RPI. The state of New York will pay the refresher fee if you are ' +
            'affiliate with RPI Ambulance.\n' +
            '* If you received training through the **Military, National Park Service or the federal government**: ' +
            'please see the note at the top of page 4.\n' +
            'If you have a **prior criminal conviction**: please see the note on Page 4.\n' +
            '* You MAY NOT receive NYS reciprocity for any certification which was obtained through reciprocity ' +
            'from another state. Please see the note on page 5 for more information.'
        },
        {
            header: 'Relevant Forms',
            body: 'Your reciprocity application must include three forms available in the packet:\n' +
            '* DOH-2183 New York State EMT Reciprocity\n' +
            '* DOH-2178 Verification of EMT Certification\n' +
            '* DOH-2177 EMT Sheet for Reciprocity\n\n' +
            'The following sections will discuss the process of filling out each of these forms.\n\n'
        },
        {
            header: '(1) DOH-2183 Application for New York State EMT Reciprocity (page 9)',
            body: 'Fill in the following:\n' +
            '* Part A. Personal Data. Fill out each section.\n' +
            '* Part B. Training/Certification. Certification/Registration/License Number is the EMT number ' +
            'assigned to you by your home state. Also include your National Registry number if you have one. ' +
            'Photocopies of your home state EMT card and your CPR card should be included in your packet.\n' +
            '* Part C. Level of Training. Check where relevant.\n' +
            '* Part D. Most Recent Certification Information. Name of Institution is the military base, college, ' +
            'hospital, or other institution where you were trained.\n' +
            '* Part E. You must sign this document in the presence of a licensed [Notary Public]' +
            '(http://hr.rpi.edu/update.do?artcenterkey=409) on RPI\'s campus. **Please be polite: call before you show up.**'
        },
        {
            header: '(2) DOH-2178 Verification of EMT Certification (page 10)',
            body: 'Fill in your Home State EMT ID Number, your Date of Birth, your Name, and your Social Security Number. ' +
            'The remaining portion of this form must be completed by your home state EMS office. A listing of all the ' +
            'State EMS offices is available on Page 13 in the Reciprocity Packet. Find your home state EMS office, ' +
            'and send them the following:\n' +
            '* This form (known as DOH-2178),\n' +
            '* A self addressed, stamped envelope,\n' +
            '* A letter instructing your home EMS office to complete the form and return it to you. Allow a few weeks ' +
            'for processing.\n\n' +
            '**DO NOT open the envelope when the document is returned to you!** In order to prevent forgery, the ' +
            'state of New York requires that this document be sent to them in a sealed envelope.'
        },
        {
            header: '(3) DOH-2177 EMT Sheet for Reciprocity (page 11)',
            body: 'Detailed information about completing this form is available on Page 8 of the Reciprocity Packet. ' +
            'Complete the top portion of this page. **Be sure to print your information in CAPITAL LETTERS.**'
        },
        {
            header: 'Other Documents',
            body: 'Three other items are required as a part of your packet: **(4 and 5) Copies of your EMT ' +
            'Certification and Current CPR Card** If you have not already, photocopy your home state EMT ' +
            'Card and your current CPR card. These items are required by New York State.'
        },
        {
            header: '(6) Money Order',
            body: 'The current fee for EMT-B reciprocity is **$25.00**, and $50.00 for higher training levels. ' +
            '**Personal checks are not accepted, but you may purchase a Money Order at the Post Office in the ' +
            'Game Room on the first floor of the Rensselaer Student Union.**'
        },
        {
            header: 'Completing Your Application (Reciprocity Application Checklist, page 12)',
            body: 'Review this document to ensure that you&rsquo;ve included all SIX of the required items:\n' +
            '* Completed, signed, notarized **DOH-2183 New York State EMT Reciprocity**\n' + 
            '* Sealed Envelope containing **DOH-2178 Verification of EMT Certification**, completed by your home EMS office.\n' + 
            '* **DOH-2177 EMT Sheet for Reciprocity**. Ensure that you&rsquo;ve filled out this form with CAPITAL LETTERS.\n' +
            '* Photocopy of your home state **EMT certification card or document**. DO NOT send the original.\n' + 
            '* Photocopy of your **CPR card**. DO NOT send the original.\n' +
            '* Certified check or **Money Order for $25.00**.\n\n' + 
            'Send these items to: **New York State Department of Health** **Bureau of Emergency ' +
            'Medical Services** **Reciprocity Unit** **433 River Street, Suite 303** ' +
            '**Troy, NY 12180** You should receive your NYS card within a few weeks. When you do, be ' +
            'sure to inform the officers of your EMT number. Good luck!'
        }
    ];
}]);