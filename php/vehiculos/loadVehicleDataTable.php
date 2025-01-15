<?php
 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
 header("Access-Control-Allow-Headers: Content-Type, Authorization");
//MAIN QUERY
/* SELECT 
            entrada.VHP_CODCON AS id, 
            entrada.VHP_FECHA, 
            entrada.VHP_PLACA, 
            entrada.VHP_HORA AS hora_entrada, 
            salida.VHP_HORA AS hora_salida, 
            COALESCE(salida.VHP_NUMASO, entrada.VHP_NUMASO) AS estatus, 
            entrada.VHP_PC AS caso,
            COALESCE(entrada_pendiente.VHP_PESO, entrada.VHP_PESO) AS peso_bruto, 
            salida.VHP_PESO AS peso_salida,
            (COALESCE(entrada_pendiente.VHP_PESO, entrada.VHP_PESO) - COALESCE(salida.VHP_PESO, 0)) AS peso_neto,
            (SELECT GROUP_CONCAT(DISTINCT inv.INV_CODIGO ORDER BY inv.INV_DESCRI SEPARATOR ', ') 
             FROM dpinv inv 
             INNER JOIN dpmovinv dom ON inv.INV_CODIGO = dom.MOV_CODIGO 
             WHERE dom.MOV_DOCUME = entrada.VHP_CODCON
            ) AS codigo_productos,
            (SELECT GROUP_CONCAT(DISTINCT inv.INV_DESCRI ORDER BY inv.INV_DESCRI SEPARATOR ', ') 
             FROM dpinv inv 
             INNER JOIN dpmovinv dom ON inv.INV_CODIGO = dom.MOV_CODIGO 
             WHERE dom.MOV_DOCUME = entrada.VHP_CODCON
            ) AS productos,
            cond.CDT_NOMBRE AS conductor_nombre
        FROM 
            dpvehiculospesaje entrada
        LEFT JOIN 
            dpvehiculospesaje salida ON entrada.VHP_CODCON = salida.VHP_CODCON 
            AND salida.VHP_NUMASO = 'Finalizado'
            AND entrada.VHP_FECHA = salida.VHP_FECHA
        LEFT JOIN 
            dpvehiculospesaje entrada_pendiente ON entrada.VHP_CODCON = entrada_pendiente.VHP_CODCON 
            AND entrada_pendiente.VHP_NUMASO = 'Pendiente'
            AND entrada.VHP_FECHA = entrada_pendiente.VHP_FECHA
        LEFT JOIN 
            dpconductores cond ON entrada.VHP_CODINV = cond.CDT_CI_RIF*/
?>

<?php
require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../conexion.php';

use React\EventLoop\Factory;
use React\MySQL\Factory as MySQLFactory;

$host = $db_host;
$user = $db_usuario;
$password = rawurlencode($db_contrasena);
$dbname = 'serviaves';
$puerto = $port;

$loop = Factory::create();
// $mysql = (new MySQLFactory($loop))->createLazyConnection("{$user}:{$password}@{$host}/{$dbname}");
$mysql = (new MySQLFactory($loop))->createLazyConnection("{$user}:{$password}@{$host}:{$puerto}/{$dbname}");

$fecha = isset($_POST['fecha']) && !empty($_POST['fecha']) ? $_POST['fecha'] : null;
$fecha_inicio = isset($_POST['startDate']) && !empty($_POST['startDate']) ? $_POST['startDate'] : null;
$fecha_fin = isset($_POST['endDate']) && !empty($_POST['endDate']) ? $_POST['endDate'] : null;

