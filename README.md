# Assignment Submission System

A role-based platform for managing assignment workflows between mentors and students, built for Mentneo's internal operations.

## 📋 Overview

The Assignment Submission System streamlines the complete lifecycle of assignment management—from creation to submission to review. Built with production-grade security and workflow enforcement, it provides a centralized hub for educational content management with clear role separation and state management.

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure user registration and JWT-based authentication
- Role-based access control (RBAC) with two distinct roles:
  - **Mentor**: Assignment creators and reviewers
  - **Student**: Assignment submitters
- All permissions enforced at the API level with middleware validation

### 📊 Assignment Lifecycle Management

The system enforces a strict three-state workflow:

```
┌─────────┐    Student     ┌───────────┐    Mentor      ┌──────────┐
│ Pending │  ─────────────>│ Submitted │ ──────────────>│ Reviewed │
└─────────┘    submits      └───────────┘    reviews     └──────────┘
```

- **Pending**: Initial state when mentor creates assignment
- **Submitted**: Student uploads required materials
- **Reviewed**: Mentor completes evaluation

Invalid state transitions are rejected by backend validation.

### 👨‍🏫 Mentor Capabilities
- ✅ Create assignments with title, description, and optional deadlines
- ✅ View all student submissions across assignments
- ✅ Mark submissions as reviewed
- ✅ Track submission progress and completion rates
- ❌ Cannot submit assignments (role restriction)

### 👨‍🎓 Student Capabilities
- ✅ View all assigned assignments
- ✅ Submit multi-file assignments containing:
  - Text document (PDF or DOC/DOCX)
  - Image file (JPG, PNG, etc.)
  - Video file (MP4, MOV, etc.)
- ✅ Track submission status in real-time
- ❌ Cannot review submissions (role restriction)

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Architecture**: RESTful API
- **Authentication**: JWT (JSON Web Tokens)

### Database
- **Options**: MongoDB or PostgreSQL
- **Schema**: Users, Assignments, Submissions, File Metadata

### File Management
- **Upload Handler**: Multer
- **Storage**: Local filesystem (extensible to S3/Cloudinary)
- **Validation**: Type checking, size limits, sanitization

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |

### Assignments (Mentor Only)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/assignments` | Create new assignment | Yes (Mentor) |
| GET | `/api/assignments` | List all assignments | Yes (Mentor) |
| GET | `/api/assignments/:id` | Get assignment details | Yes (Mentor) |

### Submissions (Student)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/submissions/:assignmentId` | Submit assignment files | Yes (Student) |
| GET | `/api/submissions/my` | View own submissions | Yes (Student) |
| GET | `/api/submissions/:id` | View submission details | Yes (Student) |

### Reviews (Mentor Only)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/submissions` | View all student submissions | Yes (Mentor) |
| PATCH | `/api/submissions/:id/review` | Mark submission as reviewed | Yes (Mentor) |

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
│   │   │   └── Sidebar.tsx
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
│   ├── .eslintrc.config.js
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

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (v5+) or PostgreSQL (v13+)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd assignment-submission-system
```

#### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
# Server
PORT=5000
NODE_ENV=development

# Database (MongoDB example)
MONGODB_URI=mongodb://localhost:27017/assignment_system

# Or PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost:5432/assignment_system

# Authentication
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

Start the backend server:
```bash
npm run dev
```
The API will be available at `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Role-Based Middleware**: Endpoint protection based on user roles
- **Input Validation**: Request payload validation using express-validator
- **File Type Validation**: Whitelist-based file type checking
- **File Size Limits**: Configurable upload size restrictions
- **SQL/NoSQL Injection Protection**: Parameterized queries and sanitization
- **CORS Configuration**: Controlled cross-origin resource sharing

## 📤 File Upload Specifications

### Supported File Types
- **Documents**: PDF, DOC, DOCX
- **Images**: JPG, JPEG, PNG, GIF
- **Videos**: MP4, MOV, AVI

### Upload Limits
- Maximum file size: 10MB per file (configurable)
- Maximum files per submission: 3 (document + image + video)
- Total submission size: 30MB

### Storage Strategy
- Files stored locally in `server/uploads/` directory
- Unique filename generation to prevent collisions
- File metadata stored in database with references
- Organized by submission ID for easy retrieval

## 🧪 Testing

### Run Backend Tests
```bash
cd server
npm test
```

### Run Frontend Tests
```bash
cd client
npm test
```

## 🎯 Workflow Validation Examples

### Valid Workflow
```
✅ Mentor creates assignment → Status: Pending
✅ Student submits files → Status: Submitted
✅ Mentor reviews submission → Status: Reviewed
```

### Invalid Workflows (Blocked by Backend)
```
❌ Student tries to create assignment → 403 Forbidden
❌ Mentor tries to submit assignment → 403 Forbidden
❌ Student tries to review submission → 403 Forbidden
❌ Transition from Pending to Reviewed → 400 Bad Request
```

## 🎯 Design Decisions & Trade-offs

### What This System Prioritizes
✅ **Security First**: Role-based access control at every endpoint  
✅ **Data Integrity**: State machine validation for assignment lifecycle  
✅ **Clean Architecture**: Separation of concerns with clear layer boundaries  
✅ **Production-Ready Patterns**: JWT auth, proper error handling, logging  

### Current Limitations
- **Single Mentor Model**: No mentor hierarchy or team assignments
- **Local Storage**: Files stored locally (not cloud-native)
- **No Real-Time Updates**: Polling-based status checks
- **Basic Notifications**: No email/push notification system
- **Simple UI**: Functionality-focused design without advanced UX

### Future Enhancement Opportunities
- Cloud storage integration (AWS S3, Google Cloud Storage)
- Real-time updates using WebSockets
- Email notifications for submission events
- Advanced analytics dashboard
- Batch assignment operations
- Comment system for mentor feedback
- Assignment templates
- Deadline reminders

## 📝 Environment Variables Reference

### Backend
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `MONGODB_URI` | MongoDB connection string | Yes* | - |
| `DATABASE_URL` | PostgreSQL connection string | Yes* | - |
| `JWT_SECRET` | Secret for JWT signing | Yes | - |
| `JWT_EXPIRE` | Token expiration time | No | 7d |
| `MAX_FILE_SIZE` | Max upload size in bytes | No | 10485760 |
| `UPLOAD_PATH` | File storage directory | No | ./uploads |

*One database connection string is required

### Frontend
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | - |

*Note: Vite requires environment variables to be prefixed with `VITE_`*

## 🤝 Contributing

This is an internal Mentneo project. For contribution guidelines, please contact the project maintainers.

## 📄 License

Internal use only. All rights reserved by Mentneo.

## 📧 Support

For technical support or questions, please contact:
- Technical Lead: [email]
- Project Manager: [email]

---

**Built with ❤️ for Mentneo by Devansh Kumar Tiwari**
