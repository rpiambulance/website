angular.module('MySettingsCtrl', []).controller('MySettingsCtrl', ['$scope', '$http', 'AuthService', '$route', function($scope, $http, AuthService, $route) {

  $scope.dataReady = false;

  $scope.changePassFlag = false;

  $scope.formData = {
    fn: "",
    ln: "",
    pass: "",
    cpass: "",
    email: "",
    phone: "",
    hphone: "",
    add: "",
    hadd: "",
    session_id: ""
  }

  $scope.passChange = function () {
    if ($scope.formData.pass !== "" && $scope.formData.cpass !== "") {
      $scope.changePassFlag = true;
      console.log($scope.changePassFlag);
    }
    else{
      $scope.changePassFlag = false;
      console.log($scope.changePassFlag);
    }
  }

  $scope.initPage = function () {
    AuthService.getUserMetadata().then(function (data) {
      console.log(data);
      $scope.formData.fn = data.first_name;
      $scope.formData.ln = data.last_name;
      $scope.formData.email = data.email;
      $scope.formData.phone = data.cell_phone;
      $scope.formData.hphone = data.home_phone;
      $scope.formData.add = data.rpi_address;
      $scope.formData.hadd = data.home_address;
      $scope.formData.session_id = AuthService.getSessionId();

      $scope.dataReady = true;
    });
  }

  $scope.initPage();

  $scope.save = function () {
    if ($scope.changePassFlag){
      if ($scope.formData.pass === $scope.formData.cpass) {
        $http({
            method: 'POST',
            url: '.edit_self_pass.php',
            data: $scope.formData, // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
        }).then(function (response) {
            console.log(response.data);
            if (!response.data.success) {
                console.log("it failed!");
                $scope.submission = true; //shows the error message
                $scope.showError= true;
            } else {
                swal("Success!", "Your user record has been updated, and your password was changed. The EMS gods have been made aware of this. Please be prepared to sacrifice a hot meal.", "success");
                $route.reload();
            }
        });       }
      else{
        sweetAlert("Whoa there!", "It looks like your passwords don't quite match. Please verify that you entered all data correctly and try again", "error");
      }
    }
    else{
      $http({
          method: 'POST',
          url: '.edit_self.php',
          data: $scope.formData, // pass in data as strings
          headers: {'Content-Type': 'application/x-www-form-urlencoded'} // set the headers so angular passing info as form data (not request payload)
      }).then(function (response) {
          console.log(response.data);
          if (!response.data.success) {
              console.log("it failed!");
              $scope.submission = true; //shows the error message
              $scope.showError= true;
          } else {
              swal("Success!", "Your user record has been updated. The EMS gods have been made aware of this change. Please be prepared to sacrifice a hot meal.", "success");
              $route.reload();
          }
      });     }
  }



}]);
