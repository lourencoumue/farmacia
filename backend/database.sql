
CREATE DATABASE IF NOT EXISTS farmacia_vida_saudavel;
USE farmacia_vida_saudavel;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    contacto VARCHAR(50),
    email VARCHAR(100),
    endereco TEXT,
    data_registo TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    lote VARCHAR(50) NOT NULL,
    quantidade INT DEFAULT 0,
    quantidade_minima INT DEFAULT 5,
    preco_venda DECIMAL(10, 2) NOT NULL,
    data_validade DATE NOT NULL,
    fornecedor_id INT,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE SET NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medicamento_id INT NOT NULL,
    tipo ENUM('ENTRADA', 'SAÍDA') NOT NULL,
    quantidade INT NOT NULL,
    referencia VARCHAR(50),
    operador_id INT,
    data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE,
    FOREIGN KEY (operador_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

INSERT INTO usuarios (nome_completo, username, senha, cargo) VALUES 
('System Admin', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN'),
('Staff User', 'operador', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER');
