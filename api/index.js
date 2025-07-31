const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Configurar dotenv
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Configuración del transporter de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'lafamilia.rotiseria2@gmail.com',
    pass: process.env.EMAIL_PASS || 'fwpttjmoxqhzniib'
  }
});

// Datos del menú
const menuItems = [
  // ⭐ PAPAS
  { id: 1, name: "Papas Chicas", price: 4000, category: "PAPAS", hasExtras: true, extraType: "cheddar" },
  { id: 2, name: "Papas Grandes", price: 6000, category: "PAPAS", hasExtras: true, extraType: "cheddar" },

  // 🍔 HAMBURGUESA
  { id: 4, name: "Hamburguesa Común + Papas", price: 7000, category: "HAMBURGUESA" },
  { id: 5, name: "Hamburguesa Especial + Papas", price: 8500, category: "HAMBURGUESA" },

  // 🌭 TORPEDO
  { id: 6, name: "Torpedo Común", price: 7500, category: "TORPEDO", hasExtras: true, extraType: "papas" },
  { id: 7, name: "Torpedo con Hamburguesa", price: 9000, category: "TORPEDO", hasExtras: true, extraType: "papas" },
  { id: 8, name: "Torpedo con Suprema", price: 9000, category: "TORPEDO", hasExtras: true, extraType: "papas" },
  { id: 9, name: "Torpedo con Milanesa", price: 10000, category: "TORPEDO", hasExtras: true, extraType: "papas" },

  // 🥪 CARLITO
  { id: 11, name: "Carlito Común", price: 6500, category: "CARLITO" },
  { id: 12, name: "Carlito Especial", price: 7500, category: "CARLITO" },
  { id: 13, name: "Carlito de Pollo", price: 8000, category: "CARLITO" },
  { id: 14, name: "Carlipizza", price: 8000, category: "CARLITO" },

  // 🍕 PIZZANESA + PAPAS (Para 2 personas)
  { id: 15, name: "Pizzanesa de Pollo + Papas (Para 2)", price: 18000, category: "PIZZANESA + PAPAS" },
  { id: 16, name: "Pizzanesa de Carne + Papas (Para 2)", price: 20000, category: "PIZZANESA + PAPAS" },
  { id: 17, name: "Explosiva de Pollo + Papas (Para 2)", price: 22000, category: "PIZZANESA + PAPAS" },
  { id: 18, name: "Explosiva de Carne + Papas (Para 2)", price: 24000, category: "PIZZANESA + PAPAS" },

  // 🍕 PIZZANESA + PAPAS (Para 4 personas)
  { id: 19, name: "Pizzanesa de Pollo + Papas (Para 4)", price: 20000, category: "PIZZANESA + PAPAS" },
  { id: 20, name: "Pizzanesa de Carne + Papas (Para 4)", price: 24000, category: "PIZZANESA + PAPAS" },
  { id: 21, name: "Explosiva de Pollo + Papas (Para 4)", price: 24000, category: "PIZZANESA + PAPAS" },
  { id: 22, name: "Explosiva de Carne + Papas (Para 4)", price: 26000, category: "PIZZANESA + PAPAS" },

  // 🥟 EMPANADAS
  { id: 23, name: "Empanada (Unidad)", price: 1500, category: "EMPANADAS" },
  { id: 24, name: "Empanadas (Docena)", price: 16000, category: "EMPANADAS" },
  
  // SABORES DE EMPANADAS (sin precio - solo para seleccionar sabores)
  { id: 25, name: "De Carne Dulce", price: 0, category: "EMPANADAS SABORES", isFlavor: true },
  { id: 26, name: "De Carne Salada", price: 0, category: "EMPANADAS SABORES", isFlavor: true },
  { id: 27, name: "De Jamón y Queso", price: 0, category: "EMPANADAS SABORES", isFlavor: true },
  { id: 28, name: "De Pollo", price: 0, category: "EMPANADAS SABORES", isFlavor: true },
  { id: 29, name: "De Verdura", price: 0, category: "EMPANADAS SABORES", isFlavor: true },
  { id: 30, name: "De Humita", price: 0, category: "EMPANADAS SABORES", isFlavor: true },

  // 🍕 PIZZA (MOLDE) - 4 porciones
  { id: 31, name: "Pizza Muzzarella (molde, 4 porciones)", price: 5000, category: "PIZZA MOLDE" },
  { id: 32, name: "Pizza Especial (molde, 4 porciones)", price: 6500, category: "PIZZA MOLDE" },
  { id: 33, name: "Pizza Napolitana (molde, 4 porciones)", price: 6500, category: "PIZZA MOLDE" },
  { id: 34, name: "Pizza Pollo a la Crema (molde, 4 porciones)", price: 7500, category: "PIZZA MOLDE" },
  { id: 35, name: "Pizza Roquefort (molde, 4 porciones)", price: 6500, category: "PIZZA MOLDE" },
  { id: 36, name: "Pizza Explosiva (molde, 4 porciones)", price: 8000, category: "PIZZA MOLDE" },

  // 🍕 PIZZA (MOLDE) - 8 porciones
  { id: 37, name: "Pizza Muzzarella (molde, 8 porciones)", price: 8500, category: "PIZZA MOLDE" },
  { id: 38, name: "Pizza Especial (molde, 8 porciones)", price: 10000, category: "PIZZA MOLDE" },
  { id: 39, name: "Pizza Napolitana (molde, 8 porciones)", price: 12000, category: "PIZZA MOLDE" },
  { id: 40, name: "Pizza Pollo a la Crema (molde, 8 porciones)", price: 14000, category: "PIZZA MOLDE" },
  { id: 41, name: "Pizza Roquefort (molde, 8 porciones)", price: 12000, category: "PIZZA MOLDE" },
  { id: 42, name: "Pizza Explosiva (molde, 8 porciones)", price: 16000, category: "PIZZA MOLDE" },

  // 🍕 PIZZA (PARRILLA) - 6 porciones
  { id: 43, name: "Pizza Muzzarella (parrilla, 6 porciones)", price: 5500, category: "PIZZA PARRILLA" },
  { id: 44, name: "Pizza Especial (parrilla, 6 porciones)", price: 7000, category: "PIZZA PARRILLA" },
  { id: 45, name: "Pizza Napolitana (parrilla, 6 porciones)", price: 7000, category: "PIZZA PARRILLA" },
  { id: 46, name: "Pizza Pollo a la Crema (parrilla, 6 porciones)", price: 8000, category: "PIZZA PARRILLA" },
  { id: 47, name: "Pizza Roquefort (parrilla, 6 porciones)", price: 7000, category: "PIZZA PARRILLA" },
  { id: 48, name: "Pizza Explosiva (parrilla, 6 porciones)", price: 9500, category: "PIZZA PARRILLA" },

  // 🍕 PIZZA (PARRILLA) - 12 porciones
  { id: 49, name: "Pizza Muzzarella (parrilla, 12 porciones)", price: 9000, category: "PIZZA PARRILLA" },
  { id: 50, name: "Pizza Especial (parrilla, 12 porciones)", price: 12000, category: "PIZZA PARRILLA" },
  { id: 51, name: "Pizza Napolitana (parrilla, 12 porciones)", price: 14000, category: "PIZZA PARRILLA" },
  { id: 52, name: "Pizza Pollo a la Crema (parrilla, 12 porciones)", price: 15000, category: "PIZZA PARRILLA" },
  { id: 53, name: "Pizza Roquefort (parrilla, 12 porciones)", price: 14000, category: "PIZZA PARRILLA" },
  { id: 54, name: "Pizza Explosiva (parrilla, 12 porciones)", price: 18000, category: "PIZZA PARRILLA" },

  // 🥪 LOMITO
  { id: 55, name: "Lomito Simple", price: 8500, category: "LOMITO", hasExtras: true, extraType: "papas" },
  { id: 56, name: "Lomito Especial", price: 9000, category: "LOMITO", hasExtras: true, extraType: "papas" },
  { id: 57, name: "Lomito Super", price: 10000, category: "LOMITO", hasExtras: true, extraType: "papas" }
];

