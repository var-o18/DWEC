<?php

header('Content-Type: application/json');
require_once '../repositories/UsuarioModel.php';

$respuesta = ['success' => false,'message' => '','data' => null];

try {
    $model = new UsuarioModel();
    $id = $_GET['id'] ?? null;

    if ($id) {
        $usuario = $model->getById((int)$id);
        if ($usuario) {
            $respuesta['success'] = true;
            $respuesta['message'] = 'usuario obtenido correctamente maquinaaaaa';
            $respuesta['data'] = $usuario->toArray();
        } else {
            $respuesta['message'] = 'usuario no encontrado';
        }
    } else {
        $usuarios = $model->getAll();
        $data = [];
        foreach ($usuarios as $u) {
            $data[] = $u->toArray();
        }
        $respuesta['success'] = true;
        $respuesta['message'] = 'usuarios obtenidos correctamente maquinaaaaa';
        $respuesta['data'] = $data;
    }
} catch (Exception $e) {
    $respuesta['message'] = 'error: ' . $e->getMessage();
}

echo json_encode($respuesta);
