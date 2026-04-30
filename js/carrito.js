const carritoLista = document.getElementById("carrito-lista");
const resumenProductos = document.getElementById("resumen-productos");
const resumenTotal = document.getElementById("resumen-total");
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");
const btnFinalizar = document.getElementById("btn-finalizar");
const mensajeCarrito = document.getElementById("mensaje-carrito");
const carritoAccountCta = document.getElementById("carrito-account-cta");
const cerrarCarritoAccountCta = document.getElementById("cerrar-carrito-account-cta");

const checkoutModal = document.getElementById("checkout-modal");
const checkoutCerrar = document.getElementById("checkout-cerrar");
const checkoutConfirmar = document.getElementById("checkout-confirmar");
const checkoutCantidad = document.getElementById("checkout-cantidad");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutMetodoResumen = document.getElementById("checkout-metodo-resumen");
const checkoutEstado = document.getElementById("checkout-estado");
const checkoutMetodos = document.querySelectorAll(".checkout-metodo");

const mpPublicKey = 'APP_USR-a4f4dd95-a183-4e71-aaaf-04e5e5b32d60';
let mpInstance = null;
if (window.MercadoPago) {
  try {
    mpInstance = new window.MercadoPago(mpPublicKey, { locale: 'es-CL' });
  } catch (error) {
    console.error("Error inicializando MercadoPago:", error);
  }
}

let metodoPagoSeleccionado = "tarjeta";
let checkoutProcesando = false;

function obtenerClaveCarritoLocal() {
  const userStr = localStorage.getItem("usuarioHyperDistric");
  if (userStr) {
    try {
      const usuario = JSON.parse(userStr);
      if (usuario && usuario.id) return `carritoHyperDistric_${usuario.id}`;
    } catch (e) {}
  }
  return "carritoHyperDistric_invitado";
}

