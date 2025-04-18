# CodeWizard - AI Debugging Assistant

CodeWizard is an AI-powered debugging assistant that helps developers identify and fix issues in their code. It supports multiple modes (Code, Ask, Architect, Debug) and allows users to select different LLM models for responses.

## Features

- **Multiple Modes**:
  - **Code**: Focused on code-specific issues and solutions
  - **Ask**: General technical questions and information
  - **Architect**: System design and architectural guidance
  - **Debug**: Specialized debugging assistance

- **LLM Model Selection**: Choose between different models from:
  - OpenAI (GPT-3.5, GPT-4o, etc.)
  - Anthropic (Claude models)

- **Interactive Chat Interface**: User-friendly interface for submitting code and errors

- **User-Provided API Keys**: Users can provide their own API keys for OpenAI and Anthropic models, ensuring:
  - Better security (no shared API keys)
  - Individual usage quotas
  - Privacy (API keys are stored locally in the browser)

## Setup & Running

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm 6+
- OpenAI API key
- Anthropic API key (optional)

### One-Step Setup & Run

CodeWizard now features a single executable script that handles everything:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/CodeWizard.git
   cd CodeWizard
   ```

2. Make the script executable (if needed):
   ```
   chmod +x codewizard
   ```

3. Run the CodeWizard script:
   ```
   ./codewizard
   ```

The script will:
- Check for all required dependencies
- Set up a virtual environment if needed
- Install Python dependencies
- Install and build the frontend
- Create a `.env` file if needed
- Start the application
- Open your browser to http://localhost:5050

### For Developers

If you're developing or modifying CodeWizard:

1. You can run the frontend separately in development mode:
   ```
   cd frontend
   npm start
   ```
   This will be accessible at `http://localhost:3000`

2. You can manually start the backend:
   ```
   python app.py
   ```

## Usage

1. Select your preferred mode (Code, Ask, Architect, Debug)
2. Choose the LLM provider and model
3. Click the settings icon to enter your API keys:
   - For OpenAI models, enter your OpenAI API key
   - For Anthropic models, enter your Anthropic API key
   - API keys are stored securely in your browser's local storage
4. Enter your code, error message, or question in the input field
5. Receive AI-generated responses with suggestions and solutions

> **Note**: If you don't provide an API key, you'll be prompted to enter one when you try to send a message.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.