# YelpCamp Docker Setup

This project is dockerized with MongoDB running in a separate container.

## Prerequisites

- Docker Desktop installed on your machine
- Your Cloudinary and MapTiler API credentials

## Setup Instructions

1. **Create your .env file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file with your actual credentials:**
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_KEY
   - CLOUDINARY_SECRET
   - MAPTILER_API_KEY
   - SECRET (change to a secure random string)

3. **Build and start the containers:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - App: http://localhost:3000
   - MongoDB: localhost:27017

## Useful Commands

### Start containers (detached mode):
```bash
docker-compose up -d
```

### Stop containers:
```bash
docker-compose down
```

### Stop containers and remove volumes (deletes database):
```bash
docker-compose down -v
```

### View logs:
```bash
docker-compose logs -f
```

### View app logs only:
```bash
docker-compose logs -f app
```

### Rebuild after code changes:
```bash
docker-compose up --build
```

### Access MongoDB shell:
```bash
docker exec -it yelpcamp-mongodb mongosh -u admin -p password123 --authenticationDatabase admin
```

### Seed the database:
```bash
docker exec -it yelpcamp-app node seeds/index.js
```

## MongoDB Credentials

- Username: admin
- Password: password123
- Database: yelp-camp

**Note:** Change these credentials in `docker-compose.yml` for production use!

## Troubleshooting

### Port already in use:
If port 3000 or 27017 is already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Database connection issues:
Make sure the MongoDB container is fully started before the app connects. The app will automatically retry the connection.

### Clear and restart:
```bash
docker-compose down -v
docker-compose up --build
```
