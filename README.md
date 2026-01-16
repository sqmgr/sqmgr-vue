# sqmgr-vue - The frontend for SqMGR

[![CI](https://github.com/sqmgr/sqmgr-vue/workflows/.github/workflows/workflow.yaml/badge.svg?branch=master)](https://github.com/sqmgr/sqmgr-vue/actions?query=workflow%3A.github%2Fworkflows%2Fworkflow.yaml)

SqMGR is a web application for managing football squares pools. This repository contains the Vue.js frontend that powers [sqmgr.com](https://sqmgr.com).

## Requirements

- Node.js 20+ (22 recommended)
- npm

## Getting Started

```bash
npm install      # install dependencies
npm run dev      # start development server on port 8080
```

## Project Structure

```
sqmgr-vue/
├── src/
│   ├── assets/          # Static assets (logos, styles)
│   ├── components/      # Vue components
│   ├── models/          # Data models and services
│   │   ├── authService.js       # Auth0 authentication
│   │   ├── sqmgrClient.js       # API client
│   │   └── accessTokenManager.js
│   ├── plugins/         # Vue plugins
│   │   └── auth.js      # Auth0 plugin
│   ├── utils/           # Utility functions
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── public/              # Static public assets
├── auth_config.json     # Auth0 configuration
└── vite.config.js       # Vite build configuration
```

## Scripts

Command | Description
--- | ---
`npm run dev` | Start Vite development server (port 8080)
`npm run build` | Production build
`npm run preview` | Preview production build locally
`npm run lint` | Run ESLint on src directory

## Configuration

### Environment Variables

Create a `.env` file for local development or `.env.production` for production:

Variable | Description | Default
--- | --- | ---
`VITE_API_URL` | Backend API URL | `http://localhost:5001`

### Auth0 Configuration

Auth0 settings are in `auth_config.json`:

```json
{
  "domain": "sqmgr.auth0.com",
  "clientId": "your-client-id",
  "audience": "api.sqmgr.com"
}
```

## Technology Stack

- **Vue** 3.5 with Composition API
- **Vite** 7.x for build tooling
- **Vue Router** 4.x for routing
- **Vuex** 4.x for state management
- **Auth0 SPA SDK** for authentication
- **SCSS** for styling

## Features

- **Progressive Web App (PWA)** - Installable on mobile and desktop with offline support
- **Auth0 Integration** - OAuth/OIDC authentication
- **Guest Accounts** - Join pools without creating an account
- **Drag and Drop** - Reorder grids with vuedraggable
- **Responsive Design** - Works on all screen sizes

## Key Routes

Path | Description
--- | ---
`/` | Home page
`/login` | Authentication
`/account` | User account (authenticated)
`/create` | Create new pool (authenticated)
`/pool/:token` | View pool
`/pool/:token/join` | Join pool via invite
`/pool/:token/game/:gridId` | Game grid view
`/guest-account` | Guest pool management

## Docker

Build the Docker image:

```bash
docker build \
  --build-arg API_URL=https://api.sqmgr.com \
  --build-arg APP_VERSION=1.0.0 \
  -t sqmgr-vue .
```

The image uses Nginx to serve the built application.

## CI/CD

GitHub Actions workflow runs on all PRs and pushes to master:

1. **Test** - Lint and build validation (Node 20)
2. **Build** - Docker image build and push to GHCR
3. **Deploy** - Kubernetes deployment (manual/tag trigger)

## License

Apache License 2.0 - See [LICENSE](LICENSE) for details.
