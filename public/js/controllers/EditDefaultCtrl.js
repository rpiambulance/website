var ctrl_name = 'EditDefaultCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', '$http', function($scope, $http) {

$scope.suc = {};
$scope.sud = {};
$scope.sua = {};
$scope.suo = {};
$scope.moc = {};
$scope.mod = {};
$scope.moa = {};
$scope.moo = {};
$scope.tuc = {};
$scope.tud = {};
$scope.tua = {};
$scope.tuo = {};
$scope.wec = {};
$scope.wed = {};
$scope.wea = {};
$scope.weo = {};
$scope.thc = {};
$scope.thd = {};
$scope.tha = {};
$scope.tho = {};
$scope.frc = {};
$scope.frd = {};
$scope.fra = {};
$scope.fro = {};
$scope.sac = {};
$scope.sad = {};
$scope.saa = {};
$scope.sao = {};

$scope.cc= {};
$scope.d= {};
$scope.a= {};
$scope.o= {};

$scope.cc.levelsArr = [

                      { value: "NO DATA", label: "NO DATA" },
                      { value: "oos", label: "OUT OF SERVICE" }

                  ];
  $scope.d.levelsArr = [

                      { value: "NO DATA", label: "NO DATA" },
                      { value: "oos", label: "OUT OF SERVICE" }

                  ];
  $scope.a.levelsArr = [

                      { value: "NO DATA", label: "NO DATA" },
                      { value: "oos", label: "OUT OF SERVICE" }

                  ];
$scope.o.levelsArr = [

                      { value: "NO DATA", label: "NO DATA" },
                      { value: "oos", label: "OUT OF SERVICE" }

                  ];


$scope.oos_all= function () {
  $scope.suc.levels = $scope.cc.levelsArr[1].value;
  $scope.sud.levels = $scope.d.levelsArr[1].value;
  $scope.sua.levels = $scope.a.levelsArr[1].value;
  $scope.suo.levels = $scope.o.levelsArr[1].value;
  $scope.moc.levels = $scope.cc.levelsArr[1].value;
  $scope.mod.levels = $scope.d.levelsArr[1].value;
  $scope.moa.levels = $scope.a.levelsArr[1].value;
  $scope.moo.levels = $scope.o.levelsArr[1].value;
  $scope.tuc.levels = $scope.cc.levelsArr[1].value;
  $scope.tud.levels = $scope.d.levelsArr[1].value;
  $scope.tua.levels = $scope.a.levelsArr[1].value;
  $scope.tuo.levels = $scope.o.levelsArr[1].value;
  $scope.wec.levels = $scope.cc.levelsArr[1].value;
  $scope.wed.levels = $scope.d.levelsArr[1].value;
  $scope.wea.levels = $scope.a.levelsArr[1].value;
  $scope.weo.levels = $scope.o.levelsArr[1].value;
  $scope.thc.levels = $scope.cc.levelsArr[1].value;
  $scope.thd.levels = $scope.d.levelsArr[1].value;
  $scope.tha.levels = $scope.a.levelsArr[1].value;
  $scope.tho.levels = $scope.o.levelsArr[1].value;
  $scope.frc.levels = $scope.cc.levelsArr[1].value;
  $scope.frd.levels = $scope.d.levelsArr[1].value;
  $scope.fra.levels = $scope.a.levelsArr[1].value;
  $scope.fro.levels = $scope.o.levelsArr[1].value;
  $scope.sac.levels = $scope.cc.levelsArr[1].value;
  $scope.sad.levels = $scope.d.levelsArr[1].value;
  $scope.saa.levels = $scope.a.levelsArr[1].value;
  $scope.sao.levels = $scope.o.levelsArr[1].value;

};


}]);
