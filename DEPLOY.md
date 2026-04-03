# 🚀 Guía de Deploy a Netlify

## Pre-requisitos
- Cuenta en GitHub
- Cuenta en Netlify
- Cuenta en Supabase (para el backend)

## Paso 1: Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. En el SQL Editor, ejecuta el contenido de `schema.sql`
3. Ve a Project Settings → API
4. Copia tu `Project URL` y `anon public` key

## Paso 2: Subir a GitHub

```bash
# Inicializar repositorio
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "feat: initial commit - invitaciones digitales platform"

# Crear rama main
git branch -M main

# Conectar con tu repositorio remoto (crea uno en GitHub primero)
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git

# Subir código
git push -u origin main
```

## Paso 3: Conectar con Netlify

1. Ve a [app.netlify.com](https://app.netlify.com)
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub** y autoriza el acceso
4. Busca y selecciona tu repositorio
5. Netlify detectará automáticamente:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (Configurado en `netlify.toml`)

## Paso 4: Variables de Entorno

En Netlify Dashboard:

1. Ve a **Site settings** → **Environment variables**
2. Click en **"Add a variable"**
3. Agrega estas variables:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

## Paso 5: Deploy

1. Click en **"Deploy site"**
2. Espera 2-3 minutos mientras Netlify:
   - Clona tu repo
   - Instala dependencias
   - Ejecuta el build
   - Publica el sitio

## ✅ ¡Listo!

Tu sitio estará disponible en: `https://random-name-123.netlify.app`

### Configurar Dominio Personalizado (Opcional)

1. En Netlify → Site settings → Domain management
2. Click en "Add custom domain"
3. Sigue las instrucciones para configurar DNS

## 🔄 Deploys Automáticos

Cada vez que hagas push a `main`, Netlify desplegará automáticamente:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push
```

## 🐛 Debugging

Si el deploy falla:

1. Revisa los logs en Netlify Dashboard → Deploys
2. Verifica que las variables de entorno estén configuradas
3. Asegúrate que `npm run build` funcione localmente

## 📱 Preview Deploys

Netlify crea previews automáticos para Pull Requests.
¡Perfecto para testing antes de mergear a producción!

## 🎯 URLs Importantes

- **Sitio de producción:** `https://tu-sitio.netlify.app`
- **Dashboard Netlify:** `https://app.netlify.com`
- **Dashboard Supabase:** `https://app.supabase.com`

## 💡 Tips

- Netlify es gratis para proyectos personales
- Los builds son incrementales (más rápidos después del primero)
- Puedes hacer rollback a deploys anteriores
- CDN global incluido (súper rápido)
