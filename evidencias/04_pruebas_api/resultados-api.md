# Resultados de pruebas API

Fecha de ejecución: 2026-06-25 12:43:48  
Ambiente: backend local Hyper Distric con microservicios en puertos 3001, 3002 y 3003.  
Herramienta utilizada: `node` con `fetch` nativo contra `localhost`.  
Base de datos: MySQL `hyper_db`.

## Resumen de ejecución

| ID | Endpoint | Método | Status esperado | Status obtenido | Resultado |
|---|---|---|---:|---:|---|
| API-001 | `http://localhost:3002/productos` | GET | 200 | 200 | Aprobado |
| API-002 | `http://localhost:3002/productos/1` | GET | 200 | 200 | Aprobado |
| API-003 | `http://localhost:3002/productos/categoria/Hoodies` | GET | 200 | 200 | Aprobado |
| API-004 | `http://localhost:3001/login` | POST | 200 | 200 | Aprobado |
| API-005 | `http://localhost:3001/usuarios/login` | POST | 200 | 200 | Aprobado |
| API-006 | `http://localhost:3001/usuarios/registro` | POST | 201 | 201 | Aprobado |
| API-007 | `http://localhost:3003/ventas` | POST | 201 | 201 | Aprobado |
| API-008 | `http://localhost:3003/ventas` | POST | 409 | 409 | Aprobado |
| API-009 | `http://localhost:3003/ventas` | GET | 200 | 200 | Aprobado |
| API-010 | `http://localhost:3003/ventas/usuario/2` | GET | 200 | 200 | Aprobado |
| API-011 | `http://localhost:3003/ventas/2/estado` | PUT | 200 | 200 | Aprobado |

## Detalle por prueba

### API-001 - Listar productos

- Endpoint: `http://localhost:3002/productos`
- Método: GET
- Body enviado: no aplica
- Status esperado: 200
- Status obtenido: 200
- Resultado: aprobado
- Observación: se obtuvieron 10 productos reales desde la API.
- Evidencia sugerida: `04_pruebas_api/capturas/get-productos.png`

### API-002 - Detalle de producto

- Endpoint: `http://localhost:3002/productos/1`
- Método: GET
- Body enviado: no aplica
- Status esperado: 200
- Status obtenido: 200
- Resultado: aprobado
- Observación: se obtuvo el producto `Polera Oversize Negra` con stock 10.
- Evidencia sugerida: `04_pruebas_api/capturas/get-producto-1.png`

### API-003 - Productos por categoría

- Endpoint: `http://localhost:3002/productos/categoria/Hoodies`
- Método: GET
- Body enviado: no aplica
- Status esperado: 200
- Status obtenido: 200
- Resultado: aprobado
- Observación: se obtuvieron 3 productos de la categoría Hoodies.
- Evidencia sugerida: `04_pruebas_api/capturas/get-productos-hoodies.png`

### API-004 - Login alias frontend

- Endpoint: `http://localhost:3001/login`
- Método: POST
- Body enviado:

```json
{
  "email": "admin@hyperdistric.cl",
  "password": "***demo***"
}
```

- Status esperado: 200
- Status obtenido: 200
- Resultado: aprobado
- Observación: login admin correcto; la respuesta incluyó usuario `admin@hyperdistric.cl` con rol `admin`.
- Evidencia sugerida: `04_pruebas_api/capturas/post-login-admin.png`

### API-005 - Login ruta usuarios

- Endpoint: `http://localhost:3001/usuarios/login`
- Método: POST
- Body enviado:

```json
{
  "email": "cliente@hyperdistric.cl",
  "password": "***demo***"
}
```

- Status esperado: 200
- Status obtenido: 200
- Resultado: aprobado
- Observación: login cliente correcto; la respuesta incluyó usuario `cliente@hyperdistric.cl` con rol `cliente`.
- Evidencia sugerida: `04_pruebas_api/capturas/post-usuarios-login-cliente.png`

### API-006 - Registro de usuario cliente

- Endpoint: `http://localhost:3001/usuarios/registro`
- Método: POST
- Body enviado:

```json
{
  "nombre": "Cliente API Fase 2",
  "email": "cliente.api.phase2.1782405828280@demo.local",
  "password": "***demo***"
}
```

