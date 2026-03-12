from collections import defaultdict

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.core.config import get_settings
from app.db.session import get_db
from app.models.models import BlogPost, ContactMessage, Experience, Project, Skill
from app.schemas.portfolio import (
    BlogPostResponse,
    ContactMessageCreate,
    DashboardSummary,
    ExperienceResponse,
    GitHubActivityItem,
    ProfileResponse,
    ProjectResponse,
)
from app.services.email import send_contact_notification
from app.services.github import fetch_github_activity

router = APIRouter(tags=["public"])


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


@router.get("/profile", response_model=ProfileResponse)
def get_profile(db: Session = Depends(get_db)) -> ProfileResponse:
    grouped_skills: dict[str, list] = defaultdict(list)
    skills = db.query(Skill).order_by(Skill.category, Skill.sort_order, Skill.name).all()
    for skill in skills:
        grouped_skills[skill.category].append(skill)

    return ProfileResponse(
        name="Aggimalla Abhishek",
        role="Data Science & AI Student at IIIT Dharwad",
        bio=(
            "I am a Data Science and AI student passionate about building intelligent systems, "
            "backend applications, and secure software. I enjoy working with Python, machine learning, "
            "and full-stack development."
        ),
        tagline="Building intelligent products with clean backend architecture and thoughtful interfaces.",
        location="Dharwad, India",
        social_links={
            "github": "https://github.com/AggimallaAbhishek",
            "linkedin": "https://www.linkedin.com/in/aggimalla-abhishek-a8397829a/",
            "email": "mailto:abhishek.aggimalla.dev@gmail.com",
        },
        skills=grouped_skills,
    )


@router.get("/projects", response_model=list[ProjectResponse])
def list_projects(
    tech: str | None = Query(default=None),
    featured: bool | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[Project]:
    query = db.query(Project).options(joinedload(Project.images)).order_by(Project.sort_order, Project.created_at.desc())
    if featured is not None:
        query = query.filter(Project.featured == featured)
    projects = query.all()
    if tech:
        tech_filter = tech.lower()
        projects = [
            project
            for project in projects
            if any(item.lower() == tech_filter or tech_filter in item.lower() for item in (project.tech_stack or []))
        ]
    return projects


@router.get("/projects/{slug}", response_model=ProjectResponse)
def get_project(slug: str, db: Session = Depends(get_db)) -> Project:
    project = (
        db.query(Project)
        .options(joinedload(Project.images))
        .filter(Project.slug == slug)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("/experience", response_model=list[ExperienceResponse])
def list_experience(db: Session = Depends(get_db)) -> list[Experience]:
    return db.query(Experience).order_by(Experience.sort_order).all()


@router.get("/blog/posts", response_model=list[BlogPostResponse])
def list_blog_posts(
    tag: str | None = Query(default=None),
    category: str | None = Query(default=None),
    include_unpublished: bool = Query(default=False),
    db: Session = Depends(get_db),
) -> list[BlogPostResponse]:
    query = (
        db.query(BlogPost)
        .options(joinedload(BlogPost.category), joinedload(BlogPost.tags), joinedload(BlogPost.author))
        .order_by(BlogPost.published_at.desc().nullslast(), BlogPost.created_at.desc())
    )
    if not include_unpublished:
        query = query.filter(BlogPost.published.is_(True))
    posts = query.all()
    if tag:
        normalized_tag = tag.lower()
        posts = [post for post in posts if any(item.slug == normalized_tag or item.name.lower() == normalized_tag for item in post.tags)]
    if category:
        normalized_category = category.lower()
        posts = [
            post
            for post in posts
            if post.category and (post.category.slug == normalized_category or post.category.name.lower() == normalized_category)
        ]
    return [_serialize_post(post) for post in posts]


@router.get("/blog/posts/{slug}", response_model=BlogPostResponse)
def get_blog_post(slug: str, db: Session = Depends(get_db)) -> BlogPostResponse:
    post = (
        db.query(BlogPost)
        .options(joinedload(BlogPost.category), joinedload(BlogPost.tags), joinedload(BlogPost.author))
        .filter(BlogPost.slug == slug, BlogPost.published.is_(True))
        .first()
    )
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return _serialize_post(post)


@router.post("/contact", status_code=201)
def create_contact_message(
    payload: ContactMessageCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    message = ContactMessage(**payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    background_tasks.add_task(send_contact_notification, message)
    return {"detail": "Message received successfully"}


@router.get("/github/activity", response_model=list[GitHubActivityItem])
async def get_github_activity() -> list[GitHubActivityItem]:
    settings = get_settings()
    return await fetch_github_activity(settings.github_username)


@router.get("/summary", response_model=DashboardSummary)
def get_summary(db: Session = Depends(get_db)) -> DashboardSummary:
    technologies = sorted(
        {
            tech
            for project in db.query(Project).all()
            for tech in (project.tech_stack or [])
        }
    )
    unread_messages = db.query(ContactMessage).filter(ContactMessage.is_read.is_(False)).count()
    return DashboardSummary(
        project_count=db.query(Project).count(),
        published_posts=db.query(BlogPost).filter(BlogPost.published.is_(True)).count(),
        unread_messages=unread_messages,
        technologies=technologies,
    )
