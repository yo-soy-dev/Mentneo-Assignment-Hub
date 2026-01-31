# 📚 Assignment Submission System

> A role-based platform for managing assignment workflows between mentors and students, built for Mentneo's internal operations.

---

## 📋 Overview

The **Assignment Submission System** streamlines the complete lifecycle of assignment management—from creation to submission to review. Built with production-grade security and workflow enforcement, it provides a centralized hub for educational content management with clear role separation and state management.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure user registration and JWT-based authentication
- Role-based access control (RBAC) with two distinct roles:
  - **Mentor**: Assignment creators and reviewers
  - **Student**: Assignment submitters
- All permissions enforced at the API level with middleware validation

### 📊 Assignment Lifecycle Management

The system enforces a strict **three-state workflow**:

```
┌─────────┐    Student     ┌───────────┐    Mentor      ┌──────────┐
│ Pending │  ─────────────>│ Submitted │ ──────────────>│ Reviewed │
└─────────┘    submits      └───────────┘    reviews     └──────────┘
```

**State Definitions:**
- **Pending**: Initial state when mentor creates assignment
- **Submitted**: Student uploads required materials
- **Reviewed**: Mentor completes evaluation

> ⚠️ Invalid state transitions are rejected by backend validation.

---

### 👨‍🏫 Mentor Capabilities

| Feature | Status |
|---------|--------|
| Create assignments with title, description, and optional deadlines | ✅ Enabled |
| View all student submissions across assignments | ✅ Enabled |
| Mark submissions as reviewed | ✅ Enabled |
| Track submission progress and completion rates | ✅ Enabled |
| Submit assignments | ❌ Restricted |

### 👨‍🎓 Student Capabilities

| Feature | Status |
|---------|--------|
| View all assigned assignments | ✅ Enabled |
| Submit multi-file assignments (PDF/DOC/DOCX, Images, Videos) | ✅ Enabled |
| Track submission status in real-time | ✅ Enabled |
| Review submissions | ❌ Restricted |

**Supported File Types for Submission:**
- 📄 Text document (PDF or DOC/DOCX)
- 🖼️ Image file (JPG, PNG, GIF, etc.)
- 🎥 Video file (MP4, MOV, AVI, etc.)

---

## 🛠 Tech Stack

<table>
<tr>
<td width="50%">

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Routing**: React Router v6

</td>
<td width="50%">

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Architecture**: RESTful API
- **Authentication**: JWT (JSON Web Tokens)
- **File Handler**: Multer
- **Database**: MongoDB / PostgreSQL

</td>
</tr>
</table>

### 🗄️ Database Schema
- **Collections/Tables**: Users, Assignments, Submissions, File Metadata
- **Relationships**: User ↔ Assignments ↔ Submissions

### 📁 File Management
- **Upload Handler**: Multer
- **Storage**: Local filesystem (extensible to AWS S3/Cloudinary)
- **Validation**: Type checking, size limits, sanitization

---

## 📡 API Reference

### 🔑 Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT | ❌ |

### 📝 Assignment Endpoints (Mentor Only)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `POST` | `/api/assignments` | Create new assignment | ✅ Mentor |
| `GET` | `/api/assignments` | List all assignments | ✅ Mentor |
| `GET` | `/api/assignments/student` | Get student-specific assignments | ✅ Student |
| `GET` | `/api/assignments/:id` | Get assignment details | ✅ Mentor |

### 📤 Submission Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `POST` | `/api/submissions/assignment/:assignmentId` | Submit assignment files | ✅ Student |
| `GET` | `/api/submissions/my/:assignmentId` | View own submissions | ✅ Student |
| `GET` | `/api/submissions/:id` | View submission details | ✅ Student |
| `GET` | `/api/submissions` | View all student submissions | ✅ Mentor |
| `PATCH` | `/api/submissions/:id/review` | Mark submission as reviewed | ✅ Mentor |

---

## 📁 Project Structure

```
assignment-submission-system/
│
├── client/                        # Frontend React + TypeScript
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── api/                   # API integration layer
│   │   │   ├── assignment.api.ts
│   │   │   ├── auth.api.ts
│   │   │   ├── axios.ts
│   │   │   └── submission.api.ts
│   │   ├── assets/                # Static assets
│   │   │   └── react.svg
│   │   ├── components/            # Reusable UI components
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AppLayout.tsx
│   │   ├── context/               # React context providers
│   │   │   └── AuthContext.tsx
│   │   ├── pages/                 # Application pages
│   │   │   ├── AssignmentSubmissions.tsx
│   │   │   ├── CreateAssignment.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── MentorDashboard.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ReviewSubmission.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   └── SubmitAssignment.tsx
│   │   ├── App.tsx                # Main application component
│   │   ├── index.css              # Global styles
│   │   └── main.tsx               # Application entry point
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── package.json
│   └── package-lock.json
│
├── server/                        # Backend Node.js + Express
│   ├── node_modules/
│   ├── src/
│   │   ├── config/                # Configuration files
│   │   ├── controllers/           # Business logic and request handlers
│   │   │   ├── assignment.controller.js
│   │   │   ├── auth.controller.js
│   │   │   └── submission.controller.js
│   │   ├── middleware/            # Authentication & authorization
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── upload.js
│   │   ├── models/                # Database schemas
│   │   │   ├── Assignment.js
│   │   │   ├── Submission.js
│   │   │   └── User.js
│   │   ├── routes/                # API route definitions
│   │   │   ├── assignment.route.js
│   │   │   ├── auth.route.js
│   │   │   └── submission.route.js
│   │   ├── scripts/               # Utility scripts
│   │   │   └── createAdmin.js
│   │   └── server.js              # Application entry point
│   ├── .env                       # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── vercel.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- ✅ **Node.js** (v16 or higher)
- ✅ **npm** or **yarn**
- ✅ **MongoDB** (v5+) or **PostgreSQL** (v13+)

---

### ⚙️ Installation

#### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd assignment-submission-system
```

