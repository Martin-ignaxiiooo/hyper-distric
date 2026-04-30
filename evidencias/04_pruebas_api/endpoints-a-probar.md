# Endpoints a probar

Los siguientes endpoints corresponden a los microservicios locales de Hyper Distric.

## Productos - puerto 3002

### Listar productos

- Método: `GET`
- URL: `http://localhost:3002/productos`
- Esperado: `200 OK`
- Validación: devuelve arreglo de productos reales desde `hyper_db`.

### Detalle de producto

- Método: `GET`
- URL: `http://localhost:3002/productos/1`
- Esperado: `200 OK`
- Validación: devuelve el producto con id 1 o mensaje controlado si no existe.

### Productos por categoría

- Método: `GET`
- URL: `http://localhost:3002/productos/categoria/Hoodies`
- Esperado: `200 OK`
- Validación: devuelve productos de la categoría Hoodies o lista vacía válida.

## Usuarios - puerto 3001

### Login alias frontend

- Método: `POST`
- URL: `http://localhost:3001/login`
- Body ejemplo:

```json
{
  "email": "admin@demo.cl",
  "password": "password_demo"
}
```

- Esperado: `200 OK` con usuario real.

### Login ruta usuarios

- Método: `POST`
- URL: `http://localhost:3001/usuarios/login`
- Body ejemplo:

```json
{
  "email": "cliente@demo.cl",
  "password": "password_demo"
}
```

- Esperado: `200 OK` con usuario real.

### Registro usuario

- Método: `POST`
- URL: `http://localhost:3001/usuarios/registro`
- Body ejemplo:

```json
{
  "nombre": "Cliente Prueba",
  "email": "cliente.prueba.demo@correo.cl",
  "password": "password_demo",
  "rol": "cliente"
}
```

- Esperado: usuario creado o respuesta controlada si el correo ya existe.

## Ventas - puerto 3003

### Crear venta

- Método: `POST`
- URL: `http://localhost:3003/ventas`
- Body ejemplo:

```json
{
  "usuario_id": 2,
  "carrito": [
    {
      "producto_id": 1,
      "cantidad": 1,
      "talla": "M"
    }
  ]
}
```

- Esperado: `201 Created`.
- Validación: crea pedido, crea detalle de pedido y descuenta stock.
- Importante: no enviar datos de tarjeta demo en este payload.

### Listar ventas

- Método: `GET`
- URL: `http://localhost:3003/ventas`
- Esperado: `200 OK`
- Validación: devuelve ventas/pedidos reales.

### Ventas por usuario

- Método: `GET`
- URL: `http://localhost:3003/ventas/usuario/2`
- Esperado: `200 OK`
- Validación: devuelve pedidos reales del usuario 2 o lista vacía.

### Cambiar estado de pedido

- Método: `PUT`
- URL: `http://localhost:3003/ventas/:id/estado`
- Body ejemplo:

```json
{
  "estado": "preparando"
}
```

- Esperado: `200 OK` o respuesta controlada.
- Validación: el pedido queda con el nuevo estado.


