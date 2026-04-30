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

function guardarUsuarioLogin(usuario) {
  localStorage.setItem("usuarioHyperDistric", JSON.stringify({
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  }));

  if (usuario.rol === "admin") {
    localStorage.setItem("adminHyperDistric", "true");
  } else {
    localStorage.removeItem("adminHyperDistric");
  }
}

function obtenerUsuarioDemo(email, password) {
  const usuariosDemo = [
    {
      id: 1,
      nombre: "Administrador",
      email: "admin@hyperdistric.cl",
      alias: "admin",
      password: "1234",
      rol: "admin"
    },
    {
      id: 2,
      nombre: "Cliente Demo",
      email: "cliente@hyperdistric.cl",
      alias: "cliente",
      password: "1234",
      rol: "cliente"
    }
  ];

  return usuariosDemo.find((usuario) => {
    return (usuario.email === email || usuario.alias === email) && usuario.password === password;
  });
}

function redirigirSegunRol(usuario) {
  setTimeout(() => {
    window.location.href = usuario.rol === "admin"
      ? "./admin.html"
      : "./cuenta.html";
  }, 800);
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
      mostrarMensajeLogin("Debes ingresar usuario y contrasena.", "error");
      return;
    }

    try {
      const response = await fetch("https://hyper-distric-usuarios.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: usuario, password })
      });
      const data = await response.json();

      if (response.ok && data.usuario) {
        guardarUsuarioLogin(data.usuario);
        mostrarMensajeLogin("Acceso validado. Redirigiendo...", "exito");
        redirigirSegunRol(data.usuario);
      } else {
        mostrarMensajeLogin(data.mensaje || "Usuario o contrasena incorrectos.", "error");
      }
    } catch (error) {
      console.error(error);
      const usuarioDemo = obtenerUsuarioDemo(usuario, password);

      if (usuarioDemo) {
        guardarUsuarioLogin(usuarioDemo);
        mostrarMensajeLogin("API no disponible. Acceso demo validado.", "exito");
        redirigirSegunRol(usuarioDemo);
      } else {
        mostrarMensajeLogin("Error de conexion con el servidor.", "error");
      }
    }
  });
}