#### 2️⃣ Backend Setup
```bash
cd server
npm install
```

**Create a `.env` file** in the `server` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (Choose one)
MONGODB_URI=mongodb://localhost:27017/assignment_system
# DATABASE_URL=postgresql://user:password@localhost:5432/assignment_system

# Cloudinary Configuration (Optional for cloud storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Authentication
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# File Upload Settings
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**Start the backend server:**
```bash
npm run dev
```
> 🌐 The API will be available at `http://localhost:5000`

#### 3️⃣ Frontend Setup
```bash
cd client
npm install
```

**Create a `.env` file** in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

**Start the development server:**
```bash
npm run dev
```
> 🌐 The application will be available at `http://localhost:5173`

---

## 🔒 Security Features

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Authentication** | Stateless token-based authentication |
| 🔑 **Password Hashing** | bcrypt with salt rounds for secure password storage |
| 🛡️ **Role-Based Middleware** | Endpoint protection based on user roles |
| ✅ **Input Validation** | Request payload validation using express-validator |
| 📂 **File Type Validation** | Whitelist-based file type checking |
| 📏 **File Size Limits** | Configurable upload size restrictions |
| 🚫 **Injection Protection** | Parameterized queries and sanitization |
| 🌐 **CORS Configuration** | Controlled cross-origin resource sharing |

---

## 📤 File Upload Specifications

### 📋 Supported File Types
| Category | Formats |
|----------|---------|
| 📄 **Documents** | PDF, DOC, DOCX |
| 🖼️ **Images** | JPG, JPEG, PNG, GIF |
| 🎥 **Videos** | MP4, MOV, AVI |

### 📊 Upload Limits
- **Maximum file size**: 10MB per file (configurable)
- **Maximum files per submission**: 3 (document + image + video)
- **Total submission size**: 30MB

### 💾 Storage Strategy
- Files stored locally in `server/uploads/` directory
- Unique filename generation to prevent collisions
- File metadata stored in database with references
- Organized by submission ID for easy retrieval

---

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

---

## 🎯 Workflow Validation Examples

### ✅ Valid Workflows
```
✅ Mentor creates assignment → Status: Pending
✅ Student submits files → Status: Submitted
✅ Mentor reviews submission → Status: Reviewed
```

### ❌ Invalid Workflows (Blocked by Backend)
```
❌ Student tries to create assignment → 403 Forbidden
❌ Mentor tries to submit assignment → 403 Forbidden
❌ Student tries to review submission → 403 Forbidden
❌ Transition from Pending to Reviewed → 400 Bad Request
```

---

## 🎯 Design Decisions & Trade-offs

### What This System Prioritizes
| Priority | Description |
|----------|-------------|
| 🔒 **Security First** | Role-based access control at every endpoint |
| 🗂️ **Data Integrity** | State machine validation for assignment lifecycle |
| 🏗️ **Clean Architecture** | Separation of concerns with clear layer boundaries |
| 🚀 **Production-Ready** | JWT auth, proper error handling, logging |

### Current Limitations
- ⚠️ **Single Mentor Model**: No mentor hierarchy or team assignments
- ⚠️ **Local Storage**: Files stored locally (not cloud-native by default)
- ⚠️ **No Real-Time Updates**: Polling-based status checks
- ⚠️ **Basic Notifications**: No email/push notification system
- ⚠️ **Simple UI**: Functionality-focused design without advanced UX

### 🔮 Future Enhancement Opportunities
- ☁️ Cloud storage integration (AWS S3, Google Cloud Storage, Cloudinary)
- 🔄 Real-time updates using WebSockets
- 📧 Email notifications for submission events
- 📊 Advanced analytics dashboard
- 📦 Batch assignment operations
- 💬 Comment system for mentor feedback
- 📝 Assignment templates
- ⏰ Deadline reminders

---

## 📝 Environment Variables Reference

### Backend Variables
| Variable | Description | Required | Default |
|----------|-------------|:--------:|---------|
| `PORT` | Server port | ❌ | 5000 |
| `NODE_ENV` | Environment mode | ❌ | development |
| `MONGODB_URI` | MongoDB connection string | ✅* | - |
| `DATABASE_URL` | PostgreSQL connection string | ✅* | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ❌ | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ❌ | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ❌ | - |
| `JWT_SECRET` | Secret for JWT signing | ✅ | - |
| `JWT_EXPIRE` | Token expiration time | ❌ | 7d |
| `MAX_FILE_SIZE` | Max upload size in bytes | ❌ | 10485760 |
| `UPLOAD_PATH` | File storage directory | ❌ | ./uploads |

> **Note**: *One database connection string is required (either MongoDB or PostgreSQL)

### Frontend Variables
| Variable | Description | Required | Default |
|----------|-------------|:--------:|---------|
| `VITE_API_URL` | Backend API base URL | ✅ | - |

> **Note**: Vite requires environment variables to be prefixed with `VITE_`

---

## 🤝 Contributing

This is an internal **Mentneo** project. For contribution guidelines, please contact the project maintainers.

---

## 📄 License

**Internal use only.** All rights reserved by **Mentneo**.

---

## 📧 Support

For technical support or questions, please contact:
- 👨‍💻 **Technical Lead**: [email]
- 📋 **Project Manager**: [email]

---

<div align="center">

**Built with ❤️ for Mentneo by Devansh Kumar Tiwari**

[![Made with React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)

</div>
