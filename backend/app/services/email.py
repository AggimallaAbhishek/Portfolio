import logging
import smtplib
from email.message import EmailMessage

from app.core.config import get_settings
from app.models.models import ContactMessage

logger = logging.getLogger(__name__)


def send_contact_notification(message: ContactMessage) -> None:
    settings = get_settings()
    if not settings.smtp_host or not settings.smtp_user or not settings.smtp_password:
        logger.info(
            "SMTP not configured. Stored contact message from %s <%s> with subject %s.",
            message.name,
            message.email,
            message.subject,
        )
        return

    email = EmailMessage()
    email["Subject"] = f"[Portfolio Contact] {message.subject}"
    email["From"] = settings.smtp_from_email
    email["To"] = settings.smtp_to_email
    email.set_content(
        f"Name: {message.name}\n"
        f"Email: {message.email}\n"
        f"Subject: {message.subject}\n\n"
        f"{message.message}\n"
    )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        if settings.smtp_use_tls:
            server.starttls()
        server.login(settings.smtp_user, settings.smtp_password)
        server.send_message(email)
