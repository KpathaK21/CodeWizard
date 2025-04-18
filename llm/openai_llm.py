# Dr.Debug/llm/openai_llm.py

from openai import OpenAI
import os

class OpenAIModel:
    def __init__(self, model_name):
        self.model_name = model_name
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("Please set the OPENAI_API_KEY environment variable.")
        
        self.client = OpenAI(api_key=self.api_key)
    
    def generate(self, system_prompt, messages):
        # Prepare messages for OpenAI format
        openai_messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history
        for message in messages:
            openai_messages.append({
                "role": message.get("role"),
                "content": message.get("content")
            })
        
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=openai_messages,
                temperature=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"⚠️ Error querying OpenAI API: {str(e)}"
