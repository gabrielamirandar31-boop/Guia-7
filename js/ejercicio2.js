// ================= CONFIGURACION DE LA API =================
const API_KEY = "PEGA_AQUI_TU_API_KEY";
const API_HOST = "moviesdatabase.p.rapidapi.com";
const BASE_URL = `https://${API_HOST}`;

const opcionesFetch = {
  method: "GET",
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": API_HOST,
  },
};

// ================= REFERENCIAS AL DOM =================
const estado = document.getElementById("idEstado");
const listado = document.getElementById("idListado");
const tituloDetalle = document.getElementById("idTituloDetalle");
const bodyDetalle = document.getElementById("idBodyDetalle");
const modalDetalle = new bootstrap.Modal(
  document.getElementById("idModalDetalle"),
  {}
);

// ================= UTILIDADES =================
// Crea un elemento con clase y texto opcionales
const crear = function (etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.setAttribute("class", clase);
  if (texto !== undefined) el.textContent = texto;
  return el;
};

const limpiar = function (contenedor) {
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
};

const mostrarCargando = function (contenedor, mensaje) {
  limpiar(contenedor);
  const caja = crear("div", "d-flex align-items-center gap-2 my-3");
  const spinner = crear("div", "spinner-border text-primary");
  spinner.setAttribute("role", "status");
  caja.appendChild(spinner);
  caja.appendChild(crear("span", "", mensaje));
  contenedor.appendChild(caja);
};

const mostrarError = function (contenedor, mensaje) {
  limpiar(contenedor);
  const alerta = crear("div", "alert alert-danger my-3", mensaje);
  alerta.setAttribute("role", "alert");
  contenedor.appendChild(alerta);
};

// ================= PETICION GENERICA =================
const pedir = async function (ruta) {
  const respuesta = await fetch(`${BASE_URL}${ruta}`, opcionesFetch);

  if (!respuesta.ok) {
    if (respuesta.status === 401 || respuesta.status === 403) {
      throw new Error("API key inválida o sin suscripción a la API (error " + respuesta.status + ").");
    }
    if (respuesta.status === 429) {
      throw new Error("Se superó el límite de peticiones del plan gratuito (error 429).");
    }
    throw new Error(`Error en la solicitud: ${respuesta.status} ${respuesta.statusText}`);
  }
  return await respuesta.json();
};

// ================= ENDPOINT 1: LISTADO =================
const cargarListado = async function () {
  mostrarCargando(estado, "Cargando películas...");
  try {
    const datos = await pedir("/titles?list=most_pop_movies&info=base_info&limit=12");
    const peliculas = datos.results || [];

    limpiar(estado);
    limpiar(listado);

    if (peliculas.length === 0) {
      mostrarError(estado, "No se encontraron películas.");
      return;
    }

    for (const pelicula of peliculas) {
      listado.appendChild(crearTarjeta(pelicula));
    }
  } catch (error) {
    mostrarError(estado, error.message || "No se pudo cargar el listado.");
  }
};

const crearTarjeta = function (pelicula) {
  const columna = crear("div", "col-12 col-sm-6 col-md-4 col-lg-3");
  const tarjeta = crear("div", "card h-100 shadow-sm");

  if (pelicula.primaryImage && pelicula.primaryImage.url) {
    const img = crear("img", "card-img-top");
    img.setAttribute("src", pelicula.primaryImage.url);
    img.setAttribute("alt", pelicula.titleText.text);
    img.setAttribute("style", "height:320px; object-fit:cover;");
    tarjeta.appendChild(img);
  }

  const cuerpo = crear("div", "card-body d-flex flex-column");
  cuerpo.appendChild(crear("h2", "card-title fs-6", pelicula.titleText.text));
  cuerpo.appendChild(
    crear(
      "p",
      "card-text text-muted",
      pelicula.releaseYear ? `Año: ${pelicula.releaseYear.year}` : "Año no disponible"
    )
  );

  const boton = crear("button", "btn btn-primary mt-auto", "Ver detalle");
  boton.setAttribute("type", "button");
  boton.addEventListener("click", () => verDetalle(pelicula.id));
  cuerpo.appendChild(boton);

  tarjeta.appendChild(cuerpo);
  columna.appendChild(tarjeta);
  return columna;
};

// ================= ENDPOINT 2: DETALLE =================
const verDetalle = async function (id) {
  tituloDetalle.textContent = "Cargando...";
  mostrarCargando(bodyDetalle, "Consultando detalle...");
  modalDetalle.show();

  try {
    const datos = await pedir(`/titles/${id}?info=base_info`);
    const p = datos.results;

    tituloDetalle.textContent = p.titleText.text;
    limpiar(bodyDetalle);

    const fila = crear("div", "row");
    const colImg = crear("div", "col-md-4 mb-3");
    if (p.primaryImage && p.primaryImage.url) {
      const img = crear("img", "img-fluid rounded");
      img.setAttribute("src", p.primaryImage.url);
      img.setAttribute("alt", p.titleText.text);
      colImg.appendChild(img);
    }

    const colInfo = crear("div", "col-md-8");
    const generos =
      p.genres && p.genres.genres ? p.genres.genres.map((g) => g.text).join(", ") : "N/D";
    const calificacion =
      p.ratingsSummary && p.ratingsSummary.aggregateRating
        ? p.ratingsSummary.aggregateRating
        : "N/D";
    const duracion =
      p.runtime && p.runtime.seconds ? `${Math.round(p.runtime.seconds / 60)} min` : "N/D";
    const sinopsis =
      p.plot && p.plot.plotText ? p.plot.plotText.plainText : "Sin sinopsis disponible.";

    colInfo.appendChild(crear("p", "mb-1", `Año: ${p.releaseYear ? p.releaseYear.year : "N/D"}`));
    colInfo.appendChild(crear("p", "mb-1", `Géneros: ${generos}`));
    colInfo.appendChild(crear("p", "mb-1", `Calificación: ${calificacion}`));
    colInfo.appendChild(crear("p", "mb-3", `Duración: ${duracion}`));
    colInfo.appendChild(crear("h3", "fs-6 fw-bold", "Sinopsis"));
    colInfo.appendChild(crear("p", "", sinopsis));

    fila.appendChild(colImg);
    fila.appendChild(colInfo);
    bodyDetalle.appendChild(fila);
  } catch (error) {
    tituloDetalle.textContent = "Error";
    mostrarError(bodyDetalle, error.message || "No se pudo cargar el detalle.");
  }
};

// ================= INICIO =================
cargarListado();