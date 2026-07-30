from __future__ import annotations
import sys
import io
import traceback

class PythonExecutorTool:
    async def run(self, code: str) -> dict:
        old_stdout = sys.stdout
        redirected_output = sys.stdout = io.StringIO()
        try:
            exec_globals = {}
            exec(code, exec_globals)
            return {"status": "ok", "output": redirected_output.getvalue()}
        except Exception:
            return {"status": "error", "error": traceback.format_exc()}
        finally:
            sys.stdout = old_stdout
