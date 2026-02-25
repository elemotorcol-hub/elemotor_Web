# EleMotor - Plataforma Web Empresarial

Sistema de gestión y operación web escalable bajo arquitectura monorepo, diseñado para ofrecer un rendimiento óptimo y una mantenibilidad empresarial a largo plazo.

---

## Descripción General

EleMotor es una plataforma web empresarial moderna construida para resolver necesidades complejas de gestión mediante una interfaz de usuario fluida y un backend robusto. El sistema está orientado a optimizar la escalabilidad y ofrecer una experiencia de desarrollo estructurada que permita a los equipos técnicos iterar de forma rápida y segura, asegurando la calidad del código mediante la separación de responsabilidades y tipado estricto extremo a extremo.

---

## Arquitectura del Proyecto

El sistema adopta una arquitectura de monorepo, dividiendo claramente las capas de presentación y lógica de negocio/acceso a datos en módulos independientes dentro de un mismo repositorio.

```text
elemotor_Web/
 ├── frontend/          # Aplicación cliente web (Next.js 16)
 │   ├── src/app/       # Rutas y Server Components (App Router)
 │   ├── src/components/ # Componentes UI reutilizables
 │   └── src/lib/       # Utilidades y configuración
 │
 ├── backend/           # API REST y lógica de dominio (NestJS)
 │   ├── src/           # Módulos, Controladores, Servicios
 │   └── test/          # Pruebas automatizadas
 │
 ├── README.md          # Documentación del proyecto
 └── .gitignore         # Configuración de exclusión para Git
```

---

## Tecnologías Utilizadas

### Frontend

- **Framework:** Next.js 16
- **Lenguaje:** TypeScript (Strict)
- **Estilos:** Tailwind CSS v4
- **Calidad de Código:** ESLint 9 (Flat Config) y Prettier

### Backend

- **Framework:** NestJS
- **Lenguaje:** TypeScript
- **Base de Datos:** MySQL
- **ORM:** TypeORM

### Herramientas y Entorno

- **Entorno de Ejecución:** Node.js (Versión LTS recomendada)
- **Control de Versiones:** Git

---

## Requisitos Previos

Para ejecutar y contribuir en el desarrollo del proyecto, el entorno local debe contar con:

- **Node.js**: Versión LTS recomendada.
- **MySQL**: Instalado y corriendo localmente o credenciales para un servidor remoto.
- **Git**: Sistema de control de versiones.
- **Nest CLI** (Opcional pero recomendado para el desarrollo de backend).

---

## Instalación del Proyecto

Siga estos pasos para configurar el entorno de ejecución local desde cero:

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd elemotor_Web
   ```

2. **Instalar dependencias del Backend**

   ```bash
   cd backend
   npm install
   ```

3. **Instalar dependencias del Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Configurar archivos `.env`**
   - Duplicar o crear archivos `.env` basándose en las plantillas detalladas en la sección "Variables de Entorno".

5. **Ejecutar migraciones o sincronización de Base de Datos**
   - Asegúrese de que el servidor MySQL esté activo y ejecute las sincronizaciones de TypeORM (si aplica).

6. **Iniciar el Backend**

   ```bash
   cd backend
   npm run start:dev
   ```

7. **Iniciar el Frontend**
   En una nueva terminal:
   ```bash
   cd frontend
   npm run dev
   ```

---

## Variables de Entorno

### Backend (`backend/.env`)

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=db_elemotor
PORT=3001
```

### Frontend (`frontend/.env.local`)

Solo las variables con el prefijo `NEXT_PUBLIC_` son accesibles en el navegador.

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Ejecución del Proyecto

### Backend

```bash
npm run start:dev
```

El backend se ejecuta por defecto en http://localhost:3001

### Frontend

```bash
npm run dev
```

El frontend se ejecuta por defecto en http://localhost:3000

---

## Scripts Disponibles

### Frontend

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm run start`: Inicia la aplicación en producción.
- `npm run lint`: Ejecuta el linter.
- `npm run lint:fix`: Ejecuta el linter y auto-corrige problemas.
- `npm run format`: Formatea el código con Prettier.

### Backend

- `npm run start:dev`: Inicia el servidor en modo desarrollo con watch mode.
- `npm run build`: Construye la aplicación.
- `npm run test`: Ejecuta las pruebas.

---

## Buenas Prácticas del Repositorio

- No subir la carpeta `node_modules` (ya excluida en el `.gitignore`).
- Uso de `.gitignore` para archivos de entorno (`.env`), builds (`.next`, `dist`), etc.
- Uso del estándar Conventional Commits para el historial de control de versiones.
- Separación clara de responsabilidades entre frontend y backend.

---

## Estado Actual del Proyecto

- **Frontend:** En desarrollo.
- **Backend:** En desarrollo.
- **Integración:** En progreso.

---

## Equipo de Desarrollo

- **Líder Técnico:** Marly Tatiana Rangel
- **Desarrollador Frontend:** Juan Camilo Rodríguez
- **Desarrollador Backend:** David Fernando Carrillo
- **Modelador 3D:** Santiago Plata

