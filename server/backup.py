import schedule
import time
import threading
import os
from pathlib import Path
from datetime import datetime
from threading import Lock

scheduler_thread = None
mutex = Lock()
is_running = False

def schedule_backup():
    global scheduler_thread, is_running

    if is_running:
        return

    def perform_backup():
        with mutex:
            try:
                server_dir = Path(__file__).parent.absolute()
                backup_dir = server_dir / 'backups'

                backup_dir.mkdir(exist_ok=True)

                db_path = server_dir / 'app.db'

                if not db_path.exists():
                    print("Database file not found!")
                    return

                existing_backups = list(backup_dir.glob('backup_*.db'))

                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                backup_path = backup_dir / f'backup_{timestamp}.db'

                import shutil
                shutil.copy2(db_path, backup_path)
                print(f"Database backed up to: {backup_path}")

                for old_backup in existing_backups:
                    try:
                        old_backup.unlink()
                        print(f"Removed old backup: {old_backup}")
                    except Exception as e:
                        print(f"Failed to remove old backup {old_backup}: {e}")

            except Exception as e:
                print(f"Backup error: {str(e)}")

    def run_scheduler():
        while is_running:
            next_run = schedule.next_run()
            if next_run:
                now = datetime.now()
                sleep_seconds = (next_run - now).total_seconds()

                if sleep_seconds > 0:
                    hours = sleep_seconds // 3600
                    minutes = (sleep_seconds % 3600) // 60
                    print(f"Sleeping for {int(hours)}h {int(minutes)}m until next backup")
                    time.sleep(sleep_seconds)

            schedule.run_pending()
            time.sleep(1)

    with mutex:
        if not is_running:
            is_running = True
            schedule.clear()

            schedule.every().day.at("01:00").do(perform_backup)
            print("Backup scheduled for 01:00 daily")

            scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
            scheduler_thread.start()
            print("Backup scheduler started")