# Hyper Distric — E-Commerce Streetwear

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Plataforma de comercio electrónico de moda urbana y streetwear.  
Desarrollado con arquitectura de microservicios, panel administrativo y sistema de gestión de pedidos.

</div>

---

## Información Académica

| Campo | Detalle |
|-------|---------|
| **Asignatura** | Taller Aplicado de Programación 801D |
| **Institución** | Duoc UC |
| **Profesor** | Diego Patricio Cares Gonzalez |
| **Año** | 2026 |

### Integrantes y Responsabilidades

| Integrante | Rol |
|------------|-----|
| Benjamín Yantzen | Líder de Proyecto / Frontend |
| Sebastián Benavides | DBA (Administrador de Base de Datos) |
| Martín Peña | Backend Developer |

---

## Descripción del Proyecto

Hyper Distric es una tienda online de streetwear que permite a los clientes explorar un catálogo de productos, agregarlos al carrito, realizar compras y hacer seguimiento de sus pedidos. Cuenta con un panel de administración para gestionar productos, stock y pedidos.

### Funcionalidades

- Catálogo de productos con filtros por categoría (Poleras, Hoodies, Pantalones, Chaquetas)
- Carrito de compras con validación de stock en tiempo real
- Proceso de checkout con validación de tarjeta de crédito
- Comprobantes por correo electrónico automatizados con Nodemailer
- Sistema de autenticación con roles (admin / cliente)
- Gestión de pedidos con estados (Pendiente, Pagado, En preparación, Enviado, Entregado)
- Panel de administración para CRUD de productos, control de stock y gestión de pedidos
- Cuenta de usuario con historial de compras y resumen de gastos

---

## Arquitectura del Sistema

El proyecto usa una arquitectura de microservicios con 3 servicios backend independientes que se conectan a una base de datos MySQL centralizada. El frontend es vanilla HTML/CSS/JS y consume las APIs REST.

```
hyper-distric/
│
├── frontend/                        # Interfaz de usuario
│   ├── css/
│   │   └── style.css               # Estilos principales
│   ├── js/
│   │   ├── admin.js                # Panel administrativo
│   │   ├── carrito.js              # Carrito y checkout
│   │   ├── cuenta.js               # Cuenta del usuario
│   │   ├── login.js                # Inicio de sesión
│   │   ├── registro.js             # Registro de usuarios
│   │   ├── main.js                 # Página principal / catálogo
│   │   ├── producto.js             # Detalle de producto
│   │   └── nav-auth.js             # Navegación y sesión
│   ├── img/                        # Imágenes de productos (.webp)
│   ├── index.html                  # Página principal
│   ├── producto.html               # Detalle de producto
│   ├── carrito.html                # Carrito de compras
│   ├── login.html                  # Inicio de sesión
│   ├── registro.html               # Registro
│   ├── cuenta.html                 # Mi cuenta
│   ├── admin.html                  # Panel de administración
│   └── ...
│
├── backend/                        # Lógica de negocio (Node.js + Express)
│   ├── config/
│   │   ├── db-pool.js              # Pool de conexiones MySQL
│   │   └── db.js                   # Conexión simple MySQL
│   ├── usuarios-service.js         # Microservicio de Usuarios (Puerto 3001)
│   ├── productos-service.js        # Microservicio de Productos (Puerto 3002)
│   ├── ventas-service.js           # Microservicio de Ventas (Puerto 3003)
│   ├── init_db.sql                 # Script SQL (creación de BD + datos iniciales)
│   ├── .env                        # Variables de entorno
│   └── package.json
│
├── vercel.json                     # Configuración de deploy
└── package.json
```

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (HTML/CSS/JS)                │
│   index.html | carrito.html | cuenta.html | admin.html   │
└──────┬───────────────┬────────────────┬─────────────────┘
       │               │                │
       v               v                v
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Usuarios    │ │  Productos   │ │   Ventas     │
│  Service     │ │  Service     │ │   Service    │
│  :3001       │ │  :3002       │ │   :3003      │
│              │ │              │ │              │
│  Registro    │ │  CRUD        │ │  Checkout    │
│  Login       │ │  Categorías  │ │  Pedidos     │
│  Roles       │ │  Stock       │ │  Estados     │
│  Perfiles    │ │  Imágenes    │ │  Email       │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │               │                │
       v               v                v
