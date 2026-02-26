<?php

header('Content-Type: application/json');
require_once '../repositories/UsuarioModel.php';

$respuesta = ['success' => false,'message' => '','data' => null];

try {
    $model = new UsuarioModel();
    $id = $_GET['id'] ?? null;

    if ($id) {
        $datosParaActualizar = [];
        $camposPosibles = ['nombre', 'apellidos', 'password', 'telefono', 'email', 'sexo', 'fecha_nacimiento'];

        foreach ($camposPosibles as $campo) {
            if (isset($_POST[$campo]) && $_POST[$campo] !== '') {
                $datosParaActualizar[$campo] = $_POST[$campo];
            }
        }

        if (!empty($datosParaActualizar)) {
            $usuarioModificado = $model->update((int)$id, $datosParaActualizar);
            if ($usuarioModificado) {
                $respuesta['success'] = true;
                $respuesta['message'] = 'usuario modificado correctamente maquinaaaaa';
                $respuesta['data'] = $usuarioModificado->toArray();
            } else {
                $respuesta['message'] = 'usuario no encontrado';
            }
        } else {
            $usuario = $model->getById((int)$id);
            if ($usuario) {
                $respuesta['success'] = true;
                $respuesta['message'] = 'no se realizaron cambios maquinaaaaa';
                $respuesta['data'] = $usuario->toArray();
            } else {
                $respuesta['message'] = 'usuario no encontrado';
            }
        }
    } else {
        $respuesta['message'] = 'id no proporcionado';
    }
} catch (Exception $e) {
    $respuesta['message'] = 'error: ' . $e->getMessage();
}

echo json_encode($respuesta);
