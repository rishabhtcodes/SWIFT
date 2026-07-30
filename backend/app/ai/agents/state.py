from __future__ import annotations
from typing import Any, Annotated
from dataclasses import dataclass, field
from uuid import UUID, uuid4


@dataclass
class Task:
    id: str = field(default_factory=lambda: str(uuid4()))
    title: str = ""
    description: str = ""
    assigned_agent: str = ""
    status: str = "pending"  # pending | running | done | failed
    result: Any = None
    dependencies: list[str] = field(default_factory=list)


@dataclass
class AgentMessage:
    role: str
    content: str
    agent: str = ""
    tool_calls: list[dict[str, Any]] = field(default_factory=list)


@dataclass
class GraphState:
    user_id: UUID
    project_id: UUID | None
    user_message: str
    messages: list[AgentMessage] = field(default_factory=list)
    plan: list[Task] = field(default_factory=list)
    current_agent: str = "ceo"
    active_tasks: dict[str, Task] = field(default_factory=dict)
    completed_tasks: dict[str, Task] = field(default_factory=dict)
    final_answer: str = ""
    model_used: str | None = None
    trace: list[dict[str, Any]] = field(default_factory=list)
    tasks_created: int = 0
    iteration: int = 0
    max_iterations: int = 25
    error: str | None = None
    image_base64: str | None = None
    document_id: str | None = None