// Variables globales
let menuItems = [];
let cart = [];
let total = 0;

// Elementos del DOM
const menuGrid = document.getElementById('menuGrid');
const cartItems = document.getElementById('cartItems');
const totalAmount = document.getElementById('totalAmount');
const customerName = document.getElementById('customerName');
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

// Renderizar menú agrupado por categorías
function renderMenu() {
    menuGrid.innerHTML = '';
    
    // Agrupar productos por categoría
    const categories = {};
    menuItems.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        categories[item.category].push(item);
    });

    // Renderizar cada categoría
    Object.keys(categories).forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category;
        categorySection.appendChild(categoryTitle);

        const categoryGrid = document.createElement('div');
        categoryGrid.className = 'category-grid';

        categories[category].forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.dataset.id = item.id;

            menuItem.innerHTML = `
                <h4>${item.name}</h4>
                <div class="price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                    <span class="quantity-display" id="qty-${item.id}">0</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                </div>
            `;

            categoryGrid.appendChild(menuItem);
        });

        categorySection.appendChild(categoryGrid);
        menuGrid.appendChild(categorySection);
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
    if (!display) return;
    
    const item = cart.find(i => i.id === itemId);
    const quantity = item ? item.quantity : 0;

    display.textContent = quantity;

    // Actualizar estilo del item
    const menuItem = document.querySelector(`[data-id="${itemId}"]`);
    if (menuItem) {
        if (quantity > 0) {
            menuItem.classList.add('selected');
        } else {
            menuItem.classList.remove('selected');
        }
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

    totalAmount.textContent = total.toFixed(2);
}

// Validar formulario
function validateForm() {
    const errors = [];

    // Validar productos
    if (cart.length === 0) {
        errors.push('Debes seleccionar al menos un producto');
    }

    // Validar información del cliente (solo nombre y dirección obligatorios)
    if (!customerName.value.trim()) {
        errors.push('El nombre es obligatorio');
    }
    if (!customerAddress.value.trim()) {
        errors.push('La dirección es obligatoria');
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
    // Crear un modal de error más visible
    const errorModal = document.createElement('div');
    errorModal.className = 'modal';
    errorModal.style.display = 'block';
    errorModal.style.zIndex = '3000';
    
    errorModal.innerHTML = `
        <div class="modal-content" style="background-color: #ffebee; border-left: 4px solid #f44336;">
            <div class="modal-header" style="background: #f44336; color: white;">
                <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
            </div>
            <div class="modal-body">
                <p style="color: #d32f2f; font-size: 16px;">${message}</p>
            </div>
            <div class="modal-footer">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-secondary">Cerrar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorModal);
    
    // También mostrar en consola para debugging
    console.error('Error mostrado al usuario:', message);
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
            customerInfo: {
                name: customerName.value.trim(),
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
        
        // Mensaje de error más específico
        let errorMessage = 'Error de conexión. Por favor, intenta nuevamente.';
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = '🚫 El servicio de pedidos no está disponible en este momento. Por favor, intenta más tarde o contacta al restaurante directamente.';
        } else if (error.message.includes('timeout')) {
            errorMessage = '⏰ Tiempo de espera agotado. El servicio puede estar ocupado. Intenta nuevamente.';
        }
        
        showError(errorMessage);
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
    customerName.value = '';
    customerAddress.value = '';

    // Habilitar botón
    submitOrder.disabled = false;
}