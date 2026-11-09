const formulario = document.forms["frmRegistro"];
const botonRegistro = formulario.elements["btnRegistro"];

const modal = new bootstrap.Modal(document.getElementById("idModal"), {});
const tituloModal = document.getElementById("modalLabel");
const bodyModal = document.getElementById("idBodyModal");

// Expresion regular para el correo electronico
const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Vacia el cuerpo del modal usando removeChild (sin innerHTML)
const limpiarModal = function () {
  while (bodyModal.firstChild) {
    bodyModal.removeChild(bodyModal.firstChild);
  }
};

// Obtiene el texto del label asociado a un input
const textoLabel = function (input) {
  const label = document.querySelector(`label[for="${input.id}"]`);
  return label ? label.textContent.trim() : input.id;
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
    ["Contraseña", "*".repeat(password.length)],
    ["Intereses", intereses.join(", ")],
    ["Carrera", radioCarrera ? textoLabel(radioCarrera) : ""],
    ["País de origen", selectPais.options[selectPais.selectedIndex].textContent],
    ["Avatar", archivo.length > 0 ? archivo[0].name : "Sin archivo"],
  ];

  return { errores, datos };
};

// Crea una lista de errores con funciones DOM
const crearListaErrores = function (errores) {
  const aviso = document.createElement("p");
  aviso.setAttribute("class", "fw-bold text-danger");
  aviso.textContent = "Corrija los siguientes errores:";

  const lista = document.createElement("ul");
  lista.setAttribute("class", "list-group");

  for (const error of errores) {
    const item = document.createElement("li");
    item.setAttribute("class", "list-group-item list-group-item-danger");
    item.textContent = error;
    lista.appendChild(item);
  }

  bodyModal.appendChild(aviso);
  bodyModal.appendChild(lista);
};

// Crea la tabla con la informacion capturada con funciones DOM
const crearTabla = function (datos) {
  const tabla = document.createElement("table");
  tabla.setAttribute("class", "table table-striped table-bordered");

  // Encabezado
  const thead = document.createElement("thead");
  const filaHead = document.createElement("tr");
  for (const titulo of ["Campo", "Valor"]) {
    const th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.appendChild(document.createTextNode(titulo));
    filaHead.appendChild(th);
  }
  thead.appendChild(filaHead);
  tabla.appendChild(thead);

  // Cuerpo
  const tbody = document.createElement("tbody");
  for (const [campo, valor] of datos) {
    const fila = document.createElement("tr");

    const celdaCampo = document.createElement("th");
    celdaCampo.setAttribute("scope", "row");
    celdaCampo.appendChild(document.createTextNode(campo));

    const celdaValor = document.createElement("td");
    celdaValor.appendChild(document.createTextNode(valor));

    fila.appendChild(celdaCampo);
    fila.appendChild(celdaValor);
    tbody.appendChild(fila);
  }
  tabla.appendChild(tbody);

  bodyModal.appendChild(tabla);
};

botonRegistro.onclick = () => {
  const { errores, datos } = validarFormulario();

  limpiarModal();

  if (errores.length > 0) {
    tituloModal.textContent = "Error de validación";
    crearListaErrores(errores);
  } else {
    tituloModal.textContent = "Información registrada";
    crearTabla(datos);
  }

  modal.show();
};