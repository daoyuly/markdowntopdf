from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from typing import List, Optional
from datetime import datetime
from db.models import User, MarkdownDocument, UserRole
from db.schemas import UserCreate, UserUpdate, MarkdownDocumentCreate, MarkdownDocumentUpdate
from app.auth import get_password_hash

# 用户CRUD操作
class UserCRUD:
    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        """根据ID获取用户"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_by_username(db: Session, username: str) -> Optional[User]:
        """根据用户名获取用户"""
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """根据邮箱获取用户"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def create(db: Session, user: UserCreate) -> User:
        """创建用户"""
        hashed_password = get_password_hash(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            full_name=user.full_name,
            bio=user.bio,
            role=UserRole.FREE
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def update(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
        """更新用户信息"""
        db_user = UserCRUD.get_by_id(db, user_id)
        if not db_user:
            return None
        
        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def update_last_login(db: Session, user_id: int) -> None:
        """更新最后登录时间"""
        db_user = UserCRUD.get_by_id(db, user_id)
        if db_user:
            db_user.last_login_at = datetime.utcnow()
            db.commit()
    
    @staticmethod
    def upgrade_to_premium(db: Session, user_id: int, months: int) -> Optional[User]:
        """升级为会员"""
        db_user = UserCRUD.get_by_id(db, user_id)
        if not db_user:
            return None
        
        from datetime import timedelta
        if db_user.premium_expires_at and db_user.premium_expires_at > datetime.utcnow():
            # 如果会员未过期，延长会员时间
            db_user.premium_expires_at += timedelta(days=30 * months)
        else:
            # 如果会员已过期，设置新的过期时间
            db_user.premium_expires_at = datetime.utcnow() + timedelta(days=30 * months)
        
        db_user.role = UserRole.PREMIUM
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def check_premium_status(db: Session, user_id: int) -> bool:
        """检查会员状态"""
        db_user = UserCRUD.get_by_id(db, user_id)
        if not db_user:
            return False
        
        if db_user.role == UserRole.ADMIN:
            return True
        
        if db_user.role == UserRole.PREMIUM and db_user.premium_expires_at:
            return db_user.premium_expires_at > datetime.utcnow()
        
        return False

# Markdown文档CRUD操作
class MarkdownDocumentCRUD:
    @staticmethod
    def get_by_id(db: Session, doc_id: int, user_id: Optional[int] = None) -> Optional[MarkdownDocument]:
        """根据ID获取文档"""
        query = db.query(MarkdownDocument).filter(
            and_(
                MarkdownDocument.id == doc_id,
                MarkdownDocument.is_deleted == False
            )
        )
        
        if user_id:
            query = query.filter(MarkdownDocument.user_id == user_id)
        
        return query.first()
    
    @staticmethod
    def get_user_documents(
        db: Session, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 100,
        include_public: bool = False
    ) -> List[MarkdownDocument]:
        """获取用户的文档列表"""
        query = db.query(MarkdownDocument).filter(
            and_(
                MarkdownDocument.is_deleted == False,
                or_(
                    MarkdownDocument.user_id == user_id,
                    and_(MarkdownDocument.is_public == True, include_public)
                )
            )
        ).order_by(desc(MarkdownDocument.updated_at))
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def create(db: Session, doc: MarkdownDocumentCreate, user_id: int) -> MarkdownDocument:
        """创建文档"""
        db_doc = MarkdownDocument(
            **doc.dict(),
            user_id=user_id
        )
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)
        
        # 更新用户统计
        from app.auth import update_user_stats
        update_user_stats(db.query(User).filter(User.id == user_id).first(), db, document_count=1)
        
        return db_doc
    
    @staticmethod
    def update(db: Session, doc_id: int, doc_update: MarkdownDocumentUpdate, user_id: int) -> Optional[MarkdownDocument]:
        """更新文档"""
        db_doc = MarkdownDocumentCRUD.get_by_id(db, doc_id, user_id)
        if not db_doc:
            return None
        
        update_data = doc_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_doc, field, value)
        
        db.commit()
        db.refresh(db_doc)
        return db_doc
    
    @staticmethod
    def delete(db: Session, doc_id: int, user_id: int) -> bool:
        """删除文档（软删除）"""
        db_doc = MarkdownDocumentCRUD.get_by_id(db, doc_id, user_id)
        if not db_doc:
            return False
        
        db_doc.is_deleted = True
        db.commit()
        
        # 更新用户统计
        from app.auth import update_user_stats
        update_user_stats(db.query(User).filter(User.id == user_id).first(), db, document_count=-1)
        
        return True
    
    @staticmethod
    def increment_view_count(db: Session, doc_id: int) -> None:
        """增加查看次数"""
        db_doc = db.query(MarkdownDocument).filter(MarkdownDocument.id == doc_id).first()
        if db_doc:
            db_doc.view_count += 1
            db.commit()
    
    @staticmethod
    def increment_conversion_count(db: Session, doc_id: int, user_id: int) -> None:
        """增加转换次数"""
        db_doc = db.query(MarkdownDocument).filter(MarkdownDocument.id == doc_id).first()
        if db_doc:
            db_doc.conversion_count += 1
            db_doc.last_converted_at = datetime.utcnow()
            db.commit()
            
            # 更新用户统计
            from app.auth import update_user_stats
            update_user_stats(db.query(User).filter(User.id == user_id).first(), db, conversion_count=1)
    
    @staticmethod
    def search_documents(
        db: Session, 
        user_id: int, 
        search_term: str,
        skip: int = 0, 
        limit: int = 100
    ) -> List[MarkdownDocument]:
        """搜索文档"""
        return db.query(MarkdownDocument).filter(
            and_(
                MarkdownDocument.user_id == user_id,
                MarkdownDocument.is_deleted == False,
                or_(
                    MarkdownDocument.title.contains(search_term),
                    MarkdownDocument.content.contains(search_term),
                    MarkdownDocument.description.contains(search_term)
                )
            )
        ).order_by(desc(MarkdownDocument.updated_at)).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_public_documents(db: Session, skip: int = 0, limit: int = 100) -> List[MarkdownDocument]:
        """获取公开文档"""
        return db.query(MarkdownDocument).filter(
            and_(
                MarkdownDocument.is_public == True,
                MarkdownDocument.is_deleted == False
            )
        ).order_by(desc(MarkdownDocument.view_count)).offset(skip).limit(limit).all() 