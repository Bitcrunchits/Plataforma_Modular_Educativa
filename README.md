# 🎓 Plataforma Modular Educativa (Backend)

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Framework-lightgrey?logo=express)
![TypeORM](https://img.shields.io/badge/TypeORM-Data%20Mapper-orange?logo=typeorm)
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
Implementación del **backend** de una **plataforma educativa modular**, desarrollada bajo la arquitectura **Feature-Sliced Design (Módulos por Dominio)** en **Node.js**.

Su estructura modular permite escalar y mantener fácilmente el sistema, separando la lógica de negocio en dominios como usuarios, materias, tareas, etc.

---

## 🚀 Evolución del Proyecto

### 🔹 **Fase Inicial**
Se centró en la implementación de la capa de persistencia y la seguridad base:

- **Configuración de la Base de Datos:** TypeORM + MySQL/MariaDB para la gestión de entidades (`User`, `Materia`, etc.).  
- **Arquitectura Modular:** Separación en *controllers*, *services*, *entities* y *DTOs* por módulo.  
- **Seguridad Base:** Autenticación mediante **Passport.js** y **JWT** para proteger rutas.  

### 🔹 **Fase Avanzada**
Posteriormente se integraron librerías y servicios avanzados, aportando robustez y comunicación en tiempo real:

- **Validación de Esquemas:** Implementación de **Joi** y *validator.middleware* para validar los DTOs.  
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
node src/index.js
La inicialización realizará la conexión a la base de datos y sincronizará las entidades (creando las tablas si no existen).

### 🌐 Endpoints Principales

| **Módulo** | **Método** | **Ruta** | **Descripción** | **Rol Requerido** | **Estado** |
|-------------|-------------|-----------|------------------|-------------------|-------------|
| 🧑‍🎓 **User** | `POST` | `/api/users/register` | Registro de un nuevo usuario (Alumno, Profesor o Admin). | Público | ✅ 201 |
| 🧑‍🎓 **User** | `POST` | `/api/users/login` | Autenticación y obtención de un token JWT. | Público | ✅ 200 |
| 🧑‍🎓 **User** | `GET` | `/api/users/profile` | Obtiene la información del usuario autenticado. | Privado (JWT) | ✅ 200 |
| 📚 **Materia** | `POST` | `/api/materias` | Creación de una nueva materia. | Profesor/Admin | ✅ 201 |
| 📚 **Materia** | `GET` | `/api/materias` | Listado de materias del profesor logueado. | Profesor | ✅ 200 |
| 📝 **Tarea** | `POST` | `/api/tareas` | Creación de tarea para una materia. | Profesor/Admin | ✅ 201 |
| 📝 **Tarea** | `GET` | `/api/tareas` | Listado de tareas asignadas al alumno. | Alumno | ✅ 200 |
| 🎓 **Matricula** | `POST` | `/api/matriculas` | Matricular a un alumno en una materia. | Admin/Profesor | ✅ 201 |
| 📦 **Entrega** | `POST` | `/api/entregas` | Subida de trabajo/tarea por el alumno. | Alumno | ✅ 201 |

👨‍💻 Autor
Equipo de desarrollo DivH1 del ITS. Cipolletti
Burdiles Adrián.
Spagnolo Emiliano.
Soto Agustín.
            Proyecto educativo modular desarrollado con enfoque en escalabilidad, mantenibilidad y buenas prácticas en Node.js.
Para presentar como trabajo práctico de la materia BACKEND Liderada por el Profesor Aqueveque Roberto.
