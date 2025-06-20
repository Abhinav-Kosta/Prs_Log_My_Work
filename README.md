# LogMyWork - Faculty Research Tracking System

<div align="center">
  <img src="./public/images/logo.webp" alt="LogMyWork Logo" width="200">
  <h3>Streamline Academic Contribution Tracking</h3>
</div>

## 📋 Overview

LogMyWork (FacultyTrack) is a comprehensive web platform designed for academic institutions to efficiently track and manage faculty research contributions. The system provides a centralized solution for faculty members to log their academic activities, including research papers, patents, projects, book publications, seminars, and awards.

## 🔑 Demo Login
To explore the application, you can use the following demo accounts:

### HOI Account
- **Username**: hoi001
- **Password**: HOIpass1

### Faculty Account
- **Username**: fac001
- **Password**: FacPass1

Simply navigate to the login page and enter the credentials above to access the respective dashboards.

## ✨ Features

### 👥 User Roles

- **Faculty Members**: Log and track personal academic contributions
- **HOI (Head of Institution)**: View and manage department-wide contributions
- **Admin**: System management and user administration

### 📊 Contribution Tracking

- **Publications**: Journal articles, conference papers, etc.
- **Patents**: Filed and granted patents
- **Academic Events**: Seminars, workshops, conferences
- **Books/Book Chapters**: Published books and chapters
- **Awards**: Recognition and achievements
- **Projects**: Research projects and grants

### 📈 Analytics & Reporting

- **Dashboard**: Visual representation of academic contributions
- **Filtering**: Filter by time periods (monthly, quarterly, half-yearly, yearly)
- **Export**: Generate Excel reports of contributions

### 🔐 Authentication & Security

- Secure login system with role-based access control
- Password management
- Session management

## 🛠️ Technologies Used

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling
- **Passport.js**: Authentication middleware

### Frontend
- **EJS**: Templating engine
- **Bootstrap**: CSS framework for responsive design
- **JavaScript**: Client-side functionality

### Cloud Services
- **Cloudinary**: Cloud storage for proof documents and images
- **MongoDB Atlas**: Cloud database service

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.19.1 recommended)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/LogMyWork.git
   cd LogMyWork
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   ATLASDB_URL=your_mongodb_connection_string
   SECRET=your_session_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_KEY=your_cloudinary_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   ```

4. Start the application
   ```bash
   node app.js
   ```

5. Access the application at `http://localhost:8080`

## 📁 Project Structure

```
├── controllers/       # Route controllers
├── models/           # Database models
├── public/           # Static assets
│   ├── css/          # Stylesheets
│   ├── images/       # Images
│   └── js/           # Client-side JavaScript
├── routes/           # Application routes
├── utils/            # Utility functions
├── views/            # EJS templates
│   ├── academics/    # Academic event views
│   ├── admin/        # Admin views
│   ├── awards/       # Award views
│   ├── books/        # Book publication views
│   ├── faculty/      # Faculty views
│   ├── hoi/          # HOI views
│   ├── includes/     # Reusable view components
│   ├── layouts/      # Page layouts
│   ├── patents/      # Patent views
│   ├── projects/     # Project views
│   ├── publications/ # Publication views
│   └── users/        # User-related views
├── app.js            # Application entry point
├── middleware.js     # Custom middleware
└── schema.js         # Validation schemas
```

## 🔄 Workflow

1. **User Authentication**: Faculty members, HOIs, and admins log in with their credentials
2. **Dashboard View**: Users see a summary of their contributions
3. **Contribution Management**: Users can add, edit, view, and delete their academic contributions
4. **Filtering & Reporting**: Filter contributions by time period and export data as needed

## 📝 License

ISC

## 👨‍💻 Author

Abhinav Kosta

---

<div align="center">
  <p>Track, Manage, and Showcase Academic Excellence</p>
</div>