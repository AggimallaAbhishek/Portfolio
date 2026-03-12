from datetime import date, datetime

from pydantic import BaseModel, EmailStr, Field


class SkillResponse(BaseModel):
    id: int
    name: str
    category: str
    sort_order: int

    class Config:
        from_attributes = True


class ProjectImageBase(BaseModel):
    image_url: str
    alt_text: str | None = None
    sort_order: int = 0


class ProjectImageCreate(ProjectImageBase):
    pass


class ProjectImageResponse(ProjectImageBase):
    id: int

    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    title: str
    summary: str = Field(max_length=400)
    description: str
    tech_stack: list[str]
    github_url: str | None = None
    live_url: str | None = None
    featured: bool = False
    sort_order: int = 0
    images: list[ProjectImageCreate] = Field(default_factory=list)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: datetime
    images: list[ProjectImageResponse]

    class Config:
        from_attributes = True


class BlogCategoryResponse(BaseModel):
    id: int
    name: str
    slug: str

    class Config:
        from_attributes = True


class BlogTagResponse(BaseModel):
    id: int
    name: str
    slug: str

    class Config:
        from_attributes = True


class BlogPostBase(BaseModel):
    title: str
    excerpt: str = Field(max_length=400)
    content_markdown: str
    cover_image: str | None = None
    published: bool = False
    category: str | None = None
    tags: list[str] = Field(default_factory=list)


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BlogPostBase):
    pass


class BlogPostResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: str
    content_markdown: str
    cover_image: str | None = None
    published: bool
    published_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    author_name: str
    category: BlogCategoryResponse | None = None
    tags: list[BlogTagResponse] = []


class ExperienceResponse(BaseModel):
    id: int
    title: str
    organization: str
    experience_type: str
    location: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    description: str
    highlight: str | None = None
    sort_order: int

    class Config:
        from_attributes = True


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactMessageUpdate(BaseModel):
    status: str
    is_read: bool


class ContactMessageResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    subject: str
    message: str
    status: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UploadResponse(BaseModel):
    file_name: str
    file_url: str


class ProfileResponse(BaseModel):
    name: str
    role: str
    bio: str
    tagline: str
    location: str
    social_links: dict[str, str]
    skills: dict[str, list[SkillResponse]]


class GitHubActivityItem(BaseModel):
    id: str
    type: str
    repo_name: str
    created_at: datetime | None = None
    url: str | None = None
    message: str


class DashboardSummary(BaseModel):
    project_count: int
    published_posts: int
    unread_messages: int
    technologies: list[str]
