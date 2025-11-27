from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.app.database import get_db
from api.app.routers import auth, users, dashboard, leads
from api.app.core.config import Settings

settings = Settings()

app = FastAPI(
    title="Marketing Dashboard API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(leads.router, prefix="/api/leads", tags=["Leads"])

@app.get("/")
async def root():
    return {"message": "Marketing Dashboard API", "version": "1.0.0"}

@app.get("/api/health")
async def health():
    return {"status": "healthy"}
