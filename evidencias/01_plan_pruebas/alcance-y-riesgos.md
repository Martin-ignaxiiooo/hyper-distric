# Alcance y riesgos - Hyper Distric

## Qué se prueba

Se prueba el funcionamiento principal de Hyper Distric como tienda web local:

- Navegación del catálogo desde datos reales de MySQL.
- Consulta de detalle de producto desde API.
- Inicio de sesión con usuarios reales.
- Registro de nuevos clientes.
- Carrito de compras.
- Checkout simulado HYPER PAY.
- Validaciones visuales de tarjeta demo.
- Creación de ventas con `POST /ventas`.
- Creación de registros en `pedidos`.
- Creación de registros en `detalle_pedido`.
- Descuento de stock en productos.
- Vista de pedidos reales en cuenta cliente.
- Panel admin conectado a productos, usuarios, pedidos e ingresos reales.
- Cambio de estado de pedido desde admin.

## Qué no se prueba

No se incluye en esta fase:

- Pasarela de pago real.
- Envío real de correos.
- Seguridad avanzada, pentesting o auditoría formal.
- Despliegue en producción.
- Pruebas automatizadas completas end to end.
- Pruebas con usuarios reales externos.
- Recuperación de contraseña.
- Facturación electrónica.
- Integración con transportistas.
- Optimización profunda de rendimiento frontend.

## Riesgos del proyecto

- La base de datos local puede cambiar entre pruebas si se realizan compras repetidas.
- El stock puede quedar bajo y provocar errores 409 si no se controla antes de probar.
- Si los microservicios no se levantan en el orden correcto, algunas pruebas pueden fallar por conexión.
- El usuario admin debe existir y tener rol correcto para validar el panel.
- Las pruebas de carga pueden afectar la base local si se ejecutan contra rutas que modifican datos.
- El frontend depende de `localStorage`, por lo que sesiones antiguas pueden alterar pruebas si no se limpian.

## Limitaciones de la evaluación

La evaluación se realiza en ambiente local, con datos de prueba y servicios ejecutándose en la misma máquina. Por eso los resultados son útiles para validar lógica, integración y evidencias académicas, pero no representan condiciones reales de producción.

Las pruebas de carga y estrés deben mantenerse controladas, con pocos usuarios virtuales y sin generar ventas masivas que dañen la consistencia del stock.

## Pago simulado académico

HYPER PAY se implementa como experiencia visual de checkout simulado. Su objetivo es demostrar flujo de compra, validaciones de interfaz y confirmación visual antes de registrar una venta.

No se integra Flow, Webpay, Mercado Pago, Stripe ni otra pasarela real. Tampoco se solicitan, guardan ni envían datos bancarios reales. Los campos de tarjeta son solo visuales y deben mantenerse acompañados del mensaje:

> Simulación académica. No ingreses datos reales.

La venta real del proyecto se registra únicamente mediante el backend local en `POST /ventas`, usando productos del carrito, usuario autenticado y cálculo de total desde la base de datos.


