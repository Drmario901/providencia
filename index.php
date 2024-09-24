<?php
    require 'php/global.php';

    $cuenta_id = isset($_SESSION['CUENTA_ID']) ? $_SESSION['CUENTA_ID'] : false;
    $acceso = isset($_SESSION['acceso']) ? $_SESSION['acceso'] : false;

    if ($cuenta_id) {
        switch ($acceso) {
            case $nivel_acceso_admin:
                header("Location: dashboard");
                break;
        }
    }
    else {
        header("Location: acceder");
    }


?>