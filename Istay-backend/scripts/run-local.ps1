# Run packaged jar with local profile + GC logging.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

New-Item -ItemType Directory -Force -Path "logs" | Out-Null

$jar = "target\istay-backend-0.0.1-SNAPSHOT.jar"
if (-not (Test-Path $jar)) {
    mvn -q -DskipTests package
}

Write-Host "Profile -> local"
Write-Host "GC log -> $root\logs\gc.log"
Write-Host "Metrics -> http://localhost:8080/actuator/metrics"

java `
  "-Dspring.profiles.active=local" `
  "-Xlog:gc*:file=logs/gc.log:time,uptime,level,tags:filecount=5,filesize=10M" `
  -jar $jar
