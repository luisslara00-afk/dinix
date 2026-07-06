# Dinix — Soluciones Tecnológicas

Sitio estático, mobile-first y listo para presentar servicios o publicar en Vercel. No requiere compilación ni dependencias.

## Ver el sitio localmente

Opción rápida: abre `index.html` directamente en tu navegador.

Opción recomendada con un servidor local:

```bash
npx serve .
```

Después abre la dirección que aparezca en la terminal, normalmente `http://localhost:3000`.

También puedes usar la extensión **Live Server** de Visual Studio Code.

## Publicar en Vercel

1. Sube esta carpeta a un repositorio de GitHub, GitLab o Bitbucket.
2. En Vercel elige **Add New → Project** e importa el repositorio.
3. Deja **Framework Preset** como `Other`.
4. No necesitas comando de build ni carpeta de salida.
5. Pulsa **Deploy**.

También puedes arrastrar la carpeta completa al panel de despliegue de Vercel o usar `vercel` desde la terminal.

## Reemplazar las imágenes

Las cinco imágenes de muestra están en `assets/images/`:

- `seguridad-local.webp`
- `punto-de-venta.webp`
- `wifi-negocio.webp`
- `acceso-inteligente.webp`
- `tecnologia-campo.webp`

La forma más sencilla es guardar cada foto nueva con el mismo nombre. Así no necesitas cambiar el HTML.

Si usas nombres distintos, abre `index.html`, busca `assets/images/` y cambia el valor de `src` correspondiente. Se recomiendan fotos horizontales en proporción 3:2, de al menos 1200 × 800 px. Usa JPG o WebP optimizado para que el sitio cargue rápido.

## Personalizar contacto

El teléfono y los enlaces de WhatsApp usan `523312472403`. Para reemplazarlos, busca ese número en `index.html` y sustitúyelo en todos los resultados. El número visible se encuentra como `33 1247 2403`.

## Archivos principales

- `index.html`: contenido y estructura.
- `styles.css`: colores, tipografía y diseño responsivo.
- `script.js`: menú móvil, animaciones suaves y año automático.
- `assets/images/`: fotografías de la galería.
