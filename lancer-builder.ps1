# Gear Builder local server — no Node/npm required.
# Serves the www/ folder via .NET HttpListener (built into Windows).

$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$site = Join-Path $root "www"
if (-not (Test-Path -LiteralPath (Join-Path $site "index.html"))) {
    $site = Join-Path $root "out"
}
if (-not (Test-Path -LiteralPath (Join-Path $site "index.html"))) {
    Write-Host ""
    Write-Host "Site introuvable : www\index.html"
    Write-Host "Recuperez le dossier www/ du depot (branche avec le lanceur Windows)."
    Write-Host ""
    Read-Host "Entree pour fermer"
    exit 1
}

$site = [IO.Path]::GetFullPath((Resolve-Path -LiteralPath $site).Path)
$siteRoot = $site.TrimEnd("\", "/") + [IO.Path]::DirectorySeparatorChar

$mimeMap = @{
    ".html"  = "text/html; charset=utf-8"
    ".htm"   = "text/html; charset=utf-8"
    ".js"    = "text/javascript; charset=utf-8"
    ".mjs"   = "text/javascript; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".svg"   = "image/svg+xml"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".gif"   = "image/gif"
    ".webp"  = "image/webp"
    ".ico"   = "image/x-icon"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
    ".txt"   = "text/plain; charset=utf-8"
    ".map"   = "application/json"
}

function Get-ContentType([string]$path) {
    $ext = [IO.Path]::GetExtension($path)
    if ([string]::IsNullOrEmpty($ext)) { return "application/octet-stream" }
    $key = $ext.ToLowerInvariant()
    if ($mimeMap.Contains($key)) { return [string]$mimeMap[$key] }
    return "application/octet-stream"
}

function Get-SafePath([string]$urlPath) {
    if ([string]::IsNullOrEmpty($urlPath) -or $urlPath -eq "/") {
        return (Join-Path $site "index.html")
    }
    $decoded = [Uri]::UnescapeDataString($urlPath)
    $trimmed = $decoded.TrimStart([char[]]@([char]'/', [char]'\') )
    $combined = $siteRoot + ($trimmed -replace "/", [string][IO.Path]::DirectorySeparatorChar)
    $full = [IO.Path]::GetFullPath($combined)
    if (-not $full.StartsWith($siteRoot, [StringComparison]::OrdinalIgnoreCase)) {
        return $null
    }
    if ((Test-Path -LiteralPath $full) -and (Get-Item -LiteralPath $full).PSIsContainer) {
        return (Join-Path $full "index.html")
    }
    return $full
}

function Send-Bytes {
    param(
        [Parameter(Mandatory = $true)] $Response,
        [Parameter(Mandatory = $true)] [int] $Status,
        [Parameter(Mandatory = $true)] [string] $ContentType,
        [Parameter(Mandatory = $true)] [byte[]] $Bytes
    )
    $Response.StatusCode = $Status
    $Response.StatusDescription = "OK"
    if ($Status -ge 400) { $Response.StatusDescription = "Error" }
    $Response.ContentType = $ContentType
    $Response.ContentLength64 = [int64]$Bytes.LongLength
    $Response.SendChunked = $false
    $Response.KeepAlive = $false
    $Response.OutputStream.Write($Bytes, 0, [int]$Bytes.LongLength)
}

function Send-File {
    param(
        [Parameter(Mandatory = $true)] $Response,
        [Parameter(Mandatory = $true)] [int] $Status,
        [Parameter(Mandatory = $true)] [string] $Path
    )
    $Response.StatusCode = $Status
    $Response.StatusDescription = "OK"
    $Response.ContentType = (Get-ContentType $Path)
    $Response.SendChunked = $false
    $Response.KeepAlive = $false
    $stream = [IO.File]::Open($Path, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::ReadWrite)
    try {
        $Response.ContentLength64 = [int64]$stream.Length
        $stream.CopyTo($Response.OutputStream)
    } finally {
        $stream.Dispose()
    }
}

$port = 3000
$maxPort = 3010
$listener = $null
$opened = 0

while ($port -le $maxPort) {
    $tryListener = New-Object System.Net.HttpListener
    $tryListener.IgnoreWriteExceptions = $true
    $tryListener.Prefixes.Add("http://127.0.0.1:$port/")
    try {
        $tryListener.Prefixes.Add("http://localhost:$port/")
    } catch {
        # localhost prefix is optional
    }
    try {
        $tryListener.Start()
        $listener = $tryListener
        $opened = $port
        break
    } catch {
        $tryListener.Close()
        $port++
    }
}

if (-not $listener) {
    Write-Host "Impossible d'ouvrir un port entre 3000 et $maxPort."
    Write-Host $_.Exception.Message
    Read-Host "Entree pour fermer"
    exit 1
}

$url = "http://127.0.0.1:$opened/"
Write-Host ""
Write-Host "  TD2 Gear Builder"
Write-Host "  ----------------"
Write-Host "  Ouvrez : $url"
Write-Host "  Dossier : $site"
Write-Host "  Ctrl+C ou fermez cette fenetre pour arreter."
Write-Host ""

try {
    Start-Process $url | Out-Null
} catch {
    Write-Host "Ouvrez le lien ci-dessus dans le navigateur."
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $path = $request.Url.AbsolutePath
        try {
            if ($path -eq "/favicon.ico") {
                $ico = Join-Path $site "favicon.ico"
                if (Test-Path -LiteralPath $ico) {
                    Send-File -Response $response -Status 200 -Path $ico
                } else {
                    $response.StatusCode = 204
                    $response.ContentLength64 = 0
                }
            } else {
                $file = Get-SafePath $path
                if ($file -and (Test-Path -LiteralPath $file)) {
                    Send-File -Response $response -Status 200 -Path $file
                    Write-Host ("  {0} {1}" -f $request.HttpMethod, $path)
                } else {
                    $notFound = Join-Path $site "404.html"
                    if (Test-Path -LiteralPath $notFound) {
                        Send-File -Response $response -Status 404 -Path $notFound
                    } else {
                        $msg = [Text.Encoding]::UTF8.GetBytes("404")
                        Send-Bytes -Response $response -Status 404 -ContentType "text/plain; charset=utf-8" -Bytes $msg
                    }
                    Write-Host ("  404 {0}" -f $path)
                }
            }
        } catch {
            Write-Host ("  ERREUR {0} : {1}" -f $path, $_.Exception.Message) -ForegroundColor Red
            try {
                $msg = [Text.Encoding]::UTF8.GetBytes("Erreur serveur: " + $_.Exception.Message)
                Send-Bytes -Response $response -Status 500 -ContentType "text/plain; charset=utf-8" -Bytes $msg
            } catch {
                try { $response.StatusCode = 500 } catch { }
            }
        } finally {
            try { $response.OutputStream.Flush() } catch { }
            try { $response.Close() } catch { }
        }
    }
} finally {
    try { $listener.Stop() } catch { }
    try { $listener.Close() } catch { }
}
