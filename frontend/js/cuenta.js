const usuarioGuardado = localStorage.getItem("usuarioHyperDistric");
const btnLogoutCuenta = document.getElementById("btn-logout-cuenta");
const nombreUsuarioCuenta = document.getElementById("nombre-usuario-cuenta");
const rolUsuarioCuenta = document.getElementById("rol-usuario-cuenta");

if (!usuarioGuardado) {
  window.location.href = "./login.html";
} else {
  const usuario = JSON.parse(usuarioGuardado);

  if (nombreUsuarioCuenta) {
    nombreUsuarioCuenta.textContent = usuario.nombre;
  }

  if (rolUsuarioCuenta) {
    rolUsuarioCuenta.textContent = `Rol: ${usuario.rol}`;
  }
}

if (btnLogoutCuenta) {
  btnLogoutCuenta.addEventListener("click", () => {
    localStorage.removeItem("usuarioHyperDistric");
    localStorage.removeItem("adminHyperDistric");
    window.location.href = "./login.html";
  });
}