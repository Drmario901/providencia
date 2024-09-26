<?php
    require 'global.php';
    
    session_start();
    session_unset();
    session_write_close();

    header("Location: ../index.php");


?>