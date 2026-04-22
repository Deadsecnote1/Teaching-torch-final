# Google Drive Integration Guide

This project uses **Google Drive** as a free, simple file storage solution for PDFs and videos.

## 🎯 How It Works

1. **Upload PDFs to Google Drive** - You manage files in your own Google Drive.
2. **Share files publicly** - Set files or folders to "Anyone with the link can view".
3. **Add links to the Admin Panel** - Paste the share links into the dashboard.
4. **Firestore Storage** - The app saves these links in Firestore for all users to see.

## 📋 Step-by-Step Setup

### 1. Upload Your PDF to Google Drive

1. Go to [Google Drive](https://drive.google.com).
2. Upload your PDF file.

### 2. Make Files Publicly Accessible

**Important:** Files must be set to "Anyone with the link can view" for the viewer to work.

1. Right-click on the PDF file in Google Drive.
2. Click **Share**.
3. Change settings to: **"Anyone with the link"** (Permission: **"Viewer"**).
4. Click **Copy link**.

### 3. Add to the Dashboard

1. Log in to your Admin Dashboard (`/admin/login`).
2. Fill in the resource form (Grade, Subject, Type, Language).
3. Paste the **Google Drive Link**.
4. Click **Save**.

## 🔗 Supported Link Formats

The system automatically extracts the ID from these formats:
- `https://drive.google.com/file/d/FILE_ID/view`
- `https://drive.google.com/open?id=FILE_ID`
- Direct `FILE_ID` strings.

---
**Tip**: For videos, you can also use standard **YouTube** links!
