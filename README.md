# Mesa · Redacción deportiva con IA

V1 para Vercel. Parte de un disparador periodístico, arma una mesa editorial y después redacta + revisa la nota.

## Flujo

1. **Input universal**: texto/cable/declaración/resultado + contexto opcional + hasta 6 URLs.
2. **Mesa**: clasifica breaking, noticia, declaraciones, mercado, previa, post, actualización o análisis.
3. **Control previo**: separa confirmados, faltantes y cautelas; propone enfoques.
4. **Router de modelos** por complejidad:
   - 0–2: `free_fast`
   - 3–5: `free_strong`
   - 6–10: `premium`
5. **Redactor**: título, bajada, cuerpo y alternativas.
6. **Revisor independiente**: contrasta borrador contra la mesa. Si rechaza, permite **una sola reescritura automática**.

La V1 implementa la idea de investigador/redactor/revisor sin LangGraph: para Vercel el flujo es más chico y observable en TypeScript.

## Modelos por defecto (configurables)

- Gratis rápido: Gemini `gemini-3.5-flash-lite`.
- Gratis fuerte: Groq `openai/gpt-oss-120b`; fallback Gemini `gemini-3.8-flash`.
- Premium: Anthropic `claude-sonnet-5`.

Todos los IDs están en variables de entorno para poder cambiarlos sin tocar código.

## Ejecutar local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Vercel

1. Crear un repositorio nuevo y subir esta carpeta.
2. Importarlo en Vercel como proyecto Next.js.
3. En **Settings → Environment Variables**, agregar por lo menos una key: `GEMINI_API_KEY` o `GROQ_API_KEY`.
4. Para habilitar premium automático, agregar `ANTHROPIC_API_KEY`.
5. Deploy.

No hay claves en el navegador: todas las llamadas a proveedores salen de `/api/analyze` y `/api/generate`.

## Qué falta para V2

- Entrada directa desde Panorama con query string o POST firmado.
- Historial/versionado de notas.
- Login interno.
- Conector CMS.
- Fuente propia marcada como "información Olé".
- Presets determinísticos para previa/post de torneos.
- Guardar métricas del router: costo, modelo, revisión y tasa de aprobación.
