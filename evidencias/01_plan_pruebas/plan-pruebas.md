# Plan de pruebas - Hyper Distric

## Objetivo

Definir las pruebas necesarias para validar que Hyper Distric funciona correctamente como tienda web de ropa streetwear, con frontend en HTML, CSS y JavaScript, microservicios Node.js y base de datos MySQL `hyper_db`.

El plan busca generar evidencias claras para la tercera evaluación de Taller Aplicado de Programación, cubriendo validación funcional, integración entre servicios, calidad del flujo de compra y comportamiento esperado del panel administrativo.

## Alcance

Se consideran dentro del alcance las funcionalidades principales ya implementadas:

- Catálogo conectado a MySQL.
- Detalle de producto consultado desde API.
- Login real de usuarios.
- Registro real de clientes.
- Carrito de compras.
- Checkout simulado HYPER PAY.
- Validaciones visuales de tarjeta demo.
- Registro de ventas mediante `POST /ventas`.
- Creación de pedido y detalle de pedido.
- Descuento de stock.
- Cuenta cliente con pedidos reales.
- Panel admin con productos, usuarios, pedidos e ingresos.
- Cambio de estado de pedido desde admin.

## Funcionalidades a probar

| Módulo | Funcionalidades |
|---|---|
| Usuarios | Login admin, login cliente, registro, restricción de acceso por rol |
| Productos | Listado, detalle, categoría, stock real |
| Carrito | Carrito vacío, agregar productos, mantener productos antes de confirmar |
| Checkout HYPER PAY | Modal, métodos de pago, validaciones demo, confirmación simulada |
| Ventas | Crear pedido, crear detalle, calcular total desde BD, descontar stock |
| Cuenta cliente | Mostrar pedidos reales del usuario autenticado |
| Admin | Ver estadísticas, usuarios, productos, pedidos y cambiar estado |

## Tipos de prueba

- Pruebas funcionales manuales: validan que los flujos principales se comporten como espera el usuario.
- Pruebas de API e integración: validan que frontend, microservicios y base de datos trabajen correctamente.
- Pruebas unitarias simples: se aplicarán después a funciones aisladas de validación y transformación de datos.
- Pruebas con mock: se aplicarán después para simular respuestas correctas y errores de APIs.
- Pruebas de carga: se aplicarán después con JMeter para medir comportamiento con varios usuarios simulados.
- Pruebas de estrés: se aplicarán después para observar el límite del sistema en condiciones controladas.
- Pruebas de criterios de aceptación: validan flujos bajo formato dado, cuando, entonces.

## Ambiente de prueba

- Sistema operativo: Windows.
- Frontend: HTML, CSS y JavaScript puro.
- Backend: Node.js con microservicios Express.
- Base de datos: MySQL local.
- Base: `hyper_db`.
- Servicio usuarios: `http://localhost:3001`.
- Servicio productos: `http://localhost:3002`.
- Servicio ventas: `http://localhost:3003`.
- Navegador recomendado: Chrome o Edge.

## Herramientas propuestas

- Navegador web: pruebas funcionales y capturas.
- DevTools: consola, red, localStorage y payloads.
- MySQL Workbench: validación de datos en `pedidos`, `detalle_pedido`, `productos` y `usuarios`.
- Postman, Thunder Client o curl: pruebas API.
- Node.js `node:test`: pruebas unitarias e integración simples sin instalar dependencias nuevas.
- Mocks de `fetch`: pruebas de respuestas 201, 409 y error de conexión.
- Apache JMeter: pruebas de carga y estrés controladas.
- Google Drive: almacenamiento de capturas, reportes y documentos finales.

## Criterios de entrada

- Base de datos `hyper_db` creada y poblada.
- Microservicios funcionando en puertos 3001, 3002 y 3003.
- Frontend disponible localmente.
- Usuario admin existente.
- Usuario cliente existente o registrable.
- Productos con stock suficiente para pruebas de compra.
- `.env` configurado localmente sin exponer credenciales.

## Criterios de salida

- Casos críticos ejecutados y documentados.
- Evidencias visuales guardadas en carpetas correspondientes.
- Pruebas API registradas con status esperado y obtenido.
- Al menos una compra exitosa validada en base de datos.
- Descuento de stock comprobado antes y después.
- Acceso admin validado por rol.
- Errores relevantes documentados con corrección o pendiente.
- Informe ejecutivo preparado para entrega.

## Riesgos

- Cambios de stock durante pruebas pueden alterar resultados si no se registra el valor inicial.
- Las pruebas de venta modifican datos reales de la base local.
- Carga masiva sobre `POST /ventas` puede agotar stock rápidamente.
- Si algún microservicio no está activo, el frontend puede mostrar errores de conexión.
- Las pruebas visuales dependen del navegador usado y del tamaño de pantalla.
- El checkout HYPER PAY es una simulación académica, no una pasarela real.


