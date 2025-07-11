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