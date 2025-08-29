@echo off
echo ===================================================
echo TARGETED CLEANUP - REMOVING FILES FROM SCREENSHOTS
echo ===================================================

echo Deleting cleanup batch files...
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\cleanup_20250829174442.bat"
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\cleanup_20250829174610.bat"
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\cleanup_20250829174710.bat"
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\cleanup_20250829174825.bat"
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\cleanup_20250829175152.bat"

echo Deleting COMPANYFEEDS_ENHANCEMENT files...
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\COMPANYFEEDS_ENHANCEMENT*"

echo Deleting temporary database files...
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\db_20250829180156.json"
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\db_20250829180718.json"

echo Deleting fix_candidate_uploads files...
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\fix_candidate_uploads_*"

echo Deleting fix-candidate-uploads files...
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\fix-candidate-uploads_*"
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\fix-candidate-uploads.ps1"

echo Deleting fix-candidateuploads files...
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\fix-candidateuploads_*"
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\fix-candidateuploads.bat"

echo Deleting fix-file files...
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\fix-file_*"
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\fix-file.ps1"

echo Deleting fix-uploads files...
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\fix-uploads_*"
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\fix-uploads.ps1"

echo Deleting server version files...
del /F /Q "C:\Users\sarxx\Downloads\frontend-1\server_*"

echo Deleting .history folder...
rmdir /S /Q "C:\Users\sarxx\Downloads\frontend-1\.history"

echo ===================================================
echo Cleanup Complete!
echo ===================================================
