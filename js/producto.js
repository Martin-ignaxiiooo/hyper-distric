let productos = [];
const breadcrumbProducto = document.getElementById("breadcrumb-producto");
const detalleImagen = document.getElementById("detalle-imagen");
const detalleInfo = document.getElementById("detalle-info");
const detalleTecnico = document.getElementById("detalle-tecnico");
const productosRelacionados = document.getElementById("productos-relacionados");

let productoActual = null;
let tallaSeleccionada = "M";
let cantidadSeleccionada = 1;

function obtenerParametroProducto() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get("producto");
}

function formatearPrecio(precio) {
  return `CLP $${Number(precio).toLocaleString("es-CL")}`;
}

function crearDescripcionMarca(producto) {
  return `${producto.nombre} con enfoque ${producto.estilo ? producto.estilo.toLowerCase() : ''}, pensado para looks urbanos, presencia visual fuerte y una línea más de marca real que de catálogo básico.`;
}

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

function obtenerCarritoActual() {
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

function mostrarMensajeDetalle(texto, tipo = "exito") {
  const mensajeDetalle = document.getElementById("mensaje-detalle");

  if (!mensajeDetalle) return;

  mensajeDetalle.textContent = texto;
  mensajeDetalle.classList.remove("oculto", "exito", "info", "error");
  mensajeDetalle.classList.add(tipo);
}

function ocultarMensajeDetalle() {
  const mensajeDetalle = document.getElementById("mensaje-detalle");

  if (!mensajeDetalle) return;

  mensajeDetalle.classList.add("oculto");
  mensajeDetalle.classList.remove("exito", "info", "error");
  mensajeDetalle.textContent = "";
}

function asegurarModalDecisionCarrito() {
  let modal = document.getElementById("decision-carrito-modal");

  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "decision-carrito-modal";
  modal.className = "decision-carrito-modal oculto";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "decision-carrito-titulo");

  modal.innerHTML = `
    <div class="decision-carrito-card">
      <button type="button" class="decision-carrito-cerrar" aria-label="Cerrar">x</button>
      <span class="mini-badge">Carrito</span>
      <h2 id="decision-carrito-titulo">Producto agregado</h2>
      <p id="decision-carrito-texto">Quieres seguir comprando o ir a pagar?</p>

      <div class="decision-carrito-producto">
        <img id="decision-carrito-imagen" src="" alt="">
        <div>
          <strong id="decision-carrito-nombre"></strong>
          <span id="decision-carrito-detalle"></span>
        </div>
      </div>

      <div class="decision-carrito-acciones">
        <a href="./index.html#catalogo" class="btn-secundario">Seguir comprando</a>
        <a href="./carrito.html" class="btn-principal">Ir a pagar</a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    if (
      event.target === modal ||
      event.target.classList.contains("decision-carrito-cerrar")
    ) {
      cerrarModalDecisionCarrito();
    }
  });

  return modal;
}

function mostrarModalDecisionCarrito() {
  if (!productoActual) return;

  const modal = asegurarModalDecisionCarrito();
  const imagen = modal.querySelector("#decision-carrito-imagen");
  const nombre = modal.querySelector("#decision-carrito-nombre");
  const detalle = modal.querySelector("#decision-carrito-detalle");

  if (imagen) {
    imagen.src = productoActual.imagen;
    imagen.alt = productoActual.nombre;
  }

  if (nombre) nombre.textContent = productoActual.nombre;
  if (detalle) detalle.textContent = `Talla ${tallaSeleccionada} - Cantidad ${cantidadSeleccionada}`;

  modal.classList.remove("oculto");
  document.body.classList.add("modal-abierto");
}

function cerrarModalDecisionCarrito() {
  const modal = document.getElementById("decision-carrito-modal");

  if (!modal) return;

  modal.classList.add("oculto");
  document.body.classList.remove("modal-abierto");
}

function agregarProductoAlCarrito() {
  if (!productoActual) return;

  const carrito = obtenerCarritoActual();

  
  let cantidadEnCarrito = 0;
  carrito.forEach(item => {
      if (item.id === productoActual.id) {
          cantidadEnCarrito += item.cantidad;
      }
  });

  
  if (cantidadEnCarrito + cantidadSeleccionada > productoActual.stock) {
      mostrarMensajeDetalle(
          `¡Stock superado! Solo quedan ${productoActual.stock} unidades en total (tienes ${cantidadEnCarrito} en el carrito).`,
          "error"
      );
      return;
  }

  const existente = carrito.find(
    (item) => item.id === productoActual.id && item.talla === tallaSeleccionada
  );

  if (existente) {
    existente.cantidad += cantidadSeleccionada;
  } else {
    carrito.push({
      id: productoActual.id,
      slug: productoActual.slug,
      nombre: productoActual.nombre,
      precio: productoActual.precio,
      imagen: productoActual.imagen,
      talla: tallaSeleccionada,
      cantidad: cantidadSeleccionada
    });
  }

  guardarCarrito(carrito);
  if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();

  mostrarMensajeDetalle(
    `${productoActual.nombre} agregado al carrito. Talla ${tallaSeleccionada} · Cantidad ${cantidadSeleccionada}`,
    "exito"
  );

  mostrarModalDecisionCarrito();
}

function actualizarCantidadVista() {
  const cantidadValor = document.getElementById("cantidad-valor");
  if (cantidadValor) {
    cantidadValor.textContent = cantidadSeleccionada;
  }
}

function activarEventosDetalle() {
  const botonesTalla = document.querySelectorAll(".talla-btn");
  const botonMenos = document.getElementById("cantidad-menos");
  const botonMas = document.getElementById("cantidad-mas");
  const botonAgregar = document.getElementById("btn-agregar-carrito");

  botonesTalla.forEach((boton) => {
    boton.addEventListener("click", () => {
      botonesTalla.forEach((item) => item.classList.remove("active"));
      boton.classList.add("active");
      tallaSeleccionada = boton.textContent.trim();
      ocultarMensajeDetalle();
    });
  });

  if (botonMenos) {
    botonMenos.addEventListener("click", () => {
      if (cantidadSeleccionada > 1) {
        cantidadSeleccionada--;
        actualizarCantidadVista();
        ocultarMensajeDetalle();
      }
    });
  }

  if (botonMas) {
    botonMas.addEventListener("click", () => {
      cantidadSeleccionada++;
      actualizarCantidadVista();
      ocultarMensajeDetalle();
    });
  }

  if (botonAgregar) {
    botonAgregar.addEventListener("click", (event) => {
      event.preventDefault();
      agregarProductoAlCarrito();
    });
  }
}

function renderRelacionados(productoActual) {
  if (!productosRelacionados) return;

  const relacionados = productos.filter(
    (producto) => producto.slug !== productoActual.slug
  );

  productosRelacionados.innerHTML = relacionados
    .slice(0, 3)
    .map(
      (producto) => `
        <a href="./producto.html?producto=${producto.slug}" class="card-relacionado">
          <div class="card-relacionado-img">
            <img src="${producto.imagen}" alt="${producto.nombre}">
          </div>

          <div class="card-relacionado-info">
            <span>${producto.estilo}</span>
            <h3>${producto.nombre}</h3>
            <p>${formatearPrecio(producto.precio)}</p>
            <small>Ver producto</small>
          </div>
        </a>
      `
    )
    .join("");
}

async function cargarDatosYRenderizar() {
  try {
    const respuesta = await fetch("https://hyper-distric-productos.onrender.com/productos");
    if (!respuesta.ok) {
      throw new Error("Error al obtener los productos");
    }
    productos = await respuesta.json();
    renderProductoDetalle();
  } catch (error) {
    console.error("Hubo un problema con la petición fetch:", error);
    if (detalleInfo) {
      detalleInfo.innerHTML = "<p>Error al cargar el producto. Asegúrate de que el microservicio esté corriendo.</p>";
    }
  }
}

function renderProductoDetalle() {
  const slug = obtenerParametroProducto();

  if (!slug) {
    if (detalleInfo) {
      detalleInfo.innerHTML = "<p>No se encontró el producto.</p>";
    }
    return;
  }

  const producto = productos.find((item) => item.slug === slug);

  if (!producto) {
    if (detalleInfo) {
      detalleInfo.innerHTML = "<p>No se encontró el producto.</p>";
    }
    return;
  }

  productoActual = producto;
  tallaSeleccionada = "M";
  cantidadSeleccionada = 1;

  if (breadcrumbProducto) {
    breadcrumbProducto.innerHTML = `
      <a href="./index.html">Inicio</a>
      <span>/</span>
      <a href="./index.html#catalogo">Catálogo</a>
      <span>/</span>
      <span>${producto.categoria}</span>
      <span>/</span>
      <span>${producto.nombre}</span>
    `;
  }

  if (detalleImagen) {
    detalleImagen.src = producto.imagen;
    detalleImagen.alt = producto.nombre;
  }

  if (detalleInfo) {
    detalleInfo.innerHTML = `
      <span class="mini-badge mini-badge-detalle">${producto.badge}</span>
      <h1>${producto.nombre}</h1>
      <p class="detalle-precio">${formatearPrecio(producto.precio)}</p>
      <p class="detalle-linea-estilo">${producto.estilo}</p>

      <div class="detalle-datos">
        <div class="dato-item">
          <span class="dato-label">Categoría</span>
          <span class="dato-value">${producto.categoria}</span>
        </div>

        <div class="dato-item">
          <span class="dato-label">Color</span>
          <span class="dato-value">${producto.color}</span>
        </div>

        <div class="dato-item">
          <span class="dato-label">Stock</span>
          <span class="dato-value">${producto.stock} disponibles</span>
        </div>

        <div class="dato-item">
          <span class="dato-label">Material</span>
          <span class="dato-value">${producto.material}</span>
        </div>
      </div>

      <p class="detalle-descripcion detalle-descripcion-marca">
        ${crearDescripcionMarca(producto)}
      </p>

      <div class="selector-bloque">
        <p class="selector-label">Talla</p>
        <div class="selector-tallas">
          <button type="button" class="talla-btn">S</button>
          <button type="button" class="talla-btn active">M</button>
          <button type="button" class="talla-btn">L</button>
          <button type="button" class="talla-btn">XL</button>
        </div>
      </div>

      <div class="selector-bloque">
        <p class="selector-label">Cantidad</p>
        <div class="selector-cantidad">
          <button type="button" id="cantidad-menos">−</button>
          <span id="cantidad-valor">1</span>
          <button type="button" id="cantidad-mas">+</button>
        </div>
      </div>

      <div class="detalle-acciones">
        <a href="#" class="btn-principal" id="btn-agregar-carrito">Agregar al carrito</a>
        <a href="./index.html#catalogo" class="btn-secundario">Volver al catálogo</a>
      </div>

      <div id="mensaje-detalle" class="mensaje-detalle oculto"></div>
    `;
  }

  if (detalleTecnico) {
    detalleTecnico.innerHTML = `
      <div class="detalle-tecnico-item">
        <span class="dato-label">Fit</span>
        <span class="dato-value">${producto.estilo}</span>
      </div>

      <div class="detalle-tecnico-item">
        <span class="dato-label">Material</span>
        <span class="dato-value">${producto.material}</span>
      </div>

      <div class="detalle-tecnico-item">
        <span class="dato-label">Estilo</span>
        <span class="dato-value">${producto.estilo}</span>
      </div>

      <div class="detalle-tecnico-item">
        <span class="dato-label">Uso</span>
        <span class="dato-value">Ideal para outfits urbanos y uso diario</span>
      </div>

      <div class="detalle-tecnico-item">
        <span class="dato-label">Cuidado</span>
        <span class="dato-value">Lavado suave y no secadora</span>
      </div>
    `;
  }

  renderRelacionados(producto);
  activarEventosDetalle();
  ocultarMensajeDetalle();
}

document.addEventListener("DOMContentLoaded", () => {
  cargarDatosYRenderizar();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    cerrarModalDecisionCarrito();
  }
});


