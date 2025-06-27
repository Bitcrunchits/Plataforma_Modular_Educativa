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

Para iniciar el servidor, ejecuta el siguiente comando:

```bash
npm run dev