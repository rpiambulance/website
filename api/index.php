<?php
/**
 * This file serves as the entry point for all PHP-related connections by the
 * RPI Ambulance website.
 *
 * All requests should be structured as follows:
 * 		/api/[index.php]?route=[route][&api_parameters]
 */

/** GET REQUEST DETAILS ***********************/
$getData = $_GET;
parse_str(file_get_contents("php://input"), $postData);
/**********************************************/

/** DB INCLUSION ******************************/
if(!file_exists("./config/db.php")) {
    exitWithError(501, 'Not Implemeneted', 'Looks like the necessary database configuration file was not setup by the site administrator!');
}

require_once "./config/db.php";

if(!isset($dsn) || !isset($dname)|| !isset($dpassword)) {
    exitWithError(501, 'Not Implemeneted', 'Looks like the necessary database connection information was not included by the site administrator!');
}
/**********************************************/

/** HELPER FUNCTIONS **************************/
function exitWithError ($code, $message, $displayMessage="") {
    header($message, true, $code);
    if($displayMessage != "") {
        echo $displayMessage;
    } else {
        echo $message;
    }
    exit;
}

function connectDB () {
    require "./config/db.php";

    $connection = new PDO($dsn, $duser, $dpassword);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if(!isset($dname)) {
      $dname = 'ambulanc_web';
    }

    $connection->exec("USE `$dname`");

    return $connection;
}
/**********************************************/


/** ROUTE INCLUSION ***************************/
if(!isset($getData['route']) || !ctype_alnum($getData['route'])) {
    exitWithError(400, 'Bad Request');
}

$route = "./routes/" . $getData['route'] . ".php";

if(!file_exists($route)) {
    exitWithError(404, 'Not Found');
}

require_once $route;

if(!function_exists('route')) {
    exitWithError(404, 'Not Found');
}
/**********************************************/

$result = route($getData, $postData);
echo json_encode($result);

?>
