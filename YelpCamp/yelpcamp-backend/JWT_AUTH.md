# JWT Authentication Migration

This document describes the JWT-based authentication system that replaced the previous session-based Passport.js authentication.

## Overview

The backend now uses **stateless JWT (JSON Web Token)** authentication instead of server-side sessions. This is more suitable for a decoupled API + Next.js frontend architecture.

## Changes Made

### 1. **Installed Packages**
- `jsonwebtoken` - For creating and verifying JWTs
- `bcryptjs` - For password hashing
- `http-errors` - For standardized error handling

### 2. **Removed Packages** (can be uninstalled)
- `passport` - No longer needed
- `passport-local` - No longer needed
- `passport-local-mongoose` - No longer needed
- `express-session` - No longer needed
- `connect-mongo` - No longer needed
- `connect-flash` - No longer needed

### 3. **Updated User Model** (`models/user.js`)
- Added `username` and `password` fields
- Implemented password hashing with bcrypt (pre-save hook)
- Added `comparePassword()` method for login
- Added `toJSON()` method to exclude password from responses

### 4. **Created JWT Utilities** (`utils/jwt.js`)
- `generateToken(user)` - Creates JWT token with user data
- `verifyToken(token)` - Verifies and decodes JWT token

### 5. **Updated Authentication Middleware** (`middleware.js`)
- `isLoggedIn` now:
  - Extracts token from `Authorization: Bearer <token>` header
  - Verifies the token
  - Attaches user object to `req.user`
  - Returns 401 error if token is invalid/missing

### 6. **Updated Controllers** (`controllers/users.js`)
- **Register**: Creates user, hashes password, returns JWT token
- **Login**: Validates credentials, returns JWT token
- **Logout**: Returns success message (client removes token)
- **getCurrentUser**: Returns authenticated user data

### 7. **Updated Routes** (`routes/users.js`)
- `POST /register` - Register new user
- `POST /login` - Login and get token
- `POST /logout` - Logout (client-side token removal)
- `GET /me` - Get current user (requires authentication)

### 8. **Updated App Configuration** (`app.js`)
- Removed session configuration
- Removed Passport.js configuration
- Kept CORS for frontend communication

## API Usage

### Registration
```http
POST /register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Login
```http
POST /login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Protected Routes
For any protected route, include the JWT token in the Authorization header:

```http
GET /campgrounds
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Get Current User
```http
GET /me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

## Environment Variables

Update your `.env` file:

```env
# JWT Configuration
JWT_SECRET=yoursupersecretjwtkey
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```

## Frontend Integration

### Storing the Token
When the user logs in or registers, store the token:

```javascript
// After successful login/register
localStorage.setItem('token', response.token);
// or
sessionStorage.setItem('token', response.token);
```

### Sending Authenticated Requests
Include the token in all authenticated requests:

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:3000/campgrounds', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Logout
Simply remove the token:

```javascript
localStorage.removeItem('token');
```

## Security Considerations

1. **Token Expiration**: Tokens expire after 7 days (configurable via `JWT_EXPIRE`)
2. **HTTPS**: Use HTTPS in production to protect tokens in transit
3. **Token Storage**: Store tokens securely (localStorage or httpOnly cookies)
4. **Password Security**: Passwords are hashed with bcrypt (12 salt rounds)
5. **Token Refresh**: Consider implementing refresh tokens for long sessions

## Migration Notes

### Existing Users
- Users created with the old Passport.js system will need to be migrated or re-registered
- Passwords are stored differently (bcrypt vs passport-local-mongoose)

### Database Changes
- User schema now includes `username` and `password` fields
- Old user documents may need migration

## Benefits of JWT

1. **Stateless**: No server-side session storage required
2. **Scalable**: Easy to scale horizontally (no session affinity needed)
3. **Cross-Origin**: Works perfectly with separate frontend/backend
4. **Mobile-Friendly**: Easy to use in mobile apps
5. **Decoupled**: Frontend and backend are completely independent

## Testing

Test authentication with curl:

```bash
# Register
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password123"}'

# Access protected route
curl http://localhost:3000/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
