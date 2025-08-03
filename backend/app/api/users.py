from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from db.schemas import UserResponse, UserUpdate, UserStats, PremiumUpgrade
from app.auth import get_current_active_user, get_current_admin_user
from app.crud import UserCRUD
from db.models import User

router = APIRouter(prefix="/users", tags=["用户管理"])

@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: User = Depends(get_current_active_user)):
    """获取我的个人信息"""
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_my_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """更新我的个人信息"""
    # 检查用户名是否已被其他用户使用
    if user_update.username:
        existing_user = UserCRUD.get_by_username(db, user_update.username)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="用户名已被使用"
            )
    
    # 检查邮箱是否已被其他用户使用
    if user_update.email:
        existing_user = UserCRUD.get_by_email(db, user_update.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="邮箱已被使用"
            )
    
    updated_user = UserCRUD.update(db, current_user.id, user_update)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    return updated_user

@router.get("/me/stats", response_model=UserStats)
async def get_my_stats(current_user: User = Depends(get_current_active_user)):
    """获取我的使用统计"""
    return UserStats(
        total_documents=current_user.total_documents,
        total_conversions=current_user.total_conversions,
        premium_expires_at=current_user.premium_expires_at,
        role=current_user.role
    )

@router.post("/me/upgrade", response_model=UserResponse)
async def upgrade_to_premium(
    upgrade_data: PremiumUpgrade,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """升级为会员"""
    # 这里应该集成支付系统，暂时模拟升级成功
    upgraded_user = UserCRUD.upgrade_to_premium(db, current_user.id, upgrade_data.duration_months)
    if not upgraded_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    return upgraded_user

@router.get("/me/premium-status")
async def check_premium_status(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """检查会员状态"""
    is_premium = UserCRUD.check_premium_status(db, current_user.id)
    return {
        "is_premium": is_premium,
        "role": current_user.role.value,
        "premium_expires_at": current_user.premium_expires_at
    }

# 管理员接口
@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """获取所有用户（管理员）"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """根据ID获取用户（管理员）"""
    user = UserCRUD.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    return user

@router.put("/{user_id}/activate")
async def activate_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """激活用户（管理员）"""
    user = UserCRUD.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    user.is_active = True
    db.commit()
    return {"message": "用户已激活"}

@router.put("/{user_id}/deactivate")
async def deactivate_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """禁用用户（管理员）"""
    user = UserCRUD.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    user.is_active = False
    db.commit()
    return {"message": "用户已禁用"} 