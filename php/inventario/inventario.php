<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php'; 

$bd = "serviaves_web";
mysqli_select_db($conexion, $bd);

function convertirNumIngEspDos($numero)
{
    $numero_formateado = number_format($numero, 2, ',', '.');
    
    return $numero_formateado;
};

function convertirNumIngEspCuatro($numero)
{
    return number_format($numero, 4, ',', '.');
}

function convertirFechaIngEsp($fechaHora)
{
    return date('d/m/Y', strtotime($fechaHora));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $caso = $_POST["caso"];
    $fecha = $_POST["fecha"];
    $busqueda = isset($_POST["busqueda"]) ? $_POST["busqueda"] : '';
    $almacenFil = isset($_POST["almacen"]) ? $_POST["almacen"] : '';
    $codigoProd = isset($_POST["codigoProd"]) ? $_POST["codigoProd"] : '';
    $lote = isset($_POST["lote"]) ? $_POST["lote"] : '';
    $codigo = isset($_POST["codigo"]) ? $_POST["codigo"] : '';

    $validar = 0;
    $tabla = '';
    $response = [];

    if ($caso == 1) {
        $sql = "SELECT mov_codalm AS almacen, alm_descri AS tipomateria, mov_codigo AS codigo, inv_descri AS descripcion, mov_undmed AS unidadmedida, SUM(mov_cantid*mov_fisico*mov_cxund) AS cantidad 
                FROM dpmovinv
                INNER JOIN dpinv ON inv_codigo = mov_codigo
                INNER JOIN dpalmacen ON alm_codigo = mov_codalm
                WHERE mov_invact = 1
                AND mov_fisico <> 0
                AND mov_fecha BETWEEN '2024-03-01' AND '$fecha'
                AND mov_codalm >= '201'
                AND mov_codalm <> '207'";

        if ($almacenFil) {
            $sql .= " AND mov_codalm = '$almacenFil'";
        }

        if ($busqueda) {
            $sql .= " AND (inv_descri LIKE '%$busqueda%' OR mov_codigo LIKE '%$busqueda%' OR mov_codalm LIKE '%$busqueda%')";
        }

        $sql .= " GROUP BY mov_codalm, mov_codigo, inv_descri";

        $result = mysqli_query($conexion, $sql);

        if ($result) {
            $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
            foreach ($rows as &$row) {
                $row['tipomateria'] = str_replace("AVIPROCA", "", $row['tipomateria']);
                $row['cantidad'] = convertirNumIngEspCuatro($row['cantidad']);
            }
            $validar = 1;
            $response = ["validar" => $validar, "data" => $rows];
        } else {
            $response = ["error" => mysqli_error($conexion)];
        }
    }

    if ($caso == 2) {
        $codigoProd = $_POST["codigoProd"];
        $fecha = $_POST["fecha"];
        $validar = 0;
        $data = [];
    
        $sql = "SELECT mov_fecha AS fecha, mov_codalm AS almacen, alm_descri AS tipomateria, mov_codigo AS codigo, inv_descri AS descripcion, mov_lote AS lote, mov_undmed AS unidadmedida, SUM(mov_cantid*mov_fisico*mov_cxund) AS cantidad 
                FROM dpmovinv
                INNER JOIN dpinv ON inv_codigo=mov_codigo
                INNER JOIN dpalmacen ON alm_codigo=mov_codalm
                WHERE mov_invact=1
                AND mov_fisico<>0
                AND mov_fecha BETWEEN '2024-03-01' AND '$fecha'
                AND mov_codalm>='201'
                AND mov_codalm<>'207'
                AND mov_codigo = '$codigoProd'
                GROUP BY mov_codalm, mov_codigo, inv_descri, mov_lote";
    
        $result = $conexion->query($sql);
    
        foreach ($result as $dato) {
            $validar = 1;
            $data[] = [
                'fecha' => date('d/m/Y', strtotime($dato["fecha"])),
                'almacen' => $dato["almacen"],
                'tipomateria' => str_replace("AVIPROCA", "", $dato["tipomateria"]),
                'codigo' => $dato["codigo"],
                'descripcion' => $dato["descripcion"],
                'lote' => $dato["lote"],
                'unidadmedida' => $dato["unidadmedida"],
                'cantidad' => number_format($dato["cantidad"], 2, ',', '.')
            ];
        }
    
        echo json_encode(['validar' => $validar, 'data' => $data]);
        exit; 
    }
    
    if ($caso == 3) {
        $codigo = $_POST["codigo"];
        $fecha = $_POST["fecha"];
    
        $fecha = date('Y-m-d', strtotime($fecha));
    
        $validar = 0;
        $data = [];
        $totalEntradas = 0;
        $totalSalidas = 0;
    
        $sql = "SELECT 
                    mov_fecha AS fecha, 
                    mov_codalm AS almacen, 
                    alm_descri AS tipomateria, 
                    mov_codigo AS codigo, 
                    inv_descri AS descripcion, 
                    mov_lote AS lote, 
                    mov_undmed AS unidadmedida, 
                    mov_cantid * mov_fisico * mov_cxund AS cantidad, 
                    mov_fisico AS fisico
                FROM dpmovinv
                INNER JOIN dpinv ON inv_codigo = mov_codigo
                INNER JOIN dpalmacen ON alm_codigo = mov_codalm
                WHERE mov_invact = 1
                AND mov_fisico <> 0
                AND mov_fecha BETWEEN '2024-03-01' AND '$fecha'
                AND mov_codalm >= '201'
                AND mov_codalm <> '207'
                AND mov_codigo = '$codigo'";
    
        $result = $conexion->query($sql);
        foreach ($result as $dato) {
            $validar = 1;
            $entrada = 0;
            $salida = 0;
    
            $fechaFormateada = date('d/m/Y', strtotime($dato["fecha"]));
            $cantidad = $dato["cantidad"];
            $fisico = $dato["fisico"];
    
            if ($fisico == '1') {
                $entrada = $cantidad;
            }
            if ($fisico == '-1') {
                $salida = $cantidad * -1;
            }
    
            $data[] = [
                'fecha' => $fechaFormateada,
                'lote' => $dato["lote"],
                'codigo' => $dato["codigo"],
                'entradas' => number_format($entrada, 2, ',', '.'),
                'salidas' => number_format($salida, 2, ',', '.')
            ];
    
            $totalEntradas += $entrada;
            $totalSalidas += $salida;
        }
    
        $totalEntradaFormato = number_format($totalEntradas, 2, ',', '.');
        $totalSalidaFormato = number_format($totalSalidas, 2, ',', '.');
    
        echo json_encode([
            'validar' => $validar,
            'data' => $data,
            'totalEntradas' => $totalEntradaFormato,
            'totalSalidas' => $totalSalidaFormato
        ]);
        exit;
    }
    
    

    if ($caso == 4) {
        $codigo = $_POST["codigo"];
        $lote = $_POST["lote"];
        $fecha = $_POST["fecha"];

        $validar = 0;
        $totalEntradas = 0;
        $totalSalidas = 0;
        $data = [];

        $sql = "SELECT mov_fecha AS fecha, mov_codalm AS almacen, alm_descri AS tipomateria, mov_codigo AS codigo, 
                       inv_descri AS descripcion, mov_lote AS lote, mov_undmed AS unidadmedida, 
                       mov_cantid * mov_fisico * mov_cxund AS cantidad, mov_fisico AS fisico
                FROM dpmovinv
                INNER JOIN dpinv ON inv_codigo = mov_codigo
                INNER JOIN dpalmacen ON alm_codigo = mov_codalm
                WHERE mov_invact = 1
                AND mov_fisico <> 0
                AND mov_fecha BETWEEN '2024-03-01' AND '$fecha'
                AND mov_codalm >= '201'
                AND mov_codalm <> '207'
                AND mov_codigo = '$codigo'
                AND mov_lote = '$lote'";

        foreach ($conexion->query($sql) as $dato) {
            $validar = 1;
            $entrada = 0;
            $salida = 0;

            $fecha = convertirFechaIngEsp($dato["fecha"]);
            $almacen = $dato["almacen"];
            $tipomateria = str_replace("AVIPROCA", "", $dato["tipomateria"]);
            $codigo = $dato["codigo"];
            $descripcion = $dato["descripcion"];
            $unidadmedida = $dato["unidadmedida"];
            $cantidad = $dato["cantidad"];
            $lote = $dato["lote"];
            $fisico = $dato["fisico"];

            if ($fisico == '1') {
                $entrada = $cantidad;
            } elseif ($fisico == '-1') {
                $salida = $cantidad * -1;
            }

            $entradaFormato = convertirNumIngEspDos($entrada);
            $salidaFormato = convertirNumIngEspDos($salida);

            $data[] = [
                "fecha" => $fecha,
                "lote" => $lote,
                "codigo" => $codigo,
                "entradas" => $entradaFormato,
                "salidas" => $salidaFormato
            ];

            $totalEntradas += $entrada;
            $totalSalidas += $salida;
        }

        $totalEntradaFormato = convertirNumIngEspDos($totalEntradas);
        $totalSalidaFormato = convertirNumIngEspDos($totalSalidas);

        $response = [
            "validar" => $validar,
            "data" => $data,
            "totalEntradas" => $totalEntradaFormato,
            "totalSalidas" => $totalSalidaFormato
        ];

        echo json_encode($response);
        exit;
    }
    

    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(["error" => "NO DATA"]);
}

mysqli_close($conexion);
?>
