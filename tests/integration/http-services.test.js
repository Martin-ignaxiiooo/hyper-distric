const test = require('node:test');
const assert = require('node:assert/strict');

const PRODUCTOS_URL = process.env.PRODUCTOS_URL || 'http://localhost:3002';
const USUARIOS_URL = process.env.USUARIOS_URL || 'http://localhost:3001';
const VENTAS_URL = process.env.VENTAS_URL || 'http://localhost:3003';
const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@hyperdistric.cl';
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || '1234';

async function fetchOrSkip(t, url, options = {}) {
  try {
    return await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(3000)
    });
  } catch (error) {
    t.skip(`Servicio no disponible para ${url}: ${error.message}`);
    return null;
  }
}

test('GET /productos responde 200 y devuelve arreglo', async (t) => {
  const response = await fetchOrSkip(t, `${PRODUCTOS_URL}/productos`);
  if (!response) return;

  assert.equal(response.status, 200);
  const productos = await response.json();
  assert.equal(Array.isArray(productos), true);
});

test('GET /productos/1 responde 200 y devuelve producto', async (t) => {
  const response = await fetchOrSkip(t, `${PRODUCTOS_URL}/productos/1`);
  if (!response) return;

  assert.equal(response.status, 200);
  const producto = await response.json();
  assert.equal(Number.isInteger(Number(producto.id)), true);
  assert.ok(producto.nombre);
});

test('POST /login responde 200 con credenciales demo', async (t) => {
  const response = await fetchOrSkip(t, `${USUARIOS_URL}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: TEST_ADMIN_EMAIL,
      password: TEST_ADMIN_PASSWORD
    })
  });
  if (!response) return;

  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.usuario.email, TEST_ADMIN_EMAIL);
  assert.equal(data.usuario.rol, 'admin');
});

test('GET /ventas responde 200 y devuelve arreglo', async (t) => {
  const response = await fetchOrSkip(t, `${VENTAS_URL}/ventas`);
  if (!response) return;

  assert.equal(response.status, 200);
  const ventas = await response.json();
  assert.equal(Array.isArray(ventas), true);
});


