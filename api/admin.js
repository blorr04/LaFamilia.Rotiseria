// /api/admin.js - Panel de administración
const path = require('path');
const fs = require('fs');

module.exports = function handler(req, res) {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Servir página de administración
  const adminHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🍕 Panel Admin - La Familia</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #ffd54f 0%, #ffb74d 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .admin-container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
        }
        .admin-title {
            text-align: center;
            color: #c62828;
            margin-bottom: 30px;
            font-size: 1.8rem;
        }
        .status-display {
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            font-size: 1.2rem;
            font-weight: bold;
        }
        .status-open {
            background: #e8f5e8;
            color: #2e7d32;
            border: 2px solid #4caf50;
        }
        .status-closed {
            background: #ffebee;
            color: #c62828;
            border: 2px solid #f44336;
        }
        .login-form {
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #333;
        }
        input {
            width: 100%;
            padding: 12px;
            border: 2px solid #eee;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        input:focus {
            outline: none;
            border-color: #ff8f00;
        }
        .btn {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            margin-bottom: 10px;
            transition: all 0.3s ease;
        }
        .btn-login {
            background: #ff8f00;
            color: white;
        }
        .btn-login:hover {
            background: #ef6c00;
        }
        .btn-open {
            background: #4caf50;
            color: white;
        }
        .btn-open:hover {
            background: #388e3c;
        }
        .btn-close {
            background: #f44336;
            color: white;
        }
        .btn-close:hover {
            background: #d32f2f;
        }
        .admin-panel {
            display: none;
        }
        .last-changed {
            text-align: center;
            color: #666;
            font-size: 0.9rem;
            margin-top: 20px;
        }
        .error {
            background: #ffebee;
            color: #c62828;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
        .success {
            background: #e8f5e8;
            color: #2e7d32;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <h1 class="admin-title">🍕 Panel de Control</h1>
        
        <!-- Login Form -->
        <div id="loginForm" class="login-form">
            <div class="form-group">
                <label for="password">Contraseña:</label>
                <input type="password" id="password" placeholder="Ingresa la contraseña">
            </div>
            <button class="btn btn-login" onclick="login()">Ingresar</button>
        </div>
        
        <!-- Admin Panel -->
        <div id="adminPanel" class="admin-panel">
            <div id="statusDisplay" class="status-display">
                <div id="statusText">Cargando...</div>
            </div>
            
            <button class="btn btn-open" onclick="toggleStatus(true)">🟢 ABRIR PEDIDOS</button>
            <button class="btn btn-close" onclick="toggleStatus(false)">🔴 CERRAR PEDIDOS</button>
            
            <div id="lastChanged" class="last-changed"></div>
        </div>
        
        <div id="message"></div>
    </div>

    <script>
        let currentPassword = '';
        
        // Verificar estado al cargar
        window.onload = function() {
            loadStatus();
        };
        
        // Login
        function login() {
            const password = document.getElementById('password').value;
            if (password === 'pancito1954') {
                currentPassword = password;
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'block';
                loadStatus();
            } else {
                showMessage('Contraseña incorrecta', 'error');
            }
        }
        
        // Cargar estado actual
        async function loadStatus() {
            try {
                const response = await fetch('/api/status');
                const status = await response.json();
                updateStatusDisplay(status);
            } catch (error) {
                showMessage('Error cargando estado', 'error');
            }
        }
        
        // Cambiar estado
        async function toggleStatus(isOpen) {
            try {
                const response = await fetch('/api/status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password: currentPassword,
                        isOpen: isOpen
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    updateStatusDisplay(result.status);
                    showMessage(\`Estado cambiado: \${isOpen ? 'ABIERTO' : 'CERRADO'}\`, 'success');
                } else {
                    showMessage(result.error || 'Error al cambiar estado', 'error');
                }
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
        }
        
        // Actualizar display de estado
        function updateStatusDisplay(status) {
            const display = document.getElementById('statusDisplay');
            const text = document.getElementById('statusText');
            const lastChanged = document.getElementById('lastChanged');
            
            if (status.isOpen) {
                display.className = 'status-display status-open';
                text.textContent = '🟢 PEDIDOS ABIERTOS';
            } else {
                display.className = 'status-display status-closed';
                text.textContent = '🔴 PEDIDOS CERRADOS';
            }
            
            const date = new Date(status.lastChanged).toLocaleString('es-ES');
            lastChanged.textContent = \`Último cambio: \${date}\`;
        }
        
        // Mostrar mensajes
        function showMessage(text, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = text;
            messageDiv.className = type;
            
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = '';
            }, 3000);
        }
        
        // Enter para login
        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    </script>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(adminHTML);
};