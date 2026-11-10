# RecursosGuia7

## Ejecutar la aplicación

El catálogo del ejercicio 2 necesita una clave de RapidAPI. Configúrala como variable de entorno y ejecuta el servidor desde la raíz del repositorio:

Se requiere Node.js 18 o posterior.

```powershell
$env:RAPIDAPI_KEY = "tu-clave-de-RapidAPI"
node .\server.js
```

Después abre <http://127.0.0.1:3000>. La clave se utiliza únicamente en el servidor y no se envía al navegador. No la publiques ni la guardes en el repositorio.

Si la clave anterior estuvo publicada, revócala y genera una nueva desde RapidAPI antes de configurar la variable de entorno.
