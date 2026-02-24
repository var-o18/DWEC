<?php

class ElementModel{
    private PDO $bd;

    public function __construct(){
        $this->bd = Conexion::getInstance()->getConnection();
    }

    public function getAll(): array {
        $consulta = $this->bd->prepare("SELECT * FROM elementos");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById(int $id): ?array {
        $consulta = $this->bd->prepare("SELECT * FROM elementos WHERE id = :id_buscado");
        $consulta->bindParam(':id_buscado', $id, PDO::PARAM_INT);
        $consulta->execute();
        
        $resultado = $consulta->fetch(PDO::FETCH_ASSOC);
        return $resultado ?: null;
    }

    public function delete(int $id): ?array {
        $elementoEncontrado = $this->getById($id);
        
        if ($elementoEncontrado) {
            $consulta = $this->bd->prepare("DELETE FROM elementos WHERE id = :id_a_borrar");
            $consulta->bindParam(':id_a_borrar', $id, PDO::PARAM_INT);
            $consulta->execute();
        }
        
        return $elementoEncontrado;
    }

    public function create(array $datosNuevos): ?array {
        $sql = "INSERT INTO elementos (nombre, descripcion, nserie, estado, prioridad) VALUES (:nombre, :descripcion, :nserie, :estado, :prioridad)";
        
        $consulta = $this->bd->prepare($sql);
        $consulta->execute([
            ':nombre'      => $datosNuevos['nombre'],
            ':descripcion' => $datosNuevos['descripcion'],
            ':nserie'      => $datosNuevos['nserie'],
            ':estado'      => $datosNuevos['estado'],
            ':prioridad'   => $datosNuevos['prioridad']
        ]);
        
        $ultimoIdInsertado = $this->bd->lastInsertId();
        return $this->getById($ultimoIdInsertado);
    }

    public function update(int $id, array $datosAActualizar): ?array {
        $elementoExistente = $this->getById($id);
        if (!$elementoExistente) return null;

        $trozosConsultaSql = [];
        $valoresParaAsignar = [':id_para_actualizar' => $id];

        foreach ($datosAActualizar as $columna => $valorNuevo) {
            if (!empty($valorNuevo) || $valorNuevo === '0') { 
                $trozosConsultaSql[] = "$columna = :$columna";
                $valoresParaAsignar[":$columna"] = $valorNuevo;
            }
        }

        if (empty($trozosConsultaSql)) return $elementoExistente;

        $sqlCompleta = "UPDATE elementos SET " . implode(', ', $trozosConsultaSql) . " WHERE id = :id_para_actualizar";
        
        $consulta = $this->bd->prepare($sqlCompleta);
        $consulta->execute($valoresParaAsignar);

        return $this->getById($id);
    }
}