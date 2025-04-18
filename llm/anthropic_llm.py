# Dr.Debug/llm/anthropic_llm.py

import os
import anthropic

class AnthropicModel:
    def __init__(self, model_name, api_key=None):
        self.model_name = model_name
        
        # Use provided API key or fall back to environment variable
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("API key is required. Please provide an API key or set the ANTHROPIC_API_KEY environment variable.")
        
        self.client = anthropic.Anthropic(api_key=self.api_key)
    
    def generate(self, system_prompt, messages):
        # Convert messages to Anthropic format
        anthropic_messages = []
        
        for message in messages:
            role = message.get("role")
            content = message.get("content")
            
            if role == "user":
                anthropic_messages.append({"role": "user", "content": content})
            elif role == "assistant":
                anthropic_messages.append({"role": "assistant", "content": content})
        
        try:
            response = self.client.messages.create(
                model=self.model_name,
                system=system_prompt,
                messages=anthropic_messages,
                max_tokens=4000,
                temperature=0.3
            )
            return response.content[0].text
        except Exception as e:
            return f"⚠️ Error querying Anthropic API: {str(e)}"