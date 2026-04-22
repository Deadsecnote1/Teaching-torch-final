# Teaching Torch React.js

## Description
Free Educational Resources for Sri Lankan Students - Built with React.js

## Features
- Multi-language support (Sinhala, Tamil, English)
- Dark/Light theme toggle
- Responsive design
- Grade-based organization
- Resource management
- **Google Drive Integration** - No backend needed! Store PDFs in Google Drive and link them
- Embedded PDF viewer - View PDFs directly in the browser
- Direct download support - Download PDFs from Google Drive

## Getting Started

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm start
```

### Build for production
```bash
npm run build
```

## Project Structure
```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── context/        # React contexts
├── hooks/          # Custom hooks
├── utils/          # Utility functions
└── styles/         # Stylesheets
```

## Google Drive Setup

This project uses **Google Drive** as a simple, free file storage solution. No backend server required!

### Quick Start

1. Upload PDFs to Google Drive
2. Set files to "Anyone with the link can view"
3. Add Google Drive links in the admin panel
4. Users can view/download PDFs directly

**See [GOOGLE_DRIVE_SETUP.md](./GOOGLE_DRIVE_SETUP.md) for detailed instructions.**

### Admin Access

- URL: `/admin/login`
- Access: Use your Firebase Authentication credentials.

## Development Notes

- Data is stored in **Firebase Firestore**
- Resources are linked via Google Drive or YouTube URLs
- All file operations work client-side (no backend needed)
- Add your logo to `public/assets/images/T.png`

Made with ❤️ for Sri Lankan Education 🇱🇰
