# Portafolio/CV Profesional - Andres Arzamendia

Portafolio y Curriculum Vitae interactivo con Panel de Administración (Dashboard) dinámico. Sistema completamente editable desde el panel de control, diseñado para un estudiante/profesional de Ingeniería en Informática.

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
- **Login seguro** con JWT
- **Métricas en tiempo real** con gráficos interactivos (visitas, descargas, clics)
- **Live feed** de actividad de usuarios
- **CMS CRUD completo**:
  - Perfil (información personal, enlaces, biografía)
  - CV (subir/reemplazar PDF)
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

## 🏗️ Estructura del Proyecto

```
.
├── backend/                  # Backend (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma     # Esquema de base de datos
│   │   └── seed.ts           # Datos iniciales
│   ├── src/
│   │   ├── controllers/      # Lógica de negocio
│   │   ├── middleware/       # Autenticación
│   │   ├── routes/           # Endpoints de la API
│   │   ├── utils/            # Utilidades (JWT, Prisma)
│   │   └── server.ts         # Servidor Express
│   └── uploads/              # Archivos subidos (imágenes, CV)
│
└── frontend/                 # Frontend (Next.js + TypeScript)
    ├── app/
    │   ├── page.tsx          # Portafolio público (Home)
    │   ├── sobre-mi/         # Página Sobre Mí
    │   ├── proyectos/        # Página Proyectos
    │   ├── certificados/     # Página Certificados
    │   ├── contacto/         # Página Contacto
    │   └── admin/            # Panel de Administración
    │       ├── login/        # Login
    │       ├── perfil/       # Editar perfil
    │       ├── proyectos/    # Gestionar proyectos
    │       ├── certificados/ # Gestionar certificados
    │       ├── habilidades/  # Gestionar habilidades
    │       └── cv/           # Gestionar CV
    ├── components/
    │   ├── ui/               # Componentes reutilizables
    │   ├── portfolio/        # Secciones del portafolio
    │   ├── dashboard/        # Componentes del admin
    │   ├── animations/       # Animaciones y micro-interacciones
    │   └── layout/           # Header, Footer
    ├── hooks/                # Custom hooks
    ├── lib/                  # Utilidades y APIs
    └── types/                # TypeScript interfaces
```

## 🗄️ Esquema de Base de Datos

El proyecto usa **Prisma ORM** con **SQLite** para desarrollo y **PostgreSQL** para producción.

**Modelos principales:**
- `User` - Administradores (auth JWT)
- `Profile` - Información personal del portafolio
- `Project` - Proyectos con tags, categorías y links
- `Certificate` - Certificados y logros
- `Skill` - Habilidades con niveles (0-100)
- `Metric` - Métricas de visitas, descargas y clics

## 📦 Instalación

### Requisitos previos
- Node.js (v18 o superior)
- npm (v9 o superior)

### 1. Clonar el repositorio
```bash
git clone https://github.com/andres-arzamendia/Curriculum-Univ-Andres-Arzamendia.git
cd Curriculum-Univ-Andres-Arzamendia
```

### 2. Instalar dependencias
```bash
npm run install:all
```

### 3. Configurar variables de entorno

**Backend** - Copia `backend/.env.example` a `backend/.env`:
```env
DATABASE_URL="file:./dev.db"        # SQLite para desarrollo
JWT_SECRET="cambia-esta-clave-secreta"
JWT_EXPIRES_IN="7d"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
ADMIN_EMAIL="admin@arzamendia.dev"   # Credenciales admin por defecto
ADMIN_PASSWORD="admin123"
```

