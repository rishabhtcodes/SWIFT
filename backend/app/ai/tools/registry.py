from __future__ import annotations
from typing import Any, Callable, Awaitable

from app.ai.tools.filesystem import FileSystemTool
from app.ai.tools.terminal import TerminalTool
from app.ai.tools.python_executor import PythonExecutorTool
from app.ai.tools.browser import BrowserTool
from app.ai.tools.github import GitHubTool
from app.ai.tools.web_search import WebSearchTool
from app.ai.tools.calculator import CalculatorTool
from app.ai.tools.docker_tool import DockerTool


ToolFn = Callable[..., Awaitable[Any]]


class ToolRegistry:
    def __init__(self):
        self._tools: dict[str, dict[str, Any]] = {}
        self._agent_tools: dict[str, list[str]] = {
            "coding": ["write_file", "read_file", "run_python", "run_shell", "search_codebase"],
            "research": ["web_search", "read_url", "read_file"],
            "vision": ["read_url", "read_file"],
            "deployment": ["run_shell", "docker"],
            "testing": ["run_python", "run_shell", "read_file", "write_file"],
            "docs": ["read_file", "write_file", "web_search"],
            "database": ["run_shell", "read_file", "write_file"],
            "frontend": ["write_file", "read_file", "run_shell"],
            "backend": ["write_file", "read_file", "run_shell", "run_python"],
            "devops": ["run_shell", "docker"],
            "memory": ["read_file", "write_file"],
            "learning": ["read_file", "write_file"],
            "ceo": [],
            "planner": [],
        }
        self._register_defaults()

    def _register_defaults(self) -> None:
        fs = FileSystemTool()
        self.register("write_file", fs.write_file, description="Write content to a file", parameters={"path": "str", "content": "str"})
        self.register("read_file", fs.read_file, description="Read file contents", parameters={"path": "str"})
        self.register("search_codebase", fs.search, description="Search codebase with regex", parameters={"pattern": "str", "path": "str"})

        term = TerminalTool()
        self.register("run_shell", term.run, description="Run a shell command", parameters={"command": "str"})

        py = PythonExecutorTool()
        self.register("run_python", py.run, description="Execute Python code in sandbox", parameters={"code": "str"})

        browser = BrowserTool()
        self.register("read_url", browser.read_url, description="Fetch and extract text from a URL", parameters={"url": "str"})

        search = WebSearchTool()
        self.register("web_search", search.search, description="Search the web", parameters={"query": "str"})

        calc = CalculatorTool()
        self.register("calculate", calc.calculate, description="Evaluate a math expression", parameters={"expression": "str"})

        docker = DockerTool()
        self.register("docker", docker.run, description="Run docker commands", parameters={"command": "str"})

        gh = GitHubTool()
        self.register("github", gh.invoke, description="GitHub operations", parameters={"action": "str", "params": "dict"})

    def register(self, name: str, fn: ToolFn, description: str = "", parameters: dict | None = None) -> None:
        self._tools[name] = {"fn": fn, "description": description, "parameters": parameters or {}}

    def get_tools_for_agent(self, agent_name: str) -> list[dict[str, Any]]:
        names = self._agent_tools.get(agent_name, [])
        return [
            {
                "type": "function",
                "function": {
                    "name": n,
                    "description": self._tools[n]["description"],
                    "parameters": {"type": "object", "properties": {k: {"type": "string"} for k in self._tools[n]["parameters"]}},
                },
            }
            for n in names
            if n in self._tools
        ]

    async def invoke(self, name: str, **kwargs) -> Any:
        tool = self._tools.get(name)
        if not tool:
            raise ValueError(f"Unknown tool: {name}")
        return await tool["fn"](**kwargs)


tool_registry = ToolRegistry()