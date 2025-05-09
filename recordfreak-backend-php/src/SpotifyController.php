<?php
class SpotifyController
{
    private $spotifyApiBaseUrl = 'https://api.spotify.com/v1';
    private $clientId;
    private $clientSecret;
    private $redirectUri;
    private $accessToken = null;

    private $refreshToken = null;

    private $loggedIn = false;


    public function __construct()
    {
        $this->loadEnv();
        // $this->clientId = getenv('SPOTIFY_CLIENT_ID');
        $this->clientId = '077b0a8f569941c1af45cc2a893eddfa';
        $this->clientSecret = '510a2d6558b44628a0aedd52a9416b6e';
        $this->redirectUri = 'http://localhost:5000/auth/callback';
    }

    private function loadEnv()
    {
        $envFile = __DIR__ . '/../.env';
        if (!file_exists($envFile)) {
            throw new Exception('.env file not found');
        }

        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) {
                continue; // Skip comments
            }

            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            if (!array_key_exists($key, $_ENV)) {
                putenv("$key=$value");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }

    public function isAuthenticated()
    {
        echo json_encode(['isAuthenticated' => false]);
    }

    public function login()
    {
        $scopes = 'user-library-read user-library-modify';
        $authUrl = 'https://accounts.spotify.com/authorize?' . http_build_query([
            'response_type' => 'code',
            'client_id' => $this->clientId,
            'scope' => $scopes,
            'redirect_uri' => $this->redirectUri,
        ]);

        header('Location: ' . $authUrl);
        exit;
    }

    public function callback()
    {
        $code = $_GET['code'] ?? null;

        if (!$code) {
            echo json_encode(['error' => 'Authorization code is missing']);
            return;
        }
        error_log("Authorization code:");
        $tokenUrl = 'https://accounts.spotify.com/api/token';
        $postData = [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $this->redirectUri,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $tokenUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);

        if (isset($data['access_token'])) {
            $this->accessToken = $data['access_token'];
            echo json_encode(['message' => 'Authentication successful', 'access_token' => $this->accessToken]);
        } else {
            echo json_encode(['error' => 'Failed to obtain access token']);
        }

        $this->refreshToken = $data['refresh_token'];
        $this->loggedIn = true;
    }

    public function success()
    {
        echo json_encode(['message' => 'Authentication successful']);
    }
    private function refreshToken($refreshToken)
    {
        $tokenUrl = 'https://accounts.spotify.com/api/token';
        $postData = [
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $tokenUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);

        if (isset($data['access_token'])) {
            $this->accessToken = $data['access_token'];
            return $this->accessToken;
        }

        return null;
    }

    public function fetchSavedAlbums()
    {
        session_start();
        if (!isset($_SESSION['spotify_access_token'])) {
            echo json_encode(['error' => 'Access token is missing']);
            return;
        }

        $url = $this->spotifyApiBaseUrl . '/me/albums';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $_SESSION['spotify_access_token'],
            'Content-Type: application/json',
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);

        if (isset($data['items'])) {
            echo json_encode(['albums' => $data['items']]);
        } else {
            echo json_encode(['error' => 'Failed to fetch saved albums']);
        }
    }
}