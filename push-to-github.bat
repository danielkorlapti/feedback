@echo off
setlocal enabledelayedexpansion
title Student Feedback - GitHub Push Assistant
color 0b

echo ======================================================================
echo    Student Feedback Sentiment Analysis - GitHub Push Assistant
echo ======================================================================
echo.
echo Target Account: monikaandraju2303-gif
echo.
echo Choose an option to push to GitHub:
echo   [1] Push using browser sign-in (opens GitHub in browser to log in)
echo   [2] Push using GitHub Personal Access Token (PAT)
echo   [3] Push to 'Student-Feedback-Sentiment-Analysis' repository
echo.
set /p opt="Enter choice [1, 2, or 3] (default 1): "

if "%opt%"=="" set opt=1

if "%opt%"=="1" (
    echo.
    echo ------------------------------------------------------------------
    echo Setting remote to https://github.com/monikaandraju2303-gif/feedback.git
    echo A browser window will open to sign into Monika's GitHub account.
    echo ------------------------------------------------------------------
    git remote set-url origin https://github.com/monikaandraju2303-gif/feedback.git
    git add .
    git commit -m "feat: complete student feedback platform with resilient dual-layer AI and Vercel routing" 2>nul
    git push -u origin main
)

if "%opt%"=="2" (
    echo.
    echo Paste Monika's GitHub Personal Access Token (starts with ghp_ or github_pat_):
    set /p token="Token: "
    if "!token!"=="" (
        echo No token entered. Aborting.
        pause
        exit /b 1
    )
    echo Pushing with provided token...
    git add .
    git commit -m "feat: complete student feedback platform with resilient dual-layer AI and Vercel routing" 2>nul
    git push https://!token!@github.com/monikaandraju2303-gif/feedback.git main --force
)

if "%opt%"=="3" (
    echo.
    echo Setting remote to https://github.com/monikaandraju2303-gif/Student-Feedback-Sentiment-Analysis.git
    git remote set-url origin https://github.com/monikaandraju2303-gif/Student-Feedback-Sentiment-Analysis.git
    git add .
    git commit -m "feat: complete student feedback platform with resilient dual-layer AI and Vercel routing" 2>nul
    git push -u origin main
)

echo.
echo ======================================================================
if %errorlevel% equ 0 (
    echo  SUCCESS! Changes pushed to GitHub successfully.
    echo  Vercel will now automatically trigger a new deployment.
) else (
    echo  Push encountered an issue. See above for GitHub message.
)
echo ======================================================================
echo.
pause
