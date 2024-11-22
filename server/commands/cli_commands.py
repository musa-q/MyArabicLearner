import click
from flask.cli import with_appcontext
from ..models import db, User

@click.command('list-users')
@with_appcontext
def list_users():
    """List all users in the database"""
    users = User.query.all()
    if not users:
        click.echo("No users found.")
        return

    click.echo("Users in the database:")
    for user in users:
        click.echo(f"ID: {user.id}, Username: {user.username}, Email: {user.email}, Role: {user.role}, Last Login: {user.last_login}")

@click.command('find-user')
@click.argument('identifier')
@with_appcontext
def find_user(identifier):
    """Find a user by username or email"""
    user = User.query.filter_by(email=identifier).first()

    if not user:
        user = User.query.filter_by(username=identifier).first()

    if user:
        click.echo("User found:")
        click.echo(f"ID: {user.id}")
        click.echo(f"Username: {user.username}")
        click.echo(f"Email: {user.email}")
        click.echo(f"Role: {user.role}")
        click.echo(f"Last Login: {user.last_login}")
        click.echo(f"Auth Token Valid: {user.is_token_valid()}")
    else:
        click.echo(f"No user found with identifier: {identifier}")

@click.command('delete-user')
@click.argument('identifier')
@click.confirmation_option(prompt='Are you sure you want to delete this user?')
@with_appcontext
def delete_user(identifier):
    """Delete a user by username or email"""
    user = User.query.filter_by(email=identifier).first()

    if not user:
        user = User.query.filter_by(username=identifier).first()

    if user:
        db.session.delete(user)
        db.session.commit()
        click.echo(f"User {identifier} has been deleted.")
    else:
        click.echo(f"No user found with identifier: {identifier}")

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
    """Initialize user CLI commands"""
    app.cli.add_command(list_users)
    app.cli.add_command(find_user)
    app.cli.add_command(delete_user)
    app.cli.add_command(set_user_role)