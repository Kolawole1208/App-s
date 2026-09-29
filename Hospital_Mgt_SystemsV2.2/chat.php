<?php
header('Content-Type: application/json');
require 'config.php';

// Get message from POST request
$data = json_decode(file_get_contents('php://input'), true);
$userMessage = trim($data['message'] ?? '');

if (empty($userMessage)) {
    echo json_encode(['error' => 'No message provided']);
    exit;
}

// Call OpenAI API
$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . OPENAI_API_KEY
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'model' => 'gpt-4o-mini',
    'messages' => [
        ['role' => 'system', 'content' => 'You are a helpful hospital management assistant.'],
        ['role' => 'user', 'content' => $userMessage]
    ],
    'max_tokens' => 200
]));

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(['error' => curl_error($ch)]);
    exit;
}
curl_close($ch);

echo $response;
?>
