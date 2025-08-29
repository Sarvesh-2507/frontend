@echo off
echo ===================================================
echo THOROUGH CLEANUP - REMOVING ALL UNNECESSARY FILES
echo ===================================================

echo.
echo This script will permanently delete unnecessary files.
echo Press Ctrl+C now to cancel if you're unsure.
echo.
pause

cd /d "C:\Users\sarxx\Downloads\frontend-1"

echo.
echo [1/9] Removing all cleanup batch files...
del /F /S /Q cleanup_*.bat

echo.
echo [2/9] Removing COMPANYFEEDS_ENHANCEMENT temporary files...
del /F /S /Q COMPANYFEEDS_ENHANCEMENT*.md
:: Keep only the final version if needed

echo.
echo [3/9] Removing temporary database files...
del /F /S /Q db_*.json

echo.
echo [4/9] Removing all candidate uploads fix files...
del /F /S /Q fix_candidate_uploads*.*
del /F /S /Q fix-candidate-uploads*.*
del /F /S /Q fix-candidateuploads*.*

echo.
echo [5/9] Removing all fix script files...
del /F /S /Q fix-file*.ps1
del /F /S /Q fix-uploads*.ps1

echo.
echo [6/9] Removing temporary server versions...
del /F /S /Q server_*.cjs
del /F /S /Q server_*.js

echo.
echo [7/9] Removing the entire .history folder...
if exist .history rmdir /S /Q .history

echo.
echo [8/9] Removing debug and test files...
if exist src\components\Debug*.tsx del /F /Q src\components\Debug*.tsx
if exist src\components\*Debugger.tsx del /F /Q src\components\*Debugger.tsx
if exist src\components\*Tester.tsx del /F /Q src\components\*Tester.tsx
if exist src\App*.simple.tsx del /F /Q src\App*.simple.tsx
if exist src\App*.minimal.tsx del /F /Q src\App*.minimal.tsx
if exist src\App-minimal.tsx del /F /Q src\App-minimal.tsx
if exist test*.js del /F /Q test*.js
if exist test*.ps1 del /F /Q test*.ps1
if exist public\test*.html del /F /Q public\test*.html
if exist diagnose.html del /F /Q diagnose.html

echo.
echo [9/9] Cleaning up current directory files...
if exist fix-candidate-uploads.ps1 del /F /Q fix-candidate-uploads.ps1
if exist fix-candidateuploads.bat del /F /Q fix-candidateuploads.bat
if exist fix-file.ps1 del /F /Q fix-file.ps1
if exist fix-uploads.ps1 del /F /Q fix-uploads.ps1

echo.
echo ===================================================
echo Cleanup Complete!
echo ===================================================
echo.
echo All unnecessary files have been permanently deleted.
echo.
pause
