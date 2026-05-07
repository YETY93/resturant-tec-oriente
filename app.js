const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
const db = require('./database');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'restaurante-tec-oriente-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

app.use((req, res, next) => {
  res.locals.user = req.session.userId ? { id: req.session.userId, username: req.session.username } : null;
  next();
});

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/tables');
  } else {
    res.redirect('/login');
  }
});

app.get('/register', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/tables');
  }
  res.render('auth/register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.render('auth/register', { error: 'Todos los campos son requeridos' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, passwordHash);
    res.redirect('/login');
  } catch (error) {
    res.render('auth/register', { error: 'El usuario ya existe' });
  }
});

app.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/tables');
  }
  res.render('auth/login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  
  if (!user) {
    return res.render('auth/login', { error: 'Usuario o contraseña incorrectos' });
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  
  if (!validPassword) {
    return res.render('auth/login', { error: 'Usuario o contraseña incorrectos' });
  }

  req.session.userId = user.id;
  req.session.username = user.username;
  res.redirect('/tables');
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/tables', requireAuth, (req, res) => {
  const tables = db.prepare(`
    SELECT 
      tables.id, 
      tables.number,
      CASE WHEN EXISTS(
        SELECT 1 FROM orders 
        WHERE orders.table_id = tables.id AND orders.status != 'paid'
      ) THEN 1 ELSE 0 END as has_active_order
    FROM tables
    WHERE tables.is_active = 1
    ORDER BY tables.number
  `).all();
  res.render('tables/index', { tables });
});

app.post('/tables', requireAuth, (req, res) => {
  const { number } = req.body;
  try {
    db.prepare('INSERT INTO tables (number) VALUES (?)').run(number);
    res.redirect('/tables');
  } catch (error) {
    const tables = db.prepare(`
      SELECT 
        tables.id, 
        tables.number,
        CASE WHEN EXISTS(
          SELECT 1 FROM orders 
          WHERE orders.table_id = tables.id AND orders.status != 'paid'
        ) THEN 1 ELSE 0 END as has_active_order
      FROM tables
      WHERE tables.is_active = 1
      ORDER BY tables.number
    `).all();
    res.render('tables/index', { tables, error: 'El número de mesa ya existe' });
  }
});

app.post('/tables/:id/delete', requireAuth, (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE tables SET is_active = 0 WHERE id = ?').run(id);
  res.redirect('/tables');
});

app.get('/orders/new', requireAuth, (req, res) => {
  res.redirect('/dashboard');
});

app.post('/orders', requireAuth, (req, res) => {
  const { table_id, products } = req.body;
  const userId = req.session.userId;
  
  if (!table_id) {
    req.session.errorMessage = 'Debe seleccionar una mesa';
    return res.redirect('/dashboard');
  }
  
  if (!products || !Array.isArray(products) || products.length === 0) {
    req.session.errorMessage = 'Debe agregar al menos un producto';
    return res.redirect('/dashboard');
  }
  
  try {
    const insertOrder = db.prepare('INSERT INTO orders (user_id, table_id) VALUES (?, ?)');
    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)');
    
    const result = insertOrder.run(userId, table_id);
    const orderId = result.lastInsertRowid;
    
    products.forEach(item => {
      if (item.product_id && item.quantity && item.quantity > 0) {
        insertItem.run(orderId, item.product_id, parseInt(item.quantity));
      }
    });
    
    req.session.successMessage = 'Pedido creado exitosamente';
    res.redirect('/dashboard');
  } catch (error) {
    req.session.errorMessage = 'Error al crear el pedido';
    res.redirect('/dashboard');
  }
});

