---
title: AI Problem Solver & Code Editor
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
---

# AI Problem Solver + Code Editor

A web-based AI that can:
- Solve problems through chat
- Fix, improve, explain, and refactor code

## How to use
1. Duplicate this Space or clone the repo
2. Enter your API key in the sidebar (OpenAI, xAI/Grok, OpenRouter, Together, etc.)
3. Change the Base URL and Model name if needed
4. Start chatting or paste code

## Supported providers (examples)
| Provider     | Base URL                              | Example Model          |
|--------------|---------------------------------------|------------------------|
| OpenAI       | `https://api.openai.com/v1`           | `gpt-4o-mini`          |
| xAI (Grok)   | `https://api.x.ai/v1`                 | `grok-beta`            |
| OpenRouter   | `https://openrouter.ai/api/v1`        | `anthropic/claude-3.5-sonnet` |
| Together     | `https://api.together.xyz/v1`         | `meta-llama/Llama-3-70b` |

## Deploy your own
1. Create a new GitHub repository
2. Upload `app.py`, `requirements.txt`, and this `README.md`
3. Go to [Hugging Face Spaces](https://huggingface.co/spaces) → Create new Space
4. Choose Gradio → Connect the GitHub repo
5. Done! Your AI is live.
