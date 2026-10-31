# X Clone

Clon de X (Twitter) construido como SPA con React, TypeScript y Vite. Permite registrarse, iniciar sesión, publicar tweets, seguir usuarios y ver un feed.

**Estado:** Milestone 1 (maquetación y construcción de la SPA). Los datos son simulados (mock); Firebase se integrará en las siguientes entregas.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación y ejecución

```bash
npm install --legacy-peer-deps
npm run dev
```

La app queda en `http://localhost:5173`. Para el login funciona cualquier usuario y contraseña no vacíos.

Variables de entorno (para Firebase, más adelante): copia `.env.example` a `.env` y completa los valores. `.env` no se sube al repositorio.

## Estructura de carpetas

```
src/
├── main.tsx, XCloneApp.tsx, index.css
├── auth/            contexts/ (AuthContext, AuthProvider, useAuth), reducers/, types/, pages/
├── social/          SocialContext, SocialProvider, useSocial
├── types/           social.ts (Tweet, UserProfile)
├── data/            mockData.ts
├── firebase/        config.ts, providers.ts (Milestone 2)
├── helpers/         paginate.ts, formatDate.ts
├── pages/           Home, Compose, Feed, Following, Followers, UserTweets
├── routes/          BaseRouter, ProtectedRoute, PublicRoute
└── ui/components/   NavBar, TweetCard, UserCard, Pagination
```

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/login`, `/register` | Login, Registro | Pública |
| `/` | Inicio | Protegida |
| `/compose` | Publicar tweet | Protegida |
| `/feed` | Feed | Protegida |
| `/following`, `/followers` | Seguidos, Seguidores | Protegida |
| `/users/:username` | Tweets de un usuario | Protegida |

## Estrategia de ramas

Ver [`docs/branches.md`](./docs/branches.md): `main` (estable), `develop` (integración) y `feature/<nombre>` (una por funcionalidad).
