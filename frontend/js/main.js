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

function formatearPrecio(precio) {
  return `CLP $${Number(precio).toLocaleString("es-CL")}`;
}

function crearCardProducto(producto) {
  return `
    <article class="tarjeta-producto">
      <div class="tarjeta-imagen">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>

      <div class="tarjeta-contenido">
        <span class="mini-badge">${producto.badge}</span>
        <h3>${producto.nombre}</h3>
        <p class="precio">${formatearPrecio(producto.precio)}</p>
        <p class="detalle-corto">${producto.estilo}</p>
        <p class="meta"><strong>Color:</strong> ${producto.color}</p>
        <p class="meta"><strong>Stock:</strong> ${producto.stock}</p>
        <a href="./producto.html?producto=${producto.slug}" class="boton-secundario">Ver más</a>
      </div>
    </article>
  `;
}

function renderCatalogo() {
  const contenedorCatalogo = document.getElementById("contenedor-productos");
  const contenedorDestacados = document.getElementById("contenedor-destacados");

  if (contenedorCatalogo) {
    contenedorCatalogo.innerHTML = productos
      .map((producto) => crearCardProducto(producto))
      .join("");
  }

  if (contenedorDestacados) {
    contenedorDestacados.innerHTML = productos
      .slice(0, 2)
      .map((producto) => crearCardProducto(producto))
      .join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalogo();
});