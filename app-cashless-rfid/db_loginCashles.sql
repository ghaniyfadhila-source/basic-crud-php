CREATE DATABASE IF NOT EXISTS db_loginCashles;
USE db_loginCashles;

CREATE TABLE tb_role (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    nama_role VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE tb_user (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    rfid VARCHAR(50) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    id_role INT NOT NULL,
    FOREIGN KEY (id_role) REFERENCES tb_role(id_role)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO tb_role (id_role, nama_role) VALUES
(1, 'super_admin'),
(2, 'teller');

INSERT INTO tb_user (rfid, nama, id_role) VALUES
('0012345678', 'Super Admin', 1),
('0087654321', 'Teller 1', 2);
