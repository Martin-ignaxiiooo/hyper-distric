const usuarioGuardadoAdmin = localStorage.getItem("usuarioHyperDistric");
const btnLogout = document.getElementById("btn-logout");

if (!usuarioGuardadoAdmin) {
  window.location.href = "./login.html";
} else {
  const usuario = JSON.parse(usuarioGuardadoAdmin);
  if (usuario.rol !== "admin") {
    window.location.href = "./cuenta.html";
  }
}

if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioHyperDistric");
    localStorage.removeItem("adminHyperDistric");
    window.location.href = "./login.html";
  });
}


const btnNavProductos = document.getElementById('btn-nav-productos');
const btnNavStock = document.getElementById('btn-nav-stock');
const btnNavPedidos = document.getElementById('btn-nav-pedidos');

const panelProductos = document.getElementById('panel-productos');
const panelStock = document.getElementById('panel-stock');
const panelPedidos = document.getElementById('panel-pedidos');

function ocultarPaneles() {
  if(panelProductos) panelProductos.style.display = 'none';
  if(panelStock) panelStock.style.display = 'none';
  if(panelPedidos) panelPedidos.style.display = 'none';
}

if (btnNavProductos) {
  btnNavProductos.addEventListener('click', () => {
    ocultarPaneles();
    panelProductos.style.display = 'block';
    cargarProductos();
    
    panelProductos.scrollIntoView({ behavior: 'smooth' });
  });
}

if (btnNavStock) {
  btnNavStock.addEventListener('click', () => {
    ocultarPaneles();
    panelStock.style.display = 'block';
    cargarStock();
    panelStock.scrollIntoView({ behavior: 'smooth' });
  });
}

if (btnNavPedidos) {
  btnNavPedidos.addEventListener('click', () => {
    ocultarPaneles();
    panelPedidos.style.display = 'block';
    cargarPedidos();
    panelPedidos.scrollIntoView({ behavior: 'smooth' });
  });
}


const API_PRODUCTOS = "http://localhost:3002/productos";
let productosGlobales = [];

async function cargarProductos() {
  try {
    const res = await fetch(API_PRODUCTOS);
    productosGlobales = await res.json();
    renderProductos(productosGlobales);
  } catch (error) {
    console.error("Error cargando productos", error);
  }
}

function renderProductos(productos) {
  const contenedor = document.getElementById('lista-productos');
  if(!contenedor) return;
  contenedor.innerHTML = productos.map(p => `
    <div style="background: var(--bg-soft); padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border-soft);">
      <div style="display: flex; gap: 15px; align-items: center;">
        <img src="${p.imagen || ''}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
        <div>
          <h4 style="margin-bottom: 5px;">${p.nombre}</h4>
          <span style="color: var(--text-secondary); font-size: 0.9rem;">${p.slug} | CLP $${p.precio} | Stock: ${p.stock}</span>
        </div>
      </div>
      <div style="display: flex; gap: 10px;">
        <button onclick="editarProducto(${p.id})" class="btn-secundario" style="padding: 8px 12px; font-size: 0.8rem;">Editar</button>
        <button onclick="eliminarProducto(${p.id})" class="btn-secundario" style="padding: 8px 12px; font-size: 0.8rem; color: #ff5a1f; border-color: rgba(255,90,31,0.2);">Eliminar</button>
      </div>
    </div>
  `).join("");
}


const btnNuevoProducto = document.getElementById('btn-nuevo-producto');
const formContainer = document.getElementById('form-producto-container');
const formProducto = document.getElementById('form-producto');
const btnCancelarProducto = document.getElementById('btn-cancelar-producto');

if (btnNuevoProducto) {
  btnNuevoProducto.addEventListener('click', () => {
    formProducto.reset();
    document.getElementById('prod-id').value = '';
    document.getElementById('form-producto-titulo').innerText = 'Crear Producto';
    formContainer.style.display = 'block';
    btnNuevoProducto.style.display = 'none';
  });
}

if (btnCancelarProducto) {
  btnCancelarProducto.addEventListener('click', () => {
    formContainer.style.display = 'none';
    btnNuevoProducto.style.display = 'block';
  });
}

if (formProducto) {
  formProducto.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('prod-id').value;
    
    const payload = {
      nombre: document.getElementById('prod-nombre').value,
      slug: document.getElementById('prod-slug').value,
      precio: parseInt(document.getElementById('prod-precio').value),
      stock: parseInt(document.getElementById('prod-stock').value),
      imagen_url: document.getElementById('prod-imagen').value,
      categoria_id: parseInt(document.getElementById('prod-categoria').value),
      estilo: document.getElementById('prod-estilo').value,
      color: document.getElementById('prod-color').value,
      material: document.getElementById('prod-material').value,
      descripcion: document.getElementById('prod-descripcion').value,
      badge: document.getElementById('prod-badge').value
    };

    try {
      const url = id ? `${API_PRODUCTOS}/${id}` : API_PRODUCTOS;
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        formContainer.style.display = 'none';
        btnNuevoProducto.style.display = 'block';
        cargarProductos();
      } else {
        alert("Error al guardar el producto");
      }
    } catch (error) {
      console.error(error);
    }
  });
}

