# Visual Architecture & Component Guide

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STUDENT BROWSER                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │          StudentDashboard.js (Main Page)                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│         ↓                    ↓                      ↓                │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐   │
│  │ MaterialSection  │ │ VideoSection     │ │ QuizComponent    │   │
│  │                  │ │                  │ │                  │   │
│  │ • Fetch data     │ │ • Fetch data     │ │ • Quiz logic     │   │
│  │ • Expandable     │ │ • Grid layout    │ │ • Results calc   │   │
│  │ • Categories     │ │ • Modal player   │ │ • Progress save  │   │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘   │
│         ↓                    ↓                                       │
│  ┌──────────────────┐ ┌──────────────────┐                        │
│  │MaterialCard      │ │VideoCard +       │                        │
│  │VideoCard         │ │VideoModal        │                        │
│  │                  │ │                  │                        │
│  │ • Content render │ │ • Thumbnail      │                        │
│  │ • Styling        │ │ • Embed player   │                        │
│  │ • Interactions   │ │ • Info display   │                        │
│  └──────────────────┘ └──────────────────┘                        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
        ↑                 ↑                      ↑
        │                 │                      │
   API Calls          API Calls             API Calls
        │                 │                      │
        ↓                 ↓                      ↓
┌───────────────────────────────────────────────────────────────────┐
│           Frontend Services (API Layer)                           │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  materialService.js          videoService.js       quizService.js │
│  • getAllMaterials()         • getAllVideos()       • getQuizXYZ() │
│  • getMaterialsByTopic()     • getVideosByTopic()   • submitQuiz() │
│  • createMaterial()          • createVideo()        ...            │
│  • updateMaterial()          • updateVideo()                       │
│  • deleteMaterial()          • deleteVideo()                       │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        ↑                 ↑                      ↑
        │                 │                      │
        │ HTTP/CORS Requests                     │
        │                 │                      │
        ↓                 ↓                      ↓
