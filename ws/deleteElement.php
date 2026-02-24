<?php
require_once "../config/Conexion.inc.php";
require_once "../repositories/ElementModel.php";

header('Content-Type: application/json');

$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "No hay ID"]);
    exit;
}

$modelo = new ElementModel();
$elementoBorrado = $modelo->delete((int)$id);

if ($elementoBorrado) {
    echo json_encode($elementoBorrado);
} else {
    http_response_code(404);
    echo json_encode(["error" => "No encontrado"]);
}
