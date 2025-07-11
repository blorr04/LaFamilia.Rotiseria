// Variables globales
let menuItems = [];
let cart = [];
let total = 0;

// Elementos del DOM
const menuGrid = document.getElementById('menuGrid');
const cartItems = document.getElementById('cartItems');
const totalAmount = document.getElementById('totalAmount');
const customOrder = document.getElementById('customOrder');
const deliveryTime = document.getElementById('deliveryTime');
const customerName = document.getElementById('customerName');
const customerPhone = document.getElementById('customerPhone');
const customerEmail = document.getElementById('customerEmail');
const customerAddress = document.getElementById('customerAddress');
const submitOrder = document.getElementById('submitOrder');
const confirmationModal = document.getElementById('confirmationModal');
const orderId = document.getElementById('orderId');
const closeModal = document.getElementById('closeModal');
const loadingSpinner = document.getElementById('loadingSpinner');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadMenu();
    setupEventListeners();
});

// Cargar menú desde el servidor
async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        menuItems = await response.json();
        renderMenu();
    } catch (error) {
        console.error('Error cargando menú:', error);
        showError('Error cargando el menú. Por favor, recarga la página.');
    }
}

// Renderizar menú
function renderMenu() {
    menuGrid.innerHTML = '';
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.dataset.id = item.id;

        menuItem.innerHTML = `
            <h3>${item.name}</h3>
            <div class="price">$${item.price.toFixed(2)}</div>
            <div class="category">${item.category}</div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                <span class="quantity-display" id="qty-${item.id}">0</span>
                <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
        `;

        menuGrid.appendChild(menuItem);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Botón de envío
    submitOrder.addEventListener('click', handleOrderSubmission);

    // Cerrar modal
    closeModal.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
        resetForm();
    });

    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && confirmationModal.style.display === 'block') {
            confirmationModal.style.display = 'none';
            resetForm();
        }
    });

    // Actualizar total cuando cambie el pedido manual
    customOrder.addEventListener('input', updateTotal);
}

// Aumentar cantidad
function increaseQuantity(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    const existingItem = cart.find(i => i.id === itemId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: itemId, quantity: 1 });
    }

    updateQuantityDisplay(itemId);
    updateCart();
    updateTotal();
}

// Disminuir cantidad
function decreaseQuantity(itemId) {
    const existingItem = cart.find(i => i.id === itemId);
    if (!existingItem) return;

    if (existingItem.quantity > 1) {
        existingItem.quantity--;
    } else {
        cart = cart.filter(i => i.id !== itemId);
    }

    updateQuantityDisplay(itemId);
    updateCart();
    updateTotal();
}

// Actualizar display de cantidad
function updateQuantityDisplay(itemId) {
    const display = document.getElementById(`qty-${itemId}`);
    const item = cart.find(i => i.id === itemId);
    const quantity = item ? item.quantity : 0;

    display.textContent = quantity;

    // Actualizar estilo del item
    const menuItem = document.querySelector(`[data-id="${itemId}"]`);
    if (quantity > 0) {
        menuItem.classList.add('selected');
    } else {
        menuItem.classList.remove('selected');
    }
}

// Actualizar carrito
function updateCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">No hay productos seleccionados</p>';
        return;
    }

    cartItems.innerHTML = '';

    cart.forEach(item => {
        const menuItem = menuItems.find(mi => mi.id === item.id);
        if (!menuItem) return;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${menuItem.name}</div>
                <div class="cart-item-price">$${menuItem.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <div class="cart-item-total">$${(menuItem.price * item.quantity).toFixed(2)}</div>
        `;

        cartItems.appendChild(cartItem);
    });
}

// Actualizar total
function updateTotal() {
    total = 0;

    // Sumar productos del carrito
    cart.forEach(item => {
        const menuItem = menuItems.find(mi => mi.id === item.id);
        if (menuItem) {
            total += menuItem.price * item.quantity;
        }
    });

    // Sumar cargo por pedido manual
    if (customOrder.value.trim()) {
        total += 5.00;
    }

    totalAmount.textContent = total.toFixed(2);
}

// Validar formulario
function validateForm() {
    const errors = [];

    // Validar productos o pedido manual
    if (cart.length === 0 && !customOrder.value.trim()) {
        errors.push('Debes seleccionar al menos un producto o escribir un pedido manual');
    }

    // Validar horario de entrega (input de texto)
    if (!deliveryTime.value.trim()) {
        errors.push('Debes ingresar un horario de entrega');
    }

    // Validar información del cliente
    if (!customerName.value.trim()) {
        errors.push('El nombre es obligatorio');
    }
    if (!customerAddress.value.trim()) {
        errors.push('La dirección es obligatoria');
    }
    // Teléfono y email son opcionales, pero si se ingresa email, validar formato
    if (customerEmail.value.trim() && !isValidEmail(customerEmail.value)) {
        errors.push('El email no tiene un formato válido');
    }

    return errors;
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mostrar errores
function showError(message) {
    alert(message); // Puedes mejorar esto con notificaciones visuales si lo deseas
}

// Manejar envío del pedido
async function handleOrderSubmission() {
    const errors = validateForm();

    if (errors.length > 0) {
        showError(errors.join('\n'));
        return;
    }

    // Mostrar loading
    loadingSpinner.style.display = 'flex';
    submitOrder.disabled = true;

    try {
        // Preparar datos del pedido
        // Enviamos los productos con nombre y precio para que el backend pueda armar el detalle correctamente
        const items = cart.map(item => {
            const menuItem = menuItems.find(mi => mi.id === item.id);
            return menuItem ? {
                id: item.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity
            } : null;
        }).filter(Boolean);

        const orderData = {
            items,
            customOrder: customOrder.value.trim(),
            deliveryTime: deliveryTime.value.trim(),
            customerInfo: {
                name: customerName.value.trim(),
                phone: customerPhone.value.trim(),
                email: customerEmail.value.trim(),
                address: customerAddress.value.trim()
            }
        };

        // Enviar pedido
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            // Mostrar confirmación
            orderId.textContent = result.orderId;
            confirmationModal.style.display = 'block';
        } else {
            showError(result.error || 'Error al enviar el pedido');
        }

    } catch (error) {
        console.error('Error enviando pedido:', error);
        showError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
        // Ocultar loading
        loadingSpinner.style.display = 'none';
        submitOrder.disabled = false;
    }
}

// Resetear formulario
function resetForm() {
    // Limpiar carrito
    cart = [];
    updateCart();
    updateTotal();

    // Resetear cantidades
    menuItems.forEach(item => {
        updateQuantityDisplay(item.id);
    });

    // Limpiar formulario
    customOrder.value = '';
    deliveryTime.value = '';
    customerName.value = '';
    customerPhone.value = '';
    customerEmail.value = '';
    customerAddress.value = '';

    // Habilitar botón
    submitOrder.disabled = false;
}