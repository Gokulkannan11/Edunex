# Fix admin.js line 288-289
$content = Get-Content "routes\admin.js" -Raw
$content = $content -replace "const \[result\] = await mysqlPool\.query\(\s+'\INSERT INTO departments \(name, code\) VALUES \(\?, \?\)`\)\.all\(name, code\);", "const result = db.prepare('INSERT INTO departments (name, code) VALUES (?, ?)').run(name, code);"
Set-Content "routes\admin.js" -Value $content -NoNewline
Write-Host "Fixed admin.js"
