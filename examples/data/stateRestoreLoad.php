<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');


session_start();

$data = file_get_contents('2500.txt');
$json = json_decode($data, true);
if(isset($_SESSION['stateRestore'])) {
    $json['stateRestore'] = $_SESSION['stateRestore'];
}

echo json_encode($json);