┌───────────────────────────────────────────────────────────────────┐
│              EXPRESS BACKEND (Node.js Server)                     │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Routes (Express Router)                                     │ │
│  │ • GET/POST/PUT/DELETE /api/materials*                       │ │
│  │ • GET/POST/PUT/DELETE /api/videos*                          │ │
│  │ • ... other routes                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│         ↓                         ↓                               │
│  ┌──────────────────────┐  ┌──────────────────────┐              │
│  │ Controllers          │  │ Middleware           │              │
│  │                      │  │                      │              │
│  │ materialController   │  │ authMiddleware       │              │
│  │ • getAllMaterials()  │  │ • Verify JWT token   │              │
│  │ • createMaterial()   │  │ • Extract user info  │              │
│  │ • updateMaterial()   │  │                      │              │
│  │ • deleteMaterial()   │  │ roleMiddleware       │              │
│  │                      │  │ • Check admin role   │              │
│  │ videoController      │  │                      │              │
│  │ • getAllVideos()     │  └──────────────────────┘              │
│  │ • createVideo()      │                                         │
│  │ • updateVideo()      │                                         │
│  │ • deleteVideo()      │                                         │
│  └──────────────────────┴────────────────────────────────────────┘
│         ↓                         ↓
│  ┌──────────────────────────────────────────────────────┐         │
│  │ Validation & Business Logic                          │         │
│  │ • Check required fields                              │         │
│  │ • Validate MongoDB IDs                               │         │
│  │ • Check subject/topic existence                      │         │
│  │ • Extract YouTube thumbnail                          │         │
│  │ • Handle errors gracefully                           │         │
│  └──────────────────────────────────────────────────────┘         │
│         ↓                                                          │
│  ┌──────────────────────────────────────────────────────┐         │
│  │ Models (Mongoose Schemas)                            │         │
│  │ • Material.js (title, content, reference, category)  │         │
│  │ • Video.js (title, url, thumbnail, duration)         │         │
│  │ • Subject.js, Topic.js (already exist)               │         │
│  └──────────────────────────────────────────────────────┘         │
│         ↓                                                          │
└─────────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Collections:                                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐│
│  │ materials        │  │ videos           │  │ subjects         ││
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤│
│  │ _id              │  │ _id              │  │ _id              ││
│  │ title            │  │ title            │  │ name             ││
│  │ subject (ref)    │  │ description      │  │ exam (ref)       ││
│  │ topic (ref)      │  │ videoUrl         │  │ ...              ││
│  │ content          │  │ thumbnail        │  │                  ││
│  │ referenceBook    │  │ duration         │  │                  ││
│  │ category         │  │ subject (ref)    │  │                  ││
│  │ createdAt        │  │ topic (ref)      │  │                  ││
│  │ updatedAt        │  │ instructor       │  │                  ││
│  │                  │  │ createdAt        │  │                  ││
│  │                  │  │ updatedAt        │  │                  ││
│  └──────────────────┘  └──────────────────┘  └──────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
StudentDashboard (Main Container)
│
├── ProgressHeader
├── ExamSelector (Sidebar)
├── SubjectSelector (Sidebar)
├── TopicSelector
│
└── Content Area (when topic selected)
    │
    ├── MaterialSection
    │   │
    │   ├── SectionHeader
    │   ├── CategoryFilter (buttons)
    │   ├── LoadingSpinner (while fetching)
    │   ├── EmptyState (if no materials)
    │   │
    │   └── MaterialsList
    │       │
    │       └── MaterialCard (repeated)
    │           ├── Header (Title + Category Badge)
    │           │   └── ExpandButton
    │           │
    │           └── Content (when expanded)
    │               ├── MetaInfo (Reference, Topic)
    │               ├── TextContent
    │               └── Footer (Date)
    │
    ├── VideoSection
    │   │
    │   ├── SectionHeader
    │   ├── LoadingSpinner
    │   ├── EmptyState
    │   │
    │   └── VideoGrid (CSS Grid)
    │       │
    │       └── VideoCard (repeated)
    │           ├── Thumbnail
    │           ├── DurationBadge
    │           ├── HoverOverlay
    │           │   └── WatchButton
    │           │
    │           └── InfoSection
    │               ├── Title
    │               ├── Description
    │               ├── MetaBadges
    │               └── WatchButton
    │
    └── QuizSection
        ├── QuizHeader
        ├── StartButton
        └── QuizComponent (when active)
            ├── Questions
            ├── Answers
            └── SubmitButton
```

---

## Material Card Variations

### State 1: Collapsed (Default)
```
┌────────────────────────────────────────────────────────────┐
│ 📚 Quadratic Equations Basics         [Formula] ▶         │
├────────────────────────────────────────────────────────────┤
(collapsed - only header visible)
```

### State 2: Expanded
```
┌────────────────────────────────────────────────────────────┐
│ 📚 Quadratic Equations Basics         [Formula] ▼         │
├────────────────────────────────────────────────────────────┤
│ Reference: NCERT Class 10    |  Topic: Algebra             │
├────────────────────────────────────────────────────────────┤
│ Content (scrollable if long):                              │
│                                                             │
│ A quadratic equation is an equation of the form ax² + bx   │
│ + c = 0, where a, b, and c are constants...                │
│                                                             │
│ [Scrollbar if content > 400px]                             │
├────────────────────────────────────────────────────────────┤
│ Created: 2024-02-20                                        │
└────────────────────────────────────────────────────────────┘
```

---

## Video Card Design

```
┌──────────────────────────────────┐
│                                  │
│    [Video Thumbnail]  16:9       │
│                       ┌─────┐    │
│                       │20min│    │
│    (on hover)         └─────┘    │
│    ┌──────────────┐              │
│    │ ▶ WATCH NOW │              │
│    └──────────────┘              │
│                                  │
├──────────────────────────────────┤
│ Calculus Derivatives             │
│ Learn the fundamentals of        │
│ derivatives with real world...   │
│                                  │
│ 👨‍🏫 Dr. Jane Doe    | Calculus    │
│                                  │
│     [WATCH VIDEO] ←────────────  │
└──────────────────────────────────┘
```

---

## Video Modal Player

```
┌─────────────────────────────────────────────────────────────┐
│ Calculus Derivatives            X                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │           [YouTube Video Player 16:9]              │   │
│  │                                                      │   │
│  │           [Playback Controls]      |  Duration    │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│ Learn the fundamentals of derivatives with real-world      │
│ examples and applications...                                │
│                                                              │
│ Instructor: Dr. Jane Doe         Topic: Calculus           │
│ Duration: 30 min                                            │
│                                                              │
│  [ 📥 DOWNLOAD NOTES ]  [ 🔗 SHARE ]                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Models

