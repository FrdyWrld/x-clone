# Fotos, GIFs y videos con Cloudinary

Los archivos de los tweets se suben a Cloudinary (plan gratuito, sin tarjeta). En Firestore solo se guarda el enlace de cada archivo.

## Configuración

1. Crear una cuenta en https://cloudinary.com (plan Free).
2. En el panel (Dashboard), copiar el **Cloud name**.
3. **Settings → Upload → Upload presets → Add upload preset**:
   - **Signing mode: Unsigned** (obligatorio, porque la subida se hace desde el navegador).
   - Nombre, por ejemplo `tu_cloud_name`.
   - **Folder**: `x-clone/tweets` (opcional, ordena los archivos).
   - Si la cuenta lo permite, limitar los formatos permitidos a `jpg, png, gif, webp, mp4, webm, mov`.
4. Agregar al `.env` (y a `.env.example`, sin valores):

```
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_cloud_name
```

5. Reiniciar `npm run dev` (Vite solo lee el `.env` al arrancar).

## Cómo funciona

- `src/services/cloudinary.ts` envía cada archivo a `https://api.cloudinary.com/v1_1/{cloud}/auto/upload` con el preset. `auto` detecta si es imagen (los GIF también) o video.
- La respuesta trae `secure_url` y `public_id`; el tweet guarda `{ url, type, path }` en el campo `media`.
- Límites de la app: hasta 4 imágenes (5 MB c/u) o 1 video (25 MB), pero no ambos.

## Limitaciones conocidas

- El cloud name y el preset viajan en el código del navegador (son públicos). Por eso el preset debe ser el único permitido para subir y conviene limitar sus formatos.
- Con una subida sin firma no se pueden borrar archivos desde la app: si guardar el tweet falla después de subir, el archivo queda huérfano en Cloudinary (se limpia a mano desde su panel).
- Algunos navegadores no reproducen `.mov`; MP4 y WebM funcionan en todos los modernos.
