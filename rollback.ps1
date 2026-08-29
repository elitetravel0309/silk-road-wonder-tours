# Silk Road Wonders - 一键回滚到历史部署
# 使用方法: .\rollback.ps1
# 功能: 列出最近10个部署，选择编号即可回滚

$ErrorActionPreference = "Stop"

# 配置
$AccountId = "ed8d3161c3abaf3ae6926c850e6e63ee"
$ProjectName = "silkroad-wonders"
$Email = "travel@elitetravel4u.com"
$GlobalApiKey = "d56ad493c07171c4814b0ec624ba662c0e49d"

$headers = @{
    "X-Auth-Email" = $Email
    "X-Auth-Key" = $GlobalApiKey
    "Content-Type" = "application/json"
}

Write-Host "=== Silk Road Wonders 回滚工具 ===" -ForegroundColor Cyan
Write-Host ""

# 获取最近部署列表
Write-Host "正在获取部署历史..." -ForegroundColor Yellow
$url = "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName/deployments?per_page=10"
$response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get

if (-not $response.success) {
    Write-Host "获取部署列表失败: $($response.errors)" -ForegroundColor Red
    exit 1
}

$deployments = $response.result

Write-Host ""
Write-Host "最近部署列表:" -ForegroundColor Cyan
Write-Host "----------------------------------------"
for ($i = 0; $i -lt $deployments.Count; $i++) {
    $d = $deployments[$i]
    $num = $i + 1
    $status = $d.status
    $env = $d.environment
    $created = $d.created_on
    $url_short = $d.url -replace "https://", ""
    Write-Host "[$num] $created | $env | URL: $url_short" -ForegroundColor White
}
Write-Host "----------------------------------------"
Write-Host ""

# 让用户选择
$choice = Read-Host "输入要回滚到的部署编号 (1-$($deployments.Count))，或按 Q 取消"

if ($choice -eq "Q" -or $choice -eq "q") {
    Write-Host "已取消" -ForegroundColor Yellow
    exit 0
}

$index = [int]$choice - 1
if ($index -lt 0 -or $index -ge $deployments.Count) {
    Write-Host "无效的选择！" -ForegroundColor Red
    exit 1
}

$target = $deployments[$index]
Write-Host ""
Write-Host "即将回滚到: $($target.url)" -ForegroundColor Yellow
$confirm = Read-Host "确认回滚? (Y/N)"

if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "已取消" -ForegroundColor Yellow
    exit 0
}

# 执行回滚
Write-Host "正在回滚..." -ForegroundColor Yellow
$rollbackUrl = "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName/deployments/$($target.id)/rollback"
$rollbackResponse = Invoke-RestMethod -Uri $rollbackUrl -Headers $headers -Method Post

if ($rollbackResponse.success) {
    Write-Host ""
    Write-Host "=== 回滚成功！===" -ForegroundColor Green
    Write-Host "新部署 URL: $($rollbackResponse.result.url)" -ForegroundColor Cyan
    Write-Host "网站: https://silkroadwondertours.com" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "提示: 刷新浏览器可能需要清除缓存 (Ctrl+F5)" -ForegroundColor Yellow
} else {
    Write-Host "回滚失败: $($rollbackResponse.errors)" -ForegroundColor Red
    exit 1
}
