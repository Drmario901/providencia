<?php
require __DIR__ . '/../conexion.php'; 
$bd = "serviaves_web";
mysqli_select_db($conexion, $bd);

date_default_timezone_set('America/Caracas');

$id_entrada = $_POST['id_entrada'] ?? NULL;
$silo = $_POST['silo'] ?? NULL;
$destino = $_POST['destino'] ?? NULL;
$fecha_seleccionada = $_POST['fecha'] ?? date('Y-m-d'); 

if ($id_entrada) {
    $query = "SELECT conductor, cedula, placa, producto_ingresado, peso_tara, peso_bruto, nota 
              FROM vehiculos 
              WHERE id = ? AND estatus = 'Finalizado'";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $id_entrada);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $chofer = $row['conductor'];
        $cedula = $row['cedula'];
        $placa = $row['placa'];
        $producto = $row['producto_ingresado'];
        $peso_tara = $row['peso_tara'];
        $peso_bruto = $row['peso_bruto'];
        $peso_neto = round($peso_bruto - $peso_tara, 2);
        $nota = $row['nota'];

        $response = [
            'chofer' => $chofer,
            'cedula' => $cedula,
            'nota' => $nota,
            'placa' => $placa,
            'producto' => $producto,
            'peso_tara' => $peso_tara,
            'peso_bruto' => $peso_bruto,
            'peso_neto' => $peso_neto,
            'silo' => $silo,
            'destino' => $destino,
            'fecha' => date('d/m/Y'),
            'hora' => date('h:i:s a')
        ];
        
        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'No se encontraron datos.']);
    }

    $stmt->close();
} else {
    $query = "SELECT id, conductor, placa 
              FROM vehiculos 
              WHERE DATE(fecha_peso_bruto) = ? AND estatus = 'Finalizado'";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("s", $fecha_seleccionada);
    $stmt->execute();
    $result = $stmt->get_result();

    $entradas = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $entradas[] = $row;
        }
    }

    echo json_encode($entradas);
    $stmt->close();
}

$conexion->close();
?>
