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

  const { items, customerInfo } = req.body;

  // Validar datos básicos
  if (!customerInfo?.name?.trim() || !customerInfo?.address?.trim()) {
    return res.status(400).json({ error: 'Nombre y dirección son obligatorios' });
  }

  // Debe haber al menos un producto
  const hasItems = items && items.length > 0;
  
  if (!hasItems) {
    return res.status(400).json({ error: 'Debes seleccionar al menos un producto' });
  }

  // Calcular total y detalles, separar productos de sabores
  let total = 0;
  let orderDetails = '';
  let flavorDetails = '';

  // Procesar productos del menú
  if (hasItems) {
    items.forEach(item => {
      if (item && item.name && item.quantity > 0 && item.price >= 0) {
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
      }
    });
  }

  // Generar ID único del pedido
  const orderId = `PED-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  // Email para el restaurante
  let restaurantEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d32f2f;">🍕 Nuevo Pedido Recibido</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1976d2;">📋 Detalles del Pedido:</h3>
        <pre style="background-color: white; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: inherit;">${orderDetails}</pre>
  `;

  // Agregar sabores de empanadas si existen
  if (flavorDetails.trim()) {
    restaurantEmailContent += `
        <h3 style="color: #4caf50;">🥟 Sabores de Empanadas:</h3>
        <pre style="background-color: #f0f8f0; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: inherit; border-left: 4px solid #4caf50;">${flavorDetails}</pre>
    `;
  }

  restaurantEmailContent += `
        <h3 style="color: #388e3c;">💰 Total: $${total.toFixed(2)}</h3>
      </div>
      
      <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #f57c00;">👤 Información del Cliente:</h3>
        <p><strong>Nombre:</strong> ${customerInfo.name}</p>
        <p><strong>Dirección:</strong> ${customerInfo.address}</p>
      </div>
      
      <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2e7d32;">⏰ Tiempo de Entrega Estimado:</h3>
        <p style="font-size: 18px; font-weight: bold; color: #2e7d32;">Entre 20 minutos y 1 hora</p>
      </div>
      
      <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #e65100;">📞 Información para el Cliente:</h3>
        <p><strong>Tiempo de entrega:</strong> Entre 20 minutos y 1 hora</p>
        <p><strong>Consultas:</strong> El cliente debe comunicarse al número que lo atendió</p>
      </div>
      
      <hr style="border: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #666; font-size: 14px;">
        <em>Pedido recibido el ${new Date().toLocaleString('es-ES')}</em><br>
        <strong>ID del Pedido:</strong> ${orderId}
      </p>
    </div>
  `;

  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Error: Variables de entorno EMAIL_USER o EMAIL_PASS no configuradas');
      console.log('⚠️  Modo de prueba: Pedido procesado sin envío de email');
      
      // En modo de prueba, devolver éxito sin enviar email
      return res.status(200).json({
        success: true,
        message: 'Pedido enviado correctamente (modo de prueba - sin email)',
        orderId: orderId
      });
    }

    // Configurar transporter con configuración mejorada para Gmail
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Enviar email al restaurante
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `🍕 Nuevo Pedido - ${customerInfo.name} (${orderId})`,
      html: restaurantEmailContent
    });

    console.log('✅ Email enviado correctamente a:', process.env.EMAIL_USER);

    res.status(200).json({
      success: true,
      message: 'Pedido enviado correctamente',
      orderId: orderId
    });

  } catch (error) {
    console.error('Error al procesar pedido:', error);
    
    // Mensaje de error más específico
    let errorMessage = 'Error al procesar el pedido. Por favor, intenta nuevamente.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Error de autenticación del email. Verifica las credenciales de Gmail.';
      console.error('🔐 Error de autenticación Gmail. Verifica:');
      console.error('   - Verificación en dos pasos activada');
      console.error('   - Contraseña de aplicación generada');
      console.error('   - Credenciales correctas en .env');
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Error de conexión. Por favor, intenta nuevamente.';
    }
    
    res.status(500).json({ 
      error: errorMessage
    });
  }
}