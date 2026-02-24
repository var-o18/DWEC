<?php
require_once "../config/Conexion.inc.php";
require_once "../repositories/ElementModel.php";

header('Content-Type: application/json');

$id_buscado = $_GET['id'] ?? null;

if (!$id_buscado) {
    http_response_code(400);
    echo json_encode(["error" => "Id no encontrado"]);
    exit;
}

$datosNuevos = ['nombre'=> $_POST['nombre'] ?? '','descripcion'=> $_POST['descripcion'] ?? '','nserie'=> $_POST['nserie'] ?? '','estado'=> $_POST['estado'] ?? '','prioridad'=> $_POST['prioridad'] ?? ''
];

$modelo = new ElementModel();
$elementoModificado = $modelo->update((int)$id_buscado, $datosNuevos);

if ($elementoModificado) {
    echo json_encode($elementoModificado);
} else {
    http_response_code(404);
    echo json_encode(["error" => "No se pudo modificar"]);
}
