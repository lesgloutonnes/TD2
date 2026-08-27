# Lance le Gear Builder sur http://localhost:3000 sans Node/npm.
# Sert le dossier www/ (site statique) via HttpListener, integre a Windows.

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$site = Join-Path $root "www"
if (-not (Test-Path (Join-Path $site "index.html"))) {
    $site = Join-Path $root "out"
}

if (-not (Test-Path (Join-Path $site "index.html"))) {
    Write-Host ""
    Write-Host "Dossier du site introuvable (www\\index.html)."
    Write-Host "Ce depot doit contenir le build statique."
    Write-Host ""
    Read-Host "Entree pour fermer"
    exit 1
}

$site = (Resolve-Path $site).Path
$port = 3000
$maxPort = 3010
$listener = $null
$prefix = $null

while ($port -le $maxPort) {
    $candidate = "http://127.0.0.1:$port/"
    $tryListener = New-Object System.Net.HttpListener
    $tryListener.Prefixes.Add($candidate)
    try {
        $tryListener.Start()
        $listener = $tryListener
        $prefix = $candidate
        break
    } catch {
        $tryListener.Close()
        $port++
    }
}

if (-not $listener) {
    Write-Host "Impossible d'ouvrir un port entre 3000 et $maxPort."
    Read-Host "Entree pour fermer"
    exit 1
}

$mime = @{
    ".html"  = "text/html; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
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

$url = $prefix.TrimEnd("/")
Write-Host ""
Write-Host "  Gear Builder pret : $url"
Write-Host "  Dossier           : $site"
Write-Host "  Fermer cette fenetre ou Ctrl+C pour arreter."
Write-Host ""

Start-Process $url

function Get-SafePath([string]$urlPath) {
    $decoded = [Uri]::UnescapeDataString($urlPath)
    if ($decoded -eq "/" -or $decoded -eq "") {
        return (Join-Path $site "index.html")
    }
    $relative = $decoded.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)
    $full = [IO.Path]::GetFullPath((Join-Path $site $relative))
    $rootWithSep = $site.TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
    if (-not $full.StartsWith($rootWithSep, [StringComparison]::OrdinalIgnoreCase) -and $full -ne $site) {
        return $null
    }
    if (Test-Path $full -PathType Container) {
        return (Join-Path $full "index.html")
    }
    return $full
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        try {
            $file = Get-SafePath $request.Url.AbsolutePath
            if (-not $file -or -not (Test-Path $file -PathType Leaf)) {
                $fallback = Join-Path $site "404.html"
                $response.StatusCode = 404
                if (Test-Path $fallback) { $file = $fallback } else { $file = $null }
            } else {
                $response.StatusCode = 200
            }

            if ($file) {
                $ext = [IO.Path]::GetExtension($file).ToLowerInvariant()
                if ($mime.ContainsKey($ext)) {
                    $response.ContentType = $mime[$ext]
                } else {
                    $response.ContentType = "application/octet-stream"
                }
                $bytes = [IO.File]::ReadAllBytes($file)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $msg = [Text.Encoding]::UTF8.GetBytes("404")
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
        } catch {
            $response.StatusCode = 500
        } finally {
            $response.OutputStream.Close()
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
