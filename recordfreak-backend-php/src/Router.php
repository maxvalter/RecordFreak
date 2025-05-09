<?php
class Router
{
    private $routes = [];

    public function get($path, $handler)
    {
        $this->routes['GET'][$path] = $handler;
    }

    public function put($path, $handler)
    {
        $this->routes['PUT'][$path] = $handler;
    }

    public function dispatch()
    {
        // Add CORS headers globally
        // Add CORS headers globally
        header('Access-Control-Allow-Origin: http://localhost:8000');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Credentials: true');

        // Handle preflight OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }


        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        if (isset($this->routes[$method][$path])) {
            [$controller, $action] = explode('@', $this->routes[$method][$path]);
            require_once "../src/{$controller}.php";
            $controllerInstance = new $controller();
            $controllerInstance->$action();
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Route not found']);
        }
    }
}