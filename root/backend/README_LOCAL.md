# 🎯 Lottery Tracker - Guía de Ejecución Local

## ✅ Estado del Proyecto
El proyecto está **completamente funcional en local** corriendo en `http://localhost:3000`

## 📋 Requisitos
- Node.js instalado
- npm instalado

## 🚀 Cómo Ejecutar

### 1. Navega a la carpeta backend
```powershell
cd C:\Users\USUARIO\Documents\STEVEN\lottery-tracker\root\backend
```

### 2. Inicia el servidor
```powershell
npm start
```

### 3. Accede al dashboard
Abre el navegador en: `http://localhost:3000`

## 📦 Cambios Realizados

### Base de datos
- ✅ Migrado de PostgreSQL (Supabase) a **SQLite local** (loteria.db)
- ✅ Se crea automáticamente al iniciar el servidor
- ✅ Tablas creadas: coincidencias, resumen_diario, placas

### Frontend
- ✅ Dashboard HTML funcional en `public/Frontend/`
- ✅ Archivo index.html creado como página de inicio
- ✅ Se actualiza automáticamente cada 10 segundos
- ✅ Estilos con Tailwind CSS

### Backend
- ✅ Express.js configurado correctamente
- ✅ CORS habilitado
- ✅ Endpoints disponibles:
  - `GET /` - Dashboard
  - `GET /dashboard` - Últimas 50 coincidencias
  - `GET /resumen` - Resumen diario
  - `GET /coincidencias` - Todas las coincidencias
  - `POST /consultar` - Consultar coincidencias
  - `POST /placa` - Agregar placa

## 🔧 Configuración

### .env
Las variables están configuradas en `.env`:
- DATABASE_URL (no se usa, es local ahora)
- TELEGRAM_TOKEN (para alertas)
- TELEGRAM_CHAT_ID (para alertas)
- PORT = 3000

## 📝 Notas
- El watchdog ejecuta cada 10 minutos
- El resumen diario se genera a las 18:00
- Las alertas de Telegram se envían cuando hay coincidencias
- La página se auto-actualiza cada 10 segundos

## 🎯 Próximos Pasos Opcionales
1. Mejorar parsing de resultados en `loterias.js`
2. Agregar UI para agregar/eliminar placas
3. Implementar historial más completo
4. Agregar gráficos de resultados

---
**Proyecto corriendo en:** `http://localhost:3000`