app.get('/orders', requireAuth, (req, res) => {
  const validFilters = ['pending', 'in_process', 'delivered', 'paid', 'all'];
  let filter = req.query.status || 'all';
  
  if (!validFilters.includes(filter)) {
    filter = 'all';
  }
  
  let orders;
  if (filter === 'all') {
    orders = db.prepare(`
      SELECT orders.id, orders.status, orders.created_at, tables.number as table_number, users.username
      FROM orders
      JOIN tables ON orders.table_id = tables.id
      JOIN users ON orders.user_id = users.id
      ORDER BY orders.created_at DESC
    `).all();
  } else {
    orders = db.prepare(`
      SELECT orders.id, orders.status, orders.created_at, tables.number as table_number, users.username
      FROM orders
      JOIN tables ON orders.table_id = tables.id
      JOIN users ON orders.user_id = users.id
      WHERE orders.status = ?
      ORDER BY orders.created_at DESC
    `).all(filter);
  }
  
  res.render('orders/index', { orders, filter, user: req.session.userId ? { id: req.session.userId, username: req.session.username } : null });
});

app.get('/dashboard', requireAuth, (req, res) => {
  const orders = db.prepare(`
    SELECT orders.id, orders.status, orders.created_at, tables.number as table_number, users.username
    FROM orders
    JOIN tables ON orders.table_id = tables.id
    JOIN users ON orders.user_id = users.id
    WHERE orders.status != 'paid'
    ORDER BY orders.created_at DESC
  `).all();
  
  const tables = db.prepare(`
    SELECT id, number
    FROM tables
    WHERE is_active = 1
    ORDER BY number
  `).all();
  
  const products = db.prepare(`
    SELECT id, name, price
    FROM products
    WHERE is_active = 1
    ORDER BY name
  `).all();
  
  const success = req.session.successMessage;
  const error = req.session.errorMessage;
  req.session.successMessage = null;
  req.session.errorMessage = null;
  
  res.render('dashboard/index', { 
    orders, 
    tables, 
    products,
    user: req.session.userId ? { id: req.session.userId, username: req.session.username } : null,
    success,
    error
  });
});

app.get('/orders/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  
  const order = db.prepare(`
    SELECT orders.id, orders.status, orders.created_at, tables.number as table_number, users.username
    FROM orders
    JOIN tables ON orders.table_id = tables.id
    JOIN users ON orders.user_id = users.id
    WHERE orders.id = ?
  `).get(id);
  
  if (!order) {
    return res.redirect('/dashboard');
  }
  
  const items = db.prepare(`
    SELECT order_items.id, order_items.quantity, products.name, products.price
    FROM order_items
    JOIN products ON order_items.product_id = products.id
    WHERE order_items.order_id = ?
  `).all(id);
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.render('orders/detail', { 
    order, 
    items, 
    total,
    user: req.session.userId ? { id: req.session.userId, username: req.session.username } : null
  });
});

app.post('/orders/:id/status', requireAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStates = ['pending', 'in_process', 'delivered', 'paid'];
  
  if (!validStates.includes(status)) {
    return res.redirect('/dashboard');
  }
  
  const currentOrder = db.prepare('SELECT status FROM orders WHERE id = ?').get(id);
  
  if (!currentOrder) {
    return res.redirect('/dashboard');
  }
  
  const stateFlow = {
    'pending': ['in_process'],
    'in_process': ['delivered'],
    'delivered': ['paid']
  };
  
  if (!stateFlow[currentOrder.status].includes(status)) {
    return res.redirect('/dashboard');
  }
  
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  res.redirect('/dashboard');
});

app.get('/products', requireAuth, (req, res) => {
  const products = db.prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY name').all();
  res.render('products/index', { products, user: req.session.userId ? { id: req.session.userId, username: req.session.username } : null });
});

app.post('/products', requireAuth, (req, res) => {
  const { name, price } = req.body;
  
  if (!name || !price || price <= 0) {
    req.session.errorMessage = 'Nombre y precio válidos son requeridos';
    return res.redirect('/products');
  }
  
  try {
    db.prepare('INSERT INTO products (name, price) VALUES (?, ?)').run(name, parseFloat(price));
    req.session.successMessage = 'Producto agregado exitosamente';
    res.redirect('/products');
  } catch (error) {
    req.session.errorMessage = 'Error al agregar producto';
    res.redirect('/products');
  }
});

app.post('/products/:id/delete', requireAuth, (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE products SET is_active = 0 WHERE id = ?').run(id);
  res.redirect('/products');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});