// /api/extras.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuración de extras
const extrasConfig = {
  cheddar: { name: "Cheddar", price: 1000 },
  papas: { name: "Papas Extra", price: 2000 }
};

module.exports = function handler(req, res) {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Retornar configuración de extras
  res.status(200).json(extrasConfig);
}