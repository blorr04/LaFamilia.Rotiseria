const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Configurar dotenv con más opciones de debug
const result = require('dotenv').config({ 
  path: path.join(__dirname, '.env'),
  debug: true 
});

console.log('🔍 Debug - Resultado de dotenv:', result);

// Configuración directa como fallback
if (!process.env.EMAIL_USER) {
  process.env.EMAIL_USER = 'lafamilia.rotiseria2@gmail.com';
  console.log('⚠️  Usando configuración directa para EMAIL_USER');
}
if (!process.env.EMAIL_PASS) {
  process.env.EMAIL_PASS = 'fwpttjmoxqhzniib';
  console.log('⚠️  Usando configuración directa para EMAIL_PASS');
}
if (!process.env.PORT) {
  process.env.PORT = '3001';
  console.log('⚠️  Usando configuración directa para PORT');
}

// Debug: Verificar si las variables se están leyendo
console.log('🔍 Debug - Variables de entorno:');
console.log('   EMAIL_USER:', process.env.EMAIL_USER ? 'Configurado' : 'NO CONFIGURADO');
console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? 'Configurado' : 'NO CONFIGURADO');
console.log('   PORT:', process.env.PORT || 'No configurado');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración del transporter de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'tu-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'tu-password-de-aplicacion'
  }
});

