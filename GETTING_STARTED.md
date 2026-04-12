# LawConnect - Getting Started in 10 Minutes

> **Motto:** One Click Can Make a Difference

## 📋 Prerequisites (Install First)

1. **Docker Desktop** - https://www.docker.com/products/docker-desktop
   - Required for running MySQL, PHP backend, and PhpMyAdmin
   
2. **VS Code** (Optional but recommended) - https://code.visualstudio.com/
   - Or any code editor of your choice

3. **Git** - For cloning and version control

---

## ⚡ Quick Start (5 Steps)

### Step 1: Clone & Navigate
```bash
git clone <your-repo-url>
cd LawConnect
```

### Step 2: Start Docker Containers
```bash
docker compose up -d --build
```
This starts:
- Laravel backend on http://localhost:8000 ✅
- React frontend builder (you'll start dev server manually)
- MySQL database on port 3307
- PhpMyAdmin on http://localhost:8080

### Step 3: Setup Backend
```bash
# Generate Laravel app key
docker compose exec app php artisan key:generate

# Run database migrations and seeders
docker compose exec app php artisan migrate --force
docker compose exec app php artisan db:seed
```

### Step 4: Setup Frontend & Google Maps
```bash
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Google Maps API Key
# VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
# (See "Get Google Maps API Key" section below)

# Start development server
npm run dev
```

### Step 5: Access the Application
```
Frontend:    http://localhost:5173
Backend API: http://localhost:8000
DB Admin:    http://localhost:8080 (Username: root, Password: root123)
```

---

## 🗺️ Get Google Maps API Key (2 Minutes)

1. **Visit:** https://console.cloud.google.com
2. **Create Project:**
   - Click "Select a Project" → "New Project"
   - Name: `LawConnect`
   - Click "Create"
3. **Enable APIs:**
   - Search for "Maps JavaScript API" → Enable
   - Search for "Geocoding API" → Enable
   - Search for "Places API" → Enable
4. **Create API Key:**
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the key
5. **Add Restrictions (Security):**
   - Click the key
   - Under "Key restrictions" → "HTTP referrers (web sites)"
   - Add: `localhost:5173` (development)
6. **Paste into `.env`:**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

---

## 🧪 Verify Everything Works

### ✅ Backend Health Check
```bash
curl http://localhost:8000/api/health
```
Should return: `{"ok":true}`

### ✅ Frontend Loads
Visit: http://localhost:5173 in your browser

### ✅ Login Works
1. Create account at http://localhost:5173/register
2. Verify email (check terminal for dev email output)
3. Login at http://localhost:5173/login

### ✅ Maps Work
1. After login, click "Submit Report"
2. Click "📍 Select on Map"
3. Map should load with Google branding
4. Search for address or click on map

---

## 📊 Default Credentials

| Component | Username | Password |
|-----------|----------|----------|
| MySQL | root | root123 |
| PhpMyAdmin | root | root123 |
| Admin User (if seeded) | admin@lawconnect.com | password |

**Access PhpMyAdmin:**
http://localhost:8080

---

## 🚀 First Run Checklist

- [ ] Docker containers running (`docker compose ps`)
- [ ] Backend health check OK
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login to dashboard
- [ ] Google Maps API key obtained
- [ ] Google Maps API key added to `.env`
- [ ] Can see map on report submission
- [ ] Maps location picker works
- [ ] Can submit report with location

---

## 📚 Core Features

### For Citizens (Report Submitters)
✅ Submit crime reports with details
✅ Upload evidence (photos, documents)  
✅ Track case status in real-time
✅ **NEW:** Add precise crime location via Google Maps
✅ **NEW:** Search for address with autocomplete
✅ **NEW:** Click on map to select location

### For Police (Investigators)
✅ View assigned cases on dashboard
✅ Update investigation status
✅ Add remarks and evidence
✅ **NEW:** View crime location on interactive map
✅ **NEW:** Filter cases by location, date, category
✅ **NEW:** Export cases to CSV/PDF

### For Admins (Managers)
✅ Manage all users and permissions
✅ Assign cases to police officers
✅ View system analytics
✅ **NEW:** See activity log of all actions
✅ **NEW:** Monitor crime hotspots via coordinates
✅ **NEW:** Advanced search and filtering

---

## 🔧 Common Commands

```bash
# View Docker containers
docker compose ps

# View backend logs
docker compose logs -f app

# Restart all containers
docker compose restart

# Stop all containers
docker compose down

# Start frontend dev server (from client directory)
npm run dev

# Build frontend for production (from client directory)
npm run build

# Access MySQL directly
docker compose exec db mysql -uroot -proot123 lawconnect

# View database tables
docker compose exec db mysql -uroot -proot123 lawconnect -e "SHOW TABLES;"
```

---

## 🗂️ Project Structure

```
LawConnect/
├── client/                 # React frontend (Vite)
│   └── src/
│       └── components/Dashboard/
│           ├── MapLocationPicker.tsx      ← NEW: Map picker
│           └── MapDisplay.tsx             ← NEW: Map viewer
├── server/                 # Laravel backend (PHP)
│   ├── app/Models/CrimeReport.php         ← NEW: Map fields
│   └── database/migrations/               ← NEW: Coordinates table
├── docker-compose.yml      # Docker configuration
├── README.md               # Full documentation
├── GOOGLE_MAPS_SETUP.md    # Detailed maps guide
├── GOOGLE_MAPS_QUICK_REF.md # Quick reference
└── IMPLEMENTATION_CHECKLIST.md # Verification checklist
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Containers won't start | `docker compose down -v && docker compose up -d --build` |
| Frontend won't compile | `cd client && npm install && npm run dev` |
| Map won't load | Check API key in `.env`, verify APIs enabled |
| Database error | `docker compose exec app php artisan migrate --force` |
| Can't login | Clear cookies, verify email verification completed |

For more help, see:
- [GOOGLE_MAPS_SETUP.md](./GOOGLE_MAPS_SETUP.md#troubleshooting) - Maps issues
- [README.md](./README.md#common-issues--troubleshooting) - General issues

---

## 📞 Get Help

- **Backend Issues:** thouhidul.cse.20230104106@aust.edu
- **Frontend Issues:** rashid.cse.20230104102@aust.edu
- **Project Lead:** prottoy.cse.20230104108@aust.edu

---

## 🎯 Next Steps After Setup

1. **Verify Everything Works** - Run through the checklist above
2. **Explore the Dashboard** - Create reports, view cases
3. **Test Maps Feature** - Submit a report with location
4. **Setup 2FA** (Optional) - User profile → Two-Factor Auth
5. **Read Full Docs** - Check [README.md](./README.md) for complete info

---

## 🌟 Pro Tips

1. **Hot Reload Frontend:** Changes save automatically (Vite dev server)
2. **Hot Reload Backend:** Restart container: `docker compose restart app`
3. **Monitor Logs:** Keep this open: `docker compose logs -f app`
4. **Clean Cache:** `docker compose exec app php artisan cache:clear`
5. **Test API:** Use Postman or `curl` commands
6. **Check DB:** Use PhpMyAdmin at http://localhost:8080

---

## 📅 First Time Setup Timeline

| Step | Time | Command |
|------|------|---------|
| Install Docker | 10 min | Download & Install |
| Clone repo | 1 min | `git clone` |
| Start containers | 3 min | `docker compose up -d --build` |
| Setup backend | 2 min | Database migrations |
| Setup frontend | 3 min | `npm install` |
| Get API key | 2 min | Google Cloud Console |
| Add API key | 1 min | Edit `.env` |
| Test everything | 3 min | Visit http://localhost:5173 |
| | **~25 min** | **Total** |

---

## ✅ Success Indicators

When you see these, you're good to go:

```
✅ "Laravel development server started"
✅ "ready in 200ms" (Vite)
✅ "GET /api/health → 200 OK"
✅ Frontend loads without console errors
✅ Can register and login
✅ Map picker opens when submitting report
✅ Google Maps loads in map picker
```

---

## 🚀 You're Ready!

Congratulations! You now have:
- ✅ Full-stack crime reporting system
- ✅ Interactive Google Maps integration
- ✅ Professional features (search, export, 2FA)
- ✅ Mobile-responsive design
- ✅ Production-ready architecture

**Start reporting crimes securely today!**

---

**Document Version:** 1.0  
**Last Updated:** April 12, 2026  
**Status:** Ready for Use  
**Difficulty Level:** ⭐ Beginner-Friendly
