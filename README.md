# Nombre del Proyecto:
Escuela3

[![Licencia](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Estado del Proyecto](https://img.shields.io/badge/Status-En%20Desarrollo-orange)](https://shields.io/)

## Descripción
Este proyecto es una API RESTful construida con Node.js y Express, diseñada para gestionar una Escuela con profesores, alumnos, matrículas y tareas por materias. Ofrece endpoints para crear, leer y actualizar Materias, Tareas, Matriculas y Ususarios con roles

## Tecnologías Utilizadas

*   [Node.js](https://nodejs.org/)
*   [Express](https://expressjs.com/)
*   [MySQL2](https://github.com/sidorares/node-mysql2) (o la librería de base de datos que estés utilizando)
*   [Joi](https://joi.dev/) (para validación de esquemas)
*   [Dotenv](https://www.npmjs.com/package/dotenv) (para gestionar variables de entorno)

## Pre-requisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

*   [Node.js] (versión 16 o superior)
*   [npm]
*   [MySQL2]
*   [Nodemon]


## Instalación

1.  Clona el repositorio:

    ```bash
    git clone [URL del repositorio]
    cd [nombre del repositorio]
    ```

2.  Instala las dependencias:

    ```bash
    npm install
    ```

3.  Configura las variables de entorno:

    *   Crea un archivo `.env` en la raíz del proyecto.
    *   Define las siguientes variables de entorno:

        ```
        DB_HOST=localhost
        DB_USER=tu_usuario
        DB_PASS=tu_password
        DB_PORT=3306
        DATABASE=tu_base_de_datos
        


## Uso

Para iniciar realiza los siguientes pasos:

```bash
1) Crear la base de datos, vacía solo el nombre en XAMPP o medio ambiente elegido.
2) Crear un archivo .env y agregar el nombre de la DB, Hacer lo mismo en .envs.
3) iniciar el servidor 
npm run dev
-- al iniciar el servidor se ejecutará el archivo SEED2 desde index.js. Este SEED genera el contenido de la DB completa
-- incluyendo el admin con las claves genericas "que deben ser cambiadas al ingresar".
4) Luego de confirmado y que todo este en orden sin fallos DEBEMOS comentar la ejecución del SEED2 en el archivo index linea de codigo 13. De esta manera evitaremos que los datos de la base de datos se sobre escriban al iniciar el servidor cada vez ya que el SEED2 contiene unos comandos que drenan cuanquier dato de la db antes de inyectar los que tiene programado, evitando conflictos.
