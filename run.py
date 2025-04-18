#!/usr/bin/env python3
"""
Dr.Debug Runner Script
This script helps to set up and run the Dr.Debug application.
"""

import os
import sys
import subprocess
import webbrowser
import time
from pathlib import Path
import platform

def check_dependencies():
    """Check if all required dependencies are installed."""
    print("🔍 Checking dependencies...")
    
    # Check Python version
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        print("❌ Python 3.8 or higher is required.")
        return False
    
    # Check if pip is installed
    try:
        subprocess.run([sys.executable, "-m", "pip", "--version"], check=True, capture_output=True)
    except subprocess.CalledProcessError:
        print("❌ pip is not installed. Please install pip.")
        return False
    
    # Check if Node.js is installed
    try:
        subprocess.run(["node", "--version"], check=True, capture_output=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Node.js is not installed. Please install Node.js.")
        return False
    
    # Check if npm is installed
    try:
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ npm is not installed. Please install npm.")
        return False
    
    print("✅ All dependencies are installed.")
    return True

def setup_environment():
    """Set up the environment for Dr.Debug."""
    print("🔧 Setting up environment...")
    
    # Create virtual environment if it doesn't exist
    if not Path("venv").exists():
        print("Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
    
    # Activate virtual environment and install requirements
    print("Installing Python dependencies...")
    if platform.system() == "Windows":
        pip_path = Path("venv") / "Scripts" / "pip"
    else:
        pip_path = Path("venv") / "bin" / "pip"
    
    subprocess.run([str(pip_path), "install", "-r", "requirements.txt"], check=True)
    
    # Install frontend dependencies if they don't exist
    if not Path("frontend/node_modules").exists():
        print("Installing frontend dependencies...")
        subprocess.run(["npm", "install"], cwd="frontend", check=True)
    
    # Build frontend if it doesn't exist
    if not Path("frontend/build").exists():
        print("Building frontend...")
        subprocess.run(["npm", "run", "build"], cwd="frontend", check=True)
    
    # Check if .env file exists, if not create from example
    if not Path(".env").exists() and Path(".env.example").exists():
        print("Creating .env file from .env.example...")
        with open(".env.example", "r") as example_file:
            example_content = example_file.read()
        
        with open(".env", "w") as env_file:
            env_file.write(example_content)
        
        print("⚠️ Please edit the .env file to add your API keys.")
    
    print("✅ Environment setup complete.")

def run_application():
    """Run the Dr.Debug application."""
    print("🚀 Starting Dr.Debug...")
    
    # Determine the Python executable to use
    if platform.system() == "Windows":
        python_path = str(Path("venv") / "Scripts" / "python")
    else:
        python_path = str(Path("venv") / "bin" / "python")
    
    # Start the Flask application with host set to 0.0.0.0
    flask_process = subprocess.Popen([python_path, "app.py"])
    
    # Wait for the server to start
    print("Waiting for server to start...")
    time.sleep(3)
    
    # Open the application in the default web browser
    print("Opening Dr.Debug in your browser...")
    webbrowser.open("http://localhost:8000")
    
    try:
        # Keep the application running until Ctrl+C is pressed
        print("\n🐛 Dr.Debug is now running!")
        print("Press Ctrl+C to stop the application.")
        flask_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Stopping Dr.Debug...")
        flask_process.terminate()
        flask_process.wait()
        print("✅ Dr.Debug stopped.")

def main():
    """Main function to run the Dr.Debug application."""
    print("\n🐛 Welcome to Dr.Debug!\n")
    
    if not check_dependencies():
        return
    
    setup_environment()
    run_application()

if __name__ == "__main__":
    main()