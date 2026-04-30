const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateCartTotal,
  formatPriceCLP,
  normalizeQuantity,
  validateDemoCardNumber,
  validateDemoCvv,
  validateDemoExpiry
} = require('../helpers/checkout-helpers');

test('formatPriceCLP formatea valores en pesos chilenos', () => {
  assert.equal(formatPriceCLP(29990), '$29.990');
  assert.equal(formatPriceCLP('15990'), '$15.990');
});

test('formatPriceCLP usa 0 para valores no numericos', () => {
  assert.equal(formatPriceCLP('abc'), '$0');
});

test('calculateCartTotal suma precio por cantidad', () => {
  const items = [
    { precio: 29990, cantidad: 2 },
    { precio: 14990, cantidad: 1 }
  ];

  assert.equal(calculateCartTotal(items), 74970);
});

test('calculateCartTotal soporta carrito vacio o invalido', () => {
  assert.equal(calculateCartTotal([]), 0);
  assert.equal(calculateCartTotal(null), 0);
});

test('validateDemoCardNumber acepta 16 digitos', () => {
  assert.equal(validateDemoCardNumber('1234567890123456'), true);
});

test('validateDemoCardNumber acepta formato visual en grupos de 4', () => {
  assert.equal(validateDemoCardNumber('1234 5678 9012 3456'), true);
});

test('validateDemoCardNumber rechaza menos de 16 digitos o letras', () => {
  assert.equal(validateDemoCardNumber('123456789012345'), false);
  assert.equal(validateDemoCardNumber('12345678901234ab'), false);
});

test('validateDemoCvv acepta exactamente 3 digitos', () => {
  assert.equal(validateDemoCvv('123'), true);
});

test('validateDemoCvv rechaza largos invalidos o letras', () => {
  assert.equal(validateDemoCvv('12'), false);
  assert.equal(validateDemoCvv('1234'), false);
  assert.equal(validateDemoCvv('12a'), false);
});

test('validateDemoExpiry acepta fecha MM/AA no vencida', () => {
  const reference = new Date(2026, 5, 25);
  assert.equal(validateDemoExpiry('06/26', reference), true);
  assert.equal(validateDemoExpiry('12/26', reference), true);
});

test('validateDemoExpiry rechaza fecha vencida', () => {
  const reference = new Date(2026, 5, 25);
  assert.equal(validateDemoExpiry('05/26', reference), false);
  assert.equal(validateDemoExpiry('12/25', reference), false);
});

test('validateDemoExpiry rechaza formato o mes invalido', () => {
  const reference = new Date(2026, 5, 25);
  assert.equal(validateDemoExpiry('2026-12', reference), false);
  assert.equal(validateDemoExpiry('13/26', reference), false);
  assert.equal(validateDemoExpiry('00/26', reference), false);
});

test('normalizeQuantity convierte cantidades invalidas al minimo 1', () => {
  assert.equal(normalizeQuantity(0), 1);
  assert.equal(normalizeQuantity(-2), 1);
  assert.equal(normalizeQuantity('abc'), 1);
});

test('normalizeQuantity convierte decimales a entero hacia abajo', () => {
  assert.equal(normalizeQuantity(2.9), 2);
  assert.equal(normalizeQuantity('3'), 3);
});


