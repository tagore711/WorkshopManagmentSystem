# KTM Database Export Script
# Replace the connection URL below with your actual Render database URL

# STEP 1: Replace this with your actual Render database URL from dashboard
$DATABASE_URL = "postgres://YOUR_USER:YOUR_PASSWORD@dpg-xxxxx.oregon-postgres.render.com/YOUR_DATABASE"

# STEP 2: Set backup file location
$BACKUP_FILE = "c:\Users\aryan\Desktop\ktm_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"

# STEP 3: Run pg_dump
Write-Host "Starting database export..." -ForegroundColor Green
Write-Host "Connection: $DATABASE_URL" -ForegroundColor Yellow
Write-Host "Saving to: $BACKUP_FILE" -ForegroundColor Yellow

pg_dump "$DATABASE_URL" > $BACKUP_FILE

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nExport successful!" -ForegroundColor Green
    Write-Host "Backup saved to: $BACKUP_FILE" -ForegroundColor Cyan
    Write-Host "File size: $((Get-Item $BACKUP_FILE).Length) bytes" -ForegroundColor Cyan
} else {
    Write-Host "`nExport failed! Check the error above." -ForegroundColor Red
}
