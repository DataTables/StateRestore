<?php

session_start();

echo json_encode($_POST);
if(isset($_POST)) {
    if(isset($_POST['stateRestore'])) {
        $_SESSION['stateRestore'] = $_POST['stateRestore'];
    }
    else {
        $_SESSION['stateRestore'] = [];
    }
}