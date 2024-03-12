angular.module('GrievanceFormCtrl', []).controller('GrievanceFormCtrl', ['$scope', function($scope) {
    $scope.pageHeader = 'RPI Ambulance Grievance Report Form';
    $scope.sections = [
        {
            header: 'Grievance Committee',
            internal_title: 'Grievance Committee',
            body: 'The Grievance Committee at RPIA aims to address interpersonal conflicts that may occur within the club, diffuse interagency tensions, and ensure that the SOGs and constitution are followed by all members. We stand as unbiased members of the club and hope that you’ll feel comfortable sharing any issues or concerns with us. We will work to the best of our abilities so that RPI Ambulance can be a great experience for all members. In many cases, a problem can be easily resolved by talking with each other. However, if you do not feel comfortable addressing the person(s) directly, please place your response through our Google form below so that we can help mediate a session with the other individual(s). There are many options in terms of level of anonymity, but all meetings and interactions related to your case will be held in a closed environment. Do not hesitate to contact us at gc@rpiambulance.com for more information.\n'
        },

        {
            header: 'Report Form',
            body: '<div class="embed-responsive embed-responsive-16by9"> ' +
            '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfP8JH9vpKtFNeaz0gxF7IbcgVNj-zw8AxyZMjg0-QioX0QKA/viewform?embedded=true" width="640" height="2031" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>'
        }
    ];
}]);