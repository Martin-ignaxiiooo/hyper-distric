const usuarioGuardado = localStorage.getItem("usuarioHyperDistric");
const btnLogoutCuenta = document.getElementById("btn-logout-cuenta");
const btnRecargarPedidos = document.getElementById("btn-recargar-pedidos");
const tituloCuenta = document.getElementById("titulo-cuenta");
const nombreUsuarioCuenta = document.getElementById("nombre-usuario-cuenta");
const emailUsuarioCuenta = document.getElementById("email-usuario-cuenta");
const rolUsuarioCuenta = document.getElementById("rol-usuario-cuenta");
const datoNombre = document.getElementById("dato-nombre");
const datoEmail = document.getElementById("dato-email");
const datoRol = document.getElementById("dato-rol");
const totalPedidosCuenta = document.getElementById("total-pedidos-cuenta");
const totalGastadoCuenta = document.getElementById("total-gastado-cuenta");
const ultimoPedidoCuenta = document.getElementById("ultimo-pedido-cuenta");
const mensajePedidosCuenta = document.getElementById("mensaje-pedidos-cuenta");
const listaPedidosCuenta = document.getElementById("lista-pedidos-cuenta");

let usuario = null;

function formatearPrecio(precio) {
  return `CLP $${Number(precio).toLocaleString("es-CL")}`;
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString("es-CL", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function obtenerDetalles(detalles) {
  if (!detalles) return [];
  if (Array.isArray(detalles)) return detalles;

  try {
    return JSON.parse(detalles);
  } catch (error) {
    console.error(error);
    return [];
  }
}

function mostrarMensajePedidos(texto, tipo = "info") {
  if (!mensajePedidosCuenta) return;

  mensajePedidosCuenta.textContent = texto;
  mensajePedidosCuenta.classList.remove("oculto", "info", "error", "exito");
  mensajePedidosCuenta.classList.add(tipo);
}

function ocultarMensajePedidos() {
  if (!mensajePedidosCuenta) return;
  mensajePedidosCuenta.classList.add("oculto");
}

function cargarDatosCuenta() {
  if (!usuarioGuardado) {
    window.location.href = "./login.html";
    return;
  }

  try {
    usuario = JSON.parse(usuarioGuardado);
  } catch (error) {
    console.error(error);
    localStorage.removeItem("usuarioHyperDistric");
    localStorage.removeItem("adminHyperDistric");
    window.location.href = "./login.html";
    return;
  }

  if (!usuario || !usuario.id) {
    localStorage.removeItem("usuarioHyperDistric");
    localStorage.removeItem("adminHyperDistric");
    window.location.href = "./login.html";
    return;
  }

  const nombre = usuario.nombre || "Cliente Hyper Distric";
  const email = usuario.usuario || usuario.email || "Correo no disponible";
  const rol = usuario.rol || "cliente";

  if (tituloCuenta) tituloCuenta.textContent = `Hola, ${nombre}`;
  if (nombreUsuarioCuenta) nombreUsuarioCuenta.textContent = nombre;
  if (emailUsuarioCuenta) emailUsuarioCuenta.textContent = email;
  if (rolUsuarioCuenta) rolUsuarioCuenta.textContent = `Rol: ${rol}`;
  if (datoNombre) datoNombre.textContent = nombre;
  if (datoEmail) datoEmail.textContent = email;
  if (datoRol) datoRol.textContent = rol;
}

function actualizarResumenPedidos(pedidos) {
  const totalPedidos = pedidos.length;
  const totalGastado = pedidos.reduce((acc, pedido) => acc + Number(pedido.total || 0), 0);

  if (totalPedidosCuenta) totalPedidosCuenta.textContent = totalPedidos;
  if (totalGastadoCuenta) totalGastadoCuenta.textContent = formatearPrecio(totalGastado);

  if (ultimoPedidoCuenta) {
    ultimoPedidoCuenta.textContent = totalPedidos > 0
      ? `Pedido #${pedidos[0].id}`
      : "Sin pedidos";
  }
}

function renderPedidos(pedidos) {
  if (!listaPedidosCuenta) return;

  actualizarResumenPedidos(pedidos);

  if (pedidos.length === 0) {
    listaPedidosCuenta.innerHTML = `
      <article class="cuenta-pedido cuenta-pedido-vacio">
        <h3>Aun no tienes pedidos</h3>
        <p>Cuando realices una compra, aparecera aqui con su estado y detalle.</p>
        <a href="./index.html#catalogo" class="btn-principal">Ir al catalogo</a>
      </article>
    `;
    return;
  }

  listaPedidosCuenta.innerHTML = pedidos.map((pedido) => {
    const detalles = obtenerDetalles(pedido.detalles);
    const detalleHtml = detalles.length > 0
      ? detalles.map((detalle) => `
          <li>
            <span>${detalle.cantidad}x ${detalle.nombre}</span>
            <strong>${formatearPrecio(Number(detalle.precio_unitario || 0) * Number(detalle.cantidad || 0))}</strong>
          </li>
        `).join("")
      : `<li><span>Detalle no disponible</span><strong>-</strong></li>`;

    return `
      <article class="cuenta-pedido">
        <div class="cuenta-pedido-top">
          <div>
            <span class="cuenta-pedido-id">Pedido #${pedido.id}</span>
            <h3>${formatearPrecio(pedido.total)}</h3>
          </div>
          <span class="cuenta-estado">${pedido.estado}</span>
        </div>

        <p class="cuenta-pedido-fecha">${formatearFecha(pedido.fecha)}</p>

        <ul class="cuenta-pedido-detalle">
          ${detalleHtml}
        </ul>
      </article>
    `;
  }).join("");
}

async function cargarPedidosCuenta() {
  if (!usuario || !usuario.id) return;

  mostrarMensajePedidos("Cargando pedidos...");

  try {
    const respuesta = await fetch(`https://hyper-distric-ventas.onrender.com/ventas/usuario/${usuario.id}`);
    const pedidos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(pedidos.error || "No se pudieron cargar los pedidos.");
    }

    ocultarMensajePedidos();
    renderPedidos(pedidos);
  } catch (error) {
    console.error(error);
    actualizarResumenPedidos([]);
    if (listaPedidosCuenta) listaPedidosCuenta.innerHTML = "";
    mostrarMensajePedidos("No se pudieron cargar tus pedidos. Revisa que el servicio de ventas este corriendo.", "error");
  }
}

if (btnLogoutCuenta) {
  btnLogoutCuenta.addEventListener("click", () => {
    localStorage.removeItem("usuarioHyperDistric");
    localStorage.removeItem("adminHyperDistric");
    window.location.href = "./login.html";
  });
}

if (btnRecargarPedidos) {
  btnRecargarPedidos.addEventListener("click", cargarPedidosCuenta);
}

document.addEventListener("DOMContentLoaded", () => {
  cargarDatosCuenta();
  cargarPedidosCuenta();
});


