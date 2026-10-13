# PowerShell Certificate Generation Helper for HTTPS Demonstration
# Generates a 2048-bit RSA self-signed certificate with Subject Alternative Names (SAN)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$certDir = Join-Path (Split-Path -Parent $scriptDir) "cert"
$keyFile = Join-Path $certDir "server.key"
$certFile = Join-Path $certDir "server.cert"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   HTTPS Educational Demo - Certificate Generator         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not (Test-Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir | Out-Null
}

if ((Get-Command "openssl" -ErrorAction SilentlyContinue)) {
    Write-Host "[OK] OpenSSL detected." -ForegroundColor Green
    Write-Host "Generating self-signed certificate with OpenSSL..." -ForegroundColor Yellow
    
    $subj = "/C=US/ST=Local/L=Localhost/O=HTTPS Educational Demo/CN=localhost"
    $san = "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1"
    
    openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 365 `
        -keyout "$keyFile" `
        -out "$certFile" `
        -subj "$subj" `
        -addext "$san"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Certificate and key created:" -ForegroundColor Green
        Write-Host "  Private Key: $keyFile" -ForegroundColor Gray
        Write-Host "  Certificate: $certFile" -ForegroundColor Gray
    } else {
        Write-Host "[ERROR] OpenSSL failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[WARN] OpenSSL not found in PATH." -ForegroundColor Yellow
    Write-Host "You can also install mkcert (https://github.com/FiloSottile/mkcert) for locally trusted certificates:" -ForegroundColor Cyan
    Write-Host "  choco install mkcert" -ForegroundColor Gray
    Write-Host "  mkcert -install" -ForegroundColor Gray
    Write-Host "  mkcert -key-file $keyFile -cert-file $certFile localhost 127.0.0.1 ::1" -ForegroundColor Gray
    exit 1
}
