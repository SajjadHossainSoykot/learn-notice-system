# 📢 Learn Notice System

A simple full-stack **Notice Management System** built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **MongoDB**.

This project was created as a learning project to understand how a modern web application connects a frontend UI with a backend API and a MongoDB database. It allows notice data to be created, viewed, updated, and deleted using Next.js API routes.

---

## 🔗 Project Links

GitHub Repository:  
https://github.com/SajjadHossainSoykot/learn-notice-system

Live Website:  
`Add your live Vercel link here after deployment`

---

## 🚀 Overview

**Learn Notice System** is a basic notice portal where notices are stored in MongoDB and displayed dynamically on the frontend.

The main purpose of this project is to practice:

- Next.js App Router
- API routes in Next.js
- MongoDB database connection
- CRUD operations
- Client-side data fetching
- Dynamic update and delete functionality
- Responsive UI design
- Clean project structure

This project can be extended later into a university notice board, admin dashboard, institutional announcement system, or full notice management portal.

---

## ✨ Features

- Notice listing page
- MongoDB database integration
- Next.js API routes
- Create notice API
- Update notice API
- Delete notice API
- Fetch notices dynamically
- Responsive UI
- Reusable components
- Environment variable support
- Loading and error handling
- Client-side refresh after data changes
- Ready for future admin portal development

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes
- Node.js Runtime

### Database

- MongoDB Atlas or local MongoDB

### Tools

- VS Code
- npm
- Git
- GitHub

---

## 📁 Project Structure

```bash
learn-notice-system/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── notices/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           └── route.ts
│   │   │
│   │   ├── notices/
│   │   │   └── page.tsx
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   └── Header.tsx
│   │
│   └── lib/
│       └── mongodb.ts
│
├── public/
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SajjadHossainSoykot/learn-notice-system.git
cd learn-notice-system
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Create Environment File

Create a `.env.local` file in the root directory.

```bash
touch .env.local
```

Add your MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string
```

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/noticeDB
```

> Never share your real MongoDB username, password, or `.env.local` file publicly.

---

### 4. Run the Development Server

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

---

## 🧩 MongoDB Connection

The project uses a reusable MongoDB connection file inside:

```bash
src/lib/mongodb.ts
```

This file connects the Next.js application with MongoDB and helps avoid unnecessary repeated database connections during development.

---

## 📌 API Routes

### Get All Notices

```http
GET /api/notices
```

This route fetches all notices from the MongoDB database.

---

### Create a Notice

```http
POST /api/notices
```

Example request body:

```json
{
  "title": "Class Test Notice",
  "description": "The class test will be held next Sunday.",
  "category": "Academic"
}
```

---

### Update a Notice

```http
PUT /api/notices/:id
```

Example:

```http
PUT /api/notices/notice_id_here
```

Example request body:

```json
{
  "title": "Updated Notice Title",
  "description": "Updated notice description",
  "category": "Updated Category"
}
```

---

### Delete a Notice

```http
DELETE /api/notices/:id
```

Example:

```http
DELETE /api/notices/notice_id_here
```

This route deletes a specific notice using its MongoDB ObjectId.

---

## 🧠 Important Learning Notes

During this project, one important issue was found:

The dynamic API route for deleting or updating a notice must be placed inside the API folder, not inside the main notice page folder.

Correct structure:

```bash
src/app/api/notices/[id]/route.ts
```

Wrong structure:

```bash
src/app/notices/[id]/route.ts
```

In Next.js App Router, API routes must stay inside the `app/api` directory.

---

## 🔄 Data Fetching and Refresh Logic

The notice page fetches data from:

```bash
/api/notices
```

After a notice is deleted or changed, the frontend should refresh or refetch the notice list so that the latest database data is shown.

This keeps the UI updated without requiring a full manual page reload.

---

## ⚡ Performance and Optimization Idea

For a small learning project, direct API fetching is okay.

However, for better performance in the future, the project can use:

- SWR
- React Query / TanStack Query
- Next.js caching
- Revalidation
- Optimistic UI update
- Server Actions
- Pagination
- Search and filtering

Recommended future improvement:

Use **SWR** or **TanStack Query** so notice data can be cached on the client side and automatically revalidated when data changes.

---

## 🧪 Example Use Cases

This project can be used as a base for:

- University notice board
- Department notice portal
- School announcement system
- Admin notice dashboard
- Event notice system
- Office announcement portal
- Learning project for MongoDB CRUD

---

## 🖥️ Available Scripts

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Run Linting

```bash
npm run lint
```

---

## 🚀 Deployment

This project can be deployed on **Vercel**.

### Deployment Steps

1. Push the project to GitHub
2. Go to Vercel
3. Import the GitHub repository
4. Add the environment variable:

```env
MONGODB_URI=your_mongodb_connection_string
```

5. Deploy the project

After deployment, the app will be available through a Vercel live URL.

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB database connection string |

The `.env.local` file should not be committed to GitHub.

Make sure `.gitignore` contains:

```bash
.env.local
```

---

## 🧱 Future Improvements

Possible future features:

- Admin login system
- Notice create form
- Notice edit form
- Notice category filter
- Notice search option
- Notice details page
- File attachment support
- PDF/image upload support
- Cloudinary integration
- Pagination
- Toast notification
- Role-based access control
- Dashboard analytics
- Rich text editor for notice body

---

## 📎 Future Attachment Feature Idea

In the future, this project can support file attachments with notices.

Possible attachment types:

- PDF
- Image
- Document
- Notice circular file

Possible tools:

- Cloudinary
- UploadThing
- Firebase Storage
- AWS S3

This would make the project more useful for real notice portals.

---

## 📚 What I Learned

Through this project, I practiced:

- Creating a Next.js project
- Working with App Router
- Creating API routes
- Connecting MongoDB with Next.js
- Performing CRUD operations
- Handling dynamic API routes
- Debugging route folder issues
- Fetching API data from frontend
- Updating UI after database changes
- Structuring a full-stack learning project

---

## 🧑‍💻 Developer

Developed by **Sajjad Hossain Soykot**

GitHub:  
https://github.com/SajjadHossainSoykot

---

## 📄 License

This project is open-source and can be used for learning, practice, and further development.

You may modify and extend this project according to your own requirements.

---

## ✅ Project Status

Current status: **Learning project / Basic CRUD version completed**

The project currently supports basic notice management with MongoDB and Next.js API routes. Future versions may include authentication, an admin dashboard, notice attachments, and advanced caching.