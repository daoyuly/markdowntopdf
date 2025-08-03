from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from db.database import get_db
from db.schemas import (
    MarkdownDocumentCreate, 
    MarkdownDocumentResponse, 
    MarkdownDocumentUpdate,
    PaginationParams,
    PaginatedResponse
)
from app.auth import get_current_active_user, get_current_premium_user
from app.crud import MarkdownDocumentCRUD, UserCRUD
from app.config import settings
from db.models import User

router = APIRouter(prefix="/documents", tags=["文档管理"])

@router.post("/", response_model=MarkdownDocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(
    document: MarkdownDocumentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """创建新文档"""
    # 检查用户限制
    if current_user.role.value == "free":
        if current_user.total_documents >= settings.free_user_document_limit:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"免费用户最多只能创建{settings.free_user_document_limit}个文档，请升级为会员"
            )
    
    db_document = MarkdownDocumentCRUD.create(db, document, current_user.id)
    return db_document

@router.get("/", response_model=PaginatedResponse)
async def get_my_documents(
    page: int = Query(1, ge=1, description="页码"),
    size: int = Query(10, ge=1, le=100, description="每页数量"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """获取我的文档列表"""
    skip = (page - 1) * size
    
    if search:
        documents = MarkdownDocumentCRUD.search_documents(db, current_user.id, search, skip, size)
        # 这里应该实现搜索的总数统计，暂时简化处理
        total = len(documents)
    else:
        documents = MarkdownDocumentCRUD.get_user_documents(db, current_user.id, skip, size)
        # 这里应该实现总数统计，暂时简化处理
        total = len(documents)
    
    pages = (total + size - 1) // size
    
    return PaginatedResponse(
        items=documents,
        total=total,
        page=page,
        size=size,
        pages=pages
    )

@router.get("/public", response_model=List[MarkdownDocumentResponse])
async def get_public_documents(
    skip: int = Query(0, ge=0, description="跳过数量"),
    limit: int = Query(20, ge=1, le=100, description="限制数量"),
    db: Session = Depends(get_db)
):
    """获取公开文档列表"""
    documents = MarkdownDocumentCRUD.get_public_documents(db, skip, limit)
    return documents

@router.get("/{document_id}", response_model=MarkdownDocumentResponse)
async def get_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """获取文档详情"""
    db_document = MarkdownDocumentCRUD.get_by_id(db, document_id, current_user.id)
    if not db_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文档不存在或无权限访问"
        )
    
    # 增加查看次数
    MarkdownDocumentCRUD.increment_view_count(db, document_id)
    
    return db_document

@router.put("/{document_id}", response_model=MarkdownDocumentResponse)
async def update_document(
    document_id: int,
    document_update: MarkdownDocumentUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """更新文档"""
    db_document = MarkdownDocumentCRUD.update(db, document_id, document_update, current_user.id)
    if not db_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文档不存在或无权限修改"
        )
    
    return db_document

@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """删除文档"""
    success = MarkdownDocumentCRUD.delete(db, document_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文档不存在或无权限删除"
        )
    
    return {"message": "文档已删除"}

@router.post("/{document_id}/convert")
async def convert_document_to_pdf(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """转换文档为PDF"""
    # 检查文档是否存在
    db_document = MarkdownDocumentCRUD.get_by_id(db, document_id, current_user.id)
    if not db_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文档不存在或无权限访问"
        )
    
    # 检查用户转换限制
    if current_user.role.value == "free":
        if current_user.total_conversions >= settings.free_user_conversion_limit:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"免费用户最多只能转换{settings.free_user_conversion_limit}次，请升级为会员"
            )
    
    # 这里应该实现PDF转换逻辑
    # 暂时模拟转换成功
    MarkdownDocumentCRUD.increment_conversion_count(db, document_id, current_user.id)
    
    return {
        "message": "文档转换成功",
        "document_id": document_id,
        "download_url": f"/api/documents/{document_id}/download"
    }

@router.get("/{document_id}/download")
async def download_pdf(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """下载PDF文件"""
    # 检查文档是否存在
    db_document = MarkdownDocumentCRUD.get_by_id(db, document_id, current_user.id)
    if not db_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文档不存在或无权限访问"
        )
    
    # 这里应该实现PDF文件生成和下载逻辑
    # 暂时返回模拟响应
    return {
        "message": "PDF下载功能待实现",
        "document_id": document_id,
        "filename": f"{db_document.title}.pdf"
    }

# 会员专用接口
@router.post("/{document_id}/share")
async def share_document(
    document_id: int,
    is_public: bool = True,
    current_user: User = Depends(get_current_premium_user),
    db: Session = Depends(get_db)
):
    """分享文档（会员功能）"""
    db_document = MarkdownDocumentCRUD.get_by_id(db, document_id, current_user.id)
    if not db_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文档不存在或无权限访问"
        )
    
    db_document.is_public = is_public
    db.commit()
    
    return {
        "message": f"文档已{'公开' if is_public else '设为私有'}",
        "document_id": document_id,
        "is_public": is_public
    } 