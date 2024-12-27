import click
import shutil
import os
from datetime import datetime
from flask.cli import with_appcontext
from flask import current_app

def register_backup_commands(app):
    @app.cli.group()
    def db():
        """Database commands."""
        pass

    @db.command()
    @with_appcontext
    def backup():
        """Backup the database."""
        backup_dir = './backups'
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)

        db_path = current_app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = os.path.join(backup_dir, f'backup_{timestamp}.db')

        shutil.copy2(db_path, backup_path)
        click.echo(f'Database backed up to: {backup_path}')