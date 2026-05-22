window.actualizarContadorCarrito = function() {
  const carritoLinks = document.querySelectorAll('header.navbar a[href="./carrito.html"]');
  const carritoGuardado = localStorage.getItem("carritoHyperDistric");
  let totalItems = 0;

  if (carritoGuardado) {
    try {
      const carrito = JSON.parse(carritoGuardado);
      totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    } catch (e) {
      console.error(e);
    }
  }

  carritoLinks.forEach(link => {
    if (totalItems > 0) {
      link.innerHTML = `Carrito <span style="background: var(--accent-main); color: black; border-radius: 50%; padding: 2px 6px; font-size: 0.8rem; margin-left: 5px; font-weight: bold;">${totalItems}</span>`;
    } else {
      link.innerHTML = "Carrito";
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  window.actualizarContadorCarrito();

  const loginLinks = document.querySelectorAll('header.navbar a[href="./login.html"]');
  const userStr = localStorage.getItem("usuarioHyperDistric");

  if (!userStr) return;

  let usuario;
  try {
    usuario = JSON.parse(userStr);
  } catch (error) {
    console.error(error);
    localStorage.removeItem("usuarioHyperDistric");
    localStorage.removeItem("adminHyperDistric");
    return;
  }

  if (!usuario || !usuario.id) {
    localStorage.removeItem("usuarioHyperDistric");
    localStorage.removeItem("adminHyperDistric");
    return;
  }

  const esAdmin = usuario.rol === "admin" || localStorage.getItem("adminHyperDistric") === "true";

  loginLinks.forEach(link => {
    if (link.textContent.trim().toLowerCase() === "login") {
      link.textContent = esAdmin ? "Panel admin" : "Mi cuenta";
      link.href = esAdmin ? "./admin.html" : "./cuenta.html";
    }
  });
});
