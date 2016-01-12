<?
if($_GET['page'] == "nightcrews")
{
    require "error.php";
    die();
}
if(date(D) == "Sun")
{
    $oneweek = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d")+7, date("Y")));
    if(mysql_num_rows(mysql_query("SELECT id FROM crews WHERE date = '$oneweek'")) < 1)
    {
        for($i = 7; $i < 14; $i++)
        {
            $idarray = mysql_fetch_array(mysql_query("SELECT id FROM crews ORDER BY id DESC LIMIT 1")) or die(mysql_error());
            $logid = $idarray['id']+1;
            $default = mysql_fetch_array(mysql_query("SELECT * FROM default_crews WHERE day = $i-7"));
            $date = date('Y-m-d', mktime(0, 0, 0, date('m')  , date('d')+$i, date('Y')));
            $cc = $default['cc'];
            $driver = $default['driver'];
            $attendant = $default['attendant'];
            $observer = $default['observer'];
            mysql_query("INSERT INTO crews (id, date, cc, driver, attendant, observer) VALUES ($logid, '$date', $cc, $driver, $attendant, $observer)") or die(mysql_error());
        }
    }
}

if(isset($_POST['confirmcrew']))
{
    $signature = $_POST['signature'];
    $crewid = mysql_real_escape_string($_POST['crewid']);
    $position = mysql_real_escape_string($_POST['position']);
    $id = $_SESSION['id'];
    $secret = "cfa7kBwsjV9DrE0gxGnPXlRq1";
    $spot = mysql_fetch_array(mysql_query("SELECT ".$position." FROM crews WHERE id = $crewid"));
    if(sha1($crewid.$position.$id.$secret) == $signature && $spot[$position] == 0)
    {
        mysql_query("UPDATE crews SET ".$position." = $id WHERE id = $crewid");
    }
}
if(isset($_POST['clearcrew']))
{
    $signature = $_POST['signature'];
    $crewid = mysql_real_escape_string($_POST['crewid']);
    $position = mysql_real_escape_string($_POST['position']);
    $id = $_SESSION['id'];
    $secret = "cfa7kBwsjV9DrE0gxGnPXlRq1";
    if(sha1($crewid.$position.$id.$secret) == $signature)
    {
        mysql_query("UPDATE crews SET ".$position." = 0 WHERE id = $crewid");
    }
}
?>

<?
$idarray = mysql_fetch_array(mysql_query("SELECT id FROM crews ORDER BY id DESC LIMIT 1")) or die(mysql_error());
$prev_week = $idarray['id']-20;
$next_week = $idarray['id']-13;
if(isset($_GET['week']))
{
    $theday = mysql_real_escape_string($_GET['week']);
    $dayofweek = mysql_fetch_array(mysql_query('SELECT date FROM crews WHERE id = '.$theday.' LIMIT 1')) or die(mysql_error());
    $dayofweek = date('D', strtotime($dayofweek['date']));
    if($dayofweek == "Sun")
    {
        $prev_week = $theday-7;
        $next_week = $theday+7;
    }
}


