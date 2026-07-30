from __future__ import annotations
from typing import Any, AsyncIterator
import json

from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.ai.agents.state import GraphState, AgentMessage
from app.ai.agents.ceo_agent import ceo_agent
from app.ai.agents.planner_agent import planner_agent
from app.ai.agents.coding_agent import coding_agent
from app.ai.agents.research_agent import research_agent
from app.ai.agents.memory_agent import memory_agent
from app.ai.agents.vision_agent import vision_agent
from app.ai.agents.learning_agent import learning_agent
from app.ai.agents.deployment_agent import deployment_agent
from app.ai.agents.testing_agent import testing_agent
from app.ai.agents.docs_agent import docs_agent
from app.ai.agents.database_agent import database_agent
from app.ai.agents.frontend_agent import frontend_agent
from app.ai.agents.backend_agent import backend_agent
from app.ai.agents.devops_agent import devops_agent
from app.services.agent_service import AgentService


AGENT_MAP = {
    "ceo": ceo_agent,
    "planner": planner_agent,
    "coding": coding_agent,
    "research": research_agent,
    "memory": memory_agent,
    "vision": vision_agent,
    "learning": learning_agent,
    "deployment": deployment_agent,
    "testing": testing_agent,
    "docs": docs_agent,
    "database": database_agent,
    "frontend": frontend_agent,
    "backend": backend_agent,
    "devops": devops_agent,
}


class Orchestrator:
    """LangGraph-style stateful orchestrator with conditional routing."""

    async def run(self, user_id: UUID, project_id: UUID | None, user_message: str, session: AsyncSession, image_base64: str | None = None, document_id: str | None = None) -> dict[str, Any]:
        state = GraphState(
            user_id=user_id,
            project_id=project_id,
            user_message=user_message,
            messages=[AgentMessage(role="user", content=user_message, agent="user")],
            image_base64=image_base64,
            document_id=document_id,
        )
        agent_service = AgentService(session)
        current = "ceo"

        while current != "end" and state.iteration < state.max_iterations:
            state.iteration += 1
            state.current_agent = current
            agent = AGENT_MAP.get(current)
            if not agent:
                state.error = f"Unknown agent: {current}"
                break

            # Persist run start
            run = await agent_service.start_run(user_id, project_id, current, state.user_message)

            try:
                result = await agent.run(state, session)
                await agent_service.finish_run(run.id, status="completed", output=result)
            except Exception as e:
                await agent_service.finish_run(run.id, status="failed", error=str(e))
                state.error = str(e)
                break

            next_node = result.get("next", "end")

            # Conditional routing
            if current == "ceo" and next_node == "planner":
                current = "planner"
            elif current == "planner" and next_node == "executor":
                # Execute tasks in parallel (simplified: sequential here)
                for task in list(state.active_tasks.values()):
                    task.status = "running"
                    task_agent = AGENT_MAP.get(task.assigned_agent, coding_agent)
                    sub_state = GraphState(
                        user_id=user_id,
                        project_id=project_id,
                        user_message=f"{task.title}\n\n{task.description}",
                        messages=state.messages.copy(),
                    )
                    await task_agent.run(sub_state, session)
                    task.status = "done"
                    task.result = sub_state.messages[-1].content if sub_state.messages else ""
                    state.completed_tasks[task.id] = task
                current = "ceo"  # Return to CEO for synthesis
            elif current == "ceo" and not state.final_answer and state.completed_tasks:
                # Synthesize
                synthesis_prompt = "Synthesize these completed task results into a final answer:\n" + "\n".join(
                    f"- [{t.title}]: {t.result}" for t in state.completed_tasks.values()
                )
                state.user_message = synthesis_prompt
                current = "ceo"
            elif next_node == "end" or (current == "ceo" and state.final_answer):
                current = "end"
            else:
                current = next_node

        # Learning step: extract lessons
        try:
            await learning_agent.run(state, session)
        except Exception:
            pass

        return {
            "final_answer": state.final_answer or "Task completed.",
            "trace": state.trace,
            "tasks_created": state.tasks_created,
            "model_used": state.model_used,
        }

    async def stream(self, user_id: UUID, project_id: UUID | None, user_message: str, session: AsyncSession, image_base64: str | None = None, document_id: str | None = None) -> AsyncIterator[str]:
        """SSE streaming wrapper around run()."""
        state = GraphState(
            user_id=user_id,
            project_id=project_id,
            user_message=user_message,
            messages=[AgentMessage(role="user", content=user_message, agent="user")],
            image_base64=image_base64,
            document_id=document_id,
        )
        yield json.dumps({"type": "start", "message": user_message})
        current = "ceo"
        while current != "end" and state.iteration < state.max_iterations:
            state.iteration += 1
            state.current_agent = current
            agent = AGENT_MAP.get(current)
            if not agent:
                break
            yield json.dumps({"type": "agent_start", "agent": current})
            try:
                result = await agent.run(state, session)
                yield json.dumps({"type": "agent_done", "agent": current, "next": result.get("next")})
            except Exception as e:
                yield json.dumps({"type": "error", "error": str(e)})
                break
            next_node = result.get("next", "end")

            if current == "ceo" and next_node == "planner":
                current = "planner"
            elif current == "planner" and next_node == "executor":
                for task in list(state.active_tasks.values()):
                    task.status = "running"
                    task_agent = AGENT_MAP.get(task.assigned_agent, coding_agent)
                    sub_state = GraphState(
                        user_id=user_id,
                        project_id=project_id,
                        user_message=f"{task.title}\n\n{task.description}",
                        messages=state.messages.copy(),
                    )
                    yield json.dumps({"type": "agent_start", "agent": task.assigned_agent})
                    try:
                        await task_agent.run(sub_state, session)
                    except Exception:
                        pass
                    task.status = "done"
                    task.result = sub_state.messages[-1].content if sub_state.messages else ""
                    state.completed_tasks[task.id] = task
                current = "ceo"
            elif current == "ceo" and not state.final_answer and state.completed_tasks:
                synthesis_prompt = "Synthesize these completed task results into a final answer:\n" + "\n".join(
                    f"- [{t.title}]: {t.result}" for t in state.completed_tasks.values()
                )
                state.user_message = synthesis_prompt
                # Reset completed tasks so it doesn't loop forever
                state.completed_tasks = {}
                current = "ceo"
            elif next_node == "end" or (current == "ceo" and state.final_answer):
                current = "end"
            else:
                current = next_node
        yield json.dumps({"type": "done", "answer": state.final_answer or "Completed."})


orchestrator = Orchestrator()