// Configuración de extras
const extrasConfig = {
  cheddar: { name: "Cheddar", price: 1000 },
  papas: { name: "Papas Extra", price: 2000 }
};

// Ruta principal - servir el HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Rutas de API
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

app.get('/api/extras', (req, res) => {
  res.json(extrasConfig);
});

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
      
      <h3>⏰ Tiempo de Entrega Estimado:</h3>
      <p style="font-size: 18px; font-weight: bold; color: #2e7d32;">Entre 20 minutos y 1 hora</p>
      
      <h3>📞 Información para el Cliente:</h3>
      <p><strong>Tiempo de entrega:</strong> Entre 20 minutos y 1 hora</p>
      <p><strong>Consultas:</strong> El cliente debe comunicarse al número que lo atendió</p>
      
      <hr>
      <p><em>Pedido recibido el ${new Date().toLocaleString('es-ES')}</em></p>
    `;

    // Enviar email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'lafamilia.rotiseria2@gmail.com',
      to: process.env.EMAIL_USER || 'lafamilia.rotiseria2@gmail.com',
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
    
    let errorMessage = 'Error al procesar el pedido. Por favor, intenta nuevamente.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Error de autenticación del email. Por favor, contacta al administrador.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Error de conexión. Por favor, intenta nuevamente.';
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// Exportar la app de Express directamente para Vercel
module.exports = app; 