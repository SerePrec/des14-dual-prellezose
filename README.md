# Desafío 14 DUAL - Programación Backend

### CoderHouse

## USANDO EL OBJETO PROCESS. CHILD PROCESS Y WORKER THREADS.

Se agrega al desafío 14 la utilización de los **worker threads** como alternativa a los **child process**

## Consignas desafío 14

### Consigna 1

Sobre el proyecto del último desafío entregable, mover todas las claves y credenciales utilizadas a un archivo .env, y cargarlo mediante la librería dotenv.

La única configuración que no va a ser manejada con esta librería va a ser el puerto de escucha del servidor. Éste deberá ser leído de los argumento pasados por línea de comando, usando alguna librería (minimist o yargs). En el caso de no pasar este parámetro por línea de comandos, conectar por defecto al puerto 8080.

Observación: por el momento se puede dejar la elección de sesión y de persistencia explicitada en el código mismo. Más adelante haremos también parametrizable esta configuración.

### Consigna 2

Agregar una ruta '/info' que presente en una vista sencilla los siguientes datos:

- Argumentos de entrada
- Path de ejecución
- Nombre de la plataforma (sistema operativo)
- Process id
- Versión de node.js
- Carpeta del proyecto
- Memoria total reservada (rss)

### Consigna 3

Agregar otra ruta '/api/randoms' que permita calcular un cantidad de números aleatorios en el rango del 1 al 1000 especificada por parámetros de consulta (query).  
Por ej: /randoms?cant=20000.  
Si dicho parámetro no se ingresa, calcular 100.000.000 números.

El dato devuelto al frontend será un objeto que contendrá como claves los números random generados junto a la cantidad de veces que salió cada uno. Esta ruta no será bloqueante (utilizar el método fork de child process). Comprobar el no bloqueo con una cantidad de 500.000.000 de randoms.

**Observación**: utilizar routers y apis separadas para esta funcionalidad.

### Deploy en Heroku (Temporal):

https://des14-dual-prellezose.herokuapp.com/

### Ejecución

Luego de clonar o descargar el repositorio e instalar todas las dependencias con `npm install`, existen dos comandos para levantar el proyecto.
Para levantarlo en modo de desarrollo junto a nodemon, utilizar `npm run dev`. De lo contrario, para ejecutarlo en "modo producción", utilizar `npm start`.

Se puede seleccionar entre dos métodos de persistencia de **datos y sesiones** a través de la variable de entorno `PERS`. El modo `PERS=mongodb_atlas` **(DEFECTO)** para persistir en **MongoDB Atlas** y el modo `PERS=mongodb` para hacer lo mismo en **MongoDB local**

### Vistas

Existen las siguientes vistas que proveen una manera amena de probar el desafío.
Estas vistas se encuentran en las rutas:

- **/** : es la vista principal en donde se encuentra el formulario de carga de productos y el centro de mensajes (chat). Utiliza **websockets**. Requiere autenticación.

- **/login** : formulario de login.

- **/login-error** : vista a la que redirige tras un error en el login.

- **/register** : formulario de registro.

- **/register-error** : vista a la que redirige tras un error en el login.

- **/logout** : vista a la que se accede tras hacer el logout y luego de 5 segundos redirige a home.

- **/productos-mock** : es donde se muestra en una tabla el mock de productos devueltos por la llamada a la API en la ruta de test. Requiere autenticación

- **/info**: muestra información relativa a la app

### API

Consiste en las siguientes rutas:

#### Router /api/productos

| Método | Endpoint                | Descripción                                                                                                                                                                                                                                               |
| ------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | **/api/productos/**     | Me permite listar todos los productos disponibles                                                                                                                                                                                                         |
| POST   | **/api/productos/**     | Para incorporar productos al listado                                                                                                                                                                                                                      |
| GET    | **/api/productos/:id**  | Me permite listar un producto por su id                                                                                                                                                                                                                   |
| PUT    | **/api/productos/:id**  | Actualiza un producto por su id. Admite actualizaciones parciales                                                                                                                                                                                         |
| DELETE | **/api/productos/:id**  | Borra un producto por su id                                                                                                                                                                                                                               |
| GET    | **/api/productos-test** | Devuelve un listado de 5 productos mock generados con **Faker.js**                                                                                                                                                                                        |
| GET    | **/api/randoms**        | Devuelve una cantidad de números aleatorios en el rango del 1 al 1000 especificada por parámetros de consulta (query). Por ej: `/api/randoms?cant=20000`. Si dicho parámetro no se ingresa, calcula 100.000.000 de números. **Utiliza Child Process**     |
| GET    | **/api/randoms/wt**     | Devuelve una cantidad de números aleatorios en el rango del 1 al 1000 especificada por parámetros de consulta (query). Por ej: `/api/randoms/wt?cant=20000`. Si dicho parámetro no se ingresa, calcula 100.000.000 de números. **Utiliza Worker Threads** |

### Detalles y comentarios

Hice una reestructuración del código utilizando los controladores de rutas, para ir ordenando más el proyecto. Ahora cada ruta llama a su controlador o función middleware respectivamente, separando esta lógica de las rutas.

También separé las rutas de acuerdo a las funcionalidades: auth, webserver, apiProductos, apiRandoms y apiTests.

Se utilizó la librería **minimist** para procesar los argumentos de entrada, y las opciones de "alias" para el puerto y también de "default" para su valor en 8080 en caso de que no se introduzca uno.

Para el `child process` y `worker thread` utilicé el método de **handshake** para iniciar el cálculo, dado a la naturaleza asíncrona de las importaciones **ESM** que utilizo. De éste modo evito que se envíen mensajes al subproceso antes de que este se encuentre inicializado. Por eso lo que primero hago con el subproceso, es mandar un mensaje que esta "ready", y ahí comenzar la comunicación desde el padre indicando que comience el cálculo.

Incorporé al objeto devuelto por la api randoms el método utilizado (`method: Child process` o `method: Worker thread`) y el tiempo que se empleó en realizar el cálculo (`elapsedTime`).
