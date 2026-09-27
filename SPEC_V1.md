# Especificación funcional · V1

## Objetivo
Convertir una señal periodística en una nota deportiva lista para revisión editorial, minimizando invenciones y reservando el modelo premium para casos que realmente lo justifiquen.

## Disparador principal
Una caja única: **¿Qué pasó?**

Acepta:
- noticia o cable pegado;
- declaración;
- resultado final;
- previa de partido;
- novedad de mercado;
- comunicado;
- actualización de una nota existente;
- idea de análisis.

Opcionalmente, el editor agrega contexto propio y hasta seis URLs.

## Tipos reconocidos
- breaking
- noticia
- declaraciones
- mercado
- previa
- post partido
- actualización
- análisis

## Mesa editorial
Antes de redactar muestra:
- historia detectada;
- hechos confirmados;
- preguntas abiertas;
- cautelas editoriales;
- protagonistas;
- sección y tags;
- tres enfoques posibles;
- riesgo;
- complejidad 0–10;
- tier de modelo sugerido.

## Router de modelos
- 0–2: gratis rápido.
- 3–5: gratis fuerte.
- 6–10: premium.

El editor puede forzar cualquier tier desde la interfaz.

### Señales de complejidad
Suben el score:
- fuentes múltiples o contradictorias;
- información incierta;
- mercado sin confirmación oficial;
- análisis o enfoque original;
- material largo;
- actualización de una pieza previa;
- necesidad de distinguir versiones y hechos.

## Redacción
La salida estándar contiene:
- Título.
- Bajada.
- Cuerpo.
- Sección.
- Tags.
- Tres títulos alternativos: Directo, SEO y Más periodístico.
- Score y observaciones para cada título.

## Revisión
Un modelo independiente contrasta el borrador contra la Mesa.

Rechaza si encuentra:
- afirmaciones no respaldadas;
- cifras, nombres o fechas alterados;
- rumor transformado en confirmación;
- título que promete más de lo probado;
- confusión de etapas de una transferencia;
- reiteración fuerte entre título y bajada.

Si rechaza, hay una sola reescritura automática. No se arma un bucle infinito.

## Principios de estilo
- Español argentino.
- Directo, ágil y deportivo.
- La novedad abre la nota.
- Arco, travesaño, DT, plantel, Selección.
- Sin frases vacías típicas de IA.
- Claridad antes que ingenio.
- Atribución explícita cuando la información no está confirmada.
- No completar con conocimiento reciente no provisto en la Mesa.

## Diseño
La V1 deja atrás el formato de dashboard de Panorama. La estética es de mesa/editor:
- fondo papel;
- tipografía editorial serif para títulos y texto largo;
- tipografía sans para controles;
- negro + verde ácido como acento;
- mucho espacio y bloques de control visibles;
- mobile responsive.

## Integración con Panorama · siguiente paso
Panorama podrá enviar:
- título/historia detectada;
- medios que la publicaron;
- URLs;
- si Olé ya tiene o no la historia;
- señales de tapa/tendencia.

La Mesa se abrirá ya precargada y el periodista sólo elegirá el enfoque.
