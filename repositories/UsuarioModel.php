<?php

require_once '../config/Conexion.inc.php';
require_once '../models/Usuario.php';

class UsuarioModel {
    private PDO $bd;

    public function __construct() {
        $this->bd = Conexion::getInstance()->getConnection();
    }

    public function getAll(): array {
        $consulta = $this->bd->prepare("SELECT * FROM alumno");
        $consulta->execute();
        $resultados = $consulta->fetchAll(PDO::FETCH_ASSOC);

        $usuarios = [];
        foreach ($resultados as $fila) {
            $usuarios[] = new Usuario($fila['id'], $fila['nombre'], $fila['apellidos'], $fila['password'], $fila['telefono'], $fila['email'], $fila['sexo'], $fila['fecha_nacimiento']);
        }
        return $usuarios;
    }

    public function getById(int $id): ?Usuario {
        $consulta = $this->bd->prepare("SELECT * FROM alumno WHERE id = :id");
        $consulta->bindParam(':id', $id, PDO::PARAM_INT);
        $consulta->execute();

        $fila = $consulta->fetch(PDO::FETCH_ASSOC);

        if ($fila) {
            return new Usuario($fila['id'], $fila['nombre'], $fila['apellidos'], $fila['password'], $fila['telefono'], $fila['email'], $fila['sexo'], $fila['fecha_nacimiento']);
        }
        return null;
    }

    public function delete(int $id): ?Usuario {
        $usuario = $this->getById($id);

        if ($usuario) {
            $consulta = $this->bd->prepare("DELETE FROM alumno WHERE id = :id");
            $consulta->bindParam(':id', $id, PDO::PARAM_INT);
            $consulta->execute();
        }

        return $usuario;
    }

    public function create(array $datos): ?Usuario {
        $sql = "INSERT INTO alumno (nombre, apellidos, password, telefono, email, sexo, fecha_nacimiento) VALUES (:nombre, :apellidos, :password, :telefono, :email, :sexo, :fecha_nacimiento)";

        $consulta = $this->bd->prepare($sql);
        $consulta->execute([':nombre' => $datos['nombre'], ':apellidos' => $datos['apellidos'], ':password' => $datos['password'], ':telefono' => $datos['telefono'] ?? null, ':email' => $datos['email'] ?? null, ':sexo' => $datos['sexo'] ?? null, ':fecha_nacimiento' => $datos['fecha_nacimiento']]);

        $id = $this->bd->lastInsertId();
        return $this->getById($id);
    }

    public function update(int $id, array $datos): ?Usuario {
        $usuario = $this->getById($id);
        if (!$usuario) {
            return null;
        }

        $campos = [];
        $params = [':id' => $id];

        foreach ($datos as $columna => $valor) {
            if ($valor !== null && $valor !== '') {
                $campos[] = "$columna = :$columna";
                $params[":$columna"] = $valor;
            }
        }

        if (empty($campos)) {
            return $usuario;
        }

        $sql = "UPDATE alumno SET " . implode(', ', $campos) . " WHERE id = :id";
        $consulta = $this->bd->prepare($sql);
        $consulta->execute($params);

        return $this->getById($id);
    }
}
