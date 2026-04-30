const API_PRODUCTOS = "https://hyper-distric-productos.onrender.com/productos";
const API_USUARIOS = "https://hyper-distric-usuarios.onrender.com/usuarios";
const API_VENTAS = "https://hyper-distric-ventas.onrender.com/ventas";

const usuarioGuardadoAdmin = localStorage.getItem("usuarioHyperDistric");
const btnLogout = document.getElementById("btn-logout");
const mensajeAdmin = document.getElementById("mensaje-admin");
const btnNavProductos = document.getElementById("btn-nav-productos");
const btnNavStock = document.getElementById("btn-nav-stock");
const btnNavPedidos = document.getElementById("btn-nav-pedidos");
const btnNavUsuarios = document.getElementById("btn-nav-usuarios");
const panelProductos = document.getElementById("panel-productos");
const panelStock = document.getElementById("panel-stock");
const panelPedidos = document.getElementById("panel-pedidos");
const panelUsuarios = document.getElementById("panel-usuarios");
const btnNuevoProducto = document.getElementById("btn-nuevo-producto");
const formContainer = document.getElementById("form-producto-container");
const formProducto = document.getElementById("form-producto");
const btnCancelarProducto = document.getElementById("btn-cancelar-producto");

const ESTADOS_PEDIDO = [
  { id: 1, nombre: "Pendiente" },
  { id: 2, nombre: "Pagado" },
  { id: 3, nombre: "En preparacion" },
  { id: 4, nombre: "Enviado" },
  { id: 5, nombre: "Entregado" },
  { id: 6, nombre: "Cancelado" }
];

let accesoAdminValido = false;
let productosGlobales = [];

function validarAccesoAdmin() {
  if (!usuarioGuardadoAdmin) {
    window.location.href = "./login.html";
    return;
  }

  try {
    const usuario = JSON.parse(usuarioGuardadoAdmin);
    accesoAdminValido = Boolean(usuario && usuario.id && usuario.rol === "admin");
  } catch (error) {
    console.error(error);
  }

  if (!accesoAdminValido) {
    window.location.href = "./cuenta.html";
  }
}

function mostrarMensajeAdmin(texto, tipo = "error") {
  if (!mensajeAdmin) return;
  mensajeAdmin.textContent = texto;
  mensajeAdmin.classList.remove("oculto", "info", "error", "exito");
  mensajeAdmin.classList.add(tipo);
}

function ocultarMensajeAdmin() {
  if (mensajeAdmin) mensajeAdmin.classList.add("oculto");
}

async function obtenerJson(url, opciones) {
  const respuesta = await fetch(url, opciones);
  const data = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(data.error || data.mensaje || "No se pudieron cargar los datos.");
  }

  return data;
}

function formatearPrecioAdmin(precio) {
  return `CLP $${Number(precio || 0).toLocaleString("es-CL")}`;
}

function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function ocultarPaneles() {
  [panelProductos, panelStock, panelPedidos, panelUsuarios].forEach((panel) => {
    if (panel) panel.style.display = "none";
  });
}

function mostrarPanel(panel, cargarDatos) {
  ocultarPaneles();
  if (!panel) return;
  panel.style.display = "block";
  cargarDatos();
  panel.scrollIntoView({ behavior: "smooth" });
}

function renderProductos(productos) {
  const contenedor = document.getElementById("lista-productos");
  if (!contenedor) return;

  if (productos.length === 0) {
    contenedor.innerHTML = "<p>No hay productos registrados.</p>";
    return;
  }

  contenedor.innerHTML = productos.map((producto) => `
    <div style="background: var(--bg-soft); padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border-soft);">
      <div style="display: flex; gap: 15px; align-items: center;">
        <img src="${producto.imagen || ""}" alt="${producto.nombre}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
        <div>
          <h4 style="margin-bottom: 5px;">${producto.nombre}</h4>
          <span style="color: var(--text-secondary); font-size: 0.9rem;">${producto.slug} | ${formatearPrecioAdmin(producto.precio)} | Stock: ${producto.stock}</span>
        </div>
      </div>
      <div style="display: flex; gap: 10px;">
        <button onclick="editarProducto(${producto.id})" class="btn-secundario" style="padding: 8px 12px; font-size: 0.8rem;">Editar</button>
        <button onclick="eliminarProducto(${producto.id})" class="btn-secundario" style="padding: 8px 12px; font-size: 0.8rem; color: #ff5a1f; border-color: rgba(255,90,31,0.2);">Eliminar</button>
      </div>
    </div>
  `).join("");
}

