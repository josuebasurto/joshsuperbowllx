# 🔧 Setup Guide

## Configuración de Supabase

### 1. Crear Proyecto
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Click en "New Project"
4. Completa los datos:
   - Name: `casa-basurto-superbowl`
   - Database Password: (guarda esta contraseña)
   - Region: Elige la más cercana
5. Espera a que el proyecto se cree (~2 minutos)

### 2. Obtener Credenciales
1. En tu proyecto, ve a **Settings** > **API**
2. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 3. Crear Base de Datos
1. Ve a **SQL Editor**
2. Click en "New Query"
3. Copia y pega el contenido completo de `database_schema.sql`
4. Click en "Run" o presiona `Ctrl+Enter`
5. Verifica que aparezca "Success"

### 4. Configurar Políticas de Seguridad (RLS)
1. En **SQL Editor**, crea una nueva query
2. Copia y pega:

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quinielas ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Permitir acceso público (sin autenticación)
CREATE POLICY "Allow all" ON users FOR ALL USING (true);
CREATE POLICY "Allow all" ON quinielas FOR ALL USING (true);
CREATE POLICY "Allow all" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all" ON stats FOR ALL USING (true);
CREATE POLICY "Allow all" ON surveys FOR ALL USING (true);
```

3. Ejecuta la query

### 5. Verificar Tablas
1. Ve a **Table Editor**
2. Deberías ver 5 tablas:
   - `users`
   - `quinielas`
   - `orders`
   - `stats`
   - `surveys`

## Configuración Local

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Ejecutar en Desarrollo
```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

## Deploy en Vercel

### 1. Preparar Repositorio
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/SuperBowlLX.git
git push -u origin main
```

### 2. Configurar Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Click en "Import Project"
3. Selecciona tu repositorio de GitHub
4. En "Environment Variables" agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click en "Deploy"

### 3. Dominio Personalizado (Opcional)
1. En tu proyecto de Vercel, ve a **Settings** > **Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

## Deploy en Netlify

### 1. Configurar Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Click en "Add new site" > "Import an existing project"
3. Conecta con GitHub y selecciona tu repositorio
4. Configuración:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. En "Environment variables" agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click en "Deploy site"

## Troubleshooting

### Error: "Supabase no configurado"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el archivo `.env` existe y tiene los valores correctos

### Error: "Failed to fetch"
- Verifica que las políticas RLS estén configuradas
- Revisa que las tablas existan en Supabase

### La app no se conecta a Supabase
- Verifica la URL de Supabase (debe terminar en `.supabase.co`)
- Verifica que estés usando la `anon/public` key, no la `service_role` key

### Build falla en Vercel/Netlify
- Asegúrate de que las variables de entorno estén configuradas en la plataforma
- Verifica que `npm run build` funcione localmente

## Soporte

Si tienes problemas, contacta a:
- **Josue Basurto**
- WhatsApp: +52 663 295 4046
