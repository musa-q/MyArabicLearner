from flask import request, abort, current_app

def check_ip():
    pass
    # allowed_ips = current_app.config.get('ALLOWED_IPS', [])
    # if allowed_ips and request.remote_addr not in allowed_ips:
    #     abort(403)

def restrict_to_ips():
    pass
    # def decorator(f):
    #     @wraps(f)
    #     def wrapped(*args, **kwargs):
    #         check_ip()
    #         return f(*args, **kwargs)
    #     return wrapped
    # return decorator