async function cargarProductos() {
  const contenedor = document.getElementById("lista-productos");

  try {
    productosGlobales = await obtenerJson(API_PRODUCTOS);
    renderProductos(productosGlobales);
  } catch (error) {
    console.error("Error cargando productos", error);
    if (contenedor) contenedor.innerHTML = "<p>No se pudieron cargar los productos.</p>";
    mostrarMensajeAdmin("No se pudieron cargar los datos del panel. Revisa los microservicios.", "error");
  }
}

async function cargarStock() {
  const contenedor = document.getElementById("lista-stock");

  try {
    const productos = await obtenerJson(API_PRODUCTOS);
    if (!contenedor) return;

    if (productos.length === 0) {
      contenedor.innerHTML = "<p>No hay productos para mostrar stock.</p>";
      return;
    }

    contenedor.innerHTML = productos.map((producto) => `
      <div style="background: var(--bg-soft); padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border-soft);">
        <span style="font-weight: 600;">${producto.nombre}</span>
        <div style="display: flex; gap: 10px; align-items: center;">
          <input type="number" id="stock-input-${producto.id}" value="${producto.stock}" style="width: 80px; padding: 8px; border-radius: 8px; background: #0A0C10; color: white; border: 1px solid #333;">
          <button onclick="actualizarStock(${producto.id})" class="btn-principal" style="padding: 8px 15px; font-size: 0.85rem;">Guardar</button>
        </div>
      </div>
    `).join("");
  } catch (error) {
    console.error("Error cargando stock", error);
    if (contenedor) contenedor.innerHTML = "<p>No se pudo cargar el stock.</p>";
    mostrarMensajeAdmin("No se pudieron cargar los datos del panel. Revisa los microservicios.", "error");
  }
}

async function cargarUsuarios() {
  const contenedor = document.getElementById("lista-usuarios");

  try {
    const usuarios = await obtenerJson(API_USUARIOS);
    if (!contenedor) return;

    if (usuarios.length === 0) {
      contenedor.innerHTML = "<p>No hay usuarios registrados.</p>";
      return;
    }

    contenedor.innerHTML = usuarios.map((usuario) => `
      <div style="background: var(--bg-soft); padding: 15px; border-radius: 12px; border: 1px solid var(--border-soft);">
        <h4 style="margin-bottom: 5px;">${usuario.nombre}</h4>
        <p style="color: var(--text-secondary);">${usuario.email} | Rol: ${usuario.rol || "cliente"}</p>
      </div>
    `).join("");
  } catch (error) {
    console.error("Error cargando usuarios", error);
    if (contenedor) contenedor.innerHTML = "<p>No se pudieron cargar los usuarios.</p>";
    mostrarMensajeAdmin("No se pudieron cargar los datos del panel. Revisa los microservicios.", "error");
  }
}

