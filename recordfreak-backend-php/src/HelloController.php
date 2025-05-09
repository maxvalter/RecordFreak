<?php
class HelloController
{
    public function sayHello()
    {
        // Add CORS headers
        // header('Access-Control-Allow-Origin: *');
        // header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        // header('Access-Control-Allow-Headers: Content-Type, Authorization');

        // Respond with "Hello, World!"
        echo json_encode(['message' => 'Hello, World!']);
    }
}