# 📋 Guía Completa de Despliegue
## Check List Cultivo — CANANVALLE S.A.

---

## 🧩 Stack tecnológico utilizado

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | **React + Vite** | Moderno, rápido, el mismo ecosistema de KrakeDev |
| Base de datos | **Supabase (PostgreSQL)** | Gratis, en la nube, no necesitas servidor |
| Despliegue | **Vercel** | Gratis, conecta directo con GitHub, ya lo conoces |
| PDF | HTML generado + imprimir | Sin dependencias extra, funciona en cualquier navegador |

---

## 📁 Estructura del proyecto

```
cananvalle-checklist/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Home.jsx / .module.css
│   │   ├── ReportForm.jsx / .module.css
│   │   ├── ReportList.jsx / .module.css
│   │   ├── ReportView.jsx / .module.css
│   │   └── SignaturePad.jsx / .module.css
│   ├── data/
│   │   └── checklist.js        ← Criterios, áreas y colaboradores
│   ├── lib/
│   │   ├── supabase.js          ← Conexión y queries a la BD
│   │   └── reportGen.js         ← Generación del HTML/PDF
│   ├── App.jsx                  ← Orquestador de pantallas
│   ├── main.jsx                 ← Punto de entrada React
│   └── index.css               ← Estilos globales
├── supabase/
│   └── schema.sql               ← Script SQL para crear la BD
├── .env.example                 ← Plantilla de variables de entorno
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

## 🪜 PASO 1 — Instalar herramientas necesarias

### Node.js (si no lo tienes)
1. Ve a https://nodejs.org
2. Descarga la versión **LTS** (la verde)
3. Instala con las opciones por defecto
4. Verifica en terminal: `node -v` → debe mostrar v18 o superior

### Git (si no lo tienes)
1. Ve a https://git-scm.com
2. Descarga e instala para Windows
3. Verifica: `git --version`

---

## 🪜 PASO 2 — Crear cuenta en Supabase (base de datos GRATIS)

1. Ve a **https://supabase.com**
2. Clic en **"Start your project"** → regístrate con GitHub o email
3. Una vez dentro, clic en **"New project"**
4. Llena:
   - **Name:** `cananvalle-checklist`
   - **Database Password:** pon una contraseña fuerte (guárdala)
   - **Region:** `South America (São Paulo)` ← más cercano a Ecuador
5. Clic en **"Create new project"** — espera ~2 minutos

### Crear la tabla en la base de datos

6. En el panel de Supabase, clic en **"SQL Editor"** (barra izquierda)
7. Clic en **"New query"**
8. Copia y pega **todo el contenido** del archivo `supabase/schema.sql`
9. Clic en **"Run"** (botón verde arriba a la derecha)
10. Deberías ver: `Success. No rows returned`

### Obtener las credenciales

11. En Supabase, ve a **Settings → API** (engranaje en la barra izquierda)
12. Copia y guarda:
    - **Project URL** → algo como `https://abcdefgh.supabase.co`
    - **anon / public key** → el JWT largo de abajo

---

## 🪜 PASO 3 — Configurar el proyecto localmente

```bash
# 1. Descarga el proyecto (o copia la carpeta)
# Si viene de GitHub:
git clone https://github.com/TU_USUARIO/cananvalle-checklist.git
cd cananvalle-checklist

# Si viene de la carpeta descargada:
cd cananvalle-checklist

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de entorno
# Copia el archivo de ejemplo:
cp .env.example .env
```

4. Abre `.env` con el Bloc de notas o VS Code y reemplaza:

```env
VITE_SUPABASE_URL=https://TU_URL_REAL.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...TU_KEY_REAL
```

```bash
# 5. Correr en modo desarrollo
npm run dev
```

5. Abre el navegador en **http://localhost:5173** — ¡deberías ver la app!

---

## 🪜 PASO 4 — Subir el código a GitHub

