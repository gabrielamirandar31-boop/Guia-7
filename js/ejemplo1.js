// ACCEDIENDO A LA REFERENCIA DEL FORMULARIO QUE
// TENDRA LOS NUEVOS ELEMENTOS
const newForm = document.getElementById("idNewForm");

// ACCEDIENDO A LA REFERENCIA DE BOTONES
const buttonCrear = document.getElementById("idBtnCrear");
const buttonAddElemento = document.getElementById("idBtnAddElement");

// ACCEDIENDO AL VALOR DEL SELECT PARA DETERMINAR EL TIPO DE ELEMENTO A CREAR
const cmbElemento = document.getElementById("idCmbElemento");

// ACCEDIENDO A LOS CONTROLES DEL MODAL
const tituloElemento = document.getElementById("idTituloElemento");
const nombreElemento = document.getElementById("idNombreElemento");

// CREANDO MODAL CON BOOTSTRAP
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

// AGREGANDO FUNCIONES
const vericarTipoElemento = function () {
  let elemento = cmbElemento.value;
  //validando que se haya seleccionado un elemento
  if (elemento != "") {
    // Metodo perteneciente al modal de bootstrap
    modal.show();
  } else {
    alert("Debe seleccionar el elemento que se creara");
  }
};

const newSelect = function () {
  // Creando elementos
  let addElemento = document.createElement("select");
  //creando atributos para el nuevo elemento
  addElemento.setAttribute("id", `id${nombreElemento.value}`);
  addElemento.setAttribute("class", "form-select");

  //creando option para el select
  for (let i = 1; i <= 10; i++) {
    let addOption = document.createElement("option");
    addOption.value = i;
    addOption.innerHTML = `Opcion ${i}`;
    addElemento.appendChild(addOption);
  }

  //creando label para el nuevo control
  let labelElemento = document.createElement("label");
  labelElemento.setAttribute("for", `id${nombreElemento.value}`);
  //creando texto para label
  labelElemento.textContent = tituloElemento.value;

  //Creando label de id
  let labelId = document.createElement("span");
  labelId.textContent = `ID de control : ${nombreElemento.value}`;

  // Creando plantilla de bootstrap para visualizar el nuevo elemento
  let divElemento = document.createElement("div");
  // Agregando atributos
  divElemento.setAttribute("class", "form-floating");

  //Creando el input que sera hijo del div
  divElemento.appendChild(addElemento);
  //Creando el label que sera hijo del div
  divElemento.appendChild(labelElemento);

  //Creando el SPAN que sera hijo del nuevo Formulario
  newForm.appendChild(labelId);

  //Creando el Div que sera hijo del nuevo Formulario
  newForm.appendChild(divElemento);
};

const newRadioCheckbox = function (newElemento) {
  // Creando elementos
  let addElemento = document.createElement("input");
  //creando atributos para el nuevo elemento
  addElemento.setAttribute("id", `id${nombreElemento.value}`);
  addElemento.setAttribute("type", newElemento);
  addElemento.setAttribute("class", "form-check-input");

  //creando label para el nuevo control
  let labelElemento = document.createElement("label");
  labelElemento.setAttribute("class", "form-check-label");
  labelElemento.setAttribute("for", `id${nombreElemento.value}`);
  //creando texto para label
  labelElemento.textContent = tituloElemento.value;

  //Creando label de id
  let labelId = document.createElement("span");
  labelId.textContent = `ID de control : ${nombreElemento.value}`;

  // Creando plantilla de bootstrap para visualizar el nuevo elemento
  let divElemento = document.createElement("div");
  // Agregando atributos
  divElemento.setAttribute("class", "form-check");

  //Creando el input que sera hijo del div
  divElemento.appendChild(addElemento);
  //Creando el label que sera hijo del div
  divElemento.appendChild(labelElemento);

  //Creando el SPAN que sera hijo del nuevo Formulario
  newForm.appendChild(labelId);

  //Creando el Div que sera hijo del nuevo Formulario
  newForm.appendChild(divElemento);
};

const newInput = function (newElemento) {
  // Creando elementos de tipo = text, number, date y password
  let addElemento =
    newElemento == "textarea"
      ? document.createElement("textarea")
      : document.createElement("input");

  //creando atributos para el nuevo elemento
  addElemento.setAttribute("id", `id${nombreElemento.value}`);
  addElemento.setAttribute("type", newElemento);
  addElemento.setAttribute("class", "form-control");
  addElemento.setAttribute("placeholder", tituloElemento.value);

  //creando label para el nuevo control
  let labelElemento = document.createElement("label");
  labelElemento.setAttribute("for", `id${nombreElemento.value}`);

  //creando icono para el label
  let iconLabel = document.createElement("i");
  iconLabel.setAttribute("class", "bi bi-tag");

  //creando texto para label
  labelElemento.textContent = tituloElemento.value;

  //creando el elemento i como hijo del label, afterbegin le
  // indicamos que se creara antes de su primer hijo
  labelElemento.insertAdjacentElement("afterbegin", iconLabel);

  //Creando label de id
  let labelId = document.createElement("span");
  labelId.textContent = `ID de control : ${nombreElemento.value}`;

  // Creando plantilla de bootstrap para visualizar el nuevo elemento
  let divElemento = document.createElement("div");
  // Agregando atributos
  divElemento.setAttribute("class", "form-floating mb-3");

  //Creando el input que sera hijo del div
  divElemento.appendChild(addElemento);
  //Creando el label que sera hijo del div
  divElemento.appendChild(labelElemento);

  //Creando el SPAN que sera hijo del nuevo Formulario
  newForm.appendChild(labelId);

  //Creando el Div que sera hijo del nuevo Formulario
  newForm.appendChild(divElemento);
};

// AGREGANDO EVENTO CLIC A LOS BOTONES
buttonCrear.onclick = () => {
  vericarTipoElemento();
};

buttonAddElemento.onclick = () => {
  if (nombreElemento.value != "" && tituloElemento.value != "") {
    let elemento = cmbElemento.value;

    if (elemento == "select") {
      newSelect();
    } else if (elemento == "radio" || elemento == "checkbox") {
      newRadioCheckbox(elemento);
    } else {
      newInput(elemento);
    }
  } else {
    alert("Faltan campos por completar");
  }
};

// Agregando evento para el modal de bootstrap
document.getElementById("idModal").addEventListener("shown.bs.modal", () => {
  // Limpiando campos para los nuevos elementos
  tituloElemento.value = "";
  nombreElemento.value = "";
  // inicializando puntero en el campo del titulo para el control
  tituloElemento.focus();
});