function renderPedidos(ventas) {
  const contenedor = document.getElementById("lista-pedidos");
  if (!contenedor) return;

  if (ventas.length === 0) {
    contenedor.innerHTML = "<p>No hay pedidos registrados.</p>";
    return;
  }

  ventas.sort((a, b) => b.id - a.id);
  contenedor.innerHTML = ventas.map((venta) => {
    const detalles = Array.isArray(venta.detalles) ? venta.detalles : [];

    return `
      <div style="background: var(--bg-soft); padding: 20px; border-radius: 12px; border: 1px solid var(--border-soft);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 10px;">
          <h4 style="color: var(--accent-main);">Pedido #${venta.id}</h4>
          <span style="color: #888; font-size: 0.9rem;">${new Date(venta.fecha).toLocaleString("es-CL")}</span>
        </div>
        <p style="margin-bottom: 5px;"><strong>Cliente:</strong> ${venta.email || venta.usuario || "No disponible"}</p>
        <p style="margin-bottom: 5px;"><strong>Estado:</strong> ${venta.estado || "Sin estado"}</p>
        <p style="margin-bottom: 15px;"><strong>Total:</strong> ${formatearPrecioAdmin(venta.total)}</p>
        <div style="background: #0A0C10; padding: 10px; border-radius: 8px; font-size: 0.9rem; color: #ccc;">
          ${detalles.length > 0
            ? detalles.map((detalle) => `${detalle.cantidad}x ${detalle.nombre} (Talla ${detalle.talla || "Unica"})`).join("<br>")
            : "Detalle no disponible"}
        </div>
        <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
          <select id="estado-pedido-${venta.id}" style="flex: 1; padding: 10px; border-radius: 8px; background: #0A0C10; color: white; border: 1px solid #333;">
            ${ESTADOS_PEDIDO.map((estado) => `
              <option value="${estado.id}" ${normalizarTexto(estado.nombre) === normalizarTexto(venta.estado) ? "selected" : ""}>${estado.nombre}</option>
            `).join("")}
          </select>
          <button onclick="actualizarEstadoPedido(${venta.id})" class="btn-principal" style="padding: 10px 15px;">Actualizar estado</button>
        </div>
      </div>
    `;
  }).join("");
}

async function cargarPedidos() {
  const contenedor = document.getElementById("lista-pedidos");

  try {
    const ventas = await obtenerJson(API_VENTAS);
    renderPedidos(ventas);
  } catch (error) {
    console.error("Error cargando pedidos", error);
    if (contenedor) contenedor.innerHTML = "<p>No se pudieron cargar los pedidos.</p>";
    mostrarMensajeAdmin("No se pudieron cargar los datos del panel. Revisa los microservicios.", "error");
  }
}

async function cargarResumenAdmin() {
  try {
    const [productos, usuarios, ventas] = await Promise.all([
      obtenerJson(API_PRODUCTOS),
      obtenerJson(API_USUARIOS),
      obtenerJson(API_VENTAS)
    ]);
    const ingresos = ventas.reduce((total, venta) => total + Number(venta.total || 0), 0);

    document.getElementById("stat-total-productos").textContent = productos.length;
    document.getElementById("stat-total-usuarios").textContent = usuarios.length;
    document.getElementById("stat-total-pedidos").textContent = ventas.length;
    document.getElementById("stat-ingresos-totales").textContent = formatearPrecioAdmin(ingresos);
    ocultarMensajeAdmin();
  } catch (error) {
    console.error("Error cargando resumen admin", error);
    mostrarMensajeAdmin("No se pudieron cargar las estadisticas. Revisa los microservicios.", "error");
  }
}

window.actualizarStock = async (id) => {
  const input = document.getElementById(`stock-input-${id}`);
  if (!input) return;

  try {
    await obtenerJson(`${API_PRODUCTOS}/${id}/stock`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: Number(input.value) })
    });
    mostrarMensajeAdmin("Stock actualizado correctamente.", "exito");
    await Promise.all([cargarStock(), cargarProductos()]);
  } catch (error) {
    console.error(error);
    mostrarMensajeAdmin("No se pudo actualizar el stock.", "error");
  }
};

