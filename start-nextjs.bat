@echo off
REM 健康数据可视化应用启动脚本 (Windows)

echo.
echo ============================================
echo   健康数据可视化应用启动脚本
echo ============================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未找到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 进入 Next.js 应用目录
cd nextjs-app

REM 检查依赖是否已安装
if not exist node_modules (
    echo [信息] 首次运行，正在安装依赖...
    call npm install
    echo.
)

REM 检查 .env.local 是否配置
findstr /C:"ANTHROPIC_API_KEY=sk-ant" .env.local >nul
if %ERRORLEVEL% NEQ 0 (
    echo [警告] Anthropic API Key 未配置
    echo.
    echo 请编辑 nextjs-app\.env.local 文件并添加你的 API Key:
    echo   ANTHROPIC_API_KEY=sk-ant-xxxxx
    echo.
    echo 获取 API Key: https://console.anthropic.com/
    echo.
    pause
)

echo.
echo [成功] 启动开发服务器...
echo.
echo 应用地址: http://localhost:3000
echo 按 Ctrl+C 停止服务器
echo.
echo ============================================
echo.

REM 启动开发服务器
npm run dev
