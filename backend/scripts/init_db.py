#!/usr/bin/env python3
"""
数据库初始化脚本
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.database import create_tables, engine
from db.models import User, UserRole
from app.auth import get_password_hash
from sqlalchemy.orm import sessionmaker

def create_admin_user():
    """创建管理员用户"""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # 检查是否已存在管理员用户
        admin_user = db.query(User).filter(User.username == "admin").first()
        if admin_user:
            print("管理员用户已存在")
            return
        
        # 创建管理员用户
        admin_user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            full_name="系统管理员",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True
        )
        
        db.add(admin_user)
        db.commit()
        print("管理员用户创建成功")
        print("用户名: admin")
        print("密码: admin123")
        
    except Exception as e:
        print(f"创建管理员用户失败: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """主函数"""
    print("正在初始化数据库...")
    
    # 创建表
    create_tables()
    print("数据库表创建完成")
    
    # 创建管理员用户
    create_admin_user()
    
    print("数据库初始化完成！")

if __name__ == "__main__":
    main() 