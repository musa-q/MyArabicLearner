from .home import home_bp
from .testing import testing_bp
from .users import users_bp
from .quiz import quiz_bp
from .flashcards import flashcards_bp
from .dev import dev_bp
from .auth import auth_bp
from .feedback import feedback_bp
from .maintenance import maintenance_bp
from .visualisers import visualisers_bp

__all__ = ['home_bp', 'testing_bp', 'users_bp', 'quiz_bp', 'flashcards_bp', 'dev_bp', 'auth_bp', 'feedback_bp', 'maintenance_bp', 'visualisers_bp']