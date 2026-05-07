# Restaurante Tec Oriente

Sistema de gestión de restaurante desarrollado con Node.js, Express y SQLite.

## Instalación

```bash
npm install
```

## Uso

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
restaurante/
├── app.js              # Servidor Express y rutas
├── database.js         # Configuración SQLite
├── package.json        # Dependencias
├── views/              # Plantillas EJS
│   ├── layout.ejs      # Layout principal
│   ├── auth/           # Vistas de autenticación
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── tables/         # Vistas de mesas
│   │   └── index.ejs
│   ├── products/       # Vistas de productos
│   │   └── index.ejs
│   ├── orders/         # Vistas de pedidos
│   │   ├── index.ejs
│   │   └── detail.ejs
│   └── dashboard/      # Dashboard de gestión
│       └── index.ejs
└── public/             # Archivos estáticos
    ├── css/
    │   └── styles.css
    └── js/
        └── main.js
```

## Iteración 1 - Gestión de Mesas

- [x] Configuración inicial (Express + EJS)
- [x] Base de datos SQLite con tabla `tables`
- [x] CRUD de mesas (listar, agregar, desactivar)
- [x] Estado visual de mesas (disponible/ocupada)

## Iteración 2 - Autenticación y Pedidos

- [x] Sistema de autenticación (registro, login, logout)
- [x] Sesiones de usuario con express-session
- [x] Encriptación de contraseñas con bcrypt
- [x] Tabla `users` y `orders` en la base de datos
- [x] Creación de pedidos asociados a mesas
- [x] Lista de pedidos con información de mesa y usuario
- [x] Protección de rutas (requiere autenticación)

## Iteración 3 - Dashboard y Gestión de Estados

- [x] Dashboard de pedidos activos
- [x] Cambio de estado progresivo (pending → in_process → delivered → paid)
- [x] Validación de máquina de estados
- [x] UI dinámica según estado del pedido
- [x] Botones de acción contextual (iniciar, entregar, pagar)
- [x] Filtros por estado en historial de pedidos
- [x] Vista unificada de creación y gestión

## Iteración 4 - MVP Completo con Productos

- [x] Tabla `products` para catálogo de menú
- [x] Tabla `order_items` para relación pedido-producto
- [x] CRUD de productos (listar, agregar, eliminar)
- [x] Selección múltiple de productos en pedidos
- [x] Cantidad configurable por producto
- [x] Vista de detalle de pedido con items
- [x] Cálculo automático de total del pedido
- [x] Estadísticas en tiempo real en dashboard

## Funcionalidades MVP

### Mesas
- Agregar mesas con número único
- Visualizar estado (disponible/ocupada)
- Desactivar mesas no en uso

### Usuarios
- Registro de nuevos usuarios
- Login con autenticación
- Sesiones persistentes

### Pedidos
- Crear pedidos con múltiples productos
- Asociar pedido a mesa y camarero
- Cambiar estados progresivamente
- Ver detalle completo con items
- Calcular total automático

### Productos
- Catálogo de productos con precios
- Agregar/eliminar productos
- Selección en pedidos

### Dashboard
- Vista unificada de creación y gestión
- Estadísticas en tiempo real
- Acciones rápidas por estado
- Total estimado en creación