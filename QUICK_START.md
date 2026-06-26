# 🚀 YelpCamp Quick Start Guide

Get YelpCamp running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Docker Desktop running (for backend)
- Git

---

## Step 1: Environment Setup

### Backend Environment
Create `yelpcamp-backend/.env`:
```env
PORT=3000
DATABASE_URL=mongodb://mongodb:27017/yelp-camp
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
MAPTILER_API_KEY=your_maptiler_key
JWT_SECRET=mysupersecretjwtkey123
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3001
```

### Frontend Environment
Create `yelpcamp-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_api_key
```

> **Note:** Get free MapTiler API key at https://cloud.maptiler.com

---

## Step 2: Start Backend (Terminal 1)

```bash
cd yelpcamp-backend
docker-compose up
```

Wait for:
```
✓ MongoDB connected
✓ Server listening on port 3000
```

---

## Step 3: Start Frontend (Terminal 2)

```bash
cd yelpcamp-frontend
npm install
npm run dev
```

Wait for:
```
✓ Ready on http://localhost:3001
```

---

## Step 4: Open Browser

Navigate to: **http://localhost:3001**

---

## 🎉 You're Ready!

### Test the App:

1. **Register Account:**
   - Click "Register" in navbar
   - Create username, email, password
   - You'll be logged in automatically

2. **Create Campground:**
   - Click "New" in navbar
   - Fill in details
   - Upload images (optional)
   - Submit

3. **View Campgrounds:**
   - Click "Campgrounds" in navbar
   - See cluster map
   - Click on campground to view details

4. **Leave Review:**
   - Open any campground
   - Rate with stars
   - Write review
   - Submit

---

## 🔧 Troubleshooting

### Backend won't start?
- Check if MongoDB container is running: `docker ps`
- Check if port 3000 is free: `netstat -ano | findstr :3000`
- View logs: `docker-compose logs -f`

### Frontend build errors?
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Check Node version: `node -v` (should be 18+)

### Maps not showing?
- Verify MapTiler API key in `.env.local`
- Check browser console for errors
- Free tier: https://cloud.maptiler.com

### 401 Unauthorized errors?
- Check JWT_SECRET is set in backend `.env`
- Try logging out and back in
- Clear localStorage in browser DevTools

---

## 📝 Default Accounts (for testing)

If you seed the database:
```bash
cd yelpcamp-backend/seeds
node index.js
```

This creates sample campgrounds (no default users - register your own).

---

## 🛑 Stopping the App

**Backend:**
```bash
# In backend terminal
Ctrl + C
docker-compose down
```

**Frontend:**
```bash
# In frontend terminal
Ctrl + C
```

---

## 📚 Next Steps

- Read `MIGRATION_SUMMARY.md` for full architecture details
- Check `yelpcamp-frontend/README.md` for frontend docs
- Explore API endpoints in `yelpcamp-backend/README.md`

---

## 💡 Pro Tips

1. **Keep terminals open:** You need both backend and frontend running
2. **Use different ports:** Backend (3000), Frontend (3001)
3. **Check CORS:** Backend allows `http://localhost:3001`
4. **JWT tokens:** Stored in localStorage (expires in 7 days)
5. **Hot reload:** Both backend and frontend support live reloading

---

## 🆘 Need Help?

Check these files:
- `MIGRATION_SUMMARY.md` - Full migration details
- `yelpcamp-frontend/README.md` - Frontend documentation
- `yelpcamp-backend/README.md` - Backend API reference

Happy camping! 🏕️
