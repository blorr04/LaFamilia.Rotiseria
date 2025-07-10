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
  { id: 1, name: 'Pizza Margherita', price: 12.99, category: 'Pizza' },
  { id: 2, name: 'Pizza Pepperoni', price: 14.99, category: 'Pizza' },
  { id: 3, name: 'Hamburguesa Clásica', price: 8.99, category: 'Hamburguesas' },
  { id: 4, name: 'Hamburguesa con Queso', price: 9.99, category: 'Hamburguesas' },
  { id: 5, name: 'Ensalada César', price: 6.99, category: 'Ensaladas' },
  { id: 6, name: 'Pasta Carbonara', price: 11.99, category: 'Pastas' },
  { id: 7, name: 'Bebida Cola', price: 2.50, category: 'Bebidas' },
  { id: 8, name: 'Bebida Agua', price: 1.50, category: 'Bebidas' }
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