- Status esperado: 201
- Status obtenido: 201
- Resultado: aprobado
- Observación: el backend respondió `Usuario registrado exitosamente`.
- Evidencia sugerida: `04_pruebas_api/capturas/post-usuarios-registro.png`

### API-007 - Crear venta

- Endpoint: `http://localhost:3003/ventas`
- Método: POST
- Body enviado:

```json
{
  "usuario_id": 2,
  "carrito": [
    {
      "producto_id": 2,
      "cantidad": 1,
      "talla": "M"
    }
  ]
}
```

- Status esperado: 201
- Status obtenido: 201
- Resultado: aprobado
- Observación: se creó el pedido `2` con total `29990`.
- Evidencia sugerida: `04_pruebas_api/capturas/post-ventas-201.png`

### API-008 - Venta con stock insuficiente

- Endpoint: `http://localhost:3003/ventas`
- Método: POST
- Body enviado:

```json
{
  "usuario_id": 2,
  "carrito": [
    {
      "producto_id": 2,
      "cantidad": 8,
      "talla": "M"
    }
  ]
}
```

- Status esperado: 409
- Status obtenido: 409
- Resultado: aprobado
- Observación: la API respondió `Stock insuficiente para Hoodie Street Gris`. El stock se mantuvo en 7, por lo que no hubo descuento indebido.
- Evidencia sugerida: `04_pruebas_api/capturas/post-ventas-409-stock-insuficiente.png`

### API-009 - Listar ventas

- Endpoint: `http://localhost:3003/ventas`
- Método: GET
- Body enviado: no aplica
- Status esperado: 200
- Status obtenido: 200
- Resultado: aprobado
- Observación: después de la venta de prueba se listaron 2 ventas.
- Evidencia sugerida: `04_pruebas_api/capturas/get-ventas.png`

### API-010 - Ventas por usuario

- Endpoint: `http://localhost:3003/ventas/usuario/2`
- Método: GET
- Body enviado: no aplica
- Status esperado: 200
- Status obtenido: 200
- Resultado: aprobado
- Observación: se obtuvieron 2 ventas asociadas al usuario 2, incluyendo el pedido `2`.
- Evidencia sugerida: `04_pruebas_api/capturas/get-ventas-usuario-2.png`

### API-011 - Cambiar estado de pedido

- Endpoint: `http://localhost:3003/ventas/2/estado`
- Método: PUT
- Body enviado:

```json
{
  "estado_id": 2
}
```

- Status esperado: 200
- Status obtenido: 200
- Resultado: aprobado
- Observación: la API respondió `Estado de pedido actualizado`. La verificación posterior de `GET /ventas/2` mostró estado `Pagado`.
- Evidencia sugerida: `04_pruebas_api/capturas/put-ventas-estado.png`

## Validación de venta y stock

- Producto usado: `Hoodie Street Gris`.
- Producto ID: 2.
- Stock antes de la venta exitosa: 8.
- Cantidad vendida: 1.
- Stock después de la venta exitosa: 7.
- Pedido creado: 2.
- Total del pedido: 29990.
- Detalles creados: 1.
- Verificación de detalle: `GET http://localhost:3003/ventas/2` respondió 200 y devolvió un detalle con cantidad 1 y precio unitario 29990.
- Estado final del pedido tras prueba PUT: `Pagado`.

## Validación de stock insuficiente

- Stock antes del intento 409: 7.
- Cantidad solicitada: 8.
- Status obtenido: 409.
- Mensaje obtenido: `Stock insuficiente para Hoodie Street Gris`.
- Stock después del intento 409: 7.
- Resultado: aprobado, no hubo descuento indebido.

## Observaciones

- Los microservicios no estaban activos al inicio. Se levantaron desde `backend` usando `npm.cmd start`.
- `Invoke-WebRequest` presentó errores internos en esta sesión, por lo que las pruebas se ejecutaron con `node` y `fetch` nativo.
- Se realizó un primer intento de stock insuficiente con cantidad 107; el backend respondió 400 por cantidad inválida antes de llegar a la validación de stock. Se repitió correctamente con cantidad 8 y se obtuvo el 409 esperado.
- No se enviaron datos de tarjeta ni datos bancarios en ninguna prueba.


