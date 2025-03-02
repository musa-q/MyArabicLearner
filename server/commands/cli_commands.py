import click
from flask.cli import with_appcontext
from sqlalchemy import func, desc
from ..models import db, User, Feedback, VocabQuiz, VocabQuizQuestion, VerbConjugationQuiz, VerbConjugationQuizQuestion, UserActivity
from datetime import datetime, timedelta
from ..utils import quiz_utils
from .backup import register_backup_commands

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

@click.command('change-username')
@click.argument('identifier')
@click.argument('new_username')
@with_appcontext
def change_username(identifier, new_username):
    """Change a user's username by their email or current username"""
    existing_user = User.query.filter_by(username=new_username).first()
    if existing_user:
        click.echo(f"Username '{new_username}' is already taken.")
        return

    user = User.query.filter_by(email=identifier).first()
    if not user:
        user = User.query.filter_by(username=identifier).first()

    if not user:
        click.echo(f"No user found with identifier: {identifier}")

    old_username = user.username
    user.username = new_username
    try:
        db.session.commit()
        click.echo(f"Username changed successfully from '{old_username}' to '{new_username}'")
    except Exception as e:
        db.session.rollback()
        click.echo(f"Error changing username: {str(e)}")

@click.command('list-feedback')
@with_appcontext
def list_feedback():
    """List all feedback entries in the database"""
    feedback = Feedback.query.all()
    if not feedback:
        click.echo("No feedback found.")
        return

    click.echo("Feedback entries:")
    for f in feedback:
        click.echo(f"ID: {f.id}, Rating: {f.rating}")
        click.echo(f"Time: {f.timestamp}")
        click.echo(f"Message: {f.message}")
        click.echo("-" * 40)

@click.command('reset-points')
@with_appcontext
def reset_points():
    """Apply points to empty quiz entries"""
    verb_quizzes = VerbConjugationQuiz.query.all()
    for quiz in verb_quizzes:
        if quiz.quiz_finished:
            print(f'Quiz {quiz.id} is: {quiz.date_taken}')

            quiz.total_points = 0
            for question in quiz.questions:
                question.points = 0
            print(f'Quiz {quiz.id} points: {0}')

    vocab_quizzes = VocabQuiz.query.all()
    for quiz in vocab_quizzes:
        if quiz.quiz_finished:
            print(f'Quiz {quiz.id} is: {quiz.date_taken}')

            quiz.total_points = 0
            for question in quiz.questions:
                question.points = 0
            print(f'Quiz {quiz.id} points: {0}')

    db.session.commit()
    click.echo("Points applied to empty quiz entries.")

@click.command('apply-points')
@with_appcontext
def apply_points_to_empty_quiz():
    """Apply points to empty quiz entries"""
    verb_quizzes = VerbConjugationQuiz.query.all()
    for quiz in verb_quizzes:
        if quiz.total_points == 0 and quiz.quiz_finished:
            print(f'Quiz {quiz.id} is: {quiz.date_taken}')

            points = 0
            streak = 0

            for question in quiz.questions:
                if question.is_correct:
                    streak += 1
                else:
                    streak = 0
                question_points = quiz_utils.calculate_question_points(question.is_correct, streak)
                question.points = question_points

                points += question_points

            quiz.total_points = points
            print(f'Quiz {quiz.id} points: {points}')

    vocab_quizzes = VocabQuiz.query.all()
    for quiz in vocab_quizzes:
        if quiz.total_points == 0 and quiz.quiz_finished:
            print(f'Quiz {quiz.id} is: {quiz.date_taken}')

            points = 0
            streak = 0

            for question in quiz.questions:
                if question.is_correct:
                    streak += 1
                else:
                    streak = 0
                question_points = quiz_utils.calculate_question_points(question.is_correct, streak)
                question.points = question_points

                points += question_points

            quiz.total_points = points
            print(f'Quiz {quiz.id} points: {points}')

    db.session.commit()
    click.echo("Points applied to empty quiz entries.")