function obtenerCarrito() {
  const clave = obtenerClaveCarritoLocal();
  const carritoGuardado = localStorage.getItem(clave);
  if (!carritoGuardado) return [];
  try {
    const parsed = JSON.parse(carritoGuardado);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function guardarCarrito(carrito) {
  const clave = obtenerClaveCarritoLocal();
  localStorage.setItem(clave, JSON.stringify(carrito));
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
  const usuarioGuardado = localStorage.getItem("usuarioHyperDistric");

  if (!usuarioGuardado) return null;

  try {
    const usuario = JSON.parse(usuarioGuardado);
    if (usuario && usuario.id) return usuario;

    localStorage.removeItem("usuarioHyperDistric");
    localStorage.removeItem("adminHyperDistric");
    return null;
  } catch (error) {
    console.error(error);
    localStorage.removeItem("usuarioHyperDistric");
    localStorage.removeItem("adminHyperDistric");
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

  const validItems = carrito.filter(item => item && typeof item === 'object');
  
  if (validItems.length === 0) {
    carritoLista.innerHTML = `
      <div class="carrito-vacio">
        <h3>Tu carrito esta vacio</h3>
        <p>Aun no has agregado productos.</p>
        <a href="./index.html#catalogo" class="btn-principal">Ir al catalogo</a>
      </div>
    `;

    if (resumenProductos) resumenProductos.textContent = "0";
    if (resumenTotal) resumenTotal.textContent = "CLP $0";
    return;
  }

  carritoLista.innerHTML = validItems.map((item, index) => {
    const subtotal = (item.precio || 0) * (item.cantidad || 0);

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
          <p class="carrito-item-cantidad">Cantidad: <strong>${item.cantidad}</strong></p>

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
  }).join("");

  if (resumenProductos) resumenProductos.textContent = calcularCantidadProductos(carrito);
  if (resumenTotal) resumenTotal.textContent = formatearPrecio(calcularTotal(carrito));
}

function controlarAvisoCuenta() {
  if (!carritoAccountCta) return;

  const usuarioGuardado = localStorage.getItem("usuarioHyperDistric");
  const avisoCerrado = sessionStorage.getItem("carritoAccountCtaCerrado");

  if (!usuarioGuardado && avisoCerrado !== "true") {
    carritoAccountCta.classList.remove("oculto");
  }
}

function limpiarCamposPago() {
  // No hay campos de tarjeta que limpiar
}

function mostrarEstadoCheckout(texto, tipo = "info") {
  if (!checkoutEstado) return;
  checkoutEstado.textContent = texto;
  checkoutEstado.classList.remove("oculto", "info", "error", "exito", "procesando");
  checkoutEstado.classList.add(tipo);
}

function ocultarEstadoCheckout() {
  if (!checkoutEstado) return;
  checkoutEstado.textContent = "";
  checkoutEstado.classList.add("oculto");
  checkoutEstado.classList.remove("info", "error", "exito", "procesando");
}

function seleccionarMetodoPago(metodo) {
  metodoPagoSeleccionado = metodo;

  checkoutMetodos.forEach((boton) => {
    const activo = boton.dataset.metodo === metodo;
    boton.classList.toggle("activo", activo);
    boton.setAttribute("aria-pressed", String(activo));
  });

  if (checkoutMetodoResumen) {
    checkoutMetodoResumen.textContent = "Mercado Pago";
  }
}

// Funciones del checkout modal eliminadas

async function registrarVentaSimulada() {
  if (checkoutProcesando) return;

  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    cerrarCheckoutSimulado(true);
    mostrarMensaje("Tu carrito esta vacio.", "info");
    return;
  }

  const usuario = obtenerUsuarioAutenticado();
  if (!usuario) {
    mostrarMensaje("Debes iniciar sesion para finalizar tu compra. Redirigiendo...", "error");
    setTimeout(() => {
      window.location.href = "./login.html";
    }, 2000);
    return;
  }

  const usuarioId = Number(usuario.id);
  const carritoFormateado = carrito.map((item) => ({
    producto_id: item.id,
    cantidad: item.cantidad,
    talla: item.talla
  }));

  checkoutProcesando = true;
  if (btnFinalizar) {
    btnFinalizar.disabled = true;
    btnFinalizar.textContent = "Preparando pago seguro...";
  }

  try {
    const response = await fetch("https://hyper-distric-ventas.onrender.com/mercadopago/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            usuario_id: usuarioId,
            carrito: carritoFormateado,
            total: calcularTotal(carrito)
        })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        const mensaje = data.error || "No fue posible iniciar el pago con Mercado Pago.";
        mostrarMensaje(mensaje, "error");
        checkoutProcesando = false;
        if (btnFinalizar) {
            btnFinalizar.disabled = false;
            btnFinalizar.textContent = "Finalizar compra";
        }
        return;
    }
    
    window.open(data.init_point, '_blank');
    
    if (btnFinalizar) {
        btnFinalizar.textContent = "Ya completé el pago en la otra pestaña";
        btnFinalizar.style.backgroundColor = "#28a745"; // Verde de éxito
        btnFinalizar.style.color = "white";
        
        const nuevoBtn = btnFinalizar.cloneNode(true);
        btnFinalizar.parentNode.replaceChild(nuevoBtn, btnFinalizar);
        
        nuevoBtn.disabled = false;
        nuevoBtn.style.cursor = "pointer";
        
        nuevoBtn.addEventListener("click", () => {
            window.location.href = `./exito.html?pedido_id=${data.pedido_id}&metodo=mp`;
        });
    }
    return;
  } catch (error) {
    console.error(error);
    const mensaje = "Error de conexion. No fue posible procesar el pago.";
    mostrarMensaje(mensaje, "error");
    checkoutProcesando = false;
    if (btnFinalizar) {
        btnFinalizar.disabled = false;
        btnFinalizar.textContent = "Finalizar compra";
    }
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
    localStorage.removeItem(obtenerClaveCarritoLocal());
    if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
    renderCarrito();
    mostrarMensaje("Carrito vaciado correctamente.", "info");
  });
}

if (btnFinalizar) btnFinalizar.addEventListener("click", registrarVentaSimulada);

document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();
  ocultarMensaje();
  controlarAvisoCuenta();
});


