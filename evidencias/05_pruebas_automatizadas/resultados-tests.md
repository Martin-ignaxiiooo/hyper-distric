# Resultados de pruebas automatizadas

Fecha de ejecución: 2026-06-25  
Comando ejecutado: `npm.cmd test`  
Herramienta: `node --test` con `node:test` y `assert`  
Dependencias instaladas: ninguna nueva  
Ambiente: proyecto local Hyper Distric, microservicios disponibles en `localhost`

## Resumen

| Tipo de prueba | Total casos | Aprobados | Fallidos | Saltados | Observaciones |
|---|---:|---:|---:|---:|---|
| Unitarias | 14 | 14 | 0 | 0 | Helpers puros de carrito y HYPER PAY |
| Mocks | 5 | 5 | 0 | 0 | Simulación de respuestas backend |
| Integración HTTP | 4 | 4 | 0 | 0 | Solo GET y login; no modifica stock |
| Total | 23 | 23 | 0 | 0 | Suite completa aprobada |

## Detalle de pruebas

| ID | Nombre de prueba | Tipo | Objetivo | Resultado esperado | Resultado obtenido | Estado | Observación |
|---|---|---|---|---|---|---|---|
| AUT-001 | `formatPriceCLP formatea valores en pesos chilenos` | Unitaria | Validar formato CLP para precios del catálogo/carrito | Devuelve `$29.990` y `$15.990` | Devuelto correctamente | Aprobado | No depende de navegador |
| AUT-002 | `formatPriceCLP usa 0 para valores no numericos` | Unitaria | Evitar totales visuales inválidos | Devuelve `$0` | Devuelto correctamente | Aprobado | Cubre dato inválido |
| AUT-003 | `calculateCartTotal suma precio por cantidad` | Unitaria | Validar cálculo de total de carrito | Total 74970 | Total 74970 | Aprobado | Cubre suma de productos |
| AUT-004 | `calculateCartTotal soporta carrito vacio o invalido` | Unitaria | Validar carrito vacío o dato nulo | Total 0 | Total 0 | Aprobado | Cubre estado vacío |
| AUT-005 | `validateDemoCardNumber acepta 16 digitos` | Unitaria | Validar número demo correcto | `true` | `true` | Aprobado | HYPER PAY demo |
| AUT-006 | `validateDemoCardNumber acepta formato visual en grupos de 4` | Unitaria | Validar formato visual `1234 5678 9012 3456` | `true` | `true` | Aprobado | HYPER PAY demo |
| AUT-007 | `validateDemoCardNumber rechaza menos de 16 digitos o letras` | Unitaria | Rechazar número incompleto o inválido | `false` | `false` | Aprobado | Cubre validación negativa |
| AUT-008 | `validateDemoCvv acepta exactamente 3 digitos` | Unitaria | Validar CVV demo correcto | `true` | `true` | Aprobado | HYPER PAY demo |
| AUT-009 | `validateDemoCvv rechaza largos invalidos o letras` | Unitaria | Rechazar CVV incompleto, largo o con letras | `false` | `false` | Aprobado | Cubre validación negativa |
| AUT-010 | `validateDemoExpiry acepta fecha MM/AA no vencida` | Unitaria | Validar fecha demo vigente | `true` | `true` | Aprobado | Referencia fija junio 2026 |
| AUT-011 | `validateDemoExpiry rechaza fecha vencida` | Unitaria | Rechazar fecha demo vencida | `false` | `false` | Aprobado | Cubre fecha vencida |
| AUT-012 | `validateDemoExpiry rechaza formato o mes invalido` | Unitaria | Rechazar formato incorrecto o mes fuera de 01-12 | `false` | `false` | Aprobado | Cubre entrada inválida |
| AUT-013 | `normalizeQuantity convierte cantidades invalidas al minimo 1` | Unitaria | Normalizar cantidad mínima de producto | 1 | 1 | Aprobado | Cubre 0, negativo y texto |
| AUT-014 | `normalizeQuantity convierte decimales a entero hacia abajo` | Unitaria | Normalizar cantidad decimal o string numérico | 2 y 3 | 2 y 3 | Aprobado | Cubre cantidades no enteras |
| AUT-015 | `mock productos devuelve respuesta exitosa con productos` | Mock | Simular API productos correcta | Lista con 2 productos | Lista con 2 productos | Aprobado | No llama backend real |
| AUT-016 | `mock pedidos devuelve lista vacia para cuenta sin pedidos` | Mock | Simular cuenta sin pedidos | Arreglo vacío | Arreglo vacío | Aprobado | Cubre estado vacío |
| AUT-017 | `mock error de conexion informa fallo controlado` | Mock | Simular backend no disponible | Error controlado de conexión | Error controlado de conexión | Aprobado | Cubre mensaje de error |
| AUT-018 | `mock stock insuficiente conserva status 409` | Mock | Simular venta rechazada por stock | Error con status 409 | Error con status 409 | Aprobado | No modifica stock |
| AUT-019 | `mock login invalido conserva status 401` | Mock | Simular credenciales incorrectas | Error con status 401 | Error con status 401 | Aprobado | Cubre autenticación fallida |
| AUT-020 | `GET /productos responde 200 y devuelve arreglo` | Integración HTTP | Verificar servicio productos activo | HTTP 200 y arreglo | HTTP 200 y arreglo | Aprobado | Consulta real sin mutar BD |
| AUT-021 | `GET /productos/1 responde 200 y devuelve producto` | Integración HTTP | Verificar detalle de producto real | HTTP 200 y producto | HTTP 200 y producto | Aprobado | Consulta real sin mutar BD |
| AUT-022 | `POST /login responde 200 con credenciales demo` | Integración HTTP | Verificar login real admin | HTTP 200 y rol admin | HTTP 200 y rol admin | Aprobado | Usa credencial demo semilla |
| AUT-023 | `GET /ventas responde 200 y devuelve arreglo` | Integración HTTP | Verificar servicio ventas activo | HTTP 200 y arreglo | HTTP 200 y arreglo | Aprobado | No ejecuta POST /ventas |

## Salida relevante de terminal

```txt
> test
> node --test

✔ GET /productos responde 200 y devuelve arreglo
✔ GET /productos/1 responde 200 y devuelve producto
✔ POST /login responde 200 con credenciales demo
✔ GET /ventas responde 200 y devuelve arreglo
✔ mock productos devuelve respuesta exitosa con productos
✔ mock pedidos devuelve lista vacia para cuenta sin pedidos
✔ mock error de conexion informa fallo controlado
✔ mock stock insuficiente conserva status 409
✔ mock login invalido conserva status 401
✔ formatPriceCLP formatea valores en pesos chilenos
✔ formatPriceCLP usa 0 para valores no numericos
✔ calculateCartTotal suma precio por cantidad
✔ calculateCartTotal soporta carrito vacio o invalido
✔ validateDemoCardNumber acepta 16 digitos
✔ validateDemoCardNumber acepta formato visual en grupos de 4
✔ validateDemoCardNumber rechaza menos de 16 digitos o letras
✔ validateDemoCvv acepta exactamente 3 digitos
✔ validateDemoCvv rechaza largos invalidos o letras
✔ validateDemoExpiry acepta fecha MM/AA no vencida
✔ validateDemoExpiry rechaza fecha vencida
✔ validateDemoExpiry rechaza formato o mes invalido
✔ normalizeQuantity convierte cantidades invalidas al minimo 1
✔ normalizeQuantity convierte decimales a entero hacia abajo
ℹ tests 23
ℹ pass 23
ℹ fail 0
ℹ skipped 0
ℹ duration_ms 226.3598
```

## Fallos encontrados

No se encontraron fallos en esta ejecución. No se actualizó `bugs-detectados.md`.


