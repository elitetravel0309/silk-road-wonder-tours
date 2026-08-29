# Silk Road Wonders - 自动构建并部署到 Cloudflare Pages
# 使用方法: 在项目目录右键 -> 在终端中打开 -> 运行 .\deploy.ps1

$ErrorActionPreference = "Stop"

# 配置
$ProjectName = "silkroad-wonders"
$Branch = "master"
$AccountId = "ed8d3161c3abaf3ae6926c850e6e63ee"
$ApiToken = $env:CLOUDFLARE_API_TOKEN

# 检查 API Token
if (-not $ApiToken) {
    Write-Host "错误: 未设置 CLOUDFLARE_API_TOKEN 环境变量" -ForegroundColor Red
    Write-Host "请先设置: `$env:CLOUDFLARE_API_TOKEN=`"你的Token`"" -ForegroundColor Yellow
    exit 1
}

Write-Host "=== Silk Road Wonders 部署脚本 ===" -ForegroundColor Cyan
Write-Host ""

# 步骤1: 安装依赖（如果需要）
if (-not (Test-Path "node_modules")) {
    Write-Host "[1/5] 安装依赖..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "[1/5] 依赖已安装，跳过" -ForegroundColor Green
}

# 步骤2: 自动更新 Service Worker 缓存版本号（强制浏览器清除旧缓存）
Write-Host "[2/5] 更新 Service Worker 缓存版本号..." -ForegroundColor Yellow
$swPath = "public\sw.js"
$swContent = Get-Content $swPath -Raw -Encoding UTF8
# 匹配 srw-vX.Y 格式并递增次版本号
if ($swContent -match "srw-v(\d+)\.(\d+)") {
    $major = [int]$matches[1]
    $minor = [int]$matches[2] + 1
    $newVersion = "srw-v$major.$minor"
    $oldVersion = $matches[0]
    $swContent = $swContent -replace [regex]::Escape($oldVersion), $newVersion
    Set-Content -Path $swPath -Value $swContent -Encoding UTF8 -NoNewline
    Write-Host "  缓存版本: $oldVersion -> $newVersion" -ForegroundColor Green
} else {
    Write-Host "  警告: 未找到缓存版本号，跳过" -ForegroundColor Yellow
}

# 步骤3: 构建
Write-Host "[3/5] 构建项目..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败！" -ForegroundColor Red
    exit 1
}
Write-Host "构建成功！" -ForegroundColor Green

# 步骤3.5: 修复 main.js（Astro 构建工具会截断 https:// 字符串，用源文件覆盖）
Write-Host "  修复 main.js（避免构建截断问题）..." -ForegroundColor Yellow
Copy-Item "public\js\main.js" "dist\js\main.js" -Force

# 验证所有 JS 语法
Write-Host "  验证 JS 语法..." -ForegroundColor Yellow
$jsFiles = Get-ChildItem -Path "dist\js" -Filter "*.js"
$allOk = $true
foreach ($f in $jsFiles) {
    $result = node --check $f.FullName 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ $($f.Name): 语法错误" -ForegroundColor Red
        Write-Host "     $result" -ForegroundColor Red
        $allOk = $false
    }
}
if (-not $allOk) {
    Write-Host "JS 语法验证失败，终止部署！" -ForegroundColor Red
    exit 1
}
Write-Host "  所有 JS 语法正确" -ForegroundColor Green

# 步骤4: 部署到 Cloudflare Pages
Write-Host "[4/5] 部署到 Cloudflare Pages..." -ForegroundColor Yellow
$env:CLOUDFLARE_ACCOUNT_ID = $AccountId
npx wrangler pages deploy dist --project-name=$ProjectName --branch=$Branch --commit-dirty=true

if ($LASTEXITCODE -ne 0) {
    Write-Host "部署失败！" -ForegroundColor Red
    exit 1
}

# 步骤5: 完成
Write-Host ""
Write-Host "=== 部署成功！===" -ForegroundColor Green
Write-Host "网站: https://silkroadwondertours.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "提示: 用户首次访问可能需要 Ctrl+F5 强制刷新以清除旧缓存" -ForegroundColor Yellow
