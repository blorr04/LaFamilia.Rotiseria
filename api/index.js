// /api/index.js - Homepage
const path = require('path');
const fs = require('fs');

module.exports = function handler(req, res) {
  try {
    // Leer y servir el archivo HTML principal
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlContent);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};