@click.command('apply-finished-quiz')
@with_appcontext
def apply_finished_quiz():
    """Apply finshed quiz to all quizzes"""
    verb_quizzes = VerbConjugationQuiz.query.all()
    for quiz in verb_quizzes:
        if not quiz.quiz_finished:
            all_answered = True
            for question in quiz.questions:
                if not question.is_answered:
                    all_answered = False
                    break

            if all_answered:
                quiz.quiz_finished = True
                print(f'Added finished quiz to Quiz {quiz.id}')

    vocab_quizzes = VocabQuiz.query.all()
    for quiz in vocab_quizzes:
        if not quiz.quiz_finished:
            all_answered = True
            for question in quiz.questions:
                if not question.is_answered:
                    all_answered = False
                    break

            if all_answered:
                quiz.quiz_finished = True
                print(f'Added finished quiz to Quiz {quiz.id}')
    db.session.commit()
    click.echo("Applied finished to all quizzes.")

@click.command('top-users')
@click.option('--days', default=30, help='Number of days to look back')
@with_appcontext
def list_top_users(days):
    """List top 10 users by activity and their last usage"""

    start_date = datetime.utcnow() - timedelta(days=days)

    top_users = db.session.query(
        User.username,
        User.email,
        func.count(UserActivity.id).label('activity_count'),
        func.max(UserActivity.created_at).label('last_activity')
    ).join(
        UserActivity, User.id == UserActivity.user_id
    ).filter(
        UserActivity.created_at >= start_date
    ).group_by(
        User.id,
        User.username,
        User.email
    ).order_by(
        desc('activity_count')
    ).limit(10).all()

    if not top_users:
        click.echo(f"No user activity found in the last {days} days.")
        return

    click.echo(f"\nTop 10 Most Active Users (Last {days} days):")
    click.echo("-" * 80)
    click.echo(f"{'Username':<20} {'Email':<30} {'Activities':<10} {'Last Activity'}")
    click.echo("-" * 80)

    for user in top_users:
        last_activity = user.last_activity.strftime("%Y-%m-%d %H:%M:%S")

        click.echo(
            f"{user.username:<20} {user.email:<30} {user.activity_count:<10} {last_activity}"
        )

    click.echo("-" * 80)

@click.command('user-activity-summary')
@click.argument('username')
@click.option('--days', default=7, help='Number of days to look back')
@with_appcontext
def user_activity_summary(username, days):
    """Show detailed activity summary for a specific user"""

    user = User.query.filter_by(username=username).first()
    if not user:
        click.echo(f"No user found with username: {username}")
        return

    start_date = datetime.utcnow() - timedelta(days=days)

    activities = db.session.query(
        UserActivity.action_type,
        func.count(UserActivity.id).label('count')
    ).filter(
        UserActivity.user_id == user.id,
        UserActivity.created_at >= start_date
    ).group_by(
        UserActivity.action_type
    ).order_by(
        desc('count')
    ).all()

    pages = db.session.query(
        UserActivity.page_visited,
        func.count(UserActivity.id).label('visits')
    ).filter(
        UserActivity.user_id == user.id,
        UserActivity.created_at >= start_date
    ).group_by(
        UserActivity.page_visited
    ).order_by(
        desc('visits')
    ).limit(5).all()

    click.echo(f"\nActivity Summary for {username} (Last {days} days)")
    click.echo("-" * 50)

    click.echo("\nActivity Breakdown:")
    for activity in activities:
        click.echo(f"{activity.action_type:<20}: {activity.count} times")

    click.echo("\nMost Visited Pages:")
    for page in pages:
        click.echo(f"{page.page_visited:<30}: {page.visits} visits")

def init_app(app):
    register_backup_commands(app)
    app.cli.add_command(list_users)
    app.cli.add_command(find_user)
    app.cli.add_command(delete_user)
    app.cli.add_command(set_user_role)
    app.cli.add_command(change_username)
    app.cli.add_command(list_feedback)
    app.cli.add_command(apply_points_to_empty_quiz)
    app.cli.add_command(apply_finished_quiz)
    app.cli.add_command(reset_points)
    app.cli.add_command(list_top_users)
    app.cli.add_command(user_activity_summary)