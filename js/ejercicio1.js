const formulario = document.forms["frmRegistro"];
const botonRegistro = formulario.elements["btnRegistro"];

const modal = new bootstrap.Modal(document.getElementById("idModal"), {});
const tituloModal = document.getElementById("modalLabel");
const bodyModal = document.getElementById("idBodyModal");

// Expresion regular para el correo electronico
const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Vacia el cuerpo del modal usando removeChild
const limpiarModal = function () {
  while (bodyModal.firstChild) {
    bodyModal.removeChild(bodyModal.firstChild);
  }
};

// Reemplaza el texto de un elemento usando funciones DOM de la teoria
const ponerTexto = function (elemento, texto) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
  elemento.appendChild(document.createTextNode(texto));
};

// Obtiene el texto del label asociado a un input
const textoLabel = function (input) {
  const label = document.querySelector(`label[for="${input.id}"]`);
  return label ? label.firstChild.nodeValue.trim() : input.id;
};

// Valida todo y devuelve { errores, datos }
const validarFormulario = function () {
  const errores = [];

  const nombre = document.getElementById("idNombre").value.trim();
  const apellidos = document.getElementById("idApellidos").value.trim();
  const fechaNac = document.getElementById("idFechaNac").value;
  const correo = document.getElementById("idCorreo").value.trim();
  const password = document.getElementById("idPassword").value;
  const passwordRepetir = document.getElementById("idPasswordRepetir").value;
  const archivo = document.getElementById("idArchivo").files;

  // a. Campos no vacios
  if (nombre === "") errores.push("El campo Nombres es obligatorio.");
  if (apellidos === "") errores.push("El campo Apellidos es obligatorio.");
  if (fechaNac === "") errores.push("La fecha de nacimiento es obligatoria.");
  if (correo === "") errores.push("El correo electrónico es obligatorio.");
  if (password === "") errores.push("La contraseña es obligatoria.");
  if (passwordRepetir === "") errores.push("Debe repetir la contraseña.");

  // b. Fecha de nacimiento no mayor a la fecha actual
  if (fechaNac !== "") {
    const fechaIngresada = new Date(fechaNac + "T00:00:00");
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaIngresada > hoy) {
      errores.push("La fecha de nacimiento no puede ser mayor a la fecha actual.");
    }
  }

  // c. Correo con expresion regular
  if (correo !== "" && !regexCorreo.test(correo)) {
    errores.push("El correo electrónico no tiene un formato válido.");
  }

  // d. Contrasenas iguales
  if (password !== "" && passwordRepetir !== "" && password !== passwordRepetir) {
    errores.push("Las contraseñas no coinciden.");
  }

  // e. Al menos un interes seleccionado
  const checks = document.querySelectorAll('input[type="checkbox"]');
  const intereses = [];
  for (const check of checks) {
    if (check.checked) intereses.push(textoLabel(check));
  }
  if (intereses.length === 0) {
    errores.push("Debe seleccionar al menos un interés.");
  }

  // f. Carrera seleccionada
  const radioCarrera = document.querySelector('input[name="idRdCarrera"]:checked');
  if (!radioCarrera) {
    errores.push("Debe seleccionar una carrera.");
  }

  // g. Pais seleccionado (la opcion 0 es "Seleccione una opcion")
  const selectPais = document.getElementById("idCmPais");
  if (selectPais.selectedIndex === 0) {
    errores.push("Debe seleccionar un país de origen.");
  }

  const datos = [
    ["Nombres", nombre],
    ["Apellidos", apellidos],
    ["Fecha de nacimiento", fechaNac],
    ["Correo electrónico", correo],
    ["Contraseña", password]
  ];

  return { errores, datos, intereses, carrera: radioCarrera ? textoLabel(radioCarrera) : "", pais: selectPais.options[selectPais.selectedIndex].text };
} 