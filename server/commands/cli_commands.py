import click
from flask.cli import with_appcontext
from ..models import db, User

@click.command('set-user-role')
@click.argument('email')
@click.argument('role')
@with_appcontext
def set_user_role(email, role):
    user = User.query.filter_by(email=email).first()
    if user:
        user.role = role
        db.session.commit()
        click.echo(f"User {email} role set to {role}")
    else:
        click.echo(f"User with email {email} not found")

def init_app(app):
    app.cli.add_command(set_user_role)