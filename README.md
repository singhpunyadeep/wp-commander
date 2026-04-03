# WP Commander 🔥
AI-powered WordPress control panel. Built with React + Netlify Functions + Claude AI.

## Features
- Dashboard with live site stats
- AI post creation (topic → Claude writes → review → publish)
- Posts manager (edit, SEO optimize, delete)
- Pages manager
- Comments manager (bulk delete spam)
- SEO tools (audit, keywords, content calendar, bulk meta)
- Media library with AI alt text generation
- Multi-site support via dropdown

## Deploy in 5 Steps

### 1. Create GitHub Repo
- Go to github.com → New repository → Name: `wp-commander`
- Upload all these files maintaining the folder structure

### 2. Connect to Netlify
- Go to app.netlify.com → Add new site → Import from GitHub
- Select your `wp-commander` repo
- Build settings (auto-detected from netlify.toml):
  - Build command: `npm run build`
  - Publish directory: `dist`

### 3. Add Environment Variable
- In Netlify: Site Settings → Environment Variables → Add variable
- Key: `ANTHROPIC_API_KEY`
- Value: your Anthropic API key (from console.anthropic.com)

### 4. Deploy
- Click Deploy — takes ~2 minutes

### 5. Add Your WordPress Site
- Open your deployed app
- Click "+ Add Site" in sidebar
- Enter: Site name, URL, admin username, Application Password
- Click "Test Connection" → Save

## Adding WordPress Application Password
1. WP Admin → Users → Profile
2. Scroll to "Application Passwords"
3. Name: "WP Commander" → Add New
4. Copy the generated password
5. Paste into WP Commander when adding site

## Tech Stack
- React 18 + Vite
- Netlify Functions (serverless proxy)
- Claude Sonnet API
- WordPress REST API