┌─────────────────────────────────────────────────────────┐
│                  MySQL — hyper_db                        │
│                                                         │
│  roles | usuarios | categorias | productos | imagenes   │
│  estados_pedido | pedidos | detalle_pedido               │
└─────────────────────────────────────────────────────────┘
```

---

## Base de Datos MySQL (hyper_db)

Base de datos relacional normalizada (3FN) con 8 tablas conectadas por Foreign Keys.

### Diagrama Entidad-Relación

```
┌────────────┐       ┌──────────────┐       ┌───────────────────┐
│   roles    │ 1───N │   usuarios   │ 1───N │     pedidos       │
│            │       │              │       │                   │
│ id (PK)    │       │ id (PK)      │       │ id (PK)           │
│ nombre     │       │ nombre       │       │ usuario_id (FK)   │
└────────────┘       │ email        │       │ estado_id (FK)    │
                     │ password     │       │ total             │
                     │ rol_id (FK)  │       │ fecha             │
                     └──────────────┘       └────────┬──────────┘
                                                     │ 1
                                                     │
                                                     │ N
                                            ┌────────┴──────────┐
┌────────────────┐                          │  detalle_pedido   │
│ estados_pedido │ 1───N  pedidos           │                   │
│                │                          │ id (PK)           │
│ id (PK)       │                          │ pedido_id (FK)    │
│ nombre        │                          │ producto_id (FK)  │
└────────────────┘                          │ cantidad          │
                                            │ precio_unitario   │
┌──────────────┐       ┌──────────────┐     └───────────────────┘
│  categorias  │ 1───N │  productos   │
│              │       │              │ 1───N ┌────────────────────┐
│ id (PK)      │       │ id (PK)      │──────│ imagenes_producto  │
│ nombre       │       │ nombre       │       │                    │
└──────────────┘       │ slug         │       │ id (PK)            │
                       │ precio       │       │ producto_id (FK)   │
                       │ stock        │       │ url                │
                       │ categoria_id │       │ principal          │
                       │ descripcion  │       └────────────────────┘
                       │ color        │
                       │ estilo       │
                       │ material     │
                       │ badge        │
                       └──────────────┘
```

### Estados de Pedido

| ID | Estado | Descripción |
|----|--------|-------------|
| 1 | Pendiente | Pedido registrado, esperando confirmación |
| 2 | Pagado | Pago confirmado |
| 3 | En preparación | Pedido siendo preparado para envío |
| 4 | Enviado | Pedido despachado |
| 5 | Entregado | Pedido recibido por el cliente |
| 6 | Cancelado | Pedido cancelado o rechazado |

### Datos Iniciales (Seeds)

- 2 roles: admin, cliente
- 2 usuarios de prueba (admin + cliente demo)
- 4 categorías: Poleras, Hoodies, Pantalones, Chaquetas
- 10 productos con imágenes en formato .webp
- 6 estados de pedido

---

## API REST — Endpoints

### Usuarios Service (localhost:3001)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/usuarios/registro` | Registra un nuevo cliente |
| `POST` | `/usuarios/login` | Autentica un usuario y retorna datos + rol |
| `GET` | `/usuarios` | Lista todos los usuarios (admin) |
| `GET` | `/usuarios/:id` | Detalle de un usuario |
| `PUT` | `/usuarios/:id` | Editar datos de un usuario |
| `DELETE` | `/usuarios/:id` | Eliminar un usuario |

### Productos Service (localhost:3002)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/productos` | Catálogo completo (JOIN categorías + imágenes) |
| `GET` | `/productos/:id` | Detalle de un producto |
| `GET` | `/productos/categoria/:categoria` | Filtrar por categoría |
| `POST` | `/productos` | Crear producto (transacción: producto + imagen) |
| `PUT` | `/productos/:id` | Editar un producto |
| `PUT` | `/productos/:id/stock` | Actualizar stock |
| `DELETE` | `/productos/:id` | Eliminar producto (CASCADE en imágenes) |

