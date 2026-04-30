function formatPriceCLP(value) {
  const amount = Number(value);
  const safeAmount = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `$${safeAmount.toLocaleString('es-CL')}`;
}

function normalizeQuantity(value) {
  const quantity = Number(value);
  if (!Number.isFinite(quantity) || quantity < 1) {
    return 1;
  }
  return Math.floor(quantity);
}

function calculateCartTotal(items) {
  if (!Array.isArray(items)) {
    return 0;
  }

  return items.reduce((total, item) => {
    const price = Number(item.precio ?? item.price ?? 0);
    const quantity = normalizeQuantity(item.cantidad ?? item.quantity ?? 1);
    return total + price * quantity;
  }, 0);
}

function validateDemoCardNumber(value) {
  const raw = String(value ?? '').trim();
  if (!/^[0-9 ]+$/.test(raw)) {
    return false;
  }

  const digits = raw.replace(/\s/g, '');
  return /^\d{16}$/.test(digits);
}

function validateDemoCvv(value) {
  return /^\d{3}$/.test(String(value ?? '').trim());
}

function validateDemoExpiry(value, referenceDate = new Date()) {
  const match = /^(\d{2})\/(\d{2})$/.exec(String(value ?? '').trim());
  if (!match) {
    return false;
  }

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);

  if (month < 1 || month > 12) {
    return false;
  }

  const referenceYear = referenceDate.getFullYear();
  const referenceMonth = referenceDate.getMonth() + 1;

  return year > referenceYear || (year === referenceYear && month >= referenceMonth);
}

module.exports = {
  calculateCartTotal,
  formatPriceCLP,
  normalizeQuantity,
  validateDemoCardNumber,
  validateDemoCvv,
  validateDemoExpiry
};


