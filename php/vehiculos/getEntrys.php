<?php
require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../conexion.php';

use React\EventLoop\Factory;
use React\MySQL\Factory as MySQLFactory;

$host = $db_host;
$user = $db_usuario;
$password = $db_contrasena;
$dbname = 'serviaves';

$loop = Factory::create();
$mysql = (new MySQLFactory($loop))->createLazyConnection("{$user}:{$password}@{$host}/{$dbname}");

$fecha = isset($_POST['fecha']) && !empty($_POST['fecha']) ? $_POST['fecha'] : null;
if (!$fecha) {
    echo json_encode(['error' => 'Fecha no proporcionada']);
    exit;
}

$query = "
    SELECT 
        entrada.VHP_CODCON as id,
        entrada.VHP_PLACA,
        cond.CDT_NOMBRE as conductor_nombre
    FROM dpvehiculospesaje as entrada
    LEFT JOIN dpvehiculospesaje as salida 
        ON entrada.VHP_CODCON = salida.VHP_CODCON 
        AND salida.VHP_NUMASO = 'Finalizado'
        AND salida.VHP_FECHA >= entrada.VHP_FECHA
    LEFT JOIN dpconductores as cond 
        ON entrada.VHP_CODINV = cond.CDT_CI_RIF
    WHERE entrada.VHP_FECHA = '$fecha'
      AND salida.VHP_NUMASO = 'Finalizado'
    GROUP BY entrada.VHP_CODCON
    ORDER BY entrada.VHP_FECHA ASC;
";

$mysql->query($query)->then(
    function (\React\MySQL\QueryResult $result) use ($loop) {
        if (empty($result->resultRows)) {
            echo json_encode(['error' => 'No se encontraron datos para la fecha proporcionada']);
        } else {
            echo json_encode($result->resultRows);
        }
        $loop->stop();
    },
    function (Exception $error) use ($loop) {
        echo json_encode(['error' => $error->getMessage()]);
        $loop->stop();
    }
);

$loop->run();
