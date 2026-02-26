<?php

class Conexion {
    private static ?Conexion $instance = null;
    private ?PDO $conexion = null;

    private string $host = 'localhost';
    private string $dbname = 'colegio';
    private string $user = 'root';
    private string $pass = '';

    private function __construct() {
        try {
            $this->conexion = new PDO("mysql:host={$this->host};dbname={$this->dbname};charset=utf8", $this->user, $this->pass);
            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            throw new Exception("error de conexión: " . $e->getMessage());
        }
    }

    public static function getInstance(): Conexion {
        if (self::$instance === null) {
            self::$instance = new Conexion();
        }
        return self::$instance;
    }

    public function getConnection(): PDO {
        return $this->conexion;
    }

    private function __clone() {}

    public function __wakeup() {
        throw new Exception("no se puede deserializar una conexión singleton");
    }
}
