<div align="center">

# EleMotor Web

**Plataforma cliente del sistema EleMotor — Interfaz de usuario moderna, rápida y empresarial**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-orange?style=for-the-badge)

</div>

---

## 📋 Descripción General

**EleMotor Web** es la capa de presentación del sistema EleMotor. Está construida para resolver necesidades complejas de gestión mediante una interfaz de usuario interactiva y responsiva. El proyecto asegura la calidad del código mediante la separación de responsabilidades y tipado estricto extremo a extremo.

> 🔗 El frontend consume la API REST provista por el repositorio [`elemotor_DMS`](../elemotor_DMS) (Backend).

---

## 🛠️ Tecnologías Utilizadas

| Tecnología       | Versión         | Propósito                             |
| ---------------- | --------------- | ------------------------------------- |
| **Next.js**      | 16 (App Router) | Framework principal de React          |
| **TypeScript**   | Strict          | Tipado estático extremo a extremo     |
| **Tailwind CSS** | v4              | Framework de estilos utilitario       |
| **ESLint**       | 9 (Flat Config) | Análisis estático y calidad de código |
| **Prettier**     | —               | Formateo automático del código        |
| **Node.js**      | LTS             | Entorno de ejecución                  |

---

## ✅ Requisitos Previos

Antes de iniciar, asegúrese de tener instalado en su entorno local:

- **Node.js** — Versión LTS recomendada ([nodejs.org](https://nodejs.org))
- **Git** — Sistema de control de versiones ([git-scm.com](https://git-scm.com))

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio-frontend>
cd elemotor_Web
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Crear el archivo de entorno local
cp .env.example .env.local
```

> Edite `.env.local` con los valores correspondientes a su entorno. Consulte la sección de [Variables de Entorno](#-variables-de-entorno).

---

## 🔑 Variables de Entorno

Crear el archivo `.env.local` en la raíz del proyecto. Solo las variables con el prefijo `NEXT_PUBLIC_` son accesibles desde el navegador.

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

| Variable              | Descripción                    | Ejemplo                     |
| --------------------- | ------------------------------ | --------------------------- |
| `NEXT_PUBLIC_API_URL` | URL base de la API del backend | `http://localhost:4000/api` |

---

## 📂 Estructura de Carpetas

```
elemotor_Web/
 ├── src/
 │   ├── app/         # Rutas y Server Components (App Router)
 │   ├── components/  # Componentes UI reutilizables
 │   └── lib/         # Utilidades, hooks y configuración
 ├── public/          # Archivos estáticos
 ├── .env.local       # Variables de entorno (no versionar)
 ├── next.config.ts   # Configuración de Next.js
 ├── tailwind.config.ts
 └── tsconfig.json
```

---

## 📜 Scripts Disponibles

| Comando            | Descripción                             |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Inicia el servidor de desarrollo        |
| `npm run build`    | Construye la aplicación para producción |
| `npm run start`    | Inicia la aplicación en modo producción |
| `npm run lint`     | Ejecuta el linter (ESLint)              |
| `npm run lint:fix` | Linter con auto-corrección              |
| `npm run format`   | Formatea el código con Prettier         |

---

## ▶️ Cómo Ejecutar el Proyecto

```bash
npm run dev
```

El frontend estará disponible en: **[http://localhost:3000](http://localhost:3000)**

> ⚠️ Asegúrese de que el backend (`elemotor_DMS`) esté ejecutándose antes de iniciar el frontend para que las peticiones a la API funcionen correctamente.

---

## 👥 Equipo de Desarrollo

| Rol                       | Nombre                  |
| ------------------------- | ----------------------- |
| 🧑‍💼 Líder Técnico          | Marly Tatiana Rangel    |
| 💻 Desarrollador Frontend | Juan Camilo Rodríguez   |
| ⚙️ Desarrollador Backend  | David Fernando Carrillo |
| 🎨 Modelador 3D           | Santiago Plata          |

---

<div align="center">

**EleMotor Web** · En desarrollo · 2026

</div>
