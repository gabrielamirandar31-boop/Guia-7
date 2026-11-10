const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");

const STATIC_ROOT = path.join(__dirname, "RecursosGuia7");
const RAPIDAPI_HOST = "moviesdatabase.p.rapidapi.com";
const PORT = Number(process.env.PORT) || 3000;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const sendJson = (response, status, data, headers = {}) => {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...headers,
  });
  response.end(JSON.stringify(data));
};

const getApiPath = (url) => {
  if (url.pathname === "/api/titles") {
    if (
      url.searchParams.get("list") !== "most_pop_movies" ||
      url.searchParams.get("info") !== "base_info" ||
      !/^(?:[1-9]|[1-4][0-9]|50)$/.test(url.searchParams.get("limit") || "")
    ) {
      return null;
    }

    return `/titles?list=most_pop_movies&info=base_info&limit=${url.searchParams.get("limit")}`;
  }

  const match = url.pathname.match(/^\/api\/titles\/(tt[0-9]+)(\/crew)?$/);
  if (!match) return null;
  if (match[2]) return `/titles/${match[1]}/crew`;
  if (url.searchParams.get("info") !== "base_info") return null;
  return `/titles/${match[1]}?info=base_info`;
};

const proxyApiRequest = async (request, response, url) => {
  if (request.method !== "GET") {
    response.writeHead(405, { Allow: "GET" });
    response.end();
    return;
  }

  const apiPath = getApiPath(url);
  if (!apiPath) {
    sendJson(response, 400, { error: "Solicitud de API inválida." });
    return;
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    sendJson(
      response,
      503,
      { error: "Falta configurar RAPIDAPI_KEY en el entorno del servidor." },
      { "X-Configuration-Error": "missing-rapidapi-key" }
    );
    return;
  }

  try {
    const apiResponse = await fetch(`https://${RAPIDAPI_HOST}${apiPath}`, {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    });
    const body = await apiResponse.arrayBuffer();
    response.writeHead(apiResponse.status, {
      "Content-Type": apiResponse.headers.get("content-type") || "application/json",
    });
    response.end(Buffer.from(body));
  } catch (error) {
    console.error("Error al consultar RapidAPI:", error);
    sendJson(response, 502, { error: "No fue posible consultar el servicio de películas." });
  }
};

const serveStaticFile = async (request, response, url) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400);
    response.end();
    return;
  }

  const filePath = path.resolve(STATIC_ROOT, `.${pathname === "/" ? "/index.html" : pathname}`);
  const relativePath = path.relative(STATIC_ROOT, filePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    response.writeHead(403);
    response.end();
    return;
  }

  try {
    const file = await fs.promises.stat(filePath);
    if (!file.isFile()) {
      response.writeHead(404);
      response.end();
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Content-Length": file.size,
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    const stream = fs.createReadStream(filePath);
    stream.on("error", (error) => {
      console.error("Error al leer un archivo estático:", error);
      if (!response.headersSent) {
        sendJson(response, 500, { error: "No fue posible leer el archivo solicitado." });
      } else {
        response.destroy(error);
      }
    });
    stream.pipe(response);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      response.writeHead(404);
      response.end();
      return;
    }
    throw error;
  }
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  try {
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      await proxyApiRequest(request, response, url);
      return;
    }
    await serveStaticFile(request, response, url);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    if (!response.headersSent) {
      sendJson(response, 500, { error: "Error interno del servidor." });
    } else {
      response.destroy(error);
    }
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Aplicación disponible en http://127.0.0.1:${PORT}`);
});
