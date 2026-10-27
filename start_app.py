import subprocess
import sys
import time
import os
import signal

def run():
    print("=" * 60)
    print("  POCKETPILOT — AI PERSONAL FINANCE MANAGER")
    print("  Theme: Obsidian + Emerald Green (#050B09 / #10B981)")
    print("=" * 60)

    root_dir = os.path.dirname(os.path.abspath(__file__))

    # Initialize DB first
    print("[1/3] Initializing SQLite telemetry database...")
    init_code = "import sys; sys.path.append('backend'); import database, demo_seed; database.init_db(); conn = database.get_db_connection(); demo_seed.seed_demo_data(conn); conn.commit()"
    subprocess.run([sys.executable, "-c", init_code], cwd=root_dir, check=True)

    # Launch FastAPI backend
    print("[2/3] Launching FastAPI backend server on http://127.0.0.1:8000 ...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=os.path.join(root_dir, "backend"))

    # Give backend a moment to bind
    time.sleep(1.5)

    # Launch Vite frontend
    print("[3/3] Launching Vite development server on http://localhost:5173 ...")
    npm_binary = "npm.cmd" if os.name == "nt" else "npm"
    frontend_cmd = [npm_binary, "run", "dev"]
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=root_dir)

    print("\n" + "=" * 60)
    print("  🚀 POCKETPILOT IS RUNNING!")
    print("  -> Frontend UI:  http://localhost:5173")
    print("  -> Backend API:  http://127.0.0.1:8000/docs")
    print("  Press Ctrl+C to terminate both servers.")
    print("=" * 60 + "\n")

    def shutdown(sig, frame):
        print("\nShutting down PocketPilot servers...")
        try:
            frontend_proc.terminate()
            backend_proc.terminate()
        except Exception:
            pass
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("Backend terminated unexpectedly.")
                break
            if frontend_proc.poll() is not None:
                print("Frontend terminated unexpectedly.")
                break
    except KeyboardInterrupt:
        shutdown(None, None)

if __name__ == "__main__":
    run()
