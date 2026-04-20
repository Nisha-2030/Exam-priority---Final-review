# Backend Setup Guide

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/exam-priority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5000
NODE_ENV=development
```

> If you do not have an admin user yet, the server will now auto-create a default admin account on first run with:
> - Email: `admin@example.com`
> - Password: `admin123`
>> If an admin account already exists from a previous run, the backend will reset that account to `admin123` in local development so login works consistently.
>> Change the password immediately after your first login.
>
> If `npm start` fails with `EADDRINUSE`, another backend is already running on port 5000. Stop that process or change `PORT` in `backend/.env`.

### 3. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service:
  ```bash
  # Windows
  mongod
  
  # macOS (with Homebrew)
  brew services start mongodb-community
  
  # Linux
  sudo systemctl start mongod
  ```

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update MONGODB_URI in .env

### 4. Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will be available at: `http://localhost:5000`

### 5. Test Server
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"Server is running"}
```

## Project Structure

```
src/
├── models/          # MongoDB schemas
├── controllers/     # Request handlers
├── routes/          # API endpoints
├── middleware/      # Auth, validation
├── config/          # Database connection
└── server.js        # Main application file
```

## API Endpoints

### Authentication
- `POST /api/auth/student/register` - Register Student
- `POST /api/auth/student/login` - Login Student  
- `POST /api/admin/login` - Admin Login
- `GET /api/auth/profile` - Get Profile (Protected)

### Exams & Curriculum
- `GET /api/exams` - List all exams
- `POST /api/exams` - Create exam (Admin)
- `GET /api/exams/:id` - Get exam details
- `PUT /api/exams/:id` - Update exam (Admin)
- `DELETE /api/exams/:id` - Delete exam (Admin)

### Subjects
- `GET /api/exams/:examId/subjects` - List subjects
- `POST /api/subjects` - Create subject (Admin)
- `PUT /api/subjects/:id` - Update subject (Admin)
- `DELETE /api/subjects/:id` - Delete subject (Admin)

### Topics
- `GET /api/subjects/:subjectId/topics` - List all topics
- `GET /api/subjects/:subjectId/topics/filtered` - Get High/Medium priority
- `POST /api/topics` - Create topic (Admin)
- `PUT /api/topics/:id` - Update topic (Admin)
- `DELETE /api/topics/:id` - Delete topic (Admin)

### Quizzes
- `GET /api/quiz/:topicId` - Get quiz
- `POST /api/quiz` - Create quiz (Admin)
- `PUT /api/quiz/:id` - Update quiz (Admin)
- `DELETE /api/quiz/:id` - Delete quiz (Admin)
- `POST /api/quiz/:id/submit` - Submit answers (Student)

### Progress & Students
- `GET /api/progress` - Student progress
- `POST /api/mark-complete/:studentId/:topicId` - Mark complete
- `POST /api/quiz-attempt/:topicId` - Record attempt
- `POST /api/target-exam` - Set target exam
- `GET /api/students` - All students (Admin)
- `PUT /api/students/:studentId/block` - Block student (Admin)
- `PUT /api/students/:studentId/unblock` - Unblock student (Admin)
- `DELETE /api/students/:studentId` - Delete student (Admin)

## Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

Token is obtained from login endpoints and valid for 7 days.

## Database Seeding

### Create Sample Data

1. **Create Exam:**
```
POST /api/exams
{
  "name": "RRB",
  "description": "Railway Recruitment Board"
}
```

2. **Create Subject:**
```
POST /api/subjects
{
  "name": "Reasoning",
  "exam": "<exam_id>"
}
```

3. **Create Topic:**
```
POST /api/topics
{
  "name": "Analogy",
  "subject": "<subject_id>",
  "priority": "High",
  "studyMaterial": "Study notes here..."
}
```

4. **Create Quiz:**
```
POST /api/quiz
{
  "topic": "<topic_id>",
  "questions": [
    {
      "text": "Question?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Explanation here"
    }
  ]
}
```

## Error Handling

All endpoints return standard error responses:
```json
{
  "error": "Error message"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Testing with curl

### Register Student
```bash
curl -X POST http://localhost:5000/api/auth/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <your_token>"
```

## Performance Notes

- Student queries automatically filter High/Medium priority topics
- JWT tokens expire after 7 days
- Passwords are bcrypt hashed (10 rounds)
- Database indexed on email and user role for faster queries
