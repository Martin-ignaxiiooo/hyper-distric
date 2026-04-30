let productos = [];
let categoriaActual = null;

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
    const productosFiltrados = categoriaActual 
      ? productos.filter(p => p.categoria.toLowerCase() === categoriaActual.toLowerCase())
      : productos;
      
    if (productosFiltrados.length === 0) {
      contenedorCatalogo.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">No hay productos en esta categoría.</p>`;
    } else {
      contenedorCatalogo.innerHTML = productosFiltrados
        .map((producto) => crearCardProducto(producto))
        .join("");
    }
  }

  if (contenedorDestacados) {
    contenedorDestacados.innerHTML = productos
      .slice(0, 2)
      .map((producto) => crearCardProducto(producto))
      .join("");
  }
}

async function cargarProductos() {
  try {
    const respuesta = await fetch("https://hyper-distric-productos.onrender.com/productos");
    if (!respuesta.ok) {
      throw new Error("Error al obtener los productos");
    }
    productos = await respuesta.json();
    renderCatalogo();
  } catch (error) {
    console.error("Hubo un problema con la petición fetch:", error);
    const contenedorCatalogo = document.getElementById("contenedor-productos");
    if (contenedorCatalogo) {
      contenedorCatalogo.innerHTML = `<p>Error al cargar los productos. Por favor, asegúrate de que el backend esté ejecutándose.</p>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();

  
  const categoriaCards = document.querySelectorAll('.categoria-card');
  const catalogoSection = document.getElementById('catalogo');

  categoriaCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      
      
      const nombreCat = card.querySelector('span').innerText.trim();
      
      
      if (categoriaActual === nombreCat) {
        categoriaActual = null;
        card.style.border = '';
      } else {
        categoriaActual = nombreCat;
        
        categoriaCards.forEach(c => c.style.border = '');
        
        card.style.border = '2px solid var(--accent-main)';
      }
      
      renderCatalogo();
      
      
      if (catalogoSection) {
        catalogoSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});


