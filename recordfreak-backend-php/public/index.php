<?php

require_once '../src/env.php'; // Include the custom env loader
require_once '../src/Router.php';

// Load environment variables
loadEnv(__DIR__ . '/../.env');

$router = new Router();

// Spotify API routes
$router->get('/spotify/search/albums', 'SpotifyController@searchAlbums');
$router->put('/spotify/me/albums', 'SpotifyController@saveAlbum');
$router->get('/spotify/me/albums/contains', 'SpotifyController@checkAlbumSaved');
$router->get('/spotify/me/albums', 'SpotifyController@fetchSavedAlbums');
$router->get('/spotify/auth/status', 'SpotifyController@isAuthenticated');
$router->get('/spotify/auth/login', 'SpotifyController@login');
$router->get('/auth/callback', 'SpotifyController@callback');

$router->get('/success', 'SpotifyController@success');


// Recommendations API routes
$router->get('/recommendations/albums', 'RecommendationsController@getAlbumRecommendations');

// Hello API route
$router->get('/hello', 'HelloController@sayHello');

// Auth API routes
// $router->get('/auth/status', 'AuthController@isAuthenticated');
// $router->get('/auth/login', 'AuthController@login');
// $router->get('/auth/callback', 'AuthController@callback');

// Handle the request
$router->dispatch();