# Testing Guide - Firebase Integration

## 🚀 Quick Start

### 1. Start the Development Server

```bash
npm start
```

The app will open automatically at `http://localhost:3000`

---

## 📋 Step-by-Step Testing

### Step 1: Prepare a Test PDF in Google Drive

1. **Upload a PDF to Google Drive**
   - Go to [Google Drive](https://drive.google.com)
   - Upload any PDF file
   - Name it something like: `Test_Textbook_Grade6_Mathematics.pdf`

2. **Make it Publicly Accessible**
   - Right-click the PDF → **Share**
   - Change to: **"Anyone with the link"** → **"Viewer"**
   - Click **Copy link**

### Step 2: Access Admin Panel

1. **Open the app** in your browser: `http://localhost:3000`
2. **Navigate to Admin Login**:
   - Go directly to: `http://localhost:3000/admin/login`
3. **Login**:
   - Use your **Firebase Authentication** credentials (configured in your Firebase Console).
   - *Note: Default login logic is handled by Firebase Auth.*

### Step 3: Add a Resource (Firestore)

1. **Go to Admin Dashboard**
2. **Fill in the form**:
   - **Select Grade**: Choose any grade (e.g., Grade 6)
   - **Select Subject**: Choose a subject (e.g., Mathematics)
   - **Resource Type**: Select "Textbooks"
   - **Select Language(s)**: Choose English/Sinhala/Tamil
   - **Google Drive Link**: Paste your link
   - **Resource Title**: Enter a title
3. **Click "Add Resource"**
4. **You should see**: Success alert. The data is now stored in **Firestore**.

### Step 4: Test as a User

1. **Navigate to the grade page**:
   - Go to Home page
   - Click on the grade you selected (e.g., "Grade 6")
2. **Go to the resource type**:
   - Click "Textbooks" card
3. **Find your resource**:
   - It should load automatically from Firestore.

---

## ✅ Checklist - What to Verify

### Admin Panel
- [ ] Can login via Firebase Authentication
- [ ] Google Drive link validation works
- [ ] Can add resources to Firestore
- [ ] Success message appears after saving
- [ ] Resource appears in the Admin Dashboard list (which pulls from Firestore)

### User Experience
- [ ] Resource appears on the correct grade/subject page
- [ ] "View" button opens PDF in modal
- [ ] PDF loads and displays correctly
- [ ] "Download" button works

### Browser Console
- [ ] No JavaScript errors (F12 → Console)
- [ ] No Firebase permission errors (Check Firestore rules)

---

## 🔍 Debugging Tips

### Check Firestore
1. Open your [Firebase Console](https://console.firebase.google.com/)
2. Go to **Cloud Firestore**
3. Look for the `resources` collection
4. Verify your resource exists there with the correct fields.

### Check Network Tab
1. Open DevTools (F12) → **Network**
2. Refresh the page
3. Look for calls to `firestore.googleapis.com`
4. These confirm the app is fetching live data.

---

**Happy Testing! 🚀**
