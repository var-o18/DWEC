<?php
require_once "../config/Conexion.inc.php";
require_once "../repositories/ElementModel.php";

header('Content-Type: application/json');

$datos = ['nombre'=> $_POST['nombre'] ?? '','descripcion'=> $_POST['descripcion'] ?? '','nserie'=> $_POST['nserie'] ?? '','estado'=> $_POST['estado'] ?? '','prioridad'=> $_POST['prioridad'] ?? ''];

$modelo = new ElementModel();
$elementoNuevo = $modelo->create($datos);

if ($elementoNuevo) {
    http_response_code(201);
    echo json_encode($elementoNuevo);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al crear el elemento"]);
}
