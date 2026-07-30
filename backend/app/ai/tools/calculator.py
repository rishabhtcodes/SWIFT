from __future__ import annotations
import ast

class CalculatorTool:
    async def calculate(self, expression: str) -> dict:
        try:
            val = eval(expression, {"__builtins__": {}}, {})
            return {"status": "ok", "result": val}
        except Exception as e:
            return {"status": "error", "error": str(e)}