$query = "
    SELECT 
        entrada.VHP_CODCON as id,
        entrada.VHP_FECHA as fecha_entrada,
        entrada.VHP_PLACA,
        entrada.VHP_HORA as hora_entrada,
        MAX(salida.VHP_FECHA) as fecha_salida,
        MAX(salida.VHP_HORA) as hora_salida,
        CASE 
            WHEN MAX(salida.VHP_NUMASO) = 'Finalizado' THEN 'Finalizado'
            ELSE 'Pendiente'
        END as estatus,
        entrada.VHP_PC as caso,
        entrada.VHP_PESO as peso_bruto,
        COALESCE(MAX(salida.VHP_PESO), 0) as peso_salida,
        (entrada.VHP_PESO - COALESCE(MAX(salida.VHP_PESO), 0)) as peso_neto,
        (SELECT GROUP_CONCAT(DISTINCT inv.INV_CODIGO ORDER BY inv.INV_DESCRI SEPARATOR ', ') 
         FROM dpinv inv 
         INNER JOIN dpmovinv dom ON inv.INV_CODIGO = dom.MOV_CODIGO 
         WHERE dom.MOV_CODCOM = entrada.VHP_CODCON) as codigo_productos,
        (SELECT GROUP_CONCAT(DISTINCT inv.INV_DESCRI ORDER BY inv.INV_DESCRI SEPARATOR ', ') 
         FROM dpinv inv 
         INNER JOIN dpmovinv dom ON inv.INV_CODIGO = dom.MOV_CODIGO 
         WHERE dom.MOV_CODCOM = entrada.VHP_CODCON) as productos,
        (SELECT GROUP_CONCAT(DISTINCT inv.INV_DESCRI ORDER BY inv.INV_DESCRI SEPARATOR ', ')
         FROM dpinv inv
         INNER JOIN dpmovinv dom ON inv.INV_CODIGO = dom.MOV_CODIGO
         WHERE dom.MOV_CODCOM = entrada.VHP_CODCON
           AND dom.MOV_TIPDOC IN ('NEN', 'NPT')) as producto_despachado,
        cond.CDT_NOMBRE as conductor_nombre
    FROM dpvehiculospesaje as entrada
    LEFT JOIN dpvehiculospesaje as salida 
        ON entrada.VHP_CODCON = salida.VHP_CODCON 
        AND salida.VHP_NUMASO = 'Finalizado'
        AND salida.VHP_FECHA >= entrada.VHP_FECHA
    LEFT JOIN dpconductores as cond 
        ON entrada.VHP_CODINV = cond.CDT_CI_RIF
    WHERE entrada.VHP_HORA = (
        SELECT MIN(sub_entrada.VHP_HORA)
        FROM dpvehiculospesaje as sub_entrada
        WHERE sub_entrada.VHP_CODCON = entrada.VHP_CODCON
          AND sub_entrada.VHP_FECHA = entrada.VHP_FECHA
    )
";

if ($fecha) {
    $query .= " AND (entrada.VHP_FECHA = '$fecha' OR salida.VHP_FECHA = '$fecha')";
} elseif ($fecha_inicio && $fecha_fin) {
    $query .= " AND (entrada.VHP_FECHA BETWEEN '$fecha_inicio' AND '$fecha_fin'
                OR salida.VHP_FECHA BETWEEN '$fecha_inicio' AND '$fecha_fin')";
}

$query .= " GROUP BY entrada.VHP_CODCON
             ORDER BY entrada.VHP_FECHA ASC;";

$mysql->query($query)->then(
    function (\React\MySQL\QueryResult $result) use ($loop) {
        $registros = [];

        foreach ($result->resultRows as $row) {
            switch ($row['caso']) {
                case '0':
                    $productoIngresado = explode(', ', $row['productos'])[0] ?? null;
                    break;
                case '1':
                    $productoIngresado = $row['productos'];
                    break;
                case '2':
                    $productoIngresado = '';
                    break;
                default:
                    $productoIngresado = '';
                    break;
            }

            $row['producto_ingresado'] = $productoIngresado;
            $registros[] = $row;
        }

        echo json_encode($registros);
        $loop->stop();
    },
    function (Exception $error) use ($loop) {
        echo "Error: " . $error->getMessage() . PHP_EOL;
        $loop->stop();
    }
);

$loop->run();
?>





