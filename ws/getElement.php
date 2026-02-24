<?php
require_once "../config/Conexion.inc.php";
require_once "../repositories/ElementModel.php";

header('Content-Type: application/json');

$modelo = new ElementModel();
$id = $_GET['id'] ?? null;

if ($id) {
    $resultado = $modelo->getById((int)$id);
} else {
    $resultado = $modelo->getAll();
}

if ($resultado === null) {
    http_response_code(404);
    echo json_encode(["error" => "No existe"]);
} else {
    echo json_encode($resultado);
}