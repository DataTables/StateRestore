<?php

session_start();

if(isset($_POST) && isset($_POST['stateRestore']) && isset($_POST['action'])) {
    $keys = array_keys($_POST['stateRestore']);
    if($_POST['action'] === 'rename') {
        foreach($keys as $key) {
            $tempState = $_SESSION['stateRestore'][$key];
            $_SESSION['stateRestore'][$_POST['stateRestore'][$key]] = $tempState;
            unset($_SESSION['stateRestore'][$key]);
        }
    }
    else if($_POST['action'] === 'save') {
        foreach($keys as $key) {
            $_SESSION['stateRestore'][$key] = $_POST['stateRestore'][$key];
        }
    }
    else if($_POST['action'] === 'remove') {
        foreach($keys as $key) {
            unset($_SESSION['stateRestore'][$key]);
        }
    }
}