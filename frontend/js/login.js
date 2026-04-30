const formLogin = document.getElementById("form-login");
const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");
const mensajeLogin = document.getElementById("mensaje-login");
const btnMostrarPassword = document.getElementById("btn-mostrar-password");

const usuariosDemo = [
  {
    usuario: "admin",
    password: "1234",
    nombre: "Administrador Hyper Distric",
    rol: "admin"
  },
  {
    usuario: "admin@hyperdistric.cl",
    password: "1234",
    nombre: "Administrador Hyper Distric",
    rol: "admin"
  },
  {
    usuario: "cliente",
    password: "1234",
    nombre: "Cliente Hyper Distric",
    rol: "cliente"
  },
  {
    usuario: "cliente@hyperdistric.cl",
    password: "1234",
    nombre: "Cliente Hyper Distric",
    rol: "cliente"
  }
];

function mostrarMensajeLogin(texto, tipo = "error") {
  if (!mensajeLogin) return;

  mensajeLogin.textContent = texto;
  mensajeLogin.classList.remove("oculto", "error", "exito");
  mensajeLogin.classList.add(tipo);
}

function obtenerUsuariosRegistrados() {
  const usuariosGuardados = localStorage.getItem("usuariosRegistradosHyperDistric");
  return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
}

function buscarUsuario(usuario, password) {
  const usuarioLimpio = usuario.trim().toLowerCase();
  const passwordLimpia = password.trim();

  const usuariosRegistrados = obtenerUsuariosRegistrados();
  const todosLosUsuarios = usuariosDemo.concat(usuariosRegistrados);

  return todosLosUsuarios.find((item) => {
    return item.usuario === usuarioLimpio && item.password === passwordLimpia;
  });
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

if (formLogin) {
  formLogin.addEventListener("submit", (event) => {
    event.preventDefault();

    const usuario = inputUsuario.value.trim();
    const password = inputPassword.value.trim();

    if (usuario === "" || password === "") {
      mostrarMensajeLogin("Debes ingresar usuario y contraseña.", "error");
      return;
    }

    const usuarioEncontrado = buscarUsuario(usuario, password);

    if (!usuarioEncontrado) {
      mostrarMensajeLogin("Usuario o contraseña incorrectos.", "error");
      return;
    }

    localStorage.setItem("usuarioHyperDistric", JSON.stringify({
      nombre: usuarioEncontrado.nombre,
      usuario: usuarioEncontrado.usuario,
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
  });
}