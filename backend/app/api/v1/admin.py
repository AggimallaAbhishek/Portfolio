from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session, joinedload

from app.core.config import get_settings
from app.core.dependencies import get_current_admin
from app.db.session import get_db
from app.models.models import BlogCategory, BlogPost, BlogTag, ContactMessage, Project, ProjectImage, User
from app.schemas.portfolio import (
    BlogPostCreate,
    BlogPostResponse,
    BlogPostUpdate,
    ContactMessageResponse,
    ContactMessageUpdate,
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
    UploadResponse,
)
from app.utils.slug import slugify

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])


def _get_or_create_category(name: str | None, db: Session) -> BlogCategory | None:
    if not name:
        return None
    slug = slugify(name)
    category = db.query(BlogCategory).filter(BlogCategory.slug == slug).first()
    if not category:
        category = BlogCategory(name=name, slug=slug)
        db.add(category)
        db.flush()
    return category


def _get_or_create_tags(names: list[str], db: Session) -> list[BlogTag]:
    tags: list[BlogTag] = []
    for name in names:
        slug = slugify(name)
        tag = db.query(BlogTag).filter(BlogTag.slug == slug).first()
        if not tag:
            tag = BlogTag(name=name, slug=slug)
            db.add(tag)
            db.flush()
        tags.append(tag)
    return tags


def _serialize_post(post: BlogPost) -> BlogPostResponse:
    return BlogPostResponse(
        id=post.id,
        title=post.title,
        slug=post.slug,
        excerpt=post.excerpt,
        content_markdown=post.content_markdown,
        cover_image=post.cover_image,
        published=post.published,
        published_at=post.published_at,
        created_at=post.created_at,
        updated_at=post.updated_at,
        author_name=post.author.full_name,
        category=post.category,
        tags=post.tags,
    )


@router.get("/projects", response_model=list[ProjectResponse])
def admin_list_projects(db: Session = Depends(get_db), _: User = Depends(get_current_admin)) -> list[Project]:
    return db.query(Project).options(joinedload(Project.images)).order_by(Project.sort_order).all()


@router.post("/projects", response_model=ProjectResponse, status_code=201)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> Project:
    project = Project(
        title=payload.title,
        slug=slugify(payload.title),
        summary=payload.summary,
        description=payload.description,
        tech_stack=payload.tech_stack,
        github_url=payload.github_url,
        live_url=payload.live_url,
        featured=payload.featured,
        sort_order=payload.sort_order,
        images=[ProjectImage(**image.model_dump()) for image in payload.images],
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/projects/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> Project:
    project = db.query(Project).options(joinedload(Project.images)).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.title = payload.title
    project.slug = slugify(payload.title)
    project.summary = payload.summary
    project.description = payload.description
    project.tech_stack = payload.tech_stack
    project.github_url = payload.github_url
    project.live_url = payload.live_url
    project.featured = payload.featured
    project.sort_order = payload.sort_order
    project.images = [ProjectImage(**image.model_dump()) for image in payload.images]
    db.commit()
    db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> None:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()


@router.get("/blog/posts", response_model=list[BlogPostResponse])
def admin_list_posts(db: Session = Depends(get_db), _: User = Depends(get_current_admin)) -> list[BlogPostResponse]:
    posts = (
        db.query(BlogPost)
        .options(joinedload(BlogPost.category), joinedload(BlogPost.tags), joinedload(BlogPost.author))
        .order_by(BlogPost.created_at.desc())
        .all()
    )
    return [_serialize_post(post) for post in posts]


@router.post("/blog/posts", response_model=BlogPostResponse, status_code=201)
def create_blog_post(
    payload: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> BlogPostResponse:
    post = BlogPost(
        title=payload.title,
        slug=slugify(payload.title),
        excerpt=payload.excerpt,
        content_markdown=payload.content_markdown,
        cover_image=payload.cover_image,
        published=payload.published,
        published_at=datetime.now(timezone.utc) if payload.published else None,
        author_id=current_user.id,
    )
    post.category = _get_or_create_category(payload.category, db)
    post.tags = _get_or_create_tags(payload.tags, db)
    db.add(post)
    db.commit()
    post = (
        db.query(BlogPost)
        .options(joinedload(BlogPost.category), joinedload(BlogPost.tags), joinedload(BlogPost.author))
        .filter(BlogPost.id == post.id)
        .first()
    )
    return _serialize_post(post)


@router.put("/blog/posts/{post_id}", response_model=BlogPostResponse)
def update_blog_post(
    post_id: int,
    payload: BlogPostUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> BlogPostResponse:
    post = (
        db.query(BlogPost)
        .options(joinedload(BlogPost.category), joinedload(BlogPost.tags), joinedload(BlogPost.author))
        .filter(BlogPost.id == post_id)
        .first()
    )
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    post.title = payload.title
    post.slug = slugify(payload.title)
    post.excerpt = payload.excerpt
    post.content_markdown = payload.content_markdown
    post.cover_image = payload.cover_image
    post.published = payload.published
    post.published_at = datetime.now(timezone.utc) if payload.published else None
    post.category = _get_or_create_category(payload.category, db)
    post.tags = _get_or_create_tags(payload.tags, db)
    db.commit()
    db.refresh(post)
    return _serialize_post(post)


@router.delete("/blog/posts/{post_id}", status_code=204)
def delete_blog_post(
    post_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> None:
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    db.delete(post)
    db.commit()


@router.get("/messages", response_model=list[ContactMessageResponse])
def list_messages(db: Session = Depends(get_db), _: User = Depends(get_current_admin)) -> list[ContactMessage]:
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


@router.put("/messages/{message_id}", response_model=ContactMessageResponse)
def update_message(
    message_id: int,
    payload: ContactMessageUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> ContactMessage:
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    message.status = payload.status
    message.is_read = payload.is_read
    db.commit()
    db.refresh(message)
    return message


@router.delete("/messages/{message_id}", status_code=204)
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> None:
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(message)
    db.commit()


@router.post("/uploads/image", response_model=UploadResponse, status_code=201)
async def upload_image(
    file: UploadFile = File(...),
    _: User = Depends(get_current_admin),
) -> UploadResponse:
    settings = get_settings()
    uploads_path = Path(settings.uploads_dir)
    uploads_path.mkdir(parents=True, exist_ok=True)

    safe_name = f"{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{file.filename.replace(' ', '-')}"
    file_path = uploads_path / safe_name
    content = await file.read()
    file_path.write_bytes(content)

    return UploadResponse(file_name=safe_name, file_url=f"/uploads/{safe_name}")
