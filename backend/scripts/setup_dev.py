#!/usr/bin/env python3
"""
开发环境设置脚本
使用uv作为包管理器
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """运行命令并处理错误"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} 完成")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} 失败: {e}")
        print(f"错误输出: {e.stderr}")
        return False

def check_uv_installed():
    """检查uv是否已安装"""
    try:
        subprocess.run(["uv", "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def install_uv():
    """安装uv"""
    print("📦 正在安装uv...")
    
    # 检测操作系统
    import platform
    system = platform.system().lower()
    
    if system == "windows":
        # Windows安装
        install_cmd = "powershell -c \"irm https://astral.sh/uv/install.ps1 | iex\""
    elif system == "darwin":
        # macOS安装
        install_cmd = "curl -LsSf https://astral.sh/uv/install.sh | sh"
    else:
        # Linux安装
        install_cmd = "curl -LsSf https://astral.sh/uv/install.sh | sh"
    
    return run_command(install_cmd, "安装uv")

def setup_project():
    """设置项目"""
    print("🚀 开始设置Markdown转PDF API项目...")
    
    # 检查uv是否已安装
    if not check_uv_installed():
        print("❌ uv未安装，正在安装...")
        if not install_uv():
            print("❌ uv安装失败，请手动安装")
            print("安装命令: curl -LsSf https://astral.sh/uv/install.sh | sh")
            return False
    
    # 创建虚拟环境并安装依赖
    if not run_command("uv sync", "同步项目依赖"):
        return False
    
    # 初始化数据库
    if not run_command("uv run python scripts/init_db.py", "初始化数据库"):
        return False
    
    print("🎉 项目设置完成！")
    print("\n📋 下一步:")
    print("1. 启动开发服务器: uv run python run.py")
    print("2. 访问API文档: http://localhost:8000/docs")
    print("3. 运行测试: uv run pytest")
    print("4. 代码格式化: uv run black .")
    print("5. 代码检查: uv run ruff check .")
    
    return True

def main():
    """主函数"""
    # 检查是否在正确的目录
    if not Path("pyproject.toml").exists():
        print("❌ 请在backend目录下运行此脚本")
        sys.exit(1)
    
    if setup_project():
        print("\n✅ 开发环境设置成功！")
        sys.exit(0)
    else:
        print("\n❌ 开发环境设置失败！")
        sys.exit(1)

if __name__ == "__main__":
    main() 