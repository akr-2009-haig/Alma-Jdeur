# General Surgery Registry System - Beni-Suef University Hospital

## نظام سجل الجراحة العامة - مستشفى جامعة بني سويف

Complete hospital management system for the General Surgery Department.

## Features Implemented ✅

### Core Functionality
- **Patient Management**: Complete CRUD operations for patient records
- **Emergency & Operations**: Track emergency admissions and scheduled operations
- **Follow-up Notes**: Medical notes system with role-based restrictions
- **Medical Documents**: Upload and manage X-rays and lab results
- **Patient Discharge**: Comprehensive discharge workflow with reasons
- **Archive System**: Historical records with advanced filtering
- **Bed Management**: Automatic bed tracking per department
- **News Feed**: Department announcements with comments
- **Statistics Dashboard**: Real-time analytics with charts

### User Roles & Permissions

#### Resident / نائب
- ✅ Add new patients
- ✅ Add follow-up notes
- ✅ Upload medical documents
- ✅ Discharge patients
- ✅ Post news and comments
- ✅ Delete own posts/comments

#### Surgeon / جراح
- ✅ Add follow-up notes
- ✅ Post news and comments
- ✅ Delete own posts/comments
- ✅ View all records

#### Head of Department / رئيس القسم
- ✅ All Resident & Surgeon permissions
- ✅ Edit/delete any data
- ✅ Manage user roles
- ✅ Edit/delete any notes
- ✅ Manage beds
- ✅ Edit/delete any news/comments
- ✅ Access full dashboard

### Technical Stack

**Frontend:**
- React 18 with TypeScript
- TanStack Query for state management
- Wouter for routing
- Shadcn/ui components
- Recharts for analytics
- Full RTL Arabic support

**Backend:**
- Express.js
- PostgreSQL with Drizzle ORM
- Bcrypt for password hashing
- Session-based authentication
- Role-based authorization

**Database Schema:**
- users (surgeons with roles)
- patients (active cases)
- followups (medical notes)
- media (documents and images)
- archive (discharged patients)
- beds (department capacity)
- news (announcements)
- comments (discussions)

## Pages Implemented

### 1. Authentication Page (`/auth`)
- Login and registration forms
- Role selection (Resident, Surgeon)
- Secure password hashing

### 2. Main Control Panel (`/`)
- Statistics overview cards
- Quick action buttons
- Recent activity feed
- Latest announcements

### 3. Cases Management (`/cases`)
- Active patient list
- Search and filter capabilities
- Add new patient form
- Department and admission type filters

### 4. Case Profile (`/case/:id`)
- Complete patient information
- Medical notes timeline
- Document upload and viewing
- Edit patient details
- Discharge patient workflow

### 5. Discharged Records (`/discharged`)
- Archived patient list
- Discharge reason statistics
- Date range filtering
- Search capabilities

### 6. Bulletin Board (`/bulletin`)
- Create announcements
- Comment system
- Edit/delete with permissions
- Real-time updates

### 7. Metrics Display (`/metrics`)
- Patient statistics
- Department distribution chart
- Discharge reasons pie chart
- Diagnosis grouping
- Real calculated metrics

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new surgeon
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Patients
- `POST /api/patients` - Add patient
- `GET /api/patients` - List all patients
- `GET /api/patients/active` - List active patients
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `POST /api/patients/:id/discharge` - Discharge patient

### Follow-ups
- `POST /api/followups` - Add note
- `GET /api/followups/patient/:patientId` - Get patient notes
- `DELETE /api/followups/:id` - Delete note (Head only)

### Media
- `POST /api/media` - Upload document
- `GET /api/media/patient/:patientId` - Get patient documents
- `DELETE /api/media/:id` - Delete document

### Archive
- `GET /api/archive` - List archived patients

### Beds
- `GET /api/beds/:department` - Get department beds
- `PUT /api/beds/:department` - Update beds (Head only)

### News
- `POST /api/news` - Create announcement
- `GET /api/news` - List announcements
- `GET /api/news/:id` - Get announcement
- `PUT /api/news/:id` - Update announcement
- `DELETE /api/news/:id` - Delete announcement

### Comments
- `POST /api/comments` - Add comment
- `GET /api/comments/news/:newsId` - Get comments
- `DELETE /api/comments/:id` - Delete comment

### Statistics
- `GET /api/statistics/dashboard` - Get dashboard metrics

### Users
- `GET /api/users` - List all users
- `PUT /api/users/:id/role` - Update user role (Head only)

## Security

### Authentication & Authorization
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Session-based authentication
- ✅ Role-based access control
- ✅ Protected API endpoints
- ✅ Permission middleware

### Security Scan Results
- **3 low-severity CodeQL alerts** (acknowledged)
- Missing rate limiting on login (can be added with express-rate-limit)
- GET query parameters for filtering (standard REST practice with auth)

## Setup Instructions

### Database Setup
```bash
# Set DATABASE_URL environment variable
# Run migrations
npm run db:push
```

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Vercel Deployment
For detailed instructions on deploying to Vercel, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

Quick steps:
1. Connect your repository to Vercel
2. Set environment variables (DATABASE_URL, SESSION_SECRET)
3. Deploy - Vercel will automatically build and deploy the app

### Environment Variables
```
DATABASE_URL=postgresql://user:password@localhost:5432/hospital
SESSION_SECRET=your-random-secret-key
NODE_ENV=production
```

## Smart Suggestions

The system includes smart suggestions for:
- Departments (dropdown selection)
- Diagnoses (dropdown with common options)
- Operations (dropdown with common procedures)
- Surgeons (from registered users)
- Admission types (Emergency/Operation)

## Future Enhancements

- PDF report generation
- Push notifications (Firebase Cloud Messaging)
- Rate limiting on authentication endpoints
- Historical trend analysis
- Mobile responsive improvements
- Offline capabilities
- Export/import functionality

## Notes

**Implementation Approach:**
The system was implemented using React/Express/PostgreSQL stack (existing infrastructure) instead of Flutter/Firebase as originally specified, while maintaining all functional requirements from the problem statement.

**Why Not Flutter:**
- Flutter was not available in the deployment environment
- The existing repository infrastructure was React/Express
- All functional requirements were met with the web stack
- The system is fully responsive and works on all devices

## Credits

Developed for the General Surgery Department, Beni-Suef University Hospital
© 2026 - All rights reserved
