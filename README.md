# Teaching Torch

![Teaching Torch Logo](public/logo192.png)

Teaching Torch is a dynamic, multi-language educational resource platform built for students in Sri Lanka from Grade 6 to Advanced Level (A/L). The platform provides free access to textbooks, past papers, study notes, and educational videos in Sinhala, Tamil, and English.

## Features

- **Multi-Language Support**: Seamlessly switch between Sinhala, Tamil, and English. The UI and content headers automatically translate based on the selected medium.
- **Medium-Specific Subjects**: Admins can restrict certain subjects (e.g., "Tamil Literature") to specific languages, ensuring students only see relevant content.
- **Premium Admin Dashboard**: A secure, Firebase-authenticated admin panel allowing site owners to:
  - Dynamically create, edit, and delete Grades and Subjects.
  - Upload resource links (Google Drive, YouTube).
  - Manage contact and social media settings directly from the dashboard.
- **AdSense Ready**: Built with monetization in mind, including properly configured Privacy Policy, About Us, Contact Us pages, and AdSense script placeholders.
- **Dark Mode**: Fully supported system-wide Dark/Light theme toggling.
- **Mobile Responsive**: Built with Bootstrap 5 for a flawless mobile experience.

## Tech Stack

- **Frontend Framework**: React.js (v18+)
- **Routing**: React Router DOM (v6)
- **Styling**: Bootstrap 5 & Custom CSS
- **Database & Backend**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase Hosting (with GitHub Actions CI/CD)

## Local Development Setup

Follow these instructions to run the project on your local machine.

### Prerequisites
- Node.js (v18 or v20 recommended)
- npm or yarn
- A Firebase project (for the database and authentication)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Deadsecnote1/Teaching-torch-final.git
   cd Teaching-torch-final
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`.

## Deployment

This repository is configured with a **GitHub Actions CI/CD pipeline**. 
Any push to the `main` branch will automatically build the React application and deploy it to **Firebase Hosting**.

If you need to deploy manually via the Firebase CLI:
```bash
npm run build
firebase deploy --only hosting
```

## Branching Strategy

To safely develop new features without breaking the live website, we recommend the following Git workflow:

1. **`main` Branch**: Connects directly to Firebase. Only stable, tested code should be here.
2. **`developer` Branch**: Use this branch for ongoing development, experimental features, and testing. Once satisfied, merge it into `main`.

### Creating the Developer Branch
```bash
git checkout -b developer
git push -u origin developer
```

## License

This project is proprietary and intended for the Teaching Torch educational platform.
