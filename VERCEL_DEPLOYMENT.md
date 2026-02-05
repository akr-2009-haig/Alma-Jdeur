# Vercel Deployment Guide

## نظام سجل الجراحة العامة - مستشفى جامعة بني سويف
## General Surgery Registry System - Beni-Suef University Hospital

This guide explains how to deploy the application on Vercel.

## Prerequisites

- Vercel account
- PostgreSQL database (you can use Vercel Postgres or any other provider)

## Required Environment Variables

Set the following environment variables in your Vercel project settings:

### Database
- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://user:password@host:5432/dbname`)
  - **Important**: Use Vercel Postgres or ensure your database accepts connections from Vercel's IP addresses

### Session (Required)
- `SESSION_SECRET` - A random secret string for session encryption
  - Generate one with: `openssl rand -base64 32`
  - Or use: https://generate-secret.vercel.app/32

### Application
- `NODE_ENV` - Automatically set to `production` by Vercel (no need to configure)
- `PORT` - Automatically set by Vercel (no need to configure)

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the project settings

### 2. Configure Build Settings

The project includes a `vercel.json` file that configures:
- Build command: `npm run vercel-build` (which runs `npm run build`)
- Serverless function entry: `server/vercel.ts`
- Static files directory: `dist/public/`
- Routes: All requests are routed to the serverless function which handles both API and static files

**Build Configuration:**
- Framework Preset: Other (custom configuration)
- Build Command: `npm run vercel-build` (automatically detected)
- Output Directory: Auto-detected from vercel.json
- Install Command: `npm install` (default)

### 3. Add Environment Variables

1. In your Vercel project settings, go to "Environment Variables"
2. Add the required variables listed above
3. Make sure to add them for Production, Preview, and Development environments

### 4. Deploy

1. Click "Deploy"
2. Vercel will:
   - Install dependencies
   - Run the build script
   - Deploy the serverless function
   - Serve static files from the CDN

### 5. Initialize Database

After deployment, you need to initialize your database:

1. Set up a PostgreSQL database (Vercel Postgres recommended)
2. Get the connection string
3. Add it to environment variables
4. Run database migrations using Vercel CLI or your database provider

## Deployment Architecture

- **Frontend**: React SPA served as static files from `/dist/public`
- **Backend**: Express server running as Vercel serverless function
- **Database**: PostgreSQL (external)
- **Session Storage**: In-memory (for production, consider using a persistent store)

## Important Notes

1. **Database Connection**: Make sure your PostgreSQL database is accessible from Vercel's servers
2. **Session Storage**: The current implementation uses in-memory session storage (`memorystore`). For production on Vercel with multiple serverless instances:
   - Consider using `connect-pg-simple` (already installed) to store sessions in PostgreSQL
   - Or use an external session store like Redis
   - In-memory sessions will work but may cause users to be logged out when serverless functions scale
3. **Build Time**: Initial build may take 2-3 minutes
4. **Cold Starts**: Serverless functions may have cold start delays on first request
5. **Database Migrations**: Run `npm run db:push` locally or from Vercel CLI to initialize/update the database schema

## Session Store Configuration (Recommended for Production)

To use PostgreSQL-backed sessions instead of in-memory storage:

1. Update `server/routes.ts` to use `connect-pg-simple`:

```typescript
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import pg from 'pg';

const PgSession = connectPgSimple(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(session({
  store: new PgSession({
    pool: pgPool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));
```

2. Create the session table in your database (connect-pg-simple will do this automatically)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues
- Verify DATABASE_URL is correctly set
- Check if database allows connections from Vercel's IP ranges
- Test connection string locally first

### 404 Errors
- Check `vercel.json` routing configuration
- Verify files are built in `dist/` directory
- Check deployment logs

## Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build locally
npm start
```

## Support

For issues specific to Vercel deployment, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
