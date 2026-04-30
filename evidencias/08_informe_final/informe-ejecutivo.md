# Informe ejecutivo - Hyper Distric

## Introducción

Hyper Distric es un proyecto web desarrollado para Taller Aplicado de Programación. Corresponde a una tienda de ropa streetwear con catálogo, carrito, checkout simulado, ventas reales en base de datos, cuenta cliente y panel administrativo.

Este informe documenta la estructura general del proyecto, las tecnologías utilizadas, las reglas de negocio principales, el plan de pruebas y las evidencias esperadas para la tercera evaluación.

## Descripción del proyecto

El sistema permite a un cliente navegar productos, registrarse, iniciar sesión, agregar productos al carrito y completar una compra mediante un checkout simulado llamado HYPER PAY.

La compra se registra en la base de datos local mediante el microservicio de ventas. El sistema crea pedido, crea detalle de pedido y descuenta stock desde MySQL.

Además, el proyecto incluye una cuenta cliente para revisar pedidos reales y un panel admin para revisar productos, usuarios, pedidos, ingresos y estados de pedido.

## Arquitectura

El proyecto está organizado en frontend y backend con microservicios.

Frontend:

- HTML.
- CSS.
- JavaScript puro.
- Uso de `localStorage` para sesión y carrito.

Backend:

- Node.js.
- Express.
- Microservicio usuarios en puerto 3001.
- Microservicio productos en puerto 3002.
- Microservicio ventas en puerto 3003.

Base de datos:

- MySQL.
- Base local `hyper_db`.

## Tecnologías

- HTML5.
- CSS3.
- JavaScript.
- Node.js.
- Express.
- MySQL.
- mysql2.
- dotenv.
- MySQL Workbench.
- Navegador con DevTools.
- Postman, Thunder Client o curl.
- Apache JMeter para carga y estrés.

## Reglas de negocio

- Un usuario puede iniciar sesión como cliente o admin.
- Un cliente puede registrarse y comprar productos.
- El checkout HYPER PAY es solo una simulación académica.
- No se deben guardar ni enviar datos reales de tarjeta.
- La venta se registra solo si existe usuario válido y productos con stock.
- El total de la venta debe calcularse desde la base de datos.
- Una venta exitosa crea pedido y detalle de pedido.
- Una venta exitosa descuenta stock.
- Si no hay stock suficiente, la venta debe rechazarse y el carrito debe mantenerse.
- El admin puede consultar estadísticas reales.
- El admin puede cambiar estado de pedido si el endpoint está disponible.

## Plan de pruebas

El plan considera:

- Pruebas funcionales manuales.
- Pruebas API.
- Pruebas de integración.
- Pruebas unitarias simples.
- Pruebas con mock.
- Pruebas de carga.
- Pruebas de estrés.
- Evidencias de mejoras y correcciones.

Las pruebas se ejecutarán en ambiente local con base `hyper_db` y microservicios en los puertos 3001, 3002 y 3003.

## Resultados esperados

Se espera comprobar que:

- El catálogo muestra productos reales.
- El login y registro funcionan contra el backend real.
- El carrito mantiene productos correctamente.
- El checkout HYPER PAY valida datos demo y no solicita datos reales.
- `POST /ventas` crea pedidos y detalle de pedido.
- El stock baja después de una compra exitosa.
- La cuenta cliente muestra pedidos reales.
- El admin muestra datos reales.
- El cambio de estado de pedido funciona cuando el endpoint está disponible.

## Evidencias

Las evidencias se organizarán en:

- Plan de pruebas.
- Matriz de casos.
- Criterios de aceptación.
- Capturas funcionales.
- Resultados API.
- Resultados de pruebas automatizadas.
- Reportes JMeter.
- Bugs detectados.
- Correcciones aplicadas.

## Mejoras realizadas

Durante la preparación del proyecto se realizaron mejoras clave:

- Conexión real a MySQL.
- Catálogo desde base de datos.
- Login y registro reales.
- Ruta compatible `POST /login`.
- Registro de ventas mediante `POST /ventas`.
- Descuento de stock.
- Cuenta cliente con pedidos reales.
- Admin conectado a datos reales.
- Checkout simulado HYPER PAY.
- Validaciones visuales de tarjeta demo.

## Conclusión

Hyper Distric cuenta con un flujo funcional completo para una tienda web académica: catálogo, autenticación, carrito, checkout simulado, venta real en base de datos, cuenta cliente y administración.

La estructura de evidencias permite documentar pruebas manuales, pruebas API, pruebas automatizadas futuras, carga, estrés y correcciones aplicadas. Esto deja el proyecto preparado para presentar resultados claros y verificables en la tercera evaluación.


