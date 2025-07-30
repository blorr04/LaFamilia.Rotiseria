const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { items, customOrder, customerInfo } = req.body;

  // Validar datos básicos
  if (!customerInfo?.name?.trim() || !customerInfo?.address?.trim()) {
    return res.status(400).json({ error: 'Nombre y dirección son obligatorios' });
  }

  // Debe haber al menos un producto o un pedido manual
  const hasItems = items && items.length > 0;
  const hasCustomOrder = customOrder && customOrder.trim();
  
  if (!hasItems && !hasCustomOrder) {
    return res.status(400).json({ error: 'Debes seleccionar al menos un producto o escribir un pedido manual' });
  }

  // Calcular total y detalles
  let total = 0;
  let orderDetails = '';

  // Procesar productos del menú
  if (hasItems) {
    items.forEach(item => {
      if (item && item.name && item.quantity > 0 && item.price >= 0) {
        const itemTotal = item.price * item.quantity;
        orderDetails += `${item.name} x${item.quantity} - $${itemTotal.toFixed(2)}\n`;
        total += itemTotal;
      }
    });
  }

  // Procesar pedido manual
  if (hasCustomOrder) {
    if (hasItems) {
      orderDetails += '\n'; // Separador si hay productos
    }
    orderDetails += `Pedido manual: ${customOrder.trim()}\n`;
    // total += 5.00; // Descomenta si quieres cobrar por pedido manual
  }

  // Generar ID único del pedido
  const orderId = `PED-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  // Email para el restaurante
  const restaurantEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d32f2f;">🍕 Nuevo Pedido Recibido</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1976d2;">📋 Detalles del Pedido:</h3>
        <pre style="background-color: white; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: inherit;">${orderDetails}</pre>
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
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Enviar email al restaurante
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `🍕 Nuevo Pedido - ${customerInfo.name} (${orderId})`,
      html: restaurantEmailContent
    });

    res.status(200).json({
      success: true,
      message: 'Pedido enviado correctamente',
      orderId: orderId
    });

  } catch (error) {
    console.error('Error al procesar pedido:', error);
    res.status(500).json({ 
      error: 'Error al procesar el pedido. Por favor, intenta nuevamente.' 
    });
  }
}