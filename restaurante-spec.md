### 📅 Implementation Plan: 4 Iterations (Git History)

Here is a plan using common software development patterns. Each iteration builds on the last, and at the end of each one, you should have a working, verifiable feature. **You must commit your code to Git at the end of every iteration.**

---

#### Iteración 1: Configuración Inicial y Gestión de Mesas
**Objetivo**: Establecer la base del proyecto e implementar la funcionalidad CRUD para las mesas.

*   **Historias de Usuario**:
    *   Como dueño del restaurante, quiero agregar nuevas mesas con un número único para administrar el espacio físico.
    *   Como dueño, quiero ver una lista de todas las mesas.
    *   Como dueño, quiero eliminar una mesa que ya no esté en servicio.

*   **Tareas Técnicas**:
    1.  **Configuración**:
        *   Inicializar el proyecto Node.js (`npm init -y`).
        *   Instalar Express y un motor de plantillas (como `ejs` o `handlebars`) para las vistas.
        *   Configurar el servidor básico en `app.js` o `index.js`.
    2.  **Base de Datos (SQLite)**:
        *   Crear el archivo `database.js`.
        *   Usar el módulo `node:sqlite` (experimental pero perfecto para proyectos pequeños) o `sqlite3` .
        *   Diseñar y crear la tabla `tables` con los campos: `id` (INTEGER PRIMARY KEY), `number` (INTEGER UNIQUE), `is_active` (BOOLEAN DEFAULT 1).
    3.  **Frontend (CRUD de Mesas)**:
        *   **GET `/tables`**: Mostrar un listado de todas las mesas.
        *   **POST `/tables`**: Recibir los datos del formulario y guardar una nueva mesa.
        *   **POST `/tables/:id/delete`**: "Eliminar" (hacer un soft-delete o borrar de la BD) una mesa.
    4.  **Commit en Git**: `git commit -m "feat: Implementa gestión básica de mesas (listar, agregar, eliminar)"`
    5.  **Repo en Git-Hub**:  `https://github.com/YETY93/resturant-tec-oriente.git` 

---

#### Iteración 2: Autenticación de Usuarios y Toma de Pedidos
**Objetivo**: Permitir que los usuarios se registren/autentiquen y crear el flujo para tomar un nuevo pedido.

*   **Historias de Usuario**:
    *   Como cliente, quiero registrarme (crear un usuario) dentro del sistema.
    *   Como cliente, quiero iniciar sesión para identificar mis pedidos.
    *   Como camarero/cliente, quiero crear un pedido nuevo y asociarlo a una mesa específica.

*   **Tareas Técnicas**:
    1.  **Autenticación**:
        *   Crear la tabla `users` (id, username, password_hash).
        *   Instalar `bcrypt` para encriptar contraseñas.
        *   Implementar rutas **GET `/register`**, **POST `/register`**, **GET `/login`**, **POST `/login`**.
        *   Usar `express-session` para manejar el estado del usuario logueado.
    2.  **Lógica de Pedidos (Modelo)**:
        *   Crear la tabla `orders` (id, user_id, table_id, status, created_at).
        *   `status` será un `TEXT` con valores: 'pending' (por defecto), 'in_process', 'delivered', 'paid'.
    3.  **Flujo de Creación**:
        *   Ruta **GET `/orders/new`**: Mostrar un formulario donde se selecciona la mesa (solo las activas).
        *   Ruta **POST `/orders`**: Guardar el nuevo pedido y asignarlo a `req.session.userId` y a la `table_id` seleccionada.
    4.  **Commit en Git**: `git commit -m "feat: Añade autenticación de usuarios y creación de pedidos"`

---

#### Iteración 3: Gestión del Estado de los Pedidos
**Objetivo**: Implementar el dashboard del restaurante para cambiar el estado de los pedidos y visualizarlos correctamente.

*   **Historias de Usuario**:
    *   Como camarero, quiero ver todos los pedidos activos y cambiar su estado a "En Proceso".
    *   Como camarero, quiero marcar un pedido como "Entregado" cuando la comida llegue a la mesa.
    *   Como cajero, quiero cambiar el estado a "Pagado" para cerrar la transacción.

*   **Tareas Técnicas**:
    1.  **Dashboard**:
        *   Ruta **GET `/dashboard`**: Consultar la BD para traer todos los pedidos que **no** estén en estado 'paid'.
        *   Mostrar los pedidos en una tabla con columnas: ID, Número de Mesa, Estado, Botones de acción.
    2.  **Actualización de Estado (Flujo de trabajo)**:
        *   El flujo debe ser progresivo: `pending` → `in_process` → `delivered` → `paid`.
        *   Ruta **POST `/orders/:id/status`**: Recibe el `id` del pedido y el nuevo `status`. Ejecuta un `UPDATE` en la base de datos.
        *   *Seguridad:* Validar que el nuevo estado sea válido según la máquina de estados.
    3.  **UI/UX**:
        *   Ocultar o deshabilitar botones según el estado actual. Si está "delivered", solo mostrar botón "pay".
    4.  **Commit en Git**: `git commit -m "feat: Implementa cambio de estados y dashboard de órdenes"`

---

#### Iteración 4: Asociación de Productos y Finalización del MVP
**Objetivo**: Permitir que un pedido contenga múltiples productos (ítems del menú) y pulir detalles.

*   **Historias de Usuario**:
    *   Como camarero, quiero agregar productos específicos (ej. "Pizza Margarita") a un pedido.
    *   Como usuario, quiero ver el detalle de lo que contiene cada pedido.

*   **Tareas Técnicas**:
    1.  **Catálogo de Productos**:
        *   Crear tabla `products` (id, name, price).
        *   Ruta **GET `/products`** y **POST `/products`** (CRUD básico para mantener el menú).
    2.  **Relación Pedido-Producto**:
        *   Crear tabla `order_items` (id, order_id, product_id, quantity).
        *   Modificar **POST `/orders`** para recibir un array de productos.
        *   Modificar **GET `/orders/:id`** (página de detalle): Hacer un `JOIN` entre orders, order_items y products para mostrar totales y desglose.
    3.  **Cálculo**:
        *   Calcular el total del pedido sumando (`product.price * quantity`).
    4.  **Commit Final en Git**: `git commit -m "feat: Completa MVP con gestión de menú y items en órdenes"`

---

### 💡 Propuesta de Esquema de Base de Datos (SQLite)

Para guiarte durante el desarrollo, aquí tienes el SQL de referencia para crear tus tablas en SQLite:

```sql
-- 1. Usuarios
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- 2. Mesas
CREATE TABLE tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number INTEGER UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT 1
);

-- 3. Productos
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL
);

-- 4. Pedidos
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    table_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, in_process, delivered, paid
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (table_id) REFERENCES tables(id)
);

-- 5. Items del Pedido (Relación muchos a muchos)
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```
