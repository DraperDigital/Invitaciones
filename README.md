# Invitaciones Digitales MX

Una plataforma SaaS moderna para crear y gestionar invitaciones digitales elegantes para eventos en México.

## 🚀 Deploy en Netlify

### Configuración Rápida

1. **Push a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <tu-repo-url>
   git push -u origin main
   ```

2. **Conectar con Netlify:**
   - Ve a [Netlify](https://netlify.com)
   - Click en "Add new site" → "Import an existing project"
   - Selecciona GitHub y autoriza
   - Selecciona tu repositorio
   - Netlify detectará automáticamente la configuración de `netlify.toml`

3. **Variables de Entorno:**
   En Netlify Dashboard → Site settings → Environment variables, agrega:
   - `VITE_SUPABASE_URL`: Tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase

4. **Deploy:**
   - Click en "Deploy site"
   - Netlify construirá y desplegará automáticamente

### Deploy Automático
Cada push a la rama `main` desplegará automáticamente a producción.

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🎨 Stack Tecnológico

- **Framework:** React 18 + TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Auth, Database, Storage)
- **Build:** Vite
- **Deploy:** Netlify

## 📋 Características

- ✅ Autenticación con Magic Link
- ✅ Creación de eventos con wizard
- ✅ Invitaciones personalizables
- ✅ Sistema de RSVP en tiempo real
- ✅ Generación de links de WhatsApp
- ✅ Dashboard de gestión
- ✅ Diseño responsive (móvil primero)
- ✅ Paleta de colores elegante (Blanco/Negro/Dorado)

## 🗄️ Base de Datos

El esquema de base de datos está en `schema.sql`. Para configurar:

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a SQL Editor
3. Ejecuta el contenido de `schema.sql`
4. Copia las credenciales a las variables de entorno

## 📱 Modo Demo

La aplicación incluye datos mock para desarrollo sin backend:
- Si `VITE_SUPABASE_URL` no está configurada, usa datos de ejemplo
- Perfecto para testing y desarrollo de UI

## 🎯 Roadmap

- [ ] Sistema de personalización de temas
- [ ] Editor drag & drop
- [ ] Integración con pasarelas de pago
- [ ] Galería de fotos
- [ ] Envío masivo de WhatsApp
- [ ] Analytics y reportes

## 📞 Soporte

Para preguntas y soporte, contacta a través de nuestras redes sociales.

## 📄 Licencia

Todos los derechos reservados © 2026 Invitaciones MX
