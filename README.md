# Marketing Dashboard Backend API

A complete FastAPI backend for the Marketing Dashboard application with MySQL database integration.

## Features

- **Authentication & Authorization**: JWT-based authentication with secure password hashing
- **User Management**: User registration, login, profile management
- **Lead Management**: CRUD operations for leads with status tracking
- **Dashboard Analytics**: Overview metrics, revenue tracking, campaign performance
- **Notifications**: Real-time notification system
- **Database**: MySQL with SQLAlchemy ORM
- **API Documentation**: Auto-generated with FastAPI (Swagger/OpenAPI)
- **Security**: Password validation, secure token handling
- **Docker Support**: Complete containerization setup

## Project Structure

\`\`\`
app/
├── main.py                 # FastAPI application entry point
├── database.py            # Database configuration
├── models.py              # SQLAlchemy models
├── schemas.py             # Pydantic schemas
├── core/
│   ├── config.py          # Application configuration
│   ├── security.py        # Security utilities (JWT, password hashing)
│   └── deps.py            # Dependency injection
├── crud/
│   ├── user.py            # User CRUD operations
│   ├── lead.py            # Lead CRUD operations
│   └── notification.py    # Notification CRUD operations
└── routers/
    ├── auth.py            # Authentication endpoints
    ├── users.py           # User management endpoints
    ├── dashboard.py       # Dashboard analytics endpoints
    ├── leads.py           # Lead management endpoints
    └── notifications.py   # Notification endpoints
\`\`\`

## Quick Start

### 1. Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd marketing-dashboard-backend

# Start with Docker Compose
docker-compose up -d

# The API will be available at http://localhost:8000