```bash
# Dentro de la carpeta del proyecto:

# Inicializar repositorio (si no existe)
git init

# Agregar todos los archivos (el .gitignore excluye .env automáticamente)
git add .

# Primer commit
git commit -m "Initial: Check List Cultivo CANANVALLE"

# Crear el repositorio en GitHub (https://github.com/new)
# Nombre: cananvalle-checklist
# Privado ✓ (recomendado)

# Conectar y subir
git remote add origin https://github.com/TU_USUARIO/cananvalle-checklist.git
git branch -M main
git push -u origin main
```

> ⚠️ **MUY IMPORTANTE:** el archivo `.env` NO se sube a GitHub (está en `.gitignore`).
> Las credenciales las agregas directamente en Vercel en el siguiente paso.

---

## 🪜 PASO 5 — Desplegar en Vercel (hosting GRATIS)

1. Ve a **https://vercel.com** → inicia sesión con tu cuenta de GitHub
2. Clic en **"Add New… → Project"**
3. Busca y selecciona tu repositorio `cananvalle-checklist`
4. Clic en **"Import"**
5. En **"Environment Variables"** agrega las dos variables:

   | Key | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | tu URL de Supabase |
   | `VITE_SUPABASE_ANON_KEY` | tu anon key de Supabase |

6. Clic en **"Deploy"**
7. Espera ~1 minuto. Vercel te dará una URL tipo:
   `https://cananvalle-checklist.vercel.app`

🎉 **¡La app está en línea y accesible desde cualquier celular o computadora!**

---

## 🪜 PASO 6 — Actualizar la app en el futuro

Cada vez que hagas cambios en el código:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Vercel detecta el push automáticamente y redeploya en ~30 segundos.

---

## 📱 ¿Cómo usar la app en el celular?

1. Abre el navegador (Chrome o Safari)
2. Entra a tu URL de Vercel
3. Android: menú → **"Añadir a pantalla de inicio"**
4. iPhone: compartir → **"Añadir a inicio"**

La app se comporta como una aplicación instalada.

---

## 💾 ¿Dónde se guardan los datos?

Los datos viven en **Supabase** (PostgreSQL en la nube):
- Tabla `reports`: cada fila es un reporte semanal
- El campo `areas` (JSONB) contiene TODA la información:
  - Datos de cada colaborador (bloque, criterios 1-15, observaciones)
  - Firmas en formato base64 (imagen de la firma digital)
  - Supervisor y jefe de finca
- Los reportes cerrados quedan guardados permanentemente
- Puedes ver y exportar todos los datos desde **Supabase → Table Editor**

---

## 🔒 Seguridad (recomendaciones futuras)

La versión actual usa acceso público (anon key). Para producción en CANANVALLE
puedes agregar autenticación con Supabase Auth:

1. **Supabase → Authentication → Providers → Email** (activar)
2. Crear usuarios para cada supervisor
3. Modificar las políticas RLS en `schema.sql` para que cada usuario
   solo vea los reportes de su finca

Consulta a tu Ing. Wilo si quieren implementar esto en una segunda fase.

---

## ❓ Problemas frecuentes

| Error | Solución |
|---|---|
| `Missing env vars` al arrancar | Revisa que `.env` tenga las dos variables correctas |
| No carga datos | Verifica que ejecutaste el SQL en Supabase correctamente |
| Firma no se guarda | Las firmas son imágenes base64; si son muy grandes puede fallar. Limitar el canvas a 400×180px (ya está configurado) |
| Vercel da error 404 | El archivo `vercel.json` ya está incluido para manejar esto |
| `npm install` falla | Asegúrate de tener Node 18+ con `node -v` |

---

## 📞 Soporte

Desarrollado por: **Bryan Morán (Neeko) — Asistente de Sistemas CANANVALLE S.A.**
Email: asistente_sistemas@cananvalle.com
Stack: React 18 · Vite 5 · Supabase · Vercel
