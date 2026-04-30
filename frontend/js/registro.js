const formRegistro = document.getElementById("form-registro");
const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputPasswordRegistro = document.getElementById("password");
const inputConfirmarPassword = document.getElementById("confirmar-password");
const mensajeRegistro = document.getElementById("mensaje-registro");
const btnMostrarPasswordRegistro = document.getElementById("btn-mostrar-password-registro");

function mostrarMensajeRegistro(texto, tipo = "error") {
  if (!mensajeRegistro) return;

  mensajeRegistro.textContent = texto;
  mensajeRegistro.classList.remove("oculto", "error", "exito");
  mensajeRegistro.classList.add(tipo);
}

function obtenerUsuariosRegistrados() {
  const usuariosGuardados = localStorage.getItem("usuariosRegistradosHyperDistric");
  return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
}

function guardarUsuariosRegistrados(usuarios) {
  localStorage.setItem("usuariosRegistradosHyperDistric", JSON.stringify(usuarios));
}

function nombreValido(nombre) {
  const partesNombre = nombre.trim().split(" ");

  const partesLimpias = partesNombre.filter((parte) => {
    return parte.trim() !== "";
  });

  if (partesLimpias.length < 2) {
    return false;
  }

  const partesValidas = partesLimpias.every((parte) => {
    return parte.length >= 3;
  });

  return partesValidas;
}

function correoValido(correo) {
  const correoLimpio = correo.trim().toLowerCase();

  const formatoCorreo = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  return formatoCorreo.test(correoLimpio);
}

function passwordValida(password) {
  const tieneLargoMinimo = password.length >= 6;
  const tieneLetra = /[a-zA-Z]/.test(password);
  const tieneNumero = /[0-9]/.test(password);

  return tieneLargoMinimo && tieneLetra && tieneNumero;
}

if (btnMostrarPasswordRegistro) {
  btnMostrarPasswordRegistro.addEventListener("click", () => {
    if (inputPasswordRegistro.type === "password") {
      inputPasswordRegistro.type = "text";
      btnMostrarPasswordRegistro.textContent = "Ocultar";
    } else {
      inputPasswordRegistro.type = "password";
      btnMostrarPasswordRegistro.textContent = "Mostrar";
    }
  });
}

if (formRegistro) {
  formRegistro.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = inputNombre.value.trim();
    const correo = inputCorreo.value.trim().toLowerCase();
    const password = inputPasswordRegistro.value.trim();
    const confirmarPassword = inputConfirmarPassword.value.trim();

    if (nombre === "" || correo === "" || password === "" || confirmarPassword === "") {
      mostrarMensajeRegistro("Debes completar todos los campos.", "error");
      return;
    }

    if (!nombreValido(nombre)) {
      mostrarMensajeRegistro("Ingresa nombre y apellido. Cada uno debe tener al menos 3 letras.", "error");
      return;
    }

    if (!correoValido(correo)) {
      mostrarMensajeRegistro("Ingresa un correo válido. Ejemplo: nombre@gmail.com", "error");
      return;
    }

    if (!passwordValida(password)) {
      mostrarMensajeRegistro("La contraseña debe tener al menos 6 caracteres, una letra y un número.", "error");
      return;
    }

    if (password !== confirmarPassword) {
      mostrarMensajeRegistro("Las contraseñas no coinciden.", "error");
      return;
    }

    const usuariosRegistrados = obtenerUsuariosRegistrados();

    const usuarioExiste = usuariosRegistrados.find((usuario) => {
      return usuario.usuario === correo;
    });

    if (usuarioExiste) {
      mostrarMensajeRegistro("Este correo ya está registrado. Intenta iniciar sesión.", "error");
      return;
    }

    const nuevoUsuario = {
      nombre: nombre,
      usuario: correo,
      password: password,
      rol: "cliente"
    };

    usuariosRegistrados.push(nuevoUsuario);
    guardarUsuariosRegistrados(usuariosRegistrados);

    localStorage.setItem("usuarioHyperDistric", JSON.stringify({
      nombre: nuevoUsuario.nombre,
      usuario: nuevoUsuario.usuario,
      rol: nuevoUsuario.rol
    }));

    localStorage.removeItem("adminHyperDistric");

    mostrarMensajeRegistro("Cuenta creada correctamente. Entrando a tu perfil...", "exito");

    setTimeout(() => {
      window.location.href = "./cuenta.html";
    }, 900);
  });
}