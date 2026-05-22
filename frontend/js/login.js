const formLogin = document.getElementById("form-login");
const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");
const mensajeLogin = document.getElementById("mensaje-login");
const btnMostrarPassword = document.getElementById("btn-mostrar-password");

function mostrarMensajeLogin(texto, tipo = "error") {
  if (!mensajeLogin) return;

  mensajeLogin.textContent = texto;
  mensajeLogin.classList.remove("oculto", "error", "exito");
  mensajeLogin.classList.add(tipo);
}

if (btnMostrarPassword) {
  btnMostrarPassword.addEventListener("click", () => {
    if (inputPassword.type === "password") {
      inputPassword.type = "text";
      btnMostrarPassword.textContent = "Ocultar";
    } else {
      inputPassword.type = "password";
      btnMostrarPassword.textContent = "Mostrar";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const correoRegistro = sessionStorage.getItem("registroRecienteHyperDistric");

  if (params.get("registro") === "ok") {
    localStorage.removeItem("usuarioHyperDistric");
    localStorage.removeItem("adminHyperDistric");

    if (correoRegistro && inputUsuario) {
      inputUsuario.value = correoRegistro;
      if (inputPassword) inputPassword.focus();
    }

    mostrarMensajeLogin("Cuenta creada correctamente. Ahora inicia sesion con tu correo y contrasena.", "exito");
    sessionStorage.removeItem("registroRecienteHyperDistric");
  }
});

if (formLogin) {
  formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuario = inputUsuario.value.trim().toLowerCase();
    const password = inputPassword.value.trim();

    if (usuario === "" || password === "") {
      mostrarMensajeLogin("Debes ingresar usuario y contraseña.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: usuario, password: password })
      });

      const data = await response.json();

      if (response.ok && data.usuario) {
        const usuarioEncontrado = data.usuario;

        localStorage.setItem("usuarioHyperDistric", JSON.stringify({
          id: usuarioEncontrado.id,
          nombre: usuarioEncontrado.nombre,
          usuario: usuarioEncontrado.email,
          rol: usuarioEncontrado.rol
        }));

        mostrarMensajeLogin("Acceso validado. Redirigiendo...", "exito");

        setTimeout(() => {
          if (usuarioEncontrado.rol === "admin") {
            localStorage.setItem("adminHyperDistric", "true");
            window.location.href = "./admin.html";
          } else {
            localStorage.removeItem("adminHyperDistric");
            window.location.href = "./cuenta.html";
          }
        }, 800);
      } else {
        mostrarMensajeLogin(data.mensaje || "Usuario o contraseña incorrectos.", "error");
      }
    } catch (error) {
      console.error(error);
      mostrarMensajeLogin("Error de conexión con el servidor.", "error");
    }
  });
}
