# Pruebas de carga y estrés con JMeter

Esta carpeta queda preparada para evidencias de rendimiento con Apache JMeter.

## Objetivo de pruebas de carga

Validar que los microservicios de Hyper Distric responden correctamente ante varios usuarios simulados en condiciones razonables para una evaluación académica local.

La prueba de carga busca observar:

- Tiempo promedio de respuesta.
- Porcentaje de errores.
- Comportamiento de endpoints de consulta.
- Estabilidad básica de los servicios.

## Objetivo de pruebas de estrés

Observar el comportamiento del sistema cuando se aumenta gradualmente la cantidad de solicitudes hasta detectar lentitud, errores o límite práctico del entorno local.

La prueba de estrés no busca simular producción real. Solo permite documentar cómo responde el sistema bajo presión controlada.

## Endpoints recomendados

Priorizar endpoints de lectura:

- `GET http://localhost:3002/productos`
- `GET http://localhost:3002/productos/1`
- `GET http://localhost:3002/productos/categoria/Hoodies`
- `GET http://localhost:3003/ventas`
- `GET http://localhost:3003/ventas/usuario/2`

Endpoints que pueden probarse con control:

- `POST http://localhost:3001/login`
- `POST http://localhost:3003/ventas`

## Advertencia sobre POST /ventas

No ejecutar carga masiva sobre `POST /ventas` sin controlar stock y datos de prueba.

Esta ruta modifica la base de datos:

- Crea pedidos.
- Crea detalle de pedido.
- Descuenta stock.

Si se ejecuta muchas veces, puede agotar stock, generar demasiados registros y afectar las evidencias funcionales. Para esta ruta se recomienda usar pocos hilos, pocas iteraciones y productos preparados para prueba.

## Configuración sugerida para carga

- Usuarios virtuales: 5 a 10.
- Ramp-up: 10 segundos.
- Iteraciones: 3 a 5.
- Endpoints principales: rutas GET.
- Evidencia: reporte HTML de JMeter y capturas de Summary Report.

## Configuración sugerida para estrés

- Usuarios virtuales: iniciar con 10 y subir a 25 o 50 si el equipo lo soporta.
- Ramp-up: 15 a 30 segundos.
- Iteraciones: controladas.
- Endpoints principales: rutas GET.
- Detener prueba si el equipo local o MySQL se vuelve inestable.

## Evidencias a exportar

Guardar en esta carpeta:

- Plan `.jmx` en `carga/` o `estres/`.
- Reporte HTML exportado en `reportes/`.
- Capturas de JMeter en `capturas/`.
- Tabla con tiempos promedio, máximo, mínimo y porcentaje de error.
- Comentario final sobre resultados observados.


