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

function guardarUsuarioRegistro(usuario) {
  localStorage.setItem("usuarioHyperDistric", JSON.stringify({
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  }));
  localStorage.removeItem("adminHyperDistric");
}

async function enviarRegistro(nombre, correo, password) {
  const opciones = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nombre, email: correo, password })
  };

  const response = await fetch("https://hyper-distric-usuarios.onrender.com/usuarios", opciones);

  if (response.status === 404) {
    return fetch("https://hyper-distric-usuarios.onrender.com/usuarios", opciones);
  }

  return response;
}

async function obtenerUsuarioRegistrado(correo, password) {
  const response = await fetch("https://hyper-distric-usuarios.onrender.com/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: correo, password })
  });
  const data = await response.json();

  if (!response.ok || !data.usuario) {
    throw new Error(data.mensaje || "No fue posible iniciar la sesion del nuevo usuario.");
  }

  return data.usuario;
}

function nombreValido(nombre) {
  const partesNombre = nombre.trim().split(" ");
  const partesLimpias = partesNombre.filter((parte) => {
    return parte.trim() !== "";
  });

  if (partesLimpias.length < 2) {
    return false;
  }

  return partesLimpias.every((parte) => {
    return parte.length >= 3;
  });
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
  formRegistro.addEventListener("submit", async (event) => {
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
      mostrarMensajeRegistro("Ingresa un correo valido. Ejemplo: nombre@gmail.com", "error");
      return;
    }

    if (!passwordValida(password)) {
      mostrarMensajeRegistro("La contrasena debe tener al menos 6 caracteres, una letra y un numero.", "error");
      return;
    }

    if (password !== confirmarPassword) {
      mostrarMensajeRegistro("Las contrasenas no coinciden.", "error");
      return;
    }

    try {
      const response = await enviarRegistro(nombre, correo, password);
      const data = await response.json();

      if (response.ok) {
        const usuarioRegistrado = data.usuario || await obtenerUsuarioRegistrado(correo, password);
        guardarUsuarioRegistro(usuarioRegistrado);
        sessionStorage.removeItem("registroRecienteHyperDistric");
        mostrarMensajeRegistro("Cuenta creada correctamente. Redirigiendo...", "exito");

        setTimeout(() => {
          window.location.href = "./cuenta.html";
        }, 900);
      } else {
        mostrarMensajeRegistro(data.mensaje || data.error || "Error al registrar el usuario.", "error");
      }
    } catch (error) {
      console.error(error);
      guardarUsuarioRegistro({
        id: 2,
        nombre,
        email: correo,
        rol: "cliente"
      });
      mostrarMensajeRegistro("API no disponible. Cuenta demo creada.", "exito");

      setTimeout(() => {
        window.location.href = "./cuenta.html";
      }, 900);
    }
  });
}


