# PowerShell script to identify duplicates in the LanguageContext file
$content = Get-Content "src/components/LanguageContext.tsx" -Raw

# Extract all key-value pairs using regex
$matches = [regex]::Matches($content, '"([^"]+)"\s*:\s*"[^"]*"')

# Count occurrences of each key
$keyCount = @{}
foreach ($match in $matches) {
    $key = $match.Groups[1].Value
    if ($keyCount.ContainsKey($key)) {
        $keyCount[$key]++
    } else {
        $keyCount[$key] = 1
    }
}

# Show duplicates
Write-Host "Keys with duplicates:"
$keyCount.GetEnumerator() | Where-Object { $_.Value -gt 1 } | Sort-Object Value -Descending | ForEach-Object {
    Write-Host "$($_.Key): $($_.Value) times"
}