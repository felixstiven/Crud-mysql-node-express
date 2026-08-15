# 📄 Instrucciones de Ejecución - Proyecto CRUD Empleados

Este proyecto consiste en un sistema **CRUD (Crear, Leer, Actualizar, Eliminar)** de empleados para empresas, estructurado con un backend modular y robusto y un frontend interactivo en JavaScript Vanilla.

---

## 🛠️ Tecnologías Utilizadas

*   **Backend:** Node.js, Express, TypeScript (Arquitectura de Capas: Controlador ➡️ Servicio ➡️ Repositorio).
*   **Base de Datos:** PostgreSQL.
*   **Frontend:** HTML5, CSS (Bootstrap) y JavaScript Vanilla (sin frameworks, manipulación directa del DOM).

---

## 🎯 Enfoque de Desarrollo

*   **Backend:** Se priorizó la modularidad, la limpieza del código y la separación de responsabilidades. Se implementó tipado estricto con TypeScript para asegurar robustez en las transacciones.
*   **Frontend:** Para el diseño y estructuración de la interfaz, se empleó Inteligencia Artificial como asistente de desarrollo (*pair programming*). Sin embargo, toda la lógica de control de estados (alternar entre creación y edición), validaciones de campos del formulario y la manipulación del DOM fueron adaptadas e integradas manualmente.

---

## 🚀 Pasos para la Instalación y Ejecución

Siga estos pasos detallados para levantar el entorno localmente:

### 1. Preparar la Base de Datos 🗄️
*   Asegúrese de tener **PostgreSQL** instalado y corriendo en su sistema.
*   Cree una base de datos vacía llamada **`gosyt_sena`**. Puede hacerlo desde pgAdmin o ejecutando en su terminal de PostgreSQL:
    ```sql
    CREATE DATABASE gosyt_sena;
    ```

### 2. Configurar las Variables de Entorno ⚙️
*   En la raíz de la carpeta `backend`, encontrará un archivo `.env` (o `.env.example`).
*   Modifique las siguientes líneas con sus credenciales locales de PostgreSQL si es necesario:
    ```env
    PORT=3520
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER=tu_usuario_de_postgres
    POSTGRES_PASSWORD=tu_contraseña_de_postgres
    POSTGRES_DB=gosyt_sena
    ```

### 3. Instalar Dependencias 📦
*   Abra una terminal en la carpeta `/backend` del proyecto.
*   Ejecute el comando para instalar las librerías necesarias:
    ```bash
    npm install
    ```

### 4. Iniciar el Servidor API 🚀
*   En la misma terminal de `/backend`, levante el servidor en modo desarrollo:
    ```bash
    npm run dev
    ```
