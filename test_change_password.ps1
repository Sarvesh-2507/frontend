# PowerShell script to test Change Password API
# Usage: .\test_change_password.ps1 -Token "your_token" -CurrentPassword "current" -NewPassword "new"

param(
    [Parameter(Mandatory=$true)]
    [string]$Token,
    
    [Parameter(Mandatory=$true)]
    [string]$CurrentPassword,
    
    [Parameter(Mandatory=$true)]
    [string]$NewPassword,
    
    [string]$ApiUrl = "http://192.168.1.132:8000/api/change-password/"
)

Write-Host "🚀 Testing Change Password API" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "API URL: $ApiUrl" -ForegroundColor Yellow
Write-Host "Token: $($Token.Substring(0, [Math]::Min(20, $Token.Length)))..." -ForegroundColor Yellow
Write-Host ""

# Test cases with different field name formats
$testCases = @(
    @{
        Name = "Format 1: current_password + new_password"
        Body = @{
            current_password = $CurrentPassword
            new_password = $NewPassword
        }
    },
    @{
        Name = "Format 2: old_password + new_password"
        Body = @{
            old_password = $CurrentPassword
            new_password = $NewPassword
        }
    },
    @{
        Name = "Format 3: Django default format"
        Body = @{
            old_password = $CurrentPassword
            new_password1 = $NewPassword
            new_password2 = $NewPassword
        }
    },
    @{
        Name = "Format 4: camelCase format"
        Body = @{
            currentPassword = $CurrentPassword
            newPassword = $NewPassword
        }
    }
)

function Test-ApiEndpoint {
    param(
        [string]$Name,
        [hashtable]$Body
    )
    
    Write-Host "🧪 Testing: $Name" -ForegroundColor Green
    Write-Host "📤 Request Body: $($Body | ConvertTo-Json -Compress)" -ForegroundColor Gray
    
    try {
        $headers = @{
            "Authorization" = "Bearer $Token"
            "Content-Type" = "application/json"
        }
        
        $jsonBody = $Body | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri $ApiUrl -Method POST -Headers $headers -Body $jsonBody -ErrorAction Stop
        
        Write-Host "✅ SUCCESS!" -ForegroundColor Green
        Write-Host "📥 Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Green
        Write-Host ""
        
        return @{
            Success = $true
            Response = $response
            Format = $Name
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $statusDescription = $_.Exception.Response.StatusDescription
        
        Write-Host "❌ FAILED: $statusCode $statusDescription" -ForegroundColor Red
        
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "📥 Error Response: $errorBody" -ForegroundColor Red
        }
        catch {
            Write-Host "📥 Error Details: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        Write-Host ""
        
        return @{
            Success = $false
            Error = $_.Exception.Message
            StatusCode = $statusCode
            Format = $Name
        }
    }
}

# Run all test cases
$results = @()
foreach ($testCase in $testCases) {
    $result = Test-ApiEndpoint -Name $testCase.Name -Body $testCase.Body
    $results += $result
    
    # Wait 1 second between requests
    Start-Sleep -Seconds 1
}

# Summary
Write-Host "📊 SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$successfulFormats = $results | Where-Object { $_.Success -eq $true }
$failedFormats = $results | Where-Object { $_.Success -eq $false }

if ($successfulFormats.Count -gt 0) {
    Write-Host "✅ Successful Formats:" -ForegroundColor Green
    foreach ($format in $successfulFormats) {
        Write-Host "   - $($format.Format)" -ForegroundColor Green
    }
} else {
    Write-Host "❌ No successful formats found!" -ForegroundColor Red
}

if ($failedFormats.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ Failed Formats:" -ForegroundColor Red
    foreach ($format in $failedFormats) {
        Write-Host "   - $($format.Format) (Status: $($format.StatusCode))" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "💡 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Use the successful format in your frontend code" -ForegroundColor White
Write-Host "2. If all formats failed, check your Django backend implementation" -ForegroundColor White
Write-Host "3. Verify your token is valid and not expired" -ForegroundColor White
Write-Host "4. Check Django logs for detailed error messages" -ForegroundColor White

# Generate curl commands for successful formats
if ($successfulFormats.Count -gt 0) {
    Write-Host ""
    Write-Host "🔧 Curl Commands for Successful Formats:" -ForegroundColor Cyan
    foreach ($format in $successfulFormats) {
        $testCase = $testCases | Where-Object { $_.Name -eq $format.Format }
        $jsonBody = $testCase.Body | ConvertTo-Json -Compress
        Write-Host "# $($format.Format)" -ForegroundColor Gray
        Write-Host "curl -X POST '$ApiUrl' \\" -ForegroundColor White
        Write-Host "  -H 'Authorization: Bearer $Token' \\" -ForegroundColor White
        Write-Host "  -H 'Content-Type: application/json' \\" -ForegroundColor White
        Write-Host "  -d '$jsonBody'" -ForegroundColor White
        Write-Host ""
    }
}
