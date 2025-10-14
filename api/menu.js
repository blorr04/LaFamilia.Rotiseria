// /api/menu.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Datos del menú
const menuItems = [
  // 🥔 PAPAS
  { id: 1, name: "Papas Chicas", price: 4000, category: "PAPAS", hasExtras: true, extraType: "cheddar", isActive: true },
  { id: 2, name: "Papas Grandes", price: 6000, category: "PAPAS", hasExtras: true, extraType: "cheddar", isActive: true },

  // 🍔 HAMBURGUESA CASERA
  { id: 3, name: "Hamburguesa Especial + Papas", price: 8500, category: "HAMBURGUESA CASERA", isActive: true },
  { id: 4, name: "Hamburguesa Simple con Cheddar + Papas", price: 7000, category: "HAMBURGUESA CASERA", isActive: true },
  { id: 5, name: "Hamburguesa Doble con Cheddar y Bacon", price: 9500, category: "HAMBURGUESA CASERA", isActive: true },
  { id: 6, name: "Hamburguesa Mega Boom Doble", price: 10500, category: "HAMBURGUESA CASERA", isActive: true },

  // 🌭 TORPEDO
  { id: 7, name: "Torpedo Común", price: 8000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 8, name: "Torpedo Común + Hamburguesa", price: 10000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 9, name: "Torpedo Común + Suprema", price: 10000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 10, name: "Torpedo Común + Milanesa", price: 11000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 11, name: "Torpedo Especial", price: 8500, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 12, name: "Torpedo Especial + Hamburguesa", price: 10000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 13, name: "Torpedo Especial + Suprema", price: 9000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 14, name: "Torpedo Especial + Milanesa", price: 10000, category: "TORPEDO", hasExtras: true, extraType: "papas", isActive: true },

  // 🥪 CARLITO
  { id: 15, name: "Carlito Común", price: 6500, category: "CARLITO", isActive: true },
  { id: 16, name: "Carlito Especial", price: 7500, category: "CARLITO", isActive: true },
  { id: 17, name: "Carlito de Pollo", price: 8500, category: "CARLITO", isActive: true },
  { id: 18, name: "Carlipizza", price: 9500, category: "CARLITO", isActive: true },

  // 🍕 PIZZANESA + PAPAS (Para 2 personas)
  { id: 19, name: "Pizzanesa de Pollo (Muzza) Para 2", price: 20000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 20, name: "Pizzanesa de Carne (Muzza) Para 2", price: 21000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 21, name: "Pizzanesa Especial de Pollo Para 2", price: 22000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 22, name: "Pizzanesa Especial de Carne Para 2", price: 23000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 23, name: "Pizzanesa Explosiva de Pollo Para 2", price: 24000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 24, name: "Pizzanesa Explosiva de Carne Para 2", price: 25000, category: "PIZZANESA + PAPAS", isActive: true },

  // 🍕 PIZZANESA + PAPAS (Para 4 personas)
  { id: 25, name: "Pizzanesa de Pollo (Muzza) Para 4", price: 22000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 26, name: "Pizzanesa de Carne (Muzza) Para 4", price: 23000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 27, name: "Pizzanesa Especial de Pollo Para 4", price: 24000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 28, name: "Pizzanesa Especial de Carne Para 4", price: 25000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 29, name: "Pizzanesa Explosiva de Pollo Para 4", price: 26000, category: "PIZZANESA + PAPAS", isActive: true },
  { id: 30, name: "Pizzanesa Explosiva de Carne Para 4", price: 28000, category: "PIZZANESA + PAPAS", isActive: true },

  // 🥟 EMPANADAS
  { id: 31, name: "Empanada (Unidad)", price: 1500, category: "EMPANADAS", isActive: true },
  { id: 32, name: "Empanadas (Docena)", price: 16000, category: "EMPANADAS", isActive: true },
  
  // SABORES DE EMPANADAS (sin precio - solo para seleccionar sabores)
  { id: 33, name: "De Carne Dulce", price: 0, category: "EMPANADAS SABORES", isFlavor: true, isActive: true },
  { id: 34, name: "De Carne Salada", price: 0, category: "EMPANADAS SABORES", isFlavor: true, isActive: true },
  { id: 35, name: "De Jamón y Queso", price: 0, category: "EMPANADAS SABORES", isFlavor: true, isActive: true },
  { id: 36, name: "De Pollo", price: 0, category: "EMPANADAS SABORES", isFlavor: true, isActive: true },
  { id: 37, name: "De Verdura", price: 0, category: "EMPANADAS SABORES", isFlavor: true, isActive: true },
  { id: 38, name: "De Humita", price: 0, category: "EMPANADAS SABORES", isFlavor: true, isActive: true },

  // 🍕 PIZZA (MOLDE) - Media
  { id: 39, name: "Pizza Muzzarella (molde, Media)", price: 5000, category: "PIZZA MOLDE", isActive: true },
  { id: 40, name: "Pizza Especial (molde, Media)", price: 6500, category: "PIZZA MOLDE", isActive: true },
  { id: 41, name: "Pizza Napolitana (molde, Media)", price: 6500, category: "PIZZA MOLDE", isActive: true },
  { id: 42, name: "Pizza Pollo a la Crema (molde, Media)", price: 8000, category: "PIZZA MOLDE", isActive: true },
  { id: 43, name: "Pizza Roquefort (molde, Media)", price: 6500, category: "PIZZA MOLDE", isActive: true },
  { id: 44, name: "Pizza Explosiva (molde, Media)", price: 8500, category: "PIZZA MOLDE", isActive: true },

  // 🍕 PIZZA (MOLDE) - Entera
  { id: 45, name: "Pizza Muzzarella (molde, Entera)", price: 9000, category: "PIZZA MOLDE", isActive: true },
  { id: 46, name: "Pizza Especial (molde, Entera)", price: 10500, category: "PIZZA MOLDE", isActive: true },
  { id: 47, name: "Pizza Napolitana (molde, Entera)", price: 10500, category: "PIZZA MOLDE", isActive: true },
  { id: 48, name: "Pizza Pollo a la Crema (molde, Entera)", price: 15000, category: "PIZZA MOLDE", isActive: true },
  { id: 49, name: "Pizza Roquefort (molde, Entera)", price: 12000, category: "PIZZA MOLDE", isActive: true },
  { id: 50, name: "Pizza Explosiva (molde, Entera)", price: 16000, category: "PIZZA MOLDE", isActive: true },

  // 🍕 PIZZA (PARRILLA) - Media
  { id: 51, name: "Pizza Muzzarella (parrilla, Media)", price: 6000, category: "PIZZA PARRILLA", isActive: true },
  { id: 52, name: "Pizza Especial (parrilla, Media)", price: 7500, category: "PIZZA PARRILLA", isActive: true },
  { id: 53, name: "Pizza Napolitana (parrilla, Media)", price: 7500, category: "PIZZA PARRILLA", isActive: true },
  { id: 54, name: "Pizza Pollo a la Crema (parrilla, Media)", price: 8500, category: "PIZZA PARRILLA", isActive: true },
  { id: 55, name: "Pizza Roquefort (parrilla, Media)", price: 7500, category: "PIZZA PARRILLA", isActive: true },
  { id: 56, name: "Pizza Explosiva (parrilla, Media)", price: 9500, category: "PIZZA PARRILLA", isActive: true },

  // 🍕 PIZZA (PARRILLA) - Entera
  { id: 57, name: "Pizza Muzzarella (parrilla, Entera)", price: 10000, category: "PIZZA PARRILLA", isActive: true },
  { id: 58, name: "Pizza Especial (parrilla, Entera)", price: 12500, category: "PIZZA PARRILLA", isActive: true },
  { id: 59, name: "Pizza Napolitana (parrilla, Entera)", price: 13000, category: "PIZZA PARRILLA", isActive: true },
  { id: 60, name: "Pizza Pollo a la Crema (parrilla, Entera)", price: 16000, category: "PIZZA PARRILLA", isActive: true },
  { id: 61, name: "Pizza Roquefort (parrilla, Entera)", price: 14000, category: "PIZZA PARRILLA", isActive: true },
  { id: 62, name: "Pizza Explosiva (parrilla, Entera)", price: 18500, category: "PIZZA PARRILLA", isActive: true },

  // 🥩 LOMITO
  { id: 63, name: "Lomito Simple", price: 8500, category: "LOMITO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 64, name: "Lomito Especial", price: 9000, category: "LOMITO", hasExtras: true, extraType: "papas", isActive: true },
  { id: 65, name: "Lomito Super", price: 10000, category: "LOMITO", hasExtras: true, extraType: "papas", isActive: true }
];

module.exports = function handler(req, res) {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Filtrar solo productos activos para el menú público
  const activeItems = menuItems.filter(item => item.isActive !== false);

  // Retornar menú
  res.status(200).json(activeItems);
};