*   El servidor se iniciará en el puerto **`3520`** (http://localhost:3520). Las tablas se sincronizarán de forma automática con la base de datos.

### 5. Ejecutar el Frontend 🖥️
*   Para interactuar con la aplicación, abra el archivo:
    `frontend/pages/login.html`
*   Puede abrirlo directamente haciendo doble clic en el archivo o usando la extensión **Live Server** de VSCode (Recomendado).

---

## 🔐 Módulo de Autenticación y Autorización (Requerimiento de la Evidencia)

Este proyecto cuenta con una implementación completa para la protección de recursos mediante tokens **JWT (JSON Web Tokens)** y cifrado de contraseñas con **Bcrypt**, estructurada de la siguiente manera:

### 🛡️ Backend:
*   **Servicio de Autenticación (`backend/src/services/AuthService.ts`):** Valida contraseñas (comparando con el hash de Bcrypt) y genera el Token JWT firmado con la clave secreta `JSON_SECRET_KEY` si las credenciales son correctas.
*   **Rutas de Autenticación (`backend/src/routes/authRoutes.ts`):** Expone las rutas públicas de `/api/auth/register` (registro de empresas y dueños) y `/api/auth/login` (generación de tokens).
*   **Middleware de Autenticación (`backend/src/midelware/AuthMidelware.ts`):** 
    *   Intercepta las cabeceras buscando el token `Authorization: Bearer <Token>`.
    *   Verifica la validez y expiración del JWT.
    *   Busca al usuario en la base de datos PostgreSQL mediante el ID del payload decodificado y restringe o permite el paso.
    *   Implementa el middleware de control de accesos `soloAdminRole` para proteger rutas de administración (prohibiendo el acceso a roles no autorizados).
*   **Rutas Protegidas (`backend/src/routes/userRoutes.ts`):** Protege las rutas del CRUD de empleados (`create`, `load`, `update`, `delete`) utilizando el middleware de autenticación.

### 🌐 Frontend (Integración):
*   **Inicio de Sesión (`frontend/logic/login.js`):** Envía las credenciales al backend, recupera el JWT y guarda el `token`, el `role` y el `companyId` en el `localStorage` del navegador.
*   **Consumo Protegido (`frontend/logic/employee.js`):** Adjunta de manera dinámica la cabecera `Authorization: Bearer <Token>` en todas las peticiones `GET`, `POST`, `PUT` y `DELETE` enviadas a las rutas protegidas del backend.

---

## 🧪 Flujo de Pruebas Paso a Paso (Guía del Evaluador)

Siga este orden lógico para comprobar el funcionamiento del sistema y la protección de las rutas:

1.  **Registro de Empresa y Administrador:**
    *   Abra `frontend/pages/register.html` en su navegador.
    *   Registre una nueva empresa y un usuario Administrador (Owner). *(Nota: La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial)*.
2.  **Inicio de Sesión (Login):**
    *   Abra `frontend/pages/login.html` (o espere la redirección automática del registro).
    *   Use el email y la contraseña creados en el paso anterior.
    *   Al ingresar, el sistema guardará el token en el almacenamiento del navegador y le redirigirá al panel principal (`dashboard.html`).
3.  **Consumo del CRUD Protegido:**
    *   En `frontend/pages/dashboard.html`, verá que la lista de empleados se carga de manera segura desde el servidor (`GET` a `/api/users/load/${companyId}` usando el token).
    *   Pruebe creando, editando o eliminando un empleado en la interfaz. Cada interacción realiza la petición correspondiente al backend enviando el JWT de forma transparente en los encabezados.
4.  **Prueba de Denegación (Verificación del Middleware):**
    *   Para probar que las rutas efectivamente están protegidas y deniegan accesos inválidos:
        1. Abra las herramientas de desarrollador del navegador (F12) e vaya a la pestaña **Application/Almacenamiento ➡️ Local Storage**.
        2. Elimine la clave `token` o altere su contenido agregando caracteres aleatorios.
        3. Recargue el panel del dashboard o intente registrar un empleado.
        4. El backend bloqueará la petición devolviendo un estado HTTP **`401 Unauthorized`** (Token inválido/expirado) y la interfaz mostrará el mensaje correspondiente de sesión expirada.

---

## 📂 Estructura Principal del Proyecto

```text
├── backend/
│   ├── src/
│   │   ├── config/           # Configuración (Conexión a Base de Datos)
│   │   ├── controllers/      # Controladores de las peticiones HTTP
│   │   ├── dt/               # Interfaces y tipos de datos (DTOs)
│   │   ├── midelware/        # Middlewares de seguridad (AuthMidelware.ts)
│   │   ├── models/           # Modelos de Sequelize (Base de Datos)
│   │   ├── repository/       # Repositorio (Acceso directo a datos)
│   │   ├── routes/           # Rutas públicas y protegidas (authRoutes.ts, userRoutes.ts)
│   │   ├── services/         # Servicios de lógica de negocio (AuthService.ts, UserServices.ts)
│   │   └── utils/            # Funciones de validación y utilidades (validators.ts)
│   ├── .env                  # Configuración de variables de entorno y secreto JWT
│   ├── index.ts              # Punto de entrada de la API
│   ├── package.json          # Dependencias y scripts
│   └── tsconfig.json         # Configuración del compilador TypeScript
└── frontend/
    ├── pages/            # Vistas de la aplicación (index, login, register, dashboard)
    └── logic/            # Lógica y peticiones en JS Vanilla (login.js, employee.js)
```

---

*Desarrollado para la entrega de evidencias del SENA.*