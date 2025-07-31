# 🍕 Sistema de Pedidos - La Familia Rotiseria

Un sistema web completo para recibir pedidos online con notificaciones automáticas por email. Diseñado para restaurantes, rotiserías y negocios de delivery. **Deploy automático desde GitHub a Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/tu-repositorio)

## ✨ Características

- 🛒 **Menú interactivo** con productos organizados por categorías
- 🛍️ **Carrito de compras** en tiempo real con extras
- 🧀 **Sistema de extras** (cheddar, papas adicionales)
- 🥟 **Selector de sabores** para empanadas
- 📧 **Notificaciones por email** automáticas al restaurante
- 📱 **Diseño responsive** optimizado para móviles y desktop
- 🎨 **Interfaz moderna** con animaciones suaves
- ✅ **Validación de formularios** completa
- 🚀 **Deploy automático** desde GitHub a Vercel
- ⚡ **Sin base de datos** - funciona inmediatamente

## 🚀 Deploy Rápido (GitHub + Vercel)

### Método recomendado: Fork y Deploy

1. **Haz fork de este repositorio** en tu cuenta de GitHub
   
   👆 Clic en "Fork" arriba a la derecha

2. **Deploy en Vercel**
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/tu-repositorio)
   
   O manualmente:
   - Ve a [vercel.com](https://vercel.com) y crea una cuenta
   - Conecta tu cuenta de GitHub
   - Importa tu fork del repositorio
   - Vercel detectará automáticamente la configuración

3. **Configura las variables de entorno en Vercel**
   
   En el dashboard de Vercel: **Settings** → **Environment Variables**
   
   Agrega estas variables:
   ```
   EMAIL_USER = tu-email@gmail.com
   EMAIL_PASS = tu-password-de-aplicacion-gmail
   ```

4. **Configura Gmail** (ver sección más abajo)

5. **¡Listo!** Tu app estará disponible en la URL de Vercel

### 🔄 Updates automáticos

Una vez configurado, cada vez que hagas push a la rama `main` de tu repositorio, Vercel desplegará automáticamente los cambios.

```bash
# Edita tu menú en api/index.js
git add .
git commit -m "Actualizar menú de pizzas"
git push origin main
# 🚀 Deploy automático en 30 segundos
```

## 📧 Configuración de Gmail (IMPORTANTE)

Para que el sistema pueda enviar emails automáticamente:

### Paso 1: Activar verificación en dos pasos

1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. **Seguridad** → **Verificación en dos pasos**
3. Sigue los pasos para activarla

### Paso 2: Generar contraseña de aplicación

1. En **Seguridad** → **Contraseñas de aplicación**
2. Selecciona **Correo** como aplicación
3. Genera la contraseña
4. **Copia esta contraseña** (no tu contraseña normal de Gmail)

### Paso 3: Configurar en Vercel

1. En tu proyecto de Vercel: **Settings** → **Environment Variables**
2. Agrega:
   ```
   EMAIL_USER = tu-email@gmail.com
   EMAIL_PASS = la-contraseña-de-aplicacion-generada
   ```
3. **Redeploy** tu proyecto

## 💻 Desarrollo Local

### Prerrequisitos

- Node.js (versión 16 o superior)
- Cuenta de Gmail configurada (ver arriba)

### Instalación

1. **Clona tu repositorio**
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Edita `.env`:
   ```env
   EMAIL_USER=tu-email@gmail.com
   EMAIL_PASS=tu-password-de-aplicacion
   PORT=3000
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   
   Ve a `http://localhost:3000`

## ⚙️ Personalizar tu menú

### Editar productos

Edita el archivo `api/index.js` y modifica el array `menuItems`:

```javascript
const menuItems = [
  // Personaliza tus productos aquí
  { id: 1, name: "Pizza Margherita", price: 8500, category: "PIZZAS" },
  { id: 2, name: "Empanada de Carne", price: 1500, category: "EMPANADAS" },
  // Agrega más productos...
];
```

### Productos con extras

Para productos que pueden tener extras (como papas o cheddar):

```javascript
{ 
  id: 1, 
  name: "Hamburguesa", 
  price: 7000, 
  category: "HAMBURGUESAS",
  hasExtras: true, 
  extraType: "papas" // o "cheddar"
}
```

### Sabores de empanadas

Para sabores sin precio (como sabores de empanadas):

```javascript
{ 
  id: 25, 
  name: "De Carne Dulce", 
  price: 0, 
  category: "EMPANADAS SABORES", 
  isFlavor: true 
}
```

### Configurar extras

Edita la configuración de extras en `api/index.js`:

```javascript
const extrasConfig = {
  cheddar: { name: "Cheddar", price: 1000 },
  papas: { name: "Papas Extra", price: 2000 }
};
```

## 🎨 Personalizar diseño

### Cambiar colores y estilos

Edita `public/styles.css` para personalizar:

- **Colores principales**: Busca `#ff8f00` y `#c62828`
- **Fuentes**: Modifica `font-family: 'Poppins'`
- **Espaciado**: Ajusta `padding` y `margin`

### Cambiar nombre del restaurante

Edita `public/index.html` y busca:

```html
<title>🍕 La Familia Rotiseria</title>
<h1><i class="fas fa-utensils"></i> Tu Nombre Aquí</h1>
```

## 📱 Cómo funciona para tus clientes

### Flujo del cliente:

1. **Navega el menú** → Selecciona productos con + y -
2. **Agrega extras** → Cheddar, papas adicionales
3. **Selecciona sabores** → Para empanadas
4. **Ve el total** → En tiempo real en el carrito
5. **Completa datos** → Nombre y dirección
6. **Envía pedido** → Recibe confirmación

### Flujo para ti (restaurante):

1. **Recibes email** → Con todos los detalles del pedido
2. **Email incluye**:
   - Lista completa de productos
   - Extras seleccionados
   - Sabores de empanadas
   - Total del pedido
   - Datos del cliente
   - Hora del pedido

## 🔧 Estructura del proyecto

```
Pedidos/
├── api/
│   ├── index.js          # Servidor principal para Vercel
│   ├── menu.js           # API del menú (opcional)
│   └── order.js          # API de pedidos (opcional)
├── public/               # Frontend
│   ├── index.html        # Página principal
│   ├── styles.css        # Estilos CSS
│   └── script.js         # JavaScript del frontend
├── server.js             # Servidor local (desarrollo)
├── vercel.json          # Configuración de Vercel
├── package.json         # Dependencias
├── .env                 # Variables de entorno (crear)
├── env.example         # Ejemplo de configuración
└── README.md           # Este archivo
```

## 🛠️ Solución de problemas

### ❌ Los emails no llegan

1. **Verifica Gmail**:
   - ✅ Verificación en dos pasos activada
   - ✅ Contraseña de aplicación generada
   - ✅ Variables de entorno correctas en Vercel

2. **Verifica configuración**:
   - Ve a Vercel → Settings → Environment Variables
   - Confirma que `EMAIL_USER` y `EMAIL_PASS` estén configuradas
   - Redeploy el proyecto

3. **Revisa logs**:
   - Ve a Vercel → Functions → Ver logs de errores

### ❌ Error de despliegue en Vercel

1. **Verifica `vercel.json`**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/**/*.js",
         "use": "@vercel/node"
       },
       {
         "src": "public/**",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/api/$1"
       },
       {
         "src": "/(.*)",
         "dest": "/public/$1"
       }
     ]
   }
   ```

2. **Revisa package.json**:
   ```json
   {
     "engines": {
       "node": ">=16.0.0"
     }
   }
   ```

### ❌ Los estilos no cargan

1. Verifica que `public/styles.css` exista
2. Revisa que `vercel.json` incluya archivos estáticos
3. Usa rutas relativas en HTML: `href="/styles.css"`

## 📱 Características técnicas

- **Frontend**: HTML5 + CSS3 + JavaScript vanilla
- **Backend**: Node.js + Express
- **Email**: Nodemailer + Gmail
- **Deploy**: Vercel Serverless Functions
- **Responsive**: CSS Grid + Flexbox
- **Sin base de datos**: Todo en memoria
- **Real-time**: Updates instantáneos del carrito

## 🔄 Versioning y updates

### Para hacer cambios:

```bash
# 1. Clona tu repo (si no lo tienes local)
git clone https://github.com/tu-usuario/tu-repo.git

