#!/bin/bash

# AstroSoul 部署脚本
# 使用方法: ./deploy.sh [环境] [平台]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查必要的工具
check_requirements() {
    print_step "检查部署环境..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装，请先安装 npm"
        exit 1
    fi
    
    # 检查 git
    if ! command -v git &> /dev/null; then
        print_error "git 未安装，请先安装 git"
        exit 1
    fi
    
    print_message "环境检查通过 ✓"
}

# 安装依赖
install_dependencies() {
    print_step "安装项目依赖..."
    
    # 安装前端依赖
    print_message "安装前端依赖..."
    cd frontend
    npm install
    cd ..
    
    # 安装后端依赖
    print_message "安装后端依赖..."
    cd backend
    npm install
    cd ..
    
    print_message "依赖安装完成 ✓"
}

# 构建项目
build_project() {
    print_step "构建项目..."
    
    # 构建前端
    print_message "构建前端..."
    cd frontend
    npm run build
    cd ..
    
    # 构建后端
    print_message "构建后端..."
    cd backend
    npm run build
    cd ..
    
    print_message "项目构建完成 ✓"
}

# 检查环境变量
check_env_vars() {
    print_step "检查环境变量..."
    
    # 检查前端环境变量
    if [ ! -f "frontend/.env.local" ]; then
        print_warning "前端环境变量文件不存在，创建默认配置..."
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_DEV_BACKEND_PORT=3000
EOF
    fi
    
    # 检查后端环境变量
    if [ ! -f "backend/.env" ]; then
        print_warning "后端环境变量文件不存在，创建默认配置..."
        cat > backend/.env << EOF
NODE_ENV=production
PORT=3000
FREEASTROLOGY_API_KEY=your_api_key_here
PROKERALA_API_KEY=your_api_key_here
VEDASTRO_API_KEY=your_api_key_here
EOF
        print_warning "请编辑 backend/.env 文件，添加真实的API密钥"
    fi
    
    print_message "环境变量检查完成 ✓"
}

# 启动服务
start_services() {
    print_step "启动服务..."
    
    # 检查端口是否被占用
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        print_warning "端口 3000 已被占用，尝试停止现有服务..."
        pkill -f "next start" || true
    fi
    
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
        print_warning "端口 3001 已被占用，尝试停止现有服务..."
        pkill -f "node dist/server.js" || true
    fi
    
    # 启动后端
    print_message "启动后端服务..."
    cd backend
    nohup npm start > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    cd ..
    
    # 等待后端启动
    sleep 3
    
    # 启动前端
    print_message "启动前端服务..."
    cd frontend
    nohup npm start > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    cd ..
    
    print_message "服务启动完成 ✓"
    print_message "后端服务 PID: $BACKEND_PID"
    print_message "前端服务 PID: $FRONTEND_PID"
}

# 检查服务状态
check_services() {
    print_step "检查服务状态..."
    
    sleep 5
    
    # 检查后端
    if curl -s http://localhost:3001/health > /dev/null; then
        print_message "后端服务运行正常 ✓"
    else
        print_error "后端服务启动失败"
        print_message "查看日志: tail -f backend.log"
        exit 1
    fi
    
    # 检查前端
    if curl -s http://localhost:3000 > /dev/null; then
        print_message "前端服务运行正常 ✓"
    else
        print_error "前端服务启动失败"
        print_message "查看日志: tail -f frontend.log"
        exit 1
    fi
}

# 显示部署信息
show_deployment_info() {
    print_step "部署信息"
    echo ""
    echo "🎉 部署完成！"
    echo ""
    echo "📱 访问地址:"
    echo "   前端: http://localhost:3000"
    echo "   后端: http://localhost:3001"
    echo ""
    echo "📊 服务状态:"
    echo "   后端 PID: $(cat backend.pid 2>/dev/null || echo 'N/A')"
    echo "   前端 PID: $(cat frontend.pid 2>/dev/null || echo 'N/A')"
    echo ""
    echo "📝 日志文件:"
    echo "   后端日志: tail -f backend.log"
    echo "   前端日志: tail -f frontend.log"
    echo ""
    echo "🛑 停止服务:"
    echo "   ./deploy.sh stop"
    echo ""
}

# 停止服务
stop_services() {
    print_step "停止服务..."
    
    # 停止前端
    if [ -f "frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            print_message "前端服务已停止"
        fi
        rm -f frontend.pid
    fi
    
    # 停止后端
    if [ -f "backend.pid" ]; then
        BACKEND_PID=$(cat backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            print_message "后端服务已停止"
        fi
        rm -f backend.pid
    fi
    
    # 清理进程
    pkill -f "next start" || true
    pkill -f "node dist/server.js" || true
    
    print_message "所有服务已停止 ✓"
}

# 重启服务
restart_services() {
    print_step "重启服务..."
    stop_services
    sleep 2
    start_services
    check_services
    show_deployment_info
}

# 显示帮助信息
show_help() {
    echo "AstroSoul 部署脚本"
    echo ""
    echo "使用方法:"
    echo "  ./deploy.sh [命令]"
    echo ""
    echo "命令:"
    echo "  start     - 启动服务"
    echo "  stop      - 停止服务"
    echo "  restart   - 重启服务"
    echo "  status    - 检查服务状态"
    echo "  logs      - 查看日志"
    echo "  help      - 显示帮助信息"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh start"
    echo "  ./deploy.sh stop"
    echo "  ./deploy.sh restart"
}

# 查看日志
show_logs() {
    print_step "查看服务日志..."
    echo ""
    echo "选择要查看的日志:"
    echo "1) 前端日志"
    echo "2) 后端日志"
    echo "3) 所有日志"
    echo ""
    read -p "请选择 (1-3): " choice
    
    case $choice in
        1)
            tail -f frontend.log
            ;;
        2)
            tail -f backend.log
            ;;
        3)
            tail -f frontend.log backend.log
            ;;
        *)
            print_error "无效选择"
            ;;
    esac
}

# 主函数
main() {
    case "${1:-start}" in
        "start")
            check_requirements
            install_dependencies
            check_env_vars
            build_project
            start_services
            check_services
            show_deployment_info
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "status")
            check_services
            ;;
        "logs")
            show_logs
            ;;
        "help")
            show_help
            ;;
        *)
            print_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
