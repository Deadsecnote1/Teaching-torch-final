# Teaching Torch Platform 🇱🇰

![Teaching Torch Banner](/public/logo512.png)

**Teaching Torch** is a free, modern, and open-source educational resource platform built for Sri Lankan students. It provides centralized, organized access to government textbooks, past papers, short notes, and video tutorials across all grades and streams.

## 🚀 Tech Stack

The application has been fully modernized and migrated from Create React App to **Vite**:
- **Framework:** React.js 18 + Vite 8
- **Styling:** Tailwind CSS + Vanilla CSS (Glassmorphism aesthetics)
- **UI Components:** Radix UI (Headless, accessible components) + Framer Motion (Animations)
- **Database & Auth:** Firebase Firestore & Firebase Auth
- **Hosting & CI/CD:** Firebase Hosting + GitHub Actions

## ✨ Key Features
- **Multi-language Support:** Seamlessly switch between Sinhala, Tamil, and English mediums.
- **Dynamic Theming:** Premium Dark/Light mode support with CSS variables.
- **Grade & Stream Routing:** Distinct routing systems for general grades (6-11) and Advanced Level (A/L) streams.
- **Google Drive Integration:** Direct link bypassing and embedded PDF viewers—no heavy backend required.
- **Agentic Security:** Local staging environments separated from production databases via environment variables.

---

## 🛠️ Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
The project uses strict environment separation for local development. You need to configure your `.env` files. Ensure you never commit your API keys.

- `.env` -> Main Production Environment (`tt-v1-c2a11`)
- `.env.staging` -> Staging Environment (`tt-staging-5a60d`)

### 3. Run the Development Server
To run the app connected to the **Main Production** database:
```bash
npm run dev
```

To run the app connected to the **Staging** database (Recommended for Admin UI testing):
```bash
npm run dev:staging
```

### 4. Build for Production
To build the optimized static bundle:
```bash
npm run build
```

---

## 📁 Project Structure Overview
```
src/
├── components/     # Reusable UI components (Tailwind + Radix)
│   ├── admin/      # Admin dashboard components
│   ├── common/     # Global components (Navbar, Footer, Modals)
│   └── ui/         # Base layout components (Container, Grid, Card)
├── context/        # React Contexts (Auth, Data, AL, Language, Theme)
├── hooks/          # Custom hooks (e.g., useDocumentTitle, useGradePage)
├── pages/          # Main application views
├── styles/         # Global stylesheets and modern base tokens
└── utils/          # Helpers (Translations, Validations, YouTube/Drive parsers)
```

## 🔒 Admin Access
The Admin Dashboard allows authorized users to manage grades, subjects, and resource URLs instantly.
- **URL:** `/admin/login`
- **Access:** Handled via Firebase Auth and protected by `ProtectedRoute`.

*For detailed technical guidelines, refer to [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md).*
