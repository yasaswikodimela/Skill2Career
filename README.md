
# 🎯 Skill2Career

### Learn, Grow, and Build Your Career

**Skill2Career** is a full-stack career development platform designed to help students discover job opportunities, analyze their skills, explore learning roadmaps, and manage their career journey. It also provides functionality for recruiters and administrators.

🌐 **Live Application:** [https://skill2careerr.netlify.app/](https://skill2careerr.netlify.app/)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#️-database-setup)
- [Deployment](#-deployment)
- [API Testing](#-api-testing)
- [Troubleshooting](#-troubleshooting)
- [Security](#-security)
- [Future Improvements](#-future-improvements)

---

## 🚀 Overview

Skill2Career aims to bridge the gap between students' skills and career opportunities by providing a centralized platform for career exploration and professional development.

The platform brings together student profiles, job discovery, skill analysis, career roadmaps, and application tracking in one place.

**Live Demo:** [Visit Skill2Career](https://skill2careerr.netlify.app/)

## ✨ Features

### 👨‍🎓 Student Features
- Student registration and login.
- Student profile management.
- Browse and search job opportunities.
- View job details and apply for suitable positions.
- Track job applications.
- Skill analysis and skill-gap identification.
- Career development and learning roadmaps.

### 🧑‍💼 Recruiter Features
- Recruiter account and profile management.
- Create and manage job listings.
- View applicants for job postings.

### 🛡️ Administrator Features
- Admin dashboard.
- Administrative views and management functionality.

### 🤖 AI-Powered Career Support
- Gemini API integration for supported AI features.
- AI-assisted skill and career guidance.
- Learning roadmap support.

> **Note:** Feature availability depends on backend configuration, database contents, and the current implementation. Sample jobs displayed in demo mode may not be stored in MongoDB.

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- Mongoose
- JSON Web Tokens (JWT)
- REST API

### Database
- MongoDB Atlas

### AI Integration
- Google Gemini API
- `@google/genai`

### Deployment
- Netlify — Frontend
- Render — Backend
- MongoDB Atlas — Database

## 📁 Project Structure

```text
Skill2Career/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── .gitignore
├── netlify.toml
├── render.yaml
└── README.md
```

## 💻 Getting Started

### Prerequisites

Install the following tools before running the project locally:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- Google AI Studio API key, if using Gemini-powered features.

### 1. Clone the Repository

```bash
git clone https://github.com/yasaswikodimela/Skill2Career.git
cd Skill2Career
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the `backend/` directory.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_random_secret
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

Replace the example values with your own credentials. Add other environment variables if your implementation requires them.

**Never commit your actual `.env` file or expose API keys, passwords, or JWT secrets.**

### 4. Start the Backend

From the `backend/` directory:

```bash
node src/index.js
```

If your `package.json` has a suitable start script, you can use:

```bash
npm start
```

The backend should run at:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open a second terminal at the project root:

```bash
cd frontend
npm install
```

### 6. Configure the Frontend

Create a `frontend/.env` file if your frontend uses `VITE_API_URL`.

```env
VITE_API_URL=http://localhost:5000
```

Check `frontend/src/api/api.js` to confirm whether the application appends `/api` to this base URL.

### 7. Start the Frontend

From the `frontend/` directory:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## 🔐 Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | Development or production environment |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used for signing and verifying JWTs |
| `FRONTEND_URL` | Allowed frontend origin for CORS |
| `GEMINI_API_KEY` | API key for Gemini-powered features |

Configure secrets through local environment files for development and the respective hosting dashboards for production.

## 🗄️ Database Setup

Skill2Career uses MongoDB Atlas for cloud database hosting.

1. Create a MongoDB Atlas account and cluster.
2. Create a database user with appropriate permissions.
3. Configure network access for your backend hosting environment.
4. Copy the Atlas connection string.
5. Store it in `MONGODB_URI`.
6. Restart the backend and verify the database connection.
7. Create application data through supported application workflows or development seed scripts.

Mongoose collections are generally created when documents are first inserted. Collection names and schemas are defined by the models in `backend/src/models/`.

## 🌐 Deployment

### Frontend — Netlify

Live URL: [https://skill2careerr.netlify.app/](https://skill2careerr.netlify.app/)

Recommended build configuration:

| Setting | Value |
|---|---|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `dist` |

Configure the production API URL through Netlify environment variables:

```env
VITE_API_URL=https://your-render-service.onrender.com
```

Use the base URL format expected by `frontend/src/api/api.js`. Redeploy the frontend after changing build-time environment variables.

### Backend — Render

Backend URL: [https://skill2career-x135.onrender.com](https://skill2career-x135.onrender.com)

Recommended configuration:

| Setting | Value |
|---|---|
| Root directory | `backend` |
| Build command | `npm install` |
| Start command | `node src/index.js` |

Configure the required environment variables in Render's dashboard, including `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`, `FRONTEND_URL`, and `GEMINI_API_KEY` if required.

Set `FRONTEND_URL` to the deployed Netlify origin:

```text
https://skill2careerr.netlify.app
```

Ensure the Express CORS configuration uses this variable and allows the deployed frontend origin.

### Database — MongoDB Atlas

The deployed backend connects to MongoDB Atlas using `MONGODB_URI`. Verify that the database connection is active before testing registration, job creation, or application submission.

## 🧪 API Testing

### Check Backend Health

Local:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

Deployed:

```text
https://skill2career-x135.onrender.com/api/health
```

A healthy database connection should report `databaseConnected: true`.

### Test the Jobs Endpoint

Local:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/jobs"
```

Deployed:

```text
https://skill2career-x135.onrender.com/api/jobs
```

An empty array means the endpoint returned no matching job records. Check the database contents, job schema, and API filters if you expected jobs to appear.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify the Atlas connection string and database credentials.
- Check Atlas Network Access settings.
- Review the backend deployment logs.
- Confirm that the deployed service can access the database.

### Frontend Cannot Connect to Backend
- Verify `VITE_API_URL`.
- Redeploy after changing Netlify environment variables.
- Check the browser Console and Network tabs.
- Confirm that the backend CORS configuration allows the Netlify domain.

### Jobs Show Demo Data
- Check whether the jobs endpoint returns actual records.
- Verify that jobs exist in MongoDB.
- Review job status filters and the Mongoose Job model.
- Remember that frontend fallback listings may be sample data.

### Login or Registration Fails
- Check backend logs and API responses.
- Verify required environment variables.
- Confirm MongoDB connectivity.
- Review authentication and authorization routes.

## 🔒 Security

- Never commit `.env` files or real credentials.
- Keep MongoDB credentials and API keys private.
- Use a strong JWT secret in production.
- Restrict database network access where possible.
- Enforce authorization for protected routes.
- Do not commit private resumes, uploaded documents, or user data.

## 🔮 Future Improvements

Potential improvements include:

- More personalized AI career recommendations.
- Advanced job matching based on student skills.
- Improved recruiter analytics.
- Additional learning resources and roadmap customization.
- More comprehensive testing and monitoring.
- Enhanced accessibility and mobile responsiveness.

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Commit your changes.
5. Open a pull request.

## 📄 License

No license has been specified yet. Add a license file if you intend to permit others to use, modify, or distribute this project.

---

### Skill2Career

**Learn, Grow, and Build Your Career.**

🌐 Live Application: [https://skill2careerr.netlify.app/](https://skill2careerr.netlify.app/)
