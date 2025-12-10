# Screenshot Capture Script Runner
# This script will capture all screenshots automatically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Screenshot Capture Automation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if server is running
Write-Host "Checking if development server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Server is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Server is not running. Starting development server..." -ForegroundColor Red
    Write-Host "Please run 'npm run dev' in a separate terminal first." -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Starting screenshot capture..." -ForegroundColor Yellow
Write-Host "This will take approximately 3-5 minutes." -ForegroundColor Yellow
Write-Host "Please do not close this window." -ForegroundColor Yellow
Write-Host ""

# Run the screenshot script
node capture-screenshots.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Screenshot Capture Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# Count screenshots
$screenshotCount = (Get-ChildItem screenshots -Filter *.jpg | Measure-Object).Count
Write-Host ""
Write-Host "Total screenshots captured: $screenshotCount" -ForegroundColor Green
Write-Host "Location: screenshots\" -ForegroundColor Cyan
Write-Host ""

if ($screenshotCount -gt 0) {
    Write-Host "Screenshots:" -ForegroundColor Yellow
    Get-ChildItem screenshots -Filter *.jpg | Select-Object Name, @{Name="Size (KB)";Expression={[math]::Round($_.Length/1KB,2)}} | Format-Table -AutoSize
}




