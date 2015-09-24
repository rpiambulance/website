var ctrl_name = 'EventsCtrl';
angular.module(ctrl_name, []).controller(ctrl_name, ['$scope', function($scope) {
    $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.now = $filter('date')(new Date(), 'HH:mm:ss');

    // HTTP GET REQUEST HERE
    // "SELECT * FROM events WHERE date > '$today' AND hide = 0 OR (date = '$today'  AND end >= '$now') AND hide = 0 ORDER BY date, start ASC LIMIT 5"

    /*
     $howmany = mysql_num_rows($query);
     $i = 0;
     while($events = mysql_fetch_array($query))
     {
     $y = substr($events['date'], 0, 4);
     $m = substr($events['date'], 5, 2);
     $d = substr($events['date'], 8, 2);
     $starth = substr($events['start'], 0, 2);
     $startm = substr($events['start'], 3, 2);
     $endh = substr($events['end'], 0, 2);
     $endm = substr($events['end'], 3, 2);
     $when = date('l, M jS, H:i', mktime($starth, $startm, 0, $m, $d, $y));
     $when .= "-".date('H:i', mktime($endh, $endm, 0, $m, $d, $y));
     $where = stripslashes($events['location']);
     ?>
     <div class="textwidget"><p><b><a class="footnote" href="?page=gamesevents&eventid=<? echo $events['id']; ?>"><? echo stripslashes($events['description']); ?></a></b><br />
     <? echo $when; ?> <br /> @ <? echo $where; ?></p>
     <p><b></b></p>
     </div>
     <?
     $i++;
     if($i == 5)
     break;
     }
     if($i == 0)
     echo "N/A<br />";
     if($i < $howmany)
     echo "<br />";
     ?>*/
}]);
