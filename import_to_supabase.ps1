# Import Schema to Supabase using psql
# This script imports the pgadmin.sql schema to your Supabase database

$env:PGPASSWORD = "2vfH8NErpLVrduyI"

$ConnectionString = "postgresql://postgres@db.hqlavmhxafrfxbfirjpd.supabase.co:5432/postgres?sslmode=require"

Write-Host "🔌 Connecting to Supabase..." -ForegroundColor Green
Write-Host "Host: db.hqlavmhxafrfxbfirjpd.supabase.co" -ForegroundColor Yellow
Write-Host ""

# Test connection first
Write-Host "Testing connection..." -ForegroundColor Cyan
psql "$ConnectionString" -c "SELECT version();"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Connection successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📂 Importing schema from pgadmin.sql..." -ForegroundColor Cyan
    
    # Import schema
    psql "$ConnectionString" -f "pgadmin.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Schema imported successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Verifying tables..." -ForegroundColor Cyan
        psql "$ConnectionString" -c "\dt"
        
        Write-Host ""
        Write-Host "🎉 Database setup complete!" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Schema import failed!" -ForegroundColor Red
    }
}
else {
    Write-Host "❌ Connection failed!" -ForegroundColor Red
    Write-Host "Error: Could not connect to Supabase database" -ForegroundColor Red
}

# Clear password from environment
Remove-Item Env:\PGPASSWORD
