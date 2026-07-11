# Builds stampzer-site.zip with forward-slash entry names (Linux-safe).
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = $PSScriptRoot
$zipPath = Join-Path $root "stampzer-site.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

# Exclude dev/tooling/secrets-not-needed from the public deploy
$excludeExact = @("stampzer-site.zip","build_zip.ps1",".gitignore",".git")
$excludeDirs  = @("_ogfont","_fontsrc",".git")
function Skip($rel) {
  if ($rel -like "*.py")  { return $true }
  if ($rel -like "*.zip") { return $true }
  if ($rel -like "phptest.php") { return $true }
  foreach ($d in $excludeDirs) { if ($rel -like "$d/*" -or $rel -eq $d) { return $true } }
  foreach ($e in $excludeExact) { if ($rel -eq $e) { return $true } }
  return $false
}

$fs = [System.IO.File]::Create($zipPath)
$zip = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
$count = 0
Get-ChildItem -Path $root -Recurse -File -Force | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length + 1) -replace '\\','/'
  if (Skip $rel) { return }
  $entry = $zip.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
  $es = $entry.Open()
  $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
  $es.Write($bytes, 0, $bytes.Length)
  $es.Close()
  $count++
}
$zip.Dispose()
$fs.Close()
Write-Output "Zipped $count files -> $zipPath"
Write-Output ("Size: {0:N0} KB" -f ((Get-Item $zipPath).Length / 1KB))
