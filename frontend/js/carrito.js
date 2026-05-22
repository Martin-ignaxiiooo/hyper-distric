const carritoLista = document.getElementById("carrito-lista");
const resumenProductos = document.getElementById("resumen-productos");
const resumenTotal = document.getElementById("resumen-total");
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");
const btnFinalizar = document.getElementById("btn-finalizar");
const mensajeCarrito = document.getElementById("mensaje-carrito");

const carritoAccountCta = document.getElementById("carrito-account-cta");
const cerrarCarritoAccountCta = document.getElementById("cerrar-carrito-account-cta");

function obtenerCarrito() {
  const carritoGuardado = localStorage.getItem("carritoHyperDistric");
  return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carritoHyperDistric", JSON.stringify(carrito));
}

function formatearPrecio(precio) {
  return `CLP $${Number(precio).toLocaleString("es-CL")}`;
}

function calcularTotal(carrito) {
  return carrito.reduce((acc, item) => {
    return acc + item.precio * item.cantidad;
  }, 0);
}

function calcularCantidadProductos(carrito) {
  return carrito.reduce((acc, item) => {
    return acc + item.cantidad;
  }, 0);
}

function mostrarMensaje(texto, tipo = "exito") {
  if (!mensajeCarrito) return;

  mensajeCarrito.textContent = texto;
  mensajeCarrito.classList.remove("oculto", "exito", "info", "error");
  mensajeCarrito.classList.add(tipo);
}

function ocultarMensaje() {
  if (!mensajeCarrito) return;

  mensajeCarrito.classList.add("oculto");
  mensajeCarrito.classList.remove("exito", "info", "error");
  mensajeCarrito.textContent = "";
}

function obtenerUsuarioAutenticado() {
  const usuarioGuardado = localStorage.getItem('usuarioHyperDistric');

  if (!usuarioGuardado) return null;

  try {
    const usuario = JSON.parse(usuarioGuardado);
    if (usuario && usuario.id) return usuario;

    localStorage.removeItem('usuarioHyperDistric');
    localStorage.removeItem('adminHyperDistric');
    return null;
  } catch (error) {
    console.error(error);
    localStorage.removeItem('usuarioHyperDistric');
    localStorage.removeItem('adminHyperDistric');
    return null;
  }
}

function eliminarProducto(index) {
  const carrito = obtenerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
  renderCarrito();
  mostrarMensaje("Producto eliminado del carrito.", "info");
}

window.eliminarProducto = eliminarProducto;

