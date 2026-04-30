# Hyper Distric

Frontend de una tienda de ropa streetwear desarrollado con HTML, CSS y JavaScript. El proyecto permite navegar por el catálogo, iniciar sesión, administrar un carrito y realizar compras mediante los servicios de Hyper Distric API.

Este repositorio contiene solamente la interfaz web. El backend se encuentra en hyper-distric-api.

## Funciones principales
- Catálogo y detalle de productos.
- Registro e inicio de sesión.
- Carrito separado por usuario y guardado en localStorage.
- Lista de favoritos.
- Historial de pedidos desde la cuenta del cliente.
- Panel de administración para productos, usuarios y ventas.
- Inicio del pago mediante Mercado Pago.
- Diseño adaptable para escritorio y dispositivos móviles.

## Tecnologías
- HTML5
- CSS3
- JavaScript sin frameworks
- API REST con fetch
- Vercel para el despliegue del frontend

## Estructura
```text
hyper-distric/
├── css/              Estilos del sitio
├── img/              Imágenes y recursos gráficos
├── js/               Lógica de cada página
├── tests/            Pruebas del proyecto
├── index.html        Inicio y catálogo
├── producto.html     Detalle de producto
├── carrito.html      Carrito y proceso de pago
├── login.html        Inicio de sesión
├── registro.html     Registro de usuarios
├── cuenta.html       Datos e historial del cliente
├── pedidos.html      Pedidos del usuario
└── admin.html        Panel de administración
```

## Ejecutar en local
Clona el repositorio:
```bash
git clone https://github.com/Martin-ignaxiiooo/hyper-distric.git
cd hyper-distric
```
Después abre `index.html` con Live Server o con otro servidor estático. No es necesario compilar el proyecto.

Las pruebas incluidas se pueden ejecutar con:
```bash
npm install
npm test
```

## Servicios utilizados
El frontend consume tres servicios desplegados en Render:
- Productos: https://hyper-distric-productos.onrender.com
- Usuarios: https://hyper-distric-usuarios.onrender.com
- Ventas: https://hyper-distric-ventas.onrender.com

Las direcciones están definidas directamente en los archivos JavaScript correspondientes.

## Sesión y carrito
Los datos de la sesión y del carrito se guardan en `localStorage`. Esta solución es suficiente para la demostración académica, pero no reemplaza una sesión segura administrada por el servidor en un proyecto de producción.

## Pago
Desde el carrito se solicita al servicio de ventas una preferencia de Mercado Pago. El usuario continúa el pago en la página de Mercado Pago y luego vuelve a la pantalla de confirmación del sitio.
Para realizar pruebas se deben utilizar credenciales y usuarios de prueba. No se deben ingresar datos reales de pago.

## Uso del proyecto
Hyper Distric fue desarrollado con fines académicos y de portafolio.
