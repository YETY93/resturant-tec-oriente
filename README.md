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
│   └── tables/         # Vistas de mesas
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
- [ ] Instalar dependencias
- [ ] Iniciar el servidor