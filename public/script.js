// Variables globales
let menuItems = [];
let cart = []; // Productos con precio
let flavors = []; // Sabores de empanadas (sin precio)
let extrasConfig = {}; // Configuración de extras
let total = 0;
let restaurantStatus = { isOpen: true }; // Estado del restaurante

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
const mobileCartButton = document.getElementById('mobileCartButton');
const cartTotalMobile = document.querySelector('.cart-total-mobile');

// Inicialización
document.addEventListener('DOMContentLoaded', async function() {
    await loadRestaurantStatus(); // Verificar si está abierto
    await loadExtras(); // Cargar extras PRIMERO
    await loadMenu();   // Luego cargar menú (que renderiza)
    setupEventListeners();
    
    // Verificar estado cada 30 segundos
    setInterval(loadRestaurantStatus, 30000);
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

// Cargar estado del restaurante
async function loadRestaurantStatus() {
    try {
        const response = await fetch('/api/status');
        restaurantStatus = await response.json();
        updateRestaurantStatus();
    } catch (error) {
        console.error('Error cargando estado del restaurante:', error);
        // Si no puede cargar el estado, asume que está abierto
        restaurantStatus = { isOpen: true };
        updateRestaurantStatus();
    }
}

// Cargar configuración de extras
async function loadExtras() {
    try {
        const response = await fetch('/api/extras');
        extrasConfig = await response.json();
    } catch (error) {
        console.error('Error cargando extras:', error);
        // No mostramos error al usuario porque los extras son opcionales
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
            menuItem.dataset.category = item.category;

            // Mostrar precio diferente para sabores
            const priceDisplay = item.isFlavor ? 'Sabor' : `$${item.price.toFixed(2)}`;

            let extrasHTML = '';
            if (item.hasExtras && extrasConfig[item.extraType]) {
                const extra = extrasConfig[item.extraType];
                extrasHTML = `
                    <div class="extras-section">
                        <label class="extra-checkbox">
                            <input type="checkbox" id="extra-${item.id}" onchange="toggleExtra(${item.id}, '${item.extraType}')">
                            <span class="checkmark"></span>
                            ${extra.name} (+$${extra.price})
                        </label>
                        <div class="extra-quantity-controls" id="extra-controls-${item.id}" style="display: none;">
                            <button class="quantity-btn small" onclick="decreaseExtraQuantity(${item.id}, '${item.extraType}')">-</button>
                            <span class="quantity-display" id="extra-qty-${item.id}">0</span>
                            <button class="quantity-btn small" onclick="increaseExtraQuantity(${item.id}, '${item.extraType}')">+</button>
                        </div>
                    </div>
                `;
            }

            menuItem.innerHTML = `
                <h4>${item.name}</h4>
                <div class="price">${priceDisplay}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                    <span class="quantity-display" id="qty-${item.id}">0</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                </div>
                ${extrasHTML}
            `;

            categoryGrid.appendChild(menuItem);
        });

        categorySection.appendChild(categoryGrid);
        menuGrid.appendChild(categorySection);
    });
    
    // Actualizar estado del botón de envío después de renderizar
    updateSubmitButton();
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

    // Botón móvil para ir al carrito
    if (mobileCartButton) {
        mobileCartButton.addEventListener('click', function() {
            // Scroll suave al carrito
            const cartSection = document.querySelector('.cart-section');
            if (cartSection) {
                cartSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Aumentar cantidad
function increaseQuantity(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    // Si es un sabor de empanada (sin precio), manejar diferente
    if (item.isFlavor) {
        const existingFlavor = flavors.find(i => i.id === itemId);
        if (existingFlavor) {
            existingFlavor.quantity++;
        } else {
            flavors.push({ id: itemId, quantity: 1 });
        }
    } else {
        // Producto normal con precio
        const existingItem = cart.find(i => i.id === itemId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: itemId, quantity: 1 });
        }
    }

    updateQuantityDisplay(itemId);
    updateCart();
    updateTotal();
}

// Disminuir cantidad
function decreaseQuantity(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    // Si es un sabor de empanada (sin precio), manejar diferente
    if (item.isFlavor) {
        const existingFlavor = flavors.find(i => i.id === itemId);
        if (!existingFlavor) return;

        if (existingFlavor.quantity > 1) {
            existingFlavor.quantity--;
        } else {
            flavors = flavors.filter(i => i.id !== itemId);
        }
    } else {
        // Producto normal con precio
        const existingItem = cart.find(i => i.id === itemId);
        if (!existingItem) return;

        if (existingItem.quantity > 1) {
            existingItem.quantity--;
        } else {
            cart = cart.filter(i => i.id !== itemId);
        }
    }

    updateQuantityDisplay(itemId);
    updateCart();
    updateTotal();
}

// Actualizar display de cantidad
function updateQuantityDisplay(itemId) {
    const display = document.getElementById(`qty-${itemId}`);
    if (!display) return;
    
    // Buscar en cart o flavors según corresponda
    const cartItem = cart.find(i => i.id === itemId);
    const flavorItem = flavors.find(i => i.id === itemId);
    const quantity = cartItem ? cartItem.quantity : (flavorItem ? flavorItem.quantity : 0);

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

// Funciones para manejar extras
function toggleExtra(itemId, extraType) {
    const checkbox = document.getElementById(`extra-${itemId}`);
    const controls = document.getElementById(`extra-controls-${itemId}`);
    const extraQtyDisplay = document.getElementById(`extra-qty-${itemId}`);
    
    if (checkbox.checked) {
        controls.style.display = 'flex';
        setExtraQuantity(itemId, extraType, 1);
        extraQtyDisplay.textContent = '1';
    } else {
        controls.style.display = 'none';
        setExtraQuantity(itemId, extraType, 0);
        extraQtyDisplay.textContent = '0';
    }
    
    updateCart();
    updateTotal();
}

function increaseExtraQuantity(itemId, extraType) {
    const currentQty = getExtraQuantity(itemId, extraType);
    const newQty = currentQty + 1;
    setExtraQuantity(itemId, extraType, newQty);
    document.getElementById(`extra-qty-${itemId}`).textContent = newQty;
    updateCart();
    updateTotal();
}

function decreaseExtraQuantity(itemId, extraType) {
    const currentQty = getExtraQuantity(itemId, extraType);
    if (currentQty > 1) {
        const newQty = currentQty - 1;
        setExtraQuantity(itemId, extraType, newQty);
        document.getElementById(`extra-qty-${itemId}`).textContent = newQty;
    } else {
        // Si llega a 0, desactivar el checkbox
        setExtraQuantity(itemId, extraType, 0);
        document.getElementById(`extra-qty-${itemId}`).textContent = '0';
        document.getElementById(`extra-${itemId}`).checked = false;
        document.getElementById(`extra-controls-${itemId}`).style.display = 'none';
    }
    updateCart();
    updateTotal();
}

function getExtraQuantity(itemId, extraType) {
    const cartItem = cart.find(item => item.id === itemId);
    if (cartItem && cartItem.extras && cartItem.extras[extraType]) {
        return cartItem.extras[extraType];
    }
    return 0;
}

function setExtraQuantity(itemId, extraType, quantity) {
    let cartItem = cart.find(item => item.id === itemId);
    if (!cartItem) {
        // Si el producto no está en el carrito, lo agregamos con cantidad 0
        const menuItem = menuItems.find(mi => mi.id === itemId);
        if (menuItem) {
            cartItem = {
                id: itemId,
                quantity: 0,
                extras: {}
            };
            cart.push(cartItem);
        }
    }
    
    if (cartItem) {
        if (!cartItem.extras) cartItem.extras = {};
        if (quantity > 0) {
            cartItem.extras[extraType] = quantity;
        } else {
            delete cartItem.extras[extraType];
        }
    }
}

// Actualizar carrito
function updateCart() {
    if (cart.length === 0 && flavors.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">No hay productos seleccionados</p>';
        return;
    }

    cartItems.innerHTML = '';

    // Mostrar productos con precio
    cart.forEach(item => {
        const menuItem = menuItems.find(mi => mi.id === item.id);
        if (!menuItem || item.quantity === 0) return;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        let itemTotal = menuItem.price * item.quantity;
        let extrasHTML = '';

        // Agregar extras si existen
        if (item.extras) {
            Object.keys(item.extras).forEach(extraType => {
                const extraQuantity = item.extras[extraType];
                if (extraQuantity > 0 && extrasConfig[extraType]) {
                    const extraPrice = extrasConfig[extraType].price * extraQuantity;
                    itemTotal += extraPrice;
                    extrasHTML += `
                        <div class="cart-extra">
                            + ${extrasConfig[extraType].name} x${extraQuantity} - $${extraPrice.toFixed(2)}
                        </div>
                    `;
                }
            });
        }

        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${menuItem.name}</div>
                <div class="cart-item-price">$${menuItem.price.toFixed(2)} x ${item.quantity}</div>
                ${extrasHTML}
            </div>
            <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
        `;

        cartItems.appendChild(cartItem);
    });

    // Mostrar sabores de empanadas (sin precio)
    if (flavors.length > 0) {
        const flavorSection = document.createElement('div');
        flavorSection.className = 'flavor-section';
        
        const flavorTitle = document.createElement('div');
        flavorTitle.className = 'flavor-title';
        flavorTitle.innerHTML = '<h4 style="color: #667eea; margin: 15px 0 10px 0;">🥟 Sabores de Empanadas:</h4>';
        flavorSection.appendChild(flavorTitle);

        flavors.forEach(flavor => {
            const menuItem = menuItems.find(mi => mi.id === flavor.id);
            if (!menuItem) return;

            const flavorItem = document.createElement('div');
            flavorItem.className = 'flavor-item';
            flavorItem.style.cssText = 'padding: 8px 0; border-left: 3px solid #667eea; padding-left: 15px; margin: 5px 0; background-color: #f8f9fa;';

            flavorItem.innerHTML = `
                <div class="flavor-info">
                    <div class="flavor-name" style="font-weight: 600; color: #333;">${menuItem.name}</div>
                    <div class="flavor-quantity" style="color: #667eea; font-size: 0.9rem;">${menuItem.name} x ${flavor.quantity}</div>
                </div>
            `;

            flavorSection.appendChild(flavorItem);
        });

        cartItems.appendChild(flavorSection);
    }
}

// Actualizar total
function updateTotal() {
    total = 0;

    // Sumar productos del carrito
    cart.forEach(item => {
        const menuItem = menuItems.find(mi => mi.id === item.id);
        if (menuItem) {
            total += menuItem.price * item.quantity;
            
            // Sumar extras
            if (item.extras) {
                Object.keys(item.extras).forEach(extraType => {
                    const extraQuantity = item.extras[extraType];
                    if (extraQuantity > 0 && extrasConfig[extraType]) {
                        total += extrasConfig[extraType].price * extraQuantity;
                    }
                });
            }
        }
    });

    totalAmount.textContent = total.toFixed(2);
    
    // Actualizar botón móvil
    updateMobileCartButton();
}

// Actualizar estado del restaurante en la UI
function updateRestaurantStatus() {
    // Remover banner existente si existe
    const existingBanner = document.getElementById('statusBanner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    if (!restaurantStatus.isOpen) {
        // Crear banner de cerrado
        const banner = document.createElement('div');
        banner.id = 'statusBanner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
            color: white;
            text-align: center;
            padding: 15px;
            font-weight: bold;
            font-size: 1.1rem;
            z-index: 1001;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        banner.innerHTML = `
            🔴 NO ESTAMOS RECIBIENDO PEDIDOS EN ESTE MOMENTO<br>
            <span style="font-size: 0.9rem; opacity: 0.9;">${restaurantStatus.message || 'Vuelve pronto'}</span>
        `;
        
        // Insertar al inicio del body
        document.body.insertBefore(banner, document.body.firstChild);
        
        // Ajustar padding del contenido principal
        document.body.style.paddingTop = '80px';
    } else {
        // Restaurante abierto - quitar padding
        document.body.style.paddingTop = '0';
    }
    
    // Actualizar estado del botón de envío
    updateSubmitButton();
}

// Actualizar botón de envío según estado del restaurante
function updateSubmitButton() {
    if (!submitOrder) return;
    
    if (restaurantStatus.isOpen) {
        submitOrder.disabled = false;
        submitOrder.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pedido';
        submitOrder.style.opacity = '1';
        submitOrder.style.cursor = 'pointer';
    } else {
        submitOrder.disabled = true;
        submitOrder.innerHTML = '🔴 Pedidos Cerrados';
        submitOrder.style.opacity = '0.5';
        submitOrder.style.cursor = 'not-allowed';
    }
}

// Actualizar botón móvil del carrito
function updateMobileCartButton() {
    if (!mobileCartButton || !cartTotalMobile) return;
    
    // Actualizar total en el botón
    cartTotalMobile.textContent = `$${total.toFixed(2)}`;
    
    // Mostrar/ocultar según si hay productos
    const hasItems = cart.length > 0 || flavors.length > 0;
    const hasTotal = total > 0;
    
    if (hasItems || hasTotal) {
        mobileCartButton.style.display = 'flex';
    } else {
        mobileCartButton.style.display = 'none';
    }
}

// Validar formulario
function validateForm() {
    const errors = [];

    // Validar productos (debe haber al menos un producto con precio O sabores de empanadas)
    if (cart.length === 0 && flavors.length === 0) {
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
    // Verificar si el restaurante está abierto
    if (!restaurantStatus.isOpen) {
        showError('No estamos recibiendo pedidos en este momento. Por favor, intenta más tarde.');
        return;
    }

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
            if (menuItem && item.quantity > 0) {
                return {
                    id: item.id,
                    name: menuItem.name,
                    price: menuItem.price,
                    quantity: item.quantity,
                    extras: item.extras || {}
                };
            }
            return null;
        }).filter(Boolean);

        // Agregar sabores de empanadas (sin precio)
        const flavorItems = flavors.map(flavor => {
            const menuItem = menuItems.find(mi => mi.id === flavor.id);
            return menuItem ? {
                id: flavor.id,
                name: `Empanada ${menuItem.name}`,
                price: 0,
                quantity: flavor.quantity,
                isFlavor: true
            } : null;
        }).filter(Boolean);

        const orderData = {
            items: [...items, ...flavorItems],
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
    // Limpiar carrito y sabores
    cart = [];
    flavors = [];
    updateCart();
    updateTotal();

    // Resetear cantidades y extras
    menuItems.forEach(item => {
        updateQuantityDisplay(item.id);
        
        // Resetear extras si existen
        if (item.hasExtras) {
            const checkbox = document.getElementById(`extra-${item.id}`);
            const controls = document.getElementById(`extra-controls-${item.id}`);
            const extraQty = document.getElementById(`extra-qty-${item.id}`);
            
            if (checkbox) checkbox.checked = false;
            if (controls) controls.style.display = 'none';
            if (extraQty) extraQty.textContent = '0';
        }
    });

    // Limpiar formulario
    customerName.value = '';
    customerAddress.value = '';

    // Habilitar botón
    submitOrder.disabled = false;
}