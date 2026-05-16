# typo

This repository was built for a **university course**, putting **Domain-Driven Design (DDD)** into practice in a real app. The goal was to keep the core vocabulary and rules of the product in one place, and push framework and API details toward the edges.

The app is an **Expo / React Native** client. TypeScript path aliases (see `tsconfig.json`) mirror how the layers depend on each other.

## Layers

### Domain (`src/domain`)

The **domain model**: entities and related types that describe the problem space (for example `User`, `Photo`, `Language`, `Location`, `University`). This layer is meant to stay free of UI, HTTP, and Firebase specifics so the language of the app stays stable when those details change.

### Application (`src/services`)

**Application services** coordinate workflows: sign-up, matches, chat, photos, and so on. They call infrastructure where needed and work with **DTOs** (for example under `src/services/userService/`) at the boundary between raw API/storage shapes and the domain. Think of this layer as “what the app does” in use-case sized steps.

### Infrastructure (`src/services/infra`)

**Adapters** to external systems: **Firebase** (auth, Firestore, notifications) and **Axios**-backed HTTP helpers. Converters (for example Firestore `converter<T>` types) translate between persistence payloads and domain-friendly objects.

### Presentation (`src/screens`, `src/components`, `src/context`)

**UI and app shell**: navigation, screens, reusable components, and React context for session-like state. This layer should orchestrate the user experience and delegate behavior to the application layer rather than re-embedding domain rules everywhere.

---

## Running locally

```bash
npm install
npm start
```

Use `npm run android`, `npm run ios`, or `npm run web` as needed. Tests: `npm test`.
