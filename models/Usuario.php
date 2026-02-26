<?php

class Usuario {
    private $id;
    private $nombre;
    private $apellidos;
    private $password;
    private $telefono;
    private $email;
    private $sexo;
    private $fecha_nacimiento;

    public function __construct($id, $nombre, $apellidos, $password, $telefono, $email, $sexo, $fecha_nacimiento){
        $this->id = $id;
        $this->nombre = $nombre;
        $this->apellidos = $apellidos;
        $this->password = $password;
        $this->telefono = $telefono;
        $this->email = $email;
        $this->sexo = $sexo;
        $this->fecha_nacimiento = $fecha_nacimiento;
    }

    public function toArray(): array{
        return ['id' => $this->id, 'nombre' => $this->nombre, 'apellidos' => $this->apellidos, 'password' => $this->password, 'telefono' => $this->telefono, 'email' => $this->email, 'sexo' => $this->sexo, 'fecha_nacimiento' => $this->fecha_nacimiento];
    }

    public function getId() { return $this->id; }
    public function getNombre() { return $this->nombre; }
    public function getApellidos() { return $this->apellidos; }
    public function getPassword() { return $this->password; }
    public function getTelefono() { return $this->telefono; }
    public function getEmail() { return $this->email; }
    public function getSexo() { return $this->sexo; }
    public function getFechaNacimiento() { return $this->fecha_nacimiento; }
}
