# 🚀 Mini CRM System

A full-stack Customer Relationship Management system with AI-powered lead scoring and automatic assignment capabilities.

## ✨ Features

- **📊 Lead Management**: Complete CRUD operations for lead management
- **🤖 AI Lead Scoring**: Automatic lead scoring (0-100) using Google Gemini AI
- **🎯 Auto-Assignment**: Smart lead assignment based on AI scores:
  - **High Priority (70-100)**: → Senior Sales Rep
  - **Medium Priority (40-69)**: → Junior Sales Rep  
  - **Low Priority (0-39)**: → Nurture Later
- **📈 Dashboard**: Real-time assignment distribution and lead analytics
- **🎨 Modern UI**: Clean, responsive interface with Material-UI components

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Material-UI (MUI) |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL with Sequelize ORM |
| **AI Integration** | Google Gemini AI (gemini-1.5-flash) |
| **Styling** | Material-UI Components & Custom CSS |

## 📁 Project Structure

```
crm-system/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── App.jsx    # Main application component
│   │   ├── App.css    # Styling
│   │   └── main.jsx   # Application entry point
│   ├── package.json
│   └── vite.config.js
├── backend/           # Node.js backend API
│   ├── config/
│   │   └── database.js      # Database configuration
│   ├── controllers/
│   │   └── leadController.js # Lead CRUD operations
│   ├── models/
│   │   └── Lead.js          # Lead database model
│   ├── routes/
│   │   └── leadRoutes.js    # API route definitions
│   ├── services/
│   │   ├── aiService.js     # Gemini AI integration
│   │   └── assignmentService.js # Auto-assignment logic
│   ├── .env             # Environment variables (create from .env.example)
│   ├── package.json
│   └── index.js         # Server entry point
├── .env.example       # Environment variables template
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))

### 1. Clone the Repository

```bash
git clone <repository-url>
cd crm-system
```

### 2. Database Setup

1. **Install PostgreSQL** (if not already installed)
2. **Create database and user**:

```sql
-- Connect to PostgreSQL as superuser
sudo -u postgres psql

-- Create database and user
CREATE DATABASE crm_db;
CREATE USER crm_user WITH ENCRYPTED PASSWORD 'crm_pass';
GRANT ALL PRIVILEGES ON DATABASE crm_db TO crm_user;

-- Exit PostgreSQL
\q
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp ../.env.example .env

# Edit .env file with your configurations
nano .env
```

**Configure your `.env` file:**

```env
PORT=5003
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_db
DB_USER=crm_user
DB_PASS=crm_pass
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Start the backend server:**

```bash
# Development mode (with auto-restart)
npm run dev

# OR Production mode
npm start
```

The backend will be running at `http://localhost:5003`

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at `http://localhost:5173`

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5003` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `crm_db` |
| `DB_USER` | Database username | `crm_user` |
| `DB_PASS` | Database password | `crm_pass` |
| `GEMINI_API_KEY` | Google Gemini AI API key | `AIzaSy...` |

## 📖 API Documentation

### Base URL: `http://localhost:5003/api/leads`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Get all leads |
| `GET` | `/:id` | Get lead by ID |
| `POST` | `/` | Create new lead |
| `PUT` | `/:id` | Update lead |
| `DELETE` | `/:id` | Delete lead |
| `POST` | `/:id/score` | **AI Score & Auto-assign lead** |

### Example API Usage

**Create a Lead:**
```bash
curl -X POST http://localhost:5003/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "source": "Website",
    "interestLevel": "High",
    "description": "Enterprise client with $100k budget"
  }'
```

**Score & Auto-assign:**
```bash
curl -X POST http://localhost:5003/api/leads/1/score
```

## 🤖 AI Integration Details

### Gemini AI Lead Scoring

The system uses Google Gemini AI to analyze leads based on:

- **Interest Level**: Customer's expressed interest
- **Source**: Lead acquisition channel  
- **Description**: Detailed lead information
- **Budget Indicators**: Financial capability signals
- **Urgency Factors**: Timeline requirements

### Auto-Assignment Logic

```javascript
if (score >= 70) {
  assignedTo = 'Senior Sales Rep';    // High-value leads
} else if (score >= 40) {
  assignedTo = 'Junior Sales Rep';    // Medium-value leads  
} else {
  assignedTo = 'Nurture Later';       // Low-value leads
}
```

## 🎨 UI Features

- **📊 Dashboard**: Real-time assignment statistics
- **🔍 Lead Details**: Comprehensive lead view with AI analysis
- **✏️ Inline Editing**: Edit leads directly in the table
- **🎯 Smart Actions**: Context-aware action buttons
- **📱 Responsive Design**: Works on all device sizes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**🎉 Happy CRM-ing!**