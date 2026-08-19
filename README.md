# Dinix — Soluciones Tecnológicas

Sitio comercial estático, mobile-first y compatible con Vercel. La navegación funciona como una experiencia de una sola página mediante rutas hash: el header y el footer permanecen, mientras cambia la vista central.

No requiere compilación, dependencias, variables de entorno ni backend para mostrar el contenido.

## Abrir localmente

Puedes abrir `index.html` directamente en Chrome. La página no usa módulos JavaScript, `fetch` ni rutas absolutas para sus recursos.

Para una prueba equivalente a Vercel:

```bash
python -m http.server 8765
```

Después abre `http://127.0.0.1:8765/index.html`.

## Vistas públicas

- `#inicio`
- `#soluciones`
- `#automatizacion`
- `#dinix-usa`
- `#nosotros`
- `#contacto`
- `#diagnostico`

Atrás/Adelante y los enlaces directos funcionan con estas rutas. Inicio permanece visible aunque JavaScript falle y existe un fallback `<noscript>` para evitar una página en blanco.

## Diseño aprobado de agosto de 2026

La implementación actual incluye:

- logo oficial Dinix en header y footer;
- fotografía aprobada de Laura operando un punto de venta;
- módulo “¿Qué necesita hoy tu negocio?” dentro de Soluciones;
- flujo principal de seis pasos de Automatización e IA;
- tabs interactivas de IA con navegación por teclado;
- nuevo enfoque de Dinix USA desde México y en español;
- tabs interactivas de Dinix USA con navegación por teclado;
- posters de Laura sin autoplay;
- diagrama de red local en Nosotros;
- contacto sin mostrar un nombre personal;
- redes con color controlado;
- diagnóstico claro y amable sobre fondo luminoso;
- escala final ajustada para 360, 390, 768, 1024 px y desktop.

## Assets aprobados

Los recursos activos están en `assets/images/`:

- `dinix-logo-orange.png`: archivo transparente oficial sin modificar.
- `dinix-logo-orange-trimmed.png`: mismo logo con el margen transparente recortado para la interfaz.
- `dinix-logo-orange-white.png`: versión oficial con fondo blanco.
- `dinix-hero-tienda.webp`: fotografía optimizada del hero.
- `laura-oficial.webp`: retrato optimizado y consistente de Laura.

La fotografía del hero se redujo a aproximadamente 226 KB y Laura a 60 KB. Los PNG originales entregados no se sobrescribieron.

## Videos pendientes

No se entregaron archivos finales de video. Los módulos de Laura en Nosotros y Dinix USA utilizan el poster oficial y abren un diálogo que informa claramente que el video está pendiente.

Cuando existan los videos:

1. colócalos en una carpeta como `assets/video/`;
2. sustituye el contenido informativo de los diálogos por un elemento `<video controls preload="none">`;
3. conserva el poster de Laura;
4. no agregues autoplay con sonido.

## WhatsApp y redes

El WhatsApp configurado es `523312472403` y se muestra como `33 1247 2403`.

Los canales adicionales se habilitan desde `SOCIAL_LINKS` al inicio de `script.js`:

```js
const SOCIAL_LINKS = {
  whatsappChannel: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  telegram: ''
};
```

Los canales sin URL real permanecen deshabilitados. No se inventan perfiles.

## Formularios y diagnóstico

El contacto y el diagnóstico preparan un mensaje para WhatsApp; no guardan datos en un servidor.

Los campos de audio y video permiten grabar o elegir un archivo local según las capacidades del dispositivo. El sitio muestra nombre y tamaño, permite reemplazarlo o eliminarlo y no lo sube ni lo almacena. La persona debe adjuntarlo manualmente en WhatsApp.

Un flujo futuro de transcripción, IA y CRM requerirá backend, almacenamiento seguro, consentimiento y políticas de privacidad definitivas. Esa arquitectura se conserva únicamente como documentación interna y no se muestra en la interfaz pública.

## Presentación interna

El modo vendedor se conserva sin exponer controles internos en la interfaz pública. Puede abrirse localmente con `?modo=vendedor#inicio` o alternarse con `Ctrl + Alt + P`; `Escape` lo cierra.

## Archivos principales

- `index.html`: estructura, contenido, SEO y componentes.
- `styles.css`: sistema visual y responsive.
- `script.js`: navegación, drawer, tabs, formularios y diálogos.
- `robots.txt` y `sitemap.xml`: rastreo y URL pública.
- `backup-before-final-polish-2026-08-17/`: respaldo anterior a la pasada final de diseño y UX.

## Publicar en Vercel

El sitio existente es `https://dinix.vercel.app/`. Esta intervención no creó otro proyecto ni realizó deploy.

Configuración esperada:

- Framework Preset: `Other`
- Build Command: vacío
- Output Directory: vacío
- Root Directory: carpeta que contiene `index.html`

Publica `index.html`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml` y `assets/images/`. Las carpetas de respaldo no son necesarias en producción.

## Revisión antes de publicar

1. Sustituir los placeholders cuando existan los videos oficiales.
2. Configurar las URLs reales de redes.
3. Revisar aviso de privacidad y términos con el texto legal definitivo.
4. Probar Inicio, IA, Dinix USA y el menú en celulares reales.
5. Confirmar recortes de Laura en distintas proporciones de pantalla.
6. Probar formularios sin enviar mensajes de prueba involuntarios.
7. Confirmar que el proyecto de Vercel apunta a esta carpeta.
