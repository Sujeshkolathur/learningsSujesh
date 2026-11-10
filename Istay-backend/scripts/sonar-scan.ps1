# Wait for SonarQube, bootstrap admin token if needed, run Maven Sonar scan.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$sonarUrl = "http://localhost:9000"
$tokenFile = Join-Path $root ".sonar-token"
$adminUser = "admin"
$adminPass = "Admin123!"   # set on first bootstrap from default "admin"

function Wait-SonarReady {
    Write-Host "Waiting for SonarQube at $sonarUrl ..."
    for ($i = 0; $i -lt 90; $i++) {
        try {
            $status = Invoke-RestMethod -Uri "$sonarUrl/api/system/status" -TimeoutSec 5
            if ($status.status -eq "UP") {
                Write-Host "SonarQube is UP"
                return
            }
            Write-Host "  status=$($status.status)"
        } catch {
            Write-Host "  not ready yet..."
        }
        Start-Sleep -Seconds 5
    }
    throw "SonarQube did not become UP in time"
}

function Get-BasicAuthHeader([string]$user, [string]$pass) {
    $pair = "${user}:${pass}"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($pair)
    return @{ Authorization = "Basic " + [Convert]::ToBase64String($bytes) }
}

function Ensure-AdminPassword {
    # Try default admin/admin; if it works, change password.
    try {
        $hdr = Get-BasicAuthHeader "admin" "admin"
        Invoke-RestMethod -Uri "$sonarUrl/api/authentication/validate" -Headers $hdr | Out-Null
        Write-Host "Changing default admin password..."
        Invoke-RestMethod -Method Post -Uri "$sonarUrl/api/users/change_password" -Headers $hdr `
            -Body @{ login = "admin"; previousPassword = "admin"; password = $adminPass } | Out-Null
    } catch {
        # Already changed or auth differs — continue with configured password
    }
}

function Get-OrCreate-Token {
    if (Test-Path $tokenFile) {
        return (Get-Content $tokenFile -Raw).Trim()
    }

    $hdr = Get-BasicAuthHeader $adminUser $adminPass
    $tokenName = "istay-backend-scan"
    try {
        $resp = Invoke-RestMethod -Method Post -Uri "$sonarUrl/api/user_tokens/generate" -Headers $hdr `
            -Body @{ name = $tokenName }
        $token = $resp.token
    } catch {
        # Token name may already exist without local file — revoke and recreate
        Invoke-RestMethod -Method Post -Uri "$sonarUrl/api/user_tokens/revoke" -Headers $hdr `
            -Body @{ name = $tokenName } -ErrorAction SilentlyContinue | Out-Null
        $resp = Invoke-RestMethod -Method Post -Uri "$sonarUrl/api/user_tokens/generate" -Headers $hdr `
            -Body @{ name = $tokenName }
        $token = $resp.token
    }
    Set-Content -Path $tokenFile -Value $token -NoNewline
    return $token
}

Wait-SonarReady
Ensure-AdminPassword
$token = Get-OrCreate-Token

Write-Host "Running tests + JaCoCo + Sonar analysis..."
mvn -q clean verify sonar:sonar "-Dsonar.token=$token"

Write-Host ""
Write-Host "Done. Open: $sonarUrl/dashboard?id=istay-backend"
Write-Host "Login: admin / $adminPass"
