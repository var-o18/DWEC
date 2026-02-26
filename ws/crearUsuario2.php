<?php

header('Content-Type: application/json');
require_once '../repositories/UsuarioModel.php';

$respuesta = ['success' => false,'message' => '','data' => null];

try {
    $model = new UsuarioModel();
    
    $datos = ['nombre' => $_POST['nombre'] ?? '','apellidos' => $_POST['apellidos'] ?? '','password' => $_POST['password'] ?? '','telefono' => $_POST['telefono'] ?? null,'email' => $_POST['email'] ?? null,'sexo' => $_POST['sexo'] ?? null,'fecha_nacimiento' => $_POST['fecha_nacimiento'] ?? ''];

    if (!empty($datos['nombre']) && !empty($datos['apellidos']) && !empty($datos['password'])) {
        $usuarioCreado = $model->create($datos);
        if ($usuarioCreado) {
            $respuesta['success'] = true;
            $respuesta['message'] = 'usuario creado correctamente maquinaaaaa';
            $respuesta['data'] = $usuarioCreado->toArray();
        } else {
            $respuesta['message'] = 'error al crear el usuario';
        }
    } else {
        $respuesta['message'] = 'faltan campos obligatorios';
    }
} catch (Exception $e) {
    $respuesta['message'] = 'error: ' . $e->getMessage();
}

echo json_encode($respuesta);
