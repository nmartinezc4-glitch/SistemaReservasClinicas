# 🏥 Sistema de Reservas Clínicas

Sistema web académico desarrollado para la gestión de reservas médicas en una clínica.

La aplicación está dividida en:

- Backend (API REST) desarrollado con Node.js y Express.
- Base de datos MySQL.
- Frontend desarrollado con HTML, CSS y JavaScript puro.

---

## 📌 Tecnologías Utilizadas

### Backend
- Node.js
- Express 5.2.1
- MySQL2 3.17.3
- CORS 2.8.6

### Base de Datos
- MySQL Server
- MySQL Workbench

### Frontend
- HTML
- CSS
- JavaScript

---

## 🗂️ Estructura del Proyecto

SistemaReservasClinicas/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   └── index.html
│
├── database/
│   └── clinica-reservas.sql
│
├── .gitignore
└── README.md

---

## ⚙️ Requisitos Previos

Antes de ejecutar el proyecto debes tener instalado:

- Node.js (versión 18 o superior recomendada)
- MySQL Server
- MySQL Workbench

---

## 🗄️ Configuración de la Base de Datos

1. Abrir MySQL Workbench.
2. Crear una nueva base de datos (por ejemplo):

   clinica

3. Abrir el archivo:

   database/clinica-reservas.sql

4. Ejecutar el script para crear las tablas necesarias.
5. Verificar que las tablas se hayan creado correctamente.

---

## 🔧 Configuración del Backend

1. Abrir una terminal.
2. Navegar a la carpeta del backend:

   cd backend

3. Instalar las dependencias:

   npm install

Esto instalará automáticamente:

- express
- mysql2
- cors

4. Configurar las credenciales de MySQL en el archivo:

   db.js

Asegurarse de que coincidan con tu usuario y contraseña local de MySQL.

Ejemplo típico:

- host: localhost
- user: root
- password: tu_password
- database: clinica

5. Iniciar el servidor:

   node server.js

Si todo está correcto, el servidor se ejecutará en:

   http://localhost:3000

---

## 💻 Ejecución del Frontend

1. Ir a la carpeta:

   frontend

2. Abrir el archivo:

   index.html

3. Asegurarse de que el backend esté corriendo antes de usar el sistema.

El frontend se comunica con el backend a través de peticiones HTTP al puerto 3000.

---

## 🔄 Funcionamiento General

1. El usuario interactúa con el frontend.
2. El frontend envía peticiones HTTP al backend.
3. El backend procesa la solicitud.
4. Se conecta a MySQL usando mysql2.
5. Devuelve la respuesta al frontend.
6. El frontend muestra la información al usuario.

---

## 🎓 Proyecto Académico

Este proyecto fue desarrollado con fines educativos para el curso de Ingeniería en Sistemas.

No contiene datos reales ni información sensible.

---

## 👨‍💻 Autor

Néstor Joseph Martínez Cruz  
GitHub: https://github.com/nmartinezc4-glitch
