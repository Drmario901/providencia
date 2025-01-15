<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    
    require 'global.php';
    
    session_start();
    session_unset();
    session_write_close();

    header("Location: ../index.php");


?>