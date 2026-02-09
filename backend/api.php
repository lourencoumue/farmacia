
<?php
/**
 * CORE API v1.1
 * Healthcare Management System - Stock Control Logic
 */

error_reporting(E_ALL & ~E_NOTICE);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$cfg = [
    'h' => 'localhost',
    'd' => 'farmacia_vida_saudavel',
    'u' => 'root',
    'p' => ''
];

try {
    $db = new PDO(
        "mysql:host={$cfg['h']};dbname={$cfg['d']};charset=utf8mb4",
        $cfg['u'],
        $cfg['p'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $ex) {
    http_response_code(500);
    exit(json_encode(['status' => 'fail', 'msg' => 'Database connection error']));
}

$ep = $_GET['endpoint'] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

switch ($ep) {
    case 'users':
        if ($method === 'GET') {
            $q = $db->query("SELECT id, nome_completo, username, cargo FROM usuarios ORDER BY nome_completo ASC");
            echo json_encode($q->fetchAll());
        }
        break;

    case 'medications':
        if ($method === 'GET') {
            $sql = "SELECT m.*, f.nome as supplier_name FROM medicamentos m LEFT JOIN fornecedores f ON m.fornecedor_id = f.id ORDER BY m.nome ASC";
            echo json_encode($db->query($sql)->fetchAll());
        } elseif ($method === 'POST') {
            $in = json_decode(file_get_contents('php://input'), true);
            $sql = "INSERT INTO medicamentos (nome, categoria, lote, quantidade, quantidade_minima, preco_venda, data_validade, fornecedor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $db->prepare($sql)->execute([$in['name'], $in['category'], $in['batch'], $in['stock'], $in['minStock'], $in['price'], $in['expiryDate'], $in['supplierId']]);
            echo json_encode(['success' => true]);
        }
        break;

    case 'movements':
        if ($method === 'GET') {
            $sql = "SELECT mov.*, med.nome as medication_name, u.nome_completo as operator_name 
                    FROM movimentacoes mov 
                    JOIN medicamentos med ON mov.medicamento_id = med.id 
                    LEFT JOIN usuarios u ON mov.operador_id = u.id 
                    ORDER BY mov.data_movimento DESC LIMIT 50";
            echo json_encode($db->query($sql)->fetchAll());
        } elseif ($method === 'POST') {
            $in = json_decode(file_get_contents('php://input'), true);
            
            $db->beginTransaction();
            try {
                // 1. Insert Movement Record
                $st = $db->prepare("INSERT INTO movimentacoes (medicamento_id, tipo, quantidade, referencia, operador_id) VALUES (?, ?, ?, ?, ?)");
                $st->execute([$in['medicamento_id'], $in['tipo'], $in['quantidade'], $in['referencia'], $in['operador_id'] ?? 1]);

                // 2. Update Medication Stock
                $operator = ($in['tipo'] === 'ENTRADA') ? '+' : '-';
                $upd = $db->prepare("UPDATE medicamentos SET quantidade = quantidade $operator ? WHERE id = ?");
                $upd->execute([$in['quantidade'], $in['medicamento_id']]);

                $db->commit();
                echo json_encode(['success' => true]);
            } catch (Exception $e) {
                $db->rollBack();
                http_response_code(400);
                echo json_encode(['error' => $e->getMessage()]);
            }
        }
        break;

    case 'suppliers':
        if ($method === 'GET') {
            echo json_encode($db->query("SELECT * FROM fornecedores ORDER BY nome ASC")->fetchAll());
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint mismatch']);
}
