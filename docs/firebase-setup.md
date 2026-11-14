# Configuración de Firebase

1. **Authentication → Sign-in method**: activar **Correo electrónico/contraseña** y **Google**.
   El nombre de usuario no es un método de Firebase: se guarda en Firestore y se traduce al correo al iniciar sesión.
2. **Firestore Database**: crear la base de datos y pegar `docs/firestore.rules` en la pestaña Reglas.
3. Copiar `.env.example` a `.env` y completar los valores (`.env` no se sube a git).
4. Las fotos, GIFs y videos no usan Firebase Storage: ver `docs/cloudinary-setup.md`.
5. `npm install firebase --legacy-peer-deps` y reiniciar `npm run dev`.

## Colecciones

| Colección | Documento | Campos |
|---|---|---|
| `users` | `{uid}` | fullName, username, email, createdAt |
| `usernames` | `{username normalizado}` | uid, email |
| `tweets` | automático | authorId, authorUsername, authorFullName, text, media[], createdAt |
| `follows` | `{followerId}_{followedId}` | followerId, followedId, createdAt |

`media[]` guarda, por cada adjunto: `url`, `type` (`image` o `video`) y `path` (el `public_id` de Cloudinary).

## Limitación conocida

Para iniciar sesión con nombre de usuario, `usernames` guarda el correo y se puede leer sin sesión. Es suficiente para el curso; en producción esa búsqueda se haría con una Cloud Function.
