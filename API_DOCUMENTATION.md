# YelpCamp API Documentation

## Overview

The YelpCamp API provides a comprehensive RESTful interface for managing campgrounds, reviews, and user authentication. The API uses JWT (JSON Web Tokens) for authentication and follows OpenAPI 3.0 specification.

## Base URL

- **Development**: `http://localhost:3000`
- **All API endpoints**: Prefixed with `/api`

## Interactive Documentation

Access the interactive Swagger UI documentation at:

```
http://localhost:3000/api-docs
```

The Swagger UI provides:
- Interactive API testing
- Request/response examples
- Schema definitions
- Authentication testing

## Authentication

The API uses Bearer Token (JWT) authentication for protected endpoints.

### Headers

```
Authorization: Bearer <your_jwt_token>
```

### Obtaining a Token

1. Register a new user or login
2. The response will include a JWT token
3. Store the token in localStorage or secure storage
4. Include it in the Authorization header for protected endpoints

## API Structure

### Route Prefix Change

**Important**: All API routes now use the `/api` prefix:

- Authentication: `/api/users/*`
- Campgrounds: `/api/campgrounds/*`
- Reviews: `/api/campgrounds/:id/reviews/*`

### Frontend Configuration

The frontend API client (`lib/api.ts`) has been updated to use the new `/api` prefix. All requests automatically include:
- JWT token in Authorization header
- Proper Content-Type headers
- Error handling for 401 Unauthorized

## API Endpoints Summary

### Authentication (`/api/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/users/register` | No | Register new user |
| POST | `/api/users/login` | No | Login user |
| POST | `/api/users/logout` | Yes | Logout user |
| GET | `/api/users/me` | Yes | Get current user |

### Campgrounds (`/api/campgrounds`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/campgrounds` | No | Get all campgrounds |
| POST | `/api/campgrounds` | Yes | Create campground |
| GET | `/api/campgrounds/:id` | No | Get campground details |
| PUT | `/api/campgrounds/:id` | Yes | Update campground |
| DELETE | `/api/campgrounds/:id` | Yes | Delete campground |

### Reviews (`/api/campgrounds/:id/reviews`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/campgrounds/:id/reviews` | Yes | Create review |
| DELETE | `/api/campgrounds/:id/reviews/:reviewId` | Yes | Delete review |

## Example Requests

### Register User

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

### Get All Campgrounds

```bash
curl -X GET http://localhost:3000/api/campgrounds
```

### Create Campground (with JWT)

```bash
curl -X POST http://localhost:3000/api/campgrounds \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "campground[title]=Mountain View" \
  -F "campground[location]=Yosemite, CA" \
  -F "campground[price]=25.99" \
  -F "campground[description]=Beautiful views" \
  -F "image=@/path/to/image.jpg"
```

### Create Review (with JWT)

```bash
curl -X POST http://localhost:3000/api/campgrounds/CAMPGROUND_ID/reviews \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "review": {
      "body": "Amazing campground!",
      "rating": 5
    }
  }'
```

## Data Schemas

### User Schema

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "username": "johndoe"
}
```

### Campground Schema

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Mountain View Campground",
  "images": [
    {
      "url": "https://res.cloudinary.com/...",
      "filename": "image123"
    }
  ],
  "geometry": {
    "type": "Point",
    "coordinates": [-122.4194, 37.7749]
  },
  "price": 25.99,
  "description": "Beautiful mountain views",
  "location": "Yosemite National Park, CA",
  "author": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe"
  },
  "reviews": [...]
}
```

### Review Schema

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "body": "Great campground!",
  "rating": 5,
  "author": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe"
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "statusCode": 400
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (not logged in or invalid token)
- `403` - Forbidden (not authorized to perform action)
- `404` - Not Found
- `500` - Internal Server Error

## Testing the API

### Using Swagger UI

1. Start the backend: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up backend`
2. Open browser: `http://localhost:3000/api-docs`
3. Click "Authorize" button
4. Login/Register to get JWT token
5. Paste token in Authorization dialog
6. Test any endpoint interactively

### Using Postman

1. Import the OpenAPI spec from `http://localhost:3000/api-docs.json`
2. Set up environment variables:
   - `baseUrl`: `http://localhost:3000`
   - `token`: Your JWT token
3. Use `{{baseUrl}}` and `{{token}}` in requests

### Using cURL

See example requests above. Replace `YOUR_JWT_TOKEN` with actual token from login response.

## Development Notes

### CORS Configuration

The backend allows requests from the frontend URL configured in `.env`:

```
FRONTEND_URL=http://localhost:3001
```

### Image Uploads

- Campground images are uploaded to Cloudinary
- Uses multipart/form-data encoding
- Field name: `image` (accepts multiple files)
- SSL certificate validation disabled in development mode

### Validation

- Request validation using Joi schemas
- MongoDB sanitization enabled
- Helmet security headers applied

## Migration from Old Routes

If you have existing code using old routes, update as follows:

| Old Route | New Route |
|-----------|-----------|
| `/register` | `/api/users/register` |
| `/login` | `/api/users/login` |
| `/campgrounds` | `/api/campgrounds` |
| `/campgrounds/:id/reviews` | `/api/campgrounds/:id/reviews` |

The frontend `lib/api.ts` has been automatically updated with these changes.

## Support

For issues or questions:
- Check the Swagger UI documentation
- Review this guide
- Check console logs for detailed error messages
