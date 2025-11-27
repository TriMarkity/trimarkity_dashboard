@echo off
REM -------------------------------
REM TriMarkity Vercel Automated Deployment
REM -------------------------------

REM 1️⃣ Login to Vercel


REM 2️⃣ Initialize project & link (run once)
vercel --confirm

REM 3️⃣ Add environment variables from .env.production
for /f "tokens=1,2 delims==" %%A in (.env.production) do (
    vercel env add %%A production
)

REM 4️⃣ Deploy to production and capture URL
for /f "tokens=*" %%i in ('vercel --prod --confirm') do set DEPLOY_URL=%%i

REM 5️⃣ Extract deployed domain from URL output
for /f "tokens=2 delims=: " %%a in ("%DEPLOY_URL%") do set VERCEL_URL=%%a

REM 6️⃣ Set NEXT_PUBLIC_API_URL automatically
vercel env add NEXT_PUBLIC_API_URL production --value https://%VERCEL_URL%

REM 7️⃣ Pull all production envs to local .env.local
vercel env pull .env.local

echo Deployment complete! Your API URL is: https://%VERCEL_URL%
pause
