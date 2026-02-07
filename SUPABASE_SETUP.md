# 🏈 Casa Basurto Super Bowl Hub - Guía de Implementación Supabase

## 1️⃣ PREPARAR LAS CREDENCIALES

Ve a tu proyecto en **Supabase** y copia:
- **SUPABASE_URL**: En el sidebar, Settings → API → Project URL
- **SUPABASE_ANON_KEY**: En el sidebar, Settings → API → anon public key

## 2️⃣ REEMPLAZAR EN app_supabase.js

Abre el archivo `app_supabase.js` y reemplaza estas líneas (10-11):

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Reemplaza con tu URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Reemplaza con tu key
```

Con tus credenciales reales. Ejemplo:

```javascript
const SUPABASE_URL = 'https://xyzabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 3️⃣ INSTALAR DEPENDENCIAS

En la terminal, en la carpeta del proyecto:

```bash
npm install @supabase/supabase-js lucide-react
```

## 4️⃣ REEMPLAZAR app.js

Reemplaza el contenido del `app.js` original con el contenido de `app_supabase.js`:

```bash
cp app_supabase.js app.js
```

O simplemente copia y pega manualmente.

## 5️⃣ VERIFICAR POLÍTICAS RLS (Row Level Security)

Por defecto, Supabase tiene RLS habilitado. Necesitas configurar las políticas para que funcione:

### En Supabase → Authentication → Policies:

#### Para tabla `users`:
- Habilitar SELECT sin restricción (público)
- INSERT/UPDATE solo si uid = auth.uid()

#### Para tabla `quinielas`:
- SELECT sin restricción (ver qué otros votaron)
- INSERT solo si uid = auth.uid()
- UPDATE bloqueado (no permitir edición)

#### Para tabla `orders`:
- SELECT sin restricción
- INSERT solo si uid = auth.uid()

#### Para tabla `stats`:
- SELECT sin restricción
- UPDATE con función personalizada (solo increment de cheves)

**Si quieres que funcione sin políticas complicadas, puedes desabilitar RLS temporalmente:**
- Abre cada tabla → Authentication → RLS → Disable RLS (⚠️ solo para desarrollo)

## 6️⃣ PROBAR LA APP

```bash
npm start
```

La app debe:
1. ✅ Loguear anónimamente con Supabase
2. ✅ Guardar nombre y equipo en localStorage
3. ✅ Sincronizar cheves en tiempo real
4. ✅ Permitir votación en quiniela (bloqueada después de enviar)
5. ✅ Guardar pedidos de burger

## 7️⃣ DEPLOY (Opcional)

### Opción A: Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Opción B: Netlify
```bash
npm run build
# Sube la carpeta dist a Netlify
```

## ⚠️ NOTAS IMPORTANTES

- Las credenciales en el código son **públicas** porque usamos Anonymous Auth
- Las políticas RLS protegen los datos sensibles
- El ID único de cada usuario viene de `supabase.auth.user().id`
- Los timestamps de Supabase son automáticos (TIMESTAMP DEFAULT NOW())

## 🔧 Si algo falla:

1. Abre **Console** (F12) y mira los errores
2. Verifica que las tablas existan en Supabase
3. Verifica que las credenciales sean correctas
4. Prueba primero sin RLS habilitado

¡Listo! 🚀
