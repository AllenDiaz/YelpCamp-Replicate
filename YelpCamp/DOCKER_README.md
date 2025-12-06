# YelpCamp Docker Setup

This guide explains how to run the YelpCamp application using Docker with both frontend and backend services.

## Prerequisites

- Docker Desktop installed on your machine
- Docker Compose (included with Docker Desktop)

## Architecture

The application consists of three main services:

1. **MongoDB** - Database service (Port 27017)
2. **Backend** - Express.js API (Port 3000)
3. **Frontend** - Next.js application (Port 3001)

## Quick Start

### 1. Environment Configuration

Copy the example environment file and configure it with your credentials:

```bash
cp .env.example .env
```

Edit the `.env` file and add your actual values for:
- `SECRET` - Application secret key
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_KEY` - Your Cloudinary API key
- `CLOUDINARY_SECRET` - Your Cloudinary API secret
- `MAPTILER_API_KEY` - Your MapTiler API key

### 2. Build and Start All Services

From the root directory (YelpCamp/), run:

```bash
docker-compose up --build
```

This will:
- Build the backend Docker image
- Build the frontend Docker image
- Pull the MongoDB image
- Start all three services
- Set up networking between services

### 3. Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

### 4. Stop the Services

Press `Ctrl+C` in the terminal, then run:

```bash
docker-compose down
```

To also remove volumes (database data):

```bash
docker-compose down -v
```

## Docker Commands

### Build specific service
```bash
docker-compose build backend
docker-compose build frontend
```

### Start services in detached mode (background)
```bash
docker-compose up -d
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Restart a service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Execute commands in a container
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Check service status
```bash
docker-compose ps
```

## Development Mode

For development with hot reload, you can modify the docker-compose.yml to mount source directories as volumes. The current setup already includes volume mounts for the backend.

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error, modify the ports in `docker-compose.yml`:

```yaml
ports:
  - "3002:3000"  # Change host port (left side)
```

### Database Connection Issues
- Ensure MongoDB service is healthy: `docker-compose ps`
- Check MongoDB logs: `docker-compose logs mongodb`
- Verify DB_URL in backend environment variables

### Frontend Can't Connect to Backend
- The frontend uses `http://backend:3000` internally (Docker network)
- For browser requests, use `http://localhost:3000`

### Rebuild After Changes
After changing Dockerfile or dependencies:

```bash
docker-compose up --build
```

### Clean Everything
Remove all containers, networks, and volumes:

```bash
docker-compose down -v
docker system prune -a
```

## Production Deployment

For production:
1. Use proper secrets management (not .env files)
2. Set `NODE_ENV=production`
3. Use reverse proxy (nginx) for SSL/TLS
4. Configure proper logging and monitoring
5. Set up backup strategy for MongoDB data
6. Use Docker secrets or environment variables from your hosting provider

## Network Configuration

All services communicate through a custom bridge network called `yelpcamp-network`. This allows:
- Service discovery by name (e.g., `mongodb`, `backend`)
- Isolated network environment
- Secure inter-service communication

## Data Persistence

MongoDB data is persisted using Docker volumes:
- Volume name: `mongodb_data`
- Data location: `/data/db` in the container
- Survives container restarts and removals (unless explicitly deleted)