window.actualizarEstadoPedido = async (id) => {
  const selector = document.getElementById(`estado-pedido-${id}`);
  if (!selector) return;

  try {
    await obtenerJson(`${API_VENTAS}/${id}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado_id: Number(selector.value) })
    });
    mostrarMensajeAdmin(`Estado del pedido #${id} actualizado.`, "exito");
    await Promise.all([cargarPedidos(), cargarResumenAdmin()]);
  } catch (error) {
    console.error(error);
    mostrarMensajeAdmin("No se pudo actualizar el estado del pedido.", "error");
  }
};

window.editarProducto = (id) => {
  const producto = productosGlobales.find((item) => item.id === id);
  if (!producto) return;

  const categorias = { Poleras: 1, Hoodies: 2, Pantalones: 3, Chaquetas: 4 };
  document.getElementById("prod-id").value = producto.id;
  document.getElementById("prod-nombre").value = producto.nombre;
  document.getElementById("prod-slug").value = producto.slug;
  document.getElementById("prod-precio").value = producto.precio;
  document.getElementById("prod-stock").value = producto.stock;
  document.getElementById("prod-imagen").value = producto.imagen;
  document.getElementById("prod-categoria").value = categorias[producto.categoria] || 1;
  document.getElementById("prod-estilo").value = producto.estilo || "";
  document.getElementById("prod-color").value = producto.color || "";
  document.getElementById("prod-material").value = producto.material || "";
  document.getElementById("prod-descripcion").value = producto.descripcion || "";
  document.getElementById("prod-badge").value = producto.badge || "";
  document.getElementById("form-producto-titulo").innerText = "Editar Producto";
  formContainer.style.display = "block";
  btnNuevoProducto.style.display = "none";
  formContainer.scrollIntoView({ behavior: "smooth" });
};

window.eliminarProducto = async (id) => {
  if (!confirm("Seguro que deseas eliminar este producto?")) return;

  try {
    await obtenerJson(`${API_PRODUCTOS}/${id}`, { method: "DELETE" });
    mostrarMensajeAdmin("Producto eliminado correctamente.", "exito");
    await Promise.all([cargarProductos(), cargarStock(), cargarResumenAdmin()]);
  } catch (error) {
    console.error(error);
    mostrarMensajeAdmin("No se pudo eliminar el producto.", "error");
  }
};

if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioHyperDistric");
    localStorage.removeItem("adminHyperDistric");
    window.location.href = "./login.html";
  });
}

if (btnNavProductos) btnNavProductos.addEventListener("click", () => mostrarPanel(panelProductos, cargarProductos));
if (btnNavStock) btnNavStock.addEventListener("click", () => mostrarPanel(panelStock, cargarStock));
if (btnNavPedidos) btnNavPedidos.addEventListener("click", () => mostrarPanel(panelPedidos, cargarPedidos));
if (btnNavUsuarios) btnNavUsuarios.addEventListener("click", () => mostrarPanel(panelUsuarios, cargarUsuarios));

if (btnNuevoProducto) {
  btnNuevoProducto.addEventListener("click", () => {
    formProducto.reset();
    document.getElementById("prod-id").value = "";
    document.getElementById("form-producto-titulo").innerText = "Crear Producto";
    formContainer.style.display = "block";
    btnNuevoProducto.style.display = "none";
  });
}

if (btnCancelarProducto) {
  btnCancelarProducto.addEventListener("click", () => {
    formContainer.style.display = "none";
    btnNuevoProducto.style.display = "block";
  });
}

if (formProducto) {
  formProducto.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("prod-id").value;
    const payload = {
      nombre: document.getElementById("prod-nombre").value,
      slug: document.getElementById("prod-slug").value,
      precio: Number(document.getElementById("prod-precio").value),
      stock: Number(document.getElementById("prod-stock").value),
      imagen_url: document.getElementById("prod-imagen").value,
      categoria_id: Number(document.getElementById("prod-categoria").value),
      estilo: document.getElementById("prod-estilo").value,
      color: document.getElementById("prod-color").value,
      material: document.getElementById("prod-material").value,
      descripcion: document.getElementById("prod-descripcion").value,
      badge: document.getElementById("prod-badge").value
    };

    try {
      await obtenerJson(id ? `${API_PRODUCTOS}/${id}` : API_PRODUCTOS, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      formContainer.style.display = "none";
      btnNuevoProducto.style.display = "block";
      mostrarMensajeAdmin("Producto guardado correctamente.", "exito");
      await Promise.all([cargarProductos(), cargarStock(), cargarResumenAdmin()]);
    } catch (error) {
      console.error(error);
      mostrarMensajeAdmin("No se pudo guardar el producto.", "error");
    }
  });
}

validarAccesoAdmin();

document.addEventListener("DOMContentLoaded", () => {
  if (!accesoAdminValido) return;

  cargarResumenAdmin();
  cargarProductos();
  cargarStock();
  cargarUsuarios();
  ocultarPaneles();

  if (panelPedidos) {
    panelPedidos.style.display = "block";
    cargarPedidos();
  }
});


