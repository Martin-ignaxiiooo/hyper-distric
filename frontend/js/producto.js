const productos = [
  {
    id: 1,
    slug: "polera-oversize-negra",
    nombre: "Polera Oversize Negra",
    precio: 14990,
    color: "Negro",
    stock: 10,
    categoria: "Poleras",
    estilo: "Oversized fit",
    material: "Algodón suave",
    descripcion:
      "Polera Oversize Negra con enfoque oversized fit, pensada para looks urbanos, presencia visual fuerte y una línea más de marca real que de catálogo básico.",
    imagen: "./img/polera-oversize-negra.jpg",
    badge: "Streetwear"
  },
  {
    id: 2,
    slug: "hoodie-street-gris",
    nombre: "Hoodie Street Gris",
    precio: 29990,
    color: "Gris",
    stock: 8,
    categoria: "Hoodies",
    estilo: "Streetwear urbano",
    material: "Algodón premium",
    descripcion:
      "Hoodie Street Gris con enfoque streetwear urbano, pensado para looks urbanos, presencia visual fuerte y una línea más de marca real que de catálogo básico.",
    imagen: "./img/hoodie-street-gris.jpg",
    badge: "Nuevo Drop"
  },
  {
    id: 3,
    slug: "pantalon-cargo-beige",
    nombre: "Pantalón Cargo Beige",
    precio: 24990,
    color: "Beige",
    stock: 6,
    categoria: "Pantalones",
    estilo: "Drop urbano",
    material: "Tela resistente urbana",
    descripcion:
      "Pantalón Cargo Beige con enfoque drop urbano, pensado para looks urbanos, presencia visual fuerte y una línea más de marca real que de catálogo básico.",
    imagen: "./img/pantalon-cargo-beige.jpg",
    badge: "Nueva colección"
  },
  {
    id: 4,
    slug: "chaqueta-denim-azul",
    nombre: "Chaqueta Denim Azul",
    precio: 34990,
    color: "Azul",
    stock: 5,
    categoria: "Chaquetas",
    estilo: "Streetwear denim",
    material: "Denim",
    descripcion:
      "Chaqueta Denim Azul con enfoque streetwear denim, pensada para looks urbanos, presencia visual fuerte y una línea más de marca real que de catálogo básico.",
    imagen: "./img/chaqueta-denim-azul.jpg",
    badge: "Colección"
  }
];

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
  return `${producto.nombre} con enfoque ${producto.estilo.toLowerCase()}, pensado para looks urbanos, presencia visual fuerte y una línea más de marca real que de catálogo básico.`;
}

function obtenerCarritoActual() {
  const carritoGuardado = localStorage.getItem("carritoHyperDistric");
  return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carritoHyperDistric", JSON.stringify(carrito));
}

function mostrarMensajeDetalle(texto, tipo = "exito") {
  const mensajeDetalle = document.getElementById("mensaje-detalle");

  if (!mensajeDetalle) return;

  mensajeDetalle.textContent = texto;
  mensajeDetalle.classList.remove("oculto", "exito", "info");
  mensajeDetalle.classList.add(tipo);
}

function ocultarMensajeDetalle() {
  const mensajeDetalle = document.getElementById("mensaje-detalle");

  if (!mensajeDetalle) return;

  mensajeDetalle.classList.add("oculto");
  mensajeDetalle.classList.remove("exito", "info");
  mensajeDetalle.textContent = "";
}

function agregarProductoAlCarrito() {
  if (!productoActual) return;

  const carrito = obtenerCarritoActual();

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

  mostrarMensajeDetalle(
    `${productoActual.nombre} agregado al carrito. Talla ${tallaSeleccionada} · Cantidad ${cantidadSeleccionada}`,
    "exito"
  );
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
  renderProductoDetalle();
});