# 2. Haz cambios en el código
# Edita api/index.js para el menú
# Edita public/styles.css para estilos
# etc.

# 3. Commit y push
git add .
git commit -m "Descripción del cambio"
git push origin main

# 4. ✨ Vercel despliega automáticamente
```

### Branches recomendadas:

- `main` → Producción (auto-deploy a Vercel)
- `develop` → Desarrollo
- `feature/nueva-funcionalidad` → Features

## 🆘 Soporte y ayuda

### Si tienes problemas:

1. **Revisa este README** completo
2. **Verifica Gmail**: Verificación 2FA + Contraseña de app
3. **Revisa logs de Vercel**: Dashboard → Functions → Logs
4. **Prueba local**: `npm run dev` para verificar que funciona
5. **Variables de entorno**: Confirma en Vercel Settings

### Para soporte adicional:

- 📧 Email: [tu-email@ejemplo.com]
- 💬 Issues: GitHub Issues del repositorio
- 📚 Docs: [vercel.com/docs](https://vercel.com/docs)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Úsalo libremente para proyectos personales o comerciales.

---

## 🚀 ¡Empezar ahora!

1. **Fork** este repositorio
2. **Deploy** en Vercel con un clic
3. **Configura** Gmail en 5 minutos
4. **Personaliza** tu menú
5. **¡Recibe pedidos!**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/tu-repositorio)

---

¡Tu sistema de pedidos estará funcionando en menos de 10 minutos! 🍕✨