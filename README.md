# 🍕 Sistema de Pedidos

Un sistema web completo para recibir pedidos con notificaciones por email. Perfecto para restaurantes, delivery, o cualquier negocio que necesite recibir pedidos online.

## ✨ Características

- 🛒 **Menú interactivo** con productos organizados por categorías
- 📝 **Pedidos personalizados** con campo de texto libre
- ⏰ **Selector de horario** de entrega flexible
- 👤 **Formulario de contacto** completo
- 📧 **Notificaciones por email** automáticas
- 📱 **Diseño responsive** para móviles y desktop
- 🎨 **Interfaz moderna** con animaciones suaves
- ✅ **Validación de formularios** en tiempo real

## 🚀 Instalación

### Prerrequisitos

- Node.js (versión 14 o superior)
- Cuenta de Gmail con verificación en dos pasos activada

### Pasos de instalación

1. **Clona o descarga el proyecto**
   ```bash
   cd order-system
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura el email**
   
   Copia el archivo de ejemplo:
   ```bash
   cp env.example .env
   ```
   
   Edita el archivo `.env` con tu información:
   ```env
   EMAIL_USER=tu-email@gmail.com
   EMAIL_PASS=tu-password-de-aplicacion
   PORT=3000
   ```

4. **Configura Gmail para enviar emails**
   
   Para que el sistema pueda enviar emails, necesitas una **contraseña de aplicación**:
   
   1. Ve a tu [cuenta de Google](https://myaccount.google.com/)
   2. Ve a **Seguridad**
   3. Activa la **Verificación en dos pasos** si no está activa
   4. Ve a **Contraseñas de aplicación**
   5. Selecciona **Correo** y genera una nueva contraseña
   6. Usa esa contraseña en el archivo `.env`

5. **Inicia el servidor**
   ```bash
   npm start
   ```

6. **Abre tu navegador**
   
   Ve a `http://localhost:3000`

## 📋 Cómo usar

### Para los clientes:

1. **Selecciona productos** del menú usando los botones + y -
2. **Escribe un pedido personalizado** si necesitas algo específico
3. **Elige el horario** de entrega
4. **Completa tus datos** de contacto
5. **Envía el pedido** y recibe confirmación por email

### Para ti (administrador):

1. **Recibirás un email** cada vez que alguien haga un pedido
2. **El email incluye** todos los detalles del pedido
3. **El cliente también recibe** una confirmación automática

## ⚙️ Personalización

### Modificar el menú

Edita el archivo `server.js` y modifica el array `menuItems`:

```javascript
const menuItems = [
  { id: 1, name: 'Tu Producto', price: 10.99, category: 'Categoría' },
  // Agrega más productos aquí...
];
```

### Cambiar estilos

Modifica el archivo `public/styles.css` para personalizar colores, fuentes, etc.

### Agregar nuevas funcionalidades

El código está organizado de forma modular, puedes:
- Agregar nuevas rutas en `server.js`
- Modificar la interfaz en `public/index.html`
- Agregar validaciones en `public/script.js`

## 🌐 Despliegue

### Opción 1: Vercel (Recomendado)

1. Sube tu código a GitHub
2. Conecta tu repositorio a [Vercel](https://vercel.com)
3. Configura las variables de entorno en Vercel
4. ¡Listo! Tu app estará online

### Opción 2: Heroku

1. Crea una cuenta en [Heroku](https://heroku.com)
2. Instala Heroku CLI
3. Ejecuta:
   ```bash
   heroku create tu-app-name
   heroku config:set EMAIL_USER=tu-email@gmail.com
   heroku config:set EMAIL_PASS=tu-password-de-aplicacion
   git push heroku main
   ```

### Opción 3: Servidor propio

1. Sube los archivos a tu servidor
2. Instala Node.js en el servidor
3. Ejecuta `npm install` y `npm start`
4. Configura un proxy reverso con Nginx si es necesario

## 🔧 Estructura del proyecto

```
order-system/
├── server.js              # Servidor principal
├── package.json           # Dependencias y scripts
├── .env                   # Variables de entorno (crear)
├── env.example           # Ejemplo de configuración
├── public/               # Archivos del frontend
│   ├── index.html        # Página principal
│   ├── styles.css        # Estilos CSS
│   └── script.js         # JavaScript del frontend
└── README.md             # Este archivo
```

## 📧 Configuración de Email

### Gmail (Recomendado)

El sistema está configurado para usar Gmail. Para configurarlo:

1. **Activa la verificación en dos pasos** en tu cuenta de Google
2. **Genera una contraseña de aplicación**:
   - Ve a [myaccount.google.com](https://myaccount.google.com)
   - Seguridad → Verificación en dos pasos
   - Contraseñas de aplicación → Correo
3. **Usa esa contraseña** en el archivo `.env`

### Otros proveedores

Puedes modificar la configuración en `server.js`:

```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook', // o 'yahoo', 'hotmail', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## 🛠️ Solución de problemas

### Error: "Invalid login"

- Verifica que la verificación en dos pasos esté activada
- Asegúrate de usar una contraseña de aplicación, no tu contraseña normal
- Revisa que el email y contraseña estén correctos en `.env`

### Error: "Connection refused"

- Verifica que el puerto 3000 no esté en uso
- Cambia el puerto en el archivo `.env` si es necesario

### Los emails no llegan

- Revisa la carpeta de spam
- Verifica la configuración de Gmail
- Asegúrate de que las variables de entorno estén correctas

## 📱 Características técnicas

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + JavaScript vanilla
- **Email**: Nodemailer
- **Base de datos**: En memoria (se puede extender a MongoDB/MySQL)
- **Responsive**: CSS Grid + Flexbox
- **Animaciones**: CSS transitions + keyframes

## 🤝 Contribuir

Si quieres mejorar el proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo libremente para proyectos personales o comerciales.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de solución de problemas
2. Verifica que sigas todos los pasos de instalación
3. Asegúrate de que tu configuración de Gmail sea correcta

---

¡Espero que este sistema te ayude a recibir pedidos de forma eficiente! 🚀 