### Material Schema
```javascript
{
  _id: ObjectId,
  title: "String - Display name",
  subject: ObjectId (references Subject),
  topic: ObjectId (references Topic),
  content: "String - Can contain HTML/Markdown",
  referenceBook: "String - e.g., NCERT Class 12",
  category: "enum: [theory|formula|definition|example|note]",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

Example Document:
```json
{
  "_id": "64a1e2b3c4d5e6f7g8h9i0j1",
  "title": "Integration by Parts",
  "subject": ObjectId("63a0b1c2d3e4f5g6h7i8j9k0"),
  "topic": ObjectId("62z9y8x7w6v5u4t3s2r1q0p9"),
  "content": "Integration by parts is a method for finding integrals...",
  "referenceBook": "NCERT Class 12 Mathematics",
  "category": "formula",
  "createdAt": "2024-02-20T10:30:00Z",
  "updatedAt": "2024-02-20T10:30:00Z"
}
```

### Video Schema
```javascript
{
  _id: ObjectId,
  title: "String - Display name",
  description: "String - Detailed description",
  videoUrl: "String - YouTube or hosted video URL",
  thumbnail: "String - Auto-extracted from YouTube",
  duration: Number (seconds),
  subject: ObjectId (references Subject),
  topic: ObjectId (references Topic),
  instructor: "String - Instructor name",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

Example Document:
```json
{
  "_id": "64b2f3c4d5e6f7g8h9i0j1k2",
  "title": "Derivatives Explained",
  "description": "Complete tutorial covering differentiation rules...",
  "videoUrl": "https://www.youtube.com/watch?v=rAof9Ld5sOI",
  "thumbnail": "https://img.youtube.com/vi/rAof9Ld5sOI/hqdefault.jpg",
  "duration": 1234,
  "subject": ObjectId("63a0b1c2d3e4f5g6h7i8j9k0"),
  "topic": ObjectId("62z9y8x7w6v5u4t3s2r1q0p9"),
  "instructor": "Dr. John Smith",
  "createdAt": "2024-02-19T15:20:00Z",
  "updatedAt": "2024-02-19T15:20:00Z"
}
```

---

## Request/Response Flow Diagram

### Create Material Flow
```
Admin Form Submit
       ↓
Validate inputs ─── Invalid? → Show error message
       ↓ Valid
POST /api/materials
(with Authorization header)
       ↓
Backend: Check Role (admin?) ─── Not admin? → 403 Forbidden
       ↓ Admin
Validate/Transform data
       ↓
Check subject exists ─── Not found? → 404 Error
       ↓
Check topic exists ─── Not found? → 404 Error
       ↓
Save to MongoDB
       ↓ Success
Return 201 + created document
       ↓
Frontend: Show success message
       ↓
Refresh materials list
```

### Fetch Materials Flow
```
useEffect([selectedTopic]) triggered
       ↓
Show loading spinner
       ↓
GET /api/materials/topic/:topicId
       ↓
Backend: Query MongoDB
       ↓
Return 200 + materials array
       ↓
Frontend: Parse response
       ↓
Update state (setMaterials)
       ↓
Render MaterialCards
       ↓
Hide loading spinner
```

---

## Responsive Breakpoints

### Desktop (1200px+)
```
┌────────────────────────────────────────┐
│      StudentDashboard                  │
├──────────┬──────────────────────────────┤
│ Sidebar  │ Main Content                 │
│ 250px    │                              │
│          │ ┌─────────────────────────┐  │
│ Exams    │ │ MaterialSection         │  │
│ Subjects │ │ Grid 3 cols            │  │
│ Topics   │ │ (individual cards)      │  │
│          │ └─────────────────────────┘  │
│          │                              │
│          │ ┌─────────────────────────┐  │
│          │ │ VideoSection            │  │
│          │ │ Grid: 4 columns         │  │
│          │ │ 280px cards             │  │
│          │ └─────────────────────────┘  │
│          │                              │
│          │ ┌─────────────────────────┐  │
│          │ │ QuizSection             │  │
│          │ └─────────────────────────┘  │
└──────────┴──────────────────────────────┘
```

### Tablet (768px - 1199px)
```
┌─────────────────────────────────────┐
│  StudentDashboard (Full width)      │
├─────────────────────────────────────┤
│ Sidebar (collapsible)               │
├─────────────────────────────────────┤
│ Main Content                        │
│ ┌─────────────────────────────────┐ │
│ │ MaterialSection                 │ │
│ │ Grid: 2 columns                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ VideoSection                    │ │
│ │ Grid: 3 columns                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────────┐
│ StudentDashboard    │
├──────────────────────┤
│ [≡] Menu            │
├──────────────────────┤
│ Main Content        │
│ ┌──────────────────┐│
│ │MaterialSection   ││
│ │Grid: 1 column   ││
│ │Full width cards ││
│ └──────────────────┘│
│                      │
│ ┌──────────────────┐│
│ │VideoSection      ││
│ │Grid: 1 column   ││
│ │Single videos    ││
│ └──────────────────┘│
└──────────────────────┘
```

---

## File Organization

```
backend/
├── src/
│   ├── models/
│   │   ├── Material.js ✅ NEW
│   │   ├── Video.js ✅ NEW
│   │   └── ...
│   │
│   ├── controllers/
│   │   ├── materialController.js ✅ NEW
│   │   ├── videoController.js ✅ NEW
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── materialRoutes.js ✅ NEW
│   │   ├── videoRoutes.js ✅ NEW
│   │   └── ...
│   │
│   └── server.js (UPDATED)
│
└── package.json

frontend/
├── src/
│   ├── components/
│   │   ├── MaterialCard.js ✅ NEW
│   │   ├── MaterialCard.css ✅ NEW
│   │   ├── MaterialSection.js ✅ NEW
│   │   ├── MaterialSection.css ✅ NEW
│   │   ├── VideoCard.js ✅ NEW
│   │   ├── VideoCard.css ✅ NEW
│   │   ├── VideoModal.js ✅ NEW
│   │   ├── VideoModal.css ✅ NEW
│   │   ├── VideoSection.js ✅ NEW
│   │   ├── VideoSection.css ✅ NEW
│   │   └── ...
│   │
│   ├── services/
│   │   ├── materialService.js ✅ NEW
│   │   ├── videoService.js ✅ NEW
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── StudentDashboard.js (UPDATED)
│   │   └── ...
│   │
│   └── ...
│
└── package.json
```

---

## Summary

This complete system provides:

✅ **Backend:** Models, Controllers, Routes with proper validation
✅ **Frontend:** Components, Services, Styling with responsive design
✅ **Integration:** Complete flow from Admin create → DB store → Student view
✅ **UX:** Loading states, empty states, error messages
✅ **Scalability:** Structure ready for pagination, search, filtering
✅ **Security:** Role-based access, input validation, error handling

All pieces work together seamlessly! 🚀

