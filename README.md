# 🎓 Plataforma Modular Educativa (Backend)

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Framework-lightgrey?logo=express)
![TypeORM](https://img.shields.io/badge/TypeORM-ORM-orange?logo=typeorm)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?logo=mysql)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black?logo=socket.io)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 🏆 Nombre del Proyecto
**Plataforma Modular Educativa (Backend)**

---

## 📜 Licencia
Este proyecto se distribuye bajo la **licencia MIT**.

---

## 📝 Descripción del Proyecto
Implementación del **backend** de una plataforma educativa modular, desarrollada bajo la arquitectura **Feature-Sliced Design (Módulos por Dominio)** en **Node.js**.

Su estructura modular permite escalar y mantener fácilmente el sistema, separando la lógica de negocio en dominios como usuarios, materias, tareas, etc.

---

## 🚀 Evolución del Proyecto

### 🔹 Fase Inicial
Se centró en la implementación de la capa de persistencia y la seguridad base:

- **Configuración de la Base de Datos:** TypeORM + MySQL/MariaDB para la gestión de entidades (`User`, `Materia`, etc.).  
- **Arquitectura Modular:** Separación en *controllers*, *services*, *entities* y *DTOs* por módulo.  
- **Seguridad Base:** Autenticación mediante **Passport.js** y **JWT** para proteger rutas.

### 🔹 Fase Avanzada
Posteriormente se integraron librerías y servicios avanzados, aportando robustez y comunicación en tiempo real:

- **Validación de Esquemas:** Implementación de **Joi** y `validator.middleware` para validar los DTOs.  
- **Comunicación en Tiempo Real:** Configuración de **Socket.IO** para notificaciones y WebSockets.  
- **Gestión de Entidades:** Implementación completa de las cinco entidades (`User`, `Materia`, `Matricula`, `Tarea`, `Entrega`), con relaciones **One-to-Many** y **Many-to-One** en TypeORM.

---

## 🛠️ Tecnologías Utilizadas

| **Componente** | **Tecnología** | **Propósito** |
|----------------|----------------|----------------|
| Lenguaje | JavaScript (ESM) | Base del desarrollo backend |
| Framework | Node.js / Express | Servidor HTTP y enrutamiento |
| ORM | TypeORM | Capa de persistencia y mapeo relacional |
| Base de Datos | MySQL / MariaDB | Almacenamiento de datos |
| Validación | Joi | Validación estricta de DTOs |
| Seguridad | Passport.js / JWT | Autenticación y autorización |
| Tiempo Real | Socket.IO | Comunicación bidireccional (WebSockets) |

---

## ⚙️ Prerrequisitos

Para ejecutar el proyecto localmente necesitarás:

- **Node.js** (versión 18 o superior)
- **MySQL / MariaDB** (o un contenedor Docker)
- **npm** o **yarn**

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>

2️⃣ Instalar Dependencias
cd Plataforma-Modular-Educativa-Backend
npm install

3️⃣ Configurar Variables de Entorno

Crea un archivo llamado .env en la raíz del proyecto.
Estas variables son validadas estrictamente por src/configuration/envs.js.

# General
PORT=3000

# Base de Datos (Asegúrate de que MySQL esté corriendo)
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DATABASE=escuela_db # Mapeado internamente a DB_NAME

# Seguridad JWT
JWT_SECRET=super-secreto-y-largo-de-mas-de-256-bits

4️⃣ Ejecutar el Servidor
node npm run dev
La inicialización realizará la conexión a la base de datos y sincronizará las entidades (creando las tablas si no existen).

💾 6. Integración de Subida de Archivos (Multer)

El proyecto utiliza la librería Multer para gestionar la carga de archivos binarios, específicamente para las entregas de tareas.
Esto asegura el manejo correcto de multipart/form-data y el almacenamiento seguro de los archivos en el servidor.

📤 Ruta Asignada

La ruta principal para la subida de archivos es:
POST /api/files

🧪 Cómo Probar la Subida de Archivos

Cliente API (Postman o Insomnia)

Método y URL: POST http://localhost:3000/api/files/test-form

Body Type: form-data

Campo de Archivo:

KEY: documento

Tipo: File

VALUE: Seleccionar archivo local.
Al enviarse correctamente, el archivo se guardará en la carpeta uploads/ en la raíz del proyecto.


🔔 7. Integración Aislada de Socket.IO (Notificaciones)

La implementación de Socket.IO en este proyecto es puntual y aislada, utilizada para gestionar notificaciones de eventos importantes (no un chat general).

🎯 Funcionalidad Clave

Emite un evento al registrar un nuevo usuario.

El servidor escucha este evento y activa la lógica para enviar un email de bienvenida.

🧪 Cómo Probar la Conexión de Socket.IO

Ejecutar el Servidor:

Abrir Cliente HTML:

Archivo: src/cliente.html

Usar un servidor local (por ejemplo: Open Live Server en VS Code)

Monitorear la Consola del Navegador:

Al conectarse, mostrará un mensaje de conexión exitosa.

Registrar un Usuario:

Endpoint: POST /api/users/register

Verificación:

Consola del Navegador: mostrará los datos del usuario registrado.

Terminal de Node: mostrará el log del evento recibido y el envío del email.


👨‍💻 Autores

Equipo de desarrollo DivH1 del ITS Cipolletti

Burdiles Adrián

Spagnolo Emiliano

Soto Agustín

📘 Proyecto educativo modular desarrollado con enfoque en escalabilidad, mantenibilidad y buenas prácticas en Node.js.
Presentado como Trabajo Práctico de la materia BACKEND, liderada por el Profesor Roberto Aqueveque.