window.editarProducto = (id) => {
  const p = productosGlobales.find(prod => prod.id === id);
  if (!p) return;

  const catMap = { "Poleras": 1, "Hoodies": 2, "Pantalones": 3, "Chaquetas": 4 };

  document.getElementById('prod-id').value = p.id;
  document.getElementById('prod-nombre').value = p.nombre;
  document.getElementById('prod-slug').value = p.slug;
  document.getElementById('prod-precio').value = p.precio;
  document.getElementById('prod-stock').value = p.stock;
  document.getElementById('prod-imagen').value = p.imagen;
  document.getElementById('prod-categoria').value = catMap[p.categoria] || 1;
  document.getElementById('prod-estilo').value = p.estilo || '';
  document.getElementById('prod-color').value = p.color || '';
  document.getElementById('prod-material').value = p.material || '';
  document.getElementById('prod-descripcion').value = p.descripcion || '';
  document.getElementById('prod-badge').value = p.badge || '';

  document.getElementById('form-producto-titulo').innerText = 'Editar Producto';
  formContainer.style.display = 'block';
  btnNuevoProducto.style.display = 'none';
  formContainer.scrollIntoView({ behavior: 'smooth' });
};

window.eliminarProducto = async (id) => {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
  try {
    await fetch(`${API_PRODUCTOS}/${id}`, { method: 'DELETE' });
    cargarProductos();
  } catch (error) {
    console.error(error);
  }
};


async function cargarStock() {
  try {
    const res = await fetch(API_PRODUCTOS);
    const productos = await res.json();
    const contenedor = document.getElementById('lista-stock');
    if(!contenedor) return;
    
    contenedor.innerHTML = productos.map(p => `
      <div style="background: var(--bg-soft); padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border-soft);">
        <span style="font-weight: 600;">${p.nombre}</span>
        <div style="display: flex; gap: 10px; align-items: center;">
          <input type="number" id="stock-input-${p.id}" value="${p.stock}" style="width: 80px; padding: 8px; border-radius: 8px; background: #0A0C10; color: white; border: 1px solid #333;">
          <button onclick="actualizarStock(${p.id})" class="btn-principal" style="padding: 8px 15px; font-size: 0.85rem;">Guardar</button>
        </div>
      </div>
    `).join("");
  } catch (error) {
    console.error("Error cargando stock", error);
  }
}

window.actualizarStock = async (id) => {
  const nuevoStock = document.getElementById(`stock-input-${id}`).value;
  try {
    const res = await fetch(`${API_PRODUCTOS}/${id}/stock`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: parseInt(nuevoStock) })
    });
    if (res.ok) alert("Stock actualizado");
  } catch (error) {
    console.error(error);
  }
};


const API_VENTAS = "http://localhost:3003/ventas";

async function cargarPedidos() {
  try {
    const res = await fetch(API_VENTAS);
    const ventas = await res.json();
    const contenedor = document.getElementById('lista-pedidos');
    if(!contenedor) return;
    
    if (ventas.length === 0) {
      contenedor.innerHTML = "<p>No hay pedidos registrados.</p>";
      return;
    }

    
    ventas.sort((a, b) => b.id - a.id);

    contenedor.innerHTML = ventas.map(v => `
      <div style="background: var(--bg-soft); padding: 20px; border-radius: 12px; border: 1px solid var(--border-soft);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 10px;">
          <h4 style="color: var(--accent-main);">Pedido #${v.id}</h4>
          <span style="color: #888; font-size: 0.9rem;">${new Date(v.fecha).toLocaleString()}</span>
        </div>
        <p style="margin-bottom: 5px;"><strong>Cliente:</strong> ${v.usuario_email}</p>
        <p style="margin-bottom: 15px;"><strong>Total:</strong> CLP $${v.total.toLocaleString("es-CL")}</p>
        <div style="background: #0A0C10; padding: 10px; border-radius: 8px; font-size: 0.9rem; color: #ccc;">
          ${(typeof v.detalles === 'string' ? JSON.parse(v.detalles) : (v.detalles || [])).map(d => `${d.cantidad}x ${d.nombre} (Talla ${d.talla || 'Única'})`).join("<br>")}
        </div>
      </div>
    `).join("");
  } catch (error) {
    console.error("Error cargando pedidos", error);
  }
}