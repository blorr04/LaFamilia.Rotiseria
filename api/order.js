import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { items, customOrder, deliveryTime, customerInfo } = req.body;

  // Solo nombre y dirección son obligatorios
  if (!customerInfo?.name || !customerInfo?.address) {
    return res.status(400).json({ error: 'Nombre y dirección son obligatorios' });
  }

  // Debe haber al menos un producto o un pedido manual
  if ((!items || items.length === 0) && !customOrder) {
    return res.status(400).json({ error: 'No hay productos seleccionados ni pedido manual' });
  }

  // Calcular total y detalles
  let total = 0;
  let orderDetails = '';

  if (items && items.length > 0) {
    items.forEach(item => {
      // Validar datos del item
      if (item && item.name && item.quantity && item.price) {
        orderDetails += `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
        total += item.price * item.quantity;
      }
    });
  }

  if (customOrder) {
    orderDetails += `\nPedido manual: ${customOrder}\n`;
    total += 5.00;
  }

  // Si no hay productos pero sí pedido manual, mostrar solo el pedido manual
  if ((!items || items.length === 0) && customOrder) {
    orderDetails = `Pedido manual: ${customOrder}\n`;
    total = 5.00;
  }

  // Email content
  const emailContent = `
    <h2>🍕 Nuevo Pedido Recibido</h2>
    <h3>📋 Detalles del Pedido:</h3>
    <pre>${orderDetails}</pre>
    <h3>💰 Total: $${total.toFixed(2)}</h3>
    <h3>⏰ Horario de Entrega: ${deliveryTime}</h3>
    <h3>👤 Información del Cliente:</h3>
    <p><strong>Nombre:</strong> ${customerInfo.name}</p>
    <p><strong>Teléfono:</strong> ${customerInfo.phone || '-'}</p>
    <p><strong>Email:</strong> ${customerInfo.email || '-'}</p>
    <p><strong>Dirección:</strong> ${customerInfo.address || 'No especificada'}</p>
    <hr>
    <p><em>Pedido recibido el ${new Date().toLocaleString('es-ES')}</em></p>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `🍕 Nuevo Pedido - ${customerInfo.name}`,
      html: emailContent
    });

    // Confirmación al cliente solo si hay email
    if (customerInfo.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customerInfo.email,
        subject: '✅ Confirmación de Pedido',
        html: `
          <h2>✅ Pedido Confirmado</h2>
          <p>Hola ${customerInfo.name},</p>
          <p>Hemos recibido tu pedido y lo estamos procesando.</p>
          <h3>📋 Resumen del Pedido:</h3>
          <pre>${orderDetails}</pre>
          <h3>💰 Total: $${total.toFixed(2)}</h3>
          <h3>⏰ Horario de Entrega: ${deliveryTime}</h3>
          <p>Te contactaremos pronto para confirmar los detalles de entrega.</p>
          <p>¡Gracias por tu pedido!</p>
        `
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pedido enviado correctamente',
      orderId: Date.now()
    });
  } catch (error) {
    console.error('Error al procesar pedido:', error);
    res.status(500).json({ error: 'Error al procesar el pedido' });
  }
}
