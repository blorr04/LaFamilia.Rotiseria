// /api/status.js - Controlar estado de pedidos
const path = require('path');
const fs = require('fs');

// Archivo para guardar el estado
const statusFile = path.join(__dirname, '..', 'restaurant-status.json');

// Estado por defecto
const defaultStatus = {
  isOpen: true,
  lastChanged: new Date().toISOString(),
  message: "Estamos recibiendo pedidos normalmente"
};

// Leer estado actual
function getStatus() {
  try {
    if (fs.existsSync(statusFile)) {
      const data = fs.readFileSync(statusFile, 'utf-8');
      return JSON.parse(data);
    }
    return defaultStatus;
  } catch (error) {
    console.error('Error reading status:', error);
    return defaultStatus;
  }
}

// Guardar estado
function saveStatus(status) {
  try {
    fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving status:', error);
    return false;
  }
}

module.exports = function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener estado actual
    const status = getStatus();
    return res.status(200).json(status);
  }
  
  if (req.method === 'POST') {
    // Cambiar estado (solo con contraseña)
    const { password, isOpen, message } = req.body;
    
    // Verificar contraseña
    if (password !== 'pancito1954') {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    
    // Crear nuevo estado
    const newStatus = {
      isOpen: isOpen,
      lastChanged: new Date().toISOString(),
      message: message || (isOpen ? "Estamos recibiendo pedidos normalmente" : "No estamos recibiendo pedidos en este momento")
    };
    
    // Guardar estado
    if (saveStatus(newStatus)) {
      console.log(`🎛️ Estado cambiado: ${isOpen ? 'ABIERTO' : 'CERRADO'} - ${new Date().toLocaleString('es-ES')}`);
      return res.status(200).json({ success: true, status: newStatus });
    } else {
      return res.status(500).json({ error: 'Error al guardar estado' });
    }
  }
  
  return res.status(405).json({ error: 'Método no permitido' });
};