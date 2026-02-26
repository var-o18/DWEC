<?php

header('Content-Type: application/json');
require_once '../repositories/UsuarioModel.php';

$respuesta = ['success' => false,'message' => '','data' => null];

try {
    $model = new UsuarioModel();
    $id = $_GET['id'] ?? null;

    if ($id) {
        $usuarioEliminado = $model->delete((int)$id);
        if ($usuarioEliminado) {
            $respuesta['success'] = true;
            $respuesta['message'] = 'usuario eliminado correctamente maquinaaaaa';
            $respuesta['data'] = $usuarioEliminado->toArray();
        } else {
            $respuesta['message'] = 'no se pudo eliminar el usuario o no existe';
        }
    } else {
        $respuesta['message'] = 'id no proporcionado';
    }
} catch (Exception $e) {
    $respuesta['message'] = 'error: ' . $e->getMessage();
}

echo json_encode($respuesta);
