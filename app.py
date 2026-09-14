import gradio as gr
import os
from openai import OpenAI

# ---------- Helper: call any OpenAI-compatible API ----------
def get_client(api_key: str, base_url: str = None):
    if not api_key:
        return None
    return OpenAI(api_key=api_key, base_url=base_url or "https://api.openai.com/v1")

def chat_with_ai(message, history, api_key, base_url, model, system_prompt):
    client = get_client(api_key, base_url)
    if client is None:
        return "⚠️ Please enter a valid API key in the sidebar."

    messages = [{"role": "system", "content": system_prompt}]
    for human, assistant in history:
        messages.append({"role": "user", "content": human})
        messages.append({"role": "assistant", "content": assistant})
    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.4,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"❌ Error: {str(e)}"

def process_code(code, action, api_key, base_url, model):
    if not code.strip():
        return "Please paste some code first."

    prompts = {
        "Fix": "Fix any bugs, errors, or issues in the following code. Return only the corrected code with brief comments explaining the changes.",
        "Improve": "Improve the following code for readability, performance, and best practices. Return the improved version with short comments.",
        "Explain": "Explain the following code step by step in clear language.",
        "Refactor": "Refactor the following code to make it cleaner and more maintainable. Return the refactored code.",
        "Add comments": "Add clear, helpful comments to the following code. Return the fully commented version."
    }

    system = "You are an expert software engineer and coding assistant."
    user_message = f"{prompts.get(action, 'Help with this code:')}\n\n```\n{code}\n```"

    return chat_with_ai(user_message, [], api_key, base_url, model, system)

# ---------- UI ----------
CUSTOM_CSS = """
.gradio-container { max-width: 1200px !important; }
footer { display: none !important; }
"""

with gr.Blocks(title="AI Problem Solver & Code Editor", theme=gr.themes.Soft(), css=CUSTOM_CSS) as demo:
    gr.Markdown("# 🤖 AI Problem Solver + Code Editor")
    gr.Markdown("Web-based AI that can solve problems and edit code. Hosted via Hugging Face Spaces + GitHub.")

    with gr.Row():
        with gr.Column(scale=1):
            gr.Markdown("### ⚙️ Settings")
            api_key = gr.Textbox(
                label="API Key",
                type="password",
                placeholder="sk-... or your provider key",
                info="Your key stays in the browser session"
            )
            base_url = gr.Textbox(
                label="Base URL (optional)",
                placeholder="https://api.openai.com/v1",
                value="https://api.openai.com/v1",
                info="Change for Grok, OpenRouter, Together, etc."
            )
            model = gr.Textbox(
                label="Model",
                value="gpt-4o-mini",
                info="Examples: gpt-4o, grok-beta, claude-3-5-sonnet, deepseek-coder..."
            )
            system_prompt = gr.Textbox(
                label="System Prompt",
                value="You are a highly capable AI that solves problems clearly and writes excellent code.",
                lines=3
            )

        with gr.Column(scale=3):
            with gr.Tab("💬 Chat / Problem Solving"):
                chatbot = gr.ChatInterface(
                    fn=lambda msg, hist: chat_with_ai(msg, hist, api_key.value, base_url.value, model.value, system_prompt.value),
                    examples=[
                        "Explain quantum entanglement simply",
                        "Write a Python function to detect cycles in a linked list",
                        "How do I optimize a slow SQL query?"
                    ]
                )

            with gr.Tab("💻 Code Editor"):
                code_input = gr.Code(
                    label="Your Code",
                    language="python",
                    lines=18,
                    value="# Paste your code here\n\ndef example():\n    print('Hello')"
                )
                with gr.Row():
                    btn_fix = gr.Button("🔧 Fix", variant="primary")
                    btn_improve = gr.Button("✨ Improve")
                    btn_explain = gr.Button("📖 Explain")
                    btn_refactor = gr.Button("🔄 Refactor")
                    btn_comments = gr.Button("💬 Add Comments")

                code_output = gr.Code(label="AI Result", language="python", lines=18)

                btn_fix.click(
                    fn=lambda c, k, u, m: process_code(c, "Fix", k, u, m),
                    inputs=[code_input, api_key, base_url, model],
                    outputs=code_output
                )
                btn_improve.click(
                    fn=lambda c, k, u, m: process_code(c, "Improve", k, u, m),
                    inputs=[code_input, api_key, base_url, model],
                    outputs=code_output
                )
                btn_explain.click(
                    fn=lambda c, k, u, m: process_code(c, "Explain", k, u, m),
                    inputs=[code_input, api_key, base_url, model],
                    outputs=code_output
                )
                btn_refactor.click(
                    fn=lambda c, k, u, m: process_code(c, "Refactor", k, u, m),
                    inputs=[code_input, api_key, base_url, model],
                    outputs=code_output
                )
                btn_comments.click(
                    fn=lambda c, k, u, m: process_code(c, "Add comments", k, u, m),
                    inputs=[code_input, api_key, base_url, model],
                    outputs=code_output
                )

    gr.Markdown("---\nMade for GitHub + Hugging Face Spaces • Add your own API key to start")

if __name__ == "__main__":
    demo.launch()
