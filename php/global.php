<?php
    session_start();
    date_default_timezone_set('America/Caracas');

    // variables globales y cosas para que no se joda todo cuando se pase al server de la uba

    // // Base de datos
    // $db_host = "localhost";
    // $db_usuario = "root";
    // $db_contrasena = "";
    // $base_datos = "providencia";

    // Direccion del host
    $host = $_SERVER['HTTP_HOST'];

    $wb_subdir = 'providencia';


    /* Niveles de acceso */
    $nivel_acceso_admin = '60';
    
    /**
     * Importa un script partiendo de la carpeta '/src/js/'
     * @param $dir La dirección del archivo js. Por ejemplo, si vale 'script.js', apunta hacia '/src/js/script.js'
     */
    function require_js(string $dir){
        global $wb_subdir;
        echo "<script type='text/javascript' src='/$wb_subdir/src/js/$dir'></script>";
    }
    /**
     * Importa una hoja de estilos partiendo de la carpeta '/src/css/'
     * @param $dir La dirección del archivo css. Por ejemplo, si vale 'script.css', apunta hacia '/src/js/script.css'
     */
    function require_css(string $dir){
        global $wb_subdir;
        echo "<link rel='stylesheet' href='/$wb_subdir/src/css/$dir'>";
    }

    function require_css_cdn(string $cdn_css_url){
        echo "<link rel='stylesheet' href='$cdn_css_url'>";
    }
    /**
     * Importa un script partiendo de la carpeta '/src/_lib/'
     * @param $dir La dirección del archivo js. Por ejemplo, si vale 'bootstrap/js/bootstrap.js', apunta hacia '/src/_lib/bootstrap/js/bootstrap.js'
     */
    function require_lib_js(string $dir){
        global $wb_subdir;
        echo "<script type='text/javascript' src='/$wb_subdir/src/js/_lib/$dir'></script>";
    }
    //SCRIPT POR CDN
    function require_lib_cdn(string $cdn_url){
        echo "<script type='text/javascript' src='$cdn_url'></script>";
    }
    /**
     * Importa una hoja de estilos partiendo de la carpeta '/src/_lib/'
     * @param $dir La dirección del archivo css. Por ejemplo, si vale 'bootstrap/js/bootstrap.css', apunta hacia '/src/_lib/bootstrap/js/bootstrap.css'
     */
    function require_lib_css(string $dir){
        global $wb_subdir;
        echo "<link rel='stylesheet' href='/$wb_subdir/src/_lib/$dir'>";
    }

    class ExcepcionDeSesion extends Exception {}

    /**
     * Verifica el tipo de perfil para saber si puede acceder o no al sitio.
     * En caso de estar restringido, muestra la página de alerta de acceso denegado.
     * 
     * @param $acceso: Un array con el número de acceso que corresponde a el(los) rol(es) permitido(s).
     */
    function acceso_requerido(array $acceso){
        try {
            if (!isset($_SESSION['CUENTA_ID'])){
                throw new ExcepcionDeSesion("No se encontró ninguna sesión iniciada", 1);
            }
            if(!in_array($_SESSION['acceso'], $acceso)){
                throw new ExcepcionDeSesion("Nivel de acceso insuficiente para entrar a esta área", 1);
            }
        }
        catch (ExcepcionDeSesion $th) {
            $exc_session_error = $th->getMessage();
            require __DIR__.'/../templates/accounts/acceso_denegado.php';
            exit();
        }
    }

    /**
     * Verifica el tipo de perfil para saber si se puede ejecutar o no el archivo.
     * En caso de estar restringido, lanza un error 500 deteniendo la ejecución actual.
     * 
     * @param $acceso: Un array con el número de acceso que corresponde a el(los) rol(es) permitido(s).
     */
    function acceso_requerido_ajax(array $acceso){
        if (!isset($_SESSION['CUENTA_ID'])){
            throw new ExcepcionDeSesion('No tienes acceso a este archivo', 500);
        }
        if(!in_array($_SESSION['acceso'], $acceso)){
            throw new ExcepcionDeSesion('No tienes acceso a este archivo', 500);
        }
    }

    // obtiene la información del navegador y sistema operativo del cliente
    function getBrowser() { 
        $u_agent = $_SERVER['HTTP_USER_AGENT'];
        $bname = 'Unknown';
        $platform = 'Unknown';
        $version= "";
      
        //First get the platform?
        if (preg_match('/linux/i', $u_agent)) {
            $platform = 'Linux';
        }elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
            $platform = 'macOS';
        }elseif (preg_match('/windows|win32/i', $u_agent)) {
            $platform = 'Windows';
        }
      
        // Next get the name of the useragent yes seperately and for good reason
        if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent)){
            $bname = 'Internet Explorer';
            $ub = "MSIE";
        }elseif(preg_match('/Firefox/i',$u_agent)){
            $bname = 'Mozilla Firefox';
            $ub = "Firefox";
        }elseif(preg_match('/OPR/i',$u_agent)){
            $bname = 'Opera/Opera GX';
            $ub = "OPR";
        }elseif(preg_match('/Edg/i',$u_agent)){
            $bname = 'Microsoft Edge';
            $ub = "Edg";
        }elseif(preg_match('/Chrome/i',$u_agent) && !preg_match('/Edge/i',$u_agent)){
            $bname = 'Google Chrome';
            $ub = "Chrome";
        }elseif(preg_match('/Safari/i',$u_agent) && !preg_match('/Edge/i',$u_agent)){
            $bname = 'Apple Safari';
            $ub = "Safari";
        }elseif(preg_match('/Netscape/i',$u_agent)){
            $bname = 'Netscape';
            $ub = "Netscape";
        }elseif(preg_match('/Edge/i',$u_agent)){
            $bname = 'Microsoft Edge';
            $ub = "Edge";
        }elseif(preg_match('/Trident/i',$u_agent)){
            $bname = 'Internet Explorer';
            $ub = "MSIE";
        }
      
        // finally get the correct version number
        $known = array('Version', $ub, 'other');
        $pattern = '#(?<browser>' . join('|', $known) .
      ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
        if (!preg_match_all($pattern, $u_agent, $matches)) {
          // we have no matching number just continue
        }
        // see how many we have
        $i = count($matches['browser']);
        if($i > 0){
            if ($i != 1) {
              //we will have two since we are not using 'other' argument yet
              //see if version is before or after the name
              if (strripos($u_agent,"Version") < strripos($u_agent,$ub)){
                  $version= $matches['version'][0];
              }else {
                  $version= $matches['version'][1];
              }
            }else {
              $version= $matches['version'][0];
            }
        }
      
        // check if we have a number
        if ($version==null || $version=="") {$version="?";}
      
        return array(
          'name'      => $bname,
          'version'   => $version,
          'platform'  => $platform
        );
    }
    function getPublicIP() {
        // create & initialize a curl session
        $curl = curl_init();
      
        // set our url with curl_setopt()
        curl_setopt($curl, CURLOPT_URL, "http://httpbin.org/ip");
      
        // return the transfer as a string, also with setopt()
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
      
        // curl_exec() executes the started curl session
        // $output contains the output string
        if($output = curl_exec($curl)){
            // close curl resource to free up system resources
            // (deletes the variable made by curl_init)
            curl_close($curl);
          
            $ip = json_decode($output, true);
          
            return $ip['origin'];
        }
        else {
            return '';
        }
      
    }

    /**
     * Genera un registro de auditoría al colocar en el tope de la plantilla o archivo deseado
     * 
     * @param $msg: Información relevante que se colocará el registro.
     */
    function registrar_accion(string $msg = ''){
        require_once __DIR__.'/conexion.php';
        $id_usuario = $_SESSION['CUENTA_ID'];
                
        // obtiene navegador y SO
        $ua = getBrowser();
        $navegador = $ua['name'].' v'.$ua['version'];
        $os = $ua['platform'];
        $ip = getPublicIP();

        // optiene IP (pendiente)
        
        // registra en la base de datos
        $query = "INSERT INTO usuarios_accesos (id_usuario, navegador, sistema_operativo, tipo, ip)
                    VALUES ('$id_usuario', '$navegador', '$os', '$msg', '$ip')";
        if (!isset($conexion)){
            global $conexion;
        }
        $conexion->query($query);
    }

    function tiempoTranscurridoStr($time){
        $time = time() - strtotime($time);

        $time = ($time<1)? 1 : $time;
        $tokens = array (
            31536000 => 'año',
            2592000 => 'mes',
            604800 => 'semana',
            86400 => 'día',
            3600 => 'hora',
            60 => 'minuto',
            1 => 'segundo'
        );

        foreach ($tokens as $unit => $text) {
            if ($time < $unit) continue;
            $numberOfUnits = floor($time / $unit);
            return $numberOfUnits.' '.$text.(($numberOfUnits>1)? $tokens[$unit] == 'mes'? 'es' : 's' : '');
        }
    }

    //$favicon = '<link rel="icon" type="image/x-icon" href="'.$wb_subdir'/images/favicon.ico">';

    $colores_paleta = array(
        "amarillo" => "#FFFF00",
        "azul" => "#0000FF",
        "blanco" => "#FFFFFF",
        "cian" => "#00FFFF",
        "dorado" => "#FFD700",
        "gris" => "#808080",
        "marrón" => "#A52A2A",
        "magenta" => "#FF00FF",
        "morado" => "#800080",
        "naranja" => "#FFA500",
        "negro" => "#000000",
        "plateado" => "#C0C0C0",
        "rosa" => "#FFC0CB",
        "rojo" => "#FF0000",
        "verde" => "#008000"
    );

    //ENCRYPT AND UNENCRYPT DATA FROM USERS
    
    function encript($cText, $lEncrip) {
        $cNew = "";
        $nIni = 99;
        $nLen = mb_strlen($cText, 'utf-8');
        if (empty($cText)) {
            return $cText;
        }
        $cText = trim($cText);
        // Desencriptar
        for ($i = mb_strlen($cText, 'utf-8') - 1; $i >= 0; $i--) {
            $c = mb_substr($cText, $i, 1, 'utf-8');
    
            $n = 0;
            
            if ($lEncrip){
    
                $c = mb_ord($c, 'utf-8') + $nIni;
    
            } else {
                switch ($c) {
                    case '“':
                        $c = 48;
                        break;
                    case '”':
                        $c = 49;
                        break;
                    case '•':
                        $c = 50;
                        break;
                    case '–':
                        $c = 51;
                        break;
                    case '—':
                        $c = 52;
                        break;
                    case '˜':
                        $c = 53;
                        break;
                    case '™':
                        $c = 54;
                        break;
                    case 'š':
                        $c = 55;
                        break;
                    case '›':
                        $c = 56;
                        break;
                    case 'œ':
                        $c = 57;
                        break;
                    case 'Ž':
                        $c = 43;
                        break;
                    default:
                        $c = mb_ord($c, 'utf-8') - $nIni;
                        break;
                }
            }
            
            $cNew .= '&#' . $c . ';';
            $cNew = html_entity_decode($cNew);
            // Utilizamos la secuencia de escape para representar el caracter
        }
        if (!$lEncrip) {
            //$cNew = str_pad($cNew, $nLen, " ", 'utf-8');
        }
        
        return $cNew;
    }

?>