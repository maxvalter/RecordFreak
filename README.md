# RecordFreak

## Guide
### 1. 
Create an application in spotify web api, add http://localhost:5000/auth/callback as redirectURI in configurations. 

### 2.
Clone project and edit .env in recordfreak-backend-php folder to match your client ID and secret.

### 3.
To run:
```bash
cd recordfreak-backend-php
php -S localhost:5000 -t public
```
In a second terminal: 
```bash
cd frontend
npm install
npm run dev
```
