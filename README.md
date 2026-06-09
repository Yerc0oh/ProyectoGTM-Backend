# Sistema de Gestión de Turnos Médicos

**Univ. Abed Yeray Calderon Calle**  
**Lic. Jhonny Felipez Andrade**

---

## Descripción general

Aplicación web fullstack para la gestión de turnos médicos. Permite administrar pacientes, doctores, usuarios y turnos, con soporte para notificaciones por correo electrónico, generación de comprobantes en PDF y visualización de estadísticas del sistema.

---

## Tecnologías utilizadas

### Backend

| Tecnología | Uso |
|---|---|
| NestJS | Framework principal del servidor |
| Prisma ORM | Acceso y modelado de base de datos |
| MySQL | Motor de base de datos relacional |
| JWT | Autenticación y control de sesiones |
| NodeMailer | Envío de correos electrónicos |
| PDFKit | Generación de comprobantes en PDF |

### Frontend

| Tecnología | Uso |
|---|---|
| React + TypeScript | Interfaz de usuario |
| Axios | Comunicación con la API |
| React Router DOM | Navegación entre páginas |
| Context API | Gestión de estado de autenticación |
| CSS personalizado | Estilos sin dependencias de UI externas |

---

## Funcionalidades principales

### Autenticación
- Registro e inicio de sesión de usuarios
- Control de acceso basado en roles (ADMIN / USER)
- Protección de rutas mediante JWT

### Gestión de turnos
- Crear, editar y eliminar turnos
- Cambio de estado: Pendiente, Confirmado, Completado, Cancelado
- Asignación de doctor y paciente por turno
- Visualización de turnos por fecha

### Usuarios
- CRUD completo de usuarios (solo administradores)
- Asignación y modificación de roles

### Pacientes y doctores
- CRUD de pacientes
- CRUD de doctores con asignación de especialidad

### Notificaciones por correo
- Envío manual de recordatorios de turnos desde el panel
- Envío automatizado de recordatorios 24 horas antes del turno (cron job)
- Plantillas HTML personalizadas

### Comprobantes PDF
- Generación de comprobante de turno al completar una cita
- Descarga directa desde el frontend

### Estadísticas
- Totales de turnos, pacientes, doctores y especialidades
- Grafico de turnos por estado (Pendiente, Confirmado, Completado, Cancelado)
- Grafico de turnos por especialidad

---

## Estructura del proyecto

```
/
├── proy-tmback/       # Backend (NestJS)
└── ProyTMFront/       # Frontend (React + TypeScript)
```

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd <NOMBRE_DEL_REPO>
```

### 2. Backend (NestJS)

```bash
cd proy-tmback
npm install
```

Configurar las variables de entorno en un archivo `.env` en la raíz del backend:

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/nombre_db"
JWT_SECRET="tu_secreto"
PORT=3000
```

Ejecutar migraciones de base de datos:

```bash
npx prisma migrate dev
```

Iniciar el servidor en modo desarrollo:

```bash
npm run start:dev
```

### 3. Frontend (React)

```bash
cd ProyTMFront
npm install
npm run dev
```

El frontend corre por defecto en:

```
http://localhost:5173
```

La API base del backend se encuentra en:

```
http://localhost:3000
```

---

## Roles del sistema

### ADMIN (Administrador)
- Acceso completo al sistema
- Gestion de usuarios, turnos, pacientes y doctores
- Envio de recordatorios por correo
- Visualizacion de estadisticas del sistema
- Generacion y descarga de comprobantes PDF

### USER (Usuario)
- Visualizacion de turnos, doctores, especialidades y disponibilidad
- Solicitud de citas mediante contacto por WhatsApp

---

## Notas tecnicas

- La autenticacion se gestiona mediante tokens JWT almacenados en el cliente.
- Los recordatorios automaticos se ejecutan mediante un cron job configurado en el backend.
- Los comprobantes PDF se generan dinamicamente en el servidor con datos reales del turno.
- Las estadisticas se calculan en tiempo real sobre la base de datos.
- El frontend no utiliza librerias de componentes externas; todos los estilos son CSS propio.

---

## Autor

Abed Yeray Calderon Calle  
Proyecto desarrollado como parte de un sistema academico de gestion de turnos medicos.  
Docente: Lic. Jhonny Felipez Andrade