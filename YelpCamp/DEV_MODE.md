# YelpCamp Development Mode

## Development vs Production

### Production Mode (default)
- Uses `docker-compose.yml`
- Builds static images with code baked in
- Requires rebuild for every code change
- Optimized for deployment

### Development Mode (with hot reload)
- Uses `docker-compose.yml` + `docker-compose.dev.yml`
- Mounts local code into containers
- Changes reflect immediately without rebuild
- Nodemon for backend, Next.js dev server for frontend

## Quick Start - Development Mode

### Start development environment:
```powershell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Rebuild if dependencies change:
```powershell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Stop containers:
```powershell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```

## What's Different in Dev Mode?

1. **Volume Mounts**: Your local code is mounted into containers
   - Frontend: `./yelpcamp-frontend:/app`
   - Backend: `./yelpcamp-backend:/app`

2. **Hot Reload Enabled**:
   - Frontend: Next.js dev server watches for changes
   - Backend: Nodemon restarts on file changes

3. **No Build Step**: Code runs directly from source

## Production Mode

For production deployment or testing:
```powershell
docker-compose up --build
```

## Troubleshooting

### Changes not showing?
- Make sure you're using the dev compose file
- Check volume mounts are working: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml config`

### Port conflicts?
- Stop production containers first: `docker-compose down`

### Need clean slate?
```powershell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```
