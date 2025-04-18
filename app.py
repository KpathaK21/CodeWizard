import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from llm.openai_llm import OpenAIModel
from llm.anthropic_llm import AnthropicModel
import json

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
# Enable CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})

# Load available models configuration
def load_models_config():
    try:
        with open('config/models.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Default configuration if file doesn't exist
        return {
            "openai": ["gpt-3.5-turbo", "gpt-4o", "gpt-4-turbo"],
            "anthropic": ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"]
        }

# System prompts for different modes
SYSTEM_PROMPTS = {
    "code": """You are CodeWizard in Code mode, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices.
    Given an error message, stack trace, or buggy code, explain the likely issue, possible causes, and suggest how to fix it.
    Provide clear, actionable solutions with code examples when appropriate.""",
    
    "ask": """You are CodeWizard in Ask mode, a knowledgeable technical assistant focused on answering questions and providing information about software development, technology, and related topics.
    Provide clear, accurate, and helpful responses to technical questions. Include code examples, explanations, and references when appropriate.""",
    
    "architect": """You are CodeWizard in Architect mode, an experienced technical leader who is inquisitive and an excellent planner.
    Help users design software architecture, plan projects, and make technical decisions. Consider scalability, maintainability, and best practices.
    Provide high-level guidance and ask clarifying questions to better understand requirements.""",
    
    "debug": """You are CodeWizard in Debug mode, an expert software debugger specializing in systematic problem diagnosis and resolution.
    Given an error message, stack trace, or buggy code, analyze the issue methodically. Explain the root cause, suggest debugging steps,
    and provide potential solutions. Be thorough in your analysis and clear in your explanations."""
}

def get_llm(provider, model_name, api_key=None):
    if provider == "openai":
        return OpenAIModel(model_name, api_key)
    elif provider == "anthropic":
        return AnthropicModel(model_name, api_key)
    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")

@app.route('/api/models', methods=['GET'])
def get_models():
    return jsonify(load_models_config())

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    
    # Extract data from request
    provider = data.get('provider', 'openai')
    model_name = data.get('model', 'gpt-4o')
    mode = data.get('mode', 'debug')
    messages = data.get('messages', [])
    api_key = data.get('apiKey')
    
    # Validate mode
    if mode not in SYSTEM_PROMPTS:
        return jsonify({"error": f"Invalid mode: {mode}"}), 400
    
    # Validate API key
    if not api_key:
        return jsonify({"error": "API key is required"}), 401
    
    try:
        # Get LLM instance with user-provided API key
        llm = get_llm(provider, model_name, api_key)
        
        # Prepare conversation with system prompt
        system_prompt = SYSTEM_PROMPTS[mode]
        
        # Generate response
        response = llm.generate(system_prompt, messages)
        
        return jsonify({"response": response})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Add a specific route for the root path
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Create config directory if it doesn't exist
    os.makedirs('config', exist_ok=True)
    
    # Create models.json if it doesn't exist
    if not os.path.exists('config/models.json'):
        with open('config/models.json', 'w') as f:
            json.dump({
                "openai": ["gpt-3.5-turbo", "gpt-4o", "gpt-4-turbo"],
                "anthropic": ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"]
            }, f, indent=2)
    
    # Bind to all interfaces (0.0.0.0) instead of just localhost
    # Use port 8000 instead of 5000 to avoid conflict with macOS AirPlay Receiver
    app.run(host='0.0.0.0', port=8000, debug=True)