// /api/menu.js

export default function handler(req, res) {
  const menuItems = [
    { id: 101, name: "Pizzanesa de Pollo + Papas", price: 16000, category: "PROMO 1", promo: true },
    { id: 102, name: "Pizzanesa de Carne + Papas", price: 16000, category: "PROMO 1", promo: true },
    { id: 103, name: "Explosiva de Pollo + Papas", price: 22000, category: "PROMO 1", promo: true },
    { id: 104, name: "Explosiva de Carne + Papas", price: 24000, category: "PROMO 1", promo: true },
    { id: 201, name: "2 Hamburguesas + 2 Papas (PROMO 2)", price: 15000, category: "PROMO", promo: true },
    { id: 202, name: "Torpedo + Papas + Carlito (PROMO 3)", price: 15000, category: "PROMO", promo: true },
    { id: 203, name: "Pizza de Muzzarella + 6 Empanadas (PROMO 4)", price: 14000, category: "PROMO", promo: true },
    { id: 1, name: "Papas Chicas", price: 3500, category: "Papas" },
    { id: 2, name: "Papas Grandes", price: 5000, category: "Papas" },
    { id: 3, name: "Papas con Cheddar", price: 6000, category: "Papas" },
    { id: 4, name: "Hamburguesa Común + Papas", price: 6000, category: "Hamburguesa" },
    { id: 5, name: "Hamburguesa Especial + Papas", price: 7500, category: "Hamburguesa" },
    { id: 6, name: "Torpedo Común", price: 7000, category: "Torpedo" },
    { id: 7, name: "Torpedo con Hamburguesa", price: 8000, category: "Torpedo" },
    { id: 8, name: "Torpedo con Suprema", price: 8500, category: "Torpedo" },
    { id: 9, name: "Torpedo con Milanesa", price: 8500, category: "Torpedo" },
    { id: 10, name: "Carlito Común", price: 6000, category: "Carlito" },
    { id: 11, name: "Carlito Especial", price: 7000, category: "Carlito" },
    { id: 12, name: "Carlito de Pollo", price: 8000, category: "Carlito" },
    { id: 13, name: "Empanada (Unidad)", price: 1500, category: "Empanadas" },
    { id: 14, name: "Empanadas (Docena)", price: 16000, category: "Empanadas" },
    { id: 15, name: "Empanada de Carne Dulce", price: 1500, category: "Empanadas" },
    { id: 16, name: "Empanada de Carne Salada", price: 1500, category: "Empanadas" },
    { id: 17, name: "Empanada de Jamón y Queso", price: 1500, category: "Empanadas" },
    { id: 18, name: "Empanada de Pollo", price: 1500, category: "Empanadas" },
    { id: 19, name: "Empanada de Verdura", price: 1500, category: "Empanadas" },
    { id: 20, name: "Empanada de Humita", price: 1500, category: "Empanadas" },
    { id: 21, name: "Pizza Muzzarella (4 porciones)", price: 5000, category: "Pizza" },
    { id: 22, name: "Pizza Muzzarella (8 porciones)", price: 9000, category: "Pizza" },
    { id: 23, name: "Pizza Especial (4 porciones)", price: 6500, category: "Pizza" },
    { id: 24, name: "Pizza Especial (8 porciones)", price: 13000, category: "Pizza" },
    { id: 25, name: "Pizza Napolitana (4 porciones)", price: 6500, category: "Pizza" },
    { id: 26, name: "Pizza Napolitana (8 porciones)", price: 13000, category: "Pizza" },
    { id: 27, name: "Pizza Pollo a la Crema (4 porciones)", price: 7500, category: "Pizza" },
    { id: 28, name: "Pizza Pollo a la Crema (8 porciones)", price: 14000, category: "Pizza" }
  ];
  res.status(200).json(menuItems);
}
