# 🚀 Deployment Guide

## ❌ Problema con Vercel

Esta aplicación **NO funciona en Vercel Serverless** debido a:

### 1. **SQLite Database**
- SQLite requiere filesystem persistente
- Vercel tiene filesystem **ephemeral** (se reinicia cada deploy/cold start)
- La base de datos se perderá constantemente

### 2. **Express Traditional Server**
- Express tradicional NO es compatible con Vercel Serverless Functions
- Vercel espera funciones exportadas: `module.exports = (req, res) => {...}`
- Esta app usa `app.listen()` que no funciona en serverless

### 3. **Session Management**
- `express-session` con MemoryStore NO persiste en serverless
- Se necesita un store externo (Redis, Upstash)

### 4. **bcrypt Compatibility**
- bcrypt puede tener problemas en algunos environments serverless

---

## ✅ Soluciones

### Opción A: Deployment Local/VPS (Recomendada)

**Mejor opción para este proyecto:**

1. **VPS Traditional (DigitalOcean, Linode, AWS EC2)**
   ```bash
   npm install
   npm start
   # App corre en http://tu-vps-ip:3000
   ```

2. **Heroku** (con PostgreSQL)
   ```bash
   # Cambiar SQLite → PostgreSQL
   npm install pg
   # Configurar DATABASE_URL
   heroku create
   git push heroku main
   ```

3. **Railway.app** (soporta SQLite y Express)
   ```bash
   railway login
   railway init
   railway up
   ```

4. **Render.com** (soporta Express con SQLite)
   - Crear Web Service
   - Conectar repo GitHub
   - Build: `npm install`
   - Start: `npm start`

---

### Opción B: Adaptar para Vercel (Complejo)

**Requiere reestructuración completa:**

#### Paso 1: Cambiar Base de Datos
```bash
npm uninstall sqlite
npm install @vercel/postgres
```

#### Paso 2: Convertir Express a Serverless
```javascript
// api/index.js - Exportar handler
const app = require('../app');
module.exports = app;
```

#### Paso 3: Configurar Sessions con Upstash
```bash
npm install @upstash/redis connect-redis
```

#### Paso 4: Cambiar bcrypt
```bash
npm uninstall bcrypt
npm install bcryptjs
```

#### Paso 5: Migrar rutas a `/api/`
```
/api/login.js
/api/register.js
/api/tables.js
/api/orders.js
...etc
```

**⚠️ Esto requiere rewrite completo del código**

---

## 📊 Comparación de Plataformas

| Plataforma | SQLite | Express | Sessions | Dificultad |
|------------|---------|---------|----------|------------|
| **VPS** | ✅ | ✅ | ✅ | 🟢 Easy |
| **Railway** | ✅ | ✅ | ✅ | 🟢 Easy |
| **Render** | ✅ | ✅ | ✅ | 🟢 Easy |
| **Heroku** | ❌* | ✅ | ✅ | 🟡 Medium |
| **Vercel** | ❌ | ❌* | ❌ | 🔴 Hard |

*Requiere adaptación

---

## 🎯 Recomendación Final

**Para este proyecto MVP:**

1. **Railway.app** (gratis, soporta todo)
2. **Render.com** (gratis, soporta todo)
3. **VPS DigitalOcean** ($4/mes, full control)

**NO usar Vercel** para apps Express con SQLite.

---

## 🔧 Quick Fix (Alternative)

Si quieres mantener Vercel para frontend estático:

1. Separar frontend (React/Vue) → Vercel
2. Backend Express → Railway/Render
3. Database → Supabase/PlanetScale

---

## 📞 Ayuda

Contacta para adaptar el código:

**Yesid Rangel Orozco**  
📱 321 123 4567  
💼 Desarrollador Full Stack  
📧 yesid.rangel@example.com

---

## 🚀 Deployment Commands

### Railway (Easiest)
```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Iniciar
railway init

# Deploy
railway up

# Ver logs
railway logs
```

### Render (Free tier)
1. Ir a https://render.com
2. Crear "Web Service"
3. Conectar GitHub repo
4. Configurar:
   - Build: `npm install`
   - Start: `npm start`
   - Environment: Node

### Heroku (PostgreSQL)
```bash
# Instalar Heroku CLI
npm i -g heroku

# Crear app
heroku create restaurante-tec

# Add PostgreSQL
heroku addons:create heroku-postgresql

# Configurar vars
heroku config:set DATABASE_URL=...

# Deploy
git push heroku main
```

---

## ⚡ Testing Local

```bash
# Test que funciona localmente
npm install
npm start

# Abrir
http://localhost:3000

# Probar:
- Login/Register
- Mesas
- Productos
- Pedidos
- Dashboard
```

Si funciona local, el problema es la plataforma deployment.