### Ventas Service (localhost:3003)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/checkout` | Checkout con validación de tarjeta |
| `POST` | `/ventas` | Registro de venta (estado: Pendiente) |
| `GET` | `/ventas` | Listar todas las ventas (admin) |
| `GET` | `/ventas/:id` | Detalle de un pedido |
| `GET` | `/ventas/usuario/:usuarioId` | Historial de pedidos de un usuario |
| `PUT` | `/ventas/:id/estado` | Actualizar estado de un pedido |
| `POST` | `/pagos/crear-sesion` | Sesión de pago (simulada) |
| `POST` | `/pagos/confirmar` | Confirmar pago (simulada) |
| `POST` | `/notificaciones/compra` | Notificación al cliente (simulada) |

### Ejemplo de Petición — Checkout

```json
POST /checkout
Content-Type: application/json

{
  "usuario_id": 2,
  "carrito": [
    { "producto_id": 1, "cantidad": 2, "precio_unitario": 14990, "talla": "M" },
    { "producto_id": 3, "cantidad": 1, "precio_unitario": 24990, "talla": "L" }
  ],
  "total": 54970,
  "tarjeta": {
    "numero": "4111111111111111",
    "nombre": "Cliente Demo",
    "expiracion": "12/28",
    "cvv": "123"
  }
}
```

### Ejemplo de Respuesta

```json
{
  "mensaje": "Pago procesado con exito.",
  "pedido_id": 5,
  "email": "cliente@hyperdistric.cl",
  "total": 54970
}
```

---

## Validaciones Implementadas

### Backend — Checkout (/checkout)

| Validación | Detalle |
|------------|---------|
| Tarjeta de crédito | 16 dígitos numéricos |
| Nombre del titular | Mínimo 8 caracteres, 2 palabras, solo letras |
| Fecha de expiración | Formato MM/AA, no puede estar vencida |
| CVV | 3 dígitos numéricos |
| Stock | Verificación con `FOR UPDATE` (bloqueo de fila) |
| Total | Recálculo server-side, comparación con el total del cliente |
| Cantidad por producto | Máximo 20 unidades |
| Transacción | `ROLLBACK` automático si algo falla |

### Frontend — Formularios

- Validación de campos vacíos
- Validación de formato de email
- Control de cantidades en el carrito
- Feedback visual con mensajes de error/éxito

---

## Tecnologías Utilizadas

### Frontend

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura semántica de las páginas |
| CSS3 | Diseño responsivo, variables CSS, gradientes |
| JavaScript ES6+ | Lógica del cliente, consumo de APIs con `fetch` |
| Google Fonts | Tipografías Inter y Space Grotesk |

### Backend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | v18+ | Runtime del servidor |
| Express | v5.2 | Framework web / API REST |
| MySQL2 | v3.22 | Driver de base de datos (pool con promises) |
| Nodemailer | v8.0 | Envío de correos electrónicos |
| CORS | v2.8 | Cross-Origin Resource Sharing |
| dotenv | v17.4 | Variables de entorno |
| Concurrently | v9.0 | Ejecución simultánea de los 3 microservicios |

### Base de Datos

| Tecnología | Uso |
|------------|-----|
| MySQL 8.0 | Base de datos relacional |
| UTF8MB4 | Soporte para caracteres especiales |

### Herramientas

| Herramienta | Uso |
|-------------|-----|
| VS Code + Live Server | Desarrollo frontend |
| XAMPP / MySQL Workbench | Administración de la base de datos |
| Vercel | Deploy en producción |
| Git + GitHub | Control de versiones |

---

## Instalación y Ejecución Local

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- [MySQL](https://dev.mysql.com/downloads/) 8.0 (o XAMPP con MySQL)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) con extensión Live Server (recomendado)

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/hyper-distric.git
cd hyper-distric
```

### Paso 2 — Crear la base de datos

Abrir el cliente MySQL (XAMPP / MySQL Workbench / terminal) y ejecutar el script:

```bash
mysql -u root -p < backend/init_db.sql
```

O copiar el contenido de `backend/init_db.sql` directamente en el gestor de base de datos.

> El script elimina y recrea la base de datos `hyper_db` con todos los datos iniciales.

### Paso 3 — Configurar variables de entorno

Editar el archivo `backend/.env`:

```env
PORT=3003
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=tu_app_password
```

> Para Gmail se necesita una [contraseña de aplicación](https://myaccount.google.com/apppasswords), no la contraseña normal de la cuenta.

### Paso 4 — Configurar conexión a MySQL

Editar `backend/config/db-pool.js` con las credenciales locales:

```javascript
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'TU_PASSWORD_MYSQL',
    database: 'hyper_db',
    port: 3306,
    charset: 'utf8mb4'
});
```

### Paso 5 — Instalar dependencias

```bash
cd backend
npm install
```

### Paso 6 — Iniciar los microservicios

```bash
npm start
```

Esto levanta los 3 servicios con `concurrently`:

```
Servicio Usuarios corriendo en puerto 3001
Servicio Productos corriendo en puerto 3002
Servicio Ventas corriendo en puerto 3003
```

### Paso 7 — Abrir el frontend

Abrir `frontend/index.html` con Live Server en VS Code (click derecho > Open with Live Server) o directamente en el navegador.

---

## Credenciales de Prueba

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `admin@hyperdistric.cl` | `1234` |
| Cliente Demo | `cliente@hyperdistric.cl` | `1234` |

Con la cuenta de administrador se accede al panel en `admin.html` para gestionar productos, stock y pedidos.

---

## Vistas del Sistema

### Cliente

| Vista | Archivo | Descripción |
|-------|---------|-------------|
| Inicio / Catálogo | `index.html` | Hero, categorías, productos destacados y catálogo |
| Detalle de Producto | `producto.html` | Imagen, descripción, talla, cantidad, agregar al carrito |
| Carrito | `carrito.html` | Items, resumen de compra, formulario de pago |
| Login | `login.html` | Inicio de sesión |
| Registro | `registro.html` | Registro de nuevo usuario |
| Mi Cuenta | `cuenta.html` | Perfil, resumen de pedidos, historial de compras |

### Administrador

| Sección | Descripción |
|---------|-------------|
| Productos | CRUD completo: crear, editar y eliminar productos |
| Stock | Control rápido de disponibilidad por producto |
| Pedidos | Historial de ventas con detalle de productos |

---

## Diseño

El frontend usa un diseño dark mode con estética streetwear.

- **Paleta de colores:**
  - Fondo principal: `#0A0C10` / `#12161D`
  - Acento principal: `#59E3FF` (cyan)
  - Acento secundario: `#FF6A2B` (naranja)
  - Texto: `#F5F7FB` / `#97A3B6`

- **Efectos:**
  - Glassmorphism con `backdrop-filter: blur()`
  - Gradientes en fondos y tarjetas
  - Transiciones en hover con `transform` y `box-shadow`

- **Tipografías:**
  - Space Grotesk — Títulos y logo
  - Inter — Cuerpo de texto

---

## Estado del Proyecto

### Completado

- [x] Base de datos relacional normalizada (3FN) con 8 tablas
- [x] 10 productos con imágenes en formato .webp
- [x] Autenticación con roles (admin / cliente)
- [x] CRUD de productos desde el panel admin
- [x] Control de stock con actualización rápida
- [x] Carrito de compras con persistencia en localStorage
- [x] Checkout con validación de tarjeta
- [x] Registro de ventas con transacciones y descuento automático de stock
- [x] Historial de pedidos en la cuenta del usuario
- [x] Estados de pedido (Pendiente, Pagado, En preparación, Enviado, Entregado, Cancelado)
- [x] Comprobantes por email con Nodemailer
- [x] Diseño responsivo dark mode
- [x] Arquitectura de microservicios (3 servicios independientes)

### En desarrollo

- [ ] Integración de pasarela de pagos (Stripe)
- [ ] Encriptación de contraseñas (bcrypt)
- [ ] Tokens JWT para autenticación
- [ ] Sistema de favoritos funcional
- [ ] Notificaciones push

---

## Licencia

Proyecto académico — Taller Aplicado de Programación, Duoc UC, 2026.
