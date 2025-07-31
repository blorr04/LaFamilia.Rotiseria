// /api/order.js
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuración de extras
const extrasConfig = {
  cheddar: { name: "Cheddar", price: 1000 },
  papas: { name: "Papas Extra", price: 2000 }
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

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

    // Configuración del transporter de email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'lafamilia.rotiseria2@gmail.com',
        pass: process.env.EMAIL_PASS || 'fwpttjmoxqhzniib'
      }
    });

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
};