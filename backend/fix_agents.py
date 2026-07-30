import os
import glob
import re

agent_files = glob.glob(r"d:\GenAI\Capstone\SWIFT\backend\app\ai\agents\*_agent.py")

dict_append_regex = re.compile(r'state\.messages\.append\(\{\s*"role"\s*:\s*"assistant"\s*,\s*"content"\s*:\s*thought\["content"\]\s*,\s*"agent"\s*:\s*self\.name\s*\}\)')
import_statement = "from app.ai.agents.state import AgentMessage\n"
new_append = 'state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))'

for file_path in agent_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    if "state.messages.append({" in content or "state.messages.append( {" in content:
        # replace the dict append
        content = dict_append_regex.sub(new_append, content)
        
        # add import if not there
        if "AgentMessage" not in content:
            # find where to insert
            if "from app.ai.agents.state import" in content:
                content = content.replace(
                    "from app.ai.agents.state import GraphState",
                    "from app.ai.agents.state import GraphState, AgentMessage"
                )
            else:
                lines = content.splitlines()
                lines.insert(2, import_statement)
                content = "\n".join(lines)
                
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed {os.path.basename(file_path)}")
