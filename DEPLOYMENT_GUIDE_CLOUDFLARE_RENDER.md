# 🌐 Aditya Kumar Portfolio - Production Deployment Architecture

This guide details the complete production deployment pipeline for your personal 3D Engineering Portfolio using the exact stack:
**Cloudflare + Render + MySQL + Nginx + Cloudflare R2 + Cloudflare Analytics + GitHub Visitors**.

---

## 🏗️ Architecture Overview

```
                      +---------------------------------------+
                      |           CLOUDFLARE EDGE             |
                      |   - DNS & SSL (Free Universal HTTPS)  |
                      |   - Web Analytics (Privacy-First)     |
                      |   - Cloudflare R2 (4K Media & 3D GLB) |
                      |   - Cloudflare Pages (React 19 / Vite)|
                      +-------------------+-------------------+
                                          |
                Static Assets & HTML5     |     API Calls & WebSocket
                Reverse Proxied via       |     (/api/* -> Render)
                _redirects                |
                                          v
                      +---------------------------------------+
                      |         RENDER CLOUD PLATFORM         |
                      |   - Web Service (Docker / OpenJDK 17) |
                      |   - Spring Boot 3 REST API            |
                      |   - WebSocket STOMP Endpoint          |
                      +-------------------+-------------------+
                                          |
                                          | JDBC Connection Pooling
                                          v
                      +---------------------------------------+
                      |         MYSQL 8.0 CLOUD DB            |
                      |   - Render MySQL / Aiven / Railway    |
                      |   - Songs, Analytics & Contact Data   |
                      +---------------------------------------+
```

---

## 🚀 Step 1: Deploy Database (MySQL)

You can use **Render MySQL**, **Aiven MySQL** (free tier), or **Railway MySQL**:

1. In your cloud database dashboard, create a new MySQL database:
   * **Database Name:** `portfolio_db`
   * **User:** `portfolio_user`
2. Copy your **External JDBC Connection URL**:
   ```
   jdbc:mysql://<host>:<port>/portfolio_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   ```

---

## ⚡ Step 2: Deploy Backend to Render (Render.com)

A ready-to-use Render Blueprint has already been configured in `render.yaml`.

### Option A: Using Render Blueprint (1-Click)
1. Push your repository to GitHub.
2. Go to [dashboard.render.com](https://dashboard.render.com) -> **New** -> **Blueprint**.
3. Select your repository. Render will automatically detect `render.yaml`.
4. Fill in the database environment variables:
   * `SPRING_DATASOURCE_URL`: (from Step 1)
   * `SPRING_DATASOURCE_USERNAME`: (your db user)
   * `SPRING_DATASOURCE_PASSWORD`: (your db password)
   * `ADMIN_PASSWORD`: (your chosen admin password)
5. Click **Apply**. Render will build the Docker container and start your Spring Boot API.

### Option B: Manual Web Service on Render
* **Name:** `portfolio-backend`
* **Runtime:** `Docker`
* **Dockerfile Path:** `./backend/Dockerfile`
* **Context:** `./backend`
* **Health Check Path:** `/api/music/default`
* **Environment Variables:**
  * `SPRING_PROFILES_ACTIVE`: `prod`
  * `SPRING_DATASOURCE_URL`: `jdbc:mysql://...`
  * `SPRING_DATASOURCE_USERNAME`: `...`
  * `SPRING_DATASOURCE_PASSWORD`: `...`
  * `SPRING_DATASOURCE_DRIVER_CLASS_NAME`: `com.mysql.cj.jdbc.Driver`
  * `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`

Once deployed, note down your Render service URL (e.g. `https://portfolio-backend-xxxx.onrender.com`).

---

## ☁️ Step 3: Deploy Frontend to Cloudflare Pages

1. In your project, update `frontend/public/_redirects`:
   Uncomment and put your Render backend URL:
   ```
   /api/*  https://portfolio-backend-xxxx.onrender.com/api/:splat  200
   /ws/*   https://portfolio-backend-xxxx.onrender.com/ws/:splat   200
   /*      /index.html                                             200
   ```
2. Push your changes to GitHub.
3. Open [dash.cloudflare.com](https://dash.cloudflare.com) -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
4. Select your portfolio repository and configure build settings:
   * **Framework preset:** `Vite`
   * **Root directory:** `frontend`
   * **Build command:** `pnpm run build` (or `npm run build`)
   * **Build output directory:** `dist`
   * **Node version:** `20` (in Environment Variables: `NODE_VERSION=20`)
5. Click **Save and Deploy**. Cloudflare Pages will build and deploy your site to global edge nodes across 300+ cities in ~1 minute.

---

## 📦 Step 4: Setup Cloudflare R2 (Zero-Egress Object Storage)

For high-speed loading of 4K wallpapers and 3D models:

1. In Cloudflare Dashboard, go to **R2 Object Storage** -> **Create bucket**:
   * Name: `portfolio-assets`
2. Under **Settings** -> **Public access**:
   * Connect a custom domain (e.g. `assets.adityaraj.dev`) OR enable the R2.dev public URL (`https://pub-xxxxxx.r2.dev`).
3. Upload the contents of `frontend/public/wallpapers/` and any large 3D models into the bucket.
4. In Cloudflare Pages environment variables, set:
   * `VITE_R2_STORAGE_URL` = `https://assets.adityaraj.dev` (or your R2 public URL).
5. All 4K wallpapers and assets will automatically stream from Cloudflare R2!

---

## 📊 Step 5: Cloudflare Web Analytics & GitHub Visitors

1. **GitHub Visitors Badge:**
   * Already integrated into `FooterSignature.tsx` displaying real-time profile hits for `adityakumarbju121` with a custom cyber-cyan badge (`#00e5ff`).
2. **Cloudflare Web Analytics:**
   * In Cloudflare Dashboard -> **Analytics & Logs** -> **Web Analytics** -> Add Site -> Copy your beacon token.
   * Paste token in `frontend/index.html` or enable "Automatic Web Analytics" in Cloudflare Pages settings.

---

## 🛡️ Step 6: Standalone Docker Compose (Alternative / Backup)

If you ever want to run the entire stack on an Ubuntu VPS or local server with Nginx:
```bash
docker compose up -d --build
```
Everything (Frontend Nginx reverse proxy + Backend Spring Boot + MySQL) will start together automatically.
