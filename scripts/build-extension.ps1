$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDir '..')

$extensionDir = Join-Path $projectRoot 'extension'
$outputDir = Join-Path $projectRoot 'client/public/downloads'
$outputZip = Join-Path $outputDir 'cookie-vault-extension.zip'

$envFile = Join-Path $extensionDir '.env'
if (-not (Test-Path -LiteralPath $envFile)) {
    $envFile = Join-Path $extensionDir '.env.example'
}

$buildEnv = @{}
if (Test-Path -LiteralPath $envFile) {
    Get-Content -LiteralPath $envFile | ForEach-Object {
        $line = $_.Trim()

        if ($line -eq '' -or $line.StartsWith('#') -or -not $line.Contains('=')) {
            return
        }

        $parts = $line.Split('=', 2)
        $name = $parts[0].Trim()
        $value = $parts[1].Trim().Trim('"').Trim("'")

        if ($name -ne '') {
            $buildEnv[$name] = $value
        }
    }
}

$apiUrl = if ($env:API_URL) { $env:API_URL } elseif ($buildEnv.ContainsKey('API_URL')) { $buildEnv['API_URL'] } else { 'http://localhost:8000' }
$frontendUrl = if ($env:FRONTEND_URL) { $env:FRONTEND_URL } elseif ($buildEnv.ContainsKey('FRONTEND_URL')) { $buildEnv['FRONTEND_URL'] } else { 'http://localhost:5173' }

$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("cookievault-extension-{0}" -f ([System.Guid]::NewGuid().ToString('N')))

try {
    New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
    New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

    Copy-Item -Path (Join-Path $extensionDir '*') -Destination $tempDir -Recurse -Force

    Remove-Item -LiteralPath (Join-Path $tempDir '.env') -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath (Join-Path $tempDir '.env.example') -Force -ErrorAction SilentlyContinue

    $popupPath = Join-Path $tempDir 'popup.js'
    $popupContent = Get-Content -LiteralPath $popupPath -Raw
    $popupContent = $popupContent.Replace('__API_URL__', $apiUrl).Replace('__FRONTEND_URL__', $frontendUrl)
    Set-Content -LiteralPath $popupPath -Value $popupContent -NoNewline

    Remove-Item -LiteralPath $outputZip -Force -ErrorAction SilentlyContinue

    $items = @('manifest.json', 'popup.html', 'popup.css', 'popup.js', 'background.js', 'icons') |
        ForEach-Object { Join-Path $tempDir $_ } |
        Where-Object { Test-Path -LiteralPath $_ }

    Compress-Archive -LiteralPath $items -DestinationPath $outputZip -Force

    Write-Host "Built extension: $outputZip"
} finally {
    Remove-Item -LiteralPath $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
