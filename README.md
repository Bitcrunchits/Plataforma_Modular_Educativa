# Nombre del Proyecto:
Escuela3

[![Licencia](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Estado del Proyecto](https://img.shields.io/badge/Status-En%20Desarrollo-orange)](https://shields.io/)

🎓 Proyecto: Plataforma Modular Educativa (Backend)🏆 Nombre del ProyectoPlataforma Modular Educativa (Backend)📜 LicenciaEste proyecto se distribuye bajo la licencia MIT.📝 Descripción del ProyectoEste proyecto es la implementación del backend de una plataforma educativa modular, diseñada bajo la arquitectura de Módulos por Dominio (Feature-Sliced Design) en Node.js.🚀 Evolución del ProyectoLa Fase Inicial se centró en la implementación de la capa de persistencia y la seguridad base:Configuración de la Base de Datos: TypeORM y MySQL/MariaDB para la gestión de entidades (User, Materia, etc.).Arquitectura Modular: Estructuración de controllers, services, entities y DTOs en módulos independientes.Seguridad Base: Implementación de Autenticación mediante Passport.js y JWT para proteger rutas.Posteriormente, se consolidó la Fase de Implementación de Librerías y Servicios Avanzados, añadiendo robustez y comunicación en tiempo real:Validación de Esquemas: Integración de Joi y un validator.middleware para asegurar la integridad de los datos de entrada (DTOs).Comunicación en Tiempo Real: Configuración completa de Socket.IO para notificaciones y WebSockets, sentando las bases para funcionalidades de mensajería o notificaciones de nuevas tareas.Gestión de Entidades: Implementación completa de las cinco entidades centrales (User, Materia, Matricula, Tarea, Entrega), con relaciones One-to-Many y Many-to-One correctamente mapeadas en TypeORM.🛠️ Tecnologías UtilizadasComponenteTecnologíaPropósitoLenguajeJavaScript (ESM)Base del desarrollo backend.FrameworkNode.js / ExpressServidor HTTP y enrutamiento.ORMTypeORMCapa de persistencia, mapeo y QueryBuilder.Base de DatosMySQL / MariaDBAlmacenamiento relacional de datos.ValidaciónJoiDefinición y validación estricta de Data Transfer Objects (DTOs).SeguridadPassport.js / JWTEstrategia de autenticación y autorización de usuarios.Tiempo RealSocket.IOManejo de eventos en tiempo real (WebSockets).⚙️ PrerrequisitosPara la ejecución local del proyecto, necesitarás tener instalado:Node.js (versión 18+)MySQL/MariaDB (o un contenedor Docker con la base de datos)Un gestor de paquetes (npm o yarn)🚀 Instalación y ConfiguraciónSigue estos pasos para levantar el servidor en tu entorno local:1. Clonar el Repositoriogit clone <URL_DEL_REPOSITORIO>
cd Plataforma-Modular-Educativa-Backend
2. Instalar DependenciasInstala todas las dependencias del proyecto:npm install
3. Configuración de Variables de EntornoCrea un archivo llamado .env en la raíz del proyecto. Estas variables son validadas estrictamente por el middleware src/configuration/envs.js.# General
PORT=3000

# Base de Datos (Asegúrate de que el servidor MySQL esté corriendo)
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DATABASE=escuela_db # Mapeado internamente a DB_NAME

# Seguridad JWT
JWT_SECRET=super-secreto-y-largo-de-mas-de-256-bits
4. EjecuciónEjecuta el servidor. La inicialización realizará la conexión a la base de datos y la sincronización de las entidades (creando las tablas si no existen).node src/index.js
🌐 Endpoints Implementados (5 Entidades)Se documentan los endpoints principales de las cinco entidades, indicando la ruta, método, descripción, y los roles necesarios para el acceso.MóduloRutaMétodoDescripciónRol RequeridoEstadoUser/api/users/registerPOSTRegistro de un nuevo usuario (Alumno, Profesor o Admin).PÚBLICO201 OKUser/api/users/loginPOSTAutenticación y obtención de un Token JWT.PÚBLICO200 OKUser/api/users/profileGETObtiene la información del usuario autenticado.PRIVADO (JWT)200 OKMateria/api/materiasPOSTCreación de una nueva materia.PRIVADO (Profesor/Admin)201 OKMateria/api/materiasGETObtiene el listado de materias creadas por el profesor logueado.PRIVADO (Profesor)200 OKTarea/api/tareasPOSTCreación de una nueva tarea para una materia.PRIVADO (Profesor/Admin)201 OKTarea/api/tareasGETObtiene todas las tareas asignadas al alumno logueado (vía matrícula).PRIVADO (Alumno)200 OKMatricula/api/matriculasPOST[ASUMIDO] Matricular a un alumno en una materia.PRIVADO (Admin/Profesor)201 OKEntrega/api/entregasPOST[ASUMIDO] Subida del trabajo/tarea por parte del alumno.PRIVADO (Alumno)201 OK