function renderCarrito() {
  const carrito = obtenerCarrito();

  if (!carritoLista) return;

  if (carrito.length === 0) {
    carritoLista.innerHTML = `
      <div class="carrito-vacio">
        <h3>Tu carrito está vacío</h3>
        <p>Aún no has agregado productos.</p>
        <a href="./index.html#catalogo" class="btn-principal">Ir al catálogo</a>
      </div>
    `;

    if (resumenProductos) resumenProductos.textContent = "0";
    if (resumenTotal) resumenTotal.textContent = "CLP $0";
    return;
  }

  carritoLista.innerHTML = carrito
    .map((item, index) => {
      const subtotal = item.precio * item.cantidad;

      return `
        <article class="carrito-item">
          <div class="carrito-item-img">
            <img src="${item.imagen}" alt="${item.nombre}">
          </div>

          <div class="carrito-item-info">
            <div class="carrito-item-top">
              <span class="carrito-item-etiqueta">Talla ${item.talla}</span>
            </div>

            <h3 class="carrito-item-nombre">${item.nombre}</h3>

            <p class="carrito-item-precio">${formatearPrecio(item.precio)}</p>

            <p class="carrito-item-cantidad">
              Cantidad: <strong>${item.cantidad}</strong>
            </p>

            <div class="carrito-item-bottom">
              <div class="carrito-item-subtotal-box">
                <span class="carrito-item-subtotal-label">Subtotal</span>
                <p class="carrito-item-subtotal-valor">${formatearPrecio(subtotal)}</p>
              </div>

              <button class="carrito-eliminar" onclick="eliminarProducto(${index})">
                Eliminar
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  if (resumenProductos) {
    resumenProductos.textContent = calcularCantidadProductos(carrito);
  }

  if (resumenTotal) {
    resumenTotal.textContent = formatearPrecio(calcularTotal(carrito));
  }
}

function controlarAvisoCuenta() {
  if (!carritoAccountCta) return;

  const usuarioGuardado = localStorage.getItem("usuarioHyperDistric");
  const avisoCerrado = sessionStorage.getItem("carritoAccountCtaCerrado");

  if (!usuarioGuardado && avisoCerrado !== "true") {
    carritoAccountCta.classList.remove("oculto");
  }
}

if (cerrarCarritoAccountCta) {
  cerrarCarritoAccountCta.addEventListener("click", () => {
    carritoAccountCta.classList.add("oculto");
    sessionStorage.setItem("carritoAccountCtaCerrado", "true");
  });
}

if (btnVaciarCarrito) {
  btnVaciarCarrito.addEventListener("click", () => {
    localStorage.removeItem("carritoHyperDistric");
    if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
    renderCarrito();
    mostrarMensaje("Carrito vaciado correctamente.", "info");
  });
}




const modalPago = document.getElementById('modal-pago');
const cerrarModalPago = document.getElementById('cerrar-modal-pago');
const formPago = document.getElementById('form-pago');
const pagoError = document.getElementById('pago-error');
const textoBotonPago = 'Confirmar pago';

function mostrarErrorPago(texto) {
  if (!pagoError) return;

  pagoError.textContent = texto;
  pagoError.style.display = 'block';
}

function ocultarErrorPago() {
  if (!pagoError) return;

  pagoError.textContent = '';
  pagoError.style.display = 'none';
}

function nombreTarjetaValido(nombre) {
  const limpio = nombre.trim().replace(/\s+/g, ' ');
  const partes = limpio.split(' ').filter(Boolean);
  const letras = limpio.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');

  return limpio.length >= 8 &&
    letras.length >= 6 &&
    partes.length >= 2 &&
    partes.every(parte => parte.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '').length >= 2);
}

function expiracionValida(expiracion) {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiracion)) return false;

  const [mes, anio] = expiracion.split('/').map(Number);
  const fechaLimite = new Date(2000 + anio, mes, 1);
  const hoy = new Date();
  const mesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  return fechaLimite > mesActual;
}

function validarFormularioPago() {
  const numero = document.getElementById('pago-numero').value.replace(/\D/g, '');
  const nombre = document.getElementById('pago-nombre').value.trim().replace(/\s+/g, ' ');
  const expiracion = document.getElementById('pago-expiracion').value.trim();
  const cvv = document.getElementById('pago-cvv').value.replace(/\D/g, '');

  if (!/^\d{16}$/.test(numero)) {
    mostrarErrorPago('El número de tarjeta debe tener exactamente 16 dígitos.');
    return null;
  }

  if (!nombreTarjetaValido(nombre)) {
    mostrarErrorPago('Ingresa nombre y apellido como aparece en la tarjeta.');
    return null;
  }

  if (!expiracionValida(expiracion)) {
    mostrarErrorPago('La fecha de expiración debe ser válida y no estar vencida.');
    return null;
  }

  if (!/^\d{3}$/.test(cvv)) {
    mostrarErrorPago('El CVV debe tener exactamente 3 números.');
    return null;
  }

  return {
    numero,
    nombre: nombre.toUpperCase(),
    expiracion,
    cvv
  };
}

function abrirModalPago() {
  if (!modalPago) return;
  modalPago.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  if (!modalPago) return;
  modalPago.style.display = 'none';
  document.body.style.overflow = '';
  ocultarErrorPago();
}

if (cerrarModalPago) cerrarModalPago.addEventListener('click', cerrarModal);
if (modalPago) modalPago.addEventListener('click', (e) => { if (e.target === modalPago) cerrarModal(); });


if (btnFinalizar) {
  btnFinalizar.addEventListener('click', () => {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
      mostrarMensaje('Tu carrito está vacío.', 'info');
      return;
    }
    if (!obtenerUsuarioAutenticado()) {
      mostrarMensaje('Debes iniciar sesion con tu cuenta antes de pagar.', 'info');
      if (carritoAccountCta) carritoAccountCta.classList.remove("oculto");
      return;
    }

    abrirModalPago();
  });
}


if (formPago) {
  formPago.addEventListener('submit', async (e) => {
    e.preventDefault();

    ocultarErrorPago();

    const datosTarjeta = validarFormularioPago();
    if (!datosTarjeta) return;

    const btnConfirmar = document.getElementById('btn-confirmar-pago');
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Procesando...';

    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
      mostrarErrorPago('Tu carrito está vacío.');
      btnConfirmar.disabled = false;
      btnConfirmar.textContent = textoBotonPago;
      return;
    }

    const usuario = obtenerUsuarioAutenticado();
    if (!usuario) {
      mostrarErrorPago('Debes iniciar sesion con tu cuenta antes de pagar.');
      btnConfirmar.disabled = false;
      btnConfirmar.textContent = textoBotonPago;
      return;
    }

    const carritoFormateado = carrito.map(item => ({
      producto_id: item.id,
      cantidad: item.cantidad,
      precio_unitario: item.precio,
      talla: item.talla
    }));

    const totalPagado = calcularTotal(carrito);

    try {
      const response = await fetch('http://localhost:3003/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: Number(usuario.id),
          total: totalPagado,
          carrito: carritoFormateado,
          tarjeta: datosTarjeta
        })
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarErrorPago(data.error || 'Error al procesar el pago.');
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = textoBotonPago;
        return;
      }

      
      cerrarModal();
      const email = data.email || usuario.usuario || usuario.email || 'tu correo';
      const totalConfirmado = Number(data.total || totalPagado);
      localStorage.removeItem('carritoHyperDistric');
      if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();

      const carritoLayout = document.querySelector('.carrito-layout');
      if (carritoLayout) {
        const htmlDetalle = carrito.map(item => `
          <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #222;">
            <span style="color:#aaa;">${item.cantidad}x ${item.nombre} (Talla ${item.talla})</span>
            <span style="color:#fff;">CLP $${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
          </div>
        `).join('');

        carritoLayout.innerHTML = `
          <div style="max-width:600px; margin:0 auto; padding:40px 20px; text-align:left;">
            <div style="text-align:center; margin-bottom:30px;">
              <div style="font-size:3rem; margin-bottom:10px;"></div>
              <h2 style="color:#4ade80; font-size:2rem; margin:0 0 8px 0;">¡Compra Exitosa!</h2>
              <p style="color:#888;">Comprobante enviado a <strong style="color:#fff;">${email}</strong></p>
            </div>

            <div style="background:#111; padding:30px; border-radius:14px; border:1px solid #222; margin-bottom:24px;">
              <p style="color:#555; font-size:0.8rem; letter-spacing:2px; margin:0 0 16px 0;">ORDEN #${data.pedido_id} · PAGADO ✓</p>
              ${htmlDetalle}
              <div style="display:flex; justify-content:space-between; margin-top:20px; padding-top:16px; border-top:1px dashed #333; font-weight:700; font-size:1.1rem;">
                <span style="color:#fff;">TOTAL PAGADO</span>
                <span style="color:#4ade80;">CLP $${totalConfirmado.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <a href="./index.html#catalogo" class="btn-principal" style="display:block; text-align:center; padding:16px;">Volver a la tienda</a>
          </div>
        `;
      }

    } catch (error) {
      console.error(error);
      mostrarErrorPago('Error de conexion. Asegurate de que el backend este corriendo.');
      btnConfirmar.disabled = false;
      btnConfirmar.textContent = textoBotonPago;
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();
  ocultarMensaje();
  controlarAvisoCuenta();
});
