# Batch add width/height to img tags without them
$files = Get-ChildItem "src" -Recurse -Filter "*.astro"
$modifiedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # Add width/height to img tags that don't have it
    # Skip logo, favicon, and images with inline height style
    $pattern = '<img(?![^>]*width=)(?![^>]*logo)(?![^>]*favicon)(?![^>]*height:\d+px)([^>]*)>'
    $replacement = '<img$1 width="1200" height="800">'
    $content = $content -replace $pattern, $replacement

    if ($content -ne $originalContent) {
        $modifiedCount++
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Output "  Modified: $($file.Name)"
    }
}

Write-Output ""
Write-Output "Total files modified: $modifiedCount"

# Verify
$remaining = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $imgMatches = [regex]::Matches($content, '<img[^>]*>')
    foreach ($m in $imgMatches) {
        if ($m.Value -notmatch 'width=') {
            $remaining++
        }
    }
}
Write-Output "Images still without width/height: $remaining"
