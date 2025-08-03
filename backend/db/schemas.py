from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# 用户角色枚举
class UserRole(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    ADMIN = "admin"

# 用户相关Schema
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    premium_expires_at: Optional[datetime] = None
    total_documents: int
    total_conversions: int
    created_at: datetime
    last_login_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# 登录相关Schema
class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[int] = None

# Markdown文档相关Schema
class MarkdownDocumentBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str
    description: Optional[str] = None
    is_public: bool = False
    pdf_settings: Optional[str] = None  # JSON字符串
    template_name: Optional[str] = Field(None, max_length=50)

class MarkdownDocumentCreate(MarkdownDocumentBase):
    pass

class MarkdownDocumentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
    pdf_settings: Optional[str] = None
    template_name: Optional[str] = Field(None, max_length=50)

class MarkdownDocumentResponse(MarkdownDocumentBase):
    id: int
    user_id: int
    view_count: int
    conversion_count: int
    created_at: datetime
    updated_at: datetime
    last_converted_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# 会员升级Schema
class PremiumUpgrade(BaseModel):
    plan_type: str = Field(..., description="会员计划类型")
    duration_months: int = Field(..., ge=1, le=12, description="会员时长（月）")

# 统计信息Schema
class UserStats(BaseModel):
    total_documents: int
    total_conversions: int
    premium_expires_at: Optional[datetime] = None
    role: UserRole

# 分页Schema
class PaginationParams(BaseModel):
    page: int = Field(1, ge=1, description="页码")
    size: int = Field(10, ge=1, le=100, description="每页数量")

class PaginatedResponse(BaseModel):
    items: List[MarkdownDocumentResponse]
    total: int
    page: int
    size: int
    pages: int 