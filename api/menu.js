// /api/menu.js

export default function handler(req, res) {
  const menuItems = [
    // PAPAS
    { id: 1, name: "Papas Chicas", price: 3500, category: "Papas" },
    { id: 2, name: "Papas Grandes", price: 5000, category: "Papas" },
    { id: 3, name: "Papas con Cheddar", price: 6000, category: "Papas" },

    // HAMBURGUESA
    { id: 4, name: "Hamburguesa Común + Papas", price: 6000, category: "Hamburguesa" },
    { id: 5, name: "Hamburguesa Especial + Papas", price: 7500, category: "Hamburguesa" },

    // TORPEDO
    { id: 6, name: "Torpedo Común", price: 7000, category: "Torpedo" },
    { id: 7, name: "Torpedo con Hamburguesa", price: 8500, category: "Torpedo" },
    { id: 8, name: "Torpedo con Suprema", price: 8500, category: "Torpedo" },
    { id: 9, name: "Torpedo con Milanesa", price: 9500, category: "Torpedo" },

    // CARLITO
    { id: 10, name: "Carlito Común", price: 6000, category: "Carlito" },
    { id: 11, name: "Carlito Especial", price: 7000, category: "Carlito" },
    { id: 12, name: "Carlito de Pollo", price: 8000, category: "Carlito" },

    // PIZZANESA + PAPAS
    { id: 13, name: "Pizzanesa de Pollo + Papas (Para 2)", price: 16000, category: "Pizzanesa + Papas" },
    { id: 14, name: "Pizzanesa de Pollo + Papas (Para 4)", price: 20000, category: "Pizzanesa + Papas" },
    { id: 15, name: "Pizzanesa de Carne + Papas (Para 2)", price: 20000, category: "Pizzanesa + Papas" },
    { id: 16, name: "Pizzanesa de Carne + Papas (Para 4)", price: 22000, category: "Pizzanesa + Papas" },
    { id: 17, name: "Explosiva de Pollo + Papas (Para 2)", price: 22000, category: "Pizzanesa + Papas" },
    { id: 18, name: "Explosiva de Pollo + Papas (Para 4)", price: 24000, category: "Pizzanesa + Papas" },
    { id: 19, name: "Explosiva de Carne + Papas (Para 2)", price: 24000, category: "Pizzanesa + Papas" },
    { id: 20, name: "Explosiva de Carne + Papas (Para 4)", price: 26000, category: "Pizzanesa + Papas" },

    // EMPANADAS
    { id: 21, name: "Empanada (Unidad)", price: 1500, category: "Empanadas" },
    { id: 22, name: "Empanadas (Docena)", price: 16000, category: "Empanadas" },
    { id: 23, name: "Empanada de Carne Dulce", price: 1500, category: "Empanadas" },
    { id: 24, name: "Empanada de Carne Salada", price: 1500, category: "Empanadas" },
    { id: 25, name: "Empanada de Jamón y Queso", price: 1500, category: "Empanadas" },
    { id: 26, name: "Empanada de Pollo", price: 1500, category: "Empanadas" },
    { id: 27, name: "Empanada de Verdura", price: 1500, category: "Empanadas" },
    { id: 28, name: "Empanada de Humita", price: 1500, category: "Empanadas" },

    // PIZZA (molde)
    { id: 29, name: "Pizza Muzzarella (molde, 4 porciones)", price: 5000, category: "Pizza Molde" },
    { id: 30, name: "Pizza Muzzarella (molde, 8 porciones)", price: 8500, category: "Pizza Molde" },
    { id: 31, name: "Pizza Especial (molde, 4 porciones)", price: 6500, category: "Pizza Molde" },
    { id: 32, name: "Pizza Especial (molde, 8 porciones)", price: 13000, category: "Pizza Molde" },
    { id: 33, name: "Pizza Napolitana (molde, 4 porciones)", price: 6500, category: "Pizza Molde" },
    { id: 34, name: "Pizza Napolitana (molde, 8 porciones)", price: 13000, category: "Pizza Molde" },
    { id: 35, name: "Pizza Pollo a la Crema (molde, 4 porciones)", price: 7500, category: "Pizza Molde" },
    { id: 36, name: "Pizza Pollo a la Crema (molde, 8 porciones)", price: 14000, category: "Pizza Molde" },
    { id: 37, name: "Pizza Roquefort (molde, 4 porciones)", price: 6500, category: "Pizza Molde" },
    { id: 38, name: "Pizza Roquefort (molde, 8 porciones)", price: 12000, category: "Pizza Molde" },
    { id: 39, name: "Pizza Explosiva (molde, 4 porciones)", price: 8000, category: "Pizza Molde" },
    { id: 40, name: "Pizza Explosiva (molde, 8 porciones)", price: 16000, category: "Pizza Molde" },

    // PIZZA (parrilla)
    { id: 41, name: "Pizza Muzzarella (parrilla, 6 porciones)", price: 5500, category: "Pizza Parrilla" },
    { id: 42, name: "Pizza Muzzarella (parrilla, 12 porciones)", price: 9000, category: "Pizza Parrilla" },
    { id: 43, name: "Pizza Especial (parrilla, 6 porciones)", price: 6000, category: "Pizza Parrilla" },
    { id: 44, name: "Pizza Especial (parrilla, 12 porciones)", price: 12000, category: "Pizza Parrilla" },
    { id: 45, name: "Pizza Napolitana (parrilla, 6 porciones)", price: 7000, category: "Pizza Parrilla" },
    { id: 46, name: "Pizza Napolitana (parrilla, 12 porciones)", price: 13000, category: "Pizza Parrilla" },
    { id: 47, name: "Pizza Pollo a la Crema (parrilla, 6 porciones)", price: 7500, category: "Pizza Parrilla" },
    { id: 48, name: "Pizza Pollo a la Crema (parrilla, 12 porciones)", price: 14000, category: "Pizza Parrilla" },
    { id: 49, name: "Pizza Roquefort (parrilla, 6 porciones)", price: 7000, category: "Pizza Parrilla" },
    { id: 50, name: "Pizza Roquefort (parrilla, 12 porciones)", price: 14000, category: "Pizza Parrilla" },
    { id: 51, name: "Pizza Explosiva (parrilla, 6 porciones)", price: 9500, category: "Pizza Parrilla" },
    { id: 52, name: "Pizza Explosiva (parrilla, 12 porciones)", price: 18000, category: "Pizza Parrilla" },

    // LOMITO
    { id: 53, name: "Lomito Simple", price: 8000, category: "Lomito" },
    { id: 54, name: "Lomito Especial", price: 8500, category: "Lomito" },
    { id: 55, name: "Lomito Super", price: 9000, category: "Lomito" },

    // PROMOCIONES
    { id: 56, name: "Lomito esp + Papas (PROMO 1)", price: 15000, category: "Promociones" },
    { id: 57, name: "2 Hamburguesas esp + Papas (PROMO 2)", price: 15000, category: "Promociones" },
    { id: 58, name: "Torpedo + Papas + Carlito (PROMO 3)", price: 14000, category: "Promociones" },
    { id: 59, name: "Pizza De Muzzarella + 3 Empanadas (PROMO 4)", price: 14000, category: "Promociones" }
  ];
  res.status(200).json(menuItems);
}
