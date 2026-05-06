# IntelligenceHub — Production

Next.js 14 · PostgreSQL · Azure AD SSO · Azure App Service

## Quick Start

### 1. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Fill in DATABASE_URL, Azure AD credentials, ANTHROPIC_API_KEY, NEXTAUTH_SECRET
```

### 3. Set up Azure AD App Registration
- Go to Azure Portal → Azure Active Directory → App Registrations → New
- Redirect URI: `https://your-app.azurewebsites.net/api/auth/callback/microsoft-entra-id`
- Add API permission: `User.Read`
- Copy Client ID, Tenant ID, and create a Client Secret → paste into `.env.local`

### 4. Set up the database
```bash
npm run db:generate    # generate Prisma client
npm run db:push        # push schema to your PostgreSQL instance (dev)
npm run db:seed        # seed initial projects and documents
```

### 5. Run locally
```bash
npm run dev            # http://localhost:3000
```

## Deployment (Azure)

### Azure Resources needed
- **Azure App Service** (Node 20 Linux, or container)
- **Azure Database for PostgreSQL** (Flexible Server recommended)
- **Azure Container Registry** (if using Docker)

### GitHub Actions
Set these secrets in your GitHub repo:
- `ACR_USERNAME` / `ACR_PASSWORD` — Azure Container Registry credentials
- `AZURE_WEBAPP_PUBLISH_PROFILE` — download from Azure App Service → Get publish profile

Push to `main` → CI builds the Docker image, pushes to ACR, deploys to App Service.

### Environment Variables on Azure
Set these in App Service → Configuration → Application settings:
```
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
AZURE_AD_CLIENT_ID
AZURE_AD_CLIENT_SECRET
AZURE_AD_TENANT_ID
ANTHROPIC_API_KEY
```

## Project Structure
```
app/
  (dashboard)/       # All authenticated pages
    page.tsx         # Command Dashboard
    spark/           # Spark Innovation Challenge
    sdlc/            # SDLC 2.0 phases
    projects/        # Project tracker
    governance/      # Governance docs
  api/
    auth/            # NextAuth (Azure AD SSO)
    spark/ideas/     # Spark CRUD + voting
    chat/            # ZARA AI proxy (server-side Claude)
  login/             # Login page
components/
  shell/             # Sidebar + Topbar
  spark/             # IdeaCard, IdeaForm, VoteButton, SparkHeader
  chat/              # CopilotPanel (ZARA)
  ui/                # Button, Badge, Card
lib/
  auth.ts            # NextAuth config
  db.ts              # Prisma singleton
  ai.ts              # Claude API (server-side only)
  utils.ts           # Helpers, constants
prisma/
  schema.prisma      # Database schema
  seed.ts            # Initial data seed
```
