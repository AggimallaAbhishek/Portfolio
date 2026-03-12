from datetime import datetime

import httpx

from app.schemas.portfolio import GitHubActivityItem


async def fetch_github_activity(username: str) -> list[GitHubActivityItem]:
    url = f"https://api.github.com/users/{username}/events/public"
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url, headers={"Accept": "application/vnd.github+json"})
        response.raise_for_status()
        events = response.json()[:8]

    activity: list[GitHubActivityItem] = []
    for event in events:
        repo_name = event.get("repo", {}).get("name", username)
        event_type = event.get("type", "Activity")
        created_raw = event.get("created_at")
        created_at = datetime.fromisoformat(created_raw.replace("Z", "+00:00")) if created_raw else None
        payload = event.get("payload", {})
        message = _build_message(event_type, payload)
        activity.append(
            GitHubActivityItem(
                id=event.get("id", ""),
                type=event_type,
                repo_name=repo_name,
                created_at=created_at,
                url=f"https://github.com/{repo_name}",
                message=message,
            )
        )
    return activity


def _build_message(event_type: str, payload: dict) -> str:
    if event_type == "PushEvent":
        commits = payload.get("commits", [])
        if commits:
            return commits[0].get("message", "Pushed new commits")
        return "Pushed updates"
    if event_type == "CreateEvent":
        ref_type = payload.get("ref_type", "resource")
        return f"Created a new {ref_type}"
    if event_type == "PullRequestEvent":
        action = payload.get("action", "updated")
        return f"{action.capitalize()} a pull request"
    if event_type == "IssuesEvent":
        action = payload.get("action", "updated")
        return f"{action.capitalize()} an issue"
    return "Shared new GitHub activity"
