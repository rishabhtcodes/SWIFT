from __future__ import annotations
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class CEOAgent(BaseAgent):
    name = "ceo"
    task_type = "planning"
    system_prompt = """You are the CEO Agent of Swift AI OS. You orchestrate a team of specialist agents.
Your job:
1. Understand the user's intent
2. Decide if the request needs decomposition into sub-tasks
3. Route to the right specialist agent(s): planner, coding, research, vision, memory, learning, deployment, testing, docs, database, frontend, backend, devops
4. Synthesize the final answer from agent outputs
If the request is simple or you can answer it directly using the provided context/document contents, answer directly and do not delegate.
IMPORTANT: You HAVE access to attached documents. Their contents are provided to you in the system message under 'Attached Document Content'. Never say you cannot read documents.
If the request is simple, answer directly. Otherwise, produce a structured plan with tasks.
Respond in JSON: {"decision": "direct"|"delegate", "answer": "...", "plan": [{"title": "...", "agent": "...", "description": "..."}]}
"""

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({"agent": self.name, "model": thought["model"], "content": thought["content"][:500]})
        state.model_used = thought["model"]
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))
        import json

        raw = thought["content"].strip()

        # Strip markdown code fences if model wrapped JSON in ```json ... ```
        if raw.startswith("```"):
            lines = raw.splitlines()
            raw = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])

        try:
            decision = json.loads(raw)
        except Exception:
            # Content is plain text — treat as direct answer
            state.final_answer = raw
            return {"next": "end"}

        if decision.get("decision") == "delegate" and decision.get("plan"):
            from app.ai.agents.state import Task
            for t in decision["plan"]:
                task = Task(title=t.get("title", ""), description=t.get("description", ""), assigned_agent=t.get("agent", "planner"))
                state.active_tasks[task.id] = task
            state.tasks_created = len(state.active_tasks)
            return {"next": "planner"}

        # Extract clean answer text (never expose raw JSON to the user)
        answer = decision.get("answer", raw)
        # If answer is itself a JSON string, try to unwrap again
        if isinstance(answer, str) and answer.strip().startswith("{"):
            try:
                inner = json.loads(answer)
                answer = inner.get("answer", answer)
            except Exception:
                pass
        state.final_answer = answer
        return {"next": "end"}


ceo_agent = CEOAgent()
