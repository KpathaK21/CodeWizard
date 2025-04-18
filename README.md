# Dr.Debug - AI Debugging Assistant

Dr.Debug is an AI-powered debugging assistant that helps developers identify and fix issues in their code. It supports multiple modes (Code, Ask, Architect, Debug) and allows users to select different LLM models for responses.

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

## Setup

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm 6+
- OpenAI API key
- Anthropic API key (optional)

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Dr.Debug.git
   cd Dr.Debug
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example` and add your API keys:
   ```
   cp .env.example .env
   # Edit .env file to add your API keys
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

3. Build the frontend:
   ```
   npm run build
   ```

## Running the Application

1. Start the Flask backend server:
   ```
   python app.py
   ```

2. For development, you can run the frontend separately:
   ```
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:5000` (or `http://localhost:3000` if running the frontend separately in development mode)

## Usage

1. Select your preferred mode (Code, Ask, Architect, Debug)
2. Choose the LLM provider and model
3. Enter your code, error message, or question in the input field
4. Receive AI-generated responses with suggestions and solutions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.