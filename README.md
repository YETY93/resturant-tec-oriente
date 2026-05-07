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
│   ├── orders/         # Vistas de pedidos
│   │   ├── index.ejs
│   │   └── new.ejs
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