from datetime import date, datetime, timezone

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import get_password_hash
from app.models.models import (
    BlogCategory,
    BlogPost,
    BlogTag,
    Experience,
    ExperienceType,
    Project,
    ProjectImage,
    Skill,
    User,
)
from app.utils.slug import slugify


def seed_database(db: Session) -> None:
    settings = get_settings()

    admin = db.query(User).filter(User.email == settings.admin_email).first()
    if not admin:
        admin = User(
            email=settings.admin_email,
            full_name=settings.admin_full_name,
            hashed_password=get_password_hash(settings.admin_password),
            is_admin=True,
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

    if db.query(Skill).count() == 0:
        skills = [
            ("Python", "Programming"),
            ("Java", "Programming"),
            ("C++", "Programming"),
            ("SQL", "Programming"),
            ("Machine Learning", "Data Science"),
            ("Deep Learning", "Data Science"),
            ("Pandas", "Data Science"),
            ("scikit-learn", "Data Science"),
            ("React", "Web Development"),
            ("FastAPI", "Web Development"),
            ("Tailwind CSS", "Web Development"),
            ("REST APIs", "Web Development"),
            ("PostgreSQL", "Tools & Technologies"),
            ("Docker", "Tools & Technologies"),
            ("Git", "Tools & Technologies"),
            ("Linux", "Tools & Technologies"),
        ]
        db.add_all(
            [Skill(name=name, category=category, sort_order=index) for index, (name, category) in enumerate(skills)]
        )
        db.commit()

    if db.query(Project).count() == 0:
        project_payload = [
            {
                "title": "VisionSort AI",
                "summary": "Computer vision pipeline for intelligent object sorting with explainable predictions.",
                "description": (
                    "Built an end-to-end AI workflow for image classification and automated sorting. "
                    "The platform includes a FastAPI backend, model inference services, and a React dashboard "
                    "to inspect predictions, confidence scores, and dataset drift."
                ),
                "tech_stack": ["Python", "FastAPI", "React", "OpenCV", "PostgreSQL"],
                "github_url": "https://github.com/AggimallaAbhishek",
                "live_url": "https://example.com/visionsort",
                "featured": True,
                "sort_order": 1,
                "images": [
                    {
                        "image_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
                        "alt_text": "VisionSort AI dashboard preview",
                        "sort_order": 1,
                    },
                    {
                        "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
                        "alt_text": "Computer vision robotics concept",
                        "sort_order": 2,
                    },
                ],
            },
            {
                "title": "WealthWise Finance Manager",
                "summary": "Secure finance dashboard with insights, goal tracking, and predictive analytics.",
                "description": (
                    "Designed a full-stack application with analytics widgets, account summaries, "
                    "and role-based access patterns. The project emphasizes clean API design, SQL modeling, "
                    "and actionable insight cards powered by Python services."
                ),
                "tech_stack": ["React", "TypeScript", "FastAPI", "PostgreSQL", "Docker"],
                "github_url": "https://github.com/AggimallaAbhishek",
                "live_url": "https://example.com/wealthwise",
                "featured": True,
                "sort_order": 2,
                "images": [
                    {
                        "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
                        "alt_text": "Analytics dashboard preview",
                        "sort_order": 1,
                    }
                ],
            },
            {
                "title": "FluxSentinel",
                "summary": "Monitoring and anomaly detection platform for backend systems and pipelines.",
                "description": (
                    "Created a backend observability tool that aggregates logs, highlights anomalies, "
                    "and visualizes error trends. Focused on resilient backend architecture and developer-friendly diagnostics."
                ),
                "tech_stack": ["Python", "FastAPI", "Docker", "PostgreSQL", "Tailwind CSS"],
                "github_url": "https://github.com/AggimallaAbhishek",
                "live_url": "https://example.com/fluxsentinel",
                "featured": False,
                "sort_order": 3,
                "images": [
                    {
                        "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
                        "alt_text": "Monitoring system concept",
                        "sort_order": 1,
                    }
                ],
            },
        ]

        for payload in project_payload:
            images = payload.pop("images")
            project = Project(slug=slugify(payload["title"]), **payload)
            project.images = [ProjectImage(**image) for image in images]
            db.add(project)
        db.commit()

    if db.query(Experience).count() == 0:
        experiences = [
            Experience(
                title="B.Tech in Data Science and AI",
                organization="IIIT Dharwad",
                experience_type=ExperienceType.education,
                location="Dharwad, India",
                start_date=date(2023, 8, 1),
                end_date=None,
                description=(
                    "Focused on machine learning, artificial intelligence, algorithms, and systems design "
                    "while building practical software projects across data science and web engineering."
                ),
                highlight="Current CGPA and coursework can be expanded in the admin panel.",
                sort_order=1,
            ),
            Experience(
                title="Backend and AI Projects",
                organization="Independent / Academic",
                experience_type=ExperienceType.internship,
                location="Remote",
                start_date=date(2024, 1, 1),
                end_date=None,
                description=(
                    "Developed backend services, ML prototypes, and secure full-stack applications using Python, "
                    "FastAPI, PostgreSQL, Docker, and modern frontend tooling."
                ),
                highlight="Hands-on work with production-style APIs and deployment pipelines.",
                sort_order=2,
            ),
            Experience(
                title="Open Source and Project Showcases",
                organization="GitHub",
                experience_type=ExperienceType.achievement,
                location="Online",
                start_date=date(2024, 6, 1),
                end_date=None,
                description=(
                    "Published portfolio-worthy projects spanning computer vision, analytics dashboards, and "
                    "backend system design with a strong focus on maintainability."
                ),
                highlight="Portfolio content is editable from the admin dashboard.",
                sort_order=3,
            ),
            Experience(
                title="Machine Learning Certifications",
                organization="Coursera / Workshops",
                experience_type=ExperienceType.certification,
                location="Online",
                start_date=date(2024, 5, 1),
                end_date=None,
                description=(
                    "Completed coursework and workshops covering supervised learning, model evaluation, "
                    "deep learning foundations, and deployment-ready AI workflows."
                ),
                highlight="Update with exact certificate names in admin as needed.",
                sort_order=4,
            ),
        ]
        db.add_all(experiences)
        db.commit()

    if db.query(BlogCategory).count() == 0:
        db.add_all(
            [
                BlogCategory(name="AI Engineering", slug="ai-engineering"),
                BlogCategory(name="Backend", slug="backend"),
                BlogCategory(name="Career", slug="career"),
            ]
        )
        db.commit()

    if db.query(BlogTag).count() == 0:
        db.add_all(
            [
                BlogTag(name="FastAPI", slug="fastapi"),
                BlogTag(name="React", slug="react"),
                BlogTag(name="Machine Learning", slug="machine-learning"),
                BlogTag(name="PostgreSQL", slug="postgresql"),
            ]
        )
        db.commit()

    if db.query(BlogPost).count() == 0:
        categories = {category.slug: category for category in db.query(BlogCategory).all()}
        tags = {tag.slug: tag for tag in db.query(BlogTag).all()}
        posts = [
            BlogPost(
                title="Designing APIs for Data-Heavy Applications",
                slug="designing-apis-for-data-heavy-applications",
                excerpt="A practical look at building backend services that stay clean as analytics features grow.",
                content_markdown=(
                    "## Why structure matters\n\n"
                    "When data workflows grow, API design needs to stay predictable. "
                    "I like separating domain models, response schemas, and service functions so experimentation "
                    "does not turn into coupling.\n\n"
                    "## What I optimize for\n\n"
                    "- Clear contracts for frontend clients\n"
                    "- Safe authentication and role checks\n"
                    "- Database schemas that support both products and analysis\n"
                ),
                cover_image="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
                published=True,
                published_at=datetime.now(timezone.utc),
                author_id=admin.id,
                category_id=categories["backend"].id,
                tags=[tags["fastapi"], tags["postgresql"]],
            ),
            BlogPost(
                title="What I Learn by Building AI Projects End to End",
                slug="what-i-learn-by-building-ai-projects-end-to-end",
                excerpt="From model experimentation to frontend delivery, shipping full systems teaches sharper engineering judgment.",
                content_markdown=(
                    "## Beyond notebooks\n\n"
                    "The most valuable AI projects are the ones that move beyond a notebook and into a real user flow. "
                    "That means thinking about APIs, monitoring, UX, latency, and security.\n\n"
                    "## My favorite stack\n\n"
                    "- Python for modeling and services\n"
                    "- FastAPI for clear async-ready APIs\n"
                    "- React for responsive interfaces\n"
                ),
                cover_image="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
                published=True,
                published_at=datetime.now(timezone.utc),
                author_id=admin.id,
                category_id=categories["ai-engineering"].id,
                tags=[tags["machine-learning"], tags["react"]],
            ),
        ]
        db.add_all(posts)
        db.commit()
