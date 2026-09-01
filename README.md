# Portafolio/CV Profesional - Andres Arzamendia

Portafolio y Curriculum Vitae interactivo con Panel de Administración (Dashboard) dinámico. Sistema completamente editable desde el panel de control, diseñado para un estudiante/profesional de Ingeniería en Informática.

## 🏗️ Arquitectura: Un solo despliegue

Este proyecto usa **Next.js con App Router en la raíz del repositorio**. El **frontend** (páginas y componentes) y el **backend** (API routes + Prisma) viven en el **mismo proyecto**, por lo que se despliega **una sola vez** en Vercel — sin necesidad de subir dos carpetas separadas.

- **Backend** → API Routes en `app/api/**` (misma lógica que un servidor Express, pero integrada)
- **Frontend** → Páginas en `app/**` y componentes en `components/**`
- **Base de datos** → PostgreSQL vía Prisma ORM

## 🚀 Características

### Portafolio Público
- **Hero Section** con animación de texto tipo tipear, tarjetas interactivas y botones de contacto rápido
- **Sobre Mí** con áreas de interés (electrónica, física, cálculo, desarrollo)
- **Habilidades Técnicas** con barras de progreso animadas clasificadas por categoría
- **Proyectos** con filtros dinámicos (Frontend, Backend, IoT, Ciencia de Datos) y modales detallados
- **Certificaciones** con credenciales verificables
- **Descarga de CV** con registro de evento en métricas
- **Contacto** con formulario funcional y validación en tiempo real

### Panel de Administración
- **Login seguro** con JWT (cookie httpOnly)
- **Métricas en tiempo real** con gráficos interactivos (visitas, descargas, clics)
- **Live feed** de actividad de usuarios
- **CMS CRUD completo**:
  - Perfil (información personal, enlaces, biografía)
  - CV (subir/reemplazar PDF vía Vercel Blob)
  - Proyectos (CRUD completo)
  - Certificados (CRUD)
  - Habilidades (niveles de dominio)

### Estética
- Tema Dark por defecto (bind carbón `#0a0a0c`)
- Acentos neón: eléctrico azul `#00f0ff`, violeta cuántico `#7000ff`, verde terminal `#00ff66`
- Patrones PCB, cuadrículas matemáticas, código binario
- Glassmorphism y efectos Glow premium
- Animaciones de partículas, scroll reveal, typing effect
- Diseño Mobile-First completamente responsive

## 📂 Estructura del Proyecto

```
.
├── app/                       # Frontend (páginas) + Backend (API routes)
│   ├── page.tsx               # Portafolio público (Home)
│   ├── sobre-mi/              # Página Sobre Mí
│   ├── proyectos/             # Página Proyectos
│   ├── certificados/          # Página Certificados
│   ├── contacto/              # Página Contacto
│   ├── cv/route.ts            # Redirección a descarga del CV
│   ├── admin/                 # Panel de Administración
│   │   ├── page.tsx           # Métricas / Analytics
│   │   ├── login/ perfil/ proyectos/ certificados/ habilidades/ cv/
│   └── api/                   # ⚙️ BACKEND (API Routes)
│       ├── auth/              # POST login, logout, GET me
│       ├── profile/           # GET, PUT
│       ├── projects/          # GET, POST  +  [id] GET/PUT/DELETE
│       ├── certificates/      # GET, POST  +  [id] PUT/DELETE
│       ├── skills/            # GET, POST  +  [id] PUT/DELETE
│       ├── metrics/           # GET, POST track
│       └── upload/            # POST (archivos → Vercel Blob)
├── components/                # UI, portfolio, dashboard, animations, layout
├── hooks/                     # Custom hooks (auth, animaciones)
├── lib/                       # prisma, jwt, auth, api helpers
├── types/                     # TypeScript interfaces
├── public/                    # assets estáticos
│   └── uploads/               # respaldo local para uploads (dev)
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── seed.ts                # Datos iniciales
├── next.config.js
├── tailwind.config.js
├── package.json
└── .env.example
```

> **Concepto clave**: El backend y el frontend se diferencian por convención de carpetas — todo lo que esté dentro de `app/api/**` es backend, el resto es frontend. Pero comparten el mismo despliegue.

## 🗄️ Esquema de Base de Datos

Usa **Prisma ORM** con **PostgreSQL** (compatible con Vercel Postgres, Neon, Supabase, Railway, etc.).

**Modelos:**
- `User` - Administradores (auth JWT)
- `Profile` - Información personal del portafolio
- `Project` - Proyectos con tags, categorías y links
- `Certificate` - Certificados y logros
- `Skill` - Habilidades con niveles (0-100)
- `Metric` - Métricas de visitas, descargas y clics