**Frontend** - Copia `frontend/.env.local.example` (o crea `frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Inicializar la base de datos
```bash
npm run setup:backend
npm run seed:backend
```

### 5. Iniciar en desarrollo
```bash
npm run dev
```

El proyecto se ejecutará en:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

### Acceso al Panel de Admin
Navega a http://localhost:3000/admin/login
- **Email**: admin@arzamendia.dev
- **Password**: admin123

**Importante**: Cambia estas credenciales en producción.

## 🚢 Despliegue

### Opción A: Vercel (Frontend) + Railway/Render (Backend)

**Frontend en Vercel:**

Antes de desplegar hay que decirle a Vercel dónde está la app Next.js. Como la app vive dentro de `frontend/` (no en la raíz del repo), **no** se puede usar `rootDirectory` en `vercel.json` (Vercel no lo acepta en su esquema). Debes configurarlo de una de estas dos formas:

1. **Desde el dashboard (recomendado)** → En el proyecto de Vercel: *Project Settings → General → Root Directory* → escribe `frontend` → *Save*. En el siguiente deploy Vercel usará `frontend/package.json` y detectará Next.js automáticamente.

2. **Desde la CLI** → Dentro de la carpeta, ejecuta `vercel link` para anclar el proyecto:
   ```bash
   cd frontend
   vercel link
   vercel   # o: vercel --prod
   ```
   Vercel detectará `frontend` como raíz del proyecto Next.js y creará `frontend/.vercel/project.json`.

Después de cualquiera de las dos opciones:
3. En *Project Settings → Environment Variables* añade:
   ```
   NEXT_PUBLIC_API_URL=https://tu-backend.com/api   # Reemplaza con la URL real de tu API
   ```
4. Despliega. Vercel ejecutará `next build` dentro de `frontend/`.

**Backend en Railway/Render:**
1. Crea un nuevo servicio desde el directorio `backend`
2. Configura PostgreSQL como base de datos
3. Añade las variables de entorno (DATABASE_URL, JWT_SECRET, CORS_ORIGIN con la URL de Vercel)
4. Ejecuta migraciones: `npm run prisma:migrate && npm run prisma:seed`

> **Nota CORS**: Asegúrate de que `CORS_ORIGIN` en el backend apunte a tu dominio de Vercel (ej: `https://tu-app.vercel.app`) para que el frontend pueda comunicarse con la API.

### Opción B: Server Único (Node.js)
```bash
npm run build
npm run start:backend  # Puerto 4000
npm run start:frontend # Puerto 3000
```

### Configuración para PostgreSQL en producción
Cambia `DATABASE_URL` en `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```
Luego actualiza el provider en `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Y ejecuta:
```bash
npm --prefix backend run prisma:migrate -- --name init
```

## 🔧 API Endpoints

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/logout` | Cerrar sesión | Sí |
| GET | `/api/auth/me` | Datos del usuario | Sí |
| GET | `/api/profile` | Obtener perfil | No |
| PUT | `/api/profile` | Actualizar perfil | Sí |
| GET | `/api/projects` | Listar proyectos | No |
| POST | `/api/projects` | Crear proyecto | Sí |
| PUT | `/api/projects/:id` | Actualizar proyecto | Sí |
| DELETE | `/api/projects/:id` | Eliminar proyecto | Sí |
| GET | `/api/certificates` | Listar certificados | No |
| POST | `/api/certificates` | Crear certificado | Sí |
| GET | `/api/skills` | Listar habilidades | No |
| POST | `/api/skills` | Crear habilidad | Sí |
| GET | `/api/metrics` | Obtener métricas | Sí |
| POST | `/api/metrics/track` | Registrar evento | No |
| POST | `/api/upload` | Subir archivo | Sí |

## 🎨 Personalización

### Paleta de colores
Los colores principales se definen en:
- `frontend/tailwind.config.js` (paleta `neon` y `dark`)
- `frontend/app/globals.css` (CSS variables)

### Tipografías
- **Sans**: Inter (Google Fonts)
- **Mono**: JetBrains Mono (Google Fonts)

Cambia las fuentes en `frontend/app/globals.css` y `frontend/tailwind.config.js`.

## 📄 Licencia
Este proyecto es de uso personal/educativo. Puedes modificarlo libremente para tu propio portafolio.
