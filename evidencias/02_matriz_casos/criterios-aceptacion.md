# Criterios de aceptación

## Login

- Dado que existe un usuario admin registrado, cuando ingresa credenciales válidas en el login, entonces el sistema debe guardar el usuario real en `localStorage` y redirigir a `admin.html`.
- Dado que existe un usuario cliente registrado, cuando ingresa credenciales válidas en el login, entonces el sistema debe guardar el usuario real en `localStorage` y redirigir a `cuenta.html`.
- Dado que el usuario ingresa credenciales incorrectas, cuando envía el formulario, entonces el sistema debe mostrar un mensaje de error sin iniciar sesión.

## Registro

- Dado que una persona completa el formulario con datos válidos y un correo no registrado, cuando envía el registro, entonces el sistema debe crear un usuario cliente.
- Dado que el registro fue exitoso, cuando el backend devuelve el usuario creado o se valida el login posterior, entonces el sistema debe guardar el usuario real en `localStorage`.

## Compra

- Dado que el cliente tiene productos en el carrito, cuando presiona Finalizar compra, entonces debe abrirse el checkout simulado HYPER PAY antes de registrar la venta.
- Dado que el checkout simulado está completo y válido, cuando el cliente confirma el pago simulado, entonces se debe ejecutar `POST /ventas`.
- Dado que `POST /ventas` responde 201, cuando termina la compra, entonces el sistema debe mostrar éxito, vaciar el carrito y actualizar el contador.
- Dado que `POST /ventas` responde 409, cuando existe stock insuficiente, entonces el sistema debe mostrar un mensaje claro y mantener el carrito.

## Descuento de stock

- Dado que un producto tiene stock disponible, cuando se registra una venta exitosa, entonces el stock del producto debe disminuir según la cantidad comprada.
- Dado que el stock disponible es menor a la cantidad solicitada, cuando se intenta registrar la venta, entonces el backend debe rechazar la operación y no debe descontar stock.

## Cuenta cliente

- Dado que un cliente autenticado tiene pedidos registrados, cuando entra a su cuenta, entonces debe ver sus pedidos reales obtenidos desde `GET /ventas/usuario/:id`.
- Dado que un cliente autenticado no tiene pedidos, cuando entra a su cuenta, entonces debe ver un mensaje de estado vacío sin errores visuales.

## Admin

- Dado que el usuario autenticado tiene rol admin, cuando accede a `admin.html`, entonces debe poder ver el panel administrativo.
- Dado que el usuario autenticado tiene rol cliente, cuando intenta acceder a `admin.html`, entonces el sistema debe bloquear el acceso o redirigirlo.
- Dado que los servicios están activos, cuando el admin abre el panel, entonces debe ver productos, usuarios, pedidos, ingresos y estadísticas reales.
- Dado que existe un pedido, cuando el admin cambia su estado, entonces el sistema debe actualizarlo mediante el endpoint disponible y reflejar el nuevo estado.

## Checkout simulado HYPER PAY

- Dado que el checkout se abre, cuando el cliente visualiza el modal, entonces debe mostrarse claramente el texto "Simulación académica. No ingreses datos reales.".
- Dado que el método tarjeta está seleccionado, cuando el cliente deja campos vacíos o incompletos, entonces el sistema debe mostrar errores y no registrar venta.
- Dado que el número demo tiene menos de 16 dígitos, cuando el cliente intenta confirmar, entonces debe mostrarse el mensaje "El número demo debe tener 16 dígitos".
- Dado que la fecha demo está vencida, cuando el cliente intenta confirmar, entonces debe mostrarse el mensaje "La tarjeta demo está vencida".
- Dado que el CVV demo tiene menos de 3 dígitos, cuando el cliente intenta confirmar, entonces debe mostrarse error y no avanzar.
- Dado que los datos demo son válidos, cuando el cliente confirma, entonces el sistema debe mostrar "Procesando pago simulado..." y ejecutar el flujo real de venta sin enviar datos de tarjeta al backend.


