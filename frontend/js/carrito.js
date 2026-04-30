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
  mensajeCarrito.classList.remove("oculto", "exito", "info");
  mensajeCarrito.classList.add(tipo);
}

function ocultarMensaje() {
  if (!mensajeCarrito) return;

  mensajeCarrito.classList.add("oculto");
  mensajeCarrito.classList.remove("exito", "info");
  mensajeCarrito.textContent = "";
}

function eliminarProducto(index) {
  const carrito = obtenerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  renderCarrito();
  mostrarMensaje("Producto eliminado del carrito.", "info");
}

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
    renderCarrito();
    mostrarMensaje("Carrito vaciado correctamente.", "info");
  });
}

if (btnFinalizar) {
  btnFinalizar.addEventListener("click", () => {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
      mostrarMensaje("Tu carrito está vacío.", "info");
      return;
    }

    mostrarMensaje(
      "Compra simulada correctamente. Tu selección quedó registrada en esta demo.",
      "exito"
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();
  ocultarMensaje();
  controlarAvisoCuenta();
});