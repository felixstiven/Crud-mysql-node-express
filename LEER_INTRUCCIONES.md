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
    `frontend/pages/dashboard.html`
*   Puede abrirlo directamente haciendo doble clic en el archivo o usando la extensión **Live Server** de VSCode (Recomendado).

---

## 📂 Estructura Principal del Proyecto

```text
├── backend/
│   ├── controllers/      # Controladores de las peticiones HTTP
│   ├── services/         # Lógica de negocio
│   ├── repositories/     # Consultas y persistencia en Base de Datos
│   ├── .env.example      # Plantilla de variables de entorno
│   └── package.json
└── frontend/
    ├── pages/            # Vistas HTML (dashboard.html)
    └── logic/            # JavaScript Vanilla (employee.js)
```

---

*Desarrollado para la entrega de evidencias del SENA.*