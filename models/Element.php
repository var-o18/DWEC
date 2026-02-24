<?php

class Element {
    private $id;
    private $nombre;
    private $descripcion;
    private $nserie;
    private $estado;
    private $prioridad;

    public function __construct($id, $nombre, $descripcion, $nserie, $estado, $prioridad) {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->nserie = $nserie;
        $this->estado = $estado;
        $this->prioridad = $prioridad;
    }

    public function toArray() {
        return array(
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'nserie' => $this->nserie,
            'estado' => $this->estado,
            'prioridad' => $this->prioridad
        );
    }
}