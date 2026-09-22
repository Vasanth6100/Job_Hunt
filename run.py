import os
import sys
import subprocess

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    
    # Check for venv python
    venv_python = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
    if not os.path.exists(venv_python):
        venv_python = sys.executable

    print("=" * 60)
    print("  JobHunt Agent – Unified Frontend & Backend")
    print("  Link: http://localhost:8000")
    print("=" * 60)
    
    cmd = [
        venv_python,
        "-m", "uvicorn",
        "main:app",
        "--host", "127.0.0.1",
        "--port", "8000",
        "--reload"
    ]
    
    subprocess.run(cmd, cwd=backend_dir)

if __name__ == "__main__":
    main()
