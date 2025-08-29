@echo off
echo Deleting unwanted files in onboarding folder...
cd c:\Users\sarxx\Downloads\frontend-1\src\features\onboarding

del /F "CandidateUploads.clean.tsx"
del /F "CandidateUploads.final.tsx"
del /F "CandidateUploads.fixed.tsx"
del /F "CandidateUploads.new.tsx"
del /F "CandidateUploads.tsx.new"
del /F "CandidateUploadsFixed.tsx"
del /F "CandidateUploadsRefactored.tsx"
del /F "clean-CandidateUploads.tsx"
del /F "CandidateUploads.tsx"

echo Done.
