# Allow running 'start swift' in PowerShell
function start {
    param(
        [Parameter(Position=0)]
        [string]$Target
    )
    if ($Target -eq "swift" -or $Target -eq "swift.bat") {
        & "$PSScriptRoot\start-swift.bat"
    } else {
        Start-Process $Target
    }
}
