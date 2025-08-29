$filePath = "src\features\onboarding\CandidateUploads.tsx"
$content = Get-Content -Path $filePath -Raw
$exportIndex = $content.IndexOf("export default CandidateUploads;")
if ($exportIndex -ne -1) {
    $newContent = $content.Substring(0, $exportIndex + "export default CandidateUploads;".Length)
    $newContent | Set-Content -Path $filePath -NoNewline
    Write-Host "File successfully truncated at 'export default CandidateUploads;'"
} else {
    Write-Host "Could not find 'export default CandidateUploads;' in the file"
}
