<?
	if($_GET['module'] != "")
		$color = "#000;";
	else
		$color = "#fff;";
?>
<span style="text-align:left;color:<? echo $color; ?>;">
<h1>Not Found</h1>
<p>The requested URL <? echo $_SERVER['REQUEST_URI']; ?> was not found on this server.</p>
<p>Additionally, a 404 Not Found
error was encountered while trying to use an ErrorDocument to handle the request.</p>
<hr>
<address>Apache Server at rpiambulance.com Port 80</address>
</span>