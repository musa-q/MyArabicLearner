from .utils import Utils
from .quiz import QuizUtils
from .user import UserUtils
from .maintenance import MaintenanceUtils

utils = Utils()
quiz_utils = QuizUtils()
user_utils = UserUtils()
maintenance_utils = MaintenanceUtils()

__all__ = ['utils', 'quiz_utils', 'user_utils', 'maintenance_utils']