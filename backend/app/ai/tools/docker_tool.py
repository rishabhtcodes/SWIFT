from __future__ import annotations
import asyncio

class DockerTool:
    async def run(self, command: str) -> dict:
        proc = await asyncio.create_subprocess_shell(
            f"docker {command}",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await proc.communicate()
        return {
            "exit_code": proc.returncode,
            "stdout": stdout.decode(errors="ignore"),
            "stderr": stderr.decode(errors="ignore"),
        }