## 📦 Instalación local

### Requisitos previos
- Node.js (v18 o superior)
- Una base PostgreSQL (local o gratuita: Neon, Supabase)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copia `.env.example` a `.env`:
```env
# Next.js detecta NEXT_PUBLIC_* en build y arranca. La API está en el mismo origen.
DATABASE_URL="postgresql://user:password@host:5432/portfolio?schema=public"
JWT_SECRET="cambia-esta-clave-secreta"
ADMIN_EMAIL="admin@arzamendia.dev"
ADMIN_PASSWORD="admin123"
# Opcional: para subir archivos en producción
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

> **Importante**: `NEXT_PUBLIC_API_URL=/api` (se envía en el navegador). Como la API está en el mismo dominio, no hace falta una URL absoluta. Puedes definirlo en `.env.local` si lo deseas.

### 3. Inicializar la base de datos
```bash
npx prisma db push     # crea las tablas en PostgreSQL
npm run prisma:seed    # crea el admin + datos iniciales
```

### 4. Iniciar en desarrollo
```bash
npm run dev
```

Se ejecutará en **http://localhost:3000** (El frontend y el backend en el mismo puerto).

### Acceso al Panel de Admin
Navega a http://localhost:3000/admin/login
- **Email**: admin@arzamendia.dev
- **Password**: admin123

**Importante**: Cambia las credenciales en `.env` antes de producción.

## 🚢 Despliegue en Vercel (un solo proyecto)

Como frontend y backend viven en el **mismo proyecto Next.js**, solo necesitas **un deployment**:

1. Importa el repositorio en [Vercel](https://vercel.com) y conecta la rama principal
2. Vercel detectará Next.js automáticamente (está en la raíz — sin necesidad de configurar Root Directory)
3. En *Project Settings → Environment Variables*, añade:
   ```
   DATABASE_URL=postgresql://...          # URL de tu BD PostgreSQL (Vercel Postgres / Neon)
   JWT_SECRET=tu-clave-secreta
   ADMIN_EMAIL=admin@arzamendia.dev
   ADMIN_PASSWORD=contraseña-segura
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_... # [opcional] para subir el CV/imágenes a Vercel Blob
   ```
4. Despliega. Ejecuta `npm run prisma:migrate` y `npm run prisma:seed` (o crea el build step) contra tu BD Postgres antes/después del deploy

> **BD**: Te recomiendo [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) o [Neon](https://neon.tech) (ambas con plan gratuito). En cuanto tengas la URL de conexión, añádela como `DATABASE_URL`.

### Subir archivos (CV, imágenes)
- En **producción**: el upload usa **Vercel Blob** (requiere `BLOB_READ_WRITE_TOKEN`). Ejecuta `vercel blob` para crear el token o créalo desde el dashboard de Vercel.
- En **local**: si no configuras Blob, los archivos se guardan en `public/uploads/` (solo para desarrollo local, no persiste en serverless).

## 🔧 API Endpoints (integrados en `/app/api`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/logout` | Cerrar sesión | No |
| GET | `/api/auth/me` | Datos del usuario | Sí |
| GET | `/api/profile` | Obtener perfil | No |
| PUT | `/api/profile` | Actualizar perfil | Sí |
| GET | `/api/projects` | Listar proyectos | No |
| POST | `/api/projects` | Crear proyecto | Sí |
| GET | `/api/projects/:id` | Detalle proyecto | No |
| PUT/DELETE | `/api/projects/:id` | Actualizar/Eliminar | Sí |
| GET | `/api/certificates` | Listar certificados | No |
| POST | `/api/certificates` | Crear certificado | Sí |
| GET | `/api/skills` | Listar habilidades | No |
| POST | `/api/skills` | Crear habilidad | Sí |
| GET | `/api/metrics` | Obtener métricas | Sí |
| POST | `/api/metrics/track` | Registrar evento | No |
| POST | `/api/upload` | Subir archivo | Sí |

## 🎨 Personalización

### Paleta de colores
Los colores se definen en:
- `tailwind.config.js` (paleta `neon` y `dark`)
- `app/globals.css` (CSS variables)

### Tipografías
- **Sans**: Inter (Google Fonts)
- **Mono**: JetBrains Mono (Google Fonts)

Cambia las fuentes en `app/globals.css` y `tailwind.config.js`.

## 📄 Licencia
Este proyecto es de uso personal/educativo. Puedes modificarlo libremente para tu propio portafolio.
