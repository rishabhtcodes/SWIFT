# PowerShell wrapper function for Swift AI OS launcher
function Start-Swift {
    $scriptPath = Join-Path -Path $PSScriptRoot -ChildPath "start-swift.bat"
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$scriptPath`""
}

Set-Alias -Name start-swift -Value Start-Swift -ErrorAction SilentlyContinue
