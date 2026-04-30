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