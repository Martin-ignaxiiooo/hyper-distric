# Pruebas automatizadas - Fase 3

Esta carpeta contiene la evidencia documental de la Fase 3: pruebas automatizadas simples, unitarias, mocks e integración HTTP básica para Hyper Distric.

## Alcance

Se implementaron pruebas sin modificar la lógica productiva del frontend ni del backend.

Archivos de prueba creados:

- `tests/helpers/checkout-helpers.js`
- `tests/helpers/api-mocks.js`
- `tests/unit/checkout-helpers.test.js`
- `tests/mocks/api-mocks.test.js`
- `tests/integration/http-services.test.js`

## Herramienta usada

Se usaron herramientas nativas de Node.js:

- `node:test`
- `node:assert/strict`
- `fetch` nativo de Node para integración HTTP

No se instalaron dependencias externas.

## Script agregado

Se agregó un script mínimo al `package.json`:

```json
{
  "scripts": {
    "test": "node --test"
  }
}
```

Comando de ejecución:

```bash
npm.cmd test
```

## Pruebas unitarias

Archivo: `tests/unit/checkout-helpers.test.js`

Objetivo:

- Validar reglas puras del flujo de carrito y checkout simulado sin depender del DOM, backend ni base de datos.

Casos cubiertos:

- Formateo de precio CLP.
- Total de carrito por precio y cantidad.
- Carrito vacío o inválido.
- Número de tarjeta demo con 16 dígitos.
- Número de tarjeta demo con formato visual en grupos de 4.
- Rechazo de número demo incompleto o con letras.
- CVV demo de 3 dígitos.
- Rechazo de CVV incompleto, largo o con letras.
- Fecha demo MM/AA no vencida.
- Rechazo de fecha vencida.
- Rechazo de formato o mes inválido.
- Normalización de cantidad mínima.
- Normalización de cantidad decimal.

## Pruebas con mock

Archivo: `tests/mocks/api-mocks.test.js`

Objetivo:

- Simular respuestas del backend sin depender de servicios activos.
- Validar manejo de respuestas correctas y errores controlados.

Casos cubiertos:

- Productos con respuesta exitosa.
- Pedidos vacíos para cuenta sin pedidos.
- Error de conexión con backend.
- Stock insuficiente con status 409.
- Login inválido con status 401.

## Pruebas de integración HTTP

Archivo: `tests/integration/http-services.test.js`

Objetivo:

- Verificar endpoints reales de lectura y autenticación básica si los microservicios están disponibles.

Endpoints cubiertos:

- `GET http://localhost:3002/productos`
- `GET http://localhost:3002/productos/1`
- `POST http://localhost:3001/login`
- `GET http://localhost:3003/ventas`

Importante:

- No se ejecuta `POST /ventas` en las pruebas automatizadas para no alterar stock ni crear pedidos adicionales.
- Si un microservicio no está disponible, la prueba de integración puede saltarse usando `t.skip`. En esta ejecución todos los servicios respondieron.

## Resultado de la ejecución

- Total de pruebas: 23.
- Aprobadas: 23.
- Fallidas: 0.
- Saltadas: 0.
- Duración reportada por Node en la ejecución final: 226.3598 ms.

El detalle se encuentra en `resultados-tests.md`.