?>
<center>


    <table width="100%" cellspacing="0" class="solidborder" border=0>
        <tr>
            <?
            if($prev_week >= 36 && $prev_week <= $idarray['id']-13)
                echo '<td align="left" width="20%"><a href="?page=members&module=1&week='.$prev_week.'" class="footnote">Previous</a></td>';
            if(isset($theday) && $next_week >= 36 && $next_week <= $idarray['id']-13)
                echo '<td align="right" width="20%"><a href="?page=members&module=1&week='.$next_week.'" class="footnote">Next</a></td>';
            ?>
        </tr>
    </table>

    <?
    for($tableloop = 0; $tableloop < 2; $tableloop++)
    {
        ?>
        <table width="100%" cellspacing="0" class="solidborder" border=2>
            <tr>
                <th class="solidborder" width="15%" height="28"><a class="nschhd">Night</a></th>
                <th class="solidborder" height="28"><a class="nschhd">Date</a></th>
                <th class="solidborder" width="19%" height="28"><a class="nschhd">Crew Chief</a></th>
                <th class="solidborder" width="19%" height="28"><a class="nschhd">Driver</a></th>
                <th class="solidborder" width="19%" height="28"><a class="nschhd">Rider</a></th>
                <th class="solidborder" width="19%" height="28"><a class="nschhd">Rider</a></th>
            </tr>
            <?
            if($tableloop == 0) $logid = $idarray['id']-13;
            elseif ($tableloop == 1) $logid = $idarray['id']-6;
            if(isset($theday))
            {
                if($theday >= 36 && $theday < $idarray['id']-13 && $dayofweek == "Sun")
                {
                    if($tableloop == 0) $logid = $theday;
                    elseif ($tableloop == 1) $logid = $theday+7;
                }
                else
                    header('Location: http://ambulance.union.rpi.edu/?page=members&module=1');
            }
            $onthisweek = 0;
            $ontoday = array();
            $ccton = array();
            $dton = array();
            if(isset($_SESSION['id']))
            {
                $memid = $_SESSION['id'];
                $member = mysql_fetch_array(mysql_query("SELECT * FROM members WHERE id = $memid LIMIT 1"));
                for($x = 0; $x < 7; $x++)
                {
                    $ontoday[$x] = 0;
                    $ccton[$x] = 0;
                    $dton[$x] = 0;
                    $atton[$x] = 0;
                    $obson[$x] = 0;
                    $y = mysql_fetch_array(mysql_query("SELECT * FROM crews WHERE id = $logid+$x LIMIT 1"));
                    if($y['cc'] == $memid || $y['driver'] == $memid || $y['attendant'] == $memid || $y['observer'] == $memid)
                    {
                        $onthisweek = 1;
                        $ontoday[$x] = 1;
                    }
                    $one = mysql_fetch_array(mysql_query("SELECT * FROM members WHERE id = $y[cc] LIMIT 1"));
                    $two = mysql_fetch_array(mysql_query("SELECT * FROM members WHERE id = $y[driver] LIMIT 1"));
                    $three = mysql_fetch_array(mysql_query("SELECT * FROM members WHERE id = $y[attendant] LIMIT 1"));
                    $four = mysql_fetch_array(mysql_query("SELECT * FROM members WHERE id = $y[observer] LIMIT 1"));
                    if($one['cctrainer'] == 1 || $two['cctrainer'] == 1 || $three['cctrainer'] == 1 || $four['cctrainer'] == 1)
                        $ccton[$x] = 1;
                    if($one['drivertrainer'] == 1 || $two['drivertrainer'] == 1 || $three['drivertrainer'] == 1 || $four['drivertrainer'] == 1)
                        $dton[$x] = 1;
                    if($y['attendant'] != 0)
                        $atton[$x] = 1;
                    if($y['observer'] != 0)
                        $obson[$x] = 1;
                }
            }
            for($i = 0; $i < 7; $i++)
            {
                $row = mysql_fetch_array(mysql_query("SELECT * FROM crews WHERE id = $logid+$i LIMIT 1"));
                $y = substr($row['date'], 0, 4);
                $m = substr($row['date'], 5, 2);
                $d = substr($row['date'], 8, 2);
                $day = date('l', mktime(0, 0, 0, $m , $d, $y));
                $ccemail = "";
                $driveremail = "";
                $attendantemail = "";
                $observeremail = "";
                $clear1 = "";
                $clear2 = "";
                $clear3 = "";
                $clear4 = "";
                if($row['cc'] > 0 || $row['cc'] == -3 || $row['cc'] == -2 || $row['cc'] == -1)
                {
                    $cc_array = mysql_fetch_array(mysql_query("SELECT * FROM members WHERE id = $row[cc] LIMIT 1"));
                    $cc = substr($cc_array['first_name'], 0, 1).". ".$cc_array['last_name'];
                    if($cc_array['id'] < 0)
                        $cc = $cc_array['last_name'];
                    if($cc_array['email'] != "") $ccemail = "href=\"mailto:".$cc_array['email']."\"";
                    if($cc_array['id'] == $_SESSION['id'] && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) <= mktime(18, 00, 00, $m , $d-2, $y))
                    {
                        $sig = sha1($row['id']."cc".$_SESSION['id']."cfa7kBwsjV9DrE0gxGnPXlRq1");
                        $clear1 = "<form name=\"clearcrew\" action=\"\" method=\"post\" style=\"position:relative;top:5px;display:inline;\"><input type=\"hidden\" name=\"crewid\" value=\"$row[id]\" /><input type=\"hidden\" name=\"position\" value=\"cc\" /><input type=\"hidden\" name=\"signature\" value=\"$sig\" /><input type=\"hidden\" name=\"clearcrew\" value=\"clearcrew\" /><input type=\"image\" name=\"clearcrew\" src=\"images/clearcrew.png\" style=\"margin-top:-5px;display:inline;\" /></form>";
                    }
                }
                else if(isset($_SESSION['id']) && ($member['crewchief'] == 1 || $member['firstresponsecc'] == 1 || $member['cctrainer'] == 1 || ($member['backupcc'] == 1 && $ccton[$i] == 1)) && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) <= mktime(23, 59, 59, $m , $d, $y))
                {
                    //else if(isset($_SESSION['id']) && ($member['crewchief'] == 1 || $member['cctrainer'] == 1 || ($member['backupcc'] == 1 && $ccton[$i] == 1)) && expirationValid("emt", $member['id']) == 1 && expirationValid("cpr", $member['id']) == 1 && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) <= mktime(23, 59, 59, $m , $d, $y))
                    if($ontoday[$i] == 0)
                    {
                        $sig = sha1($row['id']."cc".$_SESSION['id']."cfa7kBwsjV9DrE0gxGnPXlRq1");
                        $cc = "<form name=\"confirmcrew\" action=\"\" method=\"post\" style=\"margin-bottom:0;\"><input type=\"hidden\" name=\"crewid\" value=\"$row[id]\" /><input type=\"hidden\" name=\"position\" value=\"cc\" /><input type=\"hidden\" name=\"signature\" value=\"$sig\" /><input type=\"submit\" name=\"confirmcrew\" value=\"Sign Up\" /></form>";
                    }
                    else
                        $cc = "&nbsp;";
                }
                else $cc = "&nbsp;";
                if($row['driver'] > 0 || $row['driver'] == -3 || $row['driver'] == -2 || $row['driver'] == -1)
                {
                    $driver_array = mysql_fetch_array(mysql_query("SELECT * FROM members WHERE id = $row[driver] LIMIT 1"));
                    $driver = substr($driver_array['first_name'], 0, 1).". ".$driver_array['last_name'];
                    if($driver_array['id'] < 0)
                        $driver = $driver_array['last_name'];
                    if($driver_array['email'] != "") $driveremail = "href=\"mailto:".$driver_array['email']."\"";
                    if($driver_array['id'] == $_SESSION['id'] && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) <= mktime(18, 00, 00, $m , $d-2, $y))
                    {
                        $sig = sha1($row['id']."driver".$_SESSION['id']."cfa7kBwsjV9DrE0gxGnPXlRq1");
                        $clear2 = "<form name=\"clearcrew\" action=\"\" method=\"post\" style=\"position:relative;top:5px;display:inline;\"><input type=\"hidden\" name=\"crewid\" value=\"$row[id]\" /><input type=\"hidden\" name=\"position\" value=\"driver\" /><input type=\"hidden\" name=\"signature\" value=\"$sig\" /><input type=\"hidden\" name=\"clearcrew\" value=\"clearcrew\" /><input type=\"image\" name=\"clearcrew\" src=\"images/clearcrew.png\" style=\"margin-top:-5px;display:inline;\" /></form>";
                    }
                }
                else if(isset($_SESSION['id']) && ($member['driver'] == 1 || $member['drivertrainer'] == 1 || ($member['backupdriver'] == 1 && $dton[$i] == 1)) && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) <= mktime(23, 59, 59, $m , $d, $y))
                {
                    //else if(isset($_SESSION['id']) && ($member['driver'] == 1 || $member['drivertrainer'] == 1 || ($member['backupdriver'] == 1 && $dton[$i] == 1)) && expirationValid("dl", $member['id']) == 1 && expirationValid("cpr", $member['id']) == 1 && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) <= mktime(23, 59, 59, $m , $d, $y))
                    if($ontoday[$i] == 0)
                    {
                        $sig = sha1($row['id']."driver".$_SESSION['id']."cfa7kBwsjV9DrE0gxGnPXlRq1");
                        $driver = "<form name=\"confirmcrew\" action=\"\" method=\"post\" style=\"margin-bottom:0;\"><input type=\"hidden\" name=\"crewid\" value=\"$row[id]\" /><input type=\"hidden\" name=\"position\" value=\"driver\" /><input type=\"hidden\" name=\"signature\" value=\"$sig\" /><input type=\"submit\" name=\"confirmcrew\" value=\"Sign Up\" /></form>";
                    }
                    else
                        $driver = "&nbsp;";
                }
                else $driver = "&nbsp;";
                if($row['attendant'] > 0 || $row['attendant'] == -3 || $row['attendant'] == -2 || $row['attendant'] == -1)
                {
                    $attendant_array = mysql_fetch_array(mysql_query("SELECT * FROM members WHERE id = $row[attendant] LIMIT 1"));
                    $attendant = substr($attendant_array['first_name'], 0, 1).". ".$attendant_array['last_name'];
                    if($attendant_array['id'] < 0)
                        $attendant = $attendant_array['last_name'];
                    if($attendant_array['email'] != "") $attendantemail = "href=\"mailto:".$attendant_array['email']."\"";
                    if($attendant_array['id'] == $_SESSION['id'] && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) <= mktime(18, 00, 00, $m , $d-2, $y))
                    {
                        $sig = sha1($row['id']."attendant".$_SESSION['id']."cfa7kBwsjV9DrE0gxGnPXlRq1");
                        $clear3 = "<form name=\"clearcrew\" action=\"\" method=\"post\" style=\"position:relative;top:5px;display:inline;\"><input type=\"hidden\" name=\"crewid\" value=\"$row[id]\" /><input type=\"hidden\" name=\"position\" value=\"attendant\" /><input type=\"hidden\" name=\"signature\" value=\"$sig\" /><input type=\"hidden\" name=\"clearcrew\" value=\"clearcrew\" /><input type=\"image\" name=\"clearcrew\" src=\"images/clearcrew.png\" style=\"margin-top:-5px;display:inline;\" /></form>";
                    }
                }
                else if(isset($_SESSION['id']) && ($member['attendant'] == 1 || $obson[$i] == 1) && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) <= mktime(23, 59, 59, $m , $d, $y))
                {
                    //else if(isset($_SESSION['id']) && ($member['attendant'] == 1 || $obson[$i] == 1) && expirationValid("cpr", $member['id']) == 1 && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) <= mktime(23, 59, 59, $m , $d, $y))
                    if($member['dutysup'] == 1 || $member['ees'] == 1 || $member['cctrainer'] == 1 || $member['firstresponsecc'] == 1 || $member['drivertrainer'] == 1 || $member['crewchief'] == 1 || $member['driver'] == 1 || $member['backupcc'] == 1 || $member['backupdriver'] == 1 || $onthisweek == 0 || ($onthisweek == 1 && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) >= mktime(16, 00, 00, $m , $d, $y)) && $ontoday[$i] == 0)
                    {
                        if($ontoday[$i] == 0)
                        {
                            $sig = sha1($row['id']."attendant".$_SESSION['id']."cfa7kBwsjV9DrE0gxGnPXlRq1");
                            $attendant = "<form name=\"confirmcrew\" action=\"\" method=\"post\" style=\"margin-bottom:0;\"><input type=\"hidden\" name=\"crewid\" value=\"$row[id]\" /><input type=\"hidden\" name=\"position\" value=\"attendant\" /><input type=\"hidden\" name=\"signature\" value=\"$sig\" /><input type=\"submit\" name=\"confirmcrew\" value=\"Sign Up\" /></form>";
                        }
                        else
                            $attendant = "&nbsp;";
                    }
                    else
                        $attendant = "&nbsp;";
                }
                else $attendant = "&nbsp;";
                if($row['observer'] > 0 || $row['observer'] == -3 || $row['observer'] == -2 || $row['observer'] == -1)
                {
                    $observer_array = mysql_fetch_array(mysql_query("SELECT * FROM members WHERE id = $row[observer] LIMIT 1"));
                    $observer = substr($observer_array['first_name'], 0, 1).". ".$observer_array['last_name'];
                    if($observer_array['id'] < 0)
                        $observer = $observer_array['last_name'];
                    if($observer_array['email'] != "") $observeremail = "href=\"mailto:".$observer_array['email']."\"";
                    if($observer_array['id'] == $_SESSION['id'] && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) <= mktime(18, 00, 00, $m , $d-2, $y))
                    {
                        $sig = sha1($row['id']."observer".$_SESSION['id']."cfa7kBwsjV9DrE0gxGnPXlRq1");
                        $clear4 = "<form name=\"clearcrew\" action=\"\" method=\"post\" style=\"position:relative;top:5px;display:inline;\"><input type=\"hidden\" name=\"crewid\" value=\"$row[id]\" /><input type=\"hidden\" name=\"position\" value=\"observer\" /><input type=\"hidden\" name=\"signature\" value=\"$sig\" /><input type=\"hidden\" name=\"clearcrew\" value=\"clearcrew\" /><input type=\"image\" name=\"clearcrew\" src=\"images/clearcrew.png\" style=\"margin-top:-5px;display:inline;\" /></form>";
                    }
                }
                else if(isset($_SESSION['id']) && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) <= mktime(23, 59, 59, $m , $d, $y))
                {
                    if($member['dutysup'] == 1 || $member['ees'] == 1 || $member['cctrainer'] == 1 || $member['drivertrainer'] == 1 || $member['firstresponsecc'] == 1 || $member['crewchief'] == 1 || $member['driver'] == 1 || $member['backupcc'] == 1 || $member['backupdriver'] == 1 || $onthisweek == 0 || ($onthisweek == 1 && mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('Y')) >= mktime(16, 00, 00, $m , $d, $y)) && $ontoday[$i] == 0)
                    {
                        if($ontoday[$i] == 0 && ($member['attendant'] == 0 || $atton[$i] == 1))
                        {
                            //if($ontoday[$i] == 0 && ($member['attendant'] == 0 || ($atton[$i] == 1 && expirationValid("cpr", $member['id']) == 1)))
                            $sig = sha1($row['id'].'observer'.$_SESSION['id'].'cfa7kBwsjV9DrE0gxGnPXlRq1');
                            $observer = "<form name=\"confirmcrew\" action=\"\" method=\"post\" style=\"margin-bottom:0;\"><input type=\"hidden\" name=\"crewid\" value=\"$row[id]\" /><input type=\"hidden\" name=\"position\" value=\"observer\" /><input type=\"hidden\" name=\"signature\" value=\"$sig\" /><input type=\"submit\" name=\"confirmcrew\" value=\"Sign Up\" /></form>";
                        }
                        else
                            $observer = "&nbsp;";
                    }
                    else
                        $observer = "&nbsp;";
                }
                else $observer = "&nbsp;";
                $f1 = '<img src="/images/ravens.png" />';
                $f2 = '<img src="/images/49ers.png" />';
                $turkey = '<img src="/images/turkey.png" width="25" height="21" style="position:relative;top:3px;" />';
                echo
                '<tr>
					<td align="center" height="28"><a class="dayheader">';
                if($m == 02 && $d == 03 && $y == 2013)
                    echo $f1."&nbsp;";
                echo $day;
                if($m == 02 && $d == 03 && $y == 2013)
                    echo "&nbsp;".$f2;
                if($m == 11 && $d == 28 && $y == 2013)
                    echo "&nbsp;".$turkey;
                echo '</a></td>
					<td align="center" height="28"><a class="dateheader">'.$m.'/'.$d.'/'.substr($y, 2, 2).'</a></td>
					<td align="center" height="28"><a '.$ccemail.' class="crew_name">'.stripslashes($cc).'</a>'.$clear1.'</td>
					<td align="center" height="28"><a '.$driveremail.' class="crew_name">'.stripslashes($driver).'</a>'.$clear2.'</td>
					<td align="center" height="28"><a '.$attendantemail.' class="crew_name">'.stripslashes($attendant).'</a>'.$clear3.'</td>
					<td align="center" height="28"><a '.$observeremail.' class="crew_name">'.stripslashes($observer).'</a>'.$clear4.'</td>
				</tr>';
            }
            ?>
        </table>
        <? if($tableloop == 0) echo "<br />"; ?>
    <? } ?>

</center>