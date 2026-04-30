const test = require('node:test');
const assert = require('node:assert/strict');

const { createJsonResponse, requestJson } = require('../helpers/api-mocks');

test('mock productos devuelve respuesta exitosa con productos', async () => {
  const fetchMock = async () => createJsonResponse(200, [
    { id: 1, nombre: 'Polera Oversize Negra', stock: 10 },
    { id: 2, nombre: 'Hoodie Street Gris', stock: 7 }
  ]);

  const productos = await requestJson(fetchMock, 'http://localhost:3002/productos');

  assert.equal(productos.length, 2);
  assert.equal(productos[0].nombre, 'Polera Oversize Negra');
});

test('mock pedidos devuelve lista vacia para cuenta sin pedidos', async () => {
  const fetchMock = async () => createJsonResponse(200, []);

  const pedidos = await requestJson(fetchMock, 'http://localhost:3003/ventas/usuario/99');

  assert.deepEqual(pedidos, []);
});

test('mock error de conexion informa fallo controlado', async () => {
  const fetchMock = async () => {
    throw new Error('ECONNREFUSED');
  };

  await assert.rejects(
    () => requestJson(fetchMock, 'http://localhost:3003/ventas'),
    /Error de conexion con backend/
  );
});

test('mock stock insuficiente conserva status 409', async () => {
  const fetchMock = async () => createJsonResponse(409, {
    error: 'Stock insuficiente para Hoodie Street Gris'
  });

  await assert.rejects(
    () => requestJson(fetchMock, 'http://localhost:3003/ventas', { method: 'POST' }),
    (error) => error.status === 409 && /Stock insuficiente/.test(error.message)
  );
});

test('mock login invalido conserva status 401', async () => {
  const fetchMock = async () => createJsonResponse(401, {
    mensaje: 'Credenciales incorrectas'
  });

  await assert.rejects(
    () => requestJson(fetchMock, 'http://localhost:3001/login', { method: 'POST' }),
    (error) => error.status === 401 && /Credenciales incorrectas/.test(error.message)
  );
});


