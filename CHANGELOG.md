# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2026-05-09

### Added

- Sistema completo de gestión de restaurante con arquitectura cliente-servidor
- Autenticación de usuarios (registro, login, logout) con contraseñas encriptadas
- Sesiones persistentes de 24 horas con express-session
- Sistema de gestión de mesas con estado visual disponible/ocupada
- CRUD completo de productos con catálogo de menú
- Sistema de pedidos con flujo de estados progresivo (pending → in_process → delivered → paid)
- Dashboard centralizado con estadísticas en tiempo real
- Vista de detalle de pedidos con items y cálculo automático de totales
- Filtros por estado en historial de pedidos
- Protección de rutas mediante middleware de autenticación
- Diseño responsive con CSS personalizado
- Modal de upgrade para funcionalidades premium
- Footer dinámico con año actual

### Changed

- Dashboard y creación de pedidos fusionados en vista inteligente unificada
- Filtro por defecto cambiado a 'all' para mostrar todos los pedidos incluyendo pagados
- Nombre de Dashboard cambiado a Pedidos en todas las vistas
- Diseño de estadísticas mejorado con panel lateral elegante y gradiente

### Fixed

- Código duplicado que mostraba mensaje extra de estadísticas
- Sintaxis EJS en orders/index.ejs para evitar error de funciones
- Sintaxis EJS del dashboard para renderizar correctamente
- Duplicación de mesas cuando tienen múltiples pedidos activos
- ReferenceError en vista de pedidos por falta de locals.filter
- Compatibilidad de deployment (explicada incompatibilidad con Vercel)

### Docs

- README.md con instrucciones de instalación, uso y estructura del proyecto
- Guía de deployment y configuración de plataforma
- Documentación de iteraciones completadas (1-4)

### Config

- Configuración render.yaml para auto-deploy automático
- Instalación y configuración de Vercel Web Analytics (posteriormente reemplazado por Render)
