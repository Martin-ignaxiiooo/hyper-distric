# Correcciones y mejoras aplicadas

Este documento resume mejoras ya realizadas en Hyper Distric antes de la fase formal de evidencias.

## Conexión real a MySQL

Se normalizó la conexión de los microservicios para usar variables de entorno y apuntar a la base local `hyper_db`.

Resultado:

- Los servicios usan configuración local controlada.
- No se hardcodean contraseñas en archivos versionados.
- La base `hyper_db` concentra productos, usuarios, pedidos y detalles.

## Productos desde base de datos

El catálogo y las consultas de producto se conectaron al microservicio de productos.

Resultado:

- `GET /productos` devuelve datos reales.
- `GET /productos/:id` permite consultar detalle.
- `GET /productos/categoria/Hoodies` permite filtrar por categoría.

## Login y registro real

El frontend de login y registro se conectó al microservicio de usuarios.

Resultado:

- El login usa `POST /login`.
- El login compatible también puede usar `POST /usuarios/login`.
- El usuario real se guarda en `localStorage` con id, nombre, email y rol.
- El rol admin redirige a panel admin.
- El rol cliente redirige a cuenta cliente.

## POST /ventas

Se agregó o corrigió el flujo de venta real en el microservicio de ventas.

Resultado:

- `POST /ventas` recibe usuario y productos del carrito.
- Valida productos y stock.
- Calcula total desde base de datos.
- Crea pedido.
- Crea detalle de pedido.
- Usa transacción MySQL.

## Descuento de stock

El flujo de venta descuenta stock desde la base de datos después de una compra exitosa.

Resultado:

- El stock baja en productos reales.
- Si no hay stock suficiente, la venta responde con error controlado y no vacía el carrito.

## Cuenta con pedidos reales

La cuenta cliente se conectó a pedidos reales del usuario autenticado.

Resultado:

- Lee el usuario desde `localStorage`.
- Consulta `GET /ventas/usuario/:id`.
- Muestra pedidos reales o estado vacío.

## Admin conectado

El panel admin se conectó a datos reales de los microservicios.

Resultado:

- Muestra productos reales.
- Muestra usuarios reales.
- Muestra pedidos reales.
- Calcula estadísticas reales.
- Permite cambiar estado de pedido cuando el endpoint está disponible.

## Checkout simulado HYPER PAY

Se agregó un checkout visual simulado antes de registrar la venta.

Resultado:

- El usuario ve un modal profesional de pago simulado.
- Se muestran métodos de pago simulados.
- Se mantiene el flujo real de `POST /ventas`.
- No se integra ninguna pasarela real.
- No se guardan datos reales de tarjeta.

## Validaciones de tarjeta demo

Se agregaron validaciones visuales para HYPER PAY.

Resultado:

- Nombre obligatorio con mínimo 3 caracteres.
- Número demo solo numérico, formateado en grupos de 4 y con 16 dígitos.
- Fecha demo en formato MM/AA y no vencida.
- CVV/CVC demo con 3 dígitos.
- La tarjeta visual se actualiza en vivo.
- El CVV gira la tarjeta al reverso.
- Los datos de tarjeta demo no se envían al backend.


