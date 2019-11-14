angular.module('MutualAidCtrl', []).controller('MutualAidCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'Mutual Aid';
    $scope.columns = true;
    $scope.sections = [
        {
            header: 'On campus',
            internal_title: 'Campus',
            body: 'The City of Troy provides primary mutual aid and ALS coverage for the campus (as the campus is ' +
            'within the City, it is within their primary response district). Mutual aid policies for the Fire ' +
            'Department will be followed in the event their units are unavailable to respond to a call on campus.' +
            '\n\n' +
            'Rensselaer County policy states that a call must be acknowledged by an EMT/crew chief or a driver ' +
            'within three minutes of the call, a crew must be confirmed within six minutes of the call, and the ' +
            'ambulance must be en route within nine minutes of the call. These are referred to as the &ldquo;mutual ' +
            'aid marks&rdquo;. The dispatcher may inquire about your status and inform you &ldquo;you are at your ' +
            'mark&rdquo;; if they are not met, a mutual aid unit will be dispatched. An additional three minutes ' +
            '(for a total of 12 minutes) may be requested due to inclement weather or road conditions or another ' +
            'similar situation.'
        },
        {
            header: 'Elsewhere in Rensselaer County',
            internal_title: 'Elsewhere',
            body: 'In 2009, Rensselaer County updated its mutual aid policy, such that the closest BLS ambulance, ' +
            'followed by the closest staffed BLS ambulance, would be dispatched for mutual aid calls. Thus, RPI ' +
            'Ambulance is the primary BLS mutual aid ambulance for parts of Brunswick and North Greenbush.' +
            '\n\n' +
            'To be considered staffed, an agency must have a crew on stand-by, and be able to be en route within ' +
                'three minutes of the call. RPI Ambulance is listed as staffed from 18:00 to 06:00 daily. There are ' +
            'no apparent definite response areas, rather it is the discretion of the dispatcher as to which unit ' +
            'is sent.' +
            '\n\n' +
            'RPIA covers Brunswick through part of Route 7 and the surrounding area; Empire Ambulance provides ' +
                'mutual aid ALS, and Brunswick Fire Company No. 1 provides first response.' +
            '\n\n' +
            'The agency has responded to calls in all parts of North Greenbush, but primarily receives calls on ' +
                'or just off Route 66,which extends Troy\'s Pawling Avenue, or on or just off Route 4, which also runs ' +
            'directly through downtown Troy. Sand Lake Ambulance or Empire provides ALS intercepts, if available, ' +
            'with Troy Fire Department providing if the transport runs through Troy. The Wynantskill or ' +
            'Defreestville fire departments provide first response in North Greenbush for delta reponses or if ' +
            'there will be a delayed ambulance response (such as with mutual aid). North Greenbush Police Department ' +
            'also responds to nearly every call in the town.'
        },
        {
            header: 'In Troy',
            internal_title: 'Troy',
            body: 'The City of Troy has three paramedic ambulances. If they are unavailable, Empire or Mohawk ' +
            'provide primary mutual aid on alternating days of the week. Colonie EMS provides automatic cover to ' +
            'Troy in the event of a box alarm or other large event that ties up TFD resources. RPI Ambulance ' +
            'provides secondary mutual aid to Troy if the commercial agencies are unavailable, with a fire ' +
            'company or commercial unit providing ALS.'

        }
    ];
}]);
