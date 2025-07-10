const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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
  // ⭐ PROMO 1: Pizzanesa + Papas (Descuento)
  { id: 101, name: "Pizzanesa de Pollo + Papas", price: 16000, category: "PROMO 1", promo: true },
  { id: 102, name: "Pizzanesa de Carne + Papas", price: 16000, category: "PROMO 1", promo: true },
  { id: 103, name: "Explosiva de Pollo + Papas", price: 22000, category: "PROMO 1", promo: true },
  { id: 104, name: "Explosiva de Carne + Papas", price: 24000, category: "PROMO 1", promo: true },

  // ⭐ PROMOCIONES DESTACADAS (Combos)
  { id: 201, name: "2 Hamburguesas + 2 Papas (PROMO 2)", price: 15000, category: "PROMO", promo: true },
  { id: 202, name: "Torpedo + Papas + Carlito (PROMO 3)", price: 15000, category: "PROMO", promo: true },
  { id: 203, name: "Pizza de Muzzarella + 6 Empanadas (PROMO 4)", price: 14000, category: "PROMO", promo: true },

  // PAPAS
  { id: 1, name: "Papas Chicas", price: 3500, category: "Papas" },
  { id: 2, name: "Papas Grandes", price: 5000, category: "Papas" },
  { id: 3, name: "Papas con Cheddar", price: 6000, category: "Papas" },

  // HAMBURGUESA
  { id: 4, name: "Hamburguesa Común + Papas", price: 6000, category: "Hamburguesa" },
  { id: 5, name: "Hamburguesa Especial + Papas", price: 7500, category: "Hamburguesa" },

  // TORPEDO
  { id: 6, name: "Torpedo Común", price: 7000, category: "Torpedo" },
  { id: 7, name: "Torpedo con Hamburguesa", price: 8000, category: "Torpedo" },
  { id: 8, name: "Torpedo con Suprema", price: 8500, category: "Torpedo" },
  { id: 9, name: "Torpedo con Milanesa", price: 8500, category: "Torpedo" },

  // CARLITO
  { id: 10, name: "Carlito Común", price: 6000, category: "Carlito" },
  { id: 11, name: "Carlito Especial", price: 7000, category: "Carlito" },
  { id: 12, name: "Carlito de Pollo", price: 8000, category: "Carlito" },

  // EMPANADAS
  { id: 13, name: "Empanada (Unidad)", price: 1500, category: "Empanadas" },
  { id: 14, name: "Empanadas (Docena)", price: 16000, category: "Empanadas" },
  { id: 15, name: "Empanada de Carne Dulce", price: 1500, category: "Empanadas" },
  { id: 16, name: "Empanada de Carne Salada", price: 1500, category: "Empanadas" },
  { id: 17, name: "Empanada de Jamón y Queso", price: 1500, category: "Empanadas" },
  { id: 18, name: "Empanada de Pollo", price: 1500, category: "Empanadas" },
  { id: 19, name: "Empanada de Verdura", price: 1500, category: "Empanadas" },
  { id: 20, name: "Empanada de Humita", price: 1500, category: "Empanadas" },

  // PIZZA
  { id: 21, name: "Pizza Muzzarella (4 porciones)", price: 5000, category: "Pizza" },
  { id: 22, name: "Pizza Muzzarella (8 porciones)", price: 9000, category: "Pizza" },
  { id: 23, name: "Pizza Especial (4 porciones)", price: 6500, category: "Pizza" },
  { id: 24, name: "Pizza Especial (8 porciones)", price: 13000, category: "Pizza" },
  { id: 25, name: "Pizza Napolitana (4 porciones)", price: 6500, category: "Pizza" },
  { id: 26, name: "Pizza Napolitana (8 porciones)", price: 13000, category: "Pizza" },
  { id: 27, name: "Pizza Pollo a la Crema (4 porciones)", price: 7500, category: "Pizza" },
  { id: 28, name: "Pizza Pollo a la Crema (8 porciones)", price: 14000, category: "Pizza" }
];
// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Obtener menú
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// Procesar pedido
app.post('/api/order', async (req, res) => {
  try {
    const { items, customOrder, deliveryTime, customerInfo } = req.body;
    
    // Validar datos
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      return res.status(400).json({ error: 'Información del cliente incompleta' });
    }

    if (!items.length && !customOrder) {
      return res.status(400).json({ error: 'No hay productos seleccionados' });
    }

    // Calcular total
    let total = 0;
    let orderDetails = '';

    if (items.length > 0) {
      items.forEach(item => {
        const menuItem = menuItems.find(mi => mi.id === item.id);
        if (menuItem) {
          total += menuItem.price * item.quantity;
          orderDetails += `${menuItem.name} x${item.quantity} - $${(menuItem.price * item.quantity).toFixed(2)}\n`;
        }
      });
    }

    if (customOrder) {
      orderDetails += `\nPedido personalizado: ${customOrder}\n`;
      total += 5.00; // Cargo adicional por pedido personalizado
    }

    // Crear contenido del email
    const emailContent = `
      <h2>🍕 Nuevo Pedido Recibido</h2>
      
      <h3>📋 Detalles del Pedido:</h3>
      <pre>${orderDetails}</pre>
      
      <h3>💰 Total: $${total.toFixed(2)}</h3>
      
      <h3>⏰ Horario de Entrega: ${deliveryTime}</h3>
      
      <h3>👤 Información del Cliente:</h3>
      <p><strong>Nombre:</strong> ${customerInfo.name}</p>
      <p><strong>Teléfono:</strong> ${customerInfo.phone}</p>
      <p><strong>Email:</strong> ${customerInfo.email}</p>
      <p><strong>Dirección:</strong> ${customerInfo.address || 'No especificada'}</p>
      
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

    // Enviar confirmación al cliente
    const customerEmailContent = `
      <h2>✅ Pedido Confirmado</h2>
      <p>Hola ${customerInfo.name},</p>
      <p>Hemos recibido tu pedido y lo estamos procesando.</p>
      
      <h3>📋 Resumen del Pedido:</h3>
      <pre>${orderDetails}</pre>
      
      <h3>💰 Total: $${total.toFixed(2)}</h3>
      <h3>⏰ Horario de Entrega: ${deliveryTime}</h3>
      
      <p>Te contactaremos pronto para confirmar los detalles de entrega.</p>
      <p>¡Gracias por tu pedido!</p>
    `;

    const customerMailOptions = {
      from: process.env.EMAIL_USER || 'tu-email@gmail.com',
      to: customerInfo.email,
      subject: '✅ Confirmación de Pedido',
      html: customerEmailContent
    };

    await transporter.sendMail(customerMailOptions);

    res.json({ 
      success: true, 
      message: 'Pedido enviado correctamente',
      orderId: Date.now()
    });

  } catch (error) {
    console.error('Error al procesar pedido:', error);
    res.status(500).json({ error: 'Error al procesar el pedido' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📧 Asegúrate de configurar las variables de entorno EMAIL_USER y EMAIL_PASS`);
}); 