// Datos del menú (puedes modificar estos productos)
const menuItems = [
  // 🥔 PAPAS
  { id: 1, name: "Papas Chicas", price: 4000, category: "PAPAS", hasExtras: true, extraType: "cheddar", isActive: true },
  { id: 2, name: "Papas Grandes", price: 6000, category: "PAPAS", hasExtras: true, extraType: "cheddar", isActive: true },

  // 🍔 HAMBURGUESA CASERA
  { id: 3, name: "Hamburguesa Especial + Papas", price: 8500, category: "HAMBURGUESA CASERA", isActive: true },
  { id: 4, name: "Hamburguesa Simple con Cheddar + Papas", price: 7000, category: "HAMBURGUESA CASERA", isActive: true },
  { id: 5, name: "Hamburguesa Doble con Cheddar y Bacon", price: 9500, category: "HAMBURGUESA CASERA", isActive: true },
  { id: 6, name: "Hamburguesa Mega Boom Doble", price: 10500, category: "HAMBURGUESA CASERA", isActive: true },

  // 🌭 TORPEDO
  { id: 7, name: "Torpedo Común", price: 8000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 8, name: "Torpedo Común + Hamburguesa", price: 10000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 9, name: "Torpedo Común + Suprema", price: 10000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 10, name: "Torpedo Común + Milanesa", price: 11000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 11, name: "Torpedo Especial", price: 8500, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 12, name: "Torpedo Especial + Hamburguesa", price: 10000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 13, name: "Torpedo Especial + Suprema", price: 9000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 14, name: "Torpedo Especial + Milanesa", price: 10000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },

  // 🥪 CARLITO
  { id: 15, name: "Carlito Común", price: 6500, category: "CARLITO", isActive: true },
  { id: 16, name: "Carlito Especial", price: 7500, category: "CARLITO", isActive: true },
  { id: 17, name: "Carlito de Pollo", price: 8500, category: "CARLITO", isActive: true },
  { id: 18, name: "Carlipizza", price: 9500, category: "CARLITO", isActive: true },

  // 🍕 PIZZANESA + PAPAS (Para 2 personas)
  { id: 19, name: "Pizzanesa de Pollo (Muzza) Para 2", price: 20000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 20, name: "Pizzanesa de Carne (Muzza) Para 2", price: 21000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 21, name: "Pizzanesa Especial de Pollo Para 2", price: 22000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 22, name: "Pizzanesa Especial de Carne Para 2", price: 23000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 23, name: "Pizzanesa Explosiva de Pollo Para 2", price: 24000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 24, name: "Pizzanesa Explosiva de Carne Para 2", price: 25000, category: "PIZZANESA + PAPAS", isActive: true },

  // 🍕 PIZZANESA + PAPAS (Para 4 personas)
  { id: 25, name: "Pizzanesa de Pollo (Muzza) Para 4", price: 22000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 26, name: "Pizzanesa de Carne (Muzza) Para 4", price: 23000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 27, name: "Pizzanesa Especial de Pollo Para 4", price: 24000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 28, name: "Pizzanesa Especial de Carne Para 4", price: 25000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 29, name: "Pizzanesa Explosiva de Pollo Para 4", price: 26000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 30, name: "Pizzanesa Explosiva de Carne Para 4", price: 28000, category: "PIZZANESA + PAPAS", isActive: true },

  // 🥟 EMPANADAS
  { id: 31, name: "Empanada (Unidad)", price: 1500, category: "EMPANADAS", isActive: true },
  { id: 32, name: "Empanadas (Docena)", price: 16000, category: "EMPANADAS", isActive: true },
  
  // SABORES DE EMPANADAS (sin precio - solo para seleccionar sabores)
  { id: 33, name: "De Carne Dulce", price: 0, category: "EMPANADAS SABORES", isFlavor: true, isActive: true },
  { id: 34, name: "De Carne Salada", price: 0, category: "EMPANADAS SABORES", isFlavor: true, isActive: true },
  { id: 35, name: "De Jamón y Queso", price: 0, category: "EMPANADAS SABORES", isFlavor: true, isActive: true },
  { id: 36, name: "De Pollo", price: 0, category: "EMPANADAS SABORES", isFlavor: true, isActive: true },
  { id: 37, name: "De Verdura", price: 0, category: "EMPANADAS SABORES", isFlavor: true, isActive: true },
  { id: 38, name: "De Humita", price: 0, category: "EMPANADAS SABORES", isFlavor: true, isActive: true },

  // 🍕 PIZZA (MOLDE) - Media
  { id: 39, name: "Pizza Muzzarella (molde, Media)", price: 5000, category: "PIZZA MOLDE", isActive: true },
  { id: 40, name: "Pizza Especial (molde, Media)", price: 6500, category: "PIZZA MOLDE", isActive: true },
  { id: 41, name: "Pizza Napolitana (molde, Media)", price: 6500, category: "PIZZA MOLDE", isActive: true },
  { id: 42, name: "Pizza Pollo a la Crema (molde, Media)", price: 8000, category: "PIZZA MOLDE", isActive: true },
  { id: 43, name: "Pizza Roquefort (molde, Media)", price: 6500, category: "PIZZA MOLDE", isActive: true },
  { id: 44, name: "Pizza Explosiva (molde, Media)", price: 8500, category: "PIZZA MOLDE", isActive: true },

  // 🍕 PIZZA (MOLDE) - Entera
  { id: 45, name: "Pizza Muzzarella (molde, Entera)", price: 9000, category: "PIZZA MOLDE", isActive: true },
  { id: 46, name: "Pizza Especial (molde, Entera)", price: 10500, category: "PIZZA MOLDE", isActive: true },
  { id: 47, name: "Pizza Napolitana (molde, Entera)", price: 10500, category: "PIZZA MOLDE", isActive: true },
  { id: 48, name: "Pizza Pollo a la Crema (molde, Entera)", price: 15000, category: "PIZZA MOLDE", isActive: true },
  { id: 49, name: "Pizza Roquefort (molde, Entera)", price: 12000, category: "PIZZA MOLDE", isActive: true },
  { id: 50, name: "Pizza Explosiva (molde, Entera)", price: 16000, category: "PIZZA MOLDE", isActive: true },

  // 🍕 PIZZA (PARRILLA) - Media
  { id: 51, name: "Pizza Muzzarella (parrilla, Media)", price: 6000, category: "PIZZA PARRILLA", isActive: true },
  { id: 52, name: "Pizza Especial (parrilla, Media)", price: 7500, category: "PIZZA PARRILLA", isActive: true },
  { id: 53, name: "Pizza Napolitana (parrilla, Media)", price: 7500, category: "PIZZA PARRILLA", isActive: true },
  { id: 54, name: "Pizza Pollo a la Crema (parrilla, Media)", price: 8500, category: "PIZZA PARRILLA", isActive: true },
  { id: 55, name: "Pizza Roquefort (parrilla, Media)", price: 7500, category: "PIZZA PARRILLA", isActive: true },
  { id: 56, name: "Pizza Explosiva (parrilla, Media)", price: 9500, category: "PIZZA PARRILLA", isActive: true },

  // 🍕 PIZZA (PARRILLA) - Entera
  { id: 57, name: "Pizza Muzzarella (parrilla, Entera)", price: 10000, category: "PIZZA PARRILLA", isActive: true },
  { id: 58, name: "Pizza Especial (parrilla, Entera)", price: 12500, category: "PIZZA PARRILLA", isActive: true },
  { id: 59, name: "Pizza Napolitana (parrilla, Entera)", price: 13000, category: "PIZZA PARRILLA", isActive: true },
  { id: 60, name: "Pizza Pollo a la Crema (parrilla, Entera)", price: 16000, category: "PIZZA PARRILLA", isActive: true },
  { id: 61, name: "Pizza Roquefort (parrilla, Entera)", price: 14000, category: "PIZZA PARRILLA", isActive: true },
  { id: 62, name: "Pizza Explosiva (parrilla, Entera)", price: 18500, category: "PIZZA PARRILLA", isActive: true },

  // 🥩 LOMITO
  { id: 63, name: "Lomito Simple", price: 8500, category: "LOMITO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 64, name: "Lomito Especial", price: 9000, category: "LOMITO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 65, name: "Lomito Super", price: 10000, category: "LOMITO", hasExtras: true, extraType: "papas", isActive: true }
];

// Configuración de extras
const extrasConfig = {
  cheddar: { name: "Cheddar", price: 1000 },
  papas: { name: "Papas Extra", price: 2000 }
};

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Obtener menú (solo productos activos)
app.get('/api/menu', (req, res) => {
  const activeItems = menuItems.filter(item => item.isActive !== false);
  res.json(activeItems);
});

// Obtener menú completo (para admin)
app.get('/api/menu/admin', (req, res) => {
  res.json(menuItems);
});

// Obtener configuración de extras
app.get('/api/extras', (req, res) => {
  res.json(extrasConfig);
});

// Procesar pedido
app.post('/api/order', async (req, res) => {
  try {
    const { items, customerInfo } = req.body;
    
    // Validar datos
    if (!customerInfo.name || !customerInfo.address) {
      return res.status(400).json({ error: 'Nombre y dirección son obligatorios' });
    }

    if (!items.length) {
      return res.status(400).json({ error: 'No hay productos seleccionados' });
    }

    // Calcular total y separar productos de sabores
    let total = 0;
    let orderDetails = '';
    let flavorDetails = '';

    if (items.length > 0) {
      items.forEach(item => {
        if (item.isFlavor) {
          // Es un sabor de empanada (sin precio)
          flavorDetails += `${item.name} x${item.quantity}\n`;
        } else {
          // Es un producto con precio
          let itemTotal = item.price * item.quantity;
          let itemDescription = `${item.name} x${item.quantity} - $${itemTotal.toFixed(2)}`;
          
          // Agregar extras si existen
          if (item.extras) {
            Object.keys(item.extras).forEach(extraType => {
              const extraQuantity = item.extras[extraType];
              if (extraQuantity > 0 && extrasConfig[extraType]) {
                const extraPrice = extrasConfig[extraType].price * extraQuantity;
                itemTotal += extraPrice;
                itemDescription += `\n  + ${extrasConfig[extraType].name} x${extraQuantity} - $${extraPrice.toFixed(2)}`;
              }
            });
          }
          
          total += itemTotal;
          orderDetails += itemDescription + '\n';
        }
      });
    }

    // Crear contenido del email
    let emailContent = `
      <h2>🍕 Nuevo Pedido Recibido</h2>
      
      <h3>📋 Detalles del Pedido:</h3>
      <pre>${orderDetails}</pre>
    `;

    // Agregar sabores de empanadas si existen
    if (flavorDetails.trim()) {
      emailContent += `
      <h3>🥟 Sabores de Empanadas:</h3>
      <pre style="background-color: #f0f8f0; padding: 10px; border-left: 4px solid #4caf50;">${flavorDetails}</pre>
      `;
    }

    emailContent += `
      <h3>💰 Total: $${total.toFixed(2)}</h3>
      
      <h3>👤 Información del Cliente:</h3>
      <p><strong>Nombre:</strong> ${customerInfo.name}</p>
      <p><strong>Dirección:</strong> ${customerInfo.address}</p>
      
      <h3>⏰ Información de Entrega:</h3>
      <p style="font-size: 18px; font-weight: bold; color: #2e7d32;">Para consultar el estado de tu pedido, comunícate al número de consultas</p>
      
      <h3>📞 Información para el Cliente:</h3>
      <p><strong>Estado del pedido:</strong> Consulta al número de consultas</p>
      <p><strong>Consultas:</strong> El cliente debe comunicarse al número de consultas</p>
      
      <hr>
      <p><em>Pedido recibido el ${new Date().toLocaleString('es-ES')}</em></p>
    `;

    // Enviar email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'tu-email@gmail.com',
      to: process.env.EMAIL_USER || 'tu-email@gmail.com', // Email donde recibirás los pedidos
      subject: `🍕 Nuevo Pedido - ${customerInfo.name}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);

    console.log('✅ Email enviado correctamente a:', process.env.EMAIL_USER);

    res.json({ 
      success: true, 
      message: 'Pedido enviado correctamente',
      orderId: Date.now()
    });

  } catch (error) {
    console.error('Error al procesar pedido:', error);
    
    // Mensaje de error más específico
    let errorMessage = 'Error al procesar el pedido. Por favor, intenta nuevamente.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Error de autenticación del email. Por favor, contacta al administrador.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Error de conexión. Por favor, intenta nuevamente.';
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// ========= NUEVAS RUTAS PARA CONTROL MANUAL =========

// Estado del restaurante (en memoria para desarrollo local)
let restaurantStatus = {
  isOpen: true,
  lastChanged: new Date().toISOString(),
  message: "Estamos recibiendo pedidos normalmente"
};

// Ruta para obtener/cambiar estado del restaurante
app.get('/api/status', (req, res) => {
  res.json(restaurantStatus);
});

app.post('/api/status', (req, res) => {
  const { password, isOpen, message } = req.body;
  
  // Verificar contraseña
  if (password !== 'pancito1954') {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  
  // Actualizar estado
  restaurantStatus = {
    isOpen: isOpen,
    lastChanged: new Date().toISOString(),
    message: message || (isOpen ? "Estamos recibiendo pedidos normalmente" : "No estamos recibiendo pedidos en este momento")
  };
  
  console.log(`🎛️ Estado cambiado: ${isOpen ? 'ABIERTO' : 'CERRADO'} - ${new Date().toLocaleString('es-ES')}`);
  res.json({ success: true, status: restaurantStatus });
});

// Rutas para gestión de productos (admin)
app.post('/api/menu/toggle', (req, res) => {
  const { password, productId, isActive } = req.body;
  
  // Verificar contraseña
  if (password !== 'pancito1954') {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  
  // Buscar producto
  const product = menuItems.find(item => item.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  // Actualizar estado
  product.isActive = isActive;
  
  console.log(`🎛️ Producto ${product.name} ${isActive ? 'ACTIVADO' : 'DESACTIVADO'} - ${new Date().toLocaleString('es-ES')}`);
  
  res.json({ 
    success: true, 
    message: `Producto ${isActive ? 'activado' : 'desactivado'} correctamente`,
    product: product
  });
});

app.post('/api/menu/update', (req, res) => {
  const { password, productId, updates } = req.body;
  
  // Verificar contraseña
  if (password !== 'pancito1954') {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  
  // Buscar producto
  const product = menuItems.find(item => item.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  // Actualizar campos permitidos
  if (updates.name !== undefined) product.name = updates.name;
  if (updates.price !== undefined) product.price = updates.price;
  if (updates.category !== undefined) product.category = updates.category;
  
  console.log(`🎛️ Producto ${product.name} actualizado - ${new Date().toLocaleString('es-ES')}`);
  
  res.json({ 
    success: true, 
    message: 'Producto actualizado correctamente',
    product: product
  });
});

// Panel de administración
app.get('/admin', (req, res) => {
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
            padding: 20px;
        }
        .admin-container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 1200px;
            width: 100%;
            margin: 0 auto;
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
            width: 100%;
            background: #ff8f00;
            color: white;
        }
        .btn-login:hover {
            background: #ef6c00;
        }
        .btn-open {
            background: #4caf50;
            color: white;
            width: 48%;
            margin-right: 2%;
        }
        .btn-open:hover {
            background: #388e3c;
        }
        .btn-close {
            background: #f44336;
            color: white;
            width: 48%;
            margin-left: 2%;
        }
        .btn-close:hover {
            background: #d32f2f;
        }
        .btn-menu {
            background: #2196f3;
            color: white;
            width: 100%;
            margin-top: 20px;
        }
        .btn-menu:hover {
            background: #1976d2;
        }
        .admin-panel {
            display: none;
        }
        .menu-panel {
            display: none;
            margin-top: 30px;
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
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .menu-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background: #f9f9f9;
        }
        .menu-item.inactive {
            background: #ffebee;
            opacity: 0.7;
        }
        .menu-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .menu-item-name {
            font-weight: bold;
            color: #333;
        }
        .menu-item-price {
            color: #c62828;
            font-weight: bold;
        }
        .menu-item-category {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        .menu-item-controls {
            display: flex;
            gap: 10px;
        }
        .btn-small {
            padding: 8px 12px;
            font-size: 0.9rem;
            margin: 0;
        }
        .btn-toggle {
            background: #ff9800;
            color: white;
        }
        .btn-toggle:hover {
            background: #f57c00;
        }
        .btn-toggle.inactive {
            background: #4caf50;
        }
        .btn-toggle.inactive:hover {
            background: #388e3c;
        }
        .btn-edit {
            background: #2196f3;
            color: white;
        }
        .btn-edit:hover {
            background: #1976d2;
        }
        .edit-form {
            display: none;
            margin-top: 10px;
            padding: 10px;
            background: white;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .edit-form input {
            margin-bottom: 10px;
        }
        .btn-save {
            background: #4caf50;
            color: white;
            width: 100%;
        }
        .btn-save:hover {
            background: #388e3c;
        }
        .btn-cancel {
            background: #f44336;
            color: white;
            width: 100%;
            margin-top: 5px;
        }
        .btn-cancel:hover {
            background: #d32f2f;
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
            
            <div style="display: flex; justify-content: space-between;">
                <button class="btn btn-open" onclick="toggleStatus(true)">🟢 ABRIR PEDIDOS</button>
                <button class="btn btn-close" onclick="toggleStatus(false)">🔴 CERRAR PEDIDOS</button>
            </div>
            
            <button class="btn btn-menu" onclick="toggleMenuPanel()">📋 GESTIONAR MENÚ</button>
            
            <div id="lastChanged" class="last-changed"></div>
        </div>
        
        <!-- Menu Panel -->
        <div id="menuPanel" class="menu-panel">
            <h2 style="text-align: center; margin-bottom: 20px; color: #c62828;">📋 Gestión de Menú</h2>
            <div id="menuGrid" class="menu-grid">
                <!-- Los productos se cargarán aquí -->
            </div>
        </div>
        
        <div id="message"></div>
    </div>

    <script>
        let currentPassword = '';
        let menuItems = [];
        
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
                loadMenu();
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
        
        // Cargar menú completo
        async function loadMenu() {
            try {
                const response = await fetch('/api/menu/admin');
                menuItems = await response.json();
                renderMenu();
            } catch (error) {
                showMessage('Error cargando menú', 'error');
            }
        }
        
        // Renderizar menú
        function renderMenu() {
            const menuGrid = document.getElementById('menuGrid');
            menuGrid.innerHTML = '';
            
            menuItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = \`menu-item \${item.isActive ? '' : 'inactive'}\`;
                itemDiv.innerHTML = \`
                    <div class="menu-item-header">
                        <span class="menu-item-name">\${item.name}</span>
                        <span class="menu-item-price">$\${item.price}</span>
                    </div>
                    <div class="menu-item-category">\${item.category}</div>
                    <div class="menu-item-controls">
                        <button class="btn btn-small btn-toggle \${item.isActive ? '' : 'inactive'}" 
                                onclick="toggleProduct(\${item.id}, \${!item.isActive})">
                            \${item.isActive ? '❌ Desactivar' : '✅ Activar'}
                        </button>
                        <button class="btn btn-small btn-edit" onclick="toggleEditForm(\${item.id})">
                            ✏️ Editar
                        </button>
                    </div>
                    <div id="editForm-\${item.id}" class="edit-form">
                        <input type="text" id="name-\${item.id}" value="\${item.name}" placeholder="Nombre">
                        <input type="number" id="price-\${item.id}" value="\${item.price}" placeholder="Precio">
                        <input type="text" id="category-\${item.id}" value="\${item.category}" placeholder="Categoría">
                        <button class="btn btn-save" onclick="saveProduct(\${item.id})">💾 Guardar</button>
                        <button class="btn btn-cancel" onclick="toggleEditForm(\${item.id})">❌ Cancelar</button>
                    </div>
                \`;
                menuGrid.appendChild(itemDiv);
            });
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
        
        // Toggle producto
        async function toggleProduct(productId, isActive) {
            try {
                const response = await fetch('/api/menu/toggle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password: currentPassword,
                        productId: productId,
                        isActive: isActive
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Actualizar el item en el array local
                    const item = menuItems.find(i => i.id === productId);
                    if (item) {
                        item.isActive = isActive;
                    }
                    renderMenu();
                    showMessage(result.message, 'success');
                } else {
                    showMessage(result.error || 'Error al cambiar estado del producto', 'error');
                }
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
        }
        
        // Toggle formulario de edición
        function toggleEditForm(productId) {
            const form = document.getElementById(\`editForm-\${productId}\`);
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        }
        
        // Guardar producto
        async function saveProduct(productId) {
            try {
                const name = document.getElementById(\`name-\${productId}\`).value;
                const price = parseInt(document.getElementById(\`price-\${productId}\`).value);
                const category = document.getElementById(\`category-\${productId}\`).value;
                
                const response = await fetch('/api/menu/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password: currentPassword,
                        productId: productId,
                        updates: {
                            name: name,
                            price: price,
                            category: category
                        }
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Actualizar el item en el array local
                    const item = menuItems.find(i => i.id === productId);
                    if (item) {
                        item.name = name;
                        item.price = price;
                        item.category = category;
                    }
                    renderMenu();
                    showMessage(result.message, 'success');
                } else {
                    showMessage(result.error || 'Error al actualizar producto', 'error');
                }
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
        }
        
        // Toggle panel de menú
        function toggleMenuPanel() {
            const menuPanel = document.getElementById('menuPanel');
            menuPanel.style.display = menuPanel.style.display === 'none' ? 'block' : 'none';
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
  res.send(adminHTML);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📧 Configuración de email:`);
  console.log(`   - EMAIL_USER: ${process.env.EMAIL_USER ? 'Configurado' : 'NO CONFIGURADO'}`);
  console.log(`   - EMAIL_PASS: ${process.env.EMAIL_PASS ? 'Configurado' : 'NO CONFIGURADO'}`);
  console.log(`📧 Asegúrate de configurar las variables de entorno EMAIL_USER y EMAIL_PASS`);
}); 