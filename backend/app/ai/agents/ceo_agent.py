from __future__ import annotations
import json
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class CEOAgent(BaseAgent):
    name = "ceo"
    task_type = "planning"
    system_prompt = """You are the CEO Agent of Swift AI OS. You orchestrate a team of specialist agents.
Your job:
1. Understand the user's intent.
2. If the request is simple OR asks for code/structure/explanation that can be answered directly, answer directly with complete, rich, structured markdown. Do NOT delegate if you can answer directly.
3. If delegation is truly necessary for heavy full-stack building, delegate to MAXIMUM 2-3 unique specialist agents (e.g., 'frontend', 'backend', 'docs'). Never assign duplicate agents (e.g. do NOT assign multiple 'frontend' or 'vision' agents).
4. Available specialist agents: planner, coding, backend, frontend, database, testing, docs, devops, research, vision, memory.

Respond in strict JSON:
{"decision": "direct"|"delegate", "answer": "...", "plan": [{"title": "...", "agent": "frontend"|"backend"|"coding"|"docs", "description": "..."}]}
"""

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({"agent": self.name, "model": thought["model"], "content": thought["content"][:500]})
        state.model_used = thought["model"]
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))

        raw = thought["content"].strip()

        # Strip markdown code fences if model wrapped JSON in ```json ... ```
        if raw.startswith("```"):
            lines = raw.splitlines()
            raw = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])

        try:
            decision = json.loads(raw)
        except Exception:
            state.final_answer = raw
            return {"next": "end"}

        if decision.get("decision") == "delegate" and decision.get("plan"):
            from app.ai.agents.state import Task
            seen_agents = set()
            for t in decision["plan"]:
                agent_name = t.get("agent", "coding")
                # Deduplicate agent assignments & cap at max 3 tasks to avoid rate limits
                if agent_name not in seen_agents and len(state.active_tasks) < 3:
                    seen_agents.add(agent_name)
                    task = Task(
                        title=t.get("title", f"{agent_name.capitalize()} Task"),
                        description=t.get("description", ""),
                        assigned_agent=agent_name,
                    )
                    state.active_tasks[task.id] = task
            state.tasks_created = len(state.active_tasks)
            if state.tasks_created > 0:
                return {"next": "planner"}

        answer = decision.get("answer", raw)
        if isinstance(answer, str) and answer.strip().startswith("{"):
            try:
                inner = json.loads(answer)
                answer = inner.get("answer", answer)
            except Exception:
                pass
        state.final_answer = answer
        return {"next": "end"}


ceo_agent = CEOAgent()
