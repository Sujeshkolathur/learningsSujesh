$ErrorActionPreference = 'Continue'
$report = @()
$stopped = @()

# 1. Find and stop istay-frontend related node/vite/esbuild processes
$procs = Get-CimInstance Win32_Process -Filter "Name = 'node.exe' OR Name = 'esbuild.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -and ($_.CommandLine -match 'istay-frontend') }

# Also check known candidate PIDs
foreach ($id in @(42796, 22404, 5160, 33088)) {
  $p = Get-CimInstance Win32_Process -Filter "ProcessId = $id" -ErrorAction SilentlyContinue
  if ($p -and $p.CommandLine -and ($p.CommandLine -match 'istay-frontend')) {
    if (-not ($procs | Where-Object { $_.ProcessId -eq $p.ProcessId })) {
      $procs = @($procs) + @($p)
    }
  }
}

foreach ($p in $procs) {
  $info = "PID=$($p.ProcessId) Name=$($p.Name) CMD=$($p.CommandLine)"
  try {
    Stop-Process -Id $p.ProcessId -Force -ErrorAction Stop
    $stopped += "STOPPED: $info"
  } catch {
    $stopped += "FAILED_STOP: $info ERR=$($_.Exception.Message)"
  }
}

if ($stopped.Count -eq 0) {
  $stopped += "No istay-frontend node/vite/esbuild processes found to stop."
}

# Wait briefly for file locks to release
Start-Sleep -Seconds 2

# 2. Remove node_modules
$nm = 'c:\learning\istay-frontend\node_modules'
$nmRemoved = $false
$nmExists = Test-Path $nm
if ($nmExists) {
  try {
    Remove-Item -LiteralPath $nm -Recurse -Force -ErrorAction Stop
    $nmRemoved = -not (Test-Path $nm)
  } catch {
    $report += "node_modules remove error: $($_.Exception.Message)"
    $nmRemoved = $false
  }
}

# 3. npm ci then npm run build
Set-Location 'c:\learning\istay-frontend'
$ciOut = & npm ci 2>&1 | Out-String
$ciExit = $LASTEXITCODE
$buildOut = ''
$buildExit = -1
if ($ciExit -eq 0) {
  $buildOut = & npm run build 2>&1 | Out-String
  $buildExit = $LASTEXITCODE
} else {
  $buildOut = 'SKIPPED because npm ci failed'
  $buildExit = -1
}

# Write report
$lines = @()
$lines += '=== PROCESS STOP REPORT ==='
$lines += $stopped
$lines += ''
$lines += '=== NODE_MODULES ==='
$lines += "existed_before=$nmExists removed=$nmRemoved still_exists=$(Test-Path $nm)"
$lines += ''
$lines += "=== npm ci exit=$ciExit ==="
$lines += $ciOut
$lines += ''
$lines += "=== npm run build exit=$buildExit ==="
$lines += $buildOut
$lines += ''
$lines += "SUMMARY ci=$ciExit build=$buildExit"

$outPath = 'c:\learning\istay-frontend\_verify_rebuild_report.txt'
$lines -join "`r`n" | Set-Content -LiteralPath $outPath -Encoding UTF8
Write-Output "REPORT_WRITTEN=$outPath"
Write-Output "ci=$ciExit build=$buildExit"
