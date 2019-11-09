angular.module('JoinCtrl', []).controller('JoinCtrl', ['$scope', function ($scope) {
    $scope.pageHeader = 'Join The Team!';
    $scope.columns = true;

    $scope.sections = [
        {
            header: 'How do I join?',
            body: 'We are always more than happy to welcome more people to our agency. If you are an active RPI student ' +
            'feel free to stop by one of our general body meetings to learn more. You should be able to find the dates in ' +
            '\'upcoming events\' section on the home page. If you feel you will not be able to join us for a meeting, just ' +
            'reach out to us using the <a href="#/contact">contact us</a> page and we\'ll figure something out.'
        },

        {
            header: 'I\'m not an RPI student. Can I still join?',
            body: 'Of course! If you are not an RPI student, please reach out to us using the <a href="#/contact">' +
            'contact us</a> page to find out the best time to come to one of our meetings to introduce yourself. Since ' +
            'you are not an active student at RPI, members of the agency will have to vote you in as a new member during ' +
            'one of the general body meetings.'
        },

        {
            header: 'Are the any requirements to join?',
            body: 'None at all! All we ask is that you\'re willing to participate. Many of our members don\'t have any ' +
            'prior experience in EMS and we do most of our own training. Unlike many other agencies we also don\'t require ' +
            'you to be an EMT to ride with us. However, if you are interested in becoming an EMT, there is usually one ' +
            'class per semester.'
        },

        {
            header: 'Any more questions?',
            body: 'Check out our <a href="#/FAQ">FAQ</a> page if you have any other questions. If there is still more ' +
            'that you want to learn about how to join, drop us a line using the <a href="#/contact">contact us </a>' +
            'page'
        }
    ];

    $scope.formData = {
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    };

    var autocompleteValidate = function () {
        var corrected = {};
        for (var d in $scope.formData) {
            if($scope.formData.hasOwnProperty(d)) {
                if(document.getElementById(d).value !== $scope.formData[d] && d != "g-recaptcha-response") {
                    corrected[d] = document.getElementById(d).value;
                } else {
                    corrected[d] = $scope.formData[d];
                }
            }
        }
        return corrected;
    };

    $scope.clearForm = function () {
        for (var d in $scope.formData) {
            if ($scope.formData.hasOwnProperty(d))
                $scope.formData[d] = "";
        }
    };

    $scope.submitForm = function () {
        if(!document.getElementById("g-recaptcha-response")) {
            return;
        }

        $scope.formData["g-recaptcha-response"] = document.getElementById("g-recaptcha-response").value;

        $http({
            method: 'POST',
            url: '.contact_submit.php',
            data: autocompleteValidate(), // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).success(function (data) {
            if (!data.success) {
                console.log("it failed!");
                // if not successful, bind errors to error variables
                if(data.errors.name) {
                    $scope.errorName = data.errors.name;
                }
                if(data.errors.email) {
                    $scope.errorEmail = data.errors.email;
                }
                if(data.errors.message) {
                    $scope.errorTextarea = data.errors.message;
                }
                if(data.messageError) {
                    $scope.submissionMessage = data.messageError;
                }

                $scope.submission = true; //shows the error message
            } else {
                $scope.showContactSuccess = true;
                // if successful, bind success message to message
                $scope.submissionMessage = data.messageSuccess;
                $scope.formData = {}; // form fields are emptied with this line
                $scope.submission = true; //shows the success message
            }
        });
    };
}]);
