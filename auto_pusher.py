import time
import subprocess
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class GitAutoCommitter(FileSystemEventHandler):
    def __init__(self):
        # We need a cooldown timer because IDEs often trigger multiple save events at once
        self.last_trigger_time = 0
        self.cooldown_seconds = 5 

    def on_any_event(self, event):
        # Ignore directories, .git internal changes, and cache files
        if event.is_directory or '.git' in event.src_path or '__pycache__' in event.src_path:
            return

        filename = os.path.basename(event.src_path)
        
        # Ignore hidden system/temp files
        if filename.startswith('.'):
            return

        current_time = time.time()
        # Only trigger if the cooldown period has passed
        if current_time - self.last_trigger_time > self.cooldown_seconds:
            self.last_trigger_time = current_time
            print(f"\n[+] Workspace change detected (Triggered by: {filename})")
            self.commit_and_push()

    def commit_and_push(self):
        # Your specific repository URL
        repo_url = "https://github.com/Vaibhavsingh167/Custom-Media-Player.git"
        
        try:
            # 1. Stage ALL changes (new, modified, and deleted files)
            subprocess.run(['git', 'add', '.'], check=True, capture_output=True)
            
            # 2. Commit the changes
            timestamp = time.strftime("%I:%M:%S %p")
            commit_message = f"Auto-commit: Workspace updated at {timestamp}"
            
            # We run commit without check=True because git throws an error if there's nothing to commit
            commit_process = subprocess.run(['git', 'commit', '-m', commit_message], capture_output=True)
            
            # Check if git actually found changes to commit
            if commit_process.returncode != 0:
                output = commit_process.stdout.decode('utf-8')
                if "nothing to commit" in output or "working tree clean" in output:
                    print("[-] No actual content changes to commit. Skipping.")
                    return
                else:
                    # If it failed for another reason, print the error
                    print(f"[-] Git commit failed: {commit_process.stderr.decode('utf-8').strip()}")
                    return
            
            # 3. Push to the specific remote repository
            print(f"Pushing changes to {repo_url}...")
            # Pushes the current local branch (HEAD) to the remote repository
            subprocess.run(['git', 'push', repo_url, 'HEAD'], check=True, capture_output=True)
            
            print("Successfully pushed changes!")
            
        except subprocess.CalledProcessError as e:
            print(f"[-] Git push failed: {e.stderr.decode('utf-8').strip()}")

if __name__ == "__main__":
    # Monitor the current directory ('.')
    path = "." 
    print(f"Watching directory: {os.path.abspath(path)} for any changes...")
    print("Press Ctrl+C to stop.")
    
    event_handler = GitAutoCommitter()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    
    try:
        while True:
            # Keep the script running
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping auto-pusher...")
        observer.